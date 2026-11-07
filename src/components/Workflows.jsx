import React from 'react';
import { ArrowRight } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { workflows } from '../data/workflows';

export default function Workflows({ tools, onSelect }) {
  return (
    <section id="workflows" className="scroll-mt-32">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-fg">Workflows</h2>
          <p className="mt-0.5 text-sm text-subtle">Four tools that cover a whole job, from start to finish.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {workflows.map((workflow) => {
          const Icon = workflow.icon;
          const stepTools = workflow.steps
            .map((step) => tools.find((tool) => tool.name === step.tool))
            .filter(Boolean);

          return (
            <button
              key={workflow.id}
              type="button"
              onClick={() => onSelect(workflow.id)}
              className="group flex flex-col rounded-xl border border-line bg-surface p-5 text-left transition-colors hover:border-line-strong hover:bg-raised"
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className="text-subtle" />
                <h3 className="text-[15px] font-medium text-fg">{workflow.name}</h3>
                <ArrowRight
                  size={15}
                  className="ml-auto text-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{workflow.desc}</p>
              <div className="mt-auto flex items-center pt-5">
                <div className="flex -space-x-1.5">
                  {stepTools.map((tool) => (
                    <span
                      key={tool.name}
                      className="rounded-md ring-2 ring-surface transition-colors group-hover:ring-raised"
                    >
                      <ToolIcon tool={tool} size="sm" />
                    </span>
                  ))}
                </div>
                <span className="ml-3 truncate text-[13px] text-subtle">
                  {stepTools.map((tool) => tool.name).join(', ')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
