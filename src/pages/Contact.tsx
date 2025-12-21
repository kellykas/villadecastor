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

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      lines: ['123 Construction Avenue', 'Montreal, QC H1A 1A1'],
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      lines: ['+1 (514) 123-4567', '+1 (514) 765-4321'],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: ['info@buildpro.com', 'quotes@buildpro.com'],
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      lines: [
        language === 'fr' ? 'Lun-Ven: 8h - 18h' : 'Mon-Fri: 8AM - 6PM',
        language === 'fr' ? 'Sam: 9h - 16h' : 'Sat: 9AM - 4PM',
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
              <a
                href="https://wa.me/15141234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {language === 'fr' ? 'Contactez-nous sur WhatsApp' : 'Contact us on WhatsApp'}
              </a>

              {/* Map */}
              <div className="mt-8 aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d178787.89915717835!2d-73.68248877961808!3d45.55980891908442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a541c64b70d%3A0x654e3138211fefef!2sMontreal%2C%20QC%2C%20Canada!5e0!3m2!1sen!2sus!4v1702000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BuildPro Location"
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
