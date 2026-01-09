import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Languages, 
  FileText, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  Mail,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Newspaper,
  Users,
  UserCheck,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import logoMain from '@/assets/logo-main.png';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate('/auth');
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/languages', icon: Languages, label: 'Languages' },
    { href: '/admin/translations', icon: FileText, label: 'Translations' },
    { href: '/admin/services', icon: Briefcase, label: 'Services' },
    { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/admin/team', icon: Users, label: 'Team Members' },
    { href: '/admin/blog', icon: Newspaper, label: 'Blog Posts' },
    { href: '/admin/subscribers', icon: UserCheck, label: 'Subscribers' },
    { href: '/admin/campaigns', icon: Send, label: 'Email Campaigns' },
    { href: '/admin/quotes', icon: MessageSquare, label: 'Quotes' },
    { href: '/admin/messages', icon: Mail, label: 'Messages' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={logoMain} alt="Villa de Castor" className="w-8 h-8 object-contain" />
          <span className="font-bold text-foreground">Admin</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 p-4 border-b border-border">
              <img src={logoMain} alt="Villa de Castor" className="w-10 h-10 object-contain" />
              <div>
                <div className="font-bold text-foreground">Villa de Castor</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {user?.email}
                  </div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Link to="/" className="block mt-2">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  View Website
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
