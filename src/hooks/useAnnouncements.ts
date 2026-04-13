import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  date: string;
  type: 'news' | 'event';
  tag: string | null;
  location: string | null;
  event_time: string | null;
  capacity: number | null;
  registered: number | null;
  is_upcoming: boolean | null;
  created_at: string;
  updated_at: string;
};

export function useAnnouncements(type?: 'news' | 'event') {
  return useQuery({
    queryKey: ['announcements', type],
    queryFn: async () => {
      let q = supabase.from('announcements').select('*').order('date', { ascending: false });
      if (type) q = q.eq('type', type);
      const { data, error } = await q;
      if (error) throw error;
      return data as Announcement[];
    },
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('announcements').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Announcement> & { id: string }) => {
      const { error } = await supabase.from('announcements').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}
