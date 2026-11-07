import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { useDialog } from '../lib/useDialog';

const REPO_ISSUES = 'https://github.com/MKJaswanth/LetsVibeCode.v.2/issues/new';

const fieldClass =
  'h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm text-fg placeholder:text-neutral-600 transition-colors hover:border-line-strong focus:border-white/30 focus:outline-none aria-[invalid=true]:border-rose-400/60';

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.hostname.includes('.') ? url.toString() : null;
  } catch {
    return null;
  }
}

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-fg">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-rose-300">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[13px] text-subtle">{hint}</p>
      )}
    </div>
  );
}

export default function SubmitModal({ categories, existingNames, onClose, onSubmitTool }) {
  const nameRef = useRef(null);
  const containerRef = useDialog(onClose, { initialFocusRef: nameRef });
  const [form, setForm] = useState({ name: '', url: '', category: categories[0] || '', pricing: 'free', desc: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};
    const name = form.name.trim();
    const url = normalizeUrl(form.url);

    if (!name) next.name = 'Enter the tool’s name.';
    else if (existingNames.has(name.toLowerCase())) next.name = `${name} is already in the list.`;
    if (!url) next.url = 'Enter a website address, like example.com.';
    if (!form.desc.trim()) next.desc = 'Add one sentence about what it does.';

    setErrors(next);
    if (Object.keys(next).length) {
      containerRef.current?.querySelector(`#submit-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    const tool = {
      name,
      url,
      category: form.category,
      pricing: form.pricing,
      desc: form.desc.trim(),
      isCustom: true,
      openSource: false,
    };
    onSubmitTool(tool);
    setSubmitted(tool);
  };

  const issueUrl = submitted
    ? `${REPO_ISSUES}?${new URLSearchParams({
        title: `Add tool: ${submitted.name}`,
        body: `**Name:** ${submitted.name}\n**URL:** ${submitted.url}\n**Category:** ${submitted.category}\n**Pricing:** ${submitted.pricing}\n\n${submitted.desc}`,
      })}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <motion.div
        ref={containerRef}
        data-dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line-strong bg-surface shadow-2xl shadow-black sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
          <div>
            <h2 id="submit-title" className="text-lg font-semibold tracking-tight text-fg">
              {submitted ? `${submitted.name} is in your list` : 'Add a tool'}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {submitted
                ? 'It’s saved in this browser. To add it for everyone, send it to us on GitHub.'
                : 'It’s saved in this browser, so only you will see it.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-md p-2 text-subtle transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col gap-2 px-6 pb-6 pt-4 sm:flex-row-reverse">
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-white"
            >
              Suggest on GitHub <ArrowUpRight size={15} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-line px-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Check size={15} /> Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 pb-6 pt-4">
            <Field id="submit-name" label="Name" error={errors.name}>
              <input
                ref={nameRef}
                id="submit-name"
                value={form.name}
                onChange={update('name')}
                placeholder="Supabase"
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'submit-name-error' : undefined}
                className={fieldClass}
              />
            </Field>

            <Field id="submit-url" label="Website" error={errors.url}>
              <input
                id="submit-url"
                type="url"
                inputMode="url"
                value={form.url}
                onChange={update('url')}
                placeholder="supabase.com"
                autoComplete="off"
                aria-invalid={Boolean(errors.url)}
                aria-describedby={errors.url ? 'submit-url-error' : undefined}
                className={fieldClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="submit-category" label="Category">
                <select id="submit-category" value={form.category} onChange={update('category')} className={fieldClass}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <fieldset>
                <legend className="mb-1.5 block text-sm text-fg">Pricing</legend>
                <div className="grid h-10 grid-cols-3 gap-1 rounded-lg border border-line bg-bg p-1">
                  {['free', 'freemium', 'paid'].map((tier) => (
                    <label
                      key={tier}
                      className={`flex cursor-pointer items-center justify-center rounded-md text-[13px] capitalize transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white/70 ${
                        form.pricing === tier ? 'bg-raised text-fg ring-1 ring-line-strong' : 'text-subtle hover:text-fg'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pricing"
                        value={tier}
                        checked={form.pricing === tier}
                        onChange={update('pricing')}
                        className="sr-only"
                      />
                      {tier}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <Field id="submit-desc" label="What it does" error={errors.desc} hint="One sentence is enough.">
              <textarea
                id="submit-desc"
                rows={3}
                value={form.desc}
                onChange={update('desc')}
                placeholder="Postgres, auth and storage with a free tier."
                aria-invalid={Boolean(errors.desc)}
                aria-describedby={errors.desc ? 'submit-desc-error' : undefined}
                className={`${fieldClass} h-auto resize-none py-2.5 leading-relaxed`}
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg px-4 text-sm text-muted transition-colors hover:text-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-white"
              >
                Add tool
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
