import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Rocket, PenTool, Sparkles, Layers, ArrowRight } from 'lucide-react';

const stacks = [
  {
    id: 'student',
    name: 'STUDENT PROTOCOL',
    desc: 'Power through assignments and research.',
    icon: GraduationCap,
    color: 'text-blue-400',
    border: 'group-hover:border-blue-400',
    bg: 'group-hover:bg-blue-400/10',
    tools: ['DeepSeek Coder', 'ChatGPT (o1/4o)', 'Perplexity', 'Quillbot', 'ResearchRabbit']
  },
  {
    id: 'startup',
    name: 'STARTUP ENGINE',
    desc: 'Build and ship your MVP this weekend.',
    icon: Rocket,
    color: 'text-orange-400',
    border: 'group-hover:border-orange-400',
    bg: 'group-hover:bg-orange-400/10',
    tools: ['Cursor', 'v0', 'Supabase', 'Vercel', 'PostHog']
  },
  {
    id: 'creator',
    name: 'CREATOR SUITE',
    desc: 'High-fidelity visual and audio synthesis.',
    icon: PenTool,
    color: 'text-neon-pink',
    border: 'group-hover:border-neon-pink',
    bg: 'group-hover:bg-neon-pink/10',
    tools: ['Midjourney', 'Ideogram', 'Suno', 'Runway', 'Dream Machine']
  }
];

const SmartStacks = ({ onSelectStack, activeStack }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-24">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Layers className="text-neon-cyan" size={24} />
          <h2 className="font-orbitron text-2xl text-white font-bold tracking-widest uppercase">
            SMART STACKS
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-400 hidden md:block">
          // ONE-CLICK WORKFLOW OPTIMIZATION
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stacks.map((stack) => {
          const isActive = activeStack === stack.id;
          
          return (
            <motion.button
              key={stack.id}
              onClick={() => onSelectStack(isActive ? null : stack)}
              className={`group relative p-8 text-left border-2 transition-all duration-500 overflow-hidden flex flex-col h-full
                ${isActive 
                  ? `border-${stack.color.split('-')[1]}-400 bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]` 
                  : 'border-white/5 bg-black/40 hover:border-white/20'}
              `}
              style={{
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}
              whileHover={{ y: -5 }}
            >
              {/* Active Glow Background */}
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-br ${stack.bg.replace('group-hover:', '')} opacity-20`} />
              )}

              {/* Hover Scanline */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${stack.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stack.icon size={28} />
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> ACTIVE
                    </span>
                  )}
                </div>
                
                <h3 className={`font-orbitron text-xl font-black text-white mb-2 tracking-tight group-hover:${stack.color} transition-colors`}>
                  {stack.name}
                </h3>
                
                <p className="text-sm font-mono text-gray-400 mb-6 leading-relaxed">
                  {stack.desc}
                </p>

                {/* Tool Preview Chips */}
                <div className="mt-auto">
                  <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Includes:</div>
                  <div className="flex flex-wrap gap-2">
                    {stack.tools.slice(0, 3).map((tool) => (
                      <span key={tool} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap">
                        {tool}
                      </span>
                    ))}
                    {stack.tools.length > 3 && (
                      <span className="text-[10px] px-2 py-1 text-gray-500">+{stack.tools.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Line */}
                <div className={`mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold tracking-widest transition-colors ${isActive ? stack.color : 'text-gray-600 group-hover:text-white'}`}>
                  <span>{isActive ? 'SYSTEM ENGAGED' : 'INITIALIZE'}</span>
                  <ArrowRight size={14} className={`transition-transform duration-300 ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SmartStacks;
