import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, BarChart3, MessageSquare, Home, Calendar, Wallet, HelpCircle, Settings, UserCheck, LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatarEditor from "@/components/ProfileAvatarEditor";

const Header: React.FC = () => {
  const { user, isAdmin, isVerified, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Profissionais", href: "/admin/professionals", icon: UserCheck },
    { name: "WhatsApp", href: "/admin/whatsapp", icon: MessageSquare },
  ];

  const professionalLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Pacientes", href: "/patients", icon: UserCheck },
    { name: "Agendamentos", href: "/schedule", icon: Calendar },
    { name: "Financeiro", href: "/financial", icon: Wallet },
    { name: "Configurações", href: "/professional-settings", icon: Settings },
    { name: "Suporte", href: "/professional-support", icon: MessageSquare },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 md:px-6 dark:bg-background dark:border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="text-sm font-medium text-psycho-primary hidden md:block">
                <span className="inline-flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Modo Administrador
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full p-0">
                <ProfileAvatarEditor
                  name={user?.name || "Usuário"}
                  avatar={null}
                  isAdmin={isAdmin}
                  readonly={true}
                  onAvatarChange={() => {}}
                  size="sm"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-amber-600 flex items-center mt-1">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Administrador
                    </p>
                  )}
                  {!isAdmin && (
                    <p className={`text-xs flex items-center mt-1 ${isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {isVerified ? '✓ Verificado' : '⚠ Não verificado'}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
