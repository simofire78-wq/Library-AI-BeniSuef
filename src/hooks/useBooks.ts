import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BookWithUsage } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

type ActivityStatsRow = {
  book_id: string;
  views: number | string | null;
  downloads: number | string | null;
  rating: number | string | null;
  rating_count: number | string | null;
};

type DailyActivityRow = {
  day: string;
  views: number | string | null;
  downloads: number | string | null;
  ratings: number | string | null;
};

type ActivityTypeTotalRow = {
  activity_type: string;
  total: number | string | null;
};

type NormalizedBookStats = {
  views: number;
  downloads: number;
  rating: number | null;
  rating_count: number;
};

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function normalizeBookStats(row?: Partial<ActivityStatsRow> | null): NormalizedBookStats {
  return {
    views: toNumber(row?.views),
    downloads: toNumber(row?.downloads),
    rating: row?.rating == null ? null : Number(row.rating),
    rating_count: toNumber(row?.rating_count),
  };
}

function createUsageRecord(bookId: string, row?: Partial<ActivityStatsRow> | null) {
  const stats = normalizeBookStats(row);
  return {
    id: `usage-${bookId}`,
    book_id: bookId,
    created_at: new Date(0).toISOString(),
    downloads: stats.downloads,
    rating: stats.rating,
    rating_count: stats.rating_count,
    user_id: null,
    views: stats.views,
  };
}

async function fetchBookActivityStats(bookId?: string): Promise<ActivityStatsRow[]> {
  const client = supabase as any;
  const { data, error } = await client.rpc('get_book_activity_stats', bookId ? { _book_id: bookId } : {});
  if (error) throw error;
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

function withUsageStats(books: any[], statsRows: ActivityStatsRow[]): BookWithUsage[] {
  const statsMap = new Map(statsRows.map((row) => [row.book_id, row]));

  return books.map((book) => ({
    ...book,
    book_usage: createUsageRecord(book.id, statsMap.get(book.id)),
  })) as BookWithUsage[];
}

function invalidateBookQueries(qc: ReturnType<typeof useQueryClient>, bookId: string) {
  qc.invalidateQueries({ queryKey: ['book', bookId], refetchType: 'all' });
  qc.invalidateQueries({ queryKey: ['books'], refetchType: 'all' });
  qc.invalidateQueries({ queryKey: ['stats'], refetchType: 'all' });
  qc.invalidateQueries({ queryKey: ['user-activity'], refetchType: 'all' });
  qc.invalidateQueries({ queryKey: ['my-book-rating', bookId], refetchType: 'all' });
}

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async (): Promise<BookWithUsage[]> => {
      const [{ data: books, error: booksError }, statsRows] = await Promise.all([
        supabase.from('books').select('*').order('title'),
        fetchBookActivityStats(),
      ]);

      if (booksError) throw booksError;
      return withUsageStats(books || [], statsRows);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async (): Promise<BookWithUsage | null> => {
      const [{ data: book, error }, statsRows] = await Promise.all([
        supabase.from('books').select('*').eq('id', id).single(),
        fetchBookActivityStats(id),
      ]);

      if (error) throw error;
      if (!book) return null;

      return {
        ...book,
        book_usage: createUsageRecord(book.id, statsRows[0]),
      } as BookWithUsage;
    },
    enabled: !!id,
  });
}

export function useMyBookRating(bookId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-book-rating', bookId, user?.id],
    enabled: !!bookId && !!user,
    queryFn: async (): Promise<number | null> => {
      const client = supabase as any;
      const { data, error } = await client
        .from('user_activities')
        .select('rating')
        .eq('book_id', bookId)
        .eq('user_id', user!.id)
        .eq('activity_type', 'rating')
        .maybeSingle();

      if (error) throw error;
      return data?.rating == null ? null : Number(data.rating);
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const client = supabase as any;

      const [booksRes, usageRes, dailyRes, typesRes] = await Promise.all([
        supabase.from('books').select('id, category, year'),
        fetchBookActivityStats(),
        client.rpc('get_activity_daily_stats', { _days: 30 }),
        client.rpc('get_activity_type_totals'),
      ]);

      if (booksRes.error) throw booksRes.error;

      const books = booksRes.data || [];
      const usage = usageRes;
      const normalizedUsage = usage.map((row) => normalizeBookStats(row));

      const totalViews = normalizedUsage.reduce((s, u) => s + u.views, 0);
      const totalDownloads = normalizedUsage.reduce((s, u) => s + u.downloads, 0);
      const totalRatingCount = normalizedUsage.reduce((s, u) => s + u.rating_count, 0);
      const weightedRatingSum = normalizedUsage.reduce(
        (s, u) => s + ((u.rating ?? 0) * u.rating_count),
        0,
      );
      const avgRating = totalRatingCount > 0 ? weightedRatingSum / totalRatingCount : 0;

      const activityDaily = ((dailyRes.data || []) as DailyActivityRow[]).map((row) => ({
        day: row.day,
        views: toNumber(row.views),
        downloads: toNumber(row.downloads),
        ratings: toNumber(row.ratings),
      }));

      const activityTypeTotals = ((typesRes.data || []) as ActivityTypeTotalRow[]).map((row) => ({
        activity_type: row.activity_type,
        total: toNumber(row.total),
      }));

      const categoryCount: Record<string, number> = {};
      books.forEach((b) => {
        categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
      });

      const yearCount: Record<number, number> = {};
      books.forEach((b) => {
        yearCount[b.year] = (yearCount[b.year] || 0) + 1;
      });

      return {
        totalBooks: books.length,
        totalViews,
        totalDownloads,
        avgRating: Math.round(avgRating * 10) / 10,
        categoryCount,
        yearCount,
        activityDaily,
        activityTypeTotals,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useIncrementViews(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const client = supabase as any;
      const { error } = await client.rpc('record_book_activity', {
        _book_id: bookId,
        _activity_type: 'view',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateBookQueries(qc, bookId);
    },
  });
}

export function useIncrementDownloads(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const client = supabase as any;
      const { error } = await client.rpc('record_book_activity', {
        _book_id: bookId,
        _activity_type: 'download',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateBookQueries(qc, bookId);
    },
  });
}

export function useSubmitRating(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (stars: number) => {
      const client = supabase as any;
      const { error } = await client.rpc('upsert_book_rating', {
        _book_id: bookId,
        _rating: stars,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateBookQueries(qc, bookId);
    },
  });
}
