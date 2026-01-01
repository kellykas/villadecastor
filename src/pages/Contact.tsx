import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { COMPANY_NAME, COMPANY_EMAIL, WHATSAPP_DISPLAY, getWhatsAppUrl } from '@/lib/constants';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  message: z.string().min(10, 'Message is too short').max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: data.name,
        email: data.email,
        message: data.message,
        language: language,
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: language === 'fr' 
          ? 'Une erreur est survenue. Veuillez réessayer.'
          : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = language === 'fr' 
      ? 'Bonjour, je souhaite vous contacter.'
      : 'Hello, I would like to contact you.';
    window.open(getWhatsAppUrl(message), '_blank');
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'fr' ? 'Adresse' : 'Address',
      lines: ['Kinshasa, RDC', 'Lubumbashi, RDC'],
    },
    {
      icon: Phone,
      title: language === 'fr' ? 'Téléphone' : 'Phone',
      lines: [WHATSAPP_DISPLAY],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [COMPANY_EMAIL],
    },
    {
      icon: Clock,
      title: language === 'fr' ? 'Horaires' : 'Hours',
      lines: [
        language === 'fr' ? 'Lun-Ven: 8h - 18h' : 'Mon-Fri: 8AM - 6PM',
        language === 'fr' ? 'Sam: 9h - 14h' : 'Sat: 9AM - 2PM',
      ],
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {language === 'fr' ? 'Informations de Contact' : 'Contact Information'}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 bg-card">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.lines.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* WhatsApp Button */}
              <Button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white mb-8"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {language === 'fr' ? 'Contactez-nous sur WhatsApp' : 'Contact us on WhatsApp'}
              </Button>

              {/* Map - Kinshasa */}
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254747.51837626!2d15.207686!3d-4.3217055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a30e7e9f7e8bf%3A0x4c6b5e0c70c5c2c5!2sKinshasa%2C%20Democratic%20Republic%20of%20the%20Congo!5e0!3m2!1sen!2sus!4v1702000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${COMPANY_NAME} Location`}
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {language === 'fr' ? 'Envoyez-nous un Message' : 'Send Us a Message'}
              </h2>

              {isSubmitted ? (
                <Card className="border-0 bg-card">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {language === 'fr' ? 'Message Envoyé!' : 'Message Sent!'}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('contact.success')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 bg-card shadow-lg">
                  <CardContent className="p-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.name')} *</FormLabel>
                              <FormControl>
                                <Input placeholder={language === 'fr' ? 'Jean Dupont' : 'John Doe'} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.email')} *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.message')} *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === 'fr' 
                                    ? 'Comment pouvons-nous vous aider?'
                                    : 'How can we help you?'}
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting 
                            ? (language === 'fr' ? 'Envoi en cours...' : 'Sending...')
                            : t('contact.send')}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
