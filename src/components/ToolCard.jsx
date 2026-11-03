import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Flame, Star, CheckCircle2 } from 'lucide-react';

const pricingStyles = {
  free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  freemium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  paid: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const categoryGradients = {
  'Top Tier Coding': 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
  'Intelligence Engines': 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400',
  'Visual Synthesis': 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400',
  'Video & Audio': 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400',
  'Productivity': 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  'Frontend & UI': 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
  'Backend & Deploy': 'from-blue-500/20 to-sky-500/20 border-blue-500/30 text-blue-400',
  'Research & Academic': 'from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-400',
  'Tool Collections': 'from-zinc-500/20 to-neutral-500/20 border-zinc-500/30 text-zinc-400',
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
  const isVerified = tool.popular || tool.featured;
  const gradientClass =
    categoryGradients[tool.category] || 'from-zinc-500/20 to-neutral-500/20 border-zinc-500/30 text-zinc-400';

  const initial = tool.name ? tool.name.charAt(0).toUpperCase() : '?';

  return (
    <motion.div
      onClick={() => onClick(tool)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`glass-card rounded-2xl p-5 flex flex-col justify-between h-full cursor-pointer relative group overflow-hidden ${
        tool.featured ? 'border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.08)]' : ''
      }`}
    >
      {/* Featured Accent Stripe */}
      {tool.featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
      )}

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Tool Icon Avatar */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} border flex items-center justify-center font-bold font-mono text-sm shadow-inner shrink-0`}
            >
              {initial}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-base text-zinc-100 group-hover:text-cyan-300 transition-colors tracking-tight">
                  {tool.name}
                </h3>
                {isVerified && (
                  <span title="Verified AI Tool" className="text-cyan-400">
                    <CheckCircle2 size={14} className="fill-cyan-400/20" />
                  </span>
                )}
                {tool.isCustom && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono text-purple-300">
                    Custom
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-zinc-500">{tool.category}</span>
            </div>
          </div>

          {/* Pricing Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border uppercase tracking-wider ${
              pricingStyles[tool.pricing] || pricingStyles.freemium
            }`}
          >
            {tool.pricing}
          </span>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
          {tool.desc}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs mt-auto">
        {/* Left: Upvote & Bookmark Buttons */}
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(tool.name, e);
            }}
            title={hasVoted ? 'Remove upvote' : 'Upvote tool'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all duration-200 border ${
              hasVoted
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07] border-white/[0.06]'
            }`}
          >
            <motion.div animate={hasVoted ? { scale: [1, 1.35, 1] } : {}}>
              <Flame size={13} className={hasVoted ? 'fill-rose-400 text-rose-400' : ''} />
            </motion.div>
            <span className="font-mono text-xs font-semibold tabular-nums">{voteCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(tool.name, e);
            }}
            title={isBookmarked ? 'Remove from Saved' : 'Save tool'}
            className={`p-1.5 rounded-lg transition-all duration-200 border ${
              isBookmarked
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                : 'bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.07] border-white/[0.06]'
            }`}
          >
            <Star size={13} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
          </button>
        </div>

        {/* Right: Direct Visit External Link */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-zinc-400 hover:text-cyan-300 transition-colors py-1 px-2 rounded-md hover:bg-white/5 font-medium"
        >
          <span>Visit</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}
