
import { cn } from "@/lib/utils";
import { Users, Menu, MessageSquare, BarChart3, HelpCircle, UserCheck } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const AdminSidebarMenu: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Profissionais", href: "/admin/professionals", icon: UserCheck },
    { name: "Clientes", href: "/admin/clients", icon: Users },
    { name: "Suporte", href: "/admin/support", icon: HelpCircle },
    { name: "WhatsApp", href: "/admin/whatsapp", icon: MessageSquare },
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

export default AdminSidebarMenu;
