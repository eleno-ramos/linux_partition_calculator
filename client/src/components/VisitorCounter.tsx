import { useState } from "react";
import { Globe, MapPin, TrendingUp, Users, Loader2, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const BRAZILIAN_STATES = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export default function VisitorCounter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Fetch real data from tRPC
  const { data: visitorData, isLoading, error } = trpc.analytics.getStatsWithCoordinates.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const totalVisitors = visitorData?.totalVisitors || 0;
  const topCountries = visitorData?.topCountries || [];
  const topContinents = visitorData?.topContinents || [];

  // Mock data para estados brasileiros
  const brazilianStates = [
    { state: "SP", count: 320 },
    { state: "RJ", count: 245 },
    { state: "MG", count: 198 },
    { state: "BA", count: 156 },
    { state: "PR", count: 134 },
    { state: "RS", count: 89 },
    { state: "PE", count: 67 },
    { state: "SC", count: 56 },
  ];

  return (
    <>
      {/* Contador Global Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-[9999] group"
      >
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 px-4 py-3 flex items-center gap-3 hover:from-blue-600 hover:to-blue-800">
          {/* Ícone com animação */}
          <div className="relative">
            <Globe className="w-6 h-6 text-white" />
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-pulse" />
          </div>

          {/* Contador */}
          <div className="flex flex-col items-start">
            <span className="text-xs text-blue-100 font-medium">Visitantes</span>
            <span className="text-lg font-bold text-white">
              {totalVisitors > 999 ? `${(totalVisitors / 1000).toFixed(1)}k` : totalVisitors}
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown className="w-4 h-4 text-blue-100 ml-2 group-hover:translate-y-1 transition-transform" />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            Clique para detalhes
          </div>
        </div>
      </button>

      {/* Modal com Estatísticas Detalhadas */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Estatísticas Globais de Visitantes
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground">Carregando dados...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                Erro ao carregar dados de visitantes. Tente novamente.
              </p>
            </div>
          ) : null}

          <div className="space-y-6">
            {/* Grid de Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Total</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {totalVisitors.toLocaleString()}
                      </p>
                    </div>
                    <Globe className="w-10 h-10 text-blue-300 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Países</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {topCountries.length}
                      </p>
                    </div>
                    <MapPin className="w-10 h-10 text-green-300 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Continentes</p>
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {topContinents.length}
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-300 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Média/Dia</p>
                      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(totalVisitors / 30)}
                      </p>
                    </div>
                    <Users className="w-10 h-10 text-orange-300 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Continentes e Países */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Continentes */}
              {topContinents.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Visitantes por Continente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topContinents.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="text-sm font-medium">{item.continent}</span>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200">
                          {String(item.count)}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Top Países */}
              {topCountries.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Top Países
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-80 overflow-y-auto">
                    {topCountries.slice(0, 10).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => item.country === "Brazil" && setSelectedCountry(item.country)}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.country}</span>
                            {item.country === "Brazil" && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">(clique para estados)</span>
                            )}
                          </div>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 hover:bg-green-200">
                            {String(item.count)}
                          </Badge>
                        </div>

                        {/* Estados Brasileiros */}
                        {selectedCountry === "Brazil" && item.country === "Brazil" && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                              Visitantes por Estado
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {brazilianStates.map((state, stateIdx) => (
                                <div
                                  key={stateIdx}
                                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                  <div className="font-bold text-slate-900 dark:text-white">{state.state}</div>
                                  <div className="text-xs text-muted-foreground">{String(state.count)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info sobre dados em tempo real */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                    ℹ
                  </div>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Dados em Tempo Real</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    Atualizado automaticamente a cada 30 segundos. Última atualização: {new Date().toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
