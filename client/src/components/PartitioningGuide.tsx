import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";
import { FIRMWARE_TYPES, DISTRIBUTIONS, PROCESSORS, FirmwareType, DiskType, PartitionRecommendation } from "@/lib/partitionData";

interface PartitioningGuideProps {
  firmware: FirmwareType;
  diskSize: number;
  diskType: DiskType;
  processorId: string;
  distroId: string;
  partitions: PartitionRecommendation;
}

export default function PartitioningGuide({
  firmware,
  diskSize,
  diskType,
  processorId,
  distroId,
  partitions,
}: PartitioningGuideProps) {
  const firmwareConfig = FIRMWARE_TYPES[firmware];
  const processor = PROCESSORS[processorId];
  const distro = DISTRIBUTIONS[distroId];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Sobre o Particionamento
          </CardTitle>
          <CardDescription>
            Guia personalizado baseado na sua configuração de hardware
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Hardware Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumo da Configuração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Processador</p>
              <p className="font-semibold text-sm">{processor?.brand} - {processor?.architecture}</p>
              {processor?.releaseYear && (
                <p className="text-xs text-muted-foreground mt-1">Lançamento: {processor.releaseYear}</p>
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Disco</p>
              <p className="font-semibold text-sm">{diskSize} GB - {diskType === 'ssd' ? 'SSD' : 'HDD'}</p>
              <p className="text-xs text-muted-foreground mt-1">Tabela: {firmwareConfig.partitionTable}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Firmware</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{firmwareConfig.name}</Badge>
                {firmwareConfig.requiresEFI && (
                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    EFI
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Distribuição</p>
              <p className="font-semibold text-sm">{distro.name}</p>
              <p className="text-xs text-muted-foreground mt-1">FS: {distro.filesystem}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firmware Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tipo de Firmware: {firmwareConfig.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{firmwareConfig.description}</p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Características:</p>
            <ul className="space-y-1">
              {firmwareConfig.notes.map((note, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Máximo de partições:</strong> {firmwareConfig.maxPartitions}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Partitioning Strategy */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Estratégia de Particionamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {firmwareConfig.requiresEFI && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Partição EFI (Obrigatória)
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {partitions.efi.toFixed(1)} GB - Sistema de arquivos EFI FAT32
                </p>
              </div>
            )}

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Partição /boot
              </p>
              <p className="text-xs text-muted-foreground">
                {partitions.boot.toFixed(1)} GB - Kernel e arquivos de boot
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Partição / (Root)
              </p>
              <p className="text-xs text-muted-foreground">
                {partitions.root.toFixed(1)} GB - Sistema operacional e aplicações
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Partição Swap
              </p>
              <p className="text-xs text-muted-foreground">
                {partitions.swap.toFixed(1)} GB - Memória virtual
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Partição /home
              </p>
              <p className="text-xs text-muted-foreground">
                {partitions.home.toFixed(1)} GB - Dados do usuário
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disk Type Recommendations */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Otimizações para {diskType === 'ssd' ? 'SSD' : 'HDD'}</CardTitle>
        </CardHeader>
        <CardContent>
          {diskType === 'ssd' ? (
            <ul className="space-y-2">
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Ative TRIM automático (fstrim.timer) para manter performance</span>
              </li>
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Use ext4 ou btrfs para melhor performance</span>
              </li>
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Deixe 10-20% de espaço livre para operações internas</span>
              </li>
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Considere usar noatime em /home para reduzir escritas</span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2">
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Use ext4 para máxima compatibilidade</span>
              </li>
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Deixe espaço livre para evitar fragmentação</span>
              </li>
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Considere usar LVM para gerenciamento flexível</span>
              </li>
              <li className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Monitore SMART para prever falhas</span>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Warnings */}
      {diskSize > 2000 && (firmware === 'bios' || firmware === 'mbr') && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Aviso:</strong> Seu disco tem {diskSize}GB, mas MBR/BIOS tem limite de 2TB. Considere usar UEFI/GPT para discos maiores.
          </AlertDescription>
        </Alert>
      )}

      {processor?.releaseYear && processor.releaseYear < 2009 && firmware === 'uefi' && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-900">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>Aviso:</strong> Processadores anteriores a 2009 podem ter problemas com UEFI. Verifique se seu BIOS suporta UEFI.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
