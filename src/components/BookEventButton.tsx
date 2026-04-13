import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMyBooking, useBookEvent, useUnbookEvent } from '@/hooks/useEventBookings';
import { toast } from 'sonner';

interface BookEventButtonProps {
  announcementId: string;
  capacity: number | null;
  registered: number | null;
}

export function BookEventButton({ announcementId, capacity, registered }: BookEventButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: myBooking, isLoading: checkingBooking } = useMyBooking(announcementId);
  const bookEvent = useBookEvent(announcementId);
  const unbookEvent = useUnbookEvent(announcementId);

  const remaining = capacity != null ? capacity - (registered ?? 0) : null;
  const isFull = remaining !== null && remaining <= 0;
  const alreadyBooked = !!myBooking;

  const handleBook = async () => {
    if (!user) {
      // Redirect to user auth page with return URL
      navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`);
      toast.info('يرجى تسجيل الدخول أولاً لحجز مقعد');
      return;
    }
    if (alreadyBooked || isFull) return;

    bookEvent.mutate(undefined, {
      onSuccess: () => toast.success('تم حجز مقعدك بنجاح! 🎉'),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الحجز';
        toast.error(msg);
      },
    });
  };

  const handleUnbook = () => {
    unbookEvent.mutate(undefined, {
      onSuccess: () => toast.success('تم إلغاء الحجز'),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إلغاء الحجز';
        toast.error(msg);
      },
    });
  };

  if (checkingBooking) {
    return (
      <Button size="sm" variant="outline" disabled className="gap-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        جارٍ التحقق...
      </Button>
    );
  }

  if (alreadyBooked) {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={handleUnbook}
        disabled={unbookEvent.isPending}
        className="gap-2"
      >
        {unbookEvent.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CalendarX className="h-3.5 w-3.5" />
        )}
        إلغاء الحجز
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button size="sm" variant="outline" disabled className="gap-2 opacity-60">
        لا توجد مقاعد متاحة
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleBook}
      disabled={bookEvent.isPending}
      className="gap-2"
    >
      {bookEvent.isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <CalendarCheck className="h-3.5 w-3.5" />
      )}
      احجز مقعداً
      {remaining !== null && (
        <span className="text-xs opacity-75">({remaining} متبقي)</span>
      )}
    </Button>
  );
}
