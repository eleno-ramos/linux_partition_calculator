import { PartitionRecommendation } from "@/lib/partitionData";

interface PartitionVisualizationProps {
  partitions: PartitionRecommendation;
}

export default function PartitionVisualization({
  partitions,
}: PartitionVisualizationProps) {
  const getColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
    ];
    return colors[index % colors.length];
  };

  const partitionList = [
    { name: "EFI", size: partitions.efi, color: "bg-blue-500" },
    { name: "Boot", size: partitions.boot, color: "bg-purple-500" },
    { name: "Root (/)", size: partitions.root, color: "bg-pink-500" },
    ...(partitions.swap > 0
      ? [{ name: "Swap", size: partitions.swap, color: "bg-green-500" }]
      : []),
    { name: "Home", size: partitions.home, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-4">
      {/* Visual Bar */}
      <div className="flex h-12 rounded-lg overflow-hidden shadow-md">
        {partitionList.map((partition, index) => (
          <div
            key={partition.name}
            className={`${partition.color} transition-all hover:opacity-80`}
            style={{
              width: `${(partition.size / partitions.total) * 100}%`,
              minWidth: partition.size > 0 ? "2px" : "0px",
            }}
            title={`${partition.name}: ${partition.size.toFixed(2)}GB (${(
              (partition.size / partitions.total) *
              100
            ).toFixed(1)}%)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {partitionList.map((partition) => (
          <div key={partition.name} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${partition.color}`} />
            <div className="text-sm">
              <p className="font-semibold">{partition.name}</p>
              <p className="text-xs text-muted-foreground">
                {partition.size.toFixed(2)}GB
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted rounded-lg space-y-3">
        <p className="text-sm">
          <span className="font-semibold">Total do disco:</span>{" "}
          {partitions.total.toFixed(2)}GB
        </p>
        <p className="text-sm">
          <span className="font-semibold">Espaco para dados (/home):</span>{" "}
          {partitions.home.toFixed(2)}GB (
          {((partitions.home / partitions.total) * 100).toFixed(1)}%)
        </p>
      </div>

      {/* Partition Notes */}
      <div className="space-y-2">
        {partitions.efi > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">EFI ({partitions.efi.toFixed(2)}GB)</p>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">Particao de boot UEFI. Necessaria para sistemas modernos com UEFI.</p>
          </div>
        )}
        <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Boot ({partitions.boot.toFixed(2)}GB)</p>
          <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">Contem o kernel e arquivos de boot. Mantem separado para seguranca e facilita atualizacoes.</p>
        </div>
        <div className="p-3 bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 rounded-lg">
          <p className="text-sm font-semibold text-pink-900 dark:text-pink-100">Root (/) ({partitions.root.toFixed(2)}GB)</p>
          <p className="text-xs text-pink-800 dark:text-pink-200 mt-1">Sistema operacional, aplicacoes e bibliotecas. Tamanho critico para estabilidade.</p>
        </div>
        {partitions.swap > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">Swap ({partitions.swap.toFixed(2)}GB)</p>
            <p className="text-xs text-green-800 dark:text-green-200 mt-1">Memoria virtual em disco. Melhora performance quando RAM e insuficiente.</p>
          </div>
        )}
        <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Home ({partitions.home.toFixed(2)}GB)</p>
          <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">Dados pessoais, documentos e configuracoes do usuario. Pode ser preservada em reinstalacoes.</p>
        </div>
      </div>
    </div>
  );
}
