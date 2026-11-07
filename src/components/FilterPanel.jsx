import React from 'react';
import { Check } from 'lucide-react';

function Group({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 px-2 text-xs font-medium text-subtle">{title}</h3>
      <ul className="space-y-px">{children}</ul>
    </div>
  );
}

function Option({ active, onClick, label, count, role }) {
  const a11y = role === 'checkbox' ? { role: 'checkbox', 'aria-checked': active } : { 'aria-pressed': active };
  return (
    <li>
      <button
        type="button"
        {...a11y}
        onClick={onClick}
        className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          active ? 'bg-white/[0.07] text-fg' : 'text-muted hover:bg-white/[0.04] hover:text-fg'
        } ${count === 0 && !active ? 'opacity-40' : ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          {role === 'checkbox' && (
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                active ? 'border-fg bg-fg text-bg' : 'border-line-strong'
              }`}
            >
              {active && <Check size={11} strokeWidth={3} />}
            </span>
          )}
          <span className="truncate">{label}</span>
        </span>
        {count !== undefined && <span className="text-xs text-subtle tabular-nums">{count}</span>}
      </button>
    </li>
  );
}

export default function FilterPanel({ filters, setFilter, categories, categoryCounts, totalCount, savedCount }) {
  return (
    <div className="space-y-7">
      <Group title="Category">
        <Option
          active={filters.category === 'all'}
          onClick={() => setFilter('category', 'all')}
          label="All tools"
          count={totalCount}
        />
        {categories.map((category) => (
          <Option
            key={category}
            active={filters.category === category}
            onClick={() => setFilter('category', category)}
            label={category}
            count={categoryCounts[category] || 0}
          />
        ))}
      </Group>

      <Group title="Pricing">
        {[
          ['all', 'Any price'],
          ['free', 'Free'],
          ['freemium', 'Freemium'],
          ['paid', 'Paid'],
        ].map(([id, label]) => (
          <Option key={id} active={filters.pricing === id} onClick={() => setFilter('pricing', id)} label={label} />
        ))}
      </Group>

      <Group title="Show only">
        <Option
          role="checkbox"
          active={filters.openSource}
          onClick={() => setFilter('openSource', !filters.openSource)}
          label="Open source"
        />
        <Option
          role="checkbox"
          active={filters.saved}
          onClick={() => setFilter('saved', !filters.saved)}
          label="Saved"
          count={savedCount}
        />
      </Group>
    </div>
  );
}
