import { PartitionRecommendation } from "@/lib/partitionData";
import { Card, CardContent } from "@/components/ui/card";
import { HardDrive, Zap } from "lucide-react";

interface PartitionVisualizationProps {
  partitions: PartitionRecommendation;
}

export default function PartitionVisualization({
  partitions,
}: PartitionVisualizationProps) {
  const partitionList = [
    { name: "EFI", size: partitions.efi, color: "bg-blue-500", icon: "🔵" },
    { name: "Boot", size: partitions.boot, color: "bg-purple-500", icon: "🟣" },
    { name: "Root (/)", size: partitions.root, color: "bg-pink-500", icon: "🔴" },
    ...(partitions.swap > 0
      ? [{ name: "Swap", size: partitions.swap, color: "bg-green-500", icon: "🟢" }]
      : []),
    { name: "Home", size: partitions.home, color: "bg-orange-500", icon: "🟠" },
  ];

  const totalPercent = 100;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-base">Visualização do Disco</h3>
        </div>

        {/* Visual Bar - Improved */}
        <div className="space-y-2">
          <div className="flex h-10 rounded-lg overflow-hidden shadow-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {partitionList.map((partition) => (
              <div
                key={partition.name}
                className={`${partition.color} transition-all hover:opacity-90 cursor-pointer relative group`}
                style={{
                  width: `${(partition.size / partitions.total) * 100}%`,
                  minWidth: partition.size > 0 ? "4px" : "0px",
                }}
                title={`${partition.name}: ${partition.size.toFixed(2)}GB`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {partition.name}: {partition.size.toFixed(2)}GB ({((partition.size / partitions.total) * 100).toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Passe o mouse sobre as seções para ver detalhes
          </p>
        </div>

        {/* Legend - Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {partitionList.map((partition) => (
            <div
              key={partition.name}
              className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${partition.color}`} />
                <p className="font-semibold text-xs">{partition.name}</p>
              </div>
              <div className="ml-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {partition.size.toFixed(1)}GB
                </p>
                <p className="text-xs text-muted-foreground">
                  {((partition.size / partitions.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total do Disco</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {partitions.total.toFixed(1)} GB
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Espaço para Dados</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {partitions.home.toFixed(1)} GB
            </p>
          </div>
        </div>

        {/* Partition Notes - Compact */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-2 text-xs">
            <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">EFI/Boot:</span> Inicialização do sistema
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-pink-600 dark:text-pink-400 font-bold flex-shrink-0">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">Root (/):</span> Sistema operacional
            </span>
          </div>
          {partitions.swap > 0 && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">•</span>
              <span className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">Swap:</span> Memória virtual
              </span>
            </div>
          )}
          <div className="flex items-start gap-2 text-xs">
            <span className="text-orange-600 dark:text-orange-400 font-bold flex-shrink-0">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">Home:</span> Dados do usuário
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
