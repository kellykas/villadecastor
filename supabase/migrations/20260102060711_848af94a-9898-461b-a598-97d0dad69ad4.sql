-- Add SELECT policy for user_roles table so only admins can view user roles
-- This prevents unauthorized users from discovering admin accounts

CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));