import React, { useState, useEffect } from 'react';
import { Plus, Github, Menu, X, Layers, Terminal, Sparkles } from 'lucide-react';

export default function MenuBar({ onOpenSubmit, toolCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#090a0f]/90 backdrop-blur-md border-white/[0.08] shadow-lg shadow-black/30'
          : 'bg-[#090a0f]/60 backdrop-blur-sm border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="brand-mark group-hover:border-sky-400/40 transition-colors">
              <Terminal size={15} className="text-sky-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors">
                vibecode
              </span>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                v2.0
              </span>
            </div>
          </a>

          {/* Catalog Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-200 font-semibold">{toolCount}</span> curated tools
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
          <a href="#roles" className="hover:text-white transition-colors">
            Roles
          </a>
          <a href="#stacks" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Layers size={13} className="text-sky-400" />
            Workflows
          </a>
          <a href="#tools" className="hover:text-white transition-colors">
            All Tools
          </a>
          <a
            href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
          >
            <Github size={13} />
            GitHub
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSubmit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 active:scale-98 transition-all shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Submit Tool</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0e15] px-4 py-4 space-y-3">
          <a
            href="#roles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5"
          >
            Browse by Role
          </a>
          <a
            href="#stacks"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5"
          >
            Workflows & Stacks
          </a>
          <a
            href="#tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5"
          >
            All Tools
          </a>
          <a
            href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Github size={14} />
            GitHub Repository
          </a>
        </div>
      )}
    </header>
  );
}
