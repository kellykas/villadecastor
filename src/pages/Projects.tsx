import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-construction.jpg';

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
          project_translations!inner(title, description)
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
      industrial: 'Industrial',
    },
    fr: {
      residential: 'Résidentiel',
      commercial: 'Commercial',
      renovation: 'Rénovation',
      industrial: 'Industriel',
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {t('projects.title')}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            {t('projects.subtitle')}
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects?.map((project) => {
                const translation = project.project_translations[0];
                return (
                  <Card key={project.id} className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[16/10] bg-secondary/20 relative overflow-hidden">
                      <img 
                        src={heroImage}
                        alt={translation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
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
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {translation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {translation.description}
                      </p>
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
