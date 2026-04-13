
-- ============================================================
-- LibraryIQ Database Schema
-- ============================================================

-- BOOKS TABLE
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'English',
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- PROFILES TABLE (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- BOOK_USAGE TABLE
CREATE TABLE public.book_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id)
);

-- INDEXES for search performance
CREATE INDEX idx_books_title_fts ON public.books USING gin(to_tsvector('english', title));
CREATE INDEX idx_books_author ON public.books(author);
CREATE INDEX idx_books_category ON public.books(category);
CREATE INDEX idx_books_year ON public.books(year);
CREATE INDEX idx_books_keywords ON public.books USING GIN(keywords);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_usage ENABLE ROW LEVEL SECURITY;

-- Books: publicly readable
CREATE POLICY "Books are publicly readable" ON public.books FOR SELECT USING (true);

-- Profiles: users can manage their own
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Book usage: publicly readable
CREATE POLICY "Book usage is publicly readable" ON public.book_usage FOR SELECT USING (true);
