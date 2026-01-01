import { Award, Target, Eye, Heart, Users, Building, Clock, Shield, MapPin, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-construction.jpg';

const About = () => {
  const { t, language } = useLanguage();

  const values = language === 'fr' ? [
    { icon: Shield, title: 'Intégrité', description: 'Nous opérons avec honnêteté et transparence dans toutes nos affaires.' },
    { icon: Award, title: 'Excellence', description: 'Nous visons les plus hauts standards de qualité dans chaque projet.' },
    { icon: Users, title: 'Travail d\'Équipe', description: 'La collaboration est au cœur de notre succès.' },
    { icon: Heart, title: 'Engagement Client', description: 'La satisfaction de nos clients est notre priorité absolue.' },
  ] : [
    { icon: Shield, title: 'Integrity', description: 'We operate with honesty and transparency in all our dealings.' },
    { icon: Award, title: 'Excellence', description: 'We strive for the highest standards of quality in every project.' },
    { icon: Users, title: 'Teamwork', description: 'Collaboration is at the heart of our success.' },
    { icon: Heart, title: 'Client Commitment', description: 'Our clients\' satisfaction is our top priority.' },
  ];

  const stats = [
    { value: '10+', label: t('about.experience') },
    { value: '200+', label: t('about.projects_completed') },
    { value: '30+', label: t('about.team_members') },
    { value: '98%', label: t('about.satisfaction') },
  ];

  const missionContent = language === 'fr' 
    ? 'Notre mission est de livrer des projets de construction et de rénovation exceptionnels qui dépassent les attentes de nos clients, tout en maintenant les normes les plus élevées de sécurité, de qualité et de durabilité.'
    : 'Our mission is to deliver exceptional construction and renovation projects that exceed our clients\' expectations while maintaining the highest standards of safety, quality, and sustainability.';

  const visionContent = language === 'fr'
    ? 'Être le leader reconnu de l\'industrie de la construction en RDC, réputé pour notre innovation, notre fiabilité et notre engagement indéfectible envers l\'excellence.'
    : 'To be the recognized leader in the construction industry in DRC, renowned for our innovation, reliability, and unwavering commitment to excellence.';

  const aboutText = language === 'fr'
    ? 'Villa de Castor est une entreprise de construction et rénovation basée en République Démocratique du Congo. Avec plus d\'une décennie d\'expérience, nous avons réussi à réaliser des centaines de projets résidentiels et commerciaux à Kinshasa et Lubumbashi, gagnant la confiance de nos clients grâce à notre dévouement à un savoir-faire de qualité et à un service exceptionnel.'
    : 'Villa de Castor is a construction and renovation company based in the Democratic Republic of Congo. With over a decade of experience, we have successfully completed hundreds of residential and commercial projects in Kinshasa and Lubumbashi, earning the trust of our clients through our dedication to quality craftsmanship and exceptional service.';

  const experienceText = language === 'fr'
    ? 'Notre équipe de professionnels qualifiés apporte une expertise dans tous les aspects de la construction, des fondations aux finitions. Nous nous engageons à utiliser les dernières techniques et technologies pour assurer l\'efficacité, la sécurité et la durabilité de chaque projet.'
    : 'Our team of skilled professionals brings expertise in all aspects of construction, from foundation to finishing. We are committed to using the latest techniques and technologies to ensure efficiency, safety, and durability in every project.';

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            Villa de Castor - {language === 'fr' 
              ? 'Construire l\'excellence en RDC'
              : 'Building excellence in DRC'}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={heroImage}
                  alt="Villa de Castor team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block">
                <div className="text-3xl font-bold">2014</div>
                <div className="text-sm">{language === 'fr' ? 'Fondée' : 'Founded'}</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {language === 'fr' ? 'Notre Histoire' : 'Our Story'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {aboutText}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {experienceText}
              </p>
              
              {/* DRC-specific credentials */}
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    {language === 'fr' ? 'Zones d\'intervention : Kinshasa & Lubumbashi' : 'Service areas: Kinshasa & Lubumbashi'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    {language === 'fr' ? 'Entreprise légalement enregistrée' : 'Legally registered company'}
                  </span>
                </div>
                <div className="pl-8 text-sm text-muted-foreground">
                  <p>RCCM: XX-XXXXX-XXXXX-X</p>
                  <p>ID NAT: X-XXX-XXXXX-X</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 bg-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'fr' ? 'Notre Mission' : 'Our Mission'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {missionContent}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'fr' ? 'Notre Vision' : 'Our Vision'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {visionContent}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {language === 'fr' ? 'Nos Valeurs Fondamentales' : 'Our Core Values'}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground text-center mb-12">
            {language === 'fr' ? 'Nos Engagements' : 'Our Commitments'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 bg-card">
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'fr' ? 'Livraison à Temps' : 'On-Time Delivery'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' 
                    ? 'Nous respectons les délais et tenons nos promesses.'
                    : 'We meet deadlines and keep our promises.'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card">
              <CardContent className="p-6 text-center">
                <Award className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'fr' ? 'Assurance Qualité' : 'Quality Assurance'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr'
                    ? 'Chaque projet subit des contrôles de qualité rigoureux.'
                    : 'Every project undergoes rigorous quality checks.'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card">
              <CardContent className="p-6 text-center">
                <Building className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'fr' ? 'Construction Durable' : 'Sustainable Building'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr'
                    ? 'Engagés envers des pratiques respectueuses de l\'environnement.'
                    : 'Committed to environmentally responsible practices.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
