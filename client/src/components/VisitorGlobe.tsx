import { useState } from "react";
import { Globe, X, MapPin, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import AnimatedGlobe from "./AnimatedGlobe";

interface VisitorStats {
  totalVisitors: number;
  topCountries: Array<{ country: string | null; count: number; lat?: number; lng?: number }>;
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

// Coordenadas de países (latitude, longitude)
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  Brazil: [-10, -55],
  "United States": [37, -95],
  Portugal: [39.3, -8],
  Germany: [51.1, 10.4],
  France: [46.2, 2.2],
  Canada: [56.1, -106.3],
  Mexico: [23.6, -102.5],
  Spain: [40, -3.7],
  "United Kingdom": [55.4, -3.4],
  Japan: [36.2, 138.2],
  Australia: [-25.3, 133.8],
  India: [20, 78],
  China: [35.9, 104.1],
  Russia: [61.5, 105.3],
  "South Africa": [-30.6, 22.9],
};

export default function VisitorGlobe() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Mock data - em produção, isso viria do tRPC
  const stats: VisitorStats = {
    totalVisitors: 2847,
    topCountries: [
      { country: "Brazil", count: 1205, lat: -10, lng: -55 },
      { country: "United States", count: 456, lat: 37, lng: -95 },
      { country: "Portugal", count: 289, lat: 39.3, lng: -8 },
      { country: "Germany", count: 198, lat: 51.1, lng: 10.4 },
      { country: "France", count: 145, lat: 46.2, lng: 2.2 },
      { country: "Canada", count: 123, lat: 56.1, lng: -106.3 },
      { country: "Mexico", count: 98, lat: 23.6, lng: -102.5 },
      { country: "Spain", count: 87, lat: 40, lng: -3.7 },
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

  // Preparar dados para o globo animado
  const globeData = stats.topCountries.map((country) => ({
    name: country.country || "Unknown",
    lat: country.lat || 0,
    lng: country.lng || 0,
    count: country.count,
    color: country.country === "Brazil" ? "#ef4444" : "#3b82f6",
  }));

  return (
    <>
      {/* Globo Animado com Contador */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-[9999] group"
      >
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center cursor-pointer transform hover:scale-110 hover:shadow-2xl">
          {/* Globo com animação */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 to-blue-700 opacity-40 animate-pulse" />
          <Globe className="w-8 h-8 text-white relative z-10 animate-spin" style={{ animationDuration: "20s" }} />

          {/* Badge com contador */}
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
            {stats.totalVisitors > 999 ? `${(stats.totalVisitors / 1000).toFixed(1)}k` : stats.totalVisitors}
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            {stats.totalVisitors.toLocaleString()} visitantes
          </div>
        </div>
      </button>

      {/* Modal com Mapa Interativo */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Visitantes Globais
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Globo Animado */}
            <div className="flex justify-center">
              <AnimatedGlobe countries={globeData} />
            </div>

            {/* Grid de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total de Visitantes</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalVisitors.toLocaleString()}
                      </p>
                    </div>
                    <Globe className="w-8 h-8 text-blue-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Países</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.topCountries.length}
                      </p>
                    </div>
                    <MapPin className="w-8 h-8 text-green-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Continentes</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.topContinents.length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Continentes */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Visitantes por Continente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.topContinents.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <span className="text-sm font-medium">{item.continent}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Países */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Top Países</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {stats.topCountries.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => item.country === "Brazil" && setSelectedCountry(item.country)}
                      className="w-full text-left p-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.country}</span>
                          {item.country === "Brazil" && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">(clique para ver estados)</span>
                          )}
                        </div>
                        <Badge>{item.count}</Badge>
                      </div>

                      {/* Estados Brasileiros */}
                      {selectedCountry === "Brazil" && item.country === "Brazil" && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                            Visitantes por Estado
                          </p>
                          <div className="grid grid-cols-3 gap-1">
                            {brazilianStates.map((state, stateIdx) => (
                              <div
                                key={stateIdx}
                                className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-xs flex items-center justify-between"
                              >
                                <span className="font-medium">{state.state}</span>
                                <span className="text-xs text-muted-foreground">{state.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
