import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Link2, Sparkles } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { roles } from '../data/roles';

const pricingStyles = {
  free: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
  freemium: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  paid: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
};

export default function RolePlaybook({ roleId, tools, onSelectTool }) {
  const [copyState, setCopyState] = useState('idle');

  if (!roleId || roleId === 'all') return null;

  const role = roles.find((item) => item.id === roleId);
  if (!role) return null;

  const starterTools = role.starterTools
    .map((name) => tools.find((tool) => tool.name === name))
    .filter(Boolean);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('role', roleId);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url.toString());
      } else {
        const input = document.createElement('textarea');
        input.value = url.toString();
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 2200);
    }
  };

  return (
    <motion.section
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-12"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="role-playbook rounded-[1.75rem] overflow-hidden">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles size={13} /> {role.eyebrow}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.08em] text-zinc-400 transition-colors hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-200"
                title="Copy a link to this role view"
              >
                {copyState === 'copied' ? <Check size={12} /> : <Link2 size={12} />}
                {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Try again' : 'Copy link'}
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-white leading-tight mb-3">
              {role.headline}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md mb-7">{role.description}</p>

            <div className="flex flex-wrap gap-2">
              {role.workflow.map((step, index) => (
                <div key={step} className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-zinc-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] font-mono text-cyan-300">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white/[0.018]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-zinc-200">Start with this stack</p>
                <p className="text-[11px] text-zinc-500 mt-1">Four practical picks for your first session.</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">free to start</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {starterTools.map((tool) => (
                <button
                  type="button"
                  key={tool.name}
                  onClick={() => onSelectTool(tool)}
                  className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-3 text-left transition-all hover:bg-white/[0.06] hover:border-cyan-300/25"
                >
                  <ToolIcon tool={tool} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-xs font-semibold text-zinc-100 group-hover:text-cyan-200">{tool.name}</span>
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-mono uppercase ${pricingStyles[tool.pricing]}`}>
                        {tool.pricing}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-zinc-500">{tool.desc}</span>
                  </span>
                  <ArrowRight size={14} className="shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-emerald-300/80">
              <Check size={13} /> Every pick has a free or open-source entry point.
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
