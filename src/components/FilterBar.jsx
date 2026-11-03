import React from 'react';
import { Search, X, Flame, ArrowDownAZ, Star } from 'lucide-react';

export default function FilterBar({
  searchInputRef,
  searchTerm,
  setSearchTerm,
  pricingFilter,
  setPricingFilter,
  sortBy,
  setSortBy,
  showFavorites,
  setShowFavorites,
  favoriteCount = 0,
  totalResults = 0,
}) {
  const pricingOptions = [
    { id: 'all', label: 'All Pricing' },
    { id: 'free', label: 'Free', dot: 'bg-emerald-400' },
    { id: 'freemium', label: 'Freemium', dot: 'bg-amber-400' },
    { id: 'paid', label: 'Paid', dot: 'bg-rose-400' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-10">
      <div className="glass-surface rounded-2xl p-3 sm:p-4 border border-white/[0.08] shadow-2xl flex flex-col gap-3">
        {/* Top: Spotlight Search Bar */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 128+ AI tools by name, category, or workflow..."
            className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl pl-10 pr-24 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[11px] font-mono text-zinc-400">
              <span className="text-[10px]">/</span>
            </kbd>
          </div>
        </div>

        {/* Bottom Filter & Sorting Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/[0.05] text-xs">
          {/* Pricing Tier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {pricingOptions.map((opt) => {
              const isActive = pricingFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPricingFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap select-none ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-sm font-semibold'
                      : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sort & Favorites */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Favorites Toggle */}
            <button
              type="button"
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap select-none ${
                showFavorites
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)] font-semibold'
                  : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Star
                size={13}
                className={showFavorites ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}
              />
              <span>Saved</span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-zinc-300">
                {favoriteCount}
              </span>
            </button>

            {/* Sort Toggle */}
            <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setSortBy('trending')}
                title="Sort by Popularity / Upvotes"
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  sortBy === 'trending'
                    ? 'bg-white/15 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Flame size={13} className={sortBy === 'trending' ? 'text-amber-400 fill-amber-400' : ''} />
                <span className="hidden sm:inline">Trending</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('alpha')}
                title="Sort Alphabetically (A to Z)"
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  sortBy === 'alpha'
                    ? 'bg-white/15 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ArrowDownAZ size={13} />
                <span className="hidden sm:inline">A-Z</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Metrics */}
      <div className="flex items-center justify-between px-2 mt-3 text-xs font-mono text-zinc-500">
        <span>
          Showing <strong className="text-zinc-300 font-medium">{totalResults}</strong> tools
        </span>
        {showFavorites && (
          <span className="text-amber-400 flex items-center gap-1">
            <Star size={11} className="fill-amber-400" /> Filtered by Saved
          </span>
        )}
      </div>
    </div>
  );
}
