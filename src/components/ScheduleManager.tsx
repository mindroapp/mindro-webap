import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buildPublicBookingUrl } from "@/lib/format";
import usersService from "@/services/usersService";
import { useToast } from "@/hooks/use-toast";
import ScheduleCalendarView from "@/components/schedule/ScheduleCalendarView";
import ScheduleAppointmentsView from "@/components/schedule/ScheduleAppointmentsView";
import ProfileAvatarEditor from "@/components/ProfileAvatarEditor";
import schedulePublicProfileService from "@/services/schedulePublicProfileService";

const ScheduleManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estado para configurações da página pública
  const [publicPageConfig, setPublicPageConfig] = React.useState({
    avatar: null as string | null,
    pageName: "",
    address: "",
    bio: "",
    instagram: "",
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [council, setCouncil] = React.useState<string | null>(null);
  const [register, setRegister] = React.useState<string | null>(null);

  // Carregar configurações do backend ao montar
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [profile, apiUser] = await Promise.all([
          schedulePublicProfileService.getPublicProfile(),
          usersService.getCurrentProfile(),
        ]);
        if (profile) {
          setPublicPageConfig({
            avatar: profile.avatar || null,
            pageName: profile.pageName || "Consultório Dr. João Silva",
            address: profile.address || "",
            bio: profile.bio || "",
            instagram: profile.instagram || "",
          });
        }
        setCouncil(apiUser.professionalCouncil ?? null);
        setRegister(apiUser.professionalRegister ?? null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const publicLink = buildPublicBookingUrl(council, register);

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    toast({
      title: "Link copiado",
      description: "Compartilhe com seus pacientes."
    });
  };

  const openPublicLink = () => {
    window.open(publicLink, '_blank');
  };

  const handleSaveConfig = async () => {
    try {
      // Salvar configurações no backend
      await schedulePublicProfileService.updatePublicProfile({
        avatar: publicPageConfig.avatar,
        pageName: publicPageConfig.pageName,
        address: publicPageConfig.address,
        bio: publicPageConfig.bio,
        instagram: publicPageConfig.instagram,
      });
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso."
      });
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err.message || "Ocorreu um erro ao salvar as configurações",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Link de Agendamento Público */}
      <Card className={user?.isVerified ? "border-primary/30" : "border-muted"}>
        <CardContent className="p-4 sm:p-6">
          {user?.isVerified ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">Link de Agendamento Público</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Compartilhe com seus pacientes para que possam agendar consultas.
                </p>
                <p className="text-xs text-primary font-mono truncate">{publicLink}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={copyPublicLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={openPublicLink}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-muted-foreground">Link de Agendamento Público</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Seu link estará disponível após a aprovação da sua conta pelo administrador.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs de Gestão */}
      <Tabs defaultValue="agendas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agendas">Agendas</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="agendas" className="mt-6">
          <ScheduleCalendarView />
        </TabsContent>

        <TabsContent value="agendamentos" className="mt-6">
          <ScheduleAppointmentsView />
        </TabsContent>

        <TabsContent value="configuracoes" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-6">Configurações da Página Pública</h3>
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center pb-6 border-b">
                      <ProfileAvatarEditor
                        name={user?.name || "Usuário"}
                        avatar={publicPageConfig.avatar}
                        isAdmin={user?.role === "admin"}
                        onAvatarChange={(imageData) =>
                          setPublicPageConfig((prev) => ({
                            ...prev,
                            avatar: imageData,
                          }))
                        }
                      />
                    </div>

                    {/* Nome da Página */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome da Página</label>
                      <input 
                        type="text" 
                        value={publicPageConfig.pageName}
                        onChange={(e) => setPublicPageConfig(prev => ({ ...prev, pageName: e.target.value }))}
                        placeholder="Ex: Consultório Dr. João Silva"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    {/* Endereço */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Endereço</label>
                      <input 
                        type="text" 
                        value={publicPageConfig.address}
                        onChange={(e) => setPublicPageConfig(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Rua, número, cidade..."
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea 
                        value={publicPageConfig.bio}
                        onChange={(e) => setPublicPageConfig(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Conte sobre você, sua experiência..."
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    {/* Instagram */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Instagram</label>
                      <input 
                        type="text" 
                        value={publicPageConfig.instagram}
                        onChange={(e) => setPublicPageConfig(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="@seu_usuario"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    {/* Botão Salvar */}
                    <Button onClick={handleSaveConfig} className="w-full mt-6 h-10">
                      Salvar Configurações
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
