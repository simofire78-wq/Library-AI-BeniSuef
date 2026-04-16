import { GraduationCap, Users, Heart, Facebook, Info, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-[#0b1120] border-t border-border mt-20 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* العمود الأول: نبذة ذكية عن المشروع */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary">منصة IS-Insights | بصيرة المعلومات</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify">
              أول بوابة رقمية ذكية لقسم علوم المعلومات بجامعة بني سويف. يرتكز المشروع على "توظيف أدوات الذكاء الاصطناعي وتحليل البيانات في دعم اتخاذ القرار لمؤسسات المعلومات"، من خلال تقديم مساعد ذكي (IQ Assistant) ولوحات تحكم تحليلية شاملة لمؤشرات الاستخدام والتقييم.
            </p>
          </div>

          {/* العمود الثاني: فريق التطوير (8 طلاب) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">تيم تطوير المشروع</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">إسلام ربيع (تيم ليدر)</span>
              <span>أحمد حسين</span>
              <span>مريم محمد</span>
              <span>روان سليمان</span>
              <span>شيماء ربيع</span>
              <span>دعاء عطية</span>
              <span>مريم حمدي</span>
              <span>غادة عبد الحميد</span>
            </div>
          </div>

          {/* العمود الثالث: الإشراف العلمي */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">تحت إشراف</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex flex-col border-r-2 border-primary/20 pr-3">
                <span className="text-sm font-bold text-foreground">د/ وسام الوكيل</span>
                <span className="text-[11px] text-muted-foreground italic">دكتور بقسم علوم المعلومات</span>
              </li>
              <li className="flex flex-col border-r-2 border-primary/20 pr-3">
                <span className="text-sm font-bold text-foreground">د/ اميرة محمد</span>
                <span className="text-[11px] text-muted-foreground italic">دكتور بقسم علوم المعلومات</span>
              </li>
            </ul>
          </div>

        </div>

        {/* الجزء السفلي: تفاصيل المؤسسة */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            صنع بكل <Heart className="h-3 w-3 text-red-500 fill-red-500" /> ضمن مشروع تخرج دفعة 2026
          </p>
          <div className="flex items-center gap-6 text-[11px] text-muted-foreground font-bold">
            <span className="hover:text-primary transition-colors">جامعة بني سويف</span>
            <span className="hover:text-primary transition-colors">كلية الآداب</span>
            <span className="hover:text-primary transition-colors">قسم علوم المعلومات</span>
          </div>
        </div>
      </div>
    </footer>
  );
};