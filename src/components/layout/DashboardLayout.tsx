import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  role?: "faculty" | "hod" ;
  currentPath?: string;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  role = "faculty",
  currentPath = "/dashboard" 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}