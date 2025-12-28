import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="border-t border-white/10 bg-black/50 backdrop-blur-md py-12 mt-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="font-orbitron text-2xl text-white mb-4">
          THE VIBE <span className="text-neon-cyan">PROTOCOL</span>
        </h3>
        <p className="text-gray-400 mb-8 font-mono text-sm uppercase tracking-widest">
          Get the 5 best free AI tools for Developers, Students, and Creators every Friday.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto relative">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="email" 
              placeholder="ENTER_EMAIL_ADDRESS" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/80 border border-white/20 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors font-mono text-sm"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex items-center justify-center bg-neon-pink text-white font-orbitron px-10 py-3 hover:bg-neon-pink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wider relative overflow-hidden whitespace-nowrap min-w-fit"
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            {status === 'loading' ? 'PROCESSING...' : status === 'success' ? 'ACCESS GRANTED' : 'GET ACCESS'}
          </button>
        </form>

        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-green-500 font-mono text-sm flex items-center justify-center gap-2"
          >
            <Check size={16} /> WELCOME TO THE NETWORK.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
