import React from 'react';
import {
  GraduationCap,
  Rocket,
  Clapperboard,
  DatabaseZap,
  Palette,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const stacks = [
  {
    id: 'student',
    name: 'Student Protocol',
    badge: 'STUDY & RESEARCH',
    desc: 'Research synthesis, paper summaries, and coding assignments.',
    icon: GraduationCap,
    tools: ['DeepSeek', 'NotebookLM', 'Perplexity', 'ResearchRabbit'],
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Ship',
    badge: 'DEV & PROD',
    desc: 'A practical, zero-friction path from git repo to production deployment.',
    icon: Rocket,
    tools: ['OpenCode', 'Zed', 'Supabase', 'PostHog'],
  },
  {
    id: 'video',
    name: 'Video Production',
    badge: 'CUT & AUDIO',
    desc: 'Cut, clean, caption, and soundtrack without high monthly fees.',
    icon: Clapperboard,
    tools: ['DaVinci Resolve', 'Adobe Podcast', 'CapCut Desktop', 'Suno'],
  },
  {
    id: 'founder',
    name: 'Solo Founder',
    badge: 'IDEA TO MVP',
    desc: 'Validate the concept, build the landing page, and launch fast.',
    icon: Rocket,
    tools: ['ChatPRD', 'Relume', 'Vercel', 'AnswerThePublic'],
  },
  {
    id: 'ai-engineer',
    name: 'Model Builder',
    badge: 'LOCAL & RAG',
    desc: 'Run local inference, build agent pipelines, and benchmark models.',
    icon: DatabaseZap,
    tools: ['Ollama', 'Dify', 'Langflow', 'Kaggle Notebooks'],
  },
  {
    id: 'design',
    name: 'Product Design',
    badge: 'SYSTEMS & UI',
    desc: 'Build design systems, wireframe interfaces, and export vector assets.',
    icon: Palette,
    tools: ['Penpot', 'Relume', 'Khroma', 'Vectorizer.ai'],
  },
];

export default function SmartStacks({ onSelectStack, activeStack }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="font-semibold text-base sm:text-lg text-white tracking-tight">
              Curated Workflows
            </h2>
            <p className="text-xs text-zinc-400">Tested combinations that work together seamlessly</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          Click any workflow to filter catalog
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stacks.map((stack) => {
          const isActive = activeStack === stack.id;
          const Icon = stack.icon;

          return (
            <div
              key={stack.id}
              onClick={() => onSelectStack(isActive ? null : stack)}
              className={`rounded-2xl p-5 text-left cursor-pointer relative flex flex-col justify-between transition-all duration-150 border ${
                isActive
                  ? 'border-sky-500/50 bg-[#121622] shadow-sm'
                  : 'border-white/[0.07] bg-[#0e1118] hover:border-white/[0.14] hover:bg-[#12151e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-200">
                    <Icon size={18} />
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-mono font-medium">
                      <CheckCircle2 size={12} /> ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-zinc-400 uppercase">
                      {stack.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm sm:text-base text-white mb-1">{stack.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{stack.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  <span>Included Stack</span>
                  <ArrowRight size={11} className={isActive ? 'text-sky-400' : 'text-zinc-600'} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.tools.map((toolName) => (
                    <span
                      key={toolName}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                        isActive
                          ? 'bg-sky-500/15 text-sky-200 border-sky-500/25'
                          : 'bg-white/[0.03] text-zinc-400 border-white/[0.06]'
                      }`}
                    >
                      {toolName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
