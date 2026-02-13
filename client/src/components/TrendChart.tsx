import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TrendData {
  date: string;
  visitors: number;
  day: string;
}

interface TrendChartProps {
  data?: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // Mock data para os últimos 7 dias
  const defaultData: TrendData[] = [
    { date: "Seg", day: "Segunda", visitors: 120 },
    { date: "Ter", day: "Terça", visitors: 180 },
    { date: "Qua", day: "Quarta", visitors: 150 },
    { date: "Qui", day: "Quinta", visitors: 220 },
    { date: "Sex", day: "Sexta", visitors: 280 },
    { date: "Sab", day: "Sábado", visitors: 200 },
    { date: "Dom", day: "Domingo", visitors: 320 },
  ];

  const chartData = data || defaultData;
  const maxVisitors = Math.max(...chartData.map((d) => d.visitors));
  const avgVisitors = Math.round(chartData.reduce((sum, d) => sum + d.visitors, 0) / chartData.length);
  const growth = chartData[chartData.length - 1].visitors - chartData[0].visitors;
  const growthPercent = Math.round((growth / chartData[0].visitors) * 100);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Tendência (Últimos 7 Dias)
          </CardTitle>
          <div className="flex items-center gap-1">
            <span className={`text-xs font-bold ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {growth >= 0 ? "+" : ""}{growth}
            </span>
            <span className={`text-xs font-semibold ${growthPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
              ({growthPercent >= 0 ? "+" : ""}{growthPercent}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gráfico */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [value, "Visitantes"]}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Máximo</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{maxVisitors}</p>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Média</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{avgVisitors}</p>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Crescimento</p>
            <p className={`text-lg font-bold ${growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {growth >= 0 ? "+" : ""}{growth}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
