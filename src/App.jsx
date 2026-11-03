import React, { useState, useEffect, useRef, useMemo } from 'react';
import { tools as initialTools } from './data/tools';
import ToolCard from './components/ToolCard';
import ToolModal from './components/ToolModal';
import SubmitModal from './components/SubmitModal';
import CategoryTabs from './components/CategoryTabs';
import FilterBar from './components/FilterBar';
import SmartStacks from './components/SmartStacks';
import MenuBar from './components/MenuBar';
import ScrollToTop from './components/ScrollToTop';
import { Terminal, Sparkles, Layers, Star, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeStack, setActiveStack] = useState(null);
  const [pricingFilter, setPricingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [showFavorites, setShowFavorites] = useState(false);

  const [allTools, setAllTools] = useState(initialTools);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const [upvotes, setUpvotes] = useState({});
  const [userVotes, setUserVotes] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());

  const searchInputRef = useRef(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // 1. Custom submitted tools
      const savedCustomTools = JSON.parse(localStorage.getItem('letsvibe_custom_tools') || '[]');
      const mergedTools = [...savedCustomTools, ...initialTools];

      // Daily featured rotation (3 tools)
      const today = new Date();
      const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
      const candidates = mergedTools.filter((t) => t.popular || t.pricing === 'paid' || t.pricing === 'freemium');

      let updatedTools = mergedTools;
      if (candidates.length > 0) {
        const indices = [
          (dayIndex * 3) % candidates.length,
          (dayIndex * 3 + 1) % candidates.length,
          (dayIndex * 3 + 2) % candidates.length,
        ];
        const featuredNames = indices.map((i) => candidates[i].name);
        updatedTools = mergedTools.map((t) => ({
          ...t,
          featured: featuredNames.includes(t.name) || Boolean(t.featured),
        }));
      }
      setAllTools(updatedTools);

      // 2. Upvotes
      const savedVotes = JSON.parse(localStorage.getItem('letsvibe_user_votes') || '[]');
      setUserVotes(new Set(savedVotes));

      const initialUpvotes = {};
      updatedTools.forEach((t) => {
        let hash = 0;
        for (let i = 0; i < t.name.length; i++) hash = t.name.charCodeAt(i) + ((hash << 5) - hash);
        initialUpvotes[t.name] = 120 + (Math.abs(hash) % 780);
        if (savedVotes.includes(t.name)) {
          initialUpvotes[t.name] += 1;
        }
      });
      setUpvotes(initialUpvotes);

      // 3. Bookmarks
      const savedBookmarks = JSON.parse(localStorage.getItem('letsvibe_bookmarks') || '[]');
      setBookmarks(new Set(savedBookmarks));
    } catch (err) {
      console.error('Initialization error:', err);
    }
  }, []);

  // Global Keyboard Shortcut: Focus search with "/" or "Cmd/Ctrl+K"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Upvote Handler
  const handleToggleUpvote = (toolName, e) => {
    if (e) e.stopPropagation();
    const newVotes = new Set(userVotes);
    const isRemoving = newVotes.has(toolName);

    if (isRemoving) {
      newVotes.delete(toolName);
      setUpvotes((prev) => ({ ...prev, [toolName]: (prev[toolName] || 0) - 1 }));
    } else {
      newVotes.add(toolName);
      setUpvotes((prev) => ({ ...prev, [toolName]: (prev[toolName] || 0) + 1 }));
    }

    setUserVotes(newVotes);
    localStorage.setItem('letsvibe_user_votes', JSON.stringify([...newVotes]));
  };

  // Bookmark Handler
  const handleToggleBookmark = (toolName, e) => {
    if (e) e.stopPropagation();
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(toolName)) {
      newBookmarks.delete(toolName);
    } else {
      newBookmarks.add(toolName);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('letsvibe_bookmarks', JSON.stringify([...newBookmarks]));
  };

  // Submit Tool Handler
  const handleSubmitTool = (newTool) => {
    const savedCustomTools = JSON.parse(localStorage.getItem('letsvibe_custom_tools') || '[]');
    const updatedCustom = [newTool, ...savedCustomTools];
    localStorage.setItem('letsvibe_custom_tools', JSON.stringify(updatedCustom));

    setAllTools((prev) => [newTool, ...prev]);
    setUpvotes((prev) => ({ ...prev, [newTool.name]: 1 }));
  };

  // Categories list
  const categories = useMemo(() => {
    return [...new Set(allTools.map((t) => t.category))];
  }, [allTools]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    allTools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [allTools]);

  // Smart Stacks handler
  const handleSelectStack = (stack) => {
    setActiveStack(stack);
    if (stack) {
      setActiveCategory('ALL');
      setShowFavorites(false);
    }
  };

  // Filter & Sort Pipeline
  const filteredTools = useMemo(() => {
    let result = allTools;

    // 1. Stack filter
    if (activeStack) {
      result = result.filter((t) => activeStack.tools.includes(t.name));
    }

    // 2. Category filter
    if (activeCategory !== 'ALL') {
      result = result.filter((t) => t.category === activeCategory);
    }

    // 3. Pricing filter
    if (pricingFilter !== 'all') {
      result = result.filter((t) => t.pricing === pricingFilter);
    }

    // 4. Favorites filter
    if (showFavorites) {
      result = result.filter((t) => bookmarks.has(t.name));
    }

    // 5. Search keyword
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // 6. Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'trending') {
        const votesA = upvotes[a.name] || 0;
        const votesB = upvotes[b.name] || 0;
        return votesB - votesA;
      }
      if (sortBy === 'alpha') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [allTools, activeStack, activeCategory, pricingFilter, showFavorites, searchTerm, sortBy, upvotes, bookmarks]);

  const featuredTools = useMemo(() => {
    return allTools.filter((t) => t.featured);
  }, [allTools]);

  const isDefaultView =
    activeCategory === 'ALL' &&
    !searchTerm.trim() &&
    !activeStack &&
    pricingFilter === 'all' &&
    !showFavorites &&
    sortBy === 'trending';

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Ambient Radial Spotlight Glow */}
      <div className="ambient-glow" />

      {/* Navigation Bar */}
      <MenuBar onOpenSubmit={() => setIsSubmitOpen(true)} toolCount={allTools.length} />

      {/* Hero Section */}
      <section className="pt-28 pb-10 px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Release Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6 shadow-sm">
            <Sparkles size={13} className="text-cyan-400" />
            <span>2026 Edition · 128+ AI & Vibe-Coding Tools</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            The Curated Directory for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">
              Vibe Coding
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
            Discover modern coding agents, intelligence engines, multimodal synthesis, and developer stacks to ship software at lightspeed.
          </p>

          {/* Interactive Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={(cat) => {
              setActiveCategory(cat);
              setActiveStack(null);
            }}
            categoryCounts={categoryCounts}
            totalCount={allTools.length}
          />
        </div>
      </section>

      {/* Filter & Search Bar */}
      <FilterBar
        searchInputRef={searchInputRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pricingFilter={pricingFilter}
        setPricingFilter={setPricingFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favoriteCount={bookmarks.size}
        totalResults={filteredTools.length}
      />

      {/* Smart Stacks Section */}
      <section id="stacks" className="scroll-mt-24">
        <SmartStacks onSelectStack={handleSelectStack} activeStack={activeStack?.id} />
      </section>

      {/* Main Tools Directory */}
      <main id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex-grow w-full mb-24 scroll-mt-24">
        {/* Empty State */}
        {filteredTools.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center glass-card rounded-2xl p-8 border border-white/[0.08]">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
              <Terminal size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No tools match your criteria</h3>
            <p className="text-xs text-zinc-400 max-w-sm mb-5">
              Try adjusting your search terms, changing the pricing tier, or resetting filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('ALL');
                setActiveStack(null);
                setPricingFilter('all');
                setShowFavorites(false);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : isDefaultView ? (
          /* Default Categorized View */
          <div className="flex flex-col gap-14">
            {/* Featured Systems Carousel/Grid */}
            {featuredTools.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.08]">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <h2 className="font-bold text-base text-zinc-100 tracking-tight">Featured Systems</h2>
                  <span className="text-[11px] font-mono text-zinc-500">// DAILY HIGHLIGHT</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featuredTools.map((tool) => (
                    <ToolCard
                      key={tool.name}
                      tool={tool}
                      onClick={setSelectedTool}
                      voteCount={upvotes[tool.name] || 0}
                      hasVoted={userVotes.has(tool.name)}
                      onUpvote={handleToggleUpvote}
                      isBookmarked={bookmarks.has(tool.name)}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Categorized Sections */}
            {categories.map((category) => {
              const categoryTools = filteredTools.filter((t) => t.category === category && !t.featured);
              if (categoryTools.length === 0) return null;

              return (
                <section key={category}>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-bold text-base text-zinc-100 tracking-tight">{category}</h2>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {categoryTools.length}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryTools.map((tool) => (
                      <ToolCard
                        key={tool.name}
                        tool={tool}
                        onClick={setSelectedTool}
                        voteCount={upvotes[tool.name] || 0}
                        hasVoted={userVotes.has(tool.name)}
                        onUpvote={handleToggleUpvote}
                        isBookmarked={bookmarks.has(tool.name)}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Filtered or Sorted Flat Responsive Grid */
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-zinc-100 tracking-tight">
                  {showFavorites
                    ? 'Saved Favorites'
                    : activeStack
                    ? `${activeStack.name} Stack`
                    : activeCategory !== 'ALL'
                    ? activeCategory
                    : 'Search Results'}
                </h2>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {filteredTools.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.name}
                  tool={tool}
                  onClick={setSelectedTool}
                  voteCount={upvotes[tool.name] || 0}
                  hasVoted={userVotes.has(tool.name)}
                  onUpvote={handleToggleUpvote}
                  isBookmarked={bookmarks.has(tool.name)}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Minimalist Developer Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07070a] py-12 px-4 relative z-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Terminal size={14} />
            </div>
            <div>
              <span className="font-semibold text-zinc-200">Let's Vibe Code v2.0</span>
              <p className="text-[11px] text-zinc-500">Curated AI & Vibe-Coding Directory</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium text-zinc-400">
            <a href="#tools" className="hover:text-white transition-colors">
              Tools
            </a>
            <a href="#stacks" className="hover:text-white transition-colors">
              Smart Stacks
            </a>
            <button
              type="button"
              onClick={() => setIsSubmitOpen(true)}
              className="hover:text-white transition-colors"
            >
              Submit Tool
            </button>
            <a
              href="https://github.com/MKJaswanth/LetsVibeCode.v.2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Github size={13} />
              GitHub
            </a>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            <span>Free & Open Source</span>
          </div>
        </div>
      </footer>

      {/* Modals & Helpers */}
      <ToolModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        voteCount={selectedTool ? upvotes[selectedTool.name] || 0 : 0}
        hasVoted={selectedTool ? userVotes.has(selectedTool.name) : false}
        onUpvote={handleToggleUpvote}
        isBookmarked={selectedTool ? bookmarks.has(selectedTool.name) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitTool={handleSubmitTool}
      />

      <ScrollToTop />
    </div>
  );
}
