import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Download, Copy } from "lucide-react";
import {
  DISTRIBUTIONS,
  PROCESSORS,
  calculatePartitions,
  generateKickstartXML,
  generateUEFIBootScript,
  PartitionRecommendation,
} from "@/lib/partitionData";
import SettingsPanel from "./SettingsPanel";
import PartitionVisualization from "./PartitionVisualization";
import { toast } from "sonner";

export default function PartitionCalculator() {
  const [diskSize, setDiskSize] = useState(500);
  const [ramSize, setRamSize] = useState(4);
  const [selectedDistro, setSelectedDistro] = useState("mint");
  const [selectedProcessor, setSelectedProcessor] = useState("intel_x86");
  const [hibernation, setHibernation] = useState(false);
  const [useMinimum, setUseMinimum] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hostname, setHostname] = useState("linux-system");
  const [timezone, setTimezone] = useState("UTC");

  const partitions = calculatePartitions(
    diskSize,
    ramSize,
    selectedDistro,
    hibernation,
    useMinimum
  );

  const distro = DISTRIBUTIONS[selectedDistro];
  const processor = PROCESSORS[selectedProcessor];

  const handleDownloadXML = () => {
    const xml = generateKickstartXML(selectedDistro, partitions, hostname, timezone);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/xml;charset=utf-8," + encodeURIComponent(xml)
    );
    element.setAttribute("download", `${hostname}-partition-config.xml`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Arquivo XML baixado com sucesso!");
  };

  const handleDownloadScript = () => {
    const script = generateUEFIBootScript(partitions);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(script)
    );
    element.setAttribute("download", `${hostname}-partition-setup.sh`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Script de particionamento baixado com sucesso!");
  };

  const handleCopyXML = async () => {
    const xml = generateKickstartXML(selectedDistro, partitions, hostname, timezone);
    try {
      await navigator.clipboard.writeText(xml);
      toast.success("XML copiado para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar para a área de transferência");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Hardware</CardTitle>
              <CardDescription>
                Insira as especificações do seu computador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disk Size */}
                <div className="space-y-2">
                  <Label htmlFor="disk-size">Tamanho do Disco (GB)</Label>
                  <Input
                    id="disk-size"
                    type="number"
                    min="50"
                    max="10000"
                    value={diskSize}
                    onChange={(e) => setDiskSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Tamanho total do seu disco rígido
                  </p>
                </div>

                {/* RAM Size */}
                <div className="space-y-2">
                  <Label htmlFor="ram-size">Memória RAM (GB)</Label>
                  <Input
                    id="ram-size"
                    type="number"
                    min="1"
                    max="256"
                    value={ramSize}
                    onChange={(e) => setRamSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Quantidade de RAM do seu sistema
                  </p>
                </div>

                {/* Distribution */}
                <div className="space-y-2">
                  <Label htmlFor="distro">Distribuição Linux</Label>
                  <Select value={selectedDistro} onValueChange={setSelectedDistro}>
                    <SelectTrigger id="distro">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISTRIBUTIONS).map(([key, dist]) => (
                        <SelectItem key={key} value={key}>
                          {dist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {distro.description}
                  </p>
                </div>

                {/* Processor */}
                <div className="space-y-2">
                  <Label htmlFor="processor">Processador</Label>
                  <Select value={selectedProcessor} onValueChange={setSelectedProcessor}>
                    <SelectTrigger id="processor">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROCESSORS).map(([key, proc]) => (
                        <SelectItem key={key} value={key}>
                          {proc.brand} - {proc.architecture} ({proc.bitness})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {processor.examples.join(", ")}
                  </p>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hibernation"
                    checked={hibernation}
                    onCheckedChange={(checked) => setHibernation(checked as boolean)}
                  />
                  <Label htmlFor="hibernation" className="cursor-pointer">
                    Ativar Hibernação (requer swap ≥ RAM)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="minimum"
                    checked={useMinimum}
                    onCheckedChange={(checked) => setUseMinimum(checked as boolean)}
                  />
                  <Label htmlFor="minimum" className="cursor-pointer">
                    Usar tamanhos mínimos (para espaço limitado)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendação de Particionamento</CardTitle>
              <CardDescription>
                Baseado em {distro.name} com {ramSize}GB RAM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PartitionVisualization partitions={partitions} />

              {/* Partition Details Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Partição</th>
                      <th className="text-left py-2 px-2">Ponto de Montagem</th>
                      <th className="text-right py-2 px-2">Tamanho (GB)</th>
                      <th className="text-right py-2 px-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">EFI</td>
                      <td className="py-2 px-2">/boot/efi</td>
                      <td className="text-right py-2 px-2">
                        {partitions.efi.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-2">
                        {((partitions.efi / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">Boot</td>
                      <td className="py-2 px-2">/boot</td>
                      <td className="text-right py-2 px-2">
                        {partitions.boot.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-2">
                        {((partitions.boot / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">Raiz</td>
                      <td className="py-2 px-2">/</td>
                      <td className="text-right py-2 px-2">
                        {partitions.root.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-2">
                        {((partitions.root / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    {partitions.swap > 0 && (
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">Swap</td>
                        <td className="py-2 px-2">swap</td>
                        <td className="text-right py-2 px-2">
                          {partitions.swap.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2">
                          {((partitions.swap / partitions.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-muted/50">
                      <td className="py-2 px-2">Home</td>
                      <td className="py-2 px-2">/home</td>
                      <td className="text-right py-2 px-2">
                        {partitions.home.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-2">
                        {((partitions.home / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Configuração</CardTitle>
              <CardDescription>
                Baixe a configuração em diferentes formatos para auto-instalação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Settings */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Configurações de Exportação</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                {showSettings && (
                  <SettingsPanel
                    hostname={hostname}
                    timezone={timezone}
                    onHostnameChange={setHostname}
                    onTimezoneChange={setTimezone}
                  />
                )}
              </div>

              {/* Export Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Kickstart XML</CardTitle>
                    <CardDescription>
                      Para Fedora, CentOS, RHEL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Arquivo de configuração para instalação automatizada
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyXML}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDownloadXML}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Script UEFI Boot</CardTitle>
                    <CardDescription>
                      Para particionamento manual
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Script bash para criar partições automaticamente
                    </p>
                    <Button
                      size="sm"
                      onClick={handleDownloadScript}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Script
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
