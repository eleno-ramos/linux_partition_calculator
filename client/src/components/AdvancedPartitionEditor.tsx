import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Info } from "lucide-react";
import { OPTIONAL_MOUNT_POINTS, AdvancedPartitionConfig } from "@/lib/partitionData";
import { toast } from "sonner";

interface AdvancedPartitionEditorProps {
  config: AdvancedPartitionConfig;
  onUpdate: (config: AdvancedPartitionConfig) => void;
  diskSizeGB: number;
}

export default function AdvancedPartitionEditor({
  config,
  onUpdate,
  diskSizeGB,
}: AdvancedPartitionEditorProps) {
  const [selectedMountPoints, setSelectedMountPoints] = useState<string[]>(
    Object.keys(config.customPartitions)
  );

  const totalUsed =
    config.efi +
    config.boot +
    config.root +
    config.swap +
    config.home +
    Object.values(config.customPartitions).reduce((a, b) => a + b, 0);

  const spaceAvailable = diskSizeGB - totalUsed;

  const handlePartitionSizeChange = (partition: string, newSize: number) => {
    const updated = { ...config };
    
    // Validar tamanho mínimo
    if (partition === "efi" && newSize < 0.256) {
      toast.error("EFI mínimo: 256 MB");
      return;
    }
    if (partition === "boot" && newSize < 0.5) {
      toast.error("Boot mínimo: 500 MB");
      return;
    }
    if (partition === "root" && newSize < 10) {
      toast.error("Root mínimo: 10 GB");
      return;
    }
    if (partition === "swap" && newSize < 0.5) {
      toast.error("Swap mínimo: 500 MB");
      return;
    }
    if (partition === "home" && newSize < 1) {
      toast.error("Home mínimo: 1 GB");
      return;
    }

    // Validar espaço total
    if (totalUsed - (partition === "efi" ? config.efi : 
                     partition === "boot" ? config.boot :
                     partition === "root" ? config.root :
                     partition === "swap" ? config.swap :
                     partition === "home" ? config.home : 0) + newSize > diskSizeGB) {
      toast.error("Espaço insuficiente no disco");
      return;
    }

    if (partition === "efi") updated.efi = newSize;
    else if (partition === "boot") updated.boot = newSize;
    else if (partition === "root") updated.root = newSize;
    else if (partition === "swap") updated.swap = newSize;
    else if (partition === "home") updated.home = newSize;

    onUpdate(updated);
  };

  const handleCustomPartitionSizeChange = (mountPoint: string, newSize: number) => {
    const updated = { ...config };
    
    if (newSize < 0.5) {
      toast.error("Tamanho mínimo: 500 MB");
      return;
    }

    if (totalUsed - (config.customPartitions[mountPoint] || 0) + newSize > diskSizeGB) {
      toast.error("Espaço insuficiente no disco");
      return;
    }

    updated.customPartitions[mountPoint] = newSize;
    onUpdate(updated);
  };

  const handleAddMountPoint = (mountPointKey: string) => {
    if (selectedMountPoints.includes(mountPointKey)) {
      setSelectedMountPoints(selectedMountPoints.filter(m => m !== mountPointKey));
      const updated = { ...config };
      const mountPointConfig = OPTIONAL_MOUNT_POINTS[mountPointKey as keyof typeof OPTIONAL_MOUNT_POINTS];
      delete updated.customPartitions[mountPointConfig.name];
      onUpdate(updated);
    } else {
      setSelectedMountPoints([...selectedMountPoints, mountPointKey]);
      const updated = { ...config };
      const mountPointConfig = OPTIONAL_MOUNT_POINTS[mountPointKey as keyof typeof OPTIONAL_MOUNT_POINTS];
      updated.customPartitions[mountPointConfig.name] = mountPointConfig.defaultSize;
      onUpdate(updated);
    }
  };

  const handleRemoveMountPoint = (mountPoint: string) => {
    const updated = { ...config };
    delete updated.customPartitions[mountPoint];
    onUpdate(updated);
    setSelectedMountPoints(
      selectedMountPoints.filter(
        m => OPTIONAL_MOUNT_POINTS[m as keyof typeof OPTIONAL_MOUNT_POINTS]?.name !== mountPoint
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Partições Obrigatórias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Partições Obrigatórias
          </CardTitle>
          <CardDescription>Ajuste o tamanho de cada partição conforme necessário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EFI */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>/boot/efi - Partição EFI</Label>
              <span className="text-sm font-semibold">{config.efi.toFixed(2)} GB</span>
            </div>
            <Slider
              value={[config.efi]}
              onValueChange={(value) => handlePartitionSizeChange("efi", value[0])}
              min={0.256}
              max={2}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={config.efi.toFixed(2)}
              onChange={(e) => handlePartitionSizeChange("efi", parseFloat(e.target.value))}
              step={0.1}
              min={0.256}
              className="text-sm"
            />
          </div>

          {/* Boot */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>/boot - Kernel e Bootloader</Label>
              <span className="text-sm font-semibold">{config.boot.toFixed(2)} GB</span>
            </div>
            <Slider
              value={[config.boot]}
              onValueChange={(value) => handlePartitionSizeChange("boot", value[0])}
              min={0.5}
              max={5}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={config.boot.toFixed(2)}
              onChange={(e) => handlePartitionSizeChange("boot", parseFloat(e.target.value))}
              step={0.1}
              min={0.5}
              className="text-sm"
            />
          </div>

          {/* Root */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>/ - Sistema de Arquivos Raiz</Label>
              <span className="text-sm font-semibold">{config.root.toFixed(2)} GB</span>
            </div>
            <Slider
              value={[config.root]}
              onValueChange={(value) => handlePartitionSizeChange("root", value[0])}
              min={10}
              max={Math.min(100, diskSizeGB * 0.6)}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              value={config.root.toFixed(2)}
              onChange={(e) => handlePartitionSizeChange("root", parseFloat(e.target.value))}
              step={1}
              min={10}
              className="text-sm"
            />
          </div>

          {/* Swap */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>swap - Memória Virtual</Label>
              <span className="text-sm font-semibold">{config.swap.toFixed(2)} GB</span>
            </div>
            <Slider
              value={[config.swap]}
              onValueChange={(value) => handlePartitionSizeChange("swap", value[0])}
              min={0.5}
              max={32}
              step={0.5}
              className="w-full"
            />
            <Input
              type="number"
              value={config.swap.toFixed(2)}
              onChange={(e) => handlePartitionSizeChange("swap", parseFloat(e.target.value))}
              step={0.5}
              min={0.5}
              className="text-sm"
            />
          </div>

          {/* Home */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>/home - Dados de Usuários</Label>
              <span className="text-sm font-semibold">{config.home.toFixed(2)} GB</span>
            </div>
            <Slider
              value={[config.home]}
              onValueChange={(value) => handlePartitionSizeChange("home", value[0])}
              min={1}
              max={diskSizeGB * 0.9}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              value={config.home.toFixed(2)}
              onChange={(e) => handlePartitionSizeChange("home", parseFloat(e.target.value))}
              step={1}
              min={1}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Partições Customizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Partições Opcionais Adicionadas
          </CardTitle>
          <CardDescription>Adicione pontos de montagem adicionais conforme necessário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.customPartitions).map(([mountPoint, size]) => (
            <div key={mountPoint} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>{mountPoint}</Label>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">{size.toFixed(2)} GB</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMountPoint(mountPoint)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[size]}
                onValueChange={(value) => handleCustomPartitionSizeChange(mountPoint, value[0])}
                min={0.5}
                max={100}
                step={0.5}
                className="w-full"
              />
              <Input
                type="number"
                value={size.toFixed(2)}
                onChange={(e) => handleCustomPartitionSizeChange(mountPoint, parseFloat(e.target.value))}
                step={0.5}
                min={0.5}
                className="text-sm"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Disponíveis para Adicionar */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Partições Opcionais</CardTitle>
          <CardDescription>Selecione pontos de montagem adicionais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(OPTIONAL_MOUNT_POINTS).map(([key, config]) => (
            <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={key}
                checked={selectedMountPoints.includes(key)}
                onCheckedChange={() => handleAddMountPoint(key)}
              />
              <div className="flex-1">
                <label
                  htmlFor={key}
                  className="font-medium cursor-pointer block"
                >
                  {config.name}
                </label>
                <p className="text-sm text-muted-foreground">{config.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Padrão: {config.defaultSize} GB (Mínimo: {config.minSize} GB)
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resumo de Espaço */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-base">Resumo de Espaço em Disco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Espaço Total:</span>
            <span className="font-semibold">{diskSizeGB.toFixed(2)} GB</span>
          </div>
          <div className="flex justify-between">
            <span>Espaço Utilizado:</span>
            <span className="font-semibold">{totalUsed.toFixed(2)} GB</span>
          </div>
          <div className="flex justify-between">
            <span>Espaço Disponível:</span>
            <span className={`font-semibold ${spaceAvailable < 0 ? "text-red-600" : "text-green-600"}`}>
              {spaceAvailable.toFixed(2)} GB
            </span>
          </div>
          {spaceAvailable < 0 && (
            <p className="text-red-600 text-xs mt-2">⚠️ Espaço insuficiente! Reduza o tamanho de algumas partições.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
