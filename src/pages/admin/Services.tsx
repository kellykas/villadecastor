import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Services = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    image_url: '', 
    display_order: 0, 
    is_active: true,
    translations: { en: { title: '', description: '' }, fr: { title: '', description: '' } }
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select(`*, service_translations(*)`).order('display_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: languages } = useQuery({
    queryKey: ['admin-languages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('languages').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error: serviceError } = await supabase.from('services').update({ 
          image_url: data.image_url, 
          display_order: data.display_order, 
          is_active: data.is_active 
        }).eq('id', data.id);
        if (serviceError) throw serviceError;

        for (const [lang, trans] of Object.entries(data.translations)) {
          const { error: transError } = await supabase.from('service_translations').upsert({
            service_id: data.id,
            language: lang,
            title: trans.title,
            description: trans.description
          }, { onConflict: 'service_id,language' });
          if (transError) throw transError;
        }
      } else {
        const { data: newService, error: serviceError } = await supabase.from('services').insert({ 
          image_url: data.image_url, 
          display_order: data.display_order, 
          is_active: data.is_active 
        }).select().single();
        if (serviceError) throw serviceError;

        for (const [lang, trans] of Object.entries(data.translations)) {
          const { error: transError } = await supabase.from('service_translations').insert({
            service_id: newService.id,
            language: lang,
            title: trans.title,
            description: trans.description
          });
          if (transError) throw transError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: editingId ? 'Service updated' : 'Service added' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: 'Service deleted' });
    }
  });

  const resetForm = () => {
    setFormData({ 
      image_url: '', 
      display_order: 0, 
      is_active: true,
      translations: { en: { title: '', description: '' }, fr: { title: '', description: '' } }
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: any) => {
    const translations: any = { en: { title: '', description: '' }, fr: { title: '', description: '' } };
    service.service_translations?.forEach((t: any) => {
      translations[t.language] = { title: t.title, description: t.description || '' };
    });
    setFormData({ 
      image_url: service.image_url || '', 
      display_order: service.display_order || 0, 
      is_active: service.is_active ?? true,
      translations
    });
    setEditingId(service.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingId || undefined });
  };

  const updateTranslation = (lang: string, field: string, value: string) => {
    setFormData({
      ...formData,
      translations: {
        ...formData.translations,
        [lang]: { ...formData.translations[lang as keyof typeof formData.translations], [field]: value }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">Manage your services</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Service</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Service' : 'Add Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                </div>
                
                <Tabs defaultValue="en">
                  <TabsList>
                    {languages?.map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code}>{lang.name}</TabsTrigger>
                    ))}
                  </TabsList>
                  {languages?.map((lang) => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title ({lang.name})</Label>
                        <Input 
                          value={formData.translations[lang.code as keyof typeof formData.translations]?.title || ''} 
                          onChange={(e) => updateTranslation(lang.code, 'title', e.target.value)} 
                          required={lang.code === 'en'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description ({lang.name})</Label>
                        <Textarea 
                          value={formData.translations[lang.code as keyof typeof formData.translations]?.description || ''} 
                          onChange={(e) => updateTranslation(lang.code, 'description', e.target.value)} 
                          rows={3}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Title (EN)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services?.map((service) => {
                    const enTrans = service.service_translations?.find((t: any) => t.language === 'en');
                    return (
                      <TableRow key={service.id}>
                        <TableCell>{service.display_order}</TableCell>
                        <TableCell className="font-medium">{enTrans?.title || 'Untitled'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(service)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(service.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Services;
