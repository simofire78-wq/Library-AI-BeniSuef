-- Function to safely increment registered seats
CREATE OR REPLACE FUNCTION public.increment_registered(ann_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.announcements
  SET registered = COALESCE(registered, 0) + 1
  WHERE id = ann_id;
$$;