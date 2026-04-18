import { BookOpen, Eye, Download, Star, TrendingUp, ArrowLeft, Info, Target, BookMarked, Newspaper, Share2, Facebook, GraduationCap, Users, Clock, Globe, ExternalLink, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/StatCard';
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
    <div className="relative min-h-screen font-cairo overflow-x-hidden">
      
      {/* 🖼️ خلفية ذكية: واضحة في الفاتح وعميقة في الغامق */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 transition-all duration-500
                     opacity-[0.35] grayscale-[30%] contrast-[1.1] blur-[2px]          /* إعدادات الـ Light Mode: أوضح وأقوى */
                     dark:opacity-[0.25] dark:grayscale-[0%] dark:contrast-[1] dark:blur-[4px]" /* إعدادات الـ Dark Mode اللي عجبتك */
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        
        {/* طبقة حماية للنصوص: شفافة أكتر في الفاتح عشان الصورة تبان */}
        <div className="absolute inset-0 
                        bg-white/40 
                        dark:bg-transparent 
                        bg-gradient-to-b from-white/10 via-transparent to-white/20" />
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-20 relative z-10">

        {/* ── Hero ── */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none animate-pulse" />
          
          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="relative group shrink-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <img
                src={departmentLogo}
                alt="شعار قسم علوم المعلومات"
                className="relative h-32 w-32 rounded-full object-cover ring-4 ring-background shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="text-center sm:text-right space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                جامعة بني سويف — كلية الآداب
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">قسم علوم المعلومات</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-medium">
                بوابة مكتبة القسم الرقمية — ابحث في المجموعة، استعرض الرسائل العلمية، واحصل على توصيات مخصصة بمساعدة الذكاء الاصطناعي.
              </p>
              <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
                <Button size="lg" className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/20 hover:scale-105 transition-all" asChild>
                  <Link to="/search">
                    ابحث في المكتبة <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl px-8 h-12 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-all" asChild>
                  <Link to="/chatbot">اسأل المساعد الذكي</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1.5 bg-primary rounded-full"></div>
             <h2 className="text-2xl font-bold flex items-center gap-2">
               نظرة عامة على المجموعة
             </h2>
          </div>
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard title="إجمالي الكتب" value={stats.totalBooks.toLocaleString('ar-EG')} icon={BookOpen} description="في المجموعة" />
              <StatCard title="إجمالي المشاهدات" value={stats.totalViews.toLocaleString('ar-EG')} icon={Eye} description="عبر جميع الكتب" />
              <StatCard title="التحميلات" value={stats.totalDownloads.toLocaleString('ar-EG')} icon={Download} description="إجمالي التحميلات" />
              <StatCard title="متوسط التقييم" value={`${stats.avgRating} / 5`} icon={Star} description="تقييم المجتمع" />
            </div>
          ) : null}
        </div>

        {/* ── About Library ── */}
        <div className="rounded-[2rem] bg-card/30 backdrop-blur-md border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Info className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">عن مكتبة القسم</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group rounded-[1.5rem] bg-background/50 backdrop-blur-sm border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><BookOpen className="h-5 w-5" /></div>
                <h3 className="font-bold text-foreground text-lg">نظرة عامة</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-loose">
                مكتبة قسم علوم المعلومات بكلية الآداب — جامعة بني سويف مكتبة متخصصة تضم مجموعة ثرية من الكتب والرسائل العلمية والدوريات في مجال علم المكتبات وتقنية المعلومات، تخدم أعضاء هيئة التدريس وطلاب القسم في مراحله الدراسية المختلفة.
              </p>
            </div>
            <div className="group rounded-[1.5rem] bg-background/50 backdrop-blur-sm border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><BookMarked className="h-5 w-5" /></div>
                <h3 className="font-bold text-foreground text-lg">رسالة المكتبة</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-loose">
                توفير بيئة معلوماتية متكاملة تدعم التعليم والبحث العلمي في مجال علوم المعلومات، وتُسهم في تنمية المهارات البحثية لدى الطلاب والباحثين من خلال إتاحة المصادر العلمية المتنوعة.
              </p>
            </div>
            <div className="group rounded-[1.5rem] bg-background/50 backdrop-blur-sm border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Target className="h-5 w-5" /></div>
                <h3 className="font-bold text-foreground text-lg">أهداف المكتبة</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-3 leading-relaxed list-none">
                {[
                  'دعم المقررات الدراسية بمصادر معلومات متجددة',
                  'تنمية المجموعات الرقمية والمطبوعة',
                  'تقديم خدمات مكتبية متطورة للباحثين',
                  'تطوير مهارات البحث والاسترجاع الإلكتروني',
                ].map((obj) => (
                  <li key={obj} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary/60 shrink-0 group-hover:bg-primary transition-colors" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Top Books ── */}
        <div className="space-y-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              الأكثر قراءة هذا الشهر
            </h2>
            <Button variant="ghost" className="rounded-xl hover:bg-primary/10" asChild>
              <Link to="/search">مشاهدة الكل ←</Link>
            </Button>
          </div>
          {booksLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-80 w-56 shrink-0 rounded-[2rem]" />)}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar">
              {topBooks.map((book, index) => {
                const usage = getBookUsage(book);
                return (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    className="group relative shrink-0 w-60 snap-start"
                  >
                    <div className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-sm font-black shadow-lg ring-4 ring-background group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>

                    <div className="relative aspect-[3/4.2] w-full rounded-[1.8rem] overflow-hidden border border-border/50 shadow-sm group-hover:shadow-xl group-hover:border-primary/40 group-hover:-translate-y-2 transition-all duration-500">
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted/50 backdrop-blur-sm">
                          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-12">
                        <p className="text-white text-sm font-bold leading-relaxed line-clamp-2 drop-shadow-md">
                          {book.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-5 mt-4 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm border border-border/50">
                        <Eye className="h-4 w-4 text-primary/70" />
                        {(usage?.views ?? 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm border border-border/50">
                        <Download className="h-4 w-4 text-primary/70" />
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
        <div id="services" className="rounded-[2.5rem] bg-card/40 backdrop-blur-md border border-border/50 p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-10 text-center sm:text-right">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">خدمات المكتبة والقسم</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LIBRARY_SERVICES.map((service) => (
              <div key={service.title} className="group flex gap-5 rounded-[1.5rem] border border-border/50 bg-background/50 p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <service.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-bold text-foreground text-lg">{service.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── News & Category Wrap ── */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div id="news" className="lg:col-span-2 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Newspaper className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">أخبار القسم</h2>
                  <p className="text-sm text-muted-foreground mt-1">آخر أخبار القسم والمؤتمرات والفعاليات</p>
                </div>
              </div>
              <Button asChild variant="outline" className="rounded-xl gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors">
                <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                  صفحة القسم
                </a>
              </Button>
            </div>

            {fbPosts && fbPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {fbPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 rounded-[1.5rem] border border-border/50 bg-background/50 hover:border-primary/40 hover:shadow-md p-4 transition-all duration-300"
                  >
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt="صورة المنشور"
                        className="h-24 w-24 shrink-0 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-muted/50">
                        <ImageOff className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="flex flex-col justify-between min-w-0 py-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-loose">{post.text}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          {format(new Date(post.post_date), 'd MMM yyyy', { locale: ar })}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-3 w-3" /> عرض
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4 rounded-[1.5rem] border border-dashed border-border/50 bg-background/30">
                <Facebook className="h-12 w-12 opacity-20" />
                <p className="text-base font-medium">لا توجد منشورات حالياً</p>
              </div>
            )}
          </div>

          <div className="space-y-8 lg:col-span-1">
            {stats && (
              <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  تصفح حسب الفئة
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(stats.categoryCount).map(([cat, count]) => (
                    <Link
                      key={cat}
                      to={`/search?category=${encodeURIComponent(cat)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary px-4 py-2 text-sm font-medium transition-all group shadow-sm"
                    >
                      {cat}
                      <span className="text-xs opacity-70 group-hover:opacity-100 bg-foreground/10 px-1.5 py-0.5 rounded-full">
                        {count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div id="social" className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                تواصل مع القسم
              </h2>
              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-[1.5rem] border border-border/50 bg-background/50 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 px-6 py-5 transition-all duration-300 group shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2]/10 text-[#1877F2] group-hover:scale-110 group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                  <Facebook className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">فيسبوك</p>
                  <p className="text-sm text-muted-foreground mt-0.5">الصفحة الرسمية للقسم</p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div> 
    </div> 
  );
}