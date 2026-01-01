import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from '../FloatingWhatsApp';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default MainLayout;
