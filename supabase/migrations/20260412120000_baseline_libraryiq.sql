-- =============================================================================
-- Library IQ — baseline schema (جديد بالكامل لمشروع Supabase فاضي)
-- ينسجم مع: useBooks (RPC)، Admin، Contact، About، Chatbot، import-csv
-- =============================================================================

-- -----------------------------------------------------------------------------
-- أنواع
-- -----------------------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.activity_type AS ENUM ('view', 'download', 'rating');

-- -----------------------------------------------------------------------------
-- جداول أساسية
-- -----------------------------------------------------------------------------
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'Arabic',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.book_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  views INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,1),
  downloads INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (book_id)
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('news', 'event')),
  tag TEXT,
  location TEXT,
  event_time TEXT,
  capacity INTEGER,
  registered INTEGER DEFAULT 0,
  is_upcoming BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.facebook_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  text TEXT NOT NULL,
  post_date DATE NOT NULL,
  facebook_url TEXT NOT NULL DEFAULT 'https://www.facebook.com/BSU.InfoSciDept',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, announcement_id)
);

CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialization TEXT,
  email TEXT,
  image_url TEXT,
  order_priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type public.activity_type NOT NULL,
  rating NUMERIC(2,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- فهارس
-- -----------------------------------------------------------------------------
CREATE INDEX idx_books_title_fts ON public.books USING gin (to_tsvector('english', title));
CREATE INDEX idx_books_author ON public.books(author);
CREATE INDEX idx_books_category ON public.books(category);
CREATE INDEX idx_books_year ON public.books(year);
CREATE INDEX idx_books_keywords ON public.books USING gin (keywords);
CREATE INDEX idx_user_activities_book_id ON public.user_activities(book_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id) WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX user_activities_one_rating_per_user_per_book
  ON public.user_activities(book_id, user_id, activity_type)
  WHERE user_id IS NOT NULL AND activity_type = 'rating'::public.activity_type;

-- -----------------------------------------------------------------------------
-- دوال ومساعدات
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_book_activity_stats(_book_id UUID DEFAULT NULL)
RETURNS TABLE (
  book_id UUID,
  views BIGINT,
  downloads BIGINT,
  rating NUMERIC,
  rating_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    b.id AS book_id,
    COUNT(ua.id) FILTER (WHERE ua.activity_type = 'view'::public.activity_type)::BIGINT AS views,
    COUNT(ua.id) FILTER (WHERE ua.activity_type = 'download'::public.activity_type)::BIGINT AS downloads,
    ROUND(AVG(ua.rating) FILTER (WHERE ua.activity_type = 'rating'::public.activity_type), 1) AS rating,
    COUNT(ua.id) FILTER (WHERE ua.activity_type = 'rating'::public.activity_type)::BIGINT AS rating_count
  FROM public.books b
  LEFT JOIN public.user_activities ua ON ua.book_id = b.id
  WHERE _book_id IS NULL OR b.id = _book_id
  GROUP BY b.id
  ORDER BY b.id
$$;

CREATE OR REPLACE FUNCTION public.get_activity_daily_stats(_days INTEGER DEFAULT 30)
RETURNS TABLE (
  day DATE,
  views BIGINT,
  downloads BIGINT,
  ratings BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH series AS (
    SELECT generate_series(
      current_date - GREATEST(COALESCE(_days, 30), 1) + 1,
      current_date,
      interval '1 day'
    )::DATE AS day
  )
  SELECT
    s.day,
    COALESCE(COUNT(ua.id) FILTER (WHERE ua.activity_type = 'view'::public.activity_type), 0)::BIGINT AS views,
    COALESCE(COUNT(ua.id) FILTER (WHERE ua.activity_type = 'download'::public.activity_type), 0)::BIGINT AS downloads,
    COALESCE(COUNT(ua.id) FILTER (WHERE ua.activity_type = 'rating'::public.activity_type), 0)::BIGINT AS ratings
  FROM series s
  LEFT JOIN public.user_activities ua ON ua.created_at::DATE = s.day
  GROUP BY s.day
  ORDER BY s.day
$$;

CREATE OR REPLACE FUNCTION public.get_activity_type_totals()
RETURNS TABLE (activity_type TEXT, total BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH activity_types AS (
    SELECT unnest(enum_range(NULL::public.activity_type)) AS activity_type
  )
  SELECT
    at.activity_type::TEXT,
    COALESCE(COUNT(ua.id), 0)::BIGINT AS total
  FROM activity_types at
  LEFT JOIN public.user_activities ua ON ua.activity_type = at.activity_type
  GROUP BY at.activity_type
  ORDER BY at.activity_type::TEXT
$$;

CREATE OR REPLACE FUNCTION public.record_book_activity(_book_id UUID, _activity_type public.activity_type)
RETURNS TABLE (book_id UUID, views BIGINT, downloads BIGINT, rating NUMERIC, rating_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _activity_type NOT IN ('view'::public.activity_type, 'download'::public.activity_type) THEN
    RAISE EXCEPTION 'Only view or download can be recorded through this function';
  END IF;

  INSERT INTO public.user_activities (book_id, user_id, activity_type, rating)
  VALUES (_book_id, auth.uid(), _activity_type, NULL);

  RETURN QUERY
  SELECT s.book_id, s.views, s.downloads, s.rating, s.rating_count
  FROM public.get_book_activity_stats(_book_id) s;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_book_rating(_book_id UUID, _rating NUMERIC)
RETURNS TABLE (book_id UUID, views BIGINT, downloads BIGINT, rating NUMERIC, rating_count BIGINT, my_rating NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _existing_id UUID;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  SELECT id INTO _existing_id
  FROM public.user_activities
  WHERE book_id = _book_id AND user_id = _uid AND activity_type = 'rating'::public.activity_type
  LIMIT 1;

  IF _existing_id IS NOT NULL THEN
    UPDATE public.user_activities
    SET rating = ROUND(_rating::NUMERIC, 1), created_at = now()
    WHERE id = _existing_id;
  ELSE
    INSERT INTO public.user_activities (book_id, user_id, activity_type, rating)
    VALUES (_book_id, _uid, 'rating'::public.activity_type, ROUND(_rating::NUMERIC, 1));
  END IF;

  RETURN QUERY
  SELECT s.book_id, s.views, s.downloads, s.rating, s.rating_count, ROUND(_rating::NUMERIC, 1)
  FROM public.get_book_activity_stats(_book_id) s;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_registered(ann_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.announcements
  SET registered = COALESCE(registered, 0) + 1
  WHERE id = ann_id;
$$;

CREATE OR REPLACE FUNCTION public.decrement_registered(ann_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.announcements
  SET registered = GREATEST(COALESCE(registered, 1) - 1, 0)
  WHERE id = ann_id;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- books
CREATE POLICY "Books are publicly readable" ON public.books FOR SELECT USING (true);
CREATE POLICY "Admins can insert books" ON public.books FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update books" ON public.books FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- book_usage: قراءة عامة فقط (التتبع عبر RPC + user_activities)
CREATE POLICY "Book usage is publicly readable" ON public.book_usage FOR SELECT USING (true);

-- profiles
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- announcements
CREATE POLICY "Announcements are publicly readable" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins can insert announcements" ON public.announcements FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update announcements" ON public.announcements FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete announcements" ON public.announcements FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- facebook_posts
CREATE POLICY "Facebook posts are publicly readable" ON public.facebook_posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage facebook posts" ON public.facebook_posts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- event_bookings
CREATE POLICY "Users can view own bookings" ON public.event_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can book events" ON public.event_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own bookings" ON public.event_bookings FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bookings" ON public.event_bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- staff
CREATE POLICY "Staff publicly readable" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- messages (اتصل بنا)
CREATE POLICY "Anyone can submit contact message" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update messages" ON public.messages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete messages" ON public.messages FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- user_activities
CREATE POLICY "Admins can view all user activities" ON public.user_activities FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Storage
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('books-pdf', 'books-pdf', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('csv-imports', 'csv-imports', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "PDFs public read" ON storage.objects FOR SELECT USING (bucket_id = 'books-pdf');
CREATE POLICY "Admins upload PDFs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'books-pdf' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update PDFs" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'books-pdf' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete PDFs" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'books-pdf' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- -----------------------------------------------------------------------------
-- صلاحيات الجداول + الـ RPC (PostgREST)
-- -----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON public.messages TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_book_activity_stats(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_activity_daily_stats(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_activity_type_totals() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_book_activity(UUID, public.activity_type) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_book_rating(UUID, NUMERIC) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_registered(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_registered(UUID) TO anon, authenticated;
