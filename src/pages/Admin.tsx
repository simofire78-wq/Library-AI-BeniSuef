import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/hooks/useBooks';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { useFacebookPosts, useCreateFacebookPost, useUpdateFacebookPost, useDeleteFacebookPost } from '@/hooks/useFacebookPosts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookOpen, BarChart3, Newspaper, Facebook, Plus, Pencil, Trash2,
  Eye, Download, Star, LogOut, Shield, X, Check, Calendar, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { BookWithUsage } from '@/lib/types';
import type { Announcement } from '@/hooks/useAnnouncements';
import type { FacebookPost } from '@/hooks/useFacebookPosts';

type Tab = 'books' | 'announcements' | 'facebook' | 'stats' | 'messages';

// ---------- Login Form ----------
function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) toast.error('بيانات الدخول غير صحيحة');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">لوحة الإدارة</h1>
            <p className="text-xs text-muted-foreground">يُرجى تسجيل الدخول أولاً</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">البريد الإلكتروني</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">كلمة المرور</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              dir="ltr"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{' '}
          <a href="/signup" className="text-primary hover:underline font-medium">
            إنشاء حساب جديد
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------- Book Edit Modal ----------
function BookEditModal({ book, onClose }: { book: BookWithUsage; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    year: book.year,
    language: book.language,
    description: book.description ?? '',
    pdf_url: book.pdf_url ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('books')
      .update({
        title: form.title,
        author: form.author,
        category: form.category,
        year: Number(form.year),
        language: form.language,
        description: form.description || null,
        pdf_url: form.pdf_url || null,
      })
      .eq('id', book.id);
    setSaving(false);
    if (error) { toast.error('فشل الحفظ: ' + error.message); return; }
    toast.success('تم تحديث بيانات الرسالة');
    qc.invalidateQueries({ queryKey: ['books'] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">تعديل الرسالة</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        {[
          { label: 'العنوان', key: 'title' },
          { label: 'المؤلف', key: 'author' },
          { label: 'التصنيف', key: 'category' },
          { label: 'السنة', key: 'year', type: 'number' },
          { label: 'اللغة', key: 'language' },
          { label: 'رابط PDF', key: 'pdf_url', dir: 'ltr' },
        ].map(({ label, key, type, dir }) => (
          <div key={key}>
            <label className="text-sm font-medium mb-1 block">{label}</label>
            <Input
              type={type ?? 'text'}
              value={String(form[key as keyof typeof form])}
              onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
              dir={dir}
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium mb-1 block">الوصف</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
            <Check className="h-4 w-4" /> {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </Button>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
        </div>
      </div>
    </div>
  );
}

// ---------- Announcement Form Modal ----------
function AnnouncementModal({ item, onClose }: { item?: Announcement; onClose: () => void }) {
  const createMut = useCreateAnnouncement();
  const updateMut = useUpdateAnnouncement();
  const isEdit = !!item;

  const [form, setForm] = useState({
    title: item?.title ?? '',
    description: item?.description ?? '',
    date: item?.date ?? new Date().toISOString().split('T')[0],
    type: item?.type ?? 'news' as 'news' | 'event',
    tag: item?.tag ?? '',
    location: item?.location ?? '',
    event_time: item?.event_time ?? '',
    capacity: item?.capacity ?? '' as number | '',
    registered: item?.registered ?? 0,
    is_upcoming: item?.is_upcoming ?? false,
    image: item?.image ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      type: form.type,
      tag: form.tag || null,
      location: form.location || null,
      event_time: form.event_time || null,
      capacity: form.capacity !== '' ? Number(form.capacity) : null,
      registered: Number(form.registered),
      is_upcoming: form.is_upcoming,
      image: form.image || null,
    };
    if (isEdit && item) {
      await updateMut.mutateAsync({ id: item.id, ...payload });
      toast.success('تم تحديث الإعلان');
    } else {
      await createMut.mutateAsync(payload);
      toast.success('تم إضافة الإعلان');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{isEdit ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">النوع</label>
            <div className="flex gap-2">
              {(['news', 'event'] as const).map(t => (
                <Button
                  key={t}
                  type="button"
                  variant={form.type === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setForm(p => ({ ...p, type: t }))}
                >
                  {t === 'news' ? 'خبر' : 'فعالية'}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">العنوان *</label>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">الوصف *</label>
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">التاريخ *</label>
              <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">التصنيف / البادج</label>
              <Input value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} placeholder="مثل: هام، جديد..." />
            </div>
          </div>
          {form.type === 'event' && (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">الموقع</label>
                <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">الوقت</label>
                  <Input value={form.event_time} onChange={e => setForm(p => ({ ...p, event_time: e.target.value }))} placeholder="10:00 ص" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">السعة</label>
                  <Input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value ? Number(e.target.value) : '' }))} dir="ltr" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_upcoming"
                  checked={form.is_upcoming}
                  onChange={e => setForm(p => ({ ...p, is_upcoming: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="is_upcoming" className="text-sm">فعالية قادمة</label>
              </div>
            </>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="flex-1 gap-2">
              <Check className="h-4 w-4" />
              {createMut.isPending || updateMut.isPending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Facebook Post Modal ----------
function FacebookPostModal({ post, onClose }: { post?: FacebookPost; onClose: () => void }) {
  const createMut = useCreateFacebookPost();
  const updateMut = useUpdateFacebookPost();
  const isEdit = !!post;

  const [form, setForm] = useState({
    text: post?.text ?? '',
    post_date: post?.post_date ?? new Date().toISOString().split('T')[0],
    image_url: post?.image_url ?? '',
    facebook_url: post?.facebook_url ?? 'https://www.facebook.com/BSU.InfoSciDept',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      text: form.text,
      post_date: form.post_date,
      image_url: form.image_url || null,
      facebook_url: form.facebook_url,
    };
    if (isEdit && post) {
      await updateMut.mutateAsync({ id: post.id, ...payload });
      toast.success('تم تحديث المنشور');
    } else {
      await createMut.mutateAsync(payload);
      toast.success('تم إضافة المنشور');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{isEdit ? 'تعديل المنشور' : 'إضافة منشور فيسبوك'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">نص المنشور *</label>
            <Textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={4} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">تاريخ المنشور *</label>
            <Input type="date" value={form.post_date} onChange={e => setForm(p => ({ ...p, post_date: e.target.value }))} required dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">رابط الصورة (اختياري)</label>
            <Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">رابط المنشور على فيسبوك</label>
            <Input value={form.facebook_url} onChange={e => setForm(p => ({ ...p, facebook_url: e.target.value }))} dir="ltr" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="flex-1 gap-2">
              <Check className="h-4 w-4" />
              {createMut.isPending || updateMut.isPending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ' : 'إضافة'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===========================
// Main Admin Page
// ===========================
export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('books');
  const [bookSearch, setBookSearch] = useState('');
  const [editingBook, setEditingBook] = useState<BookWithUsage | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | 'new' | null>(null);
  const [editingPost, setEditingPost] = useState<FacebookPost | 'new' | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);

  const qc = useQueryClient();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: announcements, isLoading: annLoading } = useAnnouncements();
  const { data: posts, isLoading: postsLoading } = useFacebookPosts();
  const deleteAnn = useDeleteAnnouncement();
  const deletePost = useDeleteFacebookPost();

  useEffect(() => {
    if (isAdmin && tab === 'messages') loadMessages();
  }, [isAdmin, tab]);

  const loadMessages = async () => {
    setMessagesLoading(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data ?? []);
    setMessagesLoading(false);
  };

  const handleMarkRead = async (id: string, currentRead: boolean) => {
    await supabase.from('messages').update({ is_read: !currentRead }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !currentRead } : m));
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('هل تريد حذف هذه الرسالة؟')) return;
    await supabase.from('messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
    toast.success('تم الحذف');
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    setReplySending(true);
    await supabase.from('messages').update({ admin_reply: replyText, replied_at: new Date().toISOString() }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, admin_reply: replyText, replied_at: new Date().toISOString() } : m));
    setReplyText('');
    setReplyingTo(null);
    setReplySending(false);
    toast.success('تم إرسال الرد');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">جارٍ التحميل...</div>
      </div>
    );
  }

  if (!user) return <LoginForm />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
          <p className="text-lg font-semibold">غير مصرح</p>
          <p className="text-muted-foreground text-sm">ليس لديك صلاحية الوصول لهذه الصفحة</p>
          <Button variant="outline" onClick={signOut}>تسجيل الخروج</Button>
        </div>
      </div>
    );
  }

  const filteredBooks = (books ?? []).filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const handleDeleteBook = async (id: string) => {
    if (!confirm('هل تريد حذف هذه الرسالة؟')) return;
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) { toast.error('فشل الحذف'); return; }
    toast.success('تم الحذف');
    qc.invalidateQueries({ queryKey: ['books'] });
  };

  const handleDeleteAnn = async (id: string) => {
    if (!confirm('هل تريد حذف هذا الإعلان؟')) return;
    await deleteAnn.mutateAsync(id);
    toast.success('تم الحذف');
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('هل تريد حذف هذا المنشور؟')) return;
    await deletePost.mutateAsync(id);
    toast.success('تم الحذف');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'books', label: 'الرسائل العلمية', icon: BookOpen },
    { id: 'announcements', label: 'الأخبار والفعاليات', icon: Newspaper },
    { id: 'facebook', label: 'منشورات فيسبوك', icon: Facebook },
    { id: 'messages', label: 'الرسائل الواردة', icon: Mail },
    { id: 'stats', label: 'إحصائيات الاستخدام', icon: BarChart3 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">لوحة الإدارة</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={signOut}>
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Button
            key={t.id}
            variant={tab === t.id ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={() => setTab(t.id)}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </Button>
        ))}
      </div>

      {/* ── Books Tab ── */}
      {tab === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="بحث في الرسائل..."
              value={bookSearch}
              onChange={e => setBookSearch(e.target.value)}
              className="max-w-xs"
            />
            <span className="text-xs text-muted-foreground">
              {filteredBooks.length} رسالة
            </span>
          </div>
          {booksLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">العنوان</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">المؤلف</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">التصنيف</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">السنة</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">PDF</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredBooks.map(book => (
                      <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium max-w-[200px] truncate">{book.title}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{book.author}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{book.year}</td>
                        <td className="px-4 py-3 text-center">
                          {book.pdf_url
                            ? <span className="inline-block h-2 w-2 rounded-full bg-green-500" title="متاح" />
                            : <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/30" title="غير متاح" />
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditingBook(book)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Announcements Tab ── */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">إدارة الأخبار والفعاليات</h2>
            <Button size="sm" className="gap-2" onClick={() => setEditingAnnouncement('new')}>
              <Plus className="h-4 w-4" /> إضافة جديد
            </Button>
          </div>
          {annLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(announcements ?? []).map(item => (
                <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <Badge variant={item.type === 'news' ? 'secondary' : 'outline'}>
                    {item.type === 'news' ? 'خبر' : 'فعالية'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingAnnouncement(item)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteAnn(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Facebook Posts Tab ── */}
      {tab === 'facebook' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">إدارة منشورات فيسبوك</h2>
            <Button size="sm" className="gap-2" onClick={() => setEditingPost('new')}>
              <Plus className="h-4 w-4" /> إضافة منشور
            </Button>
          </div>
          {postsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(posts ?? []).map(post => (
                <div key={post.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(214,85%,43%)/10] text-primary">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed line-clamp-2">{post.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(post.post_date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingPost(post)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeletePost(post.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Stats Tab ── */}
      {tab === 'stats' && (
        <div className="space-y-4">
          <h2 className="font-semibold">إحصائيات استخدام الرسائل</h2>
          {booksLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">الرسالة</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1"><Eye className="h-3.5 w-3.5" /> مشاهدات</div>
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1"><Download className="h-3.5 w-3.5" /> تحميلات</div>
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1"><Star className="h-3.5 w-3.5" /> التقييم</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(books ?? [])
                      .slice()
                      .sort((a, b) => {
                        const au = Array.isArray(b.book_usage) ? b.book_usage[0] : b.book_usage;
                        const bu = Array.isArray(a.book_usage) ? a.book_usage[0] : a.book_usage;
                        return (au?.views ?? 0) - (bu?.views ?? 0);
                      })
                      .map(book => {
                        const usage = Array.isArray(book.book_usage) ? book.book_usage[0] : book.book_usage;
                        return (
                          <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium max-w-[280px] truncate">{book.title}</td>
                            <td className="px-4 py-3 text-center font-mono text-foreground">{(usage?.views ?? 0).toLocaleString('ar-EG')}</td>
                            <td className="px-4 py-3 text-center font-mono text-foreground">{(usage?.downloads ?? 0).toLocaleString('ar-EG')}</td>
                            <td className="px-4 py-3 text-center">
                              {usage?.rating
                                ? <span className="flex items-center justify-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    {Number(usage.rating).toFixed(1)}
                                  </span>
                                : <span className="text-muted-foreground/50">—</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Messages Tab ── */}
      {tab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">الرسائل الواردة</h2>
            <Badge variant="secondary">{messages.filter(m => !m.is_read).length} غير مقروءة</Badge>
          </div>
          {messagesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>لا توجد رسائل واردة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`rounded-xl border bg-card p-5 transition-colors ${msg.is_read ? 'border-border' : 'border-primary/40 bg-primary/5'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{msg.name}</p>
                        {!msg.is_read && <Badge className="text-xs h-5">جديدة</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{msg.email}</p>
                      <p className="text-sm font-medium text-primary mb-1">{msg.subject}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {msg.admin_reply && (
                        <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
                          <p className="text-xs font-semibold text-primary mb-1">رد الإدارة:</p>
                          <p className="text-sm text-foreground">{msg.admin_reply}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {msg.replied_at && new Date(msg.replied_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMarkRead(msg.id, msg.is_read)} title={msg.is_read ? 'تعيين كغير مقروءة' : 'تعيين كمقروءة'}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteMessage(msg.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {/* Reply section */}
                  {replyingTo === msg.id ? (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="اكتب ردك هنا..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1" onClick={() => handleReply(msg.id)} disabled={replySending}>
                          <Check className="h-3.5 w-3.5" /> {replySending ? 'جارٍ الإرسال...' : 'إرسال الرد'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyText(''); }}>إلغاء</Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={() => { setReplyingTo(msg.id); setReplyText(msg.admin_reply || ''); }}>
                      <Pencil className="h-3 w-3" /> {msg.admin_reply ? 'تعديل الرد' : 'رد على الرسالة'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {editingBook && <BookEditModal book={editingBook} onClose={() => setEditingBook(null)} />}
      {editingAnnouncement && (
        <AnnouncementModal
          item={editingAnnouncement === 'new' ? undefined : editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
        />
      )}
      {editingPost && (
        <FacebookPostModal
          post={editingPost === 'new' ? undefined : editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}
