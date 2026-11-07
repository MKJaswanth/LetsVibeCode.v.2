import { Code2, Clapperboard, Palette, DatabaseZap, Rocket } from 'lucide-react';

export const roles = [
  {
    id: 'developer',
    label: 'Developers',
    shortLabel: 'Developer',
    description: 'Editors, coding agents, API clients and free hosting.',
    headline: 'Write, test and ship code without paying up front.',
    workflow: ['Plan the change', 'Build with an agent', 'Test locally', 'Deploy'],
    starterTools: ['Zed', 'OpenCode', 'Bruno', 'Supabase'],
    icon: Code2,
  },
  {
    id: 'video-editor',
    label: 'Video editors',
    shortLabel: 'Video editor',
    description: 'Editing, audio cleanup, captions and generative video.',
    headline: 'Edit, clean up and publish video with free tools.',
    workflow: ['Record', 'Clean the audio', 'Edit', 'Caption and publish'],
    starterTools: ['DaVinci Resolve', 'Adobe Podcast', 'Whisper', 'CapCut Desktop'],
    icon: Clapperboard,
  },
  {
    id: 'designer',
    label: 'Designers',
    shortLabel: 'Designer',
    description: 'Design apps, palettes, wireframes and vector assets.',
    headline: 'Go from a rough idea to a finished interface.',
    workflow: ['Pick a visual direction', 'Wireframe', 'Design the screens', 'Export assets'],
    starterTools: ['Penpot', 'Relume', 'Khroma', 'Vectorizer.ai'],
    icon: Palette,
  },
  {
    id: 'ai-engineer',
    label: 'AI engineers',
    shortLabel: 'AI engineer',
    description: 'Local models, RAG builders, notebooks and GPU time.',
    headline: 'Prototype AI features on your own machine first.',
    workflow: ['Choose a model', 'Prototype the flow', 'Add your data', 'Evaluate'],
    starterTools: ['Ollama', 'Dify', 'Langflow', 'Kaggle Notebooks'],
    icon: DatabaseZap,
  },
  {
    id: 'founder',
    label: 'Founders',
    shortLabel: 'Founder',
    description: 'Research, specs, landing pages and a backend for your MVP.',
    headline: 'Test an idea and ship a first version.',
    workflow: ['Research the problem', 'Write the spec', 'Design the site', 'Launch'],
    starterTools: ['ChatPRD', 'Relume', 'Supabase', 'AnswerThePublic'],
    icon: Rocket,
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
