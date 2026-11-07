import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import FilterPanel from './FilterPanel';
import { useDialog } from '../lib/useDialog';

export default function MobileFilters({ onClose, resultCount, sortBy, setSortBy, onClearAll, ...panelProps }) {
  const containerRef = useDialog(onClose);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <motion.div
        ref={containerRef}
        data-dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl border-t border-line-strong bg-surface"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 id="filters-title" className="text-[15px] font-medium text-fg">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-2 rounded-md p-2 text-subtle hover:bg-white/[0.06] hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-2 py-5">
          <div>
            <h3 className="mb-2 px-2 text-xs font-medium text-subtle">Sort</h3>
            <div className="mx-2 grid grid-cols-2 gap-1 rounded-lg border border-line bg-bg p-1">
              {[
                ['free-first', 'Free first'],
                ['alpha', 'A to Z'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={sortBy === id}
                  onClick={() => setSortBy(id)}
                  className={`h-8 rounded-md text-sm transition-colors ${
                    sortBy === id ? 'bg-raised text-fg ring-1 ring-line-strong' : 'text-subtle'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <FilterPanel {...panelProps} />
        </div>

        <div className="flex shrink-0 gap-2 border-t border-line p-4">
          <button
            type="button"
            onClick={onClearAll}
            className="h-11 flex-1 rounded-lg border border-line text-sm text-muted hover:text-fg"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-[2] rounded-lg bg-fg text-sm font-medium text-bg"
          >
            Show {resultCount} {resultCount === 1 ? 'tool' : 'tools'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
