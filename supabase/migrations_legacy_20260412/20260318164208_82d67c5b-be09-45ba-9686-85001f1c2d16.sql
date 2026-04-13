
-- ============================
-- 1. User Roles table (for admin access)
-- ============================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================
-- 2. Announcements table (News + Events merged)
-- ============================
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('news', 'event')),
  tag text,
  location text,
  event_time text,
  capacity integer,
  registered integer DEFAULT 0,
  is_upcoming boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are publicly readable"
  ON public.announcements FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update announcements"
  ON public.announcements FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcements"
  ON public.announcements FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================
-- 3. Facebook Posts table (admin-managed)
-- ============================
CREATE TABLE public.facebook_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  text text NOT NULL,
  post_date date NOT NULL,
  facebook_url text NOT NULL DEFAULT 'https://www.facebook.com/BSU.InfoSciDept',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.facebook_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Facebook posts are publicly readable"
  ON public.facebook_posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage facebook posts"
  ON public.facebook_posts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================
-- 4. Books: allow admin to UPDATE/DELETE
-- ============================
CREATE POLICY "Admins can update books"
  ON public.books FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete books"
  ON public.books FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
