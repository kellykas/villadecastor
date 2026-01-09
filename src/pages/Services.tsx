import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Hammer, PaintBucket, Home as HomeIcon, Wrench, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const serviceIcons = [Building2, Hammer, PaintBucket, HomeIcon, Wrench, Truck];

const Services = () => {
  const { t, language } = useLanguage();

  const { data: services, isLoading } = useQuery({
    queryKey: ['all-services', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          image_url,
          display_order,
          service_translations!inner(title, description)
        `)
        .eq('is_active', true)
        .eq('service_translations.language', language)
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <MainLayout>
      <SEO 
        title={language === 'fr' ? 'Nos Services' : 'Our Services'}
        url="/services"
        description={language === 'fr' 
          ? 'Services de construction, rénovation, peinture et décoration intérieure en RDC. Travaux de qualité à Kinshasa et Lubumbashi.'
          : 'Construction, renovation, painting and interior design services in DRC. Quality work in Kinshasa and Lubumbashi.'}
        keywords={language === 'fr'
          ? 'services construction RDC, rénovation Kinshasa, peinture Lubumbashi, décoration intérieure Congo'
          : 'construction services DRC, renovation Kinshasa, painting Lubumbashi, interior design Congo'}
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            {t('services.title')}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">{t('common.loading')}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services?.map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                const translation = service.service_translations[0];
                return (
                  <Card 
                    key={service.id} 
                    className="group border-0 bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-300 group-hover:scale-110">
                          <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {translation.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {translation.description}
                          </p>
                          <Link to="/quote" className="inline-flex items-center text-primary font-medium hover:underline group/link">
                            {t('nav.quote')}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            {t('cta.description')}
          </p>
          <Link to="/quote">
            <Button size="lg" variant="secondary" className="font-semibold text-lg px-10">
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Services;
