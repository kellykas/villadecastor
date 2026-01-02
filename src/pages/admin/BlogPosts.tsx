import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, Image } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BlogPosts = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    slug: '',
    category: 'construction',
    read_time: '5 min',
    is_published: false,
    is_featured: false,
    image_url: '',
    title_en: '',
    excerpt_en: '',
    content_en: '',
    title_fr: '',
    excerpt_fr: '',
    content_fr: '',
  });

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_post_translations(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .insert({
          slug: data.slug,
          category: data.category,
          read_time: data.read_time,
          is_published: data.is_published,
          is_featured: data.is_featured,
          image_url: data.image_url || null,
          published_at: data.is_published ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (postError) throw postError;

      const translations = [
        { blog_post_id: post.id, language: 'en', title: data.title_en, excerpt: data.excerpt_en, content: data.content_en },
        { blog_post_id: post.id, language: 'fr', title: data.title_fr, excerpt: data.excerpt_fr, content: data.content_fr },
      ];

      const { error: transError } = await supabase
        .from('blog_post_translations')
        .insert(translations);

      if (transError) throw transError;
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post created successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create blog post');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error: postError } = await supabase
        .from('blog_posts')
        .update({
          slug: data.slug,
          category: data.category,
          read_time: data.read_time,
          is_published: data.is_published,
          is_featured: data.is_featured,
          image_url: data.image_url || null,
          published_at: data.is_published ? new Date().toISOString() : null,
        })
        .eq('id', id);
      
      if (postError) throw postError;

      // Update English translation
      const { error: enError } = await supabase
        .from('blog_post_translations')
        .upsert({
          blog_post_id: id,
          language: 'en',
          title: data.title_en,
          excerpt: data.excerpt_en,
          content: data.content_en,
        }, { onConflict: 'blog_post_id,language' });

      if (enError) throw enError;

      // Update French translation
      const { error: frError } = await supabase
        .from('blog_post_translations')
        .upsert({
          blog_post_id: id,
          language: 'fr',
          title: data.title_fr,
          excerpt: data.excerpt_fr,
          content: data.content_fr,
        }, { onConflict: 'blog_post_id,language' });

      if (frError) throw frError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post updated successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update blog post');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete blog post');
    }
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published, 
          published_at: is_published ? new Date().toISOString() : null 
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Status updated');
    }
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_featured })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Featured status updated');
    }
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      category: 'construction',
      read_time: '5 min',
      is_published: false,
      is_featured: false,
      image_url: '',
      title_en: '',
      excerpt_en: '',
      content_en: '',
      title_fr: '',
      excerpt_fr: '',
      content_fr: '',
    });
    setEditingPost(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (post: any) => {
    const enTrans = post.blog_post_translations?.find((t: any) => t.language === 'en');
    const frTrans = post.blog_post_translations?.find((t: any) => t.language === 'fr');
    
    setFormData({
      slug: post.slug || '',
      category: post.category || 'construction',
      read_time: post.read_time || '5 min',
      is_published: post.is_published || false,
      is_featured: post.is_featured || false,
      image_url: post.image_url || '',
      title_en: enTrans?.title || '',
      excerpt_en: enTrans?.excerpt || '',
      content_en: enTrans?.content || '',
      title_fr: frTrans?.title || '',
      excerpt_fr: frTrans?.excerpt || '',
      content_fr: frTrans?.content || '',
    });
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getTranslation = (post: any, lang: string) => {
    return post.blog_post_translations?.find((t: any) => t.language === lang);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog articles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="my-blog-post"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="tips">Tips</SelectItem>
                        <SelectItem value="trends">Trends</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="read_time">Read Time</Label>
                    <Input
                      id="read_time"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      placeholder="5 min"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  {formData.image_url ? (
                    <div className="relative inline-block">
                      <img 
                        src={formData.image_url} 
                        alt="Featured" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 w-8 h-8"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : null}
                  <ImageUpload
                    bucket="blog-images"
                    currentUrl={formData.image_url || undefined}
                    onUpload={(url) => setFormData({ ...formData, image_url: url })}
                    onRemove={() => setFormData({ ...formData, image_url: '' })}
                  />
                </div>

                {/* English Content */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">English Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Excerpt</Label>
                      <Textarea
                        value={formData.excerpt_en}
                        onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        value={formData.content_en}
                        onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* French Content */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">French Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titre</Label>
                      <Input
                        value={formData.title_fr}
                        onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Extrait</Label>
                      <Textarea
                        value={formData.excerpt_fr}
                        onChange={(e) => setFormData({ ...formData, excerpt_fr: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contenu</Label>
                      <Textarea
                        value={formData.content_fr}
                        onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingPost ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : blogPosts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No blog posts yet. Create your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  blogPosts?.map((post) => {
                    const enTrans = getTranslation(post, 'en');
                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          {post.image_url ? (
                            <img src={post.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Image className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{enTrans?.title || post.slug}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{post.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish.mutate({ id: post.id, is_published: !post.is_published })}
                          >
                            {post.is_published ? (
                              <Eye className="w-4 h-4 text-green-500" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeatured.mutate({ id: post.id, is_featured: !post.is_featured })}
                          >
                            {post.is_featured ? (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {post.created_at && format(new Date(post.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this post?')) {
                                  deleteMutation.mutate(post.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BlogPosts;
