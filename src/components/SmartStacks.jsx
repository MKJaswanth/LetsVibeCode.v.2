import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Rocket, Clapperboard, DatabaseZap, Palette, Layers, CheckCircle2, ArrowUpRight } from 'lucide-react';

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
    tools: ['DeepSeek', 'NotebookLM', 'Perplexity', 'ResearchRabbit'],
  },
  {
    id: 'full-stack',
    name: 'Full-stack setup',
    badge: 'SHIP SOFTWARE',
    desc: 'A practical path from repo to production.',
    icon: Rocket,
    accent: 'amber',
    borderActive: 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    tools: ['OpenCode', 'Zed', 'Supabase', 'PostHog'],
  },
  {
    id: 'video',
    name: 'Video maker setup',
    badge: 'EDIT & PUBLISH',
    desc: 'Cut, clean, caption, and soundtrack a complete video workflow.',
    icon: Clapperboard,
    accent: 'rose',
    borderActive: 'border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    tagColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    tools: ['DaVinci Resolve', 'Adobe Podcast', 'CapCut Desktop', 'Suno'],
  },
  {
    id: 'founder',
    name: 'Solo founder setup',
    badge: 'IDEA TO MVP',
    desc: 'Find the signal, shape the product, and launch a focused first version.',
    icon: Rocket,
    accent: 'emerald',
    borderActive: 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    tagColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tools: ['ChatPRD', 'Relume', 'Vercel', 'AnswerThePublic'],
  },
  {
    id: 'ai-engineer',
    name: 'Model builder setup',
    badge: 'BUILD WITH MODELS',
    desc: 'Prototype local inference, RAG flows, datasets, and agent systems.',
    icon: DatabaseZap,
    accent: 'violet',
    borderActive: 'border-violet-500/60 shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    tagColor: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    tools: ['Ollama', 'Dify', 'Langflow', 'Kaggle Notebooks'],
  },
  {
    id: 'design',
    name: 'Product design setup',
    badge: 'IDEA TO INTERFACE',
    desc: 'Build a visual system, wireframe the product, and refine the details.',
    icon: Palette,
    accent: 'pink',
    borderActive: 'border-pink-500/60 shadow-[0_0_30px_rgba(236,72,153,0.15)]',
    tagColor: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    tools: ['Penpot', 'Relume', 'Khroma', 'Vectorizer.ai'],
  },
];

export default function SmartStacks({ onSelectStack, activeStack }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white tracking-tight">Ready-made workflows</h2>
            <p className="text-xs text-zinc-400">Useful combinations for common projects</p>
          </div>
        </div>
         <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">// CHOOSE ONE TO NARROW THE LIST</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {stacks.map((stack) => {
          const isActive = activeStack === stack.id;
          const Icon = stack.icon;

          return (
            <motion.button
              type="button"
              key={stack.id}
              onClick={() => onSelectStack(isActive ? null : stack)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
               className={`stack-card glass-card rounded-3xl p-6 text-left cursor-pointer relative flex flex-col justify-between transition-all duration-300 ${
                isActive ? `${stack.borderActive} bg-zinc-900/80` : 'hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stack.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-semibold">
                      <CheckCircle2 size={12} /> ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-zinc-500 uppercase">{stack.badge}</span>
                  )}
                </div>

                <h3 className="font-semibold text-base text-zinc-100 mb-1.5">{stack.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-5">{stack.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  <span>Includes</span>
                  <ArrowUpRight size={13} className={isActive ? 'text-cyan-300' : 'text-zinc-600'} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.tools.map((toolName) => (
                    <span key={toolName} className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${isActive ? stack.tagColor : 'bg-white/[0.03] text-zinc-400 border-white/[0.06]'}`}>
                      {toolName}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
