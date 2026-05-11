import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ScheduleCalendarView from "@/components/schedule/ScheduleCalendarView";
import ScheduleAppointmentsView from "@/components/schedule/ScheduleAppointmentsView";

const ScheduleManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estado para configurações da página pública
  const [publicPageConfig, setPublicPageConfig] = React.useState({
    pageName: "Consultório Dr. João Silva",
    address: "",
    bio: "",
    instagram: "",
    color: "#0066FF",
    logo: null as string | null
  });

  const publicLink = user?.email
    ? `${window.location.origin}/agendamento/${encodeURIComponent(user.email)}`
    : "";

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

  const handleSaveConfig = () => {
    // Salvar configurações (será integrado com store depois)
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso."
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPublicPageConfig(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
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
                  <h3 className="text-lg font-semibold mb-4">Configurações da Página Pública</h3>
                  <div className="space-y-4">
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

                    {/* Logo */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Logo</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">Recomendado: 200x200px</p>
                      {publicPageConfig.logo && (
                        <img src={publicPageConfig.logo} alt="Preview" className="mt-2 h-20 w-20 rounded-lg object-cover" />
                      )}
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

                    {/* Paleta de Cores */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Cor da Página</label>
                      <div className="flex gap-3">
                        {[
                          { name: 'Azul', value: '#0066FF' },
                          { name: 'Verde', value: '#00B366' },
                          { name: 'Roxo', value: '#9933FF' },
                          { name: 'Rosa', value: '#FF1493' },
                          { name: 'Laranja', value: '#FF8C00' }
                        ].map(color => (
                          <button
                            key={color.value}
                            onClick={() => setPublicPageConfig(prev => ({ ...prev, color: color.value }))}
                            className={`w-12 h-12 rounded-lg border-2 transition-all cursor-pointer ${
                              publicPageConfig.color === color.value 
                                ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' 
                                : 'border-gray-300 hover:border-gray-500'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Botão Salvar */}
                    <Button onClick={handleSaveConfig} className="w-full mt-6">
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
