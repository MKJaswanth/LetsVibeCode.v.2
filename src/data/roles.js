import { Code2, Clapperboard, Palette, DatabaseZap, Rocket } from 'lucide-react';

export const roles = [
  {
    id: 'developer',
    label: 'Developers',
    shortLabel: 'Developers',
    description: 'Ship software faster with agents, editors, APIs, and free infrastructure.',
    eyebrow: 'BUILD & SHIP',
    headline: 'Your zero-cost engineering cockpit.',
    workflow: ['Plan the change', 'Build with an agent', 'Test locally', 'Deploy with confidence'],
    starterTools: ['Zed', 'OpenCode', 'Bruno', 'Supabase'],
    icon: Code2,
    accent: 'cyan',
  },
  {
    id: 'video-editor',
    label: 'Video Editors',
    shortLabel: 'Video',
    description: 'Cut, clean, caption, and generate without starting with an Adobe bill.',
    eyebrow: 'CUT & PUBLISH',
    headline: 'A complete creator workflow without the subscription wall.',
    workflow: ['Capture the idea', 'Clean the audio', 'Edit the story', 'Publish everywhere'],
    starterTools: ['DaVinci Resolve', 'Adobe Podcast', 'Whisper', 'CapCut Desktop'],
    icon: Clapperboard,
    accent: 'rose',
  },
  {
    id: 'designer',
    label: 'Designers',
    shortLabel: 'Designers',
    description: 'Move from rough idea to polished interface, system, and visual asset.',
    eyebrow: 'IDEA & INTERFACE',
    headline: 'Turn a rough direction into a system people can use.',
    workflow: ['Find the visual language', 'Wireframe the flow', 'Build the system', 'Polish the details'],
    starterTools: ['Penpot', 'Relume', 'Khroma', 'Vectorizer.ai'],
    icon: Palette,
    accent: 'violet',
  },
  {
    id: 'ai-engineer',
    label: 'AI Engineers',
    shortLabel: 'AI Engineers',
    description: 'Prototype models, RAG systems, data workflows, and GPU experiments.',
    eyebrow: 'MODELS & DATA',
    headline: 'From local model to working AI product.',
    workflow: ['Choose the model', 'Prototype the flow', 'Ground it in data', 'Measure the output'],
    starterTools: ['Ollama', 'Dify', 'Langflow', 'Kaggle Notebooks'],
    icon: DatabaseZap,
    accent: 'emerald',
  },
  {
    id: 'founder',
    label: 'Founders',
    shortLabel: 'Founders',
    description: 'Turn customer signals into a focused product and a shippable first version.',
    eyebrow: 'SIGNAL & LAUNCH',
    headline: 'Make the next decision with less noise and less overhead.',
    workflow: ['Find the signal', 'Write the brief', 'Shape the experience', 'Ship the MVP'],
    starterTools: ['ChatPRD', 'Relume', 'Supabase', 'AnswerThePublic'],
    icon: Rocket,
    accent: 'amber',
  },
];

const categoryMatches = {
  developer: ['Coding Agents', 'Backend & Deploy'],
  'video-editor': ['Video & Audio', 'Visual Creation'],
  designer: ['UI & Frontend', 'Visual Creation'],
  'ai-engineer': ['Models & Chat', 'AI Engineering', 'Research'],
  founder: ['Backend & Deploy', 'UI & Frontend', 'Productivity & Knowledge', 'Product & Growth'],
};

const keywordMatches = {
  developer: ['api', 'backend', 'deploy', 'database', 'editor', 'code', 'terminal', 'documentation'],
  'video-editor': ['video', 'audio', 'voice', 'caption', 'media', 'music'],
  designer: ['design', 'interface', 'visual', 'color', 'vector', 'wireframe', 'component'],
  'ai-engineer': ['model', 'llm', 'rag', 'data', 'gpu', 'agent', 'machine learning', 'inference'],
  founder: ['startup', 'customer', 'roadmap', 'analytics', 'mvp', 'full-stack'],
};

export function toolMatchesRole(tool, roleId) {
  if (!roleId || roleId === 'all') return true;
  if (Array.isArray(tool.roles) && tool.roles.length > 0) return tool.roles.includes(roleId);
  if (categoryMatches[roleId]?.includes(tool.category)) return true;

  const searchable = `${tool.name} ${tool.desc}`.toLowerCase();
  return keywordMatches[roleId]?.some((keyword) => searchable.includes(keyword)) ?? false;
}
