import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Plus, Github, Menu, X, Sparkles, Layers } from 'lucide-react';

export default function MenuBar({ onOpenSubmit, toolCount = 128 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/60'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/60 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Terminal size={18} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  LET'S VIBE CODE
                </span>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase -mt-0.5">
                  AI Directory v2.0
                </span>
              </div>
            </a>

            {/* Live Tool Count Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-200 font-semibold">{toolCount}</span> tools curated
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a
              href="#tools"
              className="hover:text-white transition-colors py-1 hover:border-b hover:border-cyan-400"
            >
              Explore Tools
            </a>
            <a
              href="#stacks"
              className="hover:text-white transition-colors py-1 flex items-center gap-1.5"
            >
              <Layers size={13} className="text-cyan-400" />
              Smart Stacks
            </a>
            <a
              href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors py-1 flex items-center gap-1.5"
            >
              <Github size={13} />
              GitHub
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSubmit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Submit Tool</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-30 bg-[#0c0c11]/95 backdrop-blur-2xl border-b border-white/[0.08] p-5 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              <a
                href="#tools"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Explore Tools
              </a>
              <a
                href="#stacks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Layers size={14} className="text-cyan-400" />
                Smart Stacks
              </a>
              <a
                href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Github size={14} />
                GitHub Repository
              </a>
              <div className="pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSubmit?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
                >
                  <Plus size={14} />
                  Submit Tool
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
