import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Star, Image } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    category: '', 
    is_active: true,
    is_featured: false,
    images: [] as string[],
    translations: { en: { title: '', description: '' }, fr: { title: '', description: '' } }
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select(`*, project_translations(*), project_images(*)`).order('created_at', { ascending: false });
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
      let projectId = data.id;
      
      if (data.id) {
        const { error: projectError } = await supabase.from('projects').update({ 
          category: data.category, 
          is_active: data.is_active,
          is_featured: data.is_featured
        }).eq('id', data.id);
        if (projectError) throw projectError;

        for (const [lang, trans] of Object.entries(data.translations)) {
          const { error: transError } = await supabase.from('project_translations').upsert({
            project_id: data.id,
            language: lang,
            title: trans.title,
            description: trans.description
          }, { onConflict: 'project_id,language' });
          if (transError) throw transError;
        }
      } else {
        const { data: newProject, error: projectError } = await supabase.from('projects').insert({ 
          category: data.category, 
          is_active: data.is_active,
          is_featured: data.is_featured
        }).select().single();
        if (projectError) throw projectError;
        projectId = newProject.id;

        for (const [lang, trans] of Object.entries(data.translations)) {
          const { error: transError } = await supabase.from('project_translations').insert({
            project_id: newProject.id,
            language: lang,
            title: trans.title,
            description: trans.description
          });
          if (transError) throw transError;
        }
      }

      // Handle images
      if (projectId) {
        await supabase.from('project_images').delete().eq('project_id', projectId);
        if (data.images.length > 0) {
          const imageInserts = data.images.map((url, index) => ({
            project_id: projectId!,
            image_url: url,
            display_order: index
          }));
          const { error: imgError } = await supabase.from('project_images').insert(imageInserts);
          if (imgError) throw imgError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: editingId ? 'Project updated' : 'Project added' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Project deleted' });
    }
  });

  const resetForm = () => {
    setFormData({ 
      category: '', 
      is_active: true,
      is_featured: false,
      images: [],
      translations: { en: { title: '', description: '' }, fr: { title: '', description: '' } }
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (project: any) => {
    const translations: any = { en: { title: '', description: '' }, fr: { title: '', description: '' } };
    project.project_translations?.forEach((t: any) => {
      translations[t.language] = { title: t.title, description: t.description || '' };
    });
    const images = project.project_images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.image_url) || [];
    setFormData({ 
      category: project.category || '', 
      is_active: project.is_active ?? true,
      is_featured: project.is_featured ?? false,
      images,
      translations
    });
    setEditingId(project.id);
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

  const addImage = (url: string) => {
    setFormData({ ...formData, images: [...formData.images, url] });
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Project</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. residential, commercial" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Featured</Label>
                  <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                </div>

                <div className="space-y-2">
                  <Label>Project Images</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt="" className="w-20 h-20 object-cover rounded border border-border" />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-5 h-5"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload 
                    bucket="projects-images"
                    onUpload={addImage}
                  />
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
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Images</TableHead>
                    <TableHead>Title (EN)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects?.map((project) => {
                    const enTrans = project.project_translations?.find((t: any) => t.language === 'en');
                    const firstImage = project.project_images?.[0]?.image_url;
                    return (
                      <TableRow key={project.id}>
                        <TableCell>
                          {firstImage ? (
                            <img src={firstImage} alt="" className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Image className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{enTrans?.title || 'Untitled'}</TableCell>
                        <TableCell className="capitalize">{project.category || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${project.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {project.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {project.is_featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(project)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(project.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default Projects;
