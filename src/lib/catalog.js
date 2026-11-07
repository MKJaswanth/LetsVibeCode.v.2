import { roles, toolMatchesRole } from '../data/roles';
import { workflows, workflowToolNames } from '../data/workflows';

export const PRICING_RANK = { free: 0, freemium: 1, paid: 2 };

export const PRICING_LABELS = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
};

export const DEFAULT_FILTERS = {
  query: '',
  category: 'all',
  role: 'all',
  workflow: null,
  pricing: 'all',
  openSource: false,
  saved: false,
};

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const roleLabels = Object.fromEntries(roles.map((role) => [role.id, role.label]));

function haystack(tool) {
  return [
    tool.name,
    tool.desc,
    tool.category,
    tool.surface,
    tool.execution,
    tool.bestFor,
    PRICING_LABELS[tool.pricing],
    tool.openSource ? 'open source oss self-hosted' : '',
    ...(tool.roles || []).map((id) => roleLabels[id] || id),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

// Every word in the query must appear somewhere in the tool's text.
export function matchesQuery(tool, query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack(tool);
  return words.every((word) => text.includes(word));
}

// Higher is better. Used to rank command palette results.
export function scoreTool(tool, query) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const name = tool.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.split(/[\s./-]+/).some((part) => part.startsWith(q))) return 65;
  if (name.includes(q)) return 55;
  if (!matchesQuery(tool, q)) return -1;
  return 20 + (tool.featured ? 5 : 0) + (tool.popular ? 3 : 0) - (PRICING_RANK[tool.pricing] ?? 3);
}

export function compareFreeFirst(a, b) {
  const price = (PRICING_RANK[a.pricing] ?? 3) - (PRICING_RANK[b.pricing] ?? 3);
  if (price !== 0) return price;
  if (a.openSource !== b.openSource) return a.openSource ? -1 : 1;
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  if (Boolean(a.popular) !== Boolean(b.popular)) return a.popular ? -1 : 1;
  return 0;
}

export function sortTools(list, sortBy) {
  const copy = [...list];
  if (sortBy === 'alpha') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort(compareFreeFirst);
}

export function filterTools(tools, filters, savedNames) {
  const workflow = filters.workflow ? workflows.find((item) => item.id === filters.workflow) : null;
  const workflowNames = workflow ? new Set(workflowToolNames(workflow)) : null;

  return tools.filter((tool) => {
    if (workflowNames && !workflowNames.has(tool.name)) return false;
    if (filters.role !== 'all' && !toolMatchesRole(tool, filters.role)) return false;
    if (filters.category !== 'all' && tool.category !== filters.category) return false;
    if (filters.pricing !== 'all' && tool.pricing !== filters.pricing) return false;
    if (filters.openSource && !tool.openSource) return false;
    if (filters.saved && !savedNames.has(tool.name)) return false;
    if (filters.query && !matchesQuery(tool, filters.query)) return false;
    return true;
  });
}

export const hasActiveFilters = (filters) =>
  Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key]);

// Same category first, then tools that share a role. Free tools rank higher.
export function similarTools(tool, tools, limit = 4) {
  const roleSet = new Set(tool.roles || []);
  return tools
    .filter((other) => other.name !== tool.name)
    .map((other) => {
      let score = 0;
      if (other.category === tool.category) score += 4;
      score += (other.roles || []).filter((role) => roleSet.has(role)).length;
      return { other, score };
    })
    .filter(({ score }) => score >= 4)
    .sort((a, b) => b.score - a.score || compareFreeFirst(a.other, b.other))
    .slice(0, limit)
    .map(({ other }) => other);
}

export const workflowsForTool = (toolName) =>
  workflows.filter((workflow) => workflowToolNames(workflow).includes(toolName));

export function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// Human-readable list of active filters, used for removable chips.
export function activeChips(filters) {
  const chips = [];
  if (filters.query) chips.push({ key: 'query', label: `“${filters.query}”` });
  if (filters.role !== 'all') chips.push({ key: 'role', label: roleLabels[filters.role] });
  if (filters.workflow)
    chips.push({ key: 'workflow', label: workflows.find((w) => w.id === filters.workflow)?.name });
  if (filters.category !== 'all') chips.push({ key: 'category', label: filters.category });
  if (filters.pricing !== 'all') chips.push({ key: 'pricing', label: PRICING_LABELS[filters.pricing] });
  if (filters.openSource) chips.push({ key: 'openSource', label: 'Open source' });
  if (filters.saved) chips.push({ key: 'saved', label: 'Saved' });
  return chips;
}
