import Fuse from 'fuse.js';
import { KBArticle, COLLECTIONS_KB } from '../data/collections-kb';

const fuse = new Fuse(COLLECTIONS_KB, {
  keys: [
    { name: 'triggers', weight: 4 },
    { name: 'tags', weight: 3 },
    { name: 'title', weight: 2 },
    { name: 'titleTl', weight: 2 },
    { name: 'content', weight: 1 },
    { name: 'contentTl', weight: 1 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export interface SearchFilters {
  category?: KBArticle['category'];
  dpd?: number;
  phase?: string;
}

export function search(query: string, filters?: SearchFilters, limit = 5): KBArticle[] {
  let results = fuse.search(query).map((r) => r.item);

  if (filters?.category) results = results.filter((a) => a.category === filters.category);
  if (filters?.dpd !== undefined) {
    results = results.filter(
      (a) => !a.dpd || (a.dpd.min <= filters.dpd! && filters.dpd! <= a.dpd.max)
    );
  }
  if (filters?.phase) {
    results = results.filter((a) => !a.phase || a.phase === filters.phase);
  }

  return results.slice(0, limit);
}

export function getByTrigger(utterance: string, enableOps = false): KBArticle[] {
  const lower = utterance.toLowerCase();
  return COLLECTIONS_KB.filter((article) => {
    if (article.phase === '1B' && !enableOps) return false;
    return article.triggers.some((t) => lower.includes(t.toLowerCase()));
  }).slice(0, 3);
}

export function getAll(enableOps = false): KBArticle[] {
  return COLLECTIONS_KB.filter((a) => enableOps || a.phase !== '1B');
}
