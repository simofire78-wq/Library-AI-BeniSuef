DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'activity_type'
  ) THEN
    CREATE TYPE public.activity_type AS ENUM ('view', 'download', 'rating');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID NULL,
  activity_type public.activity_type NOT NULL,
  rating NUMERIC(2,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_activities_book_id ON public.user_activities(book_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_activities_one_rating_per_user_per_book
  ON public.user_activities(book_id, user_id, activity_type)
  WHERE user_id IS NOT NULL AND activity_type = 'rating'::public.activity_type;

DROP POLICY IF EXISTS "Admins can view all user activities" ON public.user_activities;
CREATE POLICY "Admins can view all user activities"
ON public.user_activities
FOR SELECT
TO public
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;
CREATE POLICY "Users can view own activities"
ON public.user_activities
FOR SELECT
TO public
USING (auth.uid() = user_id);

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
RETURNS TABLE (
  activity_type TEXT,
  total BIGINT
)
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
RETURNS TABLE (
  book_id UUID,
  views BIGINT,
  downloads BIGINT,
  rating NUMERIC,
  rating_count BIGINT
)
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
RETURNS TABLE (
  book_id UUID,
  views BIGINT,
  downloads BIGINT,
  rating NUMERIC,
  rating_count BIGINT,
  my_rating NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  INSERT INTO public.user_activities (book_id, user_id, activity_type, rating)
  VALUES (_book_id, auth.uid(), 'rating'::public.activity_type, ROUND(_rating::NUMERIC, 1))
  ON CONFLICT (book_id, user_id, activity_type)
  WHERE user_id IS NOT NULL AND activity_type = 'rating'::public.activity_type
  DO UPDATE SET rating = EXCLUDED.rating, created_at = now();

  RETURN QUERY
  SELECT s.book_id, s.views, s.downloads, s.rating, s.rating_count, ROUND(_rating::NUMERIC, 1)
  FROM public.get_book_activity_stats(_book_id) s;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_activities) THEN
    INSERT INTO public.user_activities (book_id, user_id, activity_type, created_at)
    SELECT
      b.book_id,
      NULL,
      'view'::public.activity_type,
      COALESCE(b.created_at, now())
    FROM public.book_usage b
    CROSS JOIN LATERAL generate_series(1, GREATEST(COALESCE(b.views, 0), 0)) AS gs;

    INSERT INTO public.user_activities (book_id, user_id, activity_type, created_at)
    SELECT
      b.book_id,
      NULL,
      'download'::public.activity_type,
      COALESCE(b.created_at, now())
    FROM public.book_usage b
    CROSS JOIN LATERAL generate_series(1, GREATEST(COALESCE(b.downloads, 0), 0)) AS gs;

    INSERT INTO public.user_activities (book_id, user_id, activity_type, rating, created_at)
    SELECT
      b.book_id,
      NULL,
      'rating'::public.activity_type,
      LEAST(GREATEST(COALESCE(b.rating, 0), 1), 5),
      COALESCE(b.created_at, now())
    FROM public.book_usage b
    CROSS JOIN LATERAL generate_series(1, GREATEST(COALESCE(b.rating_count, 0), 0)) AS gs
    WHERE COALESCE(b.rating_count, 0) > 0
      AND COALESCE(b.rating, 0) > 0;
  END IF;
END $$;