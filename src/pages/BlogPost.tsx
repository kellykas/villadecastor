import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/layout/MainLayout';
import SEO from '@/components/SEO';
import ReadingProgress from '@/components/ReadingProgress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-construction.jpg';
import { COMPANY_NAME } from '@/lib/constants';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import DOMPurify from 'dompurify';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug, language],
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
          updated_at,
          blog_post_translations!inner(title, excerpt, content)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .eq('blog_post_translations.language', language)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  // Fetch related posts
  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', post?.category, post?.id, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          category,
          image_url,
          read_time,
          published_at,
          blog_post_translations!inner(title, excerpt)
        `)
        .eq('is_published', true)
        .eq('category', post?.category)
        .eq('blog_post_translations.language', language)
        .neq('id', post?.id)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!post?.category && !!post?.id
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd MMMM yyyy', { 
      locale: language === 'fr' ? fr : enUS 
    });
  };

  const getShareUrl = () => {
    return `https://villadecastor.com/blog/${slug}`;
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = post?.blog_post_translations[0]?.title || '';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(post?.blog_post_translations[0]?.title || '')}`, '_blank');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <SEO 
          title={language === 'fr' ? 'Article non trouvé' : 'Article Not Found'}
          url={`/blog/${slug}`}
          noIndex={true}
        />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'fr' ? 'Article non trouvé' : 'Article Not Found'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'fr' 
              ? 'L\'article que vous recherchez n\'existe pas ou a été supprimé.'
              : 'The article you are looking for does not exist or has been removed.'}
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 w-4 h-4" />
              {language === 'fr' ? 'Retour au blog' : 'Back to Blog'}
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const translation = post.blog_post_translations[0];
  const postTitle = translation?.title || '';
  const postExcerpt = translation?.excerpt || '';
  const postContent = translation?.content || '';

  return (
    <MainLayout>
      <ReadingProgress />
      <SEO 
        title={postTitle}
        description={postExcerpt}
        url={`/blog/${slug}`}
        image={post.image_url || undefined}
        type="article"
        keywords={`${post.category}, ${postTitle}, blog ${COMPANY_NAME}, construction RDC`}
        article={{
          publishedTime: post.published_at || undefined,
          modifiedTime: post.updated_at || undefined,
          author: COMPANY_NAME,
          section: post.category || undefined
        }}
      />

      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[3/1] relative overflow-hidden">
          <img 
            src={post.image_url || heroImage}
            alt={postTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 md:-mt-48 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg shadow-xl p-6 md:p-10 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
              {/* Back Link */}
              <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Retour au blog' : 'Back to Blog'}
              </Link>

              {/* Category Badge */}
              <Badge variant="secondary" className="mb-4 capitalize">
                {post.category}
              </Badge>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {postTitle}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.read_time}
                </span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  {language === 'fr' ? 'Partager:' : 'Share:'}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-full"
                  onClick={shareOnFacebook}
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-full"
                  onClick={shareOnTwitter}
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-full"
                  onClick={shareOnLinkedIn}
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
              {postExcerpt}
            </p>

            <Separator className="my-8" />

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-md
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postContent) }}
            />

            <Separator className="my-12" />

            {/* Author / Company Info */}
            <div className="bg-muted rounded-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0">
                  VC
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{COMPANY_NAME}</h3>
                  <p className="text-muted-foreground">
                    {language === 'fr' 
                      ? 'Expert en construction, rénovation et décoration intérieure en République Démocratique du Congo. Nous partageons notre expertise et nos conseils pour vos projets.'
                      : 'Expert in construction, renovation and interior design in the Democratic Republic of Congo. We share our expertise and advice for your projects.'}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              {language === 'fr' ? 'Articles similaires' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.slug}`}
                  className="group animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img 
                        src={relatedPost.image_url || heroImage}
                        alt={relatedPost.blog_post_translations[0]?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.blog_post_translations[0]?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.blog_post_translations[0]?.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
            {language === 'fr' ? 'Besoin d\'un devis pour votre projet?' : 'Need a quote for your project?'}
          </h2>
          <p className="text-secondary-foreground/80 mb-6 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Contactez-nous pour discuter de votre projet de construction ou de rénovation.'
              : 'Contact us to discuss your construction or renovation project.'}
          </p>
          <Link to="/quote">
            <Button size="lg">
              {language === 'fr' ? 'Demander un devis' : 'Request a Quote'}
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default BlogPost;
