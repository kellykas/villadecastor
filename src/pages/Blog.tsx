import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-construction.jpg';
import { COMPANY_NAME } from '@/lib/constants';

const Blog = () => {
  const { language } = useLanguage();

  const categories = language === 'fr' 
    ? ['Tous', 'Construction', 'Rénovation', 'Conseils', 'Tendances', 'Projets']
    : ['All', 'Construction', 'Renovation', 'Tips', 'Trends', 'Projects'];

  const blogPosts = language === 'fr' ? [
    {
      id: 1,
      title: 'Les tendances de construction 2024 en RDC',
      excerpt: 'Découvrez les nouvelles tendances architecturales et les matériaux innovants qui transforment le secteur de la construction en République Démocratique du Congo.',
      category: 'Tendances',
      author: 'Villa de Castor',
      date: '15 Déc 2024',
      readTime: '5 min',
      image: heroImage,
      featured: true
    },
    {
      id: 2,
      title: 'Comment planifier votre projet de rénovation',
      excerpt: 'Un guide complet pour planifier efficacement votre projet de rénovation, du budget initial à la sélection des matériaux.',
      category: 'Conseils',
      author: 'Villa de Castor',
      date: '10 Déc 2024',
      readTime: '8 min',
      image: heroImage,
      featured: false
    },
    {
      id: 3,
      title: 'Matériaux durables pour la construction moderne',
      excerpt: 'Explorer les options de matériaux écologiques et durables disponibles pour les projets de construction en Afrique centrale.',
      category: 'Construction',
      author: 'Villa de Castor',
      date: '5 Déc 2024',
      readTime: '6 min',
      image: heroImage,
      featured: false
    },
    {
      id: 4,
      title: 'Réhabilitation d\'un immeuble commercial à Kinshasa',
      excerpt: 'Étude de cas détaillée sur la réhabilitation complète d\'un bâtiment commercial dans le centre de Kinshasa.',
      category: 'Projets',
      author: 'Villa de Castor',
      date: '1 Déc 2024',
      readTime: '10 min',
      image: heroImage,
      featured: false
    },
    {
      id: 5,
      title: 'L\'importance de l\'isolation thermique',
      excerpt: 'Pourquoi l\'isolation thermique est cruciale pour le confort et l\'efficacité énergétique de votre maison.',
      category: 'Conseils',
      author: 'Villa de Castor',
      date: '25 Nov 2024',
      readTime: '4 min',
      image: heroImage,
      featured: false
    },
    {
      id: 6,
      title: 'Décoration intérieure : les styles populaires',
      excerpt: 'Les styles de décoration intérieure les plus demandés par nos clients à Kinshasa et Lubumbashi.',
      category: 'Tendances',
      author: 'Villa de Castor',
      date: '20 Nov 2024',
      readTime: '7 min',
      image: heroImage,
      featured: false
    }
  ] : [
    {
      id: 1,
      title: 'Construction Trends 2024 in DRC',
      excerpt: 'Discover the new architectural trends and innovative materials transforming the construction sector in the Democratic Republic of Congo.',
      category: 'Trends',
      author: 'Villa de Castor',
      date: 'Dec 15, 2024',
      readTime: '5 min',
      image: heroImage,
      featured: true
    },
    {
      id: 2,
      title: 'How to Plan Your Renovation Project',
      excerpt: 'A comprehensive guide to effectively planning your renovation project, from initial budget to material selection.',
      category: 'Tips',
      author: 'Villa de Castor',
      date: 'Dec 10, 2024',
      readTime: '8 min',
      image: heroImage,
      featured: false
    },
    {
      id: 3,
      title: 'Sustainable Materials for Modern Construction',
      excerpt: 'Exploring eco-friendly and sustainable material options available for construction projects in Central Africa.',
      category: 'Construction',
      author: 'Villa de Castor',
      date: 'Dec 5, 2024',
      readTime: '6 min',
      image: heroImage,
      featured: false
    },
    {
      id: 4,
      title: 'Commercial Building Rehabilitation in Kinshasa',
      excerpt: 'Detailed case study on the complete rehabilitation of a commercial building in downtown Kinshasa.',
      category: 'Projects',
      author: 'Villa de Castor',
      date: 'Dec 1, 2024',
      readTime: '10 min',
      image: heroImage,
      featured: false
    },
    {
      id: 5,
      title: 'The Importance of Thermal Insulation',
      excerpt: 'Why thermal insulation is crucial for the comfort and energy efficiency of your home.',
      category: 'Tips',
      author: 'Villa de Castor',
      date: 'Nov 25, 2024',
      readTime: '4 min',
      image: heroImage,
      featured: false
    },
    {
      id: 6,
      title: 'Interior Decoration: Popular Styles',
      excerpt: 'The most requested interior decoration styles by our clients in Kinshasa and Lubumbashi.',
      category: 'Trends',
      author: 'Villa de Castor',
      date: 'Nov 20, 2024',
      readTime: '7 min',
      image: heroImage,
      featured: false
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
                key={category}
                variant={index === 0 ? 'default' : 'outline'}
                size="sm"
                className="rounded-full animate-fade-in opacity-0"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-0 bg-card shadow-lg group animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="grid md:grid-cols-2">
                <div className="aspect-[16/10] md:aspect-auto relative overflow-hidden">
                  <img 
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">
                    {language === 'fr' ? 'À la une' : 'Featured'}
                  </Badge>
                </div>
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button className="w-fit group/btn">
                    {language === 'fr' ? 'Lire l\'article' : 'Read Article'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="overflow-hidden border-0 bg-card group hover:shadow-xl transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge variant="secondary" className="absolute top-3 left-3">
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <Button variant="link" className="p-0 mt-4 h-auto text-primary group/btn">
                    {language === 'fr' ? 'Lire la suite' : 'Read more'}
                    <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="animate-fade-in opacity-0" style={{ animationDelay: '0.5s' }}>
              {language === 'fr' ? 'Charger plus d\'articles' : 'Load More Articles'}
            </Button>
          </div>
        </div>
      </section>

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
