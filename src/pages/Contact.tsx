import { Phone, Mail, MapPin, Clock, Facebook, MessageSquare, Send, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/17xV8oopHB/';

const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'هاتف القسم',
    value: '082-2324567',
    sub: 'السبت — الخميس، 9 ص — 3 م',
  },
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'infosci@arts.bsu.edu.eg',
    sub: 'يُرد على الرسائل خلال 48 ساعة',
  },
  {
    icon: MapPin,
    title: 'العنوان',
    value: 'كلية الآداب — جامعة بني سويف',
    sub: 'شارع صلاح سالم — بني سويف',
  },
  {
    icon: Globe,
    title: 'الموقع الإلكتروني للجامعة',
    value: 'www.bsu.edu.eg',
    sub: 'البوابة الرسمية لجامعة بني سويف',
    href: 'https://www.bsu.edu.eg',
  },
];

const FAQ = [
  {
    q: 'كيف يمكنني الاستعارة من المكتبة؟',
    a: 'يمكنك الاستعارة بتقديم بطاقة الطالب لأمين المكتبة. الطلاب مسموح لهم باستعارة كتابين في آنٍ واحد لمدة أسبوعين قابلة للتجديد.',
  },
  {
    q: 'هل يمكنني الوصول إلى قواعد البيانات من خارج الجامعة؟',
    a: 'نعم، يمكن الوصول عن بُعد لقواعد البيانات المشترك فيها عبر نظام VPN الجامعي أو من خلال بوابة المكتبة الرقمية للمستخدمين المسجلين.',
  },
  {
    q: 'كيف أتقدم لتسجيل رسالتي في المستودع الرقمي؟',
    a: 'بعد اعتماد الرسالة، يُرجى التواصل مع أمين المكتبة لتسليم نسخة رقمية وورقية. ستتم الفهرسة والإتاحة خلال أسبوعين.',
  },
  {
    q: 'ما هي مدة صلاحية بطاقة المكتبة؟',
    a: 'تصدر بطاقة المكتبة سنوياً وتتجدد مع بداية كل عام أكاديمي. يُرجى مراجعة مكتب الدراسة لإجراءات التجديد.',
  },
];

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setFormData(p => ({ ...p, email: user.email! }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from('messages').insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });
    setSending(false);
    if (error) {
      toast.error('حدث خطأ أثناء إرسال الرسالة');
      return;
    }
    toast.success('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.');
    setFormData({ name: '', email: user?.email ?? '', subject: '', message: '' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">تواصل معنا</h1>
            <p className="text-sm text-muted-foreground">نحن هنا للإجابة على استفساراتك ومساعدتك</p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          لا تتردد في التواصل مع فريق مكتبة قسم علوم المعلومات لأي استفسار أو طلب مساعدة. يسعدنا خدمتك.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">معلومات التواصل</h2>
          <div className="space-y-3">
            {CONTACT_INFO.map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary mb-0.5">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-medium text-sm hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium text-sm">{item.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-sm mb-4">تابعنا على منصات التواصل</h3>
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 px-4 py-3 transition-colors group w-full"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877F2] text-white group-hover:scale-110 transition-transform">
                <Facebook className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">فيسبوك</p>
                <p className="text-xs text-muted-foreground">صفحة قسم علوم المعلومات الرسمية</p>
              </div>
            </a>
          </div>

          {/* Hours */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">مواعيد الاستقبال</h3>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { day: 'السبت — الأربعاء', time: '9:00 ص — 3:00 م' },
                { day: 'الخميس', time: '9:00 ص — 1:00 م' },
                { day: 'الجمعة', time: 'إجازة' },
              ].map((h) => (
                <div key={h.day} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className={`font-medium ${h.time === 'إجازة' ? 'text-destructive' : 'text-foreground'}`}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  placeholder="محمد أحمد..."
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@bsu.edu.eg"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  disabled={!!user?.email}
                />
                {user?.email && (
                  <p className="text-xs text-muted-foreground">تم تعبئة بريدك تلقائياً</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">الموضوع</Label>
              <Input
                id="subject"
                placeholder="موضوع رسالتك..."
                value={formData.subject}
                onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">الرسالة</Label>
              <Textarea
                id="message"
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={sending}>
              <Send className="h-4 w-4" />
              {sending ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
            </Button>
          </form>

          {/* FAQ */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">الأسئلة الشائعة</h3>
            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <p className="font-medium text-sm mb-1.5">{item.q}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
