import { Link } from 'react-router-dom';
import { ArrowRight, Award, Clock, DollarSign, HeadphonesIcon, Building2, Hammer, PaintBucket, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-construction.jpg';

const serviceIcons = [Building2, Hammer, PaintBucket, HomeIcon];

const Index = () => {
  const { t, language } = useLanguage();

  const { data: services } = useQuery({
    queryKey: ['services', language],
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

  const { data: projects } = useQuery({
    queryKey: ['projects', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          category,
          project_translations!inner(title, description)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .eq('project_translations.language', language)
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const stats = [
    { value: '25+', label: t('about.experience') },
    { value: '500+', label: t('about.projects_completed') },
    { value: '50+', label: t('about.team_members') },
    { value: '98%', label: t('about.satisfaction') },
  ];

  const whyChooseUs = [
    { icon: Award, title: t('why.quality'), description: t('why.quality_desc') },
    { icon: Clock, title: t('why.time'), description: t('why.time_desc') },
    { icon: DollarSign, title: t('why.budget'), description: t('why.budget_desc') },
    { icon: HeadphonesIcon, title: t('why.support'), description: t('why.support_desc') },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 font-semibold text-lg px-8">
                  {t('hero.secondary_cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('about.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('about.description')}
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  {t('common.learn_more')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img 
                  src={heroImage}
                  alt="Construction team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm">{t('about.experience')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services?.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              const translation = service.service_translations[0];
              return (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                    </div>
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
          
          <div className="text-center mt-10">
            <Link to="/services">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('services.view_all')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t('why.title')}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('projects.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {projects?.map((project) => {
              const translation = project.project_translations[0];
              return (
                <Card key={project.id} className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/10] bg-secondary/20 relative overflow-hidden">
                    <img 
                      src={heroImage}
                      alt={translation.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full capitalize">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {translation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {translation.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/projects">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('projects.view_all')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
            {t('cta.description')}
          </p>
          <Link to="/quote">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10">
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
