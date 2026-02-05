import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  maxUploadSize: number;
  enableComments: boolean;
  enableSharing: boolean;
  enableAnalytics: boolean;
  defaultLanguage: "pt" | "en";
  emailNotifications: boolean;
  adminEmail: string;
}

export default function AdminSettings() {
  const { user, isAuthenticated } = useAuth();
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "Linux Partition Calculator",
    siteDescription: "Otimize o particionamento do seu disco para múltiplas distribuições Linux",
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    maxUploadSize: 10,
    enableComments: true,
    enableSharing: true,
    enableAnalytics: true,
    defaultLanguage: "pt",
    emailNotifications: true,
    adminEmail: "admin@example.com",
  });
  const [saving, setSaving] = useState(false);

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"}>Voltar para Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Configurações do Sistema
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gerencie as configurações globais da aplicação
              </p>
            </div>
            <Button onClick={() => window.location.href = "/admin"}>
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="features">Funcionalidades</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          {/* Geral */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Informações básicas do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={config.siteName}
                    onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="siteDescription">Descrição do Site</Label>
                  <textarea
                    id="siteDescription"
                    value={config.siteDescription}
                    onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="defaultLanguage">Idioma Padrão</Label>
                  <select
                    id="defaultLanguage"
                    value={config.defaultLanguage}
                    onChange={(e) => setConfig({ ...config, defaultLanguage: e.target.value as "pt" | "en" })}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="pt">Português (Brasil)</option>
                    <option value="en">English (International)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="maintenanceMode"
                    checked={config.maintenanceMode}
                    onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked as boolean })}
                  />
                  <Label htmlFor="maintenanceMode" className="cursor-pointer">
                    Modo de Manutenção (desabilita acesso dos usuários)
                  </Label>
                </div>

                {config.maintenanceMode && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md flex gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      O modo de manutenção está ativo. Apenas administradores podem acessar o site.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funcionalidades */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades</CardTitle>
                <CardDescription>Ativar/desativar recursos do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableComments"
                    checked={config.enableComments}
                    onCheckedChange={(checked) => setConfig({ ...config, enableComments: checked as boolean })}
                  />
                  <Label htmlFor="enableComments" className="cursor-pointer">
                    Permitir Comentários e Avaliações
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableSharing"
                    checked={config.enableSharing}
                    onCheckedChange={(checked) => setConfig({ ...config, enableSharing: checked as boolean })}
                  />
                  <Label htmlFor="enableSharing" className="cursor-pointer">
                    Permitir Compartilhamento Social
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableAnalytics"
                    checked={config.enableAnalytics}
                    onCheckedChange={(checked) => setConfig({ ...config, enableAnalytics: checked as boolean })}
                  />
                  <Label htmlFor="enableAnalytics" className="cursor-pointer">
                    Rastrear Visitantes e Analytics
                  </Label>
                </div>

                <div>
                  <Label htmlFor="maxUploadSize">Tamanho Máximo de Upload (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={config.maxUploadSize}
                    onChange={(e) => setConfig({ ...config, maxUploadSize: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Backup</CardTitle>
                <CardDescription>Gerenciar backup automático de dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoBackup"
                    checked={config.autoBackup}
                    onCheckedChange={(checked) => setConfig({ ...config, autoBackup: checked as boolean })}
                  />
                  <Label htmlFor="autoBackup" className="cursor-pointer">
                    Ativar Backup Automático
                  </Label>
                </div>

                {config.autoBackup && (
                  <div>
                    <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                    <select
                      id="backupFrequency"
                      value={config.backupFrequency}
                      onChange={(e) => setConfig({ ...config, backupFrequency: e.target.value as "daily" | "weekly" | "monthly" })}
                      className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  Fazer Backup Agora
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configurar notificações por email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={config.emailNotifications}
                    onCheckedChange={(checked) => setConfig({ ...config, emailNotifications: checked as boolean })}
                  />
                  <Label htmlFor="emailNotifications" className="cursor-pointer">
                    Ativar Notificações por Email
                  </Label>
                </div>

                {config.emailNotifications && (
                  <div>
                    <Label htmlFor="adminEmail">Email do Administrador</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={config.adminEmail}
                      onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <p className="font-medium">Notificações Ativadas:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Novo comentário/avaliação</li>
                    <li>Marcos atingidos (1000, 5000, 10000 visitantes)</li>
                    <li>Erros do sistema</li>
                    <li>Backup completado/falhou</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-2 mt-8">
          <Button variant="outline" onClick={() => window.location.href = "/admin"}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </main>
    </div>
  );
}
