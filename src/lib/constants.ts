// Company Information - Update these values as needed
export const COMPANY_NAME = 'Villa de Castor';
export const WHATSAPP_NUMBER = '+243827982055';
export const WHATSAPP_DISPLAY = '+243 827 982 055';
export const COMPANY_EMAIL = 'info@villadecastor.com';
export const COMPANY_PHONE = '+243 827 982 055';
export const COMPANY_ADDRESS_KINSHASA = 'Kinshasa, RDC';
export const COMPANY_ADDRESS_LUBUMBASHI = 'Lubumbashi, RDC';

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
};
