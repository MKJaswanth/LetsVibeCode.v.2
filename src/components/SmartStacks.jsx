import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Rocket, PenTool, Layers, CheckCircle2 } from 'lucide-react';

const stacks = [
  {
    id: 'student',
    name: 'Student Protocol',
    badge: 'STUDY & RESEARCH',
    desc: 'Research synthesis, paper summaries, and coding assignments.',
    icon: GraduationCap,
    accent: 'cyan',
    borderActive: 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    tagColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    tools: ['DeepSeek Coder', 'ChatGPT (o1/4o)', 'Perplexity', 'Quillbot', 'ResearchRabbit'],
  },
  {
    id: 'startup',
    name: 'Startup Engine',
    badge: 'MVP SPRINT',
    desc: 'Ship and deploy full-stack production software in days.',
    icon: Rocket,
    accent: 'amber',
    borderActive: 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    tools: ['Cursor', 'v0', 'Supabase', 'Vercel', 'PostHog'],
  },
  {
    id: 'creator',
    name: 'Creator Suite',
    badge: 'MEDIA SYNTHESIS',
    desc: 'Cinematic visual assets, voice cloning, and audio production.',
    icon: PenTool,
    accent: 'pink',
    borderActive: 'border-pink-500/60 shadow-[0_0_30px_rgba(236,72,153,0.15)]',
    tagColor: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    tools: ['Midjourney', 'Ideogram', 'Suno', 'Runway', 'Dream Machine'],
  },
];

export default function SmartStacks({ onSelectStack, activeStack }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-20">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white tracking-tight">Smart Stacks</h2>
            <p className="text-xs text-zinc-400">One-click workflow curated presets</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          // CLICK TO FILTER STACK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stacks.map((stack) => {
          const isActive = activeStack === stack.id;
          const Icon = stack.icon;

          return (
            <motion.div
              key={stack.id}
              onClick={() => onSelectStack(isActive ? null : stack)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`glass-card rounded-2xl p-5 cursor-pointer relative flex flex-col justify-between transition-all duration-300 ${
                isActive ? `${stack.borderActive} bg-zinc-900/80` : 'hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stack.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-semibold">
                      <CheckCircle2 size={12} /> ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-zinc-500 uppercase">
                      {stack.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-base text-zinc-100 mb-1.5">{stack.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{stack.desc}</p>
              </div>

              {/* Tool Chips Preview */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                {stack.tools.map((toolName) => (
                  <span
                    key={toolName}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                      isActive ? stack.tagColor : 'bg-white/[0.03] text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    {toolName}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
