import { cn } from "@/lib/utils";
import { Bell, Menu, MessageSquare, BarChart3, UserCheck, LogOut, Wifi, WifiOff } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminSidebarMenu: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(() => {
    return localStorage.getItem("whatsapp_connected") === "true";
  });
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Atualizar estado quando localStorage muda
  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsWhatsAppConnected(localStorage.getItem("whatsapp_connected") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Profissionais", href: "/admin/professionals", icon: UserCheck },
    { name: "WhatsApp", href: "/admin/whatsapp", icon: MessageSquare },
    { name: "Reminders", href: "/admin/reminders", icon: Bell },
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
          <div className="flex items-center justify-center flex-shrink-0 px-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                mind<span className="text-indigo-600">ro</span>
              </span>
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
                    "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md"
                  )
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon
                    className="h-5 w-5 flex-shrink-0 mr-3"
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>
                {item.name === "WhatsApp" && (
                  <div className="flex-shrink-0">
                    {isWhatsAppConnected ? (
                      <Wifi className="h-4 w-4 text-green-500" aria-label="Conectado" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" aria-label="Desconectado" />
                    )}
                  </div>
                )}
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

export default AdminSidebarMenu;
