import React from 'react';
import { ExternalLink, Flame, Star, GitBranch, ArrowUp } from 'lucide-react';
import ToolIcon from './ToolIcon';

const pricingConfig = {
  free: {
    label: 'FREE',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  freemium: {
    label: 'FREEMIUM',
    className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  paid: {
    label: 'PAID',
    className: 'bg-zinc-700/30 text-zinc-300 border-white/10',
  },
};

export default function ToolCard({
  tool,
  onClick,
  voteCount = 0,
  hasVoted = false,
  onUpvote,
  isBookmarked = false,
  onToggleBookmark,
}) {
  const pricing = pricingConfig[tool.pricing] || pricingConfig.freemium;

  return (
    <div
      onClick={() => onClick(tool)}
      className={`tool-card rounded-2xl p-5 flex flex-col justify-between h-full cursor-pointer group transition-all duration-200 border ${
        tool.featured
          ? 'border-amber-500/30 bg-[#10131c]'
          : 'border-white/[0.07] bg-[#0e1118]'
      }`}
    >
      <div>
        {/* Card Header: Icon, Name, Category, Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <ToolIcon tool={tool} size="md" />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors tracking-tight">
                  {tool.name}
                </h3>
                {tool.isCustom && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono text-purple-300">
                    User
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-0.5">
                <span>{tool.category}</span>
              </div>
            </div>
          </div>

          {/* Badges: Pricing & Open Source */}
          <div className="flex items-center gap-1.5 shrink-0">
            {tool.openSource && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium">
                OSS
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${pricing.className}`}
            >
              {pricing.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-4">
          {tool.desc}
        </p>
      </div>

      {/* Card Action Row */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs mt-auto">
        {/* Left: Upvote + Bookmark */}
        <div className="flex items-center gap-1.5">
          {/* Upvote Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(tool.name, e);
            }}
            title={hasVoted ? 'Remove upvote' : 'Upvote tool'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-150 border text-xs ${
              hasVoted
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-medium'
                : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07] border-white/[0.06]'
            }`}
          >
            <ArrowUp
              size={13}
              className={hasVoted ? 'text-rose-400 stroke-[2.5]' : 'text-zinc-400'}
            />
            <span className="font-mono text-xs tabular-nums font-medium">{voteCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(tool.name, e);
            }}
            title={isBookmarked ? 'Remove from Saved' : 'Save tool'}
            className={`p-1.5 rounded-lg transition-all duration-150 border ${
              isBookmarked
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                : 'bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.07] border-white/[0.06]'
            }`}
          >
            <Star
              size={13}
              className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''}
            />
          </button>
        </div>

        {/* Right: Visit Link */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-white/5 font-medium text-xs"
        >
          <span>Visit</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
