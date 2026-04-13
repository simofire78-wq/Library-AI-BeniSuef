import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/** Check if the current user has booked a specific event */
export function useMyBooking(announcementId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['booking', announcementId, user?.id],
    enabled: !!user && !!announcementId,
    queryFn: async () => {
      const { data } = await supabase
        .from('event_bookings')
        .select('id')
        .eq('announcement_id', announcementId)
        .eq('user_id', user!.id)
        .maybeSingle();
      return data ?? null;
    },
  });
}

/** Book an event seat */
export function useBookEvent(announcementId: string) {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');

      const { error: bookingError } = await supabase
        .from('event_bookings')
        .insert({ user_id: user.id, announcement_id: announcementId });

      if (bookingError) {
        if (bookingError.code === '23505') throw new Error('لقد حجزت مقعداً في هذه الفعالية مسبقاً');
        throw bookingError;
      }

      // Atomically increment registered count
      await supabase.rpc('increment_registered', { ann_id: announcementId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
      qc.invalidateQueries({ queryKey: ['booking', announcementId] });
    },
  });
}

/** Cancel (unbook) an event seat */
export function useUnbookEvent(announcementId: string) {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');

      const { error } = await supabase
        .from('event_bookings')
        .delete()
        .eq('user_id', user.id)
        .eq('announcement_id', announcementId);

      if (error) throw error;

      // Atomically decrement registered count
      await supabase.rpc('decrement_registered', { ann_id: announcementId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
      qc.invalidateQueries({ queryKey: ['booking', announcementId] });
    },
  });
}
