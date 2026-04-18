import { GraduationCap, Users, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      className="mt-20 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent pt-20 transition-colors duration-300 relative z-10" 
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* العمود الأول: الهوية الجديدة واللوجو الذكي */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-slate-900 p-1 rounded-lg shadow-lg border border-primary/20">
                {/* استبدال الأيقونة بلوجو الروبوت الذكي */}
                <img 
                  src="/logo.png" 
                  alt="InfoPlus+ Logo" 
                  className="h-10 w-10 object-contain" 
                />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                InfoPlus<span className="text-primary">+</span>
                <span className="block text-sm font-bold text-primary mt-1">إنـفـو-بـلس</span>
              </h3>
            </div>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            المنصة الرقمية الذكية الأولى لقسم علوم المعلومات بجامعة بني سويف؛ صُممت لتكون حلقة الوصل المتطورة التي تدمج بين الأرصدة المعلوماتية وبين تقنيات الذكاء الاصطناعي وتحليل البيانات، بهدف تقديم رؤى استباقية ودعم فعال لاتخاذ القرار.
            </p>
          </div>

          {/* العمود الثاني: فريق التطوير (نفس التنسيق المعتمد) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-r-4 border-primary pr-3">
               فريق التصميم
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <span className="text-primary font-bold text-sm underline decoration-primary/30 underline-offset-4">إسلام ربيع (Leader)</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">أحمد حسين</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">مريم محمد</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">روان سليمان</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">شيماء ربيع</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">دعاء عطية</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">مريم حمدي</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">غادة عبد الحميد</span>
            </div>
          </div>

          {/* العمود الثالث: الإشراف العلمي */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-r-4 border-primary pr-3">
               تحت إشراف
            </h3>
            <div className="space-y-5">
              <div className="flex flex-col bg-white/50 dark:bg-white/5 p-3 rounded-md border border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">د/ وسام الوكيل</span>
                <span className="text-xs text-primary font-medium">عضو هيئة التدريس بالقسم</span>
              </div>
              <div className="flex flex-col bg-white/50 dark:bg-white/5 p-3 rounded-md border border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">د/ أميرة محمد</span>
                <span className="text-xs text-primary font-medium">عضو هيئة التدريس بالقسم</span>
              </div>
            </div>
          </div>
        </div>

        {/* الجزء السفلي: الحقوق والجامعة */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-500 flex items-center gap-2 bg-slate-200/50 dark:bg-slate-900 px-4 py-2 rounded-full">
             مشروع تخرج دفعة 2026 <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <span>جامعة بني سويف</span>
            <span className="text-primary">•</span>
            <span>كلية الآداب</span>
            <span className="text-primary">•</span>
            <span>قسم علوم المعلومات</span>
          </div>
        </div>
      </div>
    </footer>
  );
};