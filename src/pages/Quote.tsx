import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const quoteSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').max(255),
  project_type: z.string().min(1, 'Project type is required'),
  description: z.string().min(10, 'Please provide more details').max(2000),
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
    { value: 'residential', label: 'Construction Résidentielle' },
    { value: 'commercial', label: 'Projet Commercial' },
    { value: 'renovation', label: 'Rénovation' },
    { value: 'interior', label: 'Design d\'Intérieur' },
    { value: 'other', label: 'Autre' },
  ] : [
    { value: 'residential', label: 'Residential Construction' },
    { value: 'commercial', label: 'Commercial Project' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'interior', label: 'Interior Design' },
    { value: 'other', label: 'Other' },
  ];

  const budgetRanges = language === 'fr' ? [
    { value: '10k-50k', label: '10 000$ - 50 000$' },
    { value: '50k-100k', label: '50 000$ - 100 000$' },
    { value: '100k-250k', label: '100 000$ - 250 000$' },
    { value: '250k-500k', label: '250 000$ - 500 000$' },
    { value: '500k+', label: '500 000$+' },
  ] : [
    { value: '10k-50k', label: '$10,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-250k', label: '$100,000 - $250,000' },
    { value: '250k-500k', label: '$250,000 - $500,000' },
    { value: '500k+', label: '$500,000+' },
  ];

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('quotes').insert({
        full_name: data.full_name,
        phone: data.phone || null,
        email: data.email,
        project_type: data.project_type,
        description: data.description,
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

  if (isSubmitted) {
    return (
      <MainLayout>
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
                <p className="text-muted-foreground">
                  {t('quote.success')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {t('quote.title')}
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            {t('quote.subtitle')}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 bg-card shadow-lg">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('quote.name')} *</FormLabel>
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
                          <FormLabel>{t('quote.phone')}</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (514) 123-4567" {...field} />
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
                        <FormLabel>{t('quote.email')} *</FormLabel>
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
                          <FormLabel>{t('quote.project_type')} *</FormLabel>
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
                          <FormLabel>{t('quote.budget')}</FormLabel>
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
                        <FormLabel>{t('quote.description')} *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={language === 'fr' 
                              ? 'Décrivez votre projet en détail...'
                              : 'Describe your project in detail...'}
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
                      ? (language === 'fr' ? 'Envoi en cours...' : 'Submitting...')
                      : t('quote.submit')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default Quote;
