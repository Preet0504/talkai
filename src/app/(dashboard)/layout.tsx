// src/app/(dashboard)/layout.tsx
"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { authClient } from "@/lib/auth-client";
import { DashboardNavbar } from "@/components/ui/dashboard-navbar";

const handleSignOut = async () => {
  await authClient.signOut({
    fetchOptions: {
        onSuccess: () => {
            window.location.href = "/sign-in";
        },
    },
  });
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession();
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50/50"> 
        <DashboardSidebar 
        user= {[session?.user?.name || "John Doe", session?.user?.email || "john@example.com"]}
        onLogOut={handleSignOut} />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header area for the toggle button */}
          <header className="flex h-16 items-center border-b bg-white px-6">
            <SidebarTrigger className="text-slate-500 hover:text-green-700" />
            <DashboardNavbar />
          </header>
          
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}