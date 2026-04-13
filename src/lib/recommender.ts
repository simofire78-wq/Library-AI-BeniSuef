import type { BookWithUsage } from '@/lib/types';
import { getBookUsage } from '@/lib/types';

/**
 * Score a book against a reference (category + keywords + popularity)
 * Higher score = better match
 */
function scoreBook(
  candidate: BookWithUsage,
  refCategory: string,
  refKeywords: string[],
): number {
  let score = 0;

  // Category match: +3
  if (candidate.category === refCategory) score += 3;

  // Keyword overlap: +1 per match
  const candidateKeywords = candidate.keywords || [];
  for (const kw of refKeywords) {
    if (candidateKeywords.some((ck) => ck.toLowerCase() === kw.toLowerCase())) {
      score += 1;
    }
  }

  // Popularity boost: log scale of (views + downloads)
  const usage = getBookUsage(candidate);
  if (usage) {
    const popularity = (usage.views || 0) + (usage.downloads || 0);
    score += Math.log10(Math.max(popularity, 1)) * 0.5;
  }

  return score;
}

/**
 * Get top N recommendations for a given book
 */
export function getRecommendations(
  sourceBook: BookWithUsage,
  allBooks: BookWithUsage[],
  n = 5,
): BookWithUsage[] {
  return allBooks
    .filter((b) => b.id !== sourceBook.id)
    .map((b) => ({
      book: b,
      score: scoreBook(b, sourceBook.category, sourceBook.keywords || []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.book);
}

/**
 * Get top N recommendations based on a query (category + keywords)
 */
export function getRecommendationsByQuery(
  category: string,
  keywords: string[],
  allBooks: BookWithUsage[],
  n = 5,
): BookWithUsage[] {
  return allBooks
    .map((b) => ({
      book: b,
      score: scoreBook(b, category, keywords),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.book);
}

/**
 * Get top N most popular books by views
 */
export function getTopBooksByViews(
  books: BookWithUsage[],
  n = 10,
): BookWithUsage[] {
  return [...books]
    .sort((a, b) => {
      const aViews = getBookUsage(a)?.views || 0;
      const bViews = getBookUsage(b)?.views || 0;
      return bViews - aViews;
    })
    .slice(0, n);
}
