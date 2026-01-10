import { Helmet } from 'react-helmet-async';
import { COMPANY_NAME, COMPANY_ADDRESS, COMPANY_PHONE, COMPANY_EMAIL } from '@/lib/constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
  noIndex?: boolean;
}

const DEFAULT_IMAGE = 'https://villadecastor.com/og-image.png';

export const SEO = ({
  title,
  description = 'Villa de Castor - Construction, rénovation et décoration intérieure de qualité en République Démocratique du Congo. Services professionnels à Kinshasa et Lubumbashi.',
  keywords = 'construction RDC, rénovation Kinshasa, décoration intérieure Congo, entreprise bâtiment Lubumbashi, Villa de Castor, construction Congo, travaux bâtiment RDC',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  article,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${COMPANY_NAME}` : `${COMPANY_NAME} - Construction, Rénovation & Décoration en RDC`;
  const siteUrl = 'https://villadecastor.com';
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Organization JSON-LD
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    url: siteUrl,
    logo: DEFAULT_IMAGE,
    description: description,
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY_ADDRESS.street}, ${COMPANY_ADDRESS.building}, ${COMPANY_ADDRESS.floor}`,
      addressLocality: COMPANY_ADDRESS.city,
      addressCountry: 'CD',
    },
    areaServed: [
      { '@type': 'City', name: 'Kinshasa' },
      { '@type': 'City', name: 'Lubumbashi' },
    ],
    sameAs: [],
  };

  // LocalBusiness JSON-LD for construction company
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: COMPANY_NAME,
    image: DEFAULT_IMAGE,
    url: siteUrl,
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY_ADDRESS.street}, ${COMPANY_ADDRESS.building}, ${COMPANY_ADDRESS.floor}`,
      addressLocality: COMPANY_ADDRESS.city,
      addressCountry: 'CD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -4.3,
      longitude: 15.3125,
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de Construction',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Construction' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rénovation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Décoration Intérieure' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Travaux de Finition' } },
      ],
    },
  };

  // WebSite JSON-LD
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY_NAME,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = url && url !== '/' ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title || 'Page',
        item: canonicalUrl,
      },
    ],
  } : null;

  // Article JSON-LD (for blog posts)
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime,
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={COMPANY_NAME} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={COMPANY_NAME} />
      <meta property="og:locale" content="fr_CD" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}

      {/* Geo tags */}
      <meta name="geo.region" content="CD" />
      <meta name="geo.placename" content="Kinshasa" />
      <meta name="geo.position" content="-4.3;15.3125" />
      <meta name="ICBM" content="-4.3, 15.3125" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
