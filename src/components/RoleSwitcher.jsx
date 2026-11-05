import React from 'react';
import { ArrowUpRight, Users } from 'lucide-react';
import { roles, toolMatchesRole } from '../data/roles';

const accentStyles = {
  cyan: 'text-cyan-300 border-cyan-300/30 bg-cyan-300/10',
  rose: 'text-rose-300 border-rose-300/30 bg-rose-300/10',
  violet: 'text-violet-300 border-violet-300/30 bg-violet-300/10',
  emerald: 'text-emerald-300 border-emerald-300/30 bg-emerald-300/10',
  amber: 'text-amber-300 border-amber-300/30 bg-amber-300/10',
};

export default function RoleSwitcher({ tools, activeRole, onChange }) {
  const roleItems = [
    { id: 'all', label: 'All roles', shortLabel: 'All roles', icon: Users, accent: null, count: tools.length },
    ...roles.map((role) => ({
      ...role,
      count: tools.filter((tool) => toolMatchesRole(tool, role.id)).length,
    })),
  ];

  const renderRoleItems = (isDuplicate = false) => (
    <div className="role-marquee-group" aria-hidden={isDuplicate}>
      {roleItems.map((role) => {
        const Icon = role.icon;
        const activeClass = activeRole === role.id ? accentStyles[role.accent] || '' : '';

        return (
          <button
            type="button"
            key={`${isDuplicate ? 'duplicate-' : ''}${role.id}`}
            onClick={() => onChange(role.id)}
            className={`role-pill ${activeRole === role.id ? `role-pill-active ${activeClass}` : ''}`}
            title={role.description || 'Browse the full tool index'}
            tabIndex={isDuplicate ? -1 : 0}
          >
            <span className="role-pill-icon"><Icon size={15} /></span>
            <span>{role.shortLabel}</span>
            <span className="role-pill-count">{role.count}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="role-switcher-shell rounded-[1.5rem] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-2">
              <Users size={13} /> Vibe by role
            </div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-white">Start from the work you do.</h2>
            <p className="mt-1 text-xs text-zinc-500">A quicker way to find tools that fit your kind of work.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-500">
            Auto drift <ArrowUpRight size={12} />
          </span>
        </div>

        <div className="role-marquee-viewport" role="region" aria-label="Browse tools by role">
          <div className="role-marquee-track">
            {renderRoleItems()}
            {renderRoleItems(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
