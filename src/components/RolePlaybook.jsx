import React, { useState } from 'react';
import { ArrowRight, Check, Link2, Sparkles, ExternalLink } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { roles } from '../data/roles';

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
    }
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-10">
      <div className="role-playbook rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Overview & Workflow */}
          <div className="p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-medium">
                <Sparkles size={12} /> {role.eyebrow}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors"
                title="Copy share link for this playbook"
              >
                {copyState === 'copied' ? <Check size={12} className="text-emerald-400" /> : <Link2 size={12} />}
                <span>{copyState === 'copied' ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-2">
              {role.headline}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {role.description}
            </p>

            {/* Workflow Sequence */}
            <div>
              <div className="text-[11px] font-mono uppercase text-zinc-500 mb-2">Recommended Sequence</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {role.workflow.map((step, index) => (
                  <div
                    key={step}
                    className="p-2.5 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between"
                  >
                    <span className="w-5 h-5 rounded-md bg-sky-500/15 text-sky-400 font-mono text-[11px] font-semibold flex items-center justify-center mb-2">
                      {index + 1}
                    </span>
                    <span className="text-xs text-zinc-200 font-medium leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Starter Stack Picks */}
          <div className="p-6 sm:p-7 bg-white/[0.015] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-200">Recommended Starter Kit</span>
                <span className="text-[11px] font-mono text-emerald-400">Zero cost to begin</span>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Tested combinations for high productivity in this role:
              </p>

              <div className="space-y-2">
                {starterTools.map((tool) => (
                  <div
                    key={tool.name}
                    onClick={() => onSelectTool(tool)}
                    className="p-2.5 rounded-xl bg-[#11141e] border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#161b28] cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <ToolIcon tool={tool} size="sm" />
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {tool.name}
                          {tool.openSource && (
                            <span className="text-[10px] font-mono text-emerald-400/90 font-normal">OSS</span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 line-clamp-1">{tool.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-0.5 rounded bg-black/30 border border-white/[0.05]">
                      {tool.pricing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
