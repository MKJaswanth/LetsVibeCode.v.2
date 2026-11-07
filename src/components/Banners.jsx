import React from 'react';
import { Check, Link2, X } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { roles } from '../data/roles';
import { workflows } from '../data/workflows';
import { useCopy } from '../lib/useCopy';

function StarterRow({ items, tools, onOpenTool }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ tool: name, use }, index) => {
        const tool = tools.find((entry) => entry.name === name);
        if (!tool) return null;
        return (
          <li key={name}>
            <button
              type="button"
              onClick={() => onOpenTool(tool)}
              className="flex w-full items-center gap-3 rounded-lg border border-line bg-bg/60 p-3 text-left transition-colors hover:border-line-strong hover:bg-raised"
            >
              <ToolIcon tool={tool} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-fg">{tool.name}</span>
                <span className="block truncate text-[13px] text-subtle">
                  <span className="tabular-nums">{index + 1}.</span> {use}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function BannerShell({ title, description, onClose, closeLabel, actions, children }) {
  return (
    <section className="mt-6 rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="rounded-md p-2 text-subtle transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function RoleBanner({ roleId, tools, onOpenTool, onClose }) {
  const [copyState, copy] = useCopy();
  const role = roles.find((item) => item.id === roleId);
  if (!role) return null;

  const items = role.starterTools.map((tool, index) => ({ tool, use: role.workflow[index] }));

  const share = () => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('role', role.id);
    copy(url.toString());
  };

  return (
    <BannerShell
      title={role.headline}
      description={`Start with these four, then browse everything else for ${role.label.toLowerCase()} below.`}
      onClose={onClose}
      closeLabel={`Stop filtering for ${role.label}`}
      actions={
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
        >
          {copyState === 'copied' ? <Check size={14} className="text-emerald-400" /> : <Link2 size={14} />}
          {copyState === 'copied' ? 'Copied' : 'Share'}
        </button>
      }
    >
      <StarterRow items={items} tools={tools} onOpenTool={onOpenTool} />
    </BannerShell>
  );
}

export function WorkflowBanner({ workflowId, tools, onOpenTool, onClose }) {
  const workflow = workflows.find((item) => item.id === workflowId);
  if (!workflow) return null;

  return (
    <BannerShell
      title={workflow.name}
      description={workflow.desc}
      onClose={onClose}
      closeLabel={`Close the ${workflow.name} workflow`}
    >
      <StarterRow items={workflow.steps} tools={tools} onOpenTool={onOpenTool} />
    </BannerShell>
  );
}
