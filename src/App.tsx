
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { useAuth } from "@/context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientDetail from "./pages/PatientDetail";
import PatientForm from "./pages/PatientForm";
import SessionForm from "./pages/SessionForm";
import DocumentUpload from "./pages/DocumentUpload";
import NotFound from "./pages/NotFound";
import SchedulePage from "./pages/SchedulePage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ScheduleEventDetail from "./pages/ScheduleEventDetail";
import VideoMeeting from "./pages/VideoMeeting";
import LandingPage from "./pages/LandingPage";
import SupportTickets from "./pages/SupportTickets";
import FinancialPage from "./pages/FinancialPage";

// Novas páginas da plataforma
import PlatformResourcesPage from "./pages/PlatformResourcesPage";
import PlatformSecurityPage from "./pages/PlatformSecurityPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PlansPage from "./pages/PlansPage";

// Novas páginas legais
import TermsOfUsePage from "./pages/TermsOfUsePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiesPage from "./pages/CookiesPage";

// Importando as páginas administrativas
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientsManagement from "./pages/admin/ClientsManagement";
import WhatsAppConfig from "./pages/admin/WhatsAppConfig";
import SupportRequests from "./pages/admin/SupportRequests";
import ProfessionalsManagement from "./pages/admin/ProfessionalsManagement";

// Novas páginas para profissionais
import ProfessionalSettings from "./pages/ProfessionalSettings";
import ProfessionalSupport from "./pages/ProfessionalSupport";

// Componente para redirecionar com base no papel do usuário
const RoleBasedRedirect = () => {
  const { isAdmin } = useAuth();
  
  if (isAdmin) {
    return <AdminDashboard />;
  } else {
    return <Dashboard />;
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

import ThankYouPage from "./pages/ThankYouPage";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Landing Page - Rota aberta */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rotas Públicas */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        
        {/* Novas rotas da plataforma */}
        <Route path="/platform/resources" element={<PlatformResourcesPage />} />
        <Route path="/platform/security" element={<PlatformSecurityPage />} />
        <Route path="/company/blog" element={<BlogPage />} />
        <Route path="/company/contact" element={<ContactPage />} />
        <Route path="/plans" element={<PlansPage />} />
        
        {/* Novas rotas legais */}
        <Route path="/legal/terms" element={<TermsOfUsePage />} />
        <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/legal/cookies" element={<CookiesPage />} />
        
        {/* Rota de Video Meeting */}
        <Route path="/meeting" element={<VideoMeeting />} />

        {/* Redireciona para o dashboard adequado com base no papel do usuário */}
        <Route path="/dashboard" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

        {/* Rotas Protegidas para Profissionais */}
        <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
        <Route path="/patients/:patientId/sessions/new" element={<ProtectedRoute><SessionForm /></ProtectedRoute>} />
        <Route path="/patients/:patientId/documents/upload" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
        
        {/* Rotas de Agenda para Profissionais */}
        <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
        <Route path="/schedule/:eventId" element={<ProtectedRoute><ScheduleEventDetail /></ProtectedRoute>} />

        {/* Rota Financeira */}
        <Route path="/financial" element={<ProtectedRoute><FinancialPage /></ProtectedRoute>} />
 
        {/* Rota de Suporte para Clientes */}
        <Route path="/support" element={<ProtectedRoute><SupportTickets /></ProtectedRoute>} />

        {/* Rotas de Configurações e Suporte para Profissionais */}
        <Route path="/professional-settings" element={<ProtectedRoute><ProfessionalSettings /></ProtectedRoute>} />
        <Route path="/professional-support" element={<ProtectedRoute><ProfessionalSupport /></ProtectedRoute>} />

        {/* Rota de Configurações para qualquer usuário autenticado */}
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        
        {/* Rotas Administrativas */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/professionals" element={<ProtectedRoute><ProfessionalsManagement /></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute><ClientsManagement /></ProtectedRoute>} />
        <Route path="/admin/whatsapp" element={<ProtectedRoute><WhatsAppConfig /></ProtectedRoute>} />
        <Route path="/admin/support" element={<ProtectedRoute><SupportRequests /></ProtectedRoute>} />
        
        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
