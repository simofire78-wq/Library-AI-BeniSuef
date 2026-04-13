import { BookOpen, Target, BookMarked, Info, GraduationCap, Award, Users, MapPin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  email: string | null;
  specialization: string | null;
}

const OBJECTIVES = [
  'دعم المقررات الدراسية بمصادر معلومات متجددة ومتنوعة',
  'تنمية المجموعات الرقمية والمطبوعة وتحديثها باستمرار',
  'تقديم خدمات مكتبية متطورة للباحثين وأعضاء هيئة التدريس',
  'تطوير مهارات البحث والاسترجاع الإلكتروني لدى الطلاب',
  'تعزيز ثقافة البحث العلمي وتوثيق مصادره',
  'الحفاظ على التراث الفكري للقسم من رسائل ودراسات علمية',
];

const HISTORY = [
  { year: '1975', event: 'تأسيس قسم علوم المكتبات بكلية الآداب جامعة بني سويف' },
  { year: '1990', event: 'إضافة تخصص تقنية المعلومات وتطوير المناهج الدراسية' },
  { year: '2005', event: 'إطلاق أول نظام فهرسة إلكتروني للمجموعة المكتبية' },
  { year: '2015', event: 'تغيير المسمى إلى قسم علوم المعلومات مواكبةً للتطور التقني' },
  { year: '2020', event: 'إطلاق البوابة الرقمية للمكتبة وخدمات الوصول عن بُعد' },
  { year: '2024', event: 'إدراج الذكاء الاصطناعي ضمن مقررات القسم الدراسية' },
];

export default function About() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    supabase.from('staff').select('*').order('order_priority', { ascending: true }).then(({ data }) => {
      if (data) setStaff(data);
    });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">عن مكتبة القسم</h1>
            <p className="text-sm text-muted-foreground">قسم علوم المعلومات — كلية الآداب — جامعة بني سويف</p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          مكتبة قسم علوم المعلومات بكلية الآداب — جامعة بني سويف مكتبة متخصصة تضم مجموعة ثرية من الكتب والرسائل العلمية والدوريات في مجال علم المكتبات وتقنية المعلومات، تخدم أعضاء هيئة التدريس وطلاب القسم في مراحله الدراسية المختلفة.
        </p>
      </div>

      {/* Mission + Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">نظرة عامة</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            تأسست المكتبة منذ نشأة القسم وتطورت على مدار العقود لتواكب احتياجات الطلاب والباحثين. تحتوي حالياً على أكثر من ٨٢ مصدراً متخصصاً يشمل الكتب العلمية والرسائل الجامعية، فضلاً عن اشتراكات في قواعد بيانات إلكترونية متعددة.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>مبنى كلية الآداب — الدور الثاني — جامعة بني سويف</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookMarked className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">رسالة المكتبة</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            توفير بيئة معلوماتية متكاملة تدعم التعليم والبحث العلمي في مجال علوم المعلومات، وتُسهم في تنمية المهارات البحثية لدى الطلاب والباحثين من خلال إتاحة المصادر العلمية المتنوعة وخدمات المعلومات الاحترافية.
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">أهداف المكتبة</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {OBJECTIVES.map((obj, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Timeline */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">تاريخ القسم</h2>
        </div>
        <div className="relative">
          <div className="absolute right-[60px] top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {HISTORY.map((item) => (
              <div key={item.year} className="flex items-start gap-4">
                <div className="text-sm font-bold text-primary w-[52px] shrink-0 text-left pt-0.5">{item.year}</div>
                <div className="relative flex items-center justify-center w-4 h-4 shrink-0 mt-1">
                  <div className="h-3.5 w-3.5 rounded-full bg-primary shadow-sm z-10" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">فريق العمل</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center rounded-xl border border-border bg-background p-5 hover:border-primary/40 hover:shadow-md transition-all group">
              {member.image_url ? (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors mb-3"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold mb-3 border-2 border-primary/20">
                  {member.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
              )}
              <p className="font-semibold text-sm text-foreground">{member.name}</p>
              <p className="text-xs text-primary mt-0.5">{member.role}</p>
              {member.specialization && (
                <p className="text-xs text-muted-foreground mt-1">{member.specialization}</p>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-2 transition-colors">
                  <Mail className="h-3 w-3" />
                  {member.email}
                </a>
              )}
            </div>
          ))}
          {staff.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-8">لا توجد بيانات لفريق العمل حالياً</p>
          )}
        </div>
      </div>

      {/* Accreditation */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">الاعتماد الأكاديمي</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'الجهة المانحة', value: 'وزارة التعليم العالي — جمهورية مصر العربية' },
            { label: 'الاعتماد الأكاديمي', value: 'هيئة ضمان جودة التعليم والاعتماد (NAQAAE)' },
            { label: 'التصنيف', value: 'ضمن أفضل أقسام علوم المعلومات في جامعات الصعيد' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-accent/30 p-4">
              <p className="text-xs font-semibold text-primary mb-1">{item.label}</p>
              <p className="text-sm text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
