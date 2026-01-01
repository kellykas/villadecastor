import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWhatsAppUrl } from '@/lib/constants';

const FloatingWhatsApp = () => {
  const { language } = useLanguage();

  const handleClick = () => {
    const message = language === 'fr' 
      ? 'Bonjour, je souhaite obtenir des informations sur vos services.'
      : 'Hello, I would like to get information about your services.';
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-float hover:scale-110"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden md:block translate-x-2 group-hover:translate-x-0">
        {language === 'fr' ? 'Contactez-nous' : 'Contact us'}
      </span>
    </button>
  );
};

export default FloatingWhatsApp;
