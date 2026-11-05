import React from 'react';

export default function CategoryTabs({
  categories = [],
  activeCategory = 'ALL',
  setActiveCategory,
  categoryCounts = {},
  totalCount = 0,
}) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 min-w-max px-1">
        {/* All Categories Button */}
        <button
          type="button"
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 select-none ${
            activeCategory === 'ALL'
              ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
              : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent'
          }`}
        >
          <span>All Categories</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
              activeCategory === 'ALL'
                ? 'bg-sky-500/20 text-sky-200'
                : 'bg-white/5 text-zinc-500'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Category Pills */}
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const count = categoryCounts[category] || 0;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 select-none ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                  : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <span>{category}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-200'
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
