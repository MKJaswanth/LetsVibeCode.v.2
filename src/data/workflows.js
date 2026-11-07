import { GraduationCap, Rocket, Clapperboard, DatabaseZap, Palette, Store } from 'lucide-react';

// Each step pairs a tool from the catalog with the job it does in the workflow.
export const workflows = [
  {
    id: 'full-stack',
    name: 'Ship a web app',
    desc: 'Write the code, store the data, deploy it and see how people use it.',
    icon: Rocket,
    steps: [
      { tool: 'Zed', use: 'Editor' },
      { tool: 'OpenCode', use: 'Coding agent' },
      { tool: 'Supabase', use: 'Database and auth' },
      { tool: 'PostHog', use: 'Analytics' },
    ],
  },
  {
    id: 'video',
    name: 'Make a video',
    desc: 'Edit the footage, clean the audio, add captions and music.',
    icon: Clapperboard,
    steps: [
      { tool: 'DaVinci Resolve', use: 'Edit and color' },
      { tool: 'Adobe Podcast', use: 'Clean the audio' },
      { tool: 'CapCut Desktop', use: 'Captions' },
      { tool: 'Suno', use: 'Music' },
    ],
  },
  {
    id: 'ai-engineer',
    name: 'Build with local models',
    desc: 'Run a model on your machine, build a RAG flow and test on free GPUs.',
    icon: DatabaseZap,
    steps: [
      { tool: 'Ollama', use: 'Run models' },
      { tool: 'Dify', use: 'RAG and agents' },
      { tool: 'Langflow', use: 'Prototype flows' },
      { tool: 'Kaggle Notebooks', use: 'Free GPUs' },
    ],
  },
  {
    id: 'design',
    name: 'Design a product',
    desc: 'Pick colors, wireframe the flow, design the screens and export assets.',
    icon: Palette,
    steps: [
      { tool: 'Khroma', use: 'Color palette' },
      { tool: 'Relume', use: 'Wireframes' },
      { tool: 'Penpot', use: 'Screens' },
      { tool: 'Vectorizer.ai', use: 'SVG assets' },
    ],
  },
  {
    id: 'founder',
    name: 'Launch an MVP',
    desc: 'Find what people ask for, write the spec, shape the site and put it live.',
    icon: Store,
    steps: [
      { tool: 'AnswerThePublic', use: 'Research demand' },
      { tool: 'ChatPRD', use: 'Write the spec' },
      { tool: 'Relume', use: 'Site structure' },
      { tool: 'Vercel', use: 'Hosting' },
    ],
  },
  {
    id: 'student',
    name: 'Study and research',
    desc: 'Find papers, map related work and get answers grounded in your sources.',
    icon: GraduationCap,
    steps: [
      { tool: 'ResearchRabbit', use: 'Find papers' },
      { tool: 'NotebookLM', use: 'Study your sources' },
      { tool: 'Perplexity', use: 'Quick answers' },
      { tool: 'DeepSeek', use: 'Coding help' },
    ],
  },
];

export const workflowToolNames = (workflow) => workflow.steps.map((step) => step.tool);
