
import { cn } from "@/lib/utils";
import { BarChart3, Calendar, Menu, Users, Wallet, Settings, MessageCircle, Smartphone } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const SidebarMenu: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Mock status do WhatsApp - substituir por dados reais
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  // Mock dados do profissional - substituir por dados reais do store
  const professionalData = {
    name: "Dr. João Silva",
    profession: "Psicólogo",
    registrationNumber: "CRP 12/34567"
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Pacientes", href: "/patients", icon: Users },
    { name: "Agendamentos", href: "/schedule", icon: Calendar },
    { name: "Financeiro", href: "/financial", icon: Wallet },
    { name: "Configurações", href: "/professional-settings", icon: Settings },
    { name: "Suporte", href: "/professional-support", icon: MessageCircle },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Botão do menu móvel - visível apenas no mobile */}
      <div className="md:hidden fixed top-0 left-0 z-30 p-2">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sobreposição móvel */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar para mobile e desktop */}
      <div
        className={cn(
          "fixed md:sticky top-0 h-full flex flex-col bg-white border-r border-gray-200 dark:bg-muted dark:border-border transition-all duration-300 z-50",
          "w-64",
          isMobileOpen ? "left-0" : "-left-full md:left-0"
        )}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                mind<span className="text-indigo-600">ro</span>
              </span>
            </div>
          </div>

          {/* Informações do Profissional */}
          <div className="px-4 mb-4">
            <Card className="bg-gray-50 dark:bg-muted/50">
              <CardContent className="p-3">
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {professionalData.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {professionalData.profession}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {professionalData.registrationNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status WhatsApp */}
          <div className="px-4 mb-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-muted/50 rounded-md">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium">WhatsApp</span>
              {whatsappConnected ? (
                <Badge variant="default" className="bg-green-500 text-xs">Conectado</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Desconectado</Badge>
              )}
            </div>
          </div>

          <nav className="mt-2 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    isActive
                      ? "bg-psycho-muted text-psycho-primary dark:bg-accent dark:text-primary"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-muted/80",
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md"
                  )
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon
                  className="h-5 w-5 flex-shrink-0 mr-3"
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
