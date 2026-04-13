CREATE OR REPLACE FUNCTION public.decrement_registered(ann_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  UPDATE public.announcements
  SET registered = GREATEST(COALESCE(registered, 1) - 1, 0)
  WHERE id = ann_id;
$$;