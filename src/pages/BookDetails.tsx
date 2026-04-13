import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Star, Eye, Download, Calendar, Globe, Tag, BookOpen, FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { BookCard } from '@/components/BookCard';
import { useBook, useBooks, useIncrementViews, useIncrementDownloads, useMyBookRating, useSubmitRating } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';
import { getRecommendations } from '@/lib/recommender';
import { getBookUsage } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: book, isLoading } = useBook(id!);
  const { data: allBooks } = useBooks();
  const { data: myRating } = useMyBookRating(id!);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  const incrementViews = useIncrementViews(id!);
  const incrementDownloads = useIncrementDownloads(id!);
  const submitRating = useSubmitRating(id!);

  useEffect(() => {
    setSubmittedRating(myRating ?? null);
  }, [id, myRating]);

  const recommendations =
    book && allBooks ? getRecommendations(book, allBooks, 5) : [];

  const handleDownload = () => {
    if (!user) {
      toast.info('يرجى تسجيل الدخول لتحميل الملف');
      navigate(`/auth?returnTo=/book/${id}`);
      return;
    }
    if (!book?.pdf_url) return;
    incrementDownloads.mutate(undefined, {
      onError: () => toast.error('تعذر تسجيل التحميل حالياً'),
    });
    window.open(book.pdf_url, '_blank');
  };

  const handleView = () => {
    if (!book?.pdf_url) return;
    incrementViews.mutate(undefined, {
      onError: () => toast.error('تعذر تسجيل المشاهدة حالياً'),
    });
    window.open(book.pdf_url, '_blank');
  };

  const handleRate = (stars: number) => {
    if (!user) {
      toast.info('يرجى تسجيل الدخول لتقييم هذه الرسالة');
      navigate(`/auth?returnTo=/book/${id}`);
      return;
    }

    const hadPreviousRating = submittedRating !== null;

    submitRating.mutate(stars, {
      onSuccess: () => {
        setSubmittedRating(stars);
        toast.success(
          hadPreviousRating
            ? `تم تحديث تقييمك إلى ${stars} من 5`
            : `شكراً! تقييمك ${stars} من 5 تم تسجيله`,
        );
      },
      onError: () => toast.error('تعذر حفظ التقييم حالياً'),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-lg font-medium">الرسالة غير موجودة</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/search">← العودة للبحث</Link>
        </Button>
      </div>
    );
  }

  const usage = getBookUsage(book);
  const starDisplay = hoveredStar ?? submittedRating ?? 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/search">
          <ArrowRight className="h-4 w-4 ml-1" /> العودة للبحث
        </Link>
      </Button>

      {/* Book Hero */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book cover */}
          <div className="shrink-0 self-start">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-48 w-36 rounded-xl object-cover border border-border shadow-sm" />
            ) : (
              <div className="flex h-48 w-36 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-14 w-14 text-primary/40" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold leading-tight">{book.title}</h1>
              <p className="text-lg text-muted-foreground mt-1">{book.author}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{book.category}</Badge>
              <Badge variant="outline">
                <Calendar className="h-3 w-3 ml-1" />
                {book.year}
              </Badge>
              <Badge variant="outline">
                <Globe className="h-3 w-3 ml-1" />
                {book.language}
              </Badge>
            </div>

            {book.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">{book.description}</p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-primary" />
                <span className="font-semibold">{(usage?.views ?? 0).toLocaleString('ar-EG')}</span>
                <span className="text-muted-foreground">مشاهدة</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4 text-primary" />
                <span className="font-semibold">{(usage?.downloads ?? 0).toLocaleString('ar-EG')}</span>
                <span className="text-muted-foreground">تحميل</span>
              </div>
              {usage?.rating != null && usage.rating > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{usage.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    / 5.0
                    {usage.rating_count ? ` (${usage.rating_count} تقييم)` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* PDF Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="default" size="sm" onClick={handleView} disabled={!book.pdf_url} className="gap-2">
                <FileText className="h-4 w-4" />
                عرض PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!book.pdf_url} className="gap-2">
                <Download className="h-4 w-4" />
                تحميل PDF
              </Button>
              {!book.pdf_url && (
                <span className="text-xs text-muted-foreground self-center">ملف PDF غير متاح بعد</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          {submittedRating !== null ? 'تقييمك لهذه الرسالة' : 'قيّم هذه الرسالة'}
        </h2>

        {/* Show global average */}
        {usage?.rating != null && usage.rating > 0 && (
          <p className="text-sm text-muted-foreground">
            متوسط التقييم العام: <span className="font-semibold text-foreground">{usage.rating.toFixed(1)}</span> / 5.0
            {usage.rating_count ? ` — من ${usage.rating_count} تقييم` : ''}
          </p>
        )}

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              disabled={submitRating.isPending}
              className={cn(
                'p-1 transition-transform',
                'hover:scale-110',
                user ? 'cursor-pointer' : 'cursor-pointer opacity-90',
                submitRating.isPending && 'pointer-events-none opacity-70',
              )}
              aria-label={`${star} نجوم`}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  star <= starDisplay
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-muted text-muted-foreground/30',
                )}
              />
            </button>
          ))}
          {submittedRating !== null && (
            <span className="mr-3 text-sm text-muted-foreground">
              تقييمك الحالي: {submittedRating} من 5 نجوم
            </span>
          )}
        </div>
        {!user && submittedRating === null && (
          <p className="text-xs text-muted-foreground">يجب تسجيل الدخول لتقييم الرسالة</p>
        )}
        {user && (
          <p className="text-xs text-muted-foreground">
            {submittedRating !== null ? 'يمكنك تعديل تقييمك في أي وقت' : 'اضغط على نجمة لتسجيل تقييمك'}
          </p>
        )}
      </div>

      {/* Keywords */}
      {book.keywords && book.keywords.length > 0 && (
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-primary" /> الكلمات المفتاحية
          </h2>
          <div className="flex flex-wrap gap-2">
            {book.keywords.map((kw) => (
              <Link
                key={kw}
                to={`/search?q=${encodeURIComponent(kw)}`}
                className="rounded-full bg-muted hover:bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4">قد يعجبك أيضاً</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <BookCard key={rec.id} book={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
