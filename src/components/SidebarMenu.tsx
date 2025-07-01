import { cn } from "@/lib/utils";
import { BarChart3, Calendar, Menu, Users, Wallet, Settings, MessageCircle, Smartphone, LogOut } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const SidebarMenu: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Mock status do WhatsApp - substituir por dados reais
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // Mock profissional (substituir por dados reais do contexto quando disponível)
  const professionalData = {
    name: "Dr. João Silva",
    profession: "Psicólogo",
    registration: "CRP 12/34567"
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
          <div className="flex items-center justify-center flex-shrink-0 px-4 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                mind<span className="text-indigo-600">ro</span>
              </span>
            </div>
          </div>
          {/* Bloco de informações do profissional */}
          {user?.role !== "admin" && (
            <div className="px-4 mb-4 text-center">
              <div className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
                {professionalData.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                {professionalData.profession} / {professionalData.registration}
              </div>
            </div>
          )}

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
        <button
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100 gap-2"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </button>
      </div>
    </>
  );
};

export default SidebarMenu;
