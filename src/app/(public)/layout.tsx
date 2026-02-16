import { HomeNavbar, HomeFooter } from "@/modules/home/ui/components";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar />
      {children}
      <HomeFooter />
    </div>
  );
}