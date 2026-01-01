import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-construction.jpg';
import { COMPANY_NAME } from '@/lib/constants';

const Projects = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['all-projects', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          category,
          is_featured,
          project_translations!inner(title, description),
          project_images(image_url, display_order)
        `)
        .eq('is_active', true)
        .eq('project_translations.language', language);
      
      if (error) throw error;
      return data;
    }
  });

  const categories = projects 
    ? [...new Set(projects.map(p => p.category).filter(Boolean))]
    : [];

  const filteredProjects = activeFilter
    ? projects?.filter(p => p.category === activeFilter)
    : projects;

  const categoryLabels: Record<string, Record<string, string>> = {
    en: {
      residential: 'Residential',
      commercial: 'Commercial',
      renovation: 'Renovation',
      rehabilitation: 'Rehabilitation',
      construction: 'Construction',
      interior: 'Interior Design',
      painting: 'Painting',
    },
    fr: {
      residential: 'Résidentiel',
      commercial: 'Commercial',
      renovation: 'Rénovation',
      rehabilitation: 'Réhabilitation',
      construction: 'Construction',
      interior: 'Aménagement Intérieur',
      painting: 'Peinture',
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {language === 'fr' ? 'Nos Réalisations' : 'Our Projects'}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Découvrez nos projets réalisés à Kinshasa et Lubumbashi. Chaque chantier témoigne de notre savoir-faire.'
              : 'Discover our completed projects in Kinshasa and Lubumbashi. Each project showcases our expertise.'}
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={activeFilter === null ? 'default' : 'outline'}
              onClick={() => setActiveFilter(null)}
              className={activeFilter === null ? 'bg-primary text-primary-foreground' : ''}
            >
              {language === 'fr' ? 'Tous' : 'All'}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? 'default' : 'outline'}
                onClick={() => setActiveFilter(category)}
                className={activeFilter === category ? 'bg-primary text-primary-foreground' : ''}
              >
                {categoryLabels[language]?.[category || ''] || category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">{t('common.loading')}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects?.map((project) => {
                const translation = project.project_translations[0];
                const images = project.project_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
                const mainImage = images[0]?.image_url || heroImage;
                
                return (
                  <Card key={project.id} className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300">
                    {/* Main Image */}
                    <div className="aspect-[16/10] bg-secondary/20 relative overflow-hidden">
                      <img 
                        src={mainImage}
                        alt={translation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full capitalize">
                          {categoryLabels[language]?.[project.category || ''] || project.category}
                        </span>
                        {project.is_featured && (
                          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                            {language === 'fr' ? 'Vedette' : 'Featured'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Before/After Images (if multiple images exist) */}
                    {images.length >= 2 && (
                      <div className="grid grid-cols-2 gap-1 p-1 bg-muted">
                        <div className="relative aspect-video">
                          <img 
                            src={images[0]?.image_url || heroImage} 
                            alt={language === 'fr' ? 'Avant' : 'Before'}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-secondary/80 text-secondary-foreground text-xs rounded">
                            {language === 'fr' ? 'Avant' : 'Before'}
                          </span>
                        </div>
                        <div className="relative aspect-video">
                          <img 
                            src={images[1]?.image_url || heroImage} 
                            alt={language === 'fr' ? 'Après' : 'After'}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary/80 text-primary-foreground text-xs rounded">
                            {language === 'fr' ? 'Après' : 'After'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {translation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {translation.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{language === 'fr' ? 'Kinshasa / Lubumbashi, RDC' : 'Kinshasa / Lubumbashi, DRC'}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {filteredProjects?.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              {language === 'fr' ? 'Aucun projet trouvé' : 'No projects found'}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Projects;
