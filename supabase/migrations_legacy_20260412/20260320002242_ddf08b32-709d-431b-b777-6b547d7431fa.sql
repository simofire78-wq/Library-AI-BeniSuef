-- Create event_bookings table to track individual user bookings
CREATE TABLE public.event_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, announcement_id)
);

-- Enable RLS
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.event_bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own booking
CREATE POLICY "Users can book events"
  ON public.event_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own booking (cancel)
CREATE POLICY "Users can cancel own bookings"
  ON public.event_bookings FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.event_bookings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));