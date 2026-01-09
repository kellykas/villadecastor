-- Create team_members table
CREATE TABLE public.team_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_member_translations table for multilingual support
CREATE TABLE public.team_member_translations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'en',
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(team_member_id, language)
);

-- Create email_subscribers table
CREATE TABLE public.email_subscribers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    language TEXT DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create email_campaigns table for email marketing
CREATE TABLE public.email_campaigns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- draft, sent
    sent_at TIMESTAMP WITH TIME ZONE,
    sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Public can read active team members" ON public.team_members
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage team members" ON public.team_members
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Team member translations policies
CREATE POLICY "Public can read team member translations" ON public.team_member_translations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage team member translations" ON public.team_member_translations
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Email subscribers policies
CREATE POLICY "Public can subscribe" ON public.email_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage subscribers" ON public.email_subscribers
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Email campaigns policies
CREATE POLICY "Admins can manage campaigns" ON public.email_campaigns
    FOR ALL USING (has_role(auth.uid(), 'admin'));