import { Newspaper, Facebook, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/17xV8oopHB/';

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'انطلاق الفصل الدراسي الثاني للعام الأكاديمي 2024/2025',
    date: '2025-02-15',
    category: 'أكاديمي',
    content: 'يُعلن قسم علوم المعلومات عن بدء الفصل الدراسي الثاني وفتح باب التسجيل في المقررات الاختيارية. يُرجى مراجعة جداول المحاضرات المنشورة على لوحة الإعلانات.',
    tag: 'هام',
  },
  {
    id: 2,
    title: 'ورشة عمل: مهارات البحث العلمي ومصادر المعلومات الإلكترونية',
    date: '2025-01-28',
    category: 'ورش عمل',
    content: 'نظّم القسم ورشة عمل متخصصة حول توظيف مهارات البحث العلمي والاستفادة من قواعد البيانات الأكاديمية، وقد حضرها أكثر من ٦٠ طالباً وباحثاً.',
    tag: 'ورشة',
  },
  {
    id: 3,
    title: 'إضافة ١٥ مرجعاً جديداً لمجموعة المكتبة',
    date: '2025-01-10',
    category: 'مكتبة',
    content: 'تم إضافة ١٥ كتاباً ومرجعاً جديداً في مجالات علم المكتبات، إدارة المعرفة، وأمن المعلومات. تتوفر هذه الإصدارات للاستعارة فوراً من قاعة المكتبة.',
    tag: 'جديد',
  },
  {
    id: 4,
    title: 'إعلان نتائج مناقشة رسالة الماجستير للباحث أحمد كريم',
    date: '2024-12-20',
    category: 'أبحاث',
    content: 'أجرى القسم مناقشة رسالة الماجستير المقدمة من الباحث أحمد كريم بعنوان "توظيف الذكاء الاصطناعي في أنظمة استرجاع المعلومات"، وقد نال درجة الامتياز بمرتبة الشرف.',
    tag: 'مناقشة',
  },
  {
    id: 5,
    title: 'مشاركة أعضاء القسم في المؤتمر الدولي للمكتبات',
    date: '2024-12-05',
    category: 'مؤتمرات',
    content: 'شارك عدد من أعضاء هيئة تدريس القسم في المؤتمر الدولي السنوي للمكتبات ومراكز المعلومات المنعقد بالقاهرة، وقدموا أوراقاً بحثية حول مستقبل خدمات المعلومات.',
    tag: 'مؤتمر',
  },
  {
    id: 6,
    title: 'تجديد الاشتراك في قاعدة بيانات LISTA للعام 2025',
    date: '2024-11-18',
    category: 'مكتبة',
    content: 'تم تجديد اشتراك المكتبة في قاعدة بيانات LISTA التخصصية لعام 2025، مما يتيح الوصول لآلاف المقالات العلمية المحكّمة في مجال علوم المعلومات.',
    tag: 'خدمة',
  },
];

const TAG_COLORS: Record<string, string> = {
  'هام': 'bg-destructive/10 text-destructive border-destructive/30',
  'ورشة': 'bg-primary/10 text-primary border-primary/30',
  'جديد': 'bg-green-500/10 text-green-700 border-green-500/30',
  'مناقشة': 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  'مؤتمر': 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  'خدمة': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
};

export default function News() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
              <Newspaper className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">أخبار القسم</h1>
              <p className="text-sm text-muted-foreground">آخر أخبار القسم والمؤتمرات والأنشطة الأكاديمية</p>
            </div>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
              صفحة القسم على فيسبوك
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {NEWS_ITEMS.map((item) => (
          <article key={item.id} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[item.tag] || ''}`}>
                {item.tag}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(item.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <h3 className="font-bold text-base mb-2 leading-snug">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">{item.category}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Facebook Feed */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877F2] text-white">
            <Facebook className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">تابعنا على فيسبوك</h2>
            <p className="text-xs text-muted-foreground">للاطلاع على أحدث الأخبار والفعاليات لحظةً بلحظة</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-border bg-background">
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PAGE_URL)}&tabs=timeline&width=800&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&locale=ar_AR`}
            width="100%"
            height="500"
            className="block"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="صفحة فيسبوك قسم علوم المعلومات"
          />
        </div>
      </div>

    </div>
  );
}
