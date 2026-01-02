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
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">
          <span className="font-semibold">Total do disco:</span>{" "}
          {partitions.total.toFixed(2)}GB
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold">Espaço para dados (/home):</span>{" "}
          {partitions.home.toFixed(2)}GB (
          {((partitions.home / partitions.total) * 100).toFixed(1)}%)
        </p>
      </div>
    </div>
  );
}
