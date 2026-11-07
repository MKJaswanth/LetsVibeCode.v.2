import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bookmark, Check, ChevronRight, Link2, X } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { useDialog } from '../lib/useDialog';
import { useCopy } from '../lib/useCopy';
import { PRICING_LABELS, hostnameOf, similarTools, slugify, workflowsForTool } from '../lib/catalog';

const ACCESS_NOTES = {
  free: 'You can use it without paying. Some providers set usage limits.',
  freemium: 'There is a free plan. Heavier use needs a paid plan.',
  paid: 'You need a paid plan for regular use.',
};

function Row({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-sm text-subtle">{label}</dt>
      <dd className="text-right text-sm text-fg">{children}</dd>
    </div>
  );
}

export default function ToolPanel({ tool, tools, isSaved, onToggleSave, onClose, onOpenTool, onSelectWorkflow }) {
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  const containerRef = useDialog(onClose, { initialFocusRef: closeRef });
  const [copyState, copy] = useCopy();

  // When the user moves to a similar tool, start reading from the top again.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [tool.name]);

  const similar = similarTools(tool, tools);
  const inWorkflows = workflowsForTool(tool.name);
  const host = hostnameOf(tool.url);

  const shareLink = () => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('tool', slugify(tool.name));
    copy(url.toString());
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <motion.aside
        ref={containerRef}
        data-dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-panel-title"
        tabIndex={-1}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-line bg-surface shadow-2xl shadow-black focus:outline-none"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <button
            type="button"
            onClick={shareLink}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            {copyState === 'copied' ? <Check size={14} className="text-emerald-400" /> : <Link2 size={14} />}
            {copyState === 'copied' ? 'Link copied' : 'Copy link'}
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-subtle transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 pb-8 pt-7">
            <ToolIcon tool={tool} size="lg" />
            <h2 id="tool-panel-title" className="mt-5 text-2xl font-semibold tracking-tight text-fg">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-subtle">
              {tool.isCustom ? 'Added by you' : tool.category}
              {host && <> · {host}</>}
            </p>

            <p className="mt-5 text-[15px] leading-relaxed text-muted">{tool.desc}</p>

            <div className="mt-6 flex gap-2">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-white"
              >
                Open {tool.name}
                <ArrowUpRight size={16} />
              </a>
              <button
                type="button"
                onClick={() => onToggleSave(tool.name)}
                aria-pressed={isSaved}
                className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm transition-colors ${
                  isSaved
                    ? 'border-line-strong bg-raised text-fg'
                    : 'border-line text-muted hover:border-line-strong hover:text-fg'
                }`}
              >
                <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>

            {tool.bestFor && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-fg">Best for</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{tool.bestFor}</p>
              </div>
            )}

            <dl className="mt-8 divide-y divide-line border-y border-line">
              <Row label="Pricing">{PRICING_LABELS[tool.pricing] || 'Freemium'}</Row>
              <Row label="License">{tool.openSource ? 'Open source' : 'Proprietary'}</Row>
              {tool.surface && <Row label="Platform">{tool.surface}</Row>}
              {tool.execution && <Row label="Runs">{tool.execution}</Row>}
            </dl>
            <p className="mt-3 text-[13px] leading-relaxed text-subtle">{ACCESS_NOTES[tool.pricing]}</p>

            {inWorkflows.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-fg">Used in</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {inWorkflows.map((workflow) => {
                    const step = workflow.steps.find((item) => item.tool === tool.name);
                    return (
                      <button
                        key={workflow.id}
                        type="button"
                        onClick={() => onSelectWorkflow(workflow.id)}
                        className="rounded-lg border border-line px-3 py-2 text-left transition-colors hover:border-line-strong hover:bg-raised"
                      >
                        <span className="block text-sm text-fg">{workflow.name}</span>
                        <span className="block text-[13px] text-subtle">{step?.use}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {similar.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-fg">Similar tools</h3>
                <ul className="mt-2 -mx-2">
                  {similar.map((other) => (
                    <li key={other.name}>
                      <button
                        type="button"
                        onClick={() => onOpenTool(other)}
                        className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                      >
                        <ToolIcon tool={other} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-fg">{other.name}</span>
                          <span className="block truncate text-[13px] text-subtle">{other.desc}</span>
                        </span>
                        <span className={`shrink-0 text-[13px] ${other.pricing === 'free' ? 'text-emerald-400' : 'text-subtle'}`}>
                          {PRICING_LABELS[other.pricing]}
                        </span>
                        <ChevronRight size={15} className="shrink-0 text-subtle" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
