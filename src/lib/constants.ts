// Company Information - Update these values as needed
export const COMPANY_NAME = 'Villa de Castor';
export const WHATSAPP_NUMBER = '+243827982055';
export const WHATSAPP_DISPLAY = '+243 827 982 055';
export const COMPANY_EMAIL = 'info@villadecastor.com';
export const COMPANY_PHONE = '+243 827 982 055';

// Address
export const COMPANY_ADDRESS = {
  street: 'Avenue Mpolo Maurice',
  building: 'Immeuble Triangle Davier',
  floor: '2e Étage, Local B5',
  reference: 'Réf: Derrière Ecobank, Arrêt Sabena, Boîte Le Basiluc',
  city: 'Kinshasa Gombe',
  country: 'RDC',
};

export const COMPANY_ADDRESS_DISPLAY = `${COMPANY_ADDRESS.street}, ${COMPANY_ADDRESS.building}, ${COMPANY_ADDRESS.floor}, ${COMPANY_ADDRESS.city}, ${COMPANY_ADDRESS.country}`;

// Official social profiles - single source of truth
const INSTAGRAM_URL = 'https://www.instagram.com/villa_de_castor?utm_source=qr&igsh=c3l0ZzFjM29rZmRw';

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1Cj95yXQxU/?mibextid=wwXIfr',
  instagram: INSTAGRAM_URL,
  tiktok: 'https://www.tiktok.com/@villadecastor?_r=1&_t=ZS-9B6djNiOzsj',
} as const;

// Canonical profile URLs without campaign/tracking parameters, for structured data
export const SOCIAL_PROFILE_URLS = [
  'https://www.facebook.com/share/1Cj95yXQxU/',
  'https://www.instagram.com/villa_de_castor',
  'https://www.tiktok.com/@villadecastor',
];

// Google Maps embed URL for Kinshasa Gombe (Avenue Mpolo Maurice area)
export const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5123456789!2d15.3125!3d-4.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a33c0c0c0c0c1%3A0x0!2sAvenue%20Mpolo%20Maurice%2C%20Kinshasa!5e0!3m2!1sfr!2scd!4v1700000000000!5m2!1sfr!2scd';

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
};
