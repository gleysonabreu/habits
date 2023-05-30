import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between w-full">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
