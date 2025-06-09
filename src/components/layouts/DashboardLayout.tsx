
import React from "react";
import SidebarMenu from "@/components/SidebarMenu";
import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      {/* SidebarMenu is now self-contained with mobile responsiveness */}
      <SidebarMenu />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full md:ml-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
