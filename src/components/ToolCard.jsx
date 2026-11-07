import React from 'react';
import { ArrowUpRight, Bookmark } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { PRICING_LABELS, hostnameOf } from '../lib/catalog';

export function PricingTag({ pricing, openSource }) {
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <span className={`inline-flex items-center gap-1.5 ${pricing === 'free' ? 'text-emerald-400' : 'text-muted'}`}>
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            pricing === 'free' ? 'bg-emerald-400' : pricing === 'freemium' ? 'bg-amber-300/80' : 'bg-neutral-500'
          }`}
        />
        {PRICING_LABELS[pricing] || 'Freemium'}
      </span>
      {openSource && <span className="text-muted">Open source</span>}
    </div>
  );
}

export default function ToolCard({ tool, onOpen, isSaved, onToggleSave, showCategory = true }) {
  // Always show a second line so cards in a row line up; fall back to the website's domain.
  const meta =
    [showCategory ? tool.category : null, tool.surface].filter(Boolean).join(' · ') || hostnameOf(tool.url);

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors duration-150 hover:border-line-strong hover:bg-raised">
      <div className="flex items-start gap-3.5">
        <ToolIcon tool={tool} />
        <div className="min-w-0 flex-1 pr-14">
          <h3 className="truncate text-[15px] font-medium text-fg">
            <button
              type="button"
              onClick={() => onOpen(tool)}
              className="text-left after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-white/70"
            >
              {tool.name}
            </button>
          </h3>
          <p className="mt-0.5 truncate text-[13px] text-subtle">{tool.isCustom ? 'Added by you' : meta}</p>
        </div>
      </div>

      <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onToggleSave(tool.name)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${tool.name} from saved` : `Save ${tool.name}`}
          className={`rounded-md p-2 transition-colors hover:bg-white/[0.06] ${
            isSaved ? 'text-fg' : 'text-subtle hover:text-fg'
          }`}
        >
          <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
        </button>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${tool.name} website`}
          className="rounded-md p-2 text-subtle transition-colors hover:bg-white/[0.06] hover:text-fg"
        >
          <ArrowUpRight size={16} />
        </a>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{tool.desc}</p>

      <div className="mt-auto pt-4">
        <PricingTag pricing={tool.pricing} openSource={tool.openSource} />
      </div>
    </article>
  );
}
