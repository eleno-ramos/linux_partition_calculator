import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info } from "lucide-react";

interface CountryData {
  name: string;
  count: number;
  code: string;
}

interface InteractiveMapProps {
  countries?: CountryData[];
  onCountryClick?: (country: string) => void;
}

// Mapa simplificado de regiões do mundo com países
const WORLD_REGIONS = {
  "América do Norte": [
    { name: "Estados Unidos", code: "US" },
    { name: "Canadá", code: "CA" },
    { name: "México", code: "MX" },
  ],
  "América do Sul": [
    { name: "Brasil", code: "BR" },
    { name: "Argentina", code: "AR" },
    { name: "Chile", code: "CL" },
    { name: "Colômbia", code: "CO" },
    { name: "Peru", code: "PE" },
  ],
  Europa: [
    { name: "Portugal", code: "PT" },
    { name: "Espanha", code: "ES" },
    { name: "França", code: "FR" },
    { name: "Alemanha", code: "DE" },
    { name: "Reino Unido", code: "GB" },
    { name: "Itália", code: "IT" },
    { name: "Polônia", code: "PL" },
  ],
  Ásia: [
    { name: "Japão", code: "JP" },
    { name: "China", code: "CN" },
    { name: "Índia", code: "IN" },
    { name: "Singapura", code: "SG" },
    { name: "Tailândia", code: "TH" },
  ],
  Oceania: [
    { name: "Austrália", code: "AU" },
    { name: "Nova Zelândia", code: "NZ" },
  ],
  África: [
    { name: "África do Sul", code: "ZA" },
    { name: "Egito", code: "EG" },
    { name: "Nigéria", code: "NG" },
  ],
};

export default function InteractiveMap({ countries = [], onCountryClick }: InteractiveMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Criar mapa de países com contadores
  const countryMap = new Map(countries.map((c) => [c.code, c.count]));

  const getCountryColor = (count: number | undefined) => {
    if (!count) return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    if (count > 500) return "bg-blue-600 text-white";
    if (count > 200) return "bg-blue-500 text-white";
    if (count > 100) return "bg-blue-400 text-white";
    if (count > 50) return "bg-blue-300 text-slate-900";
    return "bg-blue-200 text-slate-900";
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Mapa Interativo de Visitantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legenda de cores */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Clique em um país para ver detalhes
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded" />
              <span className="text-xs">+500</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-xs">200-500</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded" />
              <span className="text-xs">100-200</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-300 rounded" />
              <span className="text-xs">50-100</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded" />
              <span className="text-xs">1-50</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <span className="text-xs">Sem dados</span>
            </div>
          </div>
        </div>

        {/* Regiões */}
        <div className="space-y-3">
          {Object.entries(WORLD_REGIONS).map(([region, regionCountries]) => (
            <div key={region}>
              <button
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                className="w-full text-left p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold text-sm flex items-center justify-between"
              >
                <span>{region}</span>
                <span className="text-xs text-muted-foreground">
                  {regionCountries.length} países
                </span>
              </button>

              {selectedRegion === region && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-2">
                  {regionCountries.map((country) => {
                    const count = countryMap.get(country.code) || 0;
                    return (
                      <button
                        key={country.code}
                        onClick={() => onCountryClick?.(country.name)}
                        onMouseEnter={() => setHoveredCountry(country.code)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        className={`p-2 rounded-lg transition-all ${getCountryColor(count)} ${
                          hoveredCountry === country.code ? "ring-2 ring-offset-2 ring-blue-500" : ""
                        }`}
                      >
                        <div className="text-xs font-semibold">{country.name}</div>
                        {count > 0 && (
                          <div className="text-xs mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {count}
                            </Badge>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <p className="text-xs text-green-700 dark:text-green-400 font-medium">
            Total de {countries.length} países com visitantes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
