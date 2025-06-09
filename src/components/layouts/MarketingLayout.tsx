
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background">
      {/* Navigation header */}
      <header className="border-b dark:border-border sticky top-0 bg-white dark:bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              mind<span className="text-indigo-600">ro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Plataforma</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/plans"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-indigo-50 to-indigo-100 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-indigo-700">
                              Planos e preços
                            </div>
                            <p className="text-sm leading-tight text-indigo-600">
                              Conheça nossos planos e escolha o ideal para sua prática profissional.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/platform/resources"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:bg-indigo-100 focus:text-indigo-700",
                              location.pathname === "/platform/resources" ? "bg-indigo-100 text-indigo-700" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Recursos</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                              Explore todas as ferramentas disponíveis para otimizar seu trabalho.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/platform/security"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:bg-indigo-100 focus:text-indigo-700",
                              location.pathname === "/platform/security" ? "bg-indigo-100 text-indigo-700" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Segurança</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                              Saiba como seus dados e os de seus pacientes estão protegidos.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Empresa</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/company/blog"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:bg-indigo-100 focus:text-indigo-700",
                              location.pathname === "/company/blog" ? "bg-indigo-100 text-indigo-700" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Blog</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                              Artigos e conteúdos sobre saúde mental e gestão de consultório.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/company/contact"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:bg-indigo-100 focus:text-indigo-700",
                              location.pathname === "/company/contact" ? "bg-indigo-100 text-indigo-700" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Contato</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                              Entre em contato com nossa equipe para tirar dúvidas ou solicitar demonstrações.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/plans">
              <Button variant="link" className="text-gray-700 hover:text-indigo-700 dark:text-gray-300 dark:hover:text-indigo-400">Planos</Button>
            </Link>

            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Registrar</Button>
              </Link>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t dark:border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <div className="border-b pb-2 dark:border-border">
                <p className="font-medium mb-2">Plataforma</p>
                <Link 
                  to="/platform/resources" 
                  className="block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recursos
                </Link>
                <Link 
                  to="/platform/security" 
                  className="block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Segurança
                </Link>
              </div>
              
              <div className="border-b pb-2 dark:border-border">
                <p className="font-medium mb-2">Empresa</p>
                <Link 
                  to="/company/blog" 
                  className="block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/company/contact" 
                  className="block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
              </div>
              
              <Link 
                to="/plans" 
                className="block py-2 border-b dark:border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </Link>
              
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">Entrar</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Registrar</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-lg font-semibold mb-4 dark:text-white">
                mind<span className="text-indigo-600">ro</span>
              </span>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Plataforma completa para profissionais de saúde mental gerenciarem suas práticas clínicas.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Plataforma</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/platform/resources" className="hover:text-indigo-600 dark:hover:text-indigo-400">Recursos</Link></li>
                <li><Link to="/platform/security" className="hover:text-indigo-600 dark:hover:text-indigo-400">Segurança</Link></li>
                <li><Link to="/plans" className="hover:text-indigo-600 dark:hover:text-indigo-400">Planos</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Empresa</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/company/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link></li>
                <li><Link to="/company/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Legal</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/legal/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">Termos de Uso</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">Política de Privacidade</Link></li>
                <li><Link to="/legal/cookies" className="hover:text-indigo-600 dark:hover:text-indigo-400">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-10 pt-8 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &copy; 2025 mindro. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Instagram
                </Link>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Twitter
                </Link>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  LinkedIn
                </Link>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  YouTube
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
