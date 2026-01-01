import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-construction.jpg';
import { COMPANY_NAME } from '@/lib/constants';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const Blog = () => {
  const { language } = useLanguage();

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          category,
          image_url,
          read_time,
          is_featured,
          published_at,
          blog_post_translations!inner(title, excerpt, content)
        `)
        .eq('is_published', true)
        .eq('blog_post_translations.language', language)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const categories = language === 'fr' 
    ? [
        { key: 'all', label: 'Tous' },
        { key: 'construction', label: 'Construction' },
        { key: 'tips', label: 'Conseils' },
        { key: 'trends', label: 'Tendances' },
        { key: 'projects', label: 'Projets' }
      ]
    : [
        { key: 'all', label: 'All' },
        { key: 'construction', label: 'Construction' },
        { key: 'tips', label: 'Tips' },
        { key: 'trends', label: 'Trends' },
        { key: 'projects', label: 'Projects' }
      ];

  const featuredPost = blogPosts?.find(post => post.is_featured);
  const regularPosts = blogPosts?.filter(post => !post.is_featured) || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd MMM yyyy', { 
      locale: language === 'fr' ? fr : enUS 
    });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            {COMPANY_NAME} Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            {language === 'fr' ? 'Notre Blog' : 'Our Blog'}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            {language === 'fr' 
              ? 'Conseils, tendances et actualités du monde de la construction et de la rénovation en RDC'
              : 'Tips, trends and news from the construction and renovation world in DRC'}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Button
                key={category.key}
                variant={index === 0 ? 'default' : 'outline'}
                size="sm"
                className="rounded-full animate-fade-in opacity-0"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-12 md:py-16 bg-background">
              <div className="container mx-auto px-4">
                <Card className="overflow-hidden border-0 bg-card shadow-lg group animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-[16/10] md:aspect-auto relative overflow-hidden">
                      <img 
                        src={featuredPost.image_url || heroImage}
                        alt={featuredPost.blog_post_translations[0]?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary">
                        {language === 'fr' ? 'À la une' : 'Featured'}
                      </Badge>
                    </div>
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge variant="outline" className="w-fit mb-4 capitalize">
                        {featuredPost.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                        {featuredPost.blog_post_translations[0]?.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {featuredPost.blog_post_translations[0]?.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredPost.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.read_time}
                        </span>
                      </div>
                      <Link to={`/blog/${featuredPost.slug}`}>
                        <Button className="w-fit group/btn">
                          {language === 'fr' ? 'Lire l\'article' : 'Read Article'}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Blog Grid */}
          <section className="py-12 md:py-16 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 animate-fade-in opacity-0">
                {language === 'fr' ? 'Articles récents' : 'Recent Articles'}
              </h2>
              
              {regularPosts.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  {language === 'fr' ? 'Aucun article disponible.' : 'No articles available.'}
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post, index) => (
                    <Card 
                      key={post.id} 
                      className="overflow-hidden border-0 bg-card group hover:shadow-xl transition-all duration-300 animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img 
                          src={post.image_url || heroImage}
                          alt={post.blog_post_translations[0]?.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Badge variant="secondary" className="absolute top-3 left-3 capitalize">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.blog_post_translations[0]?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.blog_post_translations[0]?.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.read_time}
                          </span>
                        </div>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="link" className="p-0 mt-4 h-auto text-primary group/btn">
                            {language === 'fr' ? 'Lire la suite' : 'Read more'}
                            <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              {language === 'fr' ? 'Restez informé' : 'Stay Informed'}
            </h2>
            <p className="text-secondary-foreground/80 mb-8">
              {language === 'fr' 
                ? 'Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et conseils de construction.'
                : 'Subscribe to our newsletter to receive our latest articles and construction tips.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {language === 'fr' ? 'S\'abonner' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Blog;
