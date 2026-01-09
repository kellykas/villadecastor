import { Award, Target, Eye, Heart, Users, Building, Clock, Shield, MapPin, FileCheck, Home, HardHat, Hammer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-construction.jpg';
import logoMain from '@/assets/logo-main.png';
import { COMPANY_NAME } from '@/lib/constants';
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
    ? `${COMPANY_NAME} est une entreprise de construction et rénovation basée en République Démocratique du Congo. Avec plus d'une décennie d'expérience, nous avons réussi à réaliser des centaines de projets résidentiels et commerciaux à Kinshasa et Lubumbashi, gagnant la confiance de nos clients grâce à notre dévouement à un savoir-faire de qualité et à un service exceptionnel.`
    : `${COMPANY_NAME} is a construction and renovation company based in the Democratic Republic of Congo. With over a decade of experience, we have successfully completed hundreds of residential and commercial projects in Kinshasa and Lubumbashi, earning the trust of our clients through our dedication to quality craftsmanship and exceptional service.`;

  const experienceText = language === 'fr'
    ? 'Notre équipe de professionnels qualifiés apporte une expertise dans tous les aspects de la construction, des fondations aux finitions. Nous nous engageons à utiliser les dernières techniques et technologies pour assurer l\'efficacité, la sécurité et la durabilité de chaque projet.'
    : 'Our team of skilled professionals brings expertise in all aspects of construction, from foundation to finishing. We are committed to using the latest techniques and technologies to ensure efficiency, safety, and durability in every project.';

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            {t('about.title')}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            {COMPANY_NAME} - {language === 'fr' 
              ? 'Construire l\'excellence en RDC'
              : 'Building excellence in DRC'}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-in-left opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={heroImage}
                  alt={`${COMPANY_NAME} team`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block animate-float">
                <div className="text-3xl font-bold">2014</div>
                <div className="text-sm">{language === 'fr' ? 'Fondée' : 'Founded'}</div>
              </div>
            </div>
            <div className="animate-fade-in-right opacity-0" style={{ animationDelay: '0.3s' }}>
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

      {/* Logo Identity Section */}
      <section className="py-16 md:py-24 bg-muted overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in opacity-0">
              {language === 'fr' ? 'Notre Identité' : 'Our Identity'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
              {language === 'fr' 
                ? 'Découvrez la signification profonde de notre logo et les valeurs qu\'il représente.'
                : 'Discover the deep meaning behind our logo and the values it represents.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Logo Display */}
            <div className="flex justify-center animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-75 group-hover:scale-100 transition-transform duration-700" />
                <img 
                  src={logoMain} 
                  alt="Villa de Castor Logo" 
                  className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Logo Elements Explanation */}
            <div className="space-y-8">
              {/* The Beaver */}
              <div className="flex gap-6 items-start animate-fade-in opacity-0 group" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Hammer className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {language === 'fr' ? 'Le Castor' : 'The Beaver'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'fr' 
                      ? 'Le castor symbolise le travail acharné, la précision, la persévérance et le savoir-faire. Il représente parfaitement une entreprise de construction et de rénovation qui construit avec intelligence et rigueur.'
                      : 'The beaver symbolizes hard work, precision, perseverance, and expertise. It perfectly represents a construction and renovation company that builds with intelligence and rigor.'}
                  </p>
                </div>
              </div>

              {/* The Helmet & Architecture */}
              <div className="flex gap-6 items-start animate-fade-in opacity-0 group" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <HardHat className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {language === 'fr' ? 'Le Casque et l\'Architecture' : 'The Helmet & Architecture'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'fr' 
                      ? 'Un casque de chantier symbolisant la sécurité, le professionnalisme et l\'expertise technique. Un toit de maison avec une fenêtre représentant l\'habitation, les bâtiments et la rénovation.'
                      : 'A construction helmet symbolizing safety, professionalism, and technical expertise. A house roof with a window representing housing, buildings, and renovation.'}
                  </p>
                </div>
              </div>

              {/* The Fusion */}
              <div className="flex gap-6 items-start animate-fade-in opacity-0 group" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Home className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {language === 'fr' ? 'La Fusion' : 'The Fusion'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'fr' 
                      ? 'Cette fusion montre une entreprise experte sur le terrain, spécialisée dans les projets résidentiels et architecturaux. Villa de Castor est une entreprise de construction et de rénovation fiable, solide et professionnelle, qui bâtit avec précision et qualité durable.'
                      : 'This fusion showcases a field-expert company, specialized in residential and architectural projects. Villa de Castor is a reliable, solid, and professional construction and renovation company that builds with precision and lasting quality.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tagline */}
          <div className="mt-16 text-center animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            <div className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg shadow-lg">
              <p className="text-lg font-semibold">
                {language === 'fr' 
                  ? 'Construction & Rénovation — Bâtir avec Excellence'
                  : 'Construction & Renovation — Building with Excellence'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
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
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-left opacity-0" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 hover:bg-primary hover:scale-110 transition-all duration-300 group">
                  <Target className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'fr' ? 'Notre Mission' : 'Our Mission'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {missionContent}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-right opacity-0" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 hover:bg-primary hover:scale-110 transition-all duration-300 group">
                  <Eye className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 animate-fade-in opacity-0">
            {language === 'fr' ? 'Nos Valeurs Fondamentales' : 'Our Core Values'}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
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

      {/* Team Members */}
      <section className="py-16 md:py-24 bg-muted overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in opacity-0">
              {language === 'fr' ? 'Notre Équipe' : 'Our Team'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
              {language === 'fr' 
                ? 'Des professionnels passionnés et dévoués à la réussite de vos projets.'
                : 'Passionate professionals dedicated to the success of your projects.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(language === 'fr' ? [
              { name: 'Jean-Pierre Kasongo', role: 'Directeur Général', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
              { name: 'Marie Lubamba', role: 'Architecte en Chef', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face' },
              { name: 'Patrick Mwamba', role: 'Chef de Chantier', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
              { name: 'Sarah Mukendi', role: 'Responsable Projets', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face' },
            ] : [
              { name: 'Jean-Pierre Kasongo', role: 'General Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
              { name: 'Marie Lubamba', role: 'Chief Architect', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face' },
              { name: 'Patrick Mwamba', role: 'Site Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
              { name: 'Sarah Mukendi', role: 'Project Manager', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face' },
            ]).map((member, index) => (
              <div 
                key={index} 
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.15 * index}s` }}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <div className="aspect-square">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-center gap-3">
                      <div className="w-8 h-8 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary-foreground/40 transition-colors cursor-pointer">
                        <Building className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
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
