import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPANY_NAME, WHATSAPP_DISPLAY, COMPANY_EMAIL, COMPANY_ADDRESS } from '@/lib/constants';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, language } = useLanguage();

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/blog', label: 'Blog' },
    { href: '/quote', label: t('nav.quote') },
    { href: '/contact', label: t('nav.contact') },
  ];

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
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
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

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact.hours')}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
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
