import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Flame, Star, Check, Copy, Sparkles, ShieldCheck } from 'lucide-react';

export default function ToolModal({
  tool,
  onClose,
  voteCount = 0,
  hasVoted = false,
  onUpvote,
  isBookmarked = false,
  onToggleBookmark,
}) {
  const [copied, setCopied] = useState(false);

  // Lock background body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(tool.url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Clipboard copy failed:', err);
        });
    }
  };

  // Deterministic Vibe Score
  const getScore = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return 88 + (Math.abs(hash) % 12);
  };
  const score = getScore(tool.name);

  // Modern developer pros & cons
  const analysis = {
    pros: [
      `Optimized for ${tool.category} workflows with immediate feedback.`,
      "Streamlined developer experience and minimal configuration.",
      tool.pricing === 'free' ? "100% free with no credit card required." : "Generous freemium tier available for testing.",
    ],
    cons: [
      tool.pricing === 'paid' ? "Requires paid subscription for team collaboration." : "Daily usage or token limits on free tier.",
      "May require API key for high-volume automation.",
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-xl bg-[#111116] border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh] z-10"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-2xl font-bold text-white tracking-tight">{tool.name}</h2>
              {(tool.popular || tool.featured) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono">
                  <ShieldCheck size={12} /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{tool.category}</span>
              <span>•</span>
              <span className="uppercase text-cyan-400 font-semibold">{tool.pricing}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-sm">
          {/* Description Card */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 leading-relaxed">
            {tool.desc}
          </div>

          {/* Vibe Score Gauge */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" /> VIBE SCORE ANALYSIS
              </span>
              <span className="font-mono text-sm font-bold text-cyan-400">{score}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 rounded-full"
              />
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/15">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Key Strengths
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs text-zinc-300">
                {analysis.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/[0.03] border border-amber-500/15">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                Considerations
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs text-zinc-300">
                {analysis.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/[0.08] bg-[#0c0c11] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Upvote in modal */}
            <button
              type="button"
              onClick={(e) => onUpvote(tool.name, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                hasVoted
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white border-white/[0.08]'
              }`}
            >
              <Flame size={14} className={hasVoted ? 'fill-rose-400 text-rose-400' : ''} />
              <span>{voteCount}</span>
            </button>

            {/* Bookmark in modal */}
            <button
              type="button"
              onClick={(e) => onToggleBookmark(tool.name, e)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isBookmarked
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border-white/[0.08]'
              }`}
              title={isBookmarked ? 'Saved' : 'Save tool'}
            >
              <Star size={14} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
            </button>

            {/* Copy URL */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
          >
            <span>Launch Tool</span>
            <ExternalLink size={13} strokeWidth={2.2} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
