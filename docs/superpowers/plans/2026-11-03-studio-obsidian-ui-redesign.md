# Studio Obsidian UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Let's Vibe Code directory into a world-class, premium developer tool discovery platform with an Obsidian/Linear dark glassmorphism aesthetic, instant loading, power-user keyboard search, sorting, bookmarking, and tool submissions.

**Architecture:** Client-side React 18 application powered by Vite, Tailwind CSS v4, and Framer Motion. State (upvotes, bookmarks, and user-submitted custom tools) persists seamlessly in `localStorage` with zero backend requirements.

**Tech Stack:** React 18, Vite 5, Tailwind CSS v4 (@tailwindcss/postcss), Framer Motion, Lucide React, LocalStorage.

**Spec:** [docs/superpowers/specs/2026-11-03-studio-obsidian-ui-redesign.md](file:///c:/Users/ccl15/Documents/obisidian/nothing%20i%20guess/vibecode/docs/superpowers/specs/2026-11-03-studio-obsidian-ui-redesign.md)

## Global Constraints
- Pure zinc/carbon obsidian dark palette (`#09090B`, `#111116`, `#181820`). No noisy scanlines or crosshair cursors.
- Zero artificial loading delays (`setLoading(false)` artificial timer removed).
- 100% responsive: Clean layout from mobile (360px) to ultra-wide displays.
- Local-first persistence: Upvotes, bookmarks, and submitted tools persist in `localStorage`.
- Zero build errors (`npm run build` must pass cleanly at every task).

## Review Focus
1. **Search & Focus Shortcut**: Pressing `/` or `Cmd/Ctrl+K` from anywhere in the window must smoothly focus the search input without typing the shortcut character into the input.
2. **Bookmarking / Favorites Stack**: Toggling the `★ Saved` filter must accurately show only user-bookmarked tools, and gracefully handle empty state ("No saved tools yet").
3. **Adaptive Grid Transition**: Browsing default `ALL` shows categorized sections; applying search, pricing filter, sort, or favorites flattens into a unified sorted grid without layout jumping.
4. **Submit Tool Flow**: Submitting a valid tool via `SubmitModal` must immediately add it to `localStorage` and display it in the catalog with a "Custom" badge.
5. **Mobile Viewports**: Navbar drawer and filter pills must scroll smoothly horizontally on mobile screens without overflowing the page width.

---

### Task 1: Global Theme Tokens, Typography & CSS Cleanup

**Files:**
- Modify: `vibecode/src/index.css`
- Modify: `vibecode/index.html`

**Interfaces:**
- Produces: Obsidian utility classes, glassmorphic card borders, removed CRT scanline overlay, standard pointer cursor.

- [ ] **Step 1: Update `index.html` Google Fonts**
  In `vibecode/index.html`:
  - Add Google Fonts link for `Plus Jakarta Sans` and `Inter` alongside `JetBrains Mono` for modern developer typography.

- [ ] **Step 2: Clean `index.css` & define Obsidian theme**
  In `vibecode/src/index.css`:
  - Remove `body::after` CRT scanline overlay and `cursor: crosshair`.
  - Remove retro polygon clip-paths.
  - Define custom scrollbar (subtle dark zinc track and thumb).
  - Add glassmorphism utility classes (`.glass-card`, `.glass-surface`, `.spotlight-card`).

- [ ] **Step 3: Verify build**
  Run: `npm --prefix "vibecode" run build`
  Expected: Exit code 0 with updated CSS bundle.

- [ ] **Step 4: Commit**
  ```bash
  git -C vibecode add src/index.css index.html
  git -C vibecode commit -m "style: remove crt scanlines and define studio obsidian theme tokens"
  ```

---

### Task 2: Modern Glass Navigation (`MenuBar.jsx`)

**Files:**
- Modify: `vibecode/src/components/MenuBar.jsx`

**Interfaces:**
- Consumes: `onOpenSubmit: () => void`, `toolCount: number`
- Produces: Floating frosted navbar with brand typography, live catalog count, GitHub repository link, and Submit Tool trigger.

- [ ] **Step 1: Refactor `MenuBar.jsx`**
  - Implement frosted floating navbar with `backdrop-blur-md bg-zinc-950/80 border-b border-white/[0.08]`.
  - Display logo with glowing terminal icon and "LET'S VIBE CODE".
  - Include live tool badge: `{toolCount} Tools Curated`.
  - Add "Submit Tool" action button triggering `onOpenSubmit`.
  - Add GitHub link leading to `https://github.com/MKJaswanth/LetsVibeCode.v.2`.
  - Provide smooth mobile hamburger menu with animated drawer.

- [ ] **Step 2: Verify build**
  Run: `npm --prefix "vibecode" run build`
  Expected: Exit code 0.

- [ ] **Step 3: Commit**
  ```bash
  git -C vibecode add src/components/MenuBar.jsx
  git -C vibecode commit -m "feat(nav): modernize menubar with frosted glass styling and live counter"
  ```

---

### Task 3: Power-User Search & Filter Controls (`FilterBar.jsx` & `CategoryTabs.jsx`)

**Files:**
- Modify: `vibecode/src/components/FilterBar.jsx`
- Modify: `vibecode/src/components/CategoryTabs.jsx`

**Interfaces:**
- Consumes: `searchTerm`, `setSearchTerm`, `pricingFilter`, `setPricingFilter`, `sortBy`, `setSortBy`, `showFavorites`, `setShowFavorites`, `favoriteCount`, `categories`, `activeCategory`, `setActiveCategory`, `categoryCounts`.
- Produces: Complete search and multi-facet filtering pipeline.

- [ ] **Step 1: Modernize `CategoryTabs.jsx`**
  - Render horizontal scrollable pill tabs for `ALL` + 9 categories.
  - Display count chips inside each pill (e.g. `Top Tier Coding · 29`).
  - Use smooth Framer Motion `layoutId="activeCategoryPill"` spring animation for active pill.

- [ ] **Step 2: Build enhanced `FilterBar.jsx`**
  - Implement search bar with leading search icon, clear button, and `/` shortcut chip.
  - Add pricing pills: `All`, `Free` (emerald), `Freemium` (amber), `Paid` (rose).
  - Add sort dropdown/pills: `Trending` (Flame icon) and `A-Z`.
  - Add `★ Saved ({favoriteCount})` toggle pill with active star glow.

- [ ] **Step 3: Verify build**
  Run: `npm --prefix "vibecode" run build`
  Expected: Exit code 0.

- [ ] **Step 4: Commit**
  ```bash
  git -C vibecode add src/components/FilterBar.jsx src/components/CategoryTabs.jsx
  git -C vibecode commit -m "feat(filter): implement power-user search, pricing pills, and category counts"
  ```

---

### Task 4: Obsidian Tool Cards & Refined Stacks (`ToolCard.jsx` & `SmartStacks.jsx`)

**Files:**
- Modify: `vibecode/src/components/ToolCard.jsx`
- Modify: `vibecode/src/components/SmartStacks.jsx`

**Interfaces:**
- Consumes: `tool`, `onClick`, `voteCount`, `hasVoted`, `onUpvote`, `isBookmarked`, `onToggleBookmark`, `onSelectStack`, `activeStack`.
- Produces: Polished interactive tool cards and workflow presets.

- [ ] **Step 1: Redesign `ToolCard.jsx`**
  - Replace clip-paths with `rounded-2xl` frosted cards (`bg-zinc-900/40 backdrop-blur-md border border-white/[0.08] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]`).
  - Header: Category-tinted initial icon, Tool Name, `Verified` badge (for popular tools), and pill pricing badge.
  - Body: 2-line clamped description (`text-zinc-400 text-sm leading-relaxed`).
  - Footer:
    - Upvote button with flame icon and count.
    - Bookmark star button with micro-animation and state toggle.
    - "Launch" link icon with direct external URL.
  - Card click opens `ToolModal`.

- [ ] **Step 2: Redesign `SmartStacks.jsx`**
  - Restyle Student Protocol, Startup Engine, and Creator Suite into sleek glass cards.
  - Display active border indicator and tool tags cleanly.
  - Smooth hover lift with Framer Motion.

- [ ] **Step 3: Verify build**
  Run: `npm --prefix "vibecode" run build`
  Expected: Exit code 0.

- [ ] **Step 4: Commit**
  ```bash
  git -C vibecode add src/components/ToolCard.jsx src/components/SmartStacks.jsx
  git -C vibecode commit -m "feat(cards): implement studio obsidian tool cards and smart stacks"
  ```

---

### Task 5: Tool Detail Modal & Interactive Submit Modal (`ToolModal.jsx` & `SubmitModal.jsx`)

**Files:**
- Modify: `vibecode/src/components/ToolModal.jsx`
- Create: `vibecode/src/components/SubmitModal.jsx`

**Interfaces:**
- Consumes: `selectedTool`, `onClose`, `voteCount`, `hasVoted`, `onUpvote`, `isBookmarked`, `onToggleBookmark`, `isOpen`, `onSubmitTool`.
- Produces: Modal dialogs for detailed tool inspection and community tool submissions.

- [ ] **Step 1: Redesign `ToolModal.jsx`**
  - Backdrop blur modal with `rounded-2xl` dialog window.
  - Clean header: Tool Name, category pill, pricing pill, and external link button.
  - Body: Full description, vibe score analysis bar, curated developer pros & cons.
  - Footer: "Visit Website" button + "Copy Link" button with instant toast confirmation.

- [ ] **Step 2: Create `SubmitModal.jsx`**
  - Modal form fields: Tool Name, Website URL, Category (dropdown with 9 categories), Pricing Tier (`free`, `freemium`, `paid`), Short Description.
  - Input validation: Requires valid URL, name, and description.
  - On submit: Calls `onSubmitTool(newToolData)` which persists to `localStorage` and closes modal with success toast.

- [ ] **Step 3: Verify build**
  Run: `npm --prefix "vibecode" run build`
  Expected: Exit code 0.

- [ ] **Step 4: Commit**
  ```bash
  git -C vibecode add src/components/ToolModal.jsx src/components/SubmitModal.jsx
  git -C vibecode commit -m "feat(modals): polish tool details and create interactive submit modal"
  ```

---

### Task 6: App Orchestration, Instant Loading & Keyboard Shortcuts (`App.jsx`)

**Files:**
- Modify: `vibecode/src/App.jsx`

**Interfaces:**
- Consumes: All components from Tasks 1-5, `tools.js`.
- Produces: Unified application shell with instant hydration, search filtering, sorting, bookmarking, and local persistence.

- [ ] **Step 1: Eliminate artificial loading timer**
  - Remove `loading` state delay so the application renders immediately.

- [ ] **Step 2: Implement persistent state management**
  - Load `customTools` from `localStorage.getItem('letsvibe_custom_tools')` and merge with static `tools`.
  - Load `bookmarks` from `localStorage.getItem('letsvibe_bookmarks')`.
  - Implement `handleToggleBookmark(toolName)`.
  - Implement `handleSubmitTool(toolData)`: appends tool to `customTools`, saves to `localStorage`, and updates catalog.

- [ ] **Step 3: Add global keyboard shortcuts**
  - Add `keydown` event listener for `/` and `Cmd/Ctrl+K` to automatically focus the search input in `FilterBar`.

- [ ] **Step 4: Implement adaptive grid rendering**
  - When active filters exist (search term, pricing filter, sorting by Trending/A-Z, or favorites active): Render a flat responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
  - When in default state (`ALL`, no search, no pricing filter): Group tools by clean category headers.

- [ ] **Step 5: Modernize hero & footer**
  - Crisp hero section with ambient glow and quick feature tags.
  - Minimalist developer footer with credits and direct links.

- [ ] **Step 6: Run production build and verify**
  Run: `npm --prefix "vibecode" run build`
  Expected: Exit code 0.

- [ ] **Step 7: Commit**
  ```bash
  git -C vibecode add src/App.jsx
  git -C vibecode commit -m "feat(app): orchestrate studio obsidian app shell with instant load and shortcuts"
  ```

