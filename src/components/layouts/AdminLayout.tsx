
import React from "react";
import AdminSidebarMenu from "@/components/AdminSidebarMenu";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      {/* AdminSidebarMenu tem funcionalidade responsiva incorporada */}
      <AdminSidebarMenu />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full md:ml-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
