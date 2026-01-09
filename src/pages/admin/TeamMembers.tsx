import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, GripVertical, Users } from 'lucide-react';
import { toast } from 'sonner';

const TeamMembers = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    display_order: 0,
    is_active: true,
    image_url: '',
    name_en: '',
    role_en: '',
    name_fr: '',
    role_fr: '',
  });

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team_member_translations(*)
        `)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: member, error: memberError } = await supabase
        .from('team_members')
        .insert({
          display_order: data.display_order,
          is_active: data.is_active,
          image_url: data.image_url || null,
        })
        .select()
        .single();
      
      if (memberError) throw memberError;

      const translations = [
        { team_member_id: member.id, language: 'en', name: data.name_en, role: data.role_en },
        { team_member_id: member.id, language: 'fr', name: data.name_fr, role: data.role_fr },
      ];

      const { error: transError } = await supabase
        .from('team_member_translations')
        .insert(translations);

      if (transError) throw transError;
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast.success('Team member created successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create team member');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error: memberError } = await supabase
        .from('team_members')
        .update({
          display_order: data.display_order,
          is_active: data.is_active,
          image_url: data.image_url || null,
        })
        .eq('id', id);
      
      if (memberError) throw memberError;

      // Delete existing translations and insert new ones
      await supabase
        .from('team_member_translations')
        .delete()
        .eq('team_member_id', id);

      const translations = [
        { team_member_id: id, language: 'en', name: data.name_en, role: data.role_en },
        { team_member_id: id, language: 'fr', name: data.name_fr, role: data.role_fr },
      ];

      const { error: transError } = await supabase
        .from('team_member_translations')
        .insert(translations);

      if (transError) throw transError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast.success('Team member updated successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update team member');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast.success('Team member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete team member');
    }
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast.success('Status updated');
    }
  });

  const resetForm = () => {
    setFormData({
      display_order: teamMembers?.length || 0,
      is_active: true,
      image_url: '',
      name_en: '',
      role_en: '',
      name_fr: '',
      role_fr: '',
    });
    setEditingMember(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (member: any) => {
    const enTrans = member.team_member_translations?.find((t: any) => t.language === 'en');
    const frTrans = member.team_member_translations?.find((t: any) => t.language === 'fr');
    
    setFormData({
      display_order: member.display_order || 0,
      is_active: member.is_active ?? true,
      image_url: member.image_url || '',
      name_en: enTrans?.name || '',
      role_en: enTrans?.role || '',
      name_fr: frTrans?.name || '',
      role_fr: frTrans?.role || '',
    });
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getTranslation = (member: any, lang: string) => {
    return member.team_member_translations?.find((t: any) => t.language === lang);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">Manage your team for the About page</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                <DialogDescription>
                  Fill in the details for the team member in both English and French.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                {/* Photo Upload */}
                <ImageUpload
                  bucket="projects-images"
                  currentUrl={formData.image_url || undefined}
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                  onRemove={() => setFormData({ ...formData, image_url: '' })}
                />

                {/* English Content */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">English</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role / Position</Label>
                      <Input
                        value={formData.role_en}
                        onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                        placeholder="Project Manager"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* French Content */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">Français</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={formData.name_fr}
                        onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rôle / Poste</Label>
                      <Input
                        value={formData.role_fr}
                        onChange={(e) => setFormData({ ...formData, role_fr: e.target.value })}
                        placeholder="Chef de Projet"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingMember ? 'Update' : 'Create'}
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
                  <TableHead className="w-[60px]">Order</TableHead>
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Role (EN)</TableHead>
                  <TableHead>Name (FR)</TableHead>
                  <TableHead>Status</TableHead>
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
                ) : teamMembers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No team members yet. Add your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers?.map((member) => {
                    const enTrans = getTranslation(member, 'en');
                    const frTrans = getTranslation(member, 'fr');
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <GripVertical className="w-4 h-4" />
                            {member.display_order}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.image_url ? (
                            <img 
                              src={member.image_url} 
                              alt={enTrans?.name || 'Team member'} 
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{enTrans?.name || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{enTrans?.role || '-'}</TableCell>
                        <TableCell>{frTrans?.name || '-'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={member.is_active}
                            onCheckedChange={(checked) => toggleActive.mutate({ id: member.id, is_active: checked })}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(member)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this team member?')) {
                                  deleteMutation.mutate(member.id);
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

export default TeamMembers;
