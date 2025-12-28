import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Flame, CheckCircle, AlertTriangle, BarChart } from 'lucide-react';

const ToolModal = ({ tool, onClose, voteCount, hasVoted, onUpvote }) => {
  if (!tool) return null;

  // Mock Data Generators
  const getVibeScore = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 85 + (Math.abs(hash) % 15);
  };

  const score = getVibeScore(tool.name);

  const getTags = (cat) => {
    const tags = ['Creators'];
    if (cat.includes('Coding')) tags.push('Developers', 'Students');
    if (cat.includes('Video')) tags.push('Editors', 'Filmmakers');
    if (cat.includes('Productivity')) tags.push('Founders', 'Writers');
    if (cat.includes('Research')) tags.push('Academics', 'Researchers');
    return tags;
  };

  const analysis = {
    pros: [
      `High-performance ${tool.category.split(' ')[0]} engine`,
      "Seamless workflow integration",
      "Cyber-enhanced output quality"
    ],
    cons: [
      "Advanced features require learning curve",
      tool.pricing === 'paid' ? "Premium tier required for full power" : "Limited daily credits on free tier"
    ]
  };

  const tags = getTags(tool.category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0f] border border-neon-cyan/50 shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
          style={{
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
          }}
        >
          {/* Header */}
          <div className="p-8 pb-4 relative overflow-hidden border-b border-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-orbitron text-3xl font-bold text-white mb-1">{tool.name}</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan/80">
                  <span>//{tool.category}</span>
                  <span className="uppercase text-neon-pink">[{tool.pricing}]</span>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24}/></button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto">
            <p className="text-gray-300 text-lg mb-8 border-l-2 border-neon-pink pl-4 italic">
              {tool.desc}
            </p>

            {/* Vibe Score */}
            <div className="mb-8 bg-white/5 p-4 rounded border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="font-orbitron text-xs text-gray-400">VIBE_SCORE_ANALYSIS</span>
                <span className="font-mono text-xl font-bold text-neon-cyan">{score}%</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-orbitron text-xs text-green-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle size={14} /> Optimizations
                </h4>
                <ul className="space-y-2 text-sm text-gray-400 font-mono">
                  {analysis.pros.map((p, i) => <li key={i}>+ {p}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-orbitron text-xs text-red-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} /> Limitations
                </h4>
                <ul className="space-y-2 text-sm text-gray-400 font-mono">
                  {analysis.cons.map((c, i) => <li key={i}>- {c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
             <button 
                onClick={onUpvote}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all border ${
                    hasVoted 
                    ? 'bg-neon-pink/20 text-neon-pink border-neon-pink shadow-[0_0_15px_rgba(255,0,170,0.3)]' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
            >
                <Flame size={18} className={hasVoted ? 'fill-neon-pink' : ''} />
                <span className="text-sm font-bold font-mono">{voteCount || 0}</span>
            </button>

            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-neon-cyan text-black font-orbitron font-bold px-8 py-3 hover:bg-white transition-all flex items-center gap-2"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' }}
            >
              INITIALIZE <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ToolModal;