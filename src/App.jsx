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
import { Terminal, Star, Github, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

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

    // 2. Role filter
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

    // 7. Sorting. Free and open-source tools first by default.
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
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col relative selection:bg-sky-500/20 selection:text-sky-200">
      {/* Navigation Bar */}
      <MenuBar onOpenSubmit={() => setIsSubmitOpen(true)} toolCount={allTools.length} />

      {/* Hero Section */}
      <section className="pt-28 pb-10 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/[0.08]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>CURATED DIRECTORY</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">FREE-FIRST</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] text-white leading-tight mb-4">
                Tools worth keeping.
              </h1>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                A hand-picked catalog for building, designing, and shipping software. Start with the free and open-source tools first.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#tools"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Browse Tools <ArrowRight size={14} />
                </a>
                <a
                  href="#stacks"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] transition-colors"
                >
                  <Layers size={13} className="text-sky-400" />
                  Explore Stacks
                </a>
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                >
                  Submit a Tool
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 sm:gap-6 bg-[#0e1118] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shrink-0">
              <div className="text-left">
                <div className="text-2xl font-semibold text-white tracking-tight tabular-nums">{allTools.length}</div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Cataloged</div>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" />
              <div className="text-left">
                <div className="text-2xl font-semibold text-emerald-400 tracking-tight tabular-nums">{freeToolCount}</div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Free to Start</div>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" />
              <div className="text-left">
                <div className="text-2xl font-semibold text-sky-400 tracking-tight tabular-nums">{openSourceCount}</div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Open Source</div>
              </div>
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div className="pt-4">
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
      </section>

      {/* Role Switcher */}
      <div id="roles" className="scroll-mt-20">
        <RoleSwitcher
          tools={allTools}
          activeRole={activeRole}
          onChange={handleRoleChange}
        />
      </div>

      {/* Role Playbook (Active when a role is selected) */}
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

      {/* Workflows / Smart Stacks */}
      <section id="stacks" className="scroll-mt-20">
        <SmartStacks onSelectStack={handleSelectStack} activeStack={activeStack?.id} />
      </section>

      {/* Main Tools Directory */}
      <main id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex-grow w-full mb-20 scroll-mt-20">
        {/* Empty State */}
        {filteredTools.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-[#0e1118] rounded-2xl p-8 border border-white/[0.08]">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
              <Terminal size={22} />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No tools match your criteria</h3>
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
          <div className="flex flex-col gap-12">
            {/* Featured Picks */}
            {featuredTools.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.08]">
                  <Star size={15} className="text-amber-400 fill-amber-400" />
                  <h2 className="font-semibold text-sm sm:text-base text-white tracking-tight">
                    Editor's Starting Points
                  </h2>
                  <span className="text-[11px] font-mono text-zinc-500">// HAND-PICKED BENCHMARKS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <h2 className="font-semibold text-sm sm:text-base text-white tracking-tight">{category}</h2>
                      <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.2 rounded border border-sky-500/20">
                        {categoryTools.length}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          /* Filtered or Sorted Flat View */
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm sm:text-base text-white tracking-tight">
                  {showFavorites
                    ? 'Saved Favorites'
                    : activeStack
                    ? `${activeStack.name} Workflow`
                    : activeRole !== 'all'
                    ? `${roleOptions.find((role) => role.id === activeRole)?.label || 'Role'} Playbook`
                    : activeCategory !== 'ALL'
                    ? activeCategory
                    : 'Search Results'}
                </h2>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.2 rounded border border-sky-500/20">
                  {filteredTools.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Developer Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080d] py-10 px-4 sm:px-6 relative z-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Terminal size={14} />
            </div>
            <div>
              <span className="font-semibold text-zinc-200">vibecode</span>
              <p className="text-[11px] text-zinc-500">Tools worth keeping</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium text-zinc-400">
            <a href="#roles" className="hover:text-white transition-colors">
              Roles
            </a>
            <a href="#stacks" className="hover:text-white transition-colors">
              Workflows
            </a>
            <a href="#tools" className="hover:text-white transition-colors">
              Tools
            </a>
            <button
              type="button"
              onClick={() => setIsSubmitOpen(true)}
              className="hover:text-white transition-colors"
            >
              Submit
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

      {/* Modals */}
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
  );
}
