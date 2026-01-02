-- Fix: Only allow public access to blog post translations for published posts
DROP POLICY IF EXISTS "Public can read blog post translations" ON public.blog_post_translations;

CREATE POLICY "Public can read published blog post translations"
ON public.blog_post_translations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts
    WHERE blog_posts.id = blog_post_translations.blog_post_id
    AND blog_posts.is_published = true
  )
);