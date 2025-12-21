-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create translations table for all static content
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(key, language)
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service translations table
CREATE TABLE public.service_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(service_id, language)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create project translations table
CREATE TABLE public.project_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, language)
);

-- Create project images table
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  project_type TEXT,
  description TEXT,
  budget TEXT,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create languages table
CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Create has_role function for secure role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for website content
CREATE POLICY "Public can read translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Public can read active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read service translations" ON public.service_translations FOR SELECT USING (true);
CREATE POLICY "Public can read active projects" ON public.projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read project translations" ON public.project_translations FOR SELECT USING (true);
CREATE POLICY "Public can read project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Public can read active languages" ON public.languages FOR SELECT USING (is_active = true);

-- Public can submit quotes and contact messages
CREATE POLICY "Public can submit quotes" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies (full access)
CREATE POLICY "Admins can manage translations" ON public.translations FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage service translations" ON public.service_translations FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage project translations" ON public.project_translations FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage project images" ON public.project_images FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view quotes" ON public.quotes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update quotes" ON public.quotes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage languages" ON public.languages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default languages
INSERT INTO public.languages (code, name, is_active) VALUES
  ('en', 'English', true),
  ('fr', 'Français', true);

-- Insert default translations for English
INSERT INTO public.translations (key, language, value) VALUES
  -- Navigation
  ('nav.home', 'en', 'Home'),
  ('nav.about', 'en', 'About'),
  ('nav.services', 'en', 'Services'),
  ('nav.projects', 'en', 'Projects'),
  ('nav.quote', 'en', 'Get a Quote'),
  ('nav.contact', 'en', 'Contact'),
  
  -- Hero
  ('hero.title', 'en', 'Building Dreams, Creating Reality'),
  ('hero.subtitle', 'en', 'Professional construction and renovation services with over 25 years of excellence'),
  ('hero.cta', 'en', 'Get Free Quote'),
  ('hero.secondary_cta', 'en', 'View Our Work'),
  
  -- About section
  ('about.title', 'en', 'About BuildPro Construction'),
  ('about.description', 'en', 'With decades of experience in the construction industry, we deliver exceptional quality and craftsmanship in every project. Our team of skilled professionals is dedicated to bringing your vision to life.'),
  ('about.experience', 'en', 'Years Experience'),
  ('about.projects_completed', 'en', 'Projects Completed'),
  ('about.team_members', 'en', 'Expert Team Members'),
  ('about.satisfaction', 'en', 'Client Satisfaction'),
  
  -- Services section
  ('services.title', 'en', 'Our Services'),
  ('services.subtitle', 'en', 'Comprehensive construction and renovation solutions'),
  ('services.view_all', 'en', 'View All Services'),
  
  -- Projects section
  ('projects.title', 'en', 'Featured Projects'),
  ('projects.subtitle', 'en', 'Explore our latest work and successful completions'),
  ('projects.view_all', 'en', 'View All Projects'),
  
  -- Why choose us
  ('why.title', 'en', 'Why Choose Us'),
  ('why.quality', 'en', 'Quality Craftsmanship'),
  ('why.quality_desc', 'en', 'We use only premium materials and proven techniques'),
  ('why.time', 'en', 'On-Time Delivery'),
  ('why.time_desc', 'en', 'Projects completed within agreed timelines'),
  ('why.budget', 'en', 'Budget Friendly'),
  ('why.budget_desc', 'en', 'Competitive pricing without compromising quality'),
  ('why.support', 'en', 'Full Support'),
  ('why.support_desc', 'en', 'Dedicated project managers and 24/7 support'),
  
  -- CTA
  ('cta.title', 'en', 'Ready to Start Your Project?'),
  ('cta.description', 'en', 'Contact us today for a free consultation and quote'),
  ('cta.button', 'en', 'Request a Quote'),
  
  -- Quote form
  ('quote.title', 'en', 'Request a Quote'),
  ('quote.subtitle', 'en', 'Fill out the form below and we will get back to you within 24 hours'),
  ('quote.name', 'en', 'Full Name'),
  ('quote.phone', 'en', 'Phone Number'),
  ('quote.email', 'en', 'Email Address'),
  ('quote.project_type', 'en', 'Project Type'),
  ('quote.description', 'en', 'Project Description'),
  ('quote.budget', 'en', 'Estimated Budget'),
  ('quote.submit', 'en', 'Submit Request'),
  ('quote.success', 'en', 'Thank you! We have received your request and will contact you soon.'),
  
  -- Contact
  ('contact.title', 'en', 'Contact Us'),
  ('contact.subtitle', 'en', 'Get in touch with our team'),
  ('contact.name', 'en', 'Your Name'),
  ('contact.email', 'en', 'Email Address'),
  ('contact.message', 'en', 'Your Message'),
  ('contact.send', 'en', 'Send Message'),
  ('contact.success', 'en', 'Message sent successfully!'),
  ('contact.address', 'en', 'Our Office'),
  ('contact.phone', 'en', 'Call Us'),
  ('contact.hours', 'en', 'Working Hours'),
  
  -- Footer
  ('footer.description', 'en', 'Professional construction and renovation services. Building excellence since 1998.'),
  ('footer.links', 'en', 'Quick Links'),
  ('footer.contact', 'en', 'Contact Info'),
  ('footer.copyright', 'en', 'All rights reserved.'),
  
  -- Common
  ('common.loading', 'en', 'Loading...'),
  ('common.error', 'en', 'An error occurred'),
  ('common.learn_more', 'en', 'Learn More'),
  ('common.view_details', 'en', 'View Details');

