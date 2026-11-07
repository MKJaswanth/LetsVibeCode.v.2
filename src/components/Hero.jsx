import React from 'react';
import { Search } from 'lucide-react';
import { roles } from '../data/roles';
import { Kbd } from './Header';
import { isMac } from '../lib/useDialog';

export default function Hero({ toolCount, freeCount, activeRole, onRoleChange, onOpenPalette }) {
  const mod = isMac() ? '⌘' : 'Ctrl';

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Fine grid that fades out toward the edges. Purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,#000_30%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-20 sm:pt-28">
        <h1 className="text-balance text-4xl font-semibold tracking-[-0.035em] text-fg sm:text-6xl">
          AI tools worth your time.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
          {toolCount} hand-picked tools for building, designing and shipping. {freeCount} are free, and free options
          always come first.
        </p>

        <button
          type="button"
          onClick={onOpenPalette}
          className="mx-auto mt-10 flex h-14 w-full max-w-xl items-center gap-3 rounded-xl border border-line-strong bg-surface px-4 text-left text-[15px] text-subtle shadow-[0_1px_0_rgb(255_255_255/0.04)_inset,0_8px_24px_-12px_rgb(0_0_0/0.8)] transition-colors hover:border-white/25 hover:text-muted"
        >
          <Search size={18} className="shrink-0" />
          <span className="truncate">Search for a tool, a task or a category</span>
          <span className="ml-auto hidden shrink-0 gap-1 sm:flex">
            <Kbd>{mod}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="mt-8">
          <p className="text-sm text-subtle" id="role-label">
            Or start from what you do
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2" role="group" aria-labelledby="role-label">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onRoleChange(active ? 'all' : role.id)}
                  className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                    active
                      ? 'border-fg bg-fg text-bg'
                      : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg'
                  }`}
                >
                  <Icon size={15} />
                  {role.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
