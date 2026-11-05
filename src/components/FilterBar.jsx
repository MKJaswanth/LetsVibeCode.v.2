import React from 'react';
import { Search, X, Star, ArrowDownAZ, Flame, DollarSign, SlidersHorizontal } from 'lucide-react';

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
  toolCount = 0,
}) {
  const pricingOptions = [
    { id: 'all', label: 'All Pricing' },
    { id: 'free', label: 'Free', dot: 'bg-emerald-400' },
    { id: 'freemium', label: 'Freemium', dot: 'bg-amber-400' },
    { id: 'paid', label: 'Paid', dot: 'bg-rose-400' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="bg-[#0e1118] border border-white/[0.08] rounded-2xl p-3 sm:p-3.5 shadow-sm space-y-3">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${toolCount} tools by name, tag, or use-case...`}
            className="w-full bg-[#131620] hover:bg-[#161a26] focus:bg-[#161a26] border border-white/[0.08] focus:border-sky-500/50 rounded-xl pl-10 pr-24 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all font-sans"
          />

          <div className="absolute right-3 flex items-center gap-2">
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
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono text-zinc-400">
              <span className="text-[10px]">/</span>
            </kbd>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/[0.05] text-xs">
          {/* Left: Pricing Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {pricingOptions.map((opt) => {
              const isActive = pricingFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPricingFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-white/12 text-white border border-white/20 font-semibold'
                      : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Right: Sort & Favorites */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] font-mono text-zinc-500 hidden md:inline mr-1">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </span>
            {/* Favorites Toggle */}
            <button
              type="button"
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                showFavorites
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 font-semibold'
                  : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Star
                size={13}
                className={showFavorites ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}
              />
              <span>Saved</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-mono text-zinc-300">
                {favoriteCount}
              </span>
            </button>

            {/* Sort Toggle */}
            <div className="flex items-center bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setSortBy('free-first')}
                title="Prioritize free and open source tools"
                className={`px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1 ${
                  sortBy === 'free-first'
                    ? 'bg-white/12 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <DollarSign size={12} className="text-emerald-400" />
                <span className="hidden sm:inline">Free First</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('trending')}
                title="Sort by community votes"
                className={`px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1 ${
                  sortBy === 'trending'
                    ? 'bg-white/12 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Flame size={12} className="text-rose-400" />
                <span className="hidden sm:inline">Top Voted</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('alpha')}
                title="Sort alphabetically"
                className={`px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1 ${
                  sortBy === 'alpha'
                    ? 'bg-white/12 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ArrowDownAZ size={12} />
                <span className="hidden sm:inline">A-Z</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
