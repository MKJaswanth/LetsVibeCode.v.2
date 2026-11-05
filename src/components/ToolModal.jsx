import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Flame, Star, Check, Copy, Sparkles, ShieldCheck } from 'lucide-react';
import ToolIcon from './ToolIcon';

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
        className="relative w-full max-w-2xl bg-[#111116] border border-white/[0.12] rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh] z-10"
      >
        {/* Header */}
        <div className="p-7 pb-5 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-start gap-3">
            <ToolIcon tool={tool} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-2xl font-bold text-white tracking-tight">{tool.name}</h2>
              {tool.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono">
                  <ShieldCheck size={12} /> Featured
                </span>
              )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                <span>{tool.category}</span>
                <span>•</span>
                <span className="uppercase text-cyan-400 font-semibold">{tool.pricing}</span>
                {tool.openSource && <span className="text-emerald-400">• open source</span>}
              </div>
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
        <div className="p-7 overflow-y-auto flex flex-col gap-5 text-sm">
          {/* Editorial facts */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500 mb-2">What it does</div>
            <p className="text-zinc-200 leading-relaxed">{tool.desc}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="fact-cell">
              <span>Pricing</span>
              <strong className="capitalize">{tool.pricing}</strong>
            </div>
            <div className="fact-cell">
              <span>Format</span>
              <strong>{tool.surface || 'Provider site'}</strong>
            </div>
            <div className="fact-cell">
              <span>Runs on</span>
              <strong>{tool.execution || (tool.openSource ? 'Local / self-hosted' : 'Varies')}</strong>
            </div>
            <div className="fact-cell">
              <span>License</span>
              <strong>{tool.openSource ? 'Open source' : 'Proprietary'}</strong>
            </div>
          </div>

          {/* Best-for note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-cyan-500/[0.03] border border-cyan-500/15">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={13} /> Best for
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{tool.bestFor || tool.desc}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/[0.03] border border-amber-500/15">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Access note</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {tool.pricing === 'free'
                  ? 'Available without a paid plan. Check the provider for optional usage limits.'
                  : tool.pricing === 'freemium'
                  ? 'A free entry point is available; paid limits vary by provider.'
                  : 'Paid access is required for regular use.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/[0.08] bg-[#0c0c11] flex flex-wrap items-center justify-between gap-3">
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
