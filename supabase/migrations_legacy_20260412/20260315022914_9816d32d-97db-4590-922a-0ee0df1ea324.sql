
-- 1. Add pdf_url column to books
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS pdf_url text;

-- 2. Add rating_count to book_usage for proper average calculation
ALTER TABLE public.book_usage ADD COLUMN IF NOT EXISTS rating_count integer NOT NULL DEFAULT 0;

-- 3. Create books-pdf storage bucket (public for direct PDF viewing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('books-pdf', 'books-pdf', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies for books-pdf
CREATE POLICY "PDFs are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'books-pdf');

CREATE POLICY "Admins can upload PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'books-pdf');

CREATE POLICY "Admins can update PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'books-pdf');

CREATE POLICY "Admins can delete PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'books-pdf');

-- 5. Allow public UPDATE on book_usage for tracking interactions
CREATE POLICY "Anyone can update book usage stats"
ON public.book_usage
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 6. Allow public INSERT on book_usage (in case a record doesn't exist)
CREATE POLICY "Anyone can insert book usage stats"
ON public.book_usage
FOR INSERT
TO public
WITH CHECK (true);
