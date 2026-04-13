import { BookOpen, Eye, Download, Star, TrendingUp, ArrowLeft, Info, Target, BookMarked, Newspaper, Share2, Facebook, GraduationCap, Users, Clock, Globe, ExternalLink, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/StatCard';
import { BookCard } from '@/components/BookCard';
import { useStats, useBooks } from '@/hooks/useBooks';
import { useFacebookPosts } from '@/hooks/useFacebookPosts';
import { getTopBooksByViews } from '@/lib/recommender';
import { getBookUsage } from '@/lib/types';
import departmentLogo from '@/assets/department-logo.jpg';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/BSU.InfoSciDept';

const LIBRARY_SERVICES = [
  { icon: BookOpen, title: 'الإعارة الداخلية والخارجية', desc: 'خدمة إعارة الكتب والمراجع لأعضاء هيئة التدريس والطلاب' },
  { icon: Globe, title: 'الوصول الرقمي', desc: 'الوصول إلى قواعد البيانات الإلكترونية والمجلات العلمية المحكّمة' },
  { icon: GraduationCap, title: 'خدمة الرسائل العلمية', desc: 'إتاحة رسائل الماجستير والدكتوراه للقسم بشكل رقمي ومطبوع' },
  { icon: Users, title: 'خدمة الإرشاد المكتبي', desc: 'مساعدة الباحثين في البحث والاستدلال على المصادر' },
  { icon: Clock, title: 'خدمة الإعارة بين المكتبات', desc: 'تسهيل الحصول على المواد من مكتبات جامعية أخرى' },
  { icon: BookMarked, title: 'خدمة الفهرسة والتصنيف', desc: 'تنظيم المجموعات وفق أنظمة دولية معتمدة' },
];

export default function Index() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: fbPosts } = useFacebookPosts();

  const topBooks = books ? getTopBooksByViews(books, 10) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">

      {/* ── Hero ── */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={departmentLogo}
            alt="شعار قسم علوم المعلومات"
            className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/30 shadow-lg shrink-0"
          />
          <div className="text-center sm:text-right">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">جامعة بني سويف — كلية الآداب</p>
            <h1 className="text-3xl font-bold tracking-tight">قسم علوم المعلومات</h1>
            <p className="text-muted-foreground mt-2 text-base max-w-xl">
              بوابة مكتبة القسم الرقمية — ابحث في المجموعة، استعرض الرسائل العلمية، واحصل على توصيات مخصصة بمساعدة الذكاء الاصطناعي.
            </p>
            <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
              <Button asChild>
                <Link to="/search">
                  ابحث في المكتبة <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/chatbot">اسأل المساعد الذكي</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          نظرة عامة على المجموعة
        </h2>
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="إجمالي الكتب" value={stats.totalBooks.toLocaleString('ar-EG')} icon={BookOpen} description="في المجموعة" />
            <StatCard title="إجمالي المشاهدات" value={stats.totalViews.toLocaleString('ar-EG')} icon={Eye} description="عبر جميع الكتب" />
            <StatCard title="التحميلات" value={stats.totalDownloads.toLocaleString('ar-EG')} icon={Download} description="إجمالي التحميلات" />
            <StatCard title="متوسط التقييم" value={`${stats.avgRating} / 5`} icon={Star} description="تقييم المجتمع" />
          </div>
        ) : null}
      </div>

      {/* ── About Library ── */}
      <div id="about" className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Info className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">عن مكتبة القسم</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Overview */}
          <div className="rounded-xl bg-accent/40 border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">نظرة عامة</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              مكتبة قسم علوم المعلومات بكلية الآداب — جامعة بني سويف مكتبة متخصصة تضم مجموعة ثرية من الكتب والرسائل العلمية والدوريات في مجال علم المكتبات وتقنية المعلومات، تخدم أعضاء هيئة التدريس وطلاب القسم في مراحله الدراسية المختلفة.
            </p>
          </div>
          {/* Mission */}
          <div className="rounded-xl bg-accent/40 border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">رسالة المكتبة</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              توفير بيئة معلوماتية متكاملة تدعم التعليم والبحث العلمي في مجال علوم المعلومات، وتُسهم في تنمية المهارات البحثية لدى الطلاب والباحثين من خلال إتاحة المصادر العلمية المتنوعة.
            </p>
          </div>
          {/* Objectives */}
          <div className="rounded-xl bg-accent/40 border border-border p-5 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">أهداف المكتبة</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed list-none">
              {[
                'دعم المقررات الدراسية بمصادر معلومات متجددة',
                'تنمية المجموعات الرقمية والمطبوعة',
                'تقديم خدمات مكتبية متطورة للباحثين',
                'تطوير مهارات البحث والاسترجاع الإلكتروني',
              ].map((obj) => (
                <li key={obj} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Top Books ── */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            الأكثر قراءة هذا الشهر
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/search">مشاهدة الكل ←</Link>
          </Button>
        </div>
        {booksLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-72 w-56 shrink-0 rounded-xl" />)}
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin" style={{ scrollbarColor: 'hsl(var(--border)) transparent' }}>
            {topBooks.map((book, index) => {
              const usage = getBookUsage(book);
              return (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="group relative shrink-0 w-56 snap-start"
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Cover Image */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all duration-300">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Gradient overlay with title */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                      <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
                        {book.title}
                      </p>
                    </div>
                  </div>

                  {/* Stats below card */}
                  <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {(usage?.views ?? 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {(usage?.downloads ?? 0).toLocaleString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Library Services ── */}
      <div id="services" className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">خدمات المكتبة والقسم</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIBRARY_SERVICES.map((service) => (
            <div key={service.title} className="flex gap-4 rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <service.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{service.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── News ── */}
      <div id="news" className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">أخبار القسم</h2>
              <p className="text-xs text-muted-foreground">آخر أخبار القسم والمؤتمرات والفعاليات</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
              صفحة القسم على فيسبوك
            </a>
          </Button>
        </div>
        {fbPosts && fbPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {fbPosts.map((post) => (
              <a
                key={post.id}
                href={post.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 p-4 transition-colors"
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="صورة المنشور"
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <ImageOff className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col justify-between min-w-0">
                  <p className="text-sm text-foreground line-clamp-3 leading-relaxed">{post.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(post.post_date), 'd MMM yyyy', { locale: ar })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-primary group-hover:underline">
                      <ExternalLink className="h-3 w-3" />
                      عرض
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3 rounded-xl border border-dashed border-border bg-background">
            <Facebook className="h-10 w-10 opacity-30" />
            <p className="text-sm">لا توجد منشورات حالياً</p>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
                تابعنا على فيسبوك
              </a>
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center mt-4">
          للاطلاع على جميع الأخبار والفعاليات، تفضل بزيارة{' '}
          <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            صفحة القسم الرسمية على فيسبوك
          </a>
        </p>
      </div>

      {/* ── Category Quick Links ── */}
      {stats && (
        <div>
          <h2 className="text-lg font-semibold mb-4">تصفح حسب الفئة</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.categoryCount).map(([cat, count]) => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 hover:bg-primary/10 hover:border-primary/40 px-4 py-1.5 text-sm font-medium transition-colors"
              >
                {cat}
                <span className="text-muted-foreground text-xs">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Social Media ── */}
      <div id="social" className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Share2 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">تواصل مع القسم</h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 px-6 py-4 transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
              <Facebook className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">فيسبوك</p>
              <p className="text-xs text-muted-foreground">صفحة قسم علوم المعلومات</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  );
}
