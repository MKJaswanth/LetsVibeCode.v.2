import React from 'react';
import { Logo } from './Header';

export default function Footer({ toolCount, onOpenSubmit }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-6 w-6" />
          <p className="text-subtle">
            <span className="text-fg">Let's Vibe Code</span> · {toolCount} tools, updated November 2026
          </p>
        </div>
        <div className="flex items-center gap-5 text-subtle">
          <button type="button" onClick={onOpenSubmit} className="transition-colors hover:text-fg">
            Add a tool
          </button>
          <a
            href="https://github.com/MKJaswanth/LetsVibeCode.v.2/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            Report an issue
          </a>
          <a
            href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
