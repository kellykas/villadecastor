import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, MessageCircle } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { COMPANY_NAME, getWhatsAppUrl, WHATSAPP_DISPLAY } from '@/lib/constants';

const quoteSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().min(6, 'Phone is required').max(20),
  email: z.string().email('Invalid email address').max(255).optional().or(z.literal('')),
  project_type: z.string().min(1, 'Project type is required'),
  description: z.string().max(2000).optional(),
  budget: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const Quote = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      project_type: '',
      description: '',
      budget: '',
    },
  });

  const projectTypes = language === 'fr' ? [
    { value: 'construction', label: 'Construction' },
    { value: 'renovation', label: 'Rénovation' },
    { value: 'rehabilitation', label: 'Réhabilitation' },
    { value: 'painting', label: 'Peinture & Décoration' },
    { value: 'interior', label: 'Aménagement Intérieur' },
    { value: 'other', label: 'Autre' },
  ] : [
    { value: 'construction', label: 'Construction' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'rehabilitation', label: 'Rehabilitation' },
    { value: 'painting', label: 'Painting & Decoration' },
    { value: 'interior', label: 'Interior Design' },
    { value: 'other', label: 'Other' },
  ];

  const budgetRanges = language === 'fr' ? [
    { value: 'under-5k', label: 'Moins de 5 000$' },
    { value: '5k-10k', label: '5 000$ - 10 000$' },
    { value: '10k-25k', label: '10 000$ - 25 000$' },
    { value: '25k-50k', label: '25 000$ - 50 000$' },
    { value: '50k-100k', label: '50 000$ - 100 000$' },
    { value: '100k+', label: '100 000$+' },
    { value: 'unknown', label: 'Je ne sais pas encore' },
  ] : [
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k+', label: '$100,000+' },
    { value: 'unknown', label: 'I don\'t know yet' },
  ];

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('quotes').insert({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        project_type: data.project_type,
        description: data.description || null,
        budget: data.budget || null,
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
      ? 'Bonjour, je souhaite demander un devis pour un projet.'
      : 'Hello, I would like to request a quote for a project.';
    window.open(getWhatsAppUrl(message), '_blank');
  };

  if (isSubmitted) {
      return (
      <MainLayout>
        <SEO 
          title={language === 'fr' ? 'Demande Envoyée' : 'Request Submitted'}
          url="/quote"
          noIndex={true}
        />
        <section className="py-20 md:py-32 bg-background min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto border-0 bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'fr' ? 'Demande Envoyée!' : 'Request Submitted!'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'fr' 
                    ? 'Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais.'
                    : 'Thank you for your request. Our team will contact you shortly.'}
                </p>
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="mr-2 w-4 h-4" />
                  {language === 'fr' ? 'Ou contactez-nous sur WhatsApp' : 'Or contact us on WhatsApp'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO 
        title={language === 'fr' ? 'Demande de Devis' : 'Request a Quote'}
        url="/quote"
        description={language === 'fr' 
          ? 'Demandez un devis gratuit pour vos projets de construction et rénovation en RDC. Réponse rapide garantie.'
          : 'Request a free quote for your construction and renovation projects in DRC. Quick response guaranteed.'}
        keywords={language === 'fr'
          ? 'devis construction RDC, estimation rénovation Kinshasa, prix travaux Lubumbashi'
          : 'construction quote DRC, renovation estimate Kinshasa, work prices Lubumbashi'}
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {language === 'fr' ? 'Demande de Devis' : 'Request a Quote'}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.'
              : 'Fill out the form below and we will contact you shortly.'}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 bg-card shadow-lg">
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'fr' ? 'Nom complet' : 'Full Name'} *</FormLabel>
                              <FormControl>
                                <Input placeholder={language === 'fr' ? 'Jean Dupont' : 'John Doe'} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'fr' ? 'Téléphone' : 'Phone'} *</FormLabel>
                              <FormControl>
                                <Input placeholder="+243 XXX XXX XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email ({language === 'fr' ? 'optionnel' : 'optional'})</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="project_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'fr' ? 'Type de travaux' : 'Type of Work'} *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={language === 'fr' ? 'Sélectionnez...' : 'Select...'} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {projectTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'fr' ? 'Budget estimatif' : 'Estimated Budget'} ({language === 'fr' ? 'optionnel' : 'optional'})</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={language === 'fr' ? 'Sélectionnez...' : 'Select...'} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {budgetRanges.map((range) => (
                                    <SelectItem key={range.value} value={range.value}>
                                      {range.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === 'fr' ? 'Description du projet' : 'Project Description'} ({language === 'fr' ? 'optionnel' : 'optional'})</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={language === 'fr' 
                                  ? 'Décrivez brièvement votre projet...'
                                  : 'Briefly describe your project...'}
                                className="min-h-[120px]"
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
                          ? (language === 'fr' ? 'Envoi en cours...' : 'Submitting...')
                          : (language === 'fr' ? 'Envoyer la demande' : 'Submit Request')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp CTA */}
            <div>
              <Card className="border-0 bg-card shadow-lg sticky top-24">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {language === 'fr' ? 'Préférez WhatsApp?' : 'Prefer WhatsApp?'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'fr' 
                      ? 'Contactez-nous directement pour une réponse rapide.'
                      : 'Contact us directly for a quick response.'}
                  </p>
                  <p className="text-lg font-semibold text-foreground mb-4">
                    {WHATSAPP_DISPLAY}
                  </p>
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Quote;
