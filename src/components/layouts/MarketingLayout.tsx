import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = (path: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      location.pathname === path ? "text-primary" : "text-foreground"
    );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              mind<span className="text-primary">ro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/company/blog" className={navLinkClass("/company/blog")}>
              Blog
            </Link>
            <Link to="/company/contact" className={navLinkClass("/company/contact")}>
              Contato
            </Link>
            <Link to="/plans" className={navLinkClass("/plans")}>
              Planos
            </Link>

            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Entrar</Button>
              </Link>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} className="text-foreground" /> : <Sun size={20} className="text-foreground" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} className="text-foreground" /> : <Sun size={20} className="text-foreground" />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              <Link
                to="/company/blog"
                className="py-3 px-2 font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link
                to="/company/contact"
                className="py-3 px-2 font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMenu}
              >
                Contato
              </Link>
              <Link
                to="/plans"
                className="py-3 px-2 font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMenu}
              >
                Planos
              </Link>

              <div className="border-t border-border pt-4 mt-2 flex flex-col space-y-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    Entrar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <span className="text-lg font-semibold text-foreground">
                mind<span className="text-primary">ro</span>
              </span>
              <p className="text-sm text-muted-foreground mt-3 max-w-xs">
                Plataforma completa para profissionais de saúde mental gerenciarem suas práticas clínicas.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/platform/resources" className="text-muted-foreground hover:text-primary transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="/platform/security" className="text-muted-foreground hover:text-primary transition-colors">
                    Segurança
                  </Link>
                </li>
                <li>
                  <Link to="/plans" className="text-muted-foreground hover:text-primary transition-colors">
                    Planos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/company/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/company/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 sm:mt-10 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © 2025 mindro. Todos os direitos reservados.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Instagram
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Twitter
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  LinkedIn
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
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