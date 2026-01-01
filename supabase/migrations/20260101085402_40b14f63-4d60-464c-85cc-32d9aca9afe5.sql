-- Create storage buckets for services and projects images
INSERT INTO storage.buckets (id, name, public) VALUES ('services-images', 'services-images', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('projects-images', 'projects-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for services-images bucket (drop if exists first)
DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update service images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete service images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;

CREATE POLICY "Public can view service images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'services-images');

CREATE POLICY "Admins can upload service images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'services-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'services-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'services-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view project images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'projects-images');

CREATE POLICY "Admins can upload project images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'projects-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'projects-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'projects-images' AND has_role(auth.uid(), 'admin'));

-- Add new translation keys for hero section
INSERT INTO translations (key, language, value) VALUES 
  ('hero.slogan', 'fr', 'Construction, rénovation & décoration intérieure en RDC'),
  ('hero.slogan', 'en', 'Construction, renovation & interior design in DRC'),
  ('hero.whatsapp', 'fr', 'Contactez-nous sur WhatsApp'),
  ('hero.whatsapp', 'en', 'Contact us on WhatsApp'),
  ('about.zones', 'fr', 'Zones d''intervention : Kinshasa & Lubumbashi'),
  ('about.zones', 'en', 'Service areas: Kinshasa & Lubumbashi'),
  ('about.legal', 'fr', 'Entreprise légalement enregistrée - RCCM & ID NAT'),
  ('about.legal', 'en', 'Legally registered company - RCCM & ID NAT')
ON CONFLICT (key, language) DO UPDATE SET value = EXCLUDED.value;