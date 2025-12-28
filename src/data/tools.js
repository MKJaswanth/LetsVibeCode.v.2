// Added 'featured' and 'affiliate' flags to simulate monetization logic
export const tools = [
  // --- Sponsored / Featured (High Revenue Potential) ---
  {
    name: "Lovable",
    desc: "GPT-4 powered full-stack builder. Ship apps in minutes.",
    url: "https://lovable.dev",
    category: "Top Tier Coding",
    pricing: "paid",
    affiliate: true
  },
  {
    name: "Cursor",
    desc: "The AI-first Code Editor. The choice of pros.",
    url: "https://cursor.com",
    category: "Top Tier Coding",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Midjourney",
    desc: "Highest aesthetic quality generation available.",
    url: "https://midjourney.com",
    category: "Visual Synthesis",
    pricing: "paid"
  },

  // --- S-Class Coding Agents ---
  {
    name: "DeepSeek Coder",
    desc: "Open-source coding model rivaling GPT-4.",
    url: "https://chat.deepseek.com",
    category: "Top Tier Coding",
    pricing: "free",
    popular: true
  },
  {
    name: "Blackbox AI",
    desc: "Real-time code generation & search.",
    url: "https://www.blackbox.ai",
    category: "Top Tier Coding",
    pricing: "free",
    popular: true
  },
  {
    name: "Codeium",
    desc: "Free AI autocomplete for all IDEs.",
    url: "https://codeium.com",
    category: "Top Tier Coding",
    pricing: "free",
    popular: true
  },
  {
    name: "Trae",
    desc: "Adaptive AI IDE (ByteDance).",
    url: "https://traeide.com",
    category: "Top Tier Coding",
    pricing: "free"
  },
  {
    name: "MetaGPT",
    desc: "Multi-agent framework for dev.",
    url: "https://github.com/geekan/MetaGPT",
    category: "Top Tier Coding",
    pricing: "free"
  },
  {
    name: "Windsurf",
    desc: "Agentic IDE that thinks with you.",
    url: "https://codeium.com/windsurf",
    category: "Top Tier Coding",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Bolt.new",
    desc: "Prompt to full-stack web app in browser.",
    url: "https://bolt.new",
    category: "Top Tier Coding",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Replit Agent",
    desc: "Build software with natural language.",
    url: "https://replit.com",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "Warp",
    desc: "The terminal for the 21st century.",
    url: "https://www.warp.dev",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "Qodo (Codium)",
    desc: "Quality-first AI code integrity tool.",
    url: "https://www.qodo.ai",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "Tabnine",
    desc: "Private & secure code completion.",
    url: "https://tabnine.com",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "Emergent",
    desc: "AI coding agent.",
    url: "https://emergent.sh",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "Mgx.dev",
    desc: "AI development environment.",
    url: "https://mgx.dev",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "Qoder",
    desc: "AI backend generation.",
    url: "https://qoder.com",
    category: "Top Tier Coding",
    pricing: "freemium"
  },
  {
    name: "GitHub Copilot",
    desc: "The original AI pair programmer.",
    url: "https://code.visualstudio.com",
    category: "Top Tier Coding",
    pricing: "paid"
  },
  {
    name: "Vibecodeapp",
    desc: "Code with the vibe.",
    url: "https://vibecodeapp.com",
    category: "Top Tier Coding",
    pricing: "paid"
  },

  // --- Intelligence Engines ---
  {
    name: "Groq",
    desc: "Instant speed inference (LPU).",
    url: "https://groq.com",
    category: "Intelligence Engines",
    pricing: "free",
    popular: true
  },
  {
    name: "HuggingChat",
    desc: "Access open source models.",
    url: "https://huggingface.co/chat",
    category: "Intelligence Engines",
    pricing: "free"
  },
  {
    name: "Microsoft Copilot",
    desc: "GPT-4 access for free via Bing.",
    url: "https://copilot.microsoft.com",
    category: "Intelligence Engines",
    pricing: "free"
  },
  {
    name: "Mistral Le Chat",
    desc: "Top-tier European AI models.",
    url: "https://chat.mistral.ai",
    category: "Intelligence Engines",
    pricing: "free"
  },
  {
    name: "DuckDuckGo AI",
    desc: "Anonymous AI chat.",
    url: "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat",
    category: "Intelligence Engines",
    pricing: "free"
  },
  {
    name: "ChatGPT (o1/4o)",
    desc: "The standard for reasoning and chat.",
    url: "https://chat.openai.com",
    category: "Intelligence Engines",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Claude 3.5 Sonnet",
    desc: "Best-in-class coding and writing.",
    url: "https://claude.ai",
    category: "Intelligence Engines",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Gemini 1.5 Pro",
    desc: "Massive context window multimodal AI.",
    url: "https://gemini.google.com",
    category: "Intelligence Engines",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Perplexity",
    desc: "AI search engine replacement.",
    url: "https://www.perplexity.ai",
    category: "Intelligence Engines",
    pricing: "freemium"
  },
  {
    name: "Poe",
    desc: "Access all top models in one place.",
    url: "https://poe.com",
    category: "Intelligence Engines",
    pricing: "freemium"
  },

  // --- Visual Synthesis ---
  {
    name: "Bing Image Creator",
    desc: "DALL-E 3 for free.",
    url: "https://www.bing.com/images/create",
    category: "Visual Synthesis",
    pricing: "free",
    popular: true
  },
  {
    name: "Playground",
    desc: "1000 free generations daily (SDXL).",
    url: "https://playgroundai.com",
    category: "Visual Synthesis",
    pricing: "free"
  },
  {
    name: "Recraft",
    desc: "Best for vector art & icons.",
    url: "https://www.recraft.ai",
    category: "Visual Synthesis",
    pricing: "free"
  },
  {
    name: "Ideogram",
    desc: "Best for text rendering in images.",
    url: "https://ideogram.ai",
    category: "Visual Synthesis",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Leonardo.ai",
    desc: "Comprehensive asset generation suite.",
    url: "https://leonardo.ai",
    category: "Visual Synthesis",
    pricing: "freemium"
  },
  {
    name: "Krea",
    desc: "Real-time generation and upscaling.",
    url: "https://www.krea.ai",
    category: "Visual Synthesis",
    pricing: "freemium"
  },
  {
    name: "Adobe Firefly",
    desc: "Commercial-safe generative AI.",
    url: "https://firefly.adobe.com",
    category: "Visual Synthesis",
    pricing: "freemium"
  },

  // --- Video & Audio ---
  {
    name: "Dream Machine",
    desc: "High quality video from text/image.",
    url: "https://lumalabs.ai/dream-machine",
    category: "Video & Audio",
    pricing: "free",
    popular: true
  },
  {
    name: "Udio",
    desc: "Music generation with high fidelity.",
    url: "https://www.udio.com",
    category: "Video & Audio",
    pricing: "free"
  },
  {
    name: "Suno",
    desc: "Generate radio-quality songs.",
    url: "https://suno.com",
    category: "Video & Audio",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Runway",
    desc: "Cinematic video generation (Gen-3).",
    url: "https://runwayml.com",
    category: "Video & Audio",
    pricing: "freemium"
  },
  {
    name: "Kling AI",
    desc: "Realistic video motion generation.",
    url: "https://klingai.com",
    category: "Video & Audio",
    pricing: "freemium"
  },
  {
    name: "ElevenLabs",
    desc: "Most realistic AI voice synthesis.",
    url: "https://elevenlabs.io",
    category: "Video & Audio",
    pricing: "freemium"
  },
  {
    name: "Pika",
    desc: "Video generation and lip sync.",
    url: "https://pika.art",
    category: "Video & Audio",
    pricing: "freemium"
  },

  // --- Productivity ---
  {
    name: "Kimi",
    desc: "Long-context AI & PPT assistant.",
    url: "https://kimi.moonshot.cn",
    category: "Productivity",
    pricing: "free"
  },
  {
    name: "Quillbot",
    desc: "Paraphrasing and grammar check.",
    url: "https://quillbot.com",
    category: "Productivity",
    pricing: "free"
  },
  {
    name: "Hemingway",
    desc: "Make your writing bold and clear.",
    url: "https://hemingwayapp.com",
    category: "Productivity",
    pricing: "free"
  },
  {
    name: "Gamma",
    desc: "Generate decks, docs & webpages.",
    url: "https://gamma.app",
    category: "Productivity",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Tome",
    desc: "Storytelling format for work.",
    url: "https://tome.app",
    category: "Productivity",
    pricing: "freemium"
  },
  {
    name: "SlidesAI",
    desc: "Text to Slides in seconds.",
    url: "https://www.slidesai.io",
    category: "Productivity",
    pricing: "freemium"
  },
  {
    name: "Notion AI",
    desc: "Connected workspace AI assistant.",
    url: "https://www.notion.so",
    category: "Productivity",
    pricing: "freemium"
  },
  {
    name: "Grammarly",
    desc: "AI writing partner.",
    url: "https://www.grammarly.com",
    category: "Productivity",
    pricing: "freemium"
  },
  {
    name: "Otter.ai",
    desc: "AI meeting notes & transcription.",
    url: "https://otter.ai",
    category: "Productivity",
    pricing: "freemium"
  },
  {
    name: "Beautiful.ai",
    desc: "Smart slide designer.",
    url: "https://www.beautiful.ai",
    category: "Productivity",
    pricing: "paid"
  },
  {
    name: "Jasper",
    desc: "Enterprise marketing content.",
    url: "https://www.jasper.ai",
    category: "Productivity",
    pricing: "paid"
  },

  // --- Frontend & UI ---
  {
    name: "Google AI Studio",
    desc: "Prototyping with Gemini models.",
    url: "https://aistudio.google.com",
    category: "Frontend & UI",
    pricing: "free",
    popular: true
  },
  {
    name: "Stitch",
    desc: "Prototyping with AI (Google).",
    url: "https://stitch.withgoogle.com",
    category: "Frontend & UI",
    pricing: "free"
  },
  {
    name: "Skywork",
    desc: "AI-powered coding workspace.",
    url: "https://skywork.ai",
    category: "Frontend & UI",
    pricing: "free"
  },
  {
    name: "v0",
    desc: "Generate React UI with Shadcn.",
    url: "https://v0.dev",
    category: "Frontend & UI",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Uizard",
    desc: "Screenshot to editable design.",
    url: "https://uizard.io",
    category: "Frontend & UI",
    pricing: "freemium"
  },
  {
    name: "Base44",
    desc: "No-code/Low-code AI platform.",
    url: "https://base44.com",
    category: "Frontend & UI",
    pricing: "paid"
  },
  {
    name: "RocketAI",
    desc: "Launch apps faster with AI.",
    url: "https://rocket.new",
    category: "Frontend & UI",
    pricing: "paid"
  },

  // --- Backend & Deploy ---
  {
    name: "GitHub Pages",
    desc: "Host static sites for free.",
    url: "https://pages.github.com",
    category: "Backend & Deploy",
    pricing: "free"
  },
  {
    name: "Google Colab",
    desc: "Free cloud Jupyter notebooks.",
    url: "https://colab.research.google.com",
    category: "Backend & Deploy",
    pricing: "free"
  },
  {
    name: "Kaggle",
    desc: "Data sets & free notebooks.",
    url: "https://www.kaggle.com",
    category: "Backend & Deploy",
    pricing: "free"
  },
  {
    name: "Vercel",
    desc: "Frontend cloud deployment.",
    url: "https://vercel.com",
    category: "Backend & Deploy",
    pricing: "freemium",
    popular: true
  },
  {
    name: "Netlify",
    desc: "Fastest way to build the web.",
    url: "https://www.netlify.com",
    category: "Backend & Deploy",
    pricing: "freemium"
  },
  {
    name: "Supabase",
    desc: "Open source Firebase alternative.",
    url: "https://supabase.com",
    category: "Backend & Deploy",
    pricing: "freemium"
  },
  {
    name: "Firebase",
    desc: "Google's app backend platform.",
    url: "https://console.firebase.google.com",
    category: "Backend & Deploy",
    pricing: "freemium"
  },
  {
    name: "Render",
    desc: "Unified cloud to build apps.",
    url: "https://render.com",
    category: "Backend & Deploy",
    pricing: "freemium"
  },
  {
    name: "Heroku",
    desc: "Platform as a service.",
    url: "https://www.heroku.com",
    category: "Backend & Deploy",
    pricing: "freemium"
  },
  {
    name: "MongoDB",
    desc: "Flexible document database.",
    url: "https://www.mongodb.com",
    category: "Backend & Deploy",
    pricing: "freemium"
  },
  {
    name: "Lightning AI",
    desc: "Build & deploy AI apps.",
    url: "https://lightning.ai",
    category: "Backend & Deploy",
    pricing: "freemium"
  },

  // --- Research & Academic ---
  {
    name: "ResearchRabbit",
    desc: "Visual literature review tool.",
    url: "https://www.researchrabbit.ai",
    category: "Research & Academic",
    pricing: "free"
  },
  {
    name: "Semantic Scholar",
    desc: "AI-powered research tool.",
    url: "https://www.semanticscholar.org",
    category: "Research & Academic",
    pricing: "free"
  },
  {
    name: "Mermaid Live",
    desc: "Diagramming and visualization.",
    url: "https://mermaid.live",
    category: "Research & Academic",
    pricing: "free"
  },
  {
    name: "Consensus",
    desc: "Evidence-based answers.",
    url: "https://consensus.app",
    category: "Research & Academic",
    pricing: "freemium"
  },
  {
    name: "SciSpace",
    desc: "Understand research papers.",
    url: "https://typeset.io",
    category: "Research & Academic",
    pricing: "freemium"
  },
  {
    name: "Elicit",
    desc: "Analyze research papers at scale.",
    url: "https://elicit.com",
    category: "Research & Academic",
    pricing: "freemium"
  },
  {
    name: "Scholarcy",
    desc: "AI article summarizer.",
    url: "https://www.scholarcy.com",
    category: "Research & Academic",
    pricing: "freemium"
  },
  {
    name: "Trinka",
    desc: "Grammar check for academic.",
    url: "https://www.trinka.ai",
    category: "Research & Academic",
    pricing: "freemium"
  },
  {
    name: "Scite",
    desc: "Smart citation analysis.",
    url: "https://scite.ai",
    category: "Research & Academic",
    pricing: "paid"
  },

  // --- Tool Collections ---
  {
    name: "Futurepedia",
    desc: "Largest AI tools directory.",
    url: "https://www.futurepedia.io",
    category: "Tool Collections",
    pricing: "free",
    popular: true
  },
  {
    name: "Product Hunt",
    desc: "Launchpad for new tech.",
    url: "https://www.producthunt.com",
    category: "Tool Collections",
    pricing: "free"
  },
  {
    name: "AI Valley",
    desc: "Discover free AI tools.",
    url: "https://aivalley.ai/tag/free/",
    category: "Tool Collections",
    pricing: "free"
  },
  {
    name: "Toolify",
    desc: "AI tool aggregator.",
    url: "https://www.toolify.ai",
    category: "Tool Collections",
    pricing: "free"
  },
  {
    name: "TopAI Tools",
    desc: "Curated AI lists.",
    url: "https://topai.tools",
    category: "Tool Collections",
    pricing: "free"
  },
  {
    name: "Dang.ai",
    desc: "Best AI tools directory.",
    url: "https://dang.ai",
    category: "Tool Collections",
    pricing: "free"
  }
];
