import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BookCard } from '@/components/BookCard';
import { useBooks } from '@/hooks/useBooks';
import { getBookUsage } from '@/lib/types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const { data: books, isLoading } = useBooks();

  // Derive categories dynamically from actual data
  const categories = useMemo(() => {
    if (!books) return ['الكل'];
    const cats = [...new Set(books.map((b) => b.category))].sort();
    return ['الكل', ...cats];
  }, [books]);

  // Derive languages dynamically
  const languages = useMemo(() => {
    if (!books) return ['الكل'];
    const langs = [...new Set(books.map((b) => b.language))].sort();
    return ['الكل', ...langs];
  }, [books]);

  const LANG_AR: Record<string, string> = {
    'الكل': 'الكل',
    'Arabic': 'العربية',
    'English': 'الإنجليزية',
    'French': 'الفرنسية',
  };

  const rawCategory = searchParams.get('category') || 'الكل';
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(rawCategory);
  const [language, setLanguage] = useState('الكل');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'views' | 'rating'>('title');

  useEffect(() => {
    const raw = searchParams.get('category') || 'الكل';
    setCategory(raw);
    const q = searchParams.get('q') || '';
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!books) return [];
    let result = [...books];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.keywords || []).some((kw) => kw.toLowerCase().includes(q)) ||
          (b.description || '').toLowerCase().includes(q),
      );
    }

    if (category !== 'الكل') {
      result = result.filter((b) => b.category === category);
    }

    if (language !== 'الكل') {
      result = result.filter((b) => b.language === language);
    }

    if (yearFrom) result = result.filter((b) => b.year >= parseInt(yearFrom));
    if (yearTo) result = result.filter((b) => b.year <= parseInt(yearTo));

    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'ar');
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'views') return (getBookUsage(b)?.views || 0) - (getBookUsage(a)?.views || 0);
      if (sortBy === 'rating') return (getBookUsage(b)?.rating || 0) - (getBookUsage(a)?.rating || 0);
      return 0;
    });

    return result;
  }, [books, query, category, language, yearFrom, yearTo, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setCategory('الكل');
    setLanguage('الكل');
    setYearFrom('');
    setYearTo('');
    setSortBy('title');
  };

  const hasFilters = query || category !== 'الكل' || language !== 'الكل' || yearFrom || yearTo;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <SearchIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">البحث في الرسائل العلمية</h1>
            <p className="text-sm text-muted-foreground">
              ابحث بين {books?.length || 0} رسالة بالعنوان أو المؤلف أو الفئة أو الكلمة المفتاحية
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pr-10"
            placeholder="ابحث بالعنوان أو المؤلف أو الكلمة المفتاحية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setQuery('')}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="اللغة" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>{LANG_AR[l] || l}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="number" placeholder="من سنة" className="w-28" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} />
          <Input type="number" placeholder="إلى سنة" className="w-28" value={yearTo} onChange={(e) => setYearTo(e.target.value)} />

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">العنوان أ-ي</SelectItem>
              <SelectItem value="year">الأحدث أولاً</SelectItem>
              <SelectItem value="views">الأكثر مشاهدة</SelectItem>
              <SelectItem value="rating">الأعلى تقييماً</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 ml-1" /> مسح الفلاتر
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{filtered.length} نتيجة</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">لا توجد رسائل</p>
              <p className="text-sm mt-1">حاول تعديل الفلاتر أو مصطلح البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
