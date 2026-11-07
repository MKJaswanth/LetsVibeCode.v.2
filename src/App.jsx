import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { tools as catalogTools } from './data/tools';
import { roles } from './data/roles';
import {
  DEFAULT_FILTERS,
  activeChips,
  compareFreeFirst,
  filterTools,
  hasActiveFilters,
  slugify,
  sortTools,
} from './lib/catalog';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterPanel from './components/FilterPanel';
import Toolbar from './components/Toolbar';
import ToolCard from './components/ToolCard';
import Workflows from './components/Workflows';
import { RoleBanner, WorkflowBanner } from './components/Banners';
import ToolPanel from './components/ToolPanel';
import CommandPalette from './components/CommandPalette';
import SubmitModal from './components/SubmitModal';
import MobileFilters from './components/MobileFilters';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const STORAGE = {
  custom: 'letsvibe_custom_tools',
  saved: 'letsvibe_bookmarks',
};

const CATEGORIES = [...new Set(catalogTools.map((tool) => tool.category))];

function readJson(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function loadCustomTools() {
  const known = new Set(catalogTools.map((tool) => tool.name.toLowerCase()));
  return readJson(STORAGE.custom)
    .filter((tool) => tool && typeof tool.name === 'string' && typeof tool.url === 'string')
    .filter((tool) => !known.has(tool.name.toLowerCase()))
    .map((tool) => ({
      ...tool,
      desc: tool.desc || '',
      category: CATEGORIES.includes(tool.category) ? tool.category : CATEGORIES[0],
      pricing: ['free', 'freemium', 'paid'].includes(tool.pricing) ? tool.pricing : 'freemium',
      roles: tool.roles?.length ? tool.roles : [],
      featured: false,
      isCustom: true,
    }));
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  return {
    role: roles.some((item) => item.id === role) ? role : 'all',
    toolSlug: params.get('tool'),
  };
}

const findBySlug = (tools, slug) => (slug ? tools.find((tool) => slugify(tool.name) === slug) || null : null);

function Section({ id, title, description, action, children }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export default function App() {
  const [customTools, setCustomTools] = useState(loadCustomTools);
  const allTools = useMemo(() => [...customTools, ...catalogTools], [customTools]);

  const [saved, setSaved] = useState(() => {
    const names = new Set([...catalogTools, ...loadCustomTools()].map((tool) => tool.name));
    return new Set(readJson(STORAGE.saved).filter((name) => names.has(name)));
  });

  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS, role: readUrl().role }));
  const [sortBy, setSortBy] = useState('free-first');
  const [openTool, setOpenTool] = useState(() => findBySlug(allTools, readUrl().toolSlug));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const anyDialogOpen = Boolean(openTool) || paletteOpen || submitOpen || filtersOpen;

  // ---- Persistence -------------------------------------------------------
  useEffect(() => {
    localStorage.setItem(STORAGE.saved, JSON.stringify([...saved]));
  }, [saved]);

  // ---- URL: ?role= and ?tool= are shareable --------------------------------
  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (key, value) => (value ? url.searchParams.set(key, value) : url.searchParams.delete(key));
    set('role', filters.role !== 'all' ? filters.role : null);
    set('tool', openTool ? slugify(openTool.name) : null);
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, '', next);
    }
  }, [filters.role, openTool]);

  useEffect(() => {
    const onPopState = () => {
      const { role, toolSlug } = readUrl();
      setFilters((prev) => ({ ...prev, role }));
      setOpenTool(findBySlug(allTools, toolSlug));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [allTools]);

  useEffect(() => {
    const role = roles.find((item) => item.id === filters.role);
    document.title = openTool
      ? `${openTool.name} · Let's Vibe Code`
      : role
        ? `AI tools for ${role.label.toLowerCase()} · Let's Vibe Code`
        : "Let's Vibe Code · AI tools worth your time";
  }, [filters.role, openTool]);

  // ---- Keyboard shortcuts ----------------------------------------------------
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (event.key !== '/' || anyDialogOpen) return;
      const tag = event.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target.isContentEditable) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [anyDialogOpen]);

  // ---- Filter helpers ----------------------------------------------------------
  // Bring the top of the results into view if the user has scrolled past it.
  const scrollToResults = useCallback((force = false) => {
    requestAnimationFrame(() => {
      const el = resultsRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      if (force || window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    });
  }, []);

  const setFilter = useCallback(
    (key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      if (key !== 'query') scrollToResults();
    },
    [scrollToResults]
  );

  const clearFilter = (key) => setFilter(key, DEFAULT_FILTERS[key]);
  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    scrollToResults();
  };

  const applyView = useCallback(
    (partial) => {
      setFilters({ ...DEFAULT_FILTERS, ...partial });
      setOpenTool(null);
      setPaletteOpen(false);
      scrollToResults(true);
    },
    [scrollToResults]
  );

  const openToolFromPalette = useCallback((tool) => {
    setPaletteOpen(false);
    setOpenTool(tool);
  }, []);

  const toggleSave = useCallback((name) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const addCustomTool = (tool) => {
    const next = [tool, ...readJson(STORAGE.custom)];
    localStorage.setItem(STORAGE.custom, JSON.stringify(next));
    setCustomTools(loadCustomTools());
  };

  // ---- Derived data ---------------------------------------------------------------
  const results = useMemo(
    () => sortTools(filterTools(allTools, filters, saved), sortBy),
    [allTools, filters, saved, sortBy]
  );

  // Category counts reflect every other active filter, so the numbers match what you'll see.
  const facetTools = useMemo(
    () => filterTools(allTools, { ...filters, category: 'all' }, saved),
    [allTools, filters, saved]
  );
  const categoryCounts = useMemo(() => {
    const counts = {};
    facetTools.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, [facetTools]);

  const freeCount = useMemo(() => allTools.filter((tool) => tool.pricing === 'free').length, [allTools]);

  // One featured pick per category, free first.
  const starters = useMemo(() => {
    const seen = new Set();
    return catalogTools
      .filter((tool) => tool.featured)
      .sort(compareFreeFirst)
      .filter((tool) => (seen.has(tool.category) ? false : seen.add(tool.category)))
      .slice(0, 6);
  }, []);

  const existingNames = useMemo(() => new Set(allTools.map((tool) => tool.name.toLowerCase())), [allTools]);
  const isDefaultView = !hasActiveFilters(filters) && sortBy === 'free-first';
  const activeFilterCount = activeChips(filters).filter((chip) => chip.key !== 'query').length;

  const card = (tool, showCategory = true) => (
    <ToolCard
      key={tool.name}
      tool={tool}
      onOpen={setOpenTool}
      isSaved={saved.has(tool.name)}
      onToggleSave={toggleSave}
      showCategory={showCategory}
    />
  );

  const panelProps = {
    filters,
    setFilter,
    categories: CATEGORIES,
    categoryCounts,
    totalCount: facetTools.length,
    savedCount: saved.size,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <a
          href="#results"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to tools
        </a>

        <Header
          savedCount={saved.size}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenSubmit={() => setSubmitOpen(true)}
          onShowSaved={() => applyView({ saved: true })}
          onShowWorkflows={() => {
            setFilters(DEFAULT_FILTERS);
            setSortBy('free-first');
            requestAnimationFrame(() =>
              document.getElementById('workflows')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            );
          }}
          onHome={() => {
            setFilters(DEFAULT_FILTERS);
            setSortBy('free-first');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <main className="flex-1">
          <Hero
            toolCount={allTools.length}
            freeCount={freeCount}
            activeRole={filters.role}
            onOpenPalette={() => setPaletteOpen(true)}
            onRoleChange={(role) => {
              setFilters((prev) => ({ ...prev, role, workflow: null }));
              if (role !== 'all') scrollToResults(true);
            }}
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[216px_minmax(0,1fr)] lg:gap-10">
            <aside className="hidden lg:block" aria-label="Filters">
              <div className="no-scrollbar sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-10 pt-6">
                <FilterPanel {...panelProps} />
              </div>
            </aside>

            <div id="results" ref={resultsRef} className="min-w-0 scroll-mt-14 pb-24">
              <Toolbar
                searchInputRef={searchInputRef}
                filters={filters}
                setFilter={setFilter}
                clearFilter={clearFilter}
                clearAll={clearAll}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resultCount={results.length}
                activeFilterCount={activeFilterCount}
                onOpenFilters={() => setFiltersOpen(true)}
              />

              {/* Category shortcuts for small screens; the sidebar covers this on desktop. */}
              <div className="fade-right no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden">
                {['all', ...CATEGORIES].map((category) => {
                  const active = filters.category === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter('category', category)}
                      className={`h-8 shrink-0 rounded-full border px-3.5 text-[13px] transition-colors ${
                        active ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:text-fg'
                      }`}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  );
                })}
              </div>

              {filters.role !== 'all' && (
                <RoleBanner
                  roleId={filters.role}
                  tools={allTools}
                  onOpenTool={setOpenTool}
                  onClose={() => setFilter('role', 'all')}
                />
              )}
              {filters.workflow && (
                <WorkflowBanner
                  workflowId={filters.workflow}
                  tools={allTools}
                  onOpenTool={setOpenTool}
                  onClose={() => setFilter('workflow', null)}
                />
              )}

              <div className="pt-8">
                {results.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
                    <h2 className="text-base font-medium text-fg">
                      {filters.saved && saved.size === 0 ? 'Nothing saved yet' : 'No tools match these filters'}
                    </h2>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                      {filters.saved && saved.size === 0
                        ? 'Use the bookmark icon on any tool to keep it here. Saved tools stay in this browser.'
                        : 'Try fewer words, or remove a filter or two.'}
                    </p>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="mt-6 h-9 rounded-lg bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-white"
                    >
                      {filters.saved && saved.size === 0 ? 'Browse all tools' : 'Clear filters'}
                    </button>
                  </div>
                ) : isDefaultView ? (
                  <div className="space-y-16">
                    {customTools.length > 0 && (
                      <Section title="Added by you" description="Saved in this browser only.">
                        <Grid>{customTools.map((tool) => card(tool))}</Grid>
                      </Section>
                    )}

                    <Section title="Start here" description="A strong first pick in six areas. All free.">
                      <Grid>{starters.map((tool) => card(tool))}</Grid>
                    </Section>

                    <Workflows tools={allTools} onSelect={(id) => applyView({ workflow: id })} />

                    {CATEGORIES.map((category) => {
                      const inCategory = results.filter((tool) => tool.category === category);
                      if (inCategory.length === 0) return null;
                      return (
                        <Section
                          key={category}
                          title={category}
                          description={`${inCategory.length} tools`}
                          action={
                            inCategory.length > 6 && (
                              <button
                                type="button"
                                onClick={() => setFilter('category', category)}
                                className="group inline-flex shrink-0 items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
                              >
                                See all
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                              </button>
                            )
                          }
                        >
                          <Grid>{inCategory.slice(0, 6).map((tool) => card(tool, false))}</Grid>
                        </Section>
                      );
                    })}
                  </div>
                ) : (
                  <Grid>{results.map((tool) => card(tool, filters.category === 'all'))}</Grid>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer toolCount={allTools.length} onOpenSubmit={() => setSubmitOpen(true)} />
        <ScrollToTop />

        <AnimatePresence>
          {openTool && (
            <ToolPanel
              key="tool-panel"
              tool={openTool}
              tools={allTools}
              isSaved={saved.has(openTool.name)}
              onToggleSave={toggleSave}
              onClose={() => setOpenTool(null)}
              onOpenTool={setOpenTool}
              onSelectWorkflow={(id) => applyView({ workflow: id })}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {paletteOpen && (
            <CommandPalette
              key="palette"
              tools={allTools}
              categories={CATEGORIES}
              onClose={() => setPaletteOpen(false)}
              onOpenTool={openToolFromPalette}
              onRunAction={applyView}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {submitOpen && (
            <SubmitModal
              key="submit"
              categories={CATEGORIES}
              existingNames={existingNames}
              onClose={() => setSubmitOpen(false)}
              onSubmitTool={addCustomTool}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {filtersOpen && (
            <MobileFilters
              key="filters"
              {...panelProps}
              onClose={() => setFiltersOpen(false)}
              resultCount={results.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onClearAll={() => setFilters(DEFAULT_FILTERS)}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
