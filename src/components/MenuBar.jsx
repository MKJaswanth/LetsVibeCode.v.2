import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, PlusCircle, Menu, X } from 'lucide-react';

const MenuBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SYSTEMS', href: '#systems' },
    { name: 'STACKS', href: '#stacks' },
    { name: 'PROTOCOL', href: '#newsletter' },
  ];

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 border-b ${isScrolled ? 'bg-black/80 backdrop-blur-md border-neon-cyan/20' : 'bg-transparent border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Terminal size={24} className="text-neon-cyan group-hover:text-neon-pink transition-colors" />
            <span className="font-orbitron font-bold text-white text-lg tracking-widest hidden md:inline group-hover:text-neon-cyan transition-colors">
              LETSVIBECODE
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-xs font-mono text-gray-400 hover:text-white hover:tracking-widest transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a 
                href="mailto:submit@letsvibecode.com" 
                className="hidden md:flex items-center gap-2 bg-neon-pink/10 border border-neon-pink text-neon-pink px-4 py-2 text-xs font-bold hover:bg-neon-pink hover:text-white transition-all"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' }}
            >
                <PlusCircle size={14} /> SUBMIT TOOL
            </a>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-neon-cyan/20 z-40 p-6 md:hidden"
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-orbitron text-white hover:text-neon-cyan"
              >
                {link.name}
              </a>
            ))}
            <a 
                href="mailto:submit@letsvibecode.com"
                className="flex justify-center items-center gap-2 bg-neon-pink text-white px-4 py-3 font-bold uppercase tracking-widest"
            >
                SUBMIT TOOL
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MenuBar;
