import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import {
  ValidationResult,
  SpaceGrowthProjection,
} from "@/lib/partitionData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ValidationPanelProps {
  validation: ValidationResult;
  growthProjection: SpaceGrowthProjection[];
}

export default function ValidationPanel({
  validation,
  growthProjection,
}: ValidationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Validation Results */}
      {validation.errors.length > 0 && (
        <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              Erros de Configuração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.errors.map((error, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    ✕
                  </span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {validation.warnings.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertTriangle size={20} />
              Avisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.warnings.map((warning, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                    ⚠
                  </span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {validation.errors.length === 0 && validation.warnings.length === 0 && (
        <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle size={20} />
              Configuração Válida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 dark:text-green-400">
              Sua configuração de particionamento está válida e pronta para uso!
            </p>
          </CardContent>
        </Card>
      )}

      {validation.suggestions.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Lightbulb size={20} />
              Sugestões de Otimização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    💡
                  </span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Growth Projection Chart */}
      {growthProjection.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Crescimento de Espaço (5 Anos)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Anos", position: "insideBottomRight", offset: -5 }}
                />
                <YAxis
                  label={{ value: "GB", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => `${(value as number).toFixed(1)} GB`}
                  labelFormatter={(label) => `Ano ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="systemUsage"
                  stroke="#3b82f6"
                  name="Sistema"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="homeUsage"
                  stroke="#10b981"
                  name="Home (/home)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="freeSpace"
                  stroke="#f59e0b"
                  name="Espaço Livre"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-2 text-sm">
              <p className="font-semibold">Análise da Projeção:</p>
              {growthProjection[growthProjection.length - 1].warningLevel && (
                <p className="text-yellow-700 dark:text-yellow-400">
                  ⚠️ Em 5 anos, o espaço livre pode ser inferior a 10%. Considere
                  expandir o disco ou gerenciar melhor o espaço.
                </p>
              )}
              {!growthProjection[growthProjection.length - 1].warningLevel && (
                <p className="text-green-700 dark:text-green-400">
                  ✓ Sua configuração deve ser suficiente para os próximos 5 anos
                  com o padrão de uso típico.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
