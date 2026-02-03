import { useState } from "react";
import { Globe, X, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

interface VisitorStats {
  totalVisitors: number;
  topCountries: Array<{ country: string | null; count: number }>;
  topContinents: Array<{ continent: string | null; count: number }>;
}

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

export default function VisitorGlobe() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Mock data - em produção, isso viria do tRPC
  const stats: VisitorStats = {
    totalVisitors: 2847,
    topCountries: [
      { country: "Brazil", count: 1205 },
      { country: "United States", count: 456 },
      { country: "Portugal", count: 289 },
      { country: "Germany", count: 198 },
      { country: "France", count: 145 },
      { country: "Canada", count: 123 },
      { country: "Mexico", count: 98 },
      { country: "Spain", count: 87 },
    ],
    topContinents: [
      { continent: "South America", count: 1450 },
      { continent: "North America", count: 650 },
      { continent: "Europe", count: 520 },
      { continent: "Asia", count: 180 },
      { continent: "Africa", count: 47 },
    ],
  };

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
      {/* Globo Animado com Contador */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 group"
      >
        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer transform hover:scale-110">
          {/* Globo com animação */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 to-blue-700 opacity-50 animate-pulse" />
          <Globe className="w-8 h-8 text-white relative z-10 animate-spin" style={{ animationDuration: "20s" }} />

          {/* Badge com contador */}
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            {stats.totalVisitors > 999 ? `${(stats.totalVisitors / 1000).toFixed(1)}k` : stats.totalVisitors}
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {stats.totalVisitors.toLocaleString()} visitantes
          </div>
        </div>
      </button>

      {/* Modal com Mapa Interativo */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Visitantes Globais
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Estatísticas Globais */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total de Visitantes</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalVisitors.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Por Continente</p>
                    <div className="space-y-2">
                      {stats.topContinents.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm">{item.continent}</span>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mapa de Países */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visitantes por País</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {stats.topCountries.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => item.country === "Brazil" && setSelectedCountry(item.country)}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{item.country}</span>
                            {item.country === "Brazil" && (
                              <span className="text-xs text-muted-foreground">(clique para ver estados)</span>
                            )}
                          </div>
                          <Badge>{item.count}</Badge>
                        </div>

                        {/* Estados Brasileiros */}
                        {selectedCountry === "Brazil" && item.country === "Brazil" && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">
                              Visitantes por Estado
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {brazilianStates.map((state, stateIdx) => (
                                <div
                                  key={stateIdx}
                                  className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-sm flex items-center justify-between"
                                >
                                  <span className="font-medium">{state.state}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {state.count}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mapa Visual (placeholder para Google Maps) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mapa Interativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">Mapa interativo em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
