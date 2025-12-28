import React, { useState, useEffect } from 'react';
import { tools } from './data/tools';
import ToolCard from './components/ToolCard';
import ToolModal from './components/ToolModal'; 
import CategoryTabs from './components/CategoryTabs';
import SmartStacks from './components/SmartStacks'; 
import MatrixBackground from './components/MatrixBackground';
import Newsletter from './components/Newsletter';
import MenuBar from './components/MenuBar'; 
import ScrollToTop from './components/ScrollToTop'; 
import { Terminal, Search, Cpu, Star } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeStack, setActiveStack] = useState(null); 
  const [allTools, setAllTools] = useState(tools); 
  const [filteredTools, setFilteredTools] = useState(tools); 
  const [selectedTool, setSelectedTool] = useState(null); 
  const [upvotes, setUpvotes] = useState({});
  const [userVotes, setUserVotes] = useState(new Set());

  // Loading Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Data
  useEffect(() => {
    try {
      const today = new Date();
      const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
      const candidates = tools.filter(t => t.popular || t.pricing === 'paid' || t.pricing === 'freemium');
      
      if (candidates.length > 0) {
        const indices = [
          (dayIndex * 3) % candidates.length,
          (dayIndex * 3 + 1) % candidates.length,
          (dayIndex * 3 + 2) % candidates.length
        ];
        const featuredNames = indices.map(i => candidates[i].name);
        const updatedTools = tools.map(t => ({
          ...t,
          featured: featuredNames.includes(t.name)
        }));
        setAllTools(updatedTools);
        if (searchTerm === '' && activeCategory === 'ALL' && !activeStack) {
           setFilteredTools(updatedTools);
        }
      }

      const savedVotes = JSON.parse(localStorage.getItem('letsvibe_user_votes') || '[]');
      setUserVotes(new Set(savedVotes));

      const initialUpvotes = {};
      tools.forEach(t => {
          let hash = 0;
          for (let i = 0; i < t.name.length; i++) hash = t.name.charCodeAt(i) + ((hash << 5) - hash);
          initialUpvotes[t.name] = 100 + (Math.abs(hash) % 900);
          if (savedVotes.includes(t.name)) {
              initialUpvotes[t.name] += 1;
          }
      });
      setUpvotes(initialUpvotes);
    } catch (error) {
      console.error("Initialization error:", error);
    }
  }, []);

  // Handle Upvote Toggle
  const handleToggleUpvote = (toolName, e) => {
    if (e) e.stopPropagation(); 

    const newVotes = new Set(userVotes);
    const isRemoving = newVotes.has(toolName);

    if (isRemoving) {
        newVotes.delete(toolName);
        setUpvotes(prev => ({ ...prev, [toolName]: (prev[toolName] || 0) - 1 }));
    } else {
        newVotes.add(toolName);
        setUpvotes(prev => ({ ...prev, [toolName]: (prev[toolName] || 0) + 1 }));
    }

    setUserVotes(newVotes);
    localStorage.setItem('letsvibe_user_votes', JSON.stringify([...newVotes]));
  };

  // Filter Logic
  useEffect(() => {
    let results = allTools;

    if (activeStack) {
      results = results.filter(tool => activeStack.tools.includes(tool.name));
    }

    if (activeCategory !== 'ALL') {
      results = results.filter(tool => tool.category === activeCategory);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(tool => 
        tool.name.toLowerCase().includes(lowerTerm) || 
        tool.desc.toLowerCase().includes(lowerTerm) ||
        tool.category.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredTools(results);
  }, [searchTerm, activeCategory, allTools, activeStack]);

  const handleSelectStack = (stack) => {
    setActiveStack(stack);
    if (stack) {
        setSearchTerm(''); 
        setActiveCategory('ALL'); 
    }
  };

  const categories = [...new Set(allTools.map(t => t.category))];
  const featuredTools = allTools.filter(t => t.featured);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-neon-cyan/20 blur-xl animate-pulse"></div>
          <h1 className="relative font-orbitron text-5xl md:text-7xl font-bold text-white tracking-tighter">
            SYSTEM<span className="text-neon-cyan">.ONLINE</span>
          </h1>
        </div>
        <div className="mt-8 flex items-center gap-2 font-mono text-neon-pink text-sm">
           <Cpu className="animate-spin" size={16} /> INITIALIZING VIBE SIGNAL...
        </div>
        <div className="w-64 h-1 bg-gray-900 rounded overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink animate-[load_2s_ease-in-out_forwards]" />
        </div>
        <style>{`@keyframes load { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
      <div className="min-h-screen text-gray-200 font-mono pb-20 selection:bg-neon-pink selection:text-white">
        <MatrixBackground />

        <MenuBar />

        <header className="pt-32 pb-12 px-4 text-center relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-orbitron text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter mb-4 drop-shadow-2xl"
          >
            LETS VIBE <span className="text-neon-cyan">CODE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed"
          >
            Curated AI tools for the <span className="text-neon-pink font-bold">cyberpunk</span> era. 
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto mb-12 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg opacity-30 group-hover:opacity-60 blur transition duration-500" />
            <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-1">
              <Search className="ml-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Find your tool (e.g., 'coding', 'video', 'free')..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-gray-600 font-mono text-sm"
              />
            </div>
          </motion.div>

          <CategoryTabs 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
        </header>

        <section id="stacks" className="scroll-mt-24">
            <SmartStacks 
            onSelectStack={handleSelectStack} 
            activeStack={activeStack?.id} 
            />
        </section>

        <section id="systems" className="scroll-mt-24">
            <main className="max-w-7xl mx-auto px-4 relative z-10 min-h-[400px]">
            <AnimatePresence mode="wait">
                
                {activeCategory === 'ALL' && !searchTerm && !activeStack && (
                    <motion.section 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            <h2 className="font-orbitron text-2xl text-yellow-500 font-bold tracking-wide">
                                FEATURED SYSTEMS
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredTools.map((tool) => (
                                <ToolCard 
                                    key={tool.name} 
                                    tool={tool} 
                                    onClick={setSelectedTool}
                                    voteCount={upvotes[tool.name]}
                                    hasVoted={userVotes.has(tool.name)}
                                    onUpvote={(e) => handleToggleUpvote(tool.name, e)}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {activeCategory === 'ALL' && !searchTerm ? (
                <motion.div
                    key="all-sections"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {[...new Set(allTools.map(t => t.category))].map((category) => {
                    const categoryTools = filteredTools.filter(t => t.category === category && !t.featured);
                    if (categoryTools.length === 0) return null;

                    return (
                        <section key={category} className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="font-orbitron text-2xl text-neon-cyan font-bold tracking-wide">
                            {category}
                            </h2>
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryTools.map((tool) => (
                            <ToolCard 
                                key={tool.name} 
                                tool={tool} 
                                onClick={setSelectedTool} 
                                voteCount={upvotes[tool.name]}
                                hasVoted={userVotes.has(tool.name)}
                                onUpvote={(e) => handleToggleUpvote(tool.name, e)}
                            />
                            ))}
                        </div>
                        </section>
                    );
                    })}
                </motion.div>
                ) : (
                <motion.div 
                    key={activeCategory + searchTerm}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool) => (
                        <ToolCard 
                            key={tool.name} 
                            tool={tool} 
                            onClick={setSelectedTool} 
                            voteCount={upvotes[tool.name]}
                            hasVoted={userVotes.has(tool.name)}
                            onUpvote={(e) => handleToggleUpvote(tool.name, e)}
                        />
                    ))}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            
            {filteredTools.length === 0 && (
                <div className="text-center py-20">
                <Terminal size={32} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No systems found</h3>
                </div>
            )}
            </main>
        </section>
        
        <section id="newsletter" className="scroll-mt-24">
            <Newsletter />
        </section>

        <footer className="text-center py-12 text-gray-600 relative z-10 bg-black">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-neon-cyan" />
              <span className="font-orbitron text-xs tracking-widest text-gray-300">LETSVIBECODE © 2025</span>
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-400">
                <a href="#" className="hover:text-neon-pink">PRIVACY</a>
                <a href="#" className="hover:text-neon-pink">TERMS</a>
                <a href="#" className="hover:text-neon-pink">ADVERTISE</a>
            </div>
          </div>
        </footer>

        <ToolModal 
            tool={selectedTool} 
            onClose={() => setSelectedTool(null)} 
            voteCount={selectedTool ? upvotes[selectedTool.name] : 0}
            hasVoted={selectedTool ? userVotes.has(selectedTool.name) : false}
            onUpvote={(e) => selectedTool && handleToggleUpvote(selectedTool.name, e)}
        />
        
        <ScrollToTop />
      </div>
  );
}

export default App;
