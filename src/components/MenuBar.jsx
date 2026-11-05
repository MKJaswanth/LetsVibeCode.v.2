import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Plus, Github, Menu, X, Layers } from 'lucide-react';

export default function MenuBar({ onOpenSubmit, toolCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

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
        className={`fixed top-3 left-3 right-3 z-40 rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0b0c10]/95 backdrop-blur-2xl border-white/[0.12] shadow-2xl shadow-black/50'
            : 'bg-[#0b0c10]/70 backdrop-blur-xl border-white/[0.08] shadow-xl shadow-black/20'
        }`}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400"
          style={{ scaleX: scrollYProgress }}
        />
        <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="brand-mark group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[15px] tracking-[-0.04em] text-white group-hover:text-cyan-200 transition-colors">
                  vibecode
                </span>
                <span className="text-[9px] font-mono text-zinc-500 tracking-[0.14em] uppercase -mt-0.5">
                  tools worth keeping
                </span>
              </div>
            </a>

            {/* Live Tool Count Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/[0.07] border border-emerald-400/15 text-xs font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-zinc-200 font-semibold">{toolCount}</span> tools in the list
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#roles" className="hover:text-white transition-colors py-1">
              By role
            </a>
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
               Workflows
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-cyan-50 transition-all shadow-sm active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add a tool</span>
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
            className="fixed top-[4.75rem] left-3 right-3 z-30 rounded-2xl bg-[#0c0c11]/95 backdrop-blur-2xl border border-white/[0.1] p-5 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              <a
                href="#roles"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Browse by role
              </a>
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
                 Workflows
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
                  Add a tool
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
