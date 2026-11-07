import React, { useEffect, useState } from 'react';
import { Bookmark, Github, Plus, Search } from 'lucide-react';
import { isMac } from '../lib/useDialog';

export function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#fafafa" />
      <path d="M10 11l5 5-5 5" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 21H22" fill="none" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-white/[0.04] px-1.5 font-sans text-[11px] font-medium text-subtle">
      {children}
    </kbd>
  );
}

export default function Header({ onOpenPalette, onOpenSubmit, onShowSaved, onShowWorkflows, onHome, savedCount }) {
  const [scrolled, setScrolled] = useState(false);
  const mod = isMac() ? '⌘' : 'Ctrl';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        scrolled ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent bg-bg'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a
          href="./"
          onClick={(event) => {
            event.preventDefault();
            onHome();
          }}
          className="flex items-center gap-2.5 rounded-md"
        >
          <Logo className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight text-fg">Let's Vibe Code</span>
        </a>

        <nav className="ml-4 hidden items-center gap-1 text-sm md:flex" aria-label="Main">
          <button
            type="button"
            onClick={onShowWorkflows}
            className="rounded-md px-3 py-1.5 text-muted transition-colors hover:text-fg"
          >
            Workflows
          </button>
          <button
            type="button"
            onClick={onShowSaved}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted transition-colors hover:text-fg"
          >
            Saved
            {savedCount > 0 && <span className="text-xs text-subtle tabular-nums">{savedCount}</span>}
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-subtle transition-colors hover:border-line-strong hover:text-muted sm:flex"
          >
            <Search size={15} />
            <span>Search tools</span>
            <span className="ml-auto flex gap-1">
              <Kbd>{mod}</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search tools"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg sm:hidden"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={onShowSaved}
            aria-label={`Saved tools (${savedCount})`}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg md:hidden"
          >
            <Bookmark size={18} />
          </button>
          <a
            href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="hidden rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg sm:block"
          >
            <Github size={18} />
          </a>
          <button
            type="button"
            onClick={onOpenSubmit}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-colors hover:bg-white"
          >
            <Plus size={15} strokeWidth={2.25} />
            <span className="hidden sm:inline">Add a tool</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
