import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Send, Eye, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const EmailCampaigns = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [previewCampaign, setPreviewCampaign] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-email-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subscriberCount } = useQuery({
    queryKey: ['active-subscriber-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('email_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          subject: data.subject,
          content: data.content,
          status: 'draft',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-campaigns'] });
      toast.success('Campaign created successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create campaign');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('email_campaigns')
        .update({
          subject: data.subject,
          content: data.content,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-campaigns'] });
      toast.success('Campaign updated successfully');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update campaign');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('email_campaigns').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-campaigns'] });
      toast.success('Campaign deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete campaign');
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { campaignId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-campaigns'] });
      toast.success(`Newsletter sent to ${data.sentCount} subscribers!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send newsletter');
    }
  });

  const resetForm = () => {
    setFormData({ subject: '', content: '' });
    setEditingCampaign(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (campaign: any) => {
    setFormData({
      subject: campaign.subject || '',
      content: campaign.content || '',
    });
    setEditingCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handlePreview = (campaign: any) => {
    setPreviewCampaign(campaign);
    setIsPreviewOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampaign) {
      updateMutation.mutate({ id: editingCampaign.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleSend = (campaign: any) => {
    if (confirm(`Are you sure you want to send this newsletter to ${subscriberCount} active subscribers?`)) {
      sendMutation.mutate(campaign.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500">Sent</Badge>;
      case 'sending':
        return <Badge className="bg-blue-500">Sending</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Email Campaigns</h1>
            <p className="text-muted-foreground">
              Create and send newsletters to {subscriberCount} active subscribers
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
                <DialogDescription>
                  Create a new email campaign to send to your subscribers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Your newsletter subject"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Email Content (HTML supported)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="<h1>Hello!</h1><p>Your newsletter content here...</p>"
                    rows={12}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingCampaign ? 'Update' : 'Create Draft'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : campaigns?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No campaigns yet. Create your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns?.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium max-w-[300px] truncate">
                        {campaign.subject}
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status || 'draft')}</TableCell>
                      <TableCell>
                        {campaign.sent_count ? `${campaign.sent_count} subscribers` : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(campaign.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {campaign.sent_at ? format(new Date(campaign.sent_at), 'MMM d, yyyy HH:mm') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePreview(campaign)}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {campaign.status !== 'sent' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(campaign)}
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSend(campaign)}
                                disabled={sendMutation.isPending}
                                title="Send"
                                className="text-primary hover:text-primary"
                              >
                                {sendMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Delete this campaign?')) {
                                deleteMutation.mutate(campaign.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              <DialogDescription>
                Subject: {previewCampaign?.subject}
              </DialogDescription>
            </DialogHeader>
            <div className="border rounded-lg p-6 bg-background">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewCampaign?.content || '' }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default EmailCampaigns;
