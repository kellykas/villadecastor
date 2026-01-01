import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FolderOpen, MessageSquare, Mail, Languages, FileText } from 'lucide-react';

const Dashboard = () => {
  const { data: servicesCount } = useQuery({
    queryKey: ['admin-services-count'],
    queryFn: async () => {
      const { count } = await supabase.from('services').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: projectsCount } = useQuery({
    queryKey: ['admin-projects-count'],
    queryFn: async () => {
      const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: quotesCount } = useQuery({
    queryKey: ['admin-quotes-count'],
    queryFn: async () => {
      const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      return count || 0;
    }
  });

  const { data: messagesCount } = useQuery({
    queryKey: ['admin-messages-count'],
    queryFn: async () => {
      const { count } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread');
      return count || 0;
    }
  });

  const { data: languagesCount } = useQuery({
    queryKey: ['admin-languages-count'],
    queryFn: async () => {
      const { count } = await supabase.from('languages').select('*', { count: 'exact', head: true }).eq('is_active', true);
      return count || 0;
    }
  });

  const { data: translationsCount } = useQuery({
    queryKey: ['admin-translations-count'],
    queryFn: async () => {
      const { count } = await supabase.from('translations').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const stats = [
    { title: 'Services', value: servicesCount ?? 0, icon: Briefcase, color: 'text-blue-600' },
    { title: 'Projects', value: projectsCount ?? 0, icon: FolderOpen, color: 'text-green-600' },
    { title: 'Pending Quotes', value: quotesCount ?? 0, icon: MessageSquare, color: 'text-amber-600' },
    { title: 'Unread Messages', value: messagesCount ?? 0, icon: Mail, color: 'text-red-600' },
    { title: 'Active Languages', value: languagesCount ?? 0, icon: Languages, color: 'text-purple-600' },
    { title: 'Translations', value: translationsCount ?? 0, icon: FileText, color: 'text-teal-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Villa de Castor admin panel</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
