import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type FacebookPost = {
  id: string;
  image_url: string | null;
  text: string;
  post_date: string;
  facebook_url: string;
  created_at: string;
};

export function useFacebookPosts() {
  return useQuery({
    queryKey: ['facebook_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facebook_posts')
        .select('*')
        .order('post_date', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as FacebookPost[];
    },
  });
}

export function useCreateFacebookPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<FacebookPost, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('facebook_posts').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['facebook_posts'] }),
  });
}

export function useUpdateFacebookPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<FacebookPost> & { id: string }) => {
      const { error } = await supabase.from('facebook_posts').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['facebook_posts'] }),
  });
}

export function useDeleteFacebookPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('facebook_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['facebook_posts'] }),
  });
}
