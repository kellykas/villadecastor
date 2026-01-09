-- Fix permissive INSERT policies by adding basic validation constraints
-- These policies prevent automated abuse while still allowing legitimate public submissions

-- Drop the overly permissive INSERT policies
DROP POLICY IF EXISTS "Public can submit quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public can subscribe" ON public.email_subscribers;

-- Create replacement policies with basic validation
-- Policy for quotes: Require valid email format and non-empty required fields
CREATE POLICY "Public can submit quotes with validation" 
ON public.quotes 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  full_name IS NOT NULL 
  AND length(full_name) >= 2 
  AND length(full_name) <= 200
  AND email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (description IS NULL OR length(description) <= 5000)
);

-- Policy for contact_messages: Require valid email format and non-empty fields
CREATE POLICY "Public can submit contact messages with validation" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL 
  AND length(name) >= 2 
  AND length(name) <= 200
  AND email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND message IS NOT NULL 
  AND length(message) >= 10 
  AND length(message) <= 5000
);

-- Policy for email_subscribers: Require valid email format
CREATE POLICY "Public can subscribe with validation" 
ON public.email_subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (name IS NULL OR length(name) <= 200)
);