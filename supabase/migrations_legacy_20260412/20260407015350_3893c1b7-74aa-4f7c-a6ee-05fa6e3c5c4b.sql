
CREATE OR REPLACE FUNCTION public.upsert_book_rating(_book_id uuid, _rating numeric)
 RETURNS TABLE(book_id uuid, views bigint, downloads bigint, rating numeric, rating_count bigint, my_rating numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := auth.uid();
  _existing_id uuid;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- Check if user already rated this book
  SELECT id INTO _existing_id
  FROM public.user_activities
  WHERE user_activities.book_id = _book_id
    AND user_activities.user_id = _uid
    AND user_activities.activity_type = 'rating'::public.activity_type
  LIMIT 1;

  IF _existing_id IS NOT NULL THEN
    -- Update existing rating
    UPDATE public.user_activities
    SET rating = ROUND(_rating::NUMERIC, 1),
        created_at = now()
    WHERE id = _existing_id;
  ELSE
    -- Insert new rating
    INSERT INTO public.user_activities (book_id, user_id, activity_type, rating)
    VALUES (_book_id, _uid, 'rating'::public.activity_type, ROUND(_rating::NUMERIC, 1));
  END IF;

  RETURN QUERY
  SELECT s.book_id, s.views, s.downloads, s.rating, s.rating_count, ROUND(_rating::NUMERIC, 1)
  FROM public.get_book_activity_stats(_book_id) s;
END;
$function$;
