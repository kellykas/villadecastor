-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    image_url TEXT,
    read_time TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_post_translations table
CREATE TABLE public.blog_post_translations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'en',
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(blog_post_id, language)
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_posts
CREATE POLICY "Public can read published blog posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for blog_post_translations
CREATE POLICY "Public can read blog post translations"
ON public.blog_post_translations
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage blog post translations"
ON public.blog_post_translations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (slug, category, read_time, is_published, is_featured, published_at) VALUES
('construction-trends-2024-drc', 'trends', '5 min', true, true, now()),
('how-to-plan-renovation-project', 'tips', '8 min', true, false, now() - interval '5 days'),
('sustainable-materials-modern-construction', 'construction', '6 min', true, false, now() - interval '10 days'),
('commercial-building-rehabilitation-kinshasa', 'projects', '10 min', true, false, now() - interval '15 days'),
('importance-thermal-insulation', 'tips', '4 min', true, false, now() - interval '20 days'),
('interior-decoration-popular-styles', 'trends', '7 min', true, false, now() - interval '25 days');

-- Insert English translations
INSERT INTO public.blog_post_translations (blog_post_id, language, title, excerpt, content) VALUES
((SELECT id FROM public.blog_posts WHERE slug = 'construction-trends-2024-drc'), 'en', 'Construction Trends 2024 in DRC', 'Discover the new architectural trends and innovative materials transforming the construction sector in the Democratic Republic of Congo.', 'The construction industry in DRC is experiencing significant growth...'),
((SELECT id FROM public.blog_posts WHERE slug = 'how-to-plan-renovation-project'), 'en', 'How to Plan Your Renovation Project', 'A comprehensive guide to effectively planning your renovation project, from initial budget to material selection.', 'Planning a renovation project requires careful consideration...'),
((SELECT id FROM public.blog_posts WHERE slug = 'sustainable-materials-modern-construction'), 'en', 'Sustainable Materials for Modern Construction', 'Exploring eco-friendly and sustainable material options available for construction projects in Central Africa.', 'Sustainability in construction is becoming increasingly important...'),
((SELECT id FROM public.blog_posts WHERE slug = 'commercial-building-rehabilitation-kinshasa'), 'en', 'Commercial Building Rehabilitation in Kinshasa', 'Detailed case study on the complete rehabilitation of a commercial building in downtown Kinshasa.', 'This project involved the complete rehabilitation of a 5-story commercial building...'),
((SELECT id FROM public.blog_posts WHERE slug = 'importance-thermal-insulation'), 'en', 'The Importance of Thermal Insulation', 'Why thermal insulation is crucial for the comfort and energy efficiency of your home.', 'Thermal insulation is often overlooked in tropical climates...'),
((SELECT id FROM public.blog_posts WHERE slug = 'interior-decoration-popular-styles'), 'en', 'Interior Decoration: Popular Styles', 'The most requested interior decoration styles by our clients in Kinshasa and Lubumbashi.', 'Interior decoration trends in DRC reflect a blend of modern and traditional styles...');

-- Insert French translations
INSERT INTO public.blog_post_translations (blog_post_id, language, title, excerpt, content) VALUES
((SELECT id FROM public.blog_posts WHERE slug = 'construction-trends-2024-drc'), 'fr', 'Les tendances de construction 2024 en RDC', 'Découvrez les nouvelles tendances architecturales et les matériaux innovants qui transforment le secteur de la construction en République Démocratique du Congo.', 'L''industrie de la construction en RDC connaît une croissance significative...'),
((SELECT id FROM public.blog_posts WHERE slug = 'how-to-plan-renovation-project'), 'fr', 'Comment planifier votre projet de rénovation', 'Un guide complet pour planifier efficacement votre projet de rénovation, du budget initial à la sélection des matériaux.', 'Planifier un projet de rénovation nécessite une réflexion approfondie...'),
((SELECT id FROM public.blog_posts WHERE slug = 'sustainable-materials-modern-construction'), 'fr', 'Matériaux durables pour la construction moderne', 'Explorer les options de matériaux écologiques et durables disponibles pour les projets de construction en Afrique centrale.', 'La durabilité dans la construction devient de plus en plus importante...'),
((SELECT id FROM public.blog_posts WHERE slug = 'commercial-building-rehabilitation-kinshasa'), 'fr', 'Réhabilitation d''un immeuble commercial à Kinshasa', 'Étude de cas détaillée sur la réhabilitation complète d''un bâtiment commercial dans le centre de Kinshasa.', 'Ce projet a impliqué la réhabilitation complète d''un immeuble commercial de 5 étages...'),
((SELECT id FROM public.blog_posts WHERE slug = 'importance-thermal-insulation'), 'fr', 'L''importance de l''isolation thermique', 'Pourquoi l''isolation thermique est cruciale pour le confort et l''efficacité énergétique de votre maison.', 'L''isolation thermique est souvent négligée dans les climats tropicaux...'),
((SELECT id FROM public.blog_posts WHERE slug = 'interior-decoration-popular-styles'), 'fr', 'Décoration intérieure : les styles populaires', 'Les styles de décoration intérieure les plus demandés par nos clients à Kinshasa et Lubumbashi.', 'Les tendances de décoration intérieure en RDC reflètent un mélange de styles modernes et traditionnels...');