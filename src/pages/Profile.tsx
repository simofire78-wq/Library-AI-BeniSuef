import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, BookOpen, Download, Star, Calendar, Eye, ArrowRight, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useUnbookEvent } from '@/hooks/useEventBookings';
import { toast } from 'sonner';

function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId!)
        .single();
      return data;
    },
    enabled: !!userId,
  });
}

function useUserActivity(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-activity', userId],
    queryFn: async () => {
      const client = supabase as any;

      const { data: usageData, error: usageError } = await client
        .from('user_activities')
        .select('id, book_id, activity_type, rating, created_at, books:book_id(id, title, author, category, year)')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      // Get event bookings
      const { data: bookings } = await supabase
        .from('event_bookings')
        .select('*, announcements:announcement_id(id, title, date, location, event_time)')
        .eq('user_id', userId!);

      if (usageError) throw usageError;

      const dedupeByBook = (rows: any[]) => {
        const seen = new Set<string>();
        return rows.filter((row) => {
          if (seen.has(row.book_id)) return false;
          seen.add(row.book_id);
          return true;
        });
      };

      const viewed = dedupeByBook((usageData || []).filter((u: any) => u.activity_type === 'view'));
      const downloaded = dedupeByBook((usageData || []).filter((u: any) => u.activity_type === 'download'));
      const rated = dedupeByBook((usageData || []).filter((u: any) => u.activity_type === 'rating' && u.rating && u.rating > 0));

      return { viewed, downloaded, rated, bookings: bookings || [] };
    },
    enabled: !!userId,
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const userId = user?.id;
  const { data: profile, isLoading: profileLoading } = useProfile(userId);
  const { data: activity, isLoading: activityLoading } = useUserActivity(userId);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !redirecting) {
      setRedirecting(true);
      navigate('/auth?returnTo=/profile');
    }
  }, [loading, user, navigate, redirecting]);

  if (loading || profileLoading || redirecting) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile?.name || user.email?.split('@')[0]}</h1>
              <p className="text-sm text-muted-foreground">{profile?.email || user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                عضو منذ {new Date(user.created_at).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'رسائل شاهدتها', count: activity?.viewed?.length || 0 },
          { icon: Download, label: 'رسائل حملتها', count: activity?.downloaded?.length || 0 },
          { icon: Star, label: 'تقييماتك', count: activity?.rated?.length || 0 },
          { icon: Calendar, label: 'حجوزات الفعاليات', count: activity?.bookings?.length || 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <stat.icon className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {activityLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <>
          {/* Viewed Books */}
          {activity?.viewed && activity.viewed.length > 0 && (
            <Section title="الرسائل التي شاهدتها" icon={Eye}>
              {activity.viewed.map((item: any) => (
                <BookRow key={item.id} book={item.books} stat="تمت مشاهدة ملف PDF" />
              ))}
            </Section>
          )}

          {/* Downloaded Books */}
          {activity?.downloaded && activity.downloaded.length > 0 && (
            <Section title="الرسائل التي حملتها" icon={Download}>
              {activity.downloaded.map((item: any) => (
                <BookRow key={item.id} book={item.books} stat="تم تحميل الملف" />
              ))}
            </Section>
          )}

          {/* Rated Books */}
          {activity?.rated && activity.rated.length > 0 && (
            <Section title="تقييماتك" icon={Star}>
              {activity.rated.map((item: any) => (
                <BookRow key={item.id} book={item.books} stat={`${item.rating} / 5 ⭐`} />
              ))}
            </Section>
          )}

          {/* Event Bookings */}
          {activity?.bookings && activity.bookings.length > 0 && (
            <Section title="حجوزات الفعاليات" icon={Calendar}>
              {activity.bookings.map((booking: any) => (
                <EventRow key={booking.id} booking={booking} />
              ))}
            </Section>
          )}

          {/* Empty state */}
          {(!activity?.viewed?.length && !activity?.downloaded?.length && !activity?.rated?.length && !activity?.bookings?.length) && (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">لا يوجد نشاط بعد</p>
              <p className="text-sm text-muted-foreground mt-1">ابدأ بتصفح الرسائل العلمية وحجز الفعاليات</p>
              <Button asChild className="mt-4">
                <Link to="/search">تصفح الرسائل</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function BookRow({ book, stat }: { book: any; stat: string }) {
  if (!book) return null;
  return (
    <Link
      to={`/book/${book.id}`}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{book.title}</p>
        <p className="text-xs text-muted-foreground">{book.author} · {book.category}</p>
      </div>
      <Badge variant="secondary" className="shrink-0 mr-2">{stat}</Badge>
    </Link>
  );
}

function EventRow({ booking }: { booking: any }) {
  const event = booking.announcements;
  const unbookMutation = useUnbookEvent(booking.announcement_id);

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    unbookMutation.mutate(undefined, {
      onSuccess: () => toast.success('تم إلغاء الحجز'),
      onError: () => toast.error('حدث خطأ أثناء إلغاء الحجز'),
    });
  };

  if (!event) return null;
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{event.title}</p>
        <p className="text-xs text-muted-foreground">
          {event.date} {event.event_time && `· ${event.event_time}`} {event.location && `· ${event.location}`}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={unbookMutation.isPending}
        className="gap-1 shrink-0 mr-2 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
        إلغاء
      </Button>
    </div>
  );
}
