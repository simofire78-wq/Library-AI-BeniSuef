import { BookOpen, Globe, GraduationCap, Users, Clock, BookMarked, Search, FileText, Printer, Wifi, ChevronRight } from 'lucide-react';

const MAIN_SERVICES = [
  {
    icon: BookOpen,
    title: 'الإعارة الداخلية والخارجية',
    desc: 'خدمة إعارة الكتب والمراجع لأعضاء هيئة التدريس والطلاب المسجلين في القسم، مع إمكانية الإعارة الخارجية لفترات محددة.',
    details: ['إعارة داخلية بدون قيود زمنية', 'إعارة خارجية لمدة أسبوعين قابلة للتجديد', 'إعارة خاصة لأعضاء هيئة التدريس لمدة شهر'],
  },
  {
    icon: Globe,
    title: 'الوصول الرقمي',
    desc: 'الوصول إلى قواعد البيانات الإلكترونية والمجلات العلمية المحكّمة والدوريات الدولية المتخصصة في علوم المعلومات.',
    details: ['قاعدة بيانات LISTA من EBSCO', 'الدوريات المحلية المتاحة إلكترونياً', 'مستودع الرسائل الجامعية الرقمي'],
  },
  {
    icon: GraduationCap,
    title: 'خدمة الرسائل العلمية',
    desc: 'إتاحة رسائل الماجستير والدكتوراه للقسم بشكل رقمي ومطبوع، مع خدمات البحث والاسترجاع المتخصصة.',
    details: ['فهرسة كاملة لجميع الرسائل', 'نسخ رقمية متاحة للاطلاع', 'خدمة تصوير وطباعة الفصول'],
  },
  {
    icon: Users,
    title: 'خدمة الإرشاد المكتبي',
    desc: 'مساعدة الباحثين والطلاب في البحث والاستدلال على المصادر المناسبة لاحتياجاتهم البحثية.',
    details: ['إرشاد فردي للباحثين', 'ورش عمل البحث الأكاديمي', 'دليل استخدام قواعد البيانات'],
  },
  {
    icon: Clock,
    title: 'خدمة الإعارة بين المكتبات',
    desc: 'تسهيل الحصول على المواد التي لا تتوفر في المكتبة من مكتبات جامعية أخرى عبر شبكة التعاون المكتبي.',
    details: ['التنسيق مع مكتبة جامعة القاهرة', 'التنسيق مع مكتبة جامعة عين شمس', 'طلبات الاسترداد خلال 3-5 أيام عمل'],
  },
  {
    icon: BookMarked,
    title: 'خدمة الفهرسة والتصنيف',
    desc: 'تنظيم المجموعات وفق أنظمة دولية معتمدة لضمان الوصول السهل والسريع إلى المصادر المطلوبة.',
    details: ['نظام ديوي للتصنيف العشري', 'قواعد الفهرسة الأنجلو-أمريكية AACR2', 'ترميز MARC21 للفهرسة الإلكترونية'],
  },
];

const ADDITIONAL_SERVICES = [
  { icon: Search, title: 'البحث الببليوغرافي', desc: 'إعداد قوائم المصادر والمراجع للأبحاث والرسائل' },
  { icon: FileText, title: 'خدمة الاستنساخ', desc: 'تصوير وطباعة الفصول والمقالات العلمية' },
  { icon: Printer, title: 'خدمة الطباعة', desc: 'طباعة ملفات PDF والوثائق الإلكترونية' },
  { icon: Wifi, title: 'الإنترنت المجاني', desc: 'اتصال واي-فاي مجاني داخل قاعة المكتبة' },
];

export default function Services() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">خدمات المكتبة</h1>
            <p className="text-sm text-muted-foreground">تعرّف على الخدمات المتاحة لأعضاء القسم والباحثين</p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          تقدم مكتبة قسم علوم المعلومات مجموعة متكاملة من الخدمات المكتبية والمعلوماتية لدعم العملية التعليمية والبحثية. يسعى فريق المكتبة دائماً لتقديم أفضل الخدمات بأحدث الأساليب.
        </p>
      </div>

      {/* Main Services */}
      <div>
        <h2 className="text-lg font-semibold mb-6">الخدمات الرئيسية</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MAIN_SERVICES.map((service) => (
            <div key={service.title} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
              <ul className="space-y-1.5">
                {service.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-lg font-semibold mb-6">خدمات إضافية</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADDITIONAL_SERVICES.map((service) => (
            <div key={service.title} className="flex gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <service.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{service.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opening Hours */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">مواعيد العمل</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { days: 'السبت — الأربعاء', hours: '9:00 ص — 3:00 م', status: 'open', label: 'أيام العمل الرسمية' },
            { days: 'الخميس', hours: '9:00 ص — 1:00 م', status: 'limited', label: 'دوام مخفّف' },
            { days: 'الجمعة', hours: 'مغلق', status: 'closed', label: 'إجازة أسبوعية' },
          ].map((item) => (
            <div key={item.days} className="rounded-xl border border-border bg-accent/30 p-5 text-center">
              <p className="font-semibold text-sm mb-1">{item.days}</p>
              <p className={`text-lg font-bold ${item.status === 'closed' ? 'text-destructive' : 'text-primary'}`}>{item.hours}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
