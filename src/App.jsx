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
import RoleSwitcher from './components/RoleSwitcher';
import RolePlaybook from './components/RolePlaybook';
import { roles as roleOptions, toolMatchesRole } from './data/roles';
import { Terminal, Star, Github, ArrowRight } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

const getRoleFromUrl = () => {
  if (typeof window === 'undefined') return 'all';

  const role = new URLSearchParams(window.location.search).get('role');
  return roleOptions.some((option) => option.id === role) ? role : 'all';
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeRole, setActiveRole] = useState(getRoleFromUrl);
  const [activeStack, setActiveStack] = useState(null);
  const [pricingFilter, setPricingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('free-first');
  const [showFavorites, setShowFavorites] = useState(false);

  const [allTools, setAllTools] = useState(initialTools);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const [upvotes, setUpvotes] = useState({});
  const [userVotes, setUserVotes] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());

  const searchInputRef = useRef(null);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setActiveCategory('ALL');
    setActiveStack(null);
    setShowFavorites(false);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (role === 'all') {
        url.searchParams.delete('role');
      } else {
        url.searchParams.set('role', role);
      }
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  useEffect(() => {
    const handlePopState = () => handleRoleChange(getRoleFromUrl());
    window.addEventListener('popstate', handlePopState);

    const url = new URL(window.location.href);
    const roleParam = url.searchParams.get('role');
    if (roleParam && !roleOptions.some((option) => option.id === roleParam)) {
      url.searchParams.delete('role');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const role = roleOptions.find((option) => option.id === activeRole);
    document.title = role ? `${role.label} · vibecode` : 'vibecode · tools worth keeping';
  }, [activeRole]);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // 1. Custom submitted tools
      const savedCustomTools = JSON.parse(localStorage.getItem('letsvibe_custom_tools') || '[]');
      const mergedTools = [...savedCustomTools, ...initialTools];
      const updatedTools = mergedTools.map((t) => ({ ...t, featured: Boolean(t.featured) }));
      setAllTools(updatedTools);

      // 2. Upvotes
      const savedVotes = JSON.parse(localStorage.getItem('letsvibe_user_votes') || '[]');
      const validNames = new Set(updatedTools.map((tool) => tool.name));
      const validVotes = savedVotes.filter((name) => validNames.has(name));
      setUserVotes(new Set(validVotes));

      const initialUpvotes = {};
      updatedTools.forEach((t) => {
        let hash = 0;
        for (let i = 0; i < t.name.length; i++) hash = t.name.charCodeAt(i) + ((hash << 5) - hash);
        initialUpvotes[t.name] = 120 + (Math.abs(hash) % 780);
        if (validVotes.includes(t.name)) {
          initialUpvotes[t.name] += 1;
        }
      });
      setUpvotes(initialUpvotes);

      // 3. Bookmarks
      const savedBookmarks = JSON.parse(localStorage.getItem('letsvibe_bookmarks') || '[]');
      setBookmarks(new Set(savedBookmarks.filter((name) => validNames.has(name))));
    } catch (err) {
      console.error('Initialization error:', err);
    }
  }, []);

  // Global Keyboard Shortcut: Focus search with "/" or "Cmd/Ctrl+K" when modals are NOT open
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't focus background search if a modal is active
      if (selectedTool || isSubmitOpen) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, isSubmitOpen]);

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
    const normalizedTool = {
      ...newTool,
      roles: newTool.roles?.length ? newTool.roles : ['founder'],
    };
    const savedCustomTools = JSON.parse(localStorage.getItem('letsvibe_custom_tools') || '[]');
    const updatedCustom = [normalizedTool, ...savedCustomTools];
    localStorage.setItem('letsvibe_custom_tools', JSON.stringify(updatedCustom));

    setAllTools((prev) => [normalizedTool, ...prev]);
    setUpvotes((prev) => ({ ...prev, [normalizedTool.name]: 1 }));
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
    if (stack) {
      handleRoleChange('all');
      setActiveCategory('ALL');
      setActiveStack(stack);
      setSearchTerm('');
      setPricingFilter('all');
      setShowFavorites(false);
    } else {
      setActiveStack(null);
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
    if (activeRole !== 'all') {
      result = result.filter((t) => toolMatchesRole(t, activeRole));
    }

    // 3. Category filter
    if (activeCategory !== 'ALL') {
      result = result.filter((t) => t.category === activeCategory);
    }

    // 4. Pricing filter
    if (pricingFilter !== 'all') {
      result = result.filter((t) => t.pricing === pricingFilter);
    }

    // 5. Favorites filter
    if (showFavorites) {
      result = result.filter((t) => bookmarks.has(t.name));
    }

    // 6. Search keyword
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // 7. Sorting. Free and open-source tools are the default path through the catalog.
    return [...result].sort((a, b) => {
      if (sortBy === 'free-first') {
        const pricingRank = { free: 0, freemium: 1, paid: 2 };
        const priceDifference = (pricingRank[a.pricing] ?? 3) - (pricingRank[b.pricing] ?? 3);
        if (priceDifference !== 0) return priceDifference;
        if (a.openSource !== b.openSource) return a.openSource ? -1 : 1;
        return (upvotes[b.name] || 0) - (upvotes[a.name] || 0);
      }
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
  }, [allTools, activeStack, activeRole, activeCategory, pricingFilter, showFavorites, searchTerm, sortBy, upvotes, bookmarks]);

  const featuredTools = useMemo(() => {
    const pricingRank = { free: 0, freemium: 1, paid: 2 };
    return allTools
      .filter((t) => t.featured)
      .sort((a, b) => (pricingRank[a.pricing] ?? 3) - (pricingRank[b.pricing] ?? 3));
  }, [allTools]);

  const freeToolCount = useMemo(() => allTools.filter((tool) => tool.pricing === 'free').length, [allTools]);
  const openSourceCount = useMemo(() => allTools.filter((tool) => tool.openSource).length, [allTools]);

  const isDefaultView =
    activeCategory === 'ALL' &&
    activeRole === 'all' &&
    !searchTerm.trim() &&
    !activeStack &&
    pricingFilter === 'all' &&
    !showFavorites &&
    sortBy === 'free-first';

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Ambient Radial Spotlight Glow */}
      <div className="ambient-glow" />
      <div className="ambient-grid" />

      {/* Navigation Bar */}
      <MenuBar onOpenSubmit={() => setIsSubmitOpen(true)} toolCount={allTools.length} />

      {/* Editorial Hero */}
      <motion.section
        className="pt-32 pb-8 px-4 relative z-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] items-end gap-10">
            <div className="hero-copy max-w-3xl">
              <div className="hero-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.045] border border-white/[0.1] text-[11px] font-mono text-zinc-300 mb-6 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <span>FOR PEOPLE WHO MAKE THINGS</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-500">FREE TO START</span>
              </div>

              <h1 className="hero-title max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.055em] leading-[0.98] text-white mb-6">
                Tools worth keeping.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
                  For the work ahead.
                </span>
              </h1>

              <p className="hero-description text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
                A hand-picked list for building, designing, editing, and getting things out the door. Start with the free options and choose what actually fits.
              </p>

              <div className="hero-actions flex flex-wrap items-center gap-3">
                <a href="#tools" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-xl shadow-white/10 hover:bg-cyan-50 transition-colors">
                  See the tools <ArrowRight size={15} />
                </a>
                <button type="button" onClick={() => setIsSubmitOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.045] px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.09] transition-colors">
                  Add a tool
                </button>
              </div>
            </div>

            <div className="hero-stats grid grid-cols-3 lg:grid-cols-1 gap-2.5 lg:min-w-52">
              <div className="hero-stat rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl">
                <div className="text-2xl font-semibold tracking-tight text-white tabular-nums">{freeToolCount}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-emerald-300/80">free to start</div>
              </div>
              <div className="hero-stat rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl">
                <div className="text-2xl font-semibold tracking-tight text-white tabular-nums">{openSourceCount}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-cyan-300/80">open source</div>
              </div>
              <div className="hero-stat rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl">
                <div className="text-2xl font-semibold tracking-tight text-white tabular-nums">{categories.length}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-indigo-300/80">categories</div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-y border-white/[0.08] py-3">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={(cat) => {
                handleRoleChange('all');
                setActiveCategory(cat);
                setActiveStack(null);
              }}
              categoryCounts={categoryCounts}
              totalCount={allTools.length}
            />
          </div>
        </div>
      </motion.section>

      <div id="roles" className="scroll-mt-24">
        <RoleSwitcher
          tools={allTools}
          activeRole={activeRole}
          onChange={handleRoleChange}
        />
      </div>

      <RolePlaybook roleId={activeRole} tools={allTools} onSelectTool={setSelectedTool} />

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
        toolCount={allTools.length}
       />

      {/* Ready-made workflows */}
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
                handleRoleChange('all');
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
            {/* Hand-picked starting points */}
            {featuredTools.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.08]">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <h2 className="font-bold text-base text-zinc-100 tracking-tight">A few good places to start</h2>
                   <span className="text-[11px] font-mono text-zinc-500">// HAND-PICKED TOOLS</span>
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
                    : activeRole !== 'all'
                    ? `${roleOptions.find((role) => role.id === activeRole)?.label || 'Role'} Playbook`
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
              <span className="font-semibold tracking-[-0.02em] text-zinc-200">vibecode</span>
              <p className="text-[11px] text-zinc-500">Tools worth keeping</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium text-zinc-400">
            <a href="#tools" className="hover:text-white transition-colors">
              Tools
            </a>
            <a href="#stacks" className="hover:text-white transition-colors">
              Workflows
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
              <span>{freeToolCount} free · {openSourceCount} open source</span>
          </div>
        </div>
      </footer>

      {/* Modals with AnimatePresence orchestration for smooth enter & exit transitions */}
      <AnimatePresence>
        {selectedTool && (
          <ToolModal
            key="tool-modal"
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
            voteCount={upvotes[selectedTool.name] || 0}
            hasVoted={userVotes.has(selectedTool.name)}
            onUpvote={handleToggleUpvote}
            isBookmarked={bookmarks.has(selectedTool.name)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitOpen && (
          <SubmitModal
            key="submit-modal"
            isOpen={isSubmitOpen}
            onClose={() => setIsSubmitOpen(false)}
            onSubmitTool={handleSubmitTool}
          />
        )}
      </AnimatePresence>

      <ScrollToTop />
      </div>
    </MotionConfig>
  );
}
