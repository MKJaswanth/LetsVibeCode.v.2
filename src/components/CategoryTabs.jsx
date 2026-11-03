import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryTabs({
  categories = [],
  activeCategory = 'ALL',
  setActiveCategory,
  categoryCounts = {},
  totalCount = 0,
}) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 mb-8">
      <div className="flex items-center gap-2 min-w-max px-2 md:justify-center">
        {/* All Systems Pill */}
        <button
          type="button"
          onClick={() => setActiveCategory('ALL')}
          className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 select-none ${
            activeCategory === 'ALL'
              ? 'text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
        >
          {activeCategory === 'ALL' && (
            <motion.div
              layoutId="activeCategoryIndicator"
              className="absolute inset-0 bg-white/[0.08] border border-white/20 rounded-xl shadow-inner"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative z-10">All Tools</span>
          <span
            className={`relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
              activeCategory === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/5 text-zinc-500'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Individual Category Pills */}
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const count = categoryCounts[category] || 0;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 select-none ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 bg-white/[0.08] border border-white/20 rounded-xl shadow-inner"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{category}</span>
              <span
                className={`relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/5 text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
