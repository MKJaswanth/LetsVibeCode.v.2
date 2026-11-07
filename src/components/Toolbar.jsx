import React from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { Kbd } from './Header';
import { activeChips } from '../lib/catalog';

export default function Toolbar({
  searchInputRef,
  filters,
  setFilter,
  clearFilter,
  clearAll,
  sortBy,
  setSortBy,
  resultCount,
  onOpenFilters,
  activeFilterCount,
}) {
  const chips = activeChips(filters);

  return (
    <div className="sticky top-14 z-30 -mx-4 border-b border-line bg-bg/90 px-4 pb-3 pt-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <div className="flex items-center gap-2">
        <label className="relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">Filter tools</span>
          <Search size={16} className="pointer-events-none absolute left-3 text-subtle" />
          <input
            ref={searchInputRef}
            type="search"
            value={filters.query}
            onChange={(event) => setFilter('query', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && filters.query) {
                event.stopPropagation();
                setFilter('query', '');
              }
            }}
            placeholder="Filter by name, task or platform"
            className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-10 text-sm text-fg placeholder:text-subtle transition-colors hover:border-line-strong focus:border-white/30 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="absolute right-2.5 flex items-center">
            {filters.query ? (
              <button
                type="button"
                onClick={() => setFilter('query', '')}
                aria-label="Clear filter text"
                className="rounded p-1 text-subtle hover:text-fg"
              >
                <X size={14} />
              </button>
            ) : (
              <span className="hidden sm:inline-flex">
                <Kbd>/</Kbd>
              </span>
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg lg:hidden"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-xs text-fg tabular-nums">{activeFilterCount}</span>
          )}
        </button>

        <label className="relative hidden sm:block">
          <span className="sr-only">Sort tools</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-10 appearance-none rounded-lg border border-line bg-surface pl-3 pr-9 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg focus:outline-none"
          >
            <option value="free-first">Free first</option>
            <option value="alpha">A to Z</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle" />
        </label>
      </div>

      <div className="mt-3 flex min-h-7 items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="shrink-0 text-sm text-subtle" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'tool' : 'tools'}
        </span>
        {chips.length > 0 && <span className="h-4 w-px shrink-0 bg-line" />}
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => clearFilter(chip.key)}
            aria-label={`Remove filter ${chip.label}`}
            className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface pl-2.5 pr-1.5 text-[13px] text-fg transition-colors hover:border-line-strong"
          >
            {chip.label}
            <X size={13} className="text-subtle" />
          </button>
        ))}
        {chips.length > 1 && (
          <button
            type="button"
            onClick={clearAll}
            className="shrink-0 px-1.5 text-[13px] text-subtle underline-offset-4 hover:text-fg hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