-- Insert French translations
INSERT INTO public.translations (key, language, value) VALUES
  -- Navigation
  ('nav.home', 'fr', 'Accueil'),
  ('nav.about', 'fr', 'À Propos'),
  ('nav.services', 'fr', 'Services'),
  ('nav.projects', 'fr', 'Projets'),
  ('nav.quote', 'fr', 'Demander un Devis'),
  ('nav.contact', 'fr', 'Contact'),
  
  -- Hero
  ('hero.title', 'fr', 'Construire des Rêves, Créer la Réalité'),
  ('hero.subtitle', 'fr', 'Services professionnels de construction et rénovation avec plus de 25 ans d''excellence'),
  ('hero.cta', 'fr', 'Devis Gratuit'),
  ('hero.secondary_cta', 'fr', 'Voir Nos Réalisations'),
  
  -- About section
  ('about.title', 'fr', 'À Propos de BuildPro Construction'),
  ('about.description', 'fr', 'Avec des décennies d''expérience dans l''industrie de la construction, nous livrons une qualité et un savoir-faire exceptionnels dans chaque projet. Notre équipe de professionnels qualifiés est dédiée à donner vie à votre vision.'),
  ('about.experience', 'fr', 'Années d''Expérience'),
  ('about.projects_completed', 'fr', 'Projets Réalisés'),
  ('about.team_members', 'fr', 'Membres de l''Équipe'),
  ('about.satisfaction', 'fr', 'Satisfaction Client'),
  
  -- Services section
  ('services.title', 'fr', 'Nos Services'),
  ('services.subtitle', 'fr', 'Solutions complètes de construction et rénovation'),
  ('services.view_all', 'fr', 'Voir Tous les Services'),
  
  -- Projects section
  ('projects.title', 'fr', 'Projets en Vedette'),
  ('projects.subtitle', 'fr', 'Découvrez nos derniers travaux et réalisations'),
  ('projects.view_all', 'fr', 'Voir Tous les Projets'),
  
  -- Why choose us
  ('why.title', 'fr', 'Pourquoi Nous Choisir'),
  ('why.quality', 'fr', 'Qualité Artisanale'),
  ('why.quality_desc', 'fr', 'Nous utilisons uniquement des matériaux premium et des techniques éprouvées'),
  ('why.time', 'fr', 'Livraison à Temps'),
  ('why.time_desc', 'fr', 'Projets terminés dans les délais convenus'),
  ('why.budget', 'fr', 'Prix Compétitifs'),
  ('why.budget_desc', 'fr', 'Tarifs compétitifs sans compromettre la qualité'),
  ('why.support', 'fr', 'Support Complet'),
  ('why.support_desc', 'fr', 'Chefs de projet dédiés et support 24/7'),
  
  -- CTA
  ('cta.title', 'fr', 'Prêt à Démarrer Votre Projet?'),
  ('cta.description', 'fr', 'Contactez-nous aujourd''hui pour une consultation et un devis gratuits'),
  ('cta.button', 'fr', 'Demander un Devis'),
  
  -- Quote form
  ('quote.title', 'fr', 'Demander un Devis'),
  ('quote.subtitle', 'fr', 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures'),
  ('quote.name', 'fr', 'Nom Complet'),
  ('quote.phone', 'fr', 'Numéro de Téléphone'),
  ('quote.email', 'fr', 'Adresse Email'),
  ('quote.project_type', 'fr', 'Type de Projet'),
  ('quote.description', 'fr', 'Description du Projet'),
  ('quote.budget', 'fr', 'Budget Estimé'),
  ('quote.submit', 'fr', 'Envoyer la Demande'),
  ('quote.success', 'fr', 'Merci! Nous avons reçu votre demande et vous contacterons bientôt.'),
  
  -- Contact
  ('contact.title', 'fr', 'Contactez-Nous'),
  ('contact.subtitle', 'fr', 'Entrez en contact avec notre équipe'),
  ('contact.name', 'fr', 'Votre Nom'),
  ('contact.email', 'fr', 'Adresse Email'),
  ('contact.message', 'fr', 'Votre Message'),
  ('contact.send', 'fr', 'Envoyer le Message'),
  ('contact.success', 'fr', 'Message envoyé avec succès!'),
  ('contact.address', 'fr', 'Notre Bureau'),
  ('contact.phone', 'fr', 'Appelez-Nous'),
  ('contact.hours', 'fr', 'Heures d''Ouverture'),
  
  -- Footer
  ('footer.description', 'fr', 'Services professionnels de construction et rénovation. L''excellence depuis 1998.'),
  ('footer.links', 'fr', 'Liens Rapides'),
  ('footer.contact', 'fr', 'Coordonnées'),
  ('footer.copyright', 'fr', 'Tous droits réservés.'),
  
  -- Common
  ('common.loading', 'fr', 'Chargement...'),
  ('common.error', 'fr', 'Une erreur est survenue'),
  ('common.learn_more', 'fr', 'En Savoir Plus'),
  ('common.view_details', 'fr', 'Voir les Détails');

-- Insert sample services
INSERT INTO public.services (id, image_url, is_active, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', NULL, true, 1),
  ('22222222-2222-2222-2222-222222222222', NULL, true, 2),
  ('33333333-3333-3333-3333-333333333333', NULL, true, 3),
  ('44444444-4444-4444-4444-444444444444', NULL, true, 4);

-- Insert service translations
INSERT INTO public.service_translations (service_id, language, title, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'en', 'Residential Construction', 'Complete home building services from foundation to finishing. Custom homes, additions, and new constructions tailored to your vision.'),
  ('11111111-1111-1111-1111-111111111111', 'fr', 'Construction Résidentielle', 'Services complets de construction de maisons, de la fondation aux finitions. Maisons personnalisées, agrandissements et nouvelles constructions adaptés à votre vision.'),
  ('22222222-2222-2222-2222-222222222222', 'en', 'Commercial Projects', 'Professional commercial construction for offices, retail spaces, and industrial buildings. Turnkey solutions for businesses.'),
  ('22222222-2222-2222-2222-222222222222', 'fr', 'Projets Commerciaux', 'Construction commerciale professionnelle pour bureaux, espaces de vente et bâtiments industriels. Solutions clé en main pour entreprises.'),
  ('33333333-3333-3333-3333-333333333333', 'en', 'Renovation & Remodeling', 'Transform your existing space with our expert renovation services. Kitchen, bathroom, basement, and whole-home remodels.'),
  ('33333333-3333-3333-3333-333333333333', 'fr', 'Rénovation & Remodelage', 'Transformez votre espace existant avec nos services de rénovation experts. Cuisine, salle de bain, sous-sol et rénovations complètes.'),
  ('44444444-4444-4444-4444-444444444444', 'en', 'Interior Design', 'Professional interior design services to bring your space to life. From concept to completion, we create stunning interiors.'),
  ('44444444-4444-4444-4444-444444444444', 'fr', 'Design d''Intérieur', 'Services professionnels de design d''intérieur pour donner vie à votre espace. Du concept à la réalisation, nous créons des intérieurs époustouflants.');

-- Insert sample projects
INSERT INTO public.projects (id, category, is_featured, is_active) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'residential', true, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'commercial', true, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'renovation', true, true);

-- Insert project translations
INSERT INTO public.project_translations (project_id, language, title, description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'Modern Family Residence', 'A stunning 4-bedroom contemporary home featuring open-concept living, sustainable materials, and smart home technology.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fr', 'Résidence Familiale Moderne', 'Une superbe maison contemporaine de 4 chambres avec concept ouvert, matériaux durables et technologie maison intelligente.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en', 'Downtown Office Complex', 'A 15-story commercial building with LEED certification, featuring modern workspaces and retail areas.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fr', 'Complexe de Bureaux du Centre-Ville', 'Un bâtiment commercial de 15 étages certifié LEED, avec espaces de travail modernes et zones commerciales.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'en', 'Historic Building Restoration', 'Complete restoration of a 19th-century heritage building, preserving original features while adding modern amenities.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'fr', 'Restauration de Bâtiment Historique', 'Restauration complète d''un bâtiment patrimonial du 19e siècle, préservant les caractéristiques originales tout en ajoutant des commodités modernes.');