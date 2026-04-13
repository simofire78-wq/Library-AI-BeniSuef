
-- Add FK for event_bookings.user_id
ALTER TABLE public.event_bookings
  ADD CONSTRAINT event_bookings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Unique constraint on profiles
DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Unique constraint to prevent duplicate bookings
DO $$ BEGIN
  ALTER TABLE public.event_bookings ADD CONSTRAINT event_bookings_user_announcement_unique UNIQUE (user_id, announcement_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;
