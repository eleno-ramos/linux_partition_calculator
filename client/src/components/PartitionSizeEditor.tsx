import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";
import { PartitionRecommendation, DISTRIBUTIONS, FirmwareType } from "@/lib/partitionData";

interface PartitionSizeEditorProps {
  partitions: PartitionRecommendation;
  onPartitionsChange: (partitions: PartitionRecommendation) => void;
  distroId: string;
  firmware: FirmwareType;
  diskSize: number;
}

export default function PartitionSizeEditor({
  partitions,
  onPartitionsChange,
  distroId,
  firmware,
  diskSize,
}: PartitionSizeEditorProps) {
  const distro = DISTRIBUTIONS[distroId];
  const [editedPartitions, setEditedPartitions] = useState<PartitionRecommendation>(partitions);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const minimums = {
    efi: firmware === 'uefi' ? 0.5 : 0,
    boot: 0.5,
    root: distro.minRootSize,
    swap: 1,
    home: 1,
  };

  const total = editedPartitions.efi + editedPartitions.boot + editedPartitions.root + editedPartitions.swap + editedPartitions.home;

  const handlePartitionChange = (key: keyof PartitionRecommendation, value: number) => {
    const newPartitions = { ...editedPartitions, [key]: value };
    setEditedPartitions(newPartitions);

    // Validate
    const newErrors: Record<string, string> = {};
    const newTotal = newPartitions.efi + newPartitions.boot + newPartitions.root + newPartitions.swap + newPartitions.home;

    if (newTotal > diskSize) {
      newErrors.total = `Total (${newTotal.toFixed(1)}GB) excede o disco (${diskSize}GB)`;
    }

    if (newPartitions.efi > 0 && newPartitions.efi < minimums.efi) {
      newErrors.efi = `Mínimo: ${minimums.efi}GB`;
    }
    if (newPartitions.boot < minimums.boot) {
      newErrors.boot = `Mínimo: ${minimums.boot}GB`;
    }
    if (newPartitions.root < minimums.root) {
      newErrors.root = `Mínimo: ${minimums.root}GB`;
    }
    if (newPartitions.swap < minimums.swap) {
      newErrors.swap = `Mínimo: ${minimums.swap}GB`;
    }
    if (newPartitions.home < minimums.home) {
      newErrors.home = `Mínimo: ${minimums.home}GB`;
    }

    setErrors(newErrors);
  };

  const handleApply = () => {
    if (Object.keys(errors).length === 0) {
      onPartitionsChange(editedPartitions);
    }
  };

  const handleReset = () => {
    setEditedPartitions(partitions);
    setErrors({});
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Editor de Tamanhos de Partições</CardTitle>
          <CardDescription>
            Customize os tamanhos das partições. Use os mínimos como referência.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Partition Editors */}
      <div className="space-y-3">
        {/* EFI Partition */}
        {firmware === 'uefi' && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="efi-size" className="text-sm font-semibold">
                    Partição EFI
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo: {minimums.efi}GB | Recomendado: 1GB
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {editedPartitions.efi.toFixed(2)}GB
                </Badge>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    id="efi-size"
                    type="number"
                    step="0.1"
                    min={minimums.efi}
                    max={diskSize}
                    value={editedPartitions.efi}
                    onChange={(e) => handlePartitionChange('efi', Number(e.target.value))}
                    className={`h-8 text-sm ${errors.efi ? 'border-red-500' : ''}`}
                  />
                  {errors.efi && <p className="text-xs text-red-600 mt-1">{errors.efi}</p>}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePartitionChange('efi', minimums.efi)}
                  className="text-xs h-8"
                >
                  Min
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Boot Partition */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="boot-size" className="text-sm font-semibold">
                  Partição /boot
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo: {minimums.boot}GB | Recomendado: 1GB
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {editedPartitions.boot.toFixed(2)}GB
              </Badge>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  id="boot-size"
                  type="number"
                  step="0.1"
                  min={minimums.boot}
                  max={diskSize}
                  value={editedPartitions.boot}
                  onChange={(e) => handlePartitionChange('boot', Number(e.target.value))}
                  className={`h-8 text-sm ${errors.boot ? 'border-red-500' : ''}`}
                />
                {errors.boot && <p className="text-xs text-red-600 mt-1">{errors.boot}</p>}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePartitionChange('boot', minimums.boot)}
                className="text-xs h-8"
              >
                Min
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Root Partition */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="root-size" className="text-sm font-semibold">
                  Partição / (Root)
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo: {minimums.root}GB | Recomendado: {distro.recommendedRootSize}GB
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {editedPartitions.root.toFixed(2)}GB
              </Badge>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  id="root-size"
                  type="number"
                  step="0.1"
                  min={minimums.root}
                  max={diskSize}
                  value={editedPartitions.root}
                  onChange={(e) => handlePartitionChange('root', Number(e.target.value))}
                  className={`h-8 text-sm ${errors.root ? 'border-red-500' : ''}`}
                />
                {errors.root && <p className="text-xs text-red-600 mt-1">{errors.root}</p>}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePartitionChange('root', minimums.root)}
                className="text-xs h-8"
              >
                Min
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePartitionChange('root', distro.recommendedRootSize)}
                className="text-xs h-8"
              >
                Rec
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Swap Partition */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="swap-size" className="text-sm font-semibold">
                  Partição Swap
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo: {minimums.swap}GB | Típico: 2-4GB
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {editedPartitions.swap.toFixed(2)}GB
              </Badge>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  id="swap-size"
                  type="number"
                  step="0.1"
                  min={minimums.swap}
                  max={diskSize}
                  value={editedPartitions.swap}
                  onChange={(e) => handlePartitionChange('swap', Number(e.target.value))}
                  className={`h-8 text-sm ${errors.swap ? 'border-red-500' : ''}`}
                />
                {errors.swap && <p className="text-xs text-red-600 mt-1">{errors.swap}</p>}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePartitionChange('swap', minimums.swap)}
                className="text-xs h-8"
              >
                Min
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Home Partition */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="home-size" className="text-sm font-semibold">
                  Partição /home
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo: {minimums.home}GB | Resto do disco
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {editedPartitions.home.toFixed(2)}GB
              </Badge>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  id="home-size"
                  type="number"
                  step="0.1"
                  min={minimums.home}
                  max={diskSize}
                  value={editedPartitions.home}
                  onChange={(e) => handlePartitionChange('home', Number(e.target.value))}
                  className={`h-8 text-sm ${errors.home ? 'border-red-500' : ''}`}
                />
                {errors.home && <p className="text-xs text-red-600 mt-1">{errors.home}</p>}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePartitionChange('home', minimums.home)}
                className="text-xs h-8"
              >
                Min
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Summary */}
      <Card className={`border-0 shadow-sm ${total > diskSize ? 'bg-red-50 dark:bg-red-950/30' : 'bg-green-50 dark:bg-green-950/30'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Total Alocado</p>
              <p className="text-xs text-muted-foreground mt-1">
                {total.toFixed(2)}GB / {diskSize}GB
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-bold ${total > diskSize ? 'text-red-600' : 'text-green-600'}`}>
                {total > diskSize ? 'Excedido!' : 'OK'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Summary */}
      {!isValid && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Corrija os erros acima antes de aplicar as alterações.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleApply}
          disabled={!isValid}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Aplicar Alterações
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar
        </Button>
      </div>
    </div>
  );
}
