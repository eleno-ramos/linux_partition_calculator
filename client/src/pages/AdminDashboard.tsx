import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, MessageSquare, Share2, TrendingUp, Settings, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

interface AnalyticsData {
  totalVisitors: number;
  totalReviews: number;
  totalShares: number;
  averageRating: number;
  visitorsPerDay: Array<{ date: string; count: number }>;
  reviewsPerDay: Array<{ date: string; count: number }>;
  visitorsPerCountry: Array<{ country: string; count: number }>;
  distributionUsage: Array<{ name: string; value: number }>;
  processorUsage: Array<{ name: string; value: number }>;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar este painel.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Este painel é reservado para administradores do sistema.
            </p>
            <Button onClick={() => window.location.href = "/"}>Voltar para Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulated data - em produção, isso viria de uma API tRPC
        const mockData: AnalyticsData = {
          totalVisitors: 2800,
          totalReviews: 45,
          totalShares: 120,
          averageRating: 4.6,
          visitorsPerDay: [
            { date: "Seg", count: 320 },
            { date: "Ter", count: 380 },
            { date: "Qua", count: 350 },
            { date: "Qui", count: 410 },
            { date: "Sex", count: 480 },
            { date: "Sab", count: 290 },
            { date: "Dom", count: 170 },
          ],
          reviewsPerDay: [
            { date: "Seg", count: 3 },
            { date: "Ter", count: 5 },
            { date: "Qua", count: 4 },
            { date: "Qui", count: 6 },
            { date: "Sex", count: 8 },
            { date: "Sab", count: 2 },
            { date: "Dom", count: 1 },
          ],
          visitorsPerCountry: [
            { country: "Brasil", count: 1800 },
            { country: "Portugal", count: 320 },
            { country: "EUA", count: 280 },
            { country: "Outros", count: 400 },
          ],
          distributionUsage: [
            { name: "Ubuntu", value: 35 },
            { name: "Fedora", value: 25 },
            { name: "Debian", value: 20 },
            { name: "Mint", value: 12 },
            { name: "Outros", value: 8 },
          ],
          processorUsage: [
            { name: "Intel x86", value: 45 },
            { name: "AMD x86", value: 35 },
            { name: "ARM64", value: 12 },
            { name: "Outros", value: 8 },
          ],
        };
        setAnalyticsData(mockData);
      } catch (error) {
        console.error("Erro ao carregar analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Painel Administrativo
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bem-vindo, {user?.name || "Administrador"}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : analyticsData ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalVisitors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">⭐ {analyticsData.averageRating}/5</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compartilhamentos</CardTitle>
                  <Share2 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalShares}</div>
                  <p className="text-xs text-muted-foreground">+8% esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+15%</div>
                  <p className="text-xs text-muted-foreground">Comparado ao mês anterior</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="visitors" className="space-y-4">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="visitors">Visitantes</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                <TabsTrigger value="geography">Geografia</TabsTrigger>
                <TabsTrigger value="usage">Uso</TabsTrigger>
              </TabsList>

              {/* Visitantes por Dia */}
              <TabsContent value="visitors">
                <Card>
                  <CardHeader>
                    <CardTitle>Visitantes por Dia</CardTitle>
                    <CardDescription>Últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.visitorsPerDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Avaliações por Dia */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliações por Dia</CardTitle>
                    <CardDescription>Últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.reviewsPerDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#10b981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Visitantes por País */}
              <TabsContent value="geography">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visitantes por País</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.visitorsPerCountry}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {analyticsData.visitorsPerCountry.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes por País</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analyticsData.visitorsPerCountry.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.country}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(item.count / analyticsData.totalVisitors) * 100}%`,
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-right">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Uso de Distribuições e Processadores */}
              <TabsContent value="usage">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuições Mais Usadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.distributionUsage}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analyticsData.distributionUsage.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Processadores Mais Usados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.processorUsage}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Settings Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Modo de Manutenção</label>
                      <p className="text-xs text-muted-foreground mb-2">Desabilitar acesso dos usuários</p>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Backup Automático</label>
                      <p className="text-xs text-muted-foreground mb-2">Agendar backup diário</p>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            Erro ao carregar dados
          </div>
        )}
      </main>
    </div>
  );
}
