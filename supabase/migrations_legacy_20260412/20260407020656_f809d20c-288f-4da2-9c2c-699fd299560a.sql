
-- Allow admins to update and delete messages
CREATE POLICY "Admins can update messages" ON public.messages FOR UPDATE TO public USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete messages" ON public.messages FOR DELETE TO public USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add admin_reply column to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS replied_at timestamp with time zone;
