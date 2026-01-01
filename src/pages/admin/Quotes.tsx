import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, Mail, Phone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { format } from 'date-fns';

const Quotes = () => {
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
      toast({ title: 'Status updated' });
    }
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quote Requests</h1>
          <p className="text-muted-foreground">Manage quote submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Project Type</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Lang</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes?.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="text-sm">{format(new Date(quote.created_at!), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="font-medium">{quote.full_name}</TableCell>
                        <TableCell>{quote.email}</TableCell>
                        <TableCell className="capitalize">{quote.project_type || '-'}</TableCell>
                        <TableCell>{quote.budget || '-'}</TableCell>
                        <TableCell>{quote.language?.toUpperCase()}</TableCell>
                        <TableCell>
                          <Select 
                            value={quote.status || 'pending'} 
                            onValueChange={(v) => updateMutation.mutate({ id: quote.id, status: v })}
                          >
                            <SelectTrigger className={`w-[120px] h-8 text-xs ${getStatusColor(quote.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" onClick={() => setSelectedQuote(quote)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Quote Details</DialogTitle>
            </DialogHeader>
            {selectedQuote && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">{selectedQuote.full_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{format(new Date(selectedQuote.created_at!), 'MMM dd, yyyy HH:mm')}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href={`mailto:${selectedQuote.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Mail className="w-4 h-4" />{selectedQuote.email}
                  </a>
                  {selectedQuote.phone && (
                    <a href={`tel:${selectedQuote.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Phone className="w-4 h-4" />{selectedQuote.phone}
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Project Type</div>
                    <div className="font-medium capitalize">{selectedQuote.project_type || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-medium">{selectedQuote.budget || '-'}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <div className="bg-muted p-3 rounded-lg text-sm">{selectedQuote.description || 'No description provided'}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Quotes;
