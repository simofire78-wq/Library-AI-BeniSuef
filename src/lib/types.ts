import type { Database } from '@/integrations/supabase/types';

export type Book = Database['public']['Tables']['books']['Row'] & { pdf_url?: string | null };
export type BookUsage = Database['public']['Tables']['book_usage']['Row'] & { rating_count?: number };
export type BookWithUsage = Book & { book_usage?: BookUsage | BookUsage[] | null };

/** Normalize book_usage which may come as object (oneToOne) or array */
export function getBookUsage(book: BookWithUsage): BookUsage | undefined {
  if (!book.book_usage) return undefined;
  if (Array.isArray(book.book_usage)) return book.book_usage[0];
  return book.book_usage;
}
