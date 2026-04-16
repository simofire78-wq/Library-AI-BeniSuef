import { BookOpen, Target, BookMarked, Info, GraduationCap, Award, Users, MapPin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

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

      {/* Staff Section - Large Image Cards with Colorize Effect */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">القامات الأكاديمية والفريق الإداري</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {staff.map((member, index) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }} // يبدأ الأنيميشن لما يظهر 30% من الكارت
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
              whileHover={{ y: -15, transition: { duration: 0.25 } }}
              className="flex flex-col items-center text-center rounded-3xl border border-border bg-background p-6 hover:border-primary/40 
                         hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group cursor-pointer"
            >
              {/* الصورة الكبيرة مع تأثير الأبيض والأسود/الألوان */}
              <div className="w-40 h-40 rounded-full border-8 border-primary/10 group-hover:border-primary/20 
                              shadow-xl relative overflow-hidden mb-6 transition-all duration-300">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover transition-all duration-500 
                               grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 
                                  text-primary text-4xl font-bold grayscale group-hover:grayscale-0">
                    {member.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                )}
                {/* تأثير "وميض" خفيف عند الهوفر */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </div>

              {/* المعلومات الأساسية */}
              <div className="space-y-2 relative z-10 w-full">
                <p className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] flex items-center justify-center px-2">
                  {member.name}
                </p>
                
                <p className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                  {member.role}
                </p>
                
                {member.specialization && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2 min-h-[2.5rem] italic">
                    {member.specialization}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني بشكل شيك */}
              {member.email && (
                <div className="border-t border-border mt-5 pt-4 w-full text-center">
                  <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 justify-center transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{member.email}</span>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
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