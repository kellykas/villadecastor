-- Add SELECT policies to restrict read access to admins only for sensitive tables

-- Fix: quotes table - add SELECT policy for admin-only access
CREATE POLICY "Only admins can view quotes" 
ON public.quotes 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix: contact_messages table - add SELECT policy for admin-only access
CREATE POLICY "Only admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix: email_subscribers table - add SELECT policy for admin-only access
CREATE POLICY "Only admins can view subscribers" 
ON public.email_subscribers 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix: email_campaigns table - add SELECT policy for admin-only access
CREATE POLICY "Only admins can view campaigns" 
ON public.email_campaigns 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));