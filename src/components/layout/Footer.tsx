import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPANY_NAME, WHATSAPP_DISPLAY, COMPANY_EMAIL, COMPANY_ADDRESS } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/blog', label: 'Blog' },
    { href: '/quote', label: t('nav.quote') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(language === 'fr' ? 'Veuillez entrer votre email' : 'Please enter your email');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert([{ email, language }]);

      if (error) {
        if (error.code === '23505') {
          toast.error(language === 'fr' ? 'Cet email est déjà inscrit' : 'This email is already subscribed');
        } else {
          throw error;
        }
      } else {
        toast.success(language === 'fr' ? 'Inscription réussie!' : 'Successfully subscribed!');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(language === 'fr' ? 'Erreur lors de l\'inscription' : 'Error subscribing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Villa de Castor" className="h-14 w-auto brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/16pXwMdXkP/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/villa_de_castor?utm_source=qr&igsh=c3l0ZzFjM29rZmRw" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@tokos092?_r=1&_t=ZM-92vM9HEdLvY" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  {COMPANY_ADDRESS.street}<br />
                  {COMPANY_ADDRESS.building}<br />
                  {COMPANY_ADDRESS.city}, {COMPANY_ADDRESS.country}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary-foreground shrink-0" />
                <span className="text-primary-foreground/80">{WHATSAPP_DISPLAY}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-primary-foreground shrink-0" />
                <span className="text-primary-foreground/80">{COMPANY_EMAIL}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter & Hours */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {language === 'fr' ? 'Newsletter' : 'Newsletter'}
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-3">
                {language === 'fr' 
                  ? 'Recevez nos dernières actualités' 
                  : 'Get our latest news'}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm h-9"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isLoading}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-9 px-3"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('contact.hours')}</h3>
              <ul className="space-y-1.5 text-sm text-primary-foreground/80">
                <li className="flex justify-between">
                  <span>{language === 'fr' ? 'Lun - Ven' : 'Mon - Fri'}</span>
                  <span>8:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>{language === 'fr' ? 'Samedi' : 'Saturday'}</span>
                  <span>9:00 - 14:00</span>
                </li>
                <li className="flex justify-between">
                  <span>{language === 'fr' ? 'Dimanche' : 'Sunday'}</span>
                  <span>{language === 'fr' ? 'Fermé' : 'Closed'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} {COMPANY_NAME}. {t('footer.copyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
