import React from 'react';
import { Users } from 'lucide-react';
import { roles, toolMatchesRole } from '../data/roles';

export default function RoleSwitcher({ tools, activeRole, onChange }) {
  const roleItems = [
    {
      id: 'all',
      label: 'All Roles',
      shortLabel: 'All Roles',
      icon: Users,
      count: tools.length,
      desc: 'Browse entire directory',
    },
    ...roles.map((role) => ({
      ...role,
      count: tools.filter((tool) => toolMatchesRole(tool, role.id)).length,
      desc: role.description,
    })),
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="bg-[#0e1118] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold mb-1">
              <span>Filter by Craft</span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Tools tailored for what you're building
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {activeRole === 'all' ? 'Showing all disciplines' : `Filtered by ${activeRole}`}
          </span>
        </div>

        {/* Role Pills Row - Clean, accessible, horizontal scroll or flex wrap */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {roleItems.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;

            return (
              <button
                type="button"
                key={role.id}
                onClick={() => onChange(role.id)}
                className={`role-pill ${isActive ? 'role-pill-active' : ''}`}
                title={role.desc}
              >
                <Icon size={14} className={isActive ? 'text-sky-400' : 'text-zinc-400'} />
                <span>{role.shortLabel}</span>
                <span className="role-pill-count">{role.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
