import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CornerDownLeft, Folder, Layers, Search, User } from 'lucide-react';
import ToolIcon from './ToolIcon';
import { Kbd } from './Header';
import { useDialog } from '../lib/useDialog';
import { PRICING_LABELS, compareFreeFirst, scoreTool } from '../lib/catalog';
import { roles } from '../data/roles';
import { workflows } from '../data/workflows';

const includes = (text, q) => text.toLowerCase().includes(q);

export default function CommandPalette({ tools, categories, onClose, onOpenTool, onRunAction }) {
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useDialog(onClose, { initialFocusRef: inputRef });
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();

    const toolItems = (
      q
        ? tools
            .map((tool) => ({ tool, score: scoreTool(tool, q) }))
            .filter(({ score }) => score >= 0)
            .sort((a, b) => b.score - a.score || compareFreeFirst(a.tool, b.tool))
            .map(({ tool }) => tool)
        : tools.filter((tool) => tool.featured).sort(compareFreeFirst)
    )
      .slice(0, q ? 8 : 6)
      .map((tool) => ({ id: `tool:${tool.name}`, kind: 'tool', tool, run: () => onOpenTool(tool) }));

    const categoryItems = categories
      .filter((category) => !q || includes(category, q))
      .slice(0, q ? 3 : 0)
      .map((category) => ({
        id: `category:${category}`,
        kind: 'category',
        label: category,
        hint: 'Category',
        icon: Folder,
        run: () => onRunAction({ category }),
      }));

    const roleItems = roles
      .filter((role) => !q || includes(`${role.label} ${role.description}`, q))
      .slice(0, q ? 2 : 5)
      .map((role) => ({
        id: `role:${role.id}`,
        kind: 'role',
        label: `Tools for ${role.label.toLowerCase()}`,
        hint: 'Role',
        icon: User,
        run: () => onRunAction({ role: role.id }),
      }));

    const workflowItems = workflows
      .filter((workflow) => !q || includes(`${workflow.name} ${workflow.desc}`, q))
      .slice(0, q ? 2 : 0)
      .map((workflow) => ({
        id: `workflow:${workflow.id}`,
        kind: 'workflow',
        label: workflow.name,
        hint: 'Workflow',
        icon: Layers,
        run: () => onRunAction({ workflow: workflow.id }),
      }));

    const result = [];
    if (toolItems.length) result.push({ title: q ? 'Tools' : 'Popular', items: toolItems });
    const browse = [...categoryItems, ...roleItems, ...workflowItems];
    if (browse.length) result.push({ title: q ? 'Browse' : 'Start from a role', items: browse });
    if (q) {
      result.push({
        title: '',
        items: [
          {
            id: 'filter',
            kind: 'action',
            label: `Show every tool matching “${query.trim()}”`,
            icon: Search,
            run: () => onRunAction({ query: query.trim() }),
          },
        ],
      });
    }
    return result;
  }, [query, tools, categories, onOpenTool, onRunAction]);

  const flat = groups.flatMap((group) => group.items);
  const activeIndex = Math.min(active, Math.max(flat.length - 1, 0));

  const move = (delta) => {
    if (!flat.length) return;
    const next = (activeIndex + delta + flat.length) % flat.length;
    setActive(next);
    listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' });
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      flat[activeIndex]?.run();
    }
  };

  let index = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <motion.div
        ref={containerRef}
        data-dialog
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        initial={{ opacity: 0, scale: 0.98, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -8 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="shrink-0 text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search tools, tasks, categories"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={flat[activeIndex] ? `palette-${activeIndex}` : undefined}
            className="h-14 w-full bg-transparent text-[15px] text-fg placeholder:text-subtle focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div ref={listRef} id="palette-list" role="listbox" className="max-h-[min(60vh,440px)] overflow-y-auto p-2">
          {flat.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-subtle">Nothing matches “{query}”.</p>
          )}
          {groups.map((group) => (
            <div key={group.title || 'actions'} role="group" aria-label={group.title || 'Actions'} className="mb-1">
              {group.title && <div className="px-3 pb-1.5 pt-3 text-xs font-medium text-subtle">{group.title}</div>}
              {group.items.map((item) => {
                index += 1;
                const i = index;
                const selected = i === activeIndex;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    id={`palette-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => active !== i && setActive(i)}
                    onClick={item.run}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                      selected ? 'bg-white/[0.07]' : ''
                    }`}
                  >
                    {item.kind === 'tool' ? (
                      <>
                        <ToolIcon tool={item.tool} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-fg">{item.tool.name}</span>
                          <span className="block truncate text-[13px] text-subtle">{item.tool.desc}</span>
                        </span>
                        <span
                          className={`shrink-0 text-[13px] ${
                            item.tool.pricing === 'free' ? 'text-emerald-400' : 'text-subtle'
                          }`}
                        >
                          {PRICING_LABELS[item.tool.pricing]}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line text-subtle">
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-fg">{item.label}</span>
                        {item.hint && <span className="shrink-0 text-[13px] text-subtle">{item.hint}</span>}
                      </>
                    )}
                    {selected && <CornerDownLeft size={14} className="shrink-0 text-subtle" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-subtle sm:flex">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> to open
          </span>
        </div>
      </motion.div>
    </div>
  );
}
