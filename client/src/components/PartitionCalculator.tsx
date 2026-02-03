"use client";

import { useState, useEffect } from "react";
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
import { Settings, Download, Copy, Moon, Sun, History, Sliders } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import {
  DISTRIBUTIONS,
  PROCESSORS,
  FIRMWARE_TYPES,
  DISK_TYPES,
  calculatePartitions,
  generateKickstartXML,
  generatePartcloneScript,
  calculateSpaceGrowthProjection,
  validatePartitionConfiguration,
  getPerformanceTips,
  calculateAdvancedPartitions,
  generateAdvancedKickstart,
  AdvancedPartitionConfig,
  FirmwareType,
  DiskType,
  PartitionRecommendation,
} from "@/lib/partitionData";
import SettingsPanel from "./SettingsPanel";
import PartitionVisualization from "./PartitionVisualization";
import ValidationPanel from "./ValidationPanel";
import ReviewSection from "./ReviewSection";
import AdvancedPartitionEditor from "./AdvancedPartitionEditor";
import { toast } from "sonner";

interface SavedConfiguration {
  id: string;
  name: string;
  timestamp: number;
  data: {
    diskSize: number;
    ramSize: number;
    distro: string;
    processor: string;
    firmware: FirmwareType;
    diskType: DiskType;
    hibernation: boolean;
    useMinimum: boolean;
    hostname: string;
    timezone: string;
  };
}

export default function PartitionCalculator() {
  const { theme, toggleTheme } = useTheme();
  const [diskSize, setDiskSize] = useState(500);
  const [ramSize, setRamSize] = useState(4);
  const [selectedDistro, setSelectedDistro] = useState("mint");
  const [selectedProcessor, setSelectedProcessor] = useState("intel_x86");
  const [selectedFirmware, setSelectedFirmware] = useState<FirmwareType>("uefi");
  const [selectedDiskType, setSelectedDiskType] = useState<DiskType>("ssd");
  const [hibernation, setHibernation] = useState(false);
  const [useMinimum, setUseMinimum] = useState(false);
  const [useLVM, setUseLVM] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hostname, setHostname] = useState("linux-system");
  const [timezone, setTimezone] = useState("UTC");
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [systemPercentage, setSystemPercentage] = useState(20);
  const [includeHome, setIncludeHome] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedConfig, setAdvancedConfig] = useState<AdvancedPartitionConfig | null>(null);

  // Load saved configurations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("partition_configs");
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved configs:", e);
      }
    }
  }, []);

  const partitions = calculatePartitions(
    diskSize,
    ramSize,
    selectedDistro,
    hibernation,
    useMinimum,
    systemPercentage,
    includeHome
  );

  const distro = DISTRIBUTIONS[selectedDistro];
  const processor = PROCESSORS[selectedProcessor];
  const firmware = FIRMWARE_TYPES[selectedFirmware];
  const diskType = DISK_TYPES[selectedDiskType];
  const performanceTips = getPerformanceTips(selectedDiskType, selectedDistro);

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
    let script = generatePartcloneScript(partitions, hostname);

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

  const saveConfiguration = () => {
    const newConfig: SavedConfiguration = {
      id: Date.now().toString(),
      name: `${distro.name} - ${diskSize}GB - ${new Date().toLocaleDateString("pt-BR")}`,
      timestamp: Date.now(),
      data: {
        diskSize,
        ramSize,
        distro: selectedDistro,
        processor: selectedProcessor,
        firmware: selectedFirmware,
        diskType: selectedDiskType,
        hibernation,
        useMinimum,
        hostname,
        timezone,
      },
    };

    const updated = [newConfig, ...savedConfigs].slice(0, 10); // Keep last 10
    setSavedConfigs(updated);
    localStorage.setItem("partition_configs", JSON.stringify(updated));
    toast.success("Configuração salva com sucesso!");
  };

  const loadConfiguration = (config: SavedConfiguration) => {
    const { data } = config;
    setDiskSize(data.diskSize);
    setRamSize(data.ramSize);
    setSelectedDistro(data.distro);
    setSelectedProcessor(data.processor);
    setSelectedFirmware(data.firmware);
    setSelectedDiskType(data.diskType);
    setHibernation(data.hibernation);
    setUseMinimum(data.useMinimum);
    setHostname(data.hostname);
    setTimezone(data.timezone);
    setShowHistory(false);
    toast.success("Configuração carregada!");
  };

  const deleteConfiguration = (id: string) => {
    const updated = savedConfigs.filter((c) => c.id !== id);
    setSavedConfigs(updated);
    localStorage.setItem("partition_configs", JSON.stringify(updated));
    toast.success("Configuração removida!");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Theme Toggle and History */}
      <div className="flex gap-2 justify-end">
        <LanguageToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="gap-2"
        >
          <History className="w-4 h-4" />
          Histórico ({savedConfigs.length})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4" />
              Claro
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Escuro
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={saveConfiguration}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Salvar
        </Button>
      </div>

      {/* History Panel */}
      {showHistory && savedConfigs.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-base">Histórico de Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedConfigs.map((config) => (
              <div
                key={config.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1 cursor-pointer" onClick={() => loadConfiguration(config)}>
                  <p className="font-medium text-sm">{config.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(config.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteConfiguration(config.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remover
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto">
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
          <TabsTrigger value="validation">Validação</TabsTrigger>
          <TabsTrigger value="partclone">Backup</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
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
                      {Object.values(DISTRIBUTIONS).map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
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
                      {Object.values(PROCESSORS).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.brand} - {p.architecture} ({p.bitness})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {processor.examples.join(", ")}
                  </p>
                </div>

                {/* Firmware Type */}
                <div className="space-y-2">
                  <Label htmlFor="firmware">Tipo de Firmware</Label>
                  <Select value={selectedFirmware} onValueChange={(v) => setSelectedFirmware(v as FirmwareType)}>
                    <SelectTrigger id="firmware">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(FIRMWARE_TYPES).map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {firmware.description}
                  </p>
                </div>

                {/* Disk Type */}
                <div className="space-y-2">
                  <Label htmlFor="disk-type">Tipo de Disco</Label>
                  <Select value={selectedDiskType} onValueChange={(v) => setSelectedDiskType(v as DiskType)}>
                    <SelectTrigger id="disk-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DISK_TYPES).map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {diskType.description}
                  </p>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hibernation"
                    checked={hibernation}
                    onCheckedChange={(checked) => setHibernation(checked as boolean)}
                  />
                  <Label htmlFor="hibernation" className="cursor-pointer">
                    Ativar Hibernação (requer swap ≥ RAM)
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="minimum"
                    checked={useMinimum}
                    onCheckedChange={(checked) => setUseMinimum(checked as boolean)}
                  />
                  <Label htmlFor="minimum" className="cursor-pointer">
                    Usar tamanhos mínimos (para espaço limitado)
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="lvm"
                    checked={useLVM}
                    onCheckedChange={(checked) => setUseLVM(checked as boolean)}
                  />
                  <Label htmlFor="lvm" className="cursor-pointer">
                    Usar LVM (Logical Volume Manager)
                  </Label>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Distribuição de Espaço em Disco</Label>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {systemPercentage}% Sistema | {100 - systemPercentage}% Dados
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={systemPercentage}
                    onChange={(e) => setSystemPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10% (Mínimo)</span>
                    <span>80% (Máximo)</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Sistema</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {((diskSize * systemPercentage) / 100).toFixed(1)} GB
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Dados (/home)</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {((diskSize * (100 - systemPercentage)) / 100).toFixed(1)} GB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Firmware Notes */}
          {firmware.notes.length > 0 && (
            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
              <CardHeader>
                <CardTitle className="text-base">Notas sobre {firmware.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {firmware.notes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Performance Tips */}
          {performanceTips.length > 0 && (
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="text-base">Dicas de Desempenho para {diskType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {performanceTips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Partition Visualization */}
          <PartitionVisualization partitions={partitions} />

          {/* Partition Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalhes das Partições</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 px-2 font-semibold">Partição</th>
                      <th className="text-left py-2 px-2 font-semibold">Ponto de Montagem</th>
                      <th className="text-right py-2 px-2 font-semibold">Tamanho (GB)</th>
                      <th className="text-right py-2 px-2 font-semibold">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFirmware === "uefi" && (
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-2">EFI</td>
                        <td className="py-2 px-2">/boot/efi</td>
                        <td className="text-right py-2 px-2">{partitions.efi.toFixed(2)}</td>
                        <td className="text-right py-2 px-2">
                          {((partitions.efi / partitions.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 px-2">Boot</td>
                      <td className="py-2 px-2">/boot</td>
                      <td className="text-right py-2 px-2">{partitions.boot.toFixed(2)}</td>
                      <td className="text-right py-2 px-2">
                        {((partitions.boot / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 px-2">Raiz</td>
                      <td className="py-2 px-2">/</td>
                      <td className="text-right py-2 px-2">{partitions.root.toFixed(2)}</td>
                      <td className="text-right py-2 px-2">
                        {((partitions.root / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    {partitions.swap > 0 && (
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-2">Swap</td>
                        <td className="py-2 px-2">swap</td>
                        <td className="text-right py-2 px-2">{partitions.swap.toFixed(2)}</td>
                        <td className="text-right py-2 px-2">
                          {((partitions.swap / partitions.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2 px-2 font-semibold">Home</td>
                      <td className="py-2 px-2 font-semibold">/home</td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {partitions.home.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {((partitions.home / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold">
                  Total do disco: {partitions.total.toFixed(2)} GB
                </p>
                <p className="text-sm text-muted-foreground">
                  Espaço para dados (/home): {partitions.home.toFixed(2)} GB (
                  {((partitions.home / partitions.total) * 100).toFixed(1)}%)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <SettingsPanel
            hostname={hostname}
            setHostname={setHostname}
            timezone={timezone}
            setTimezone={setTimezone}
          />

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Exportação</CardTitle>
              <CardDescription>
                Baixe a configuração em diferentes formatos para auto-instalação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kickstart XML */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base">Kickstart XML</CardTitle>
                    <CardDescription className="text-xs">
                      Para Fedora, CentOS, RHEL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Arquivo de configuração para instalação automatizada
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyXML}
                        className="flex-1 gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDownloadXML}
                        className="flex-1 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Boot Script */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base">Script de Boot</CardTitle>
                    <CardDescription className="text-xs">
                      Para particionamento manual
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Script bash para criar partições automaticamente
                    </p>
                    <Button
                      size="sm"
                      onClick={handleDownloadScript}
                      className="w-full gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Script
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Partitioning Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                Particionamento Avançado
              </CardTitle>
              <CardDescription>
                Customize o tamanho de cada partição e adicione pontos de montagem opcionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {advancedConfig ? (
                <AdvancedPartitionEditor
                  config={advancedConfig}
                  onUpdate={setAdvancedConfig}
                  diskSizeGB={diskSize}
                />
              ) : (
                <p className="text-muted-foreground">Carregando configuração avançada...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <ValidationPanel
            validation={validatePartitionConfiguration(
              partitions,
              selectedDistro,
              systemPercentage
            )}
            growthProjection={calculateSpaceGrowthProjection(
              partitions,
              selectedDistro
            )}
          />
        </TabsContent>

        {/* Partclone Backup Tab */}
        <TabsContent value="partclone" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerador de Script Partclone</CardTitle>
              <CardDescription>
                Crie scripts para backup e restore de particoes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto font-mono text-xs">
                <pre className="whitespace-pre-wrap break-words">
                  {generatePartcloneScript(partitions, hostname)}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generatePartcloneScript(partitions, hostname)
                    );
                    toast.success("Script copiado para a area de transferencia!");
                  }}
                  className="flex-1 gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
                <Button
                  onClick={() => {
                    const element = document.createElement("a");
                    element.setAttribute(
                      "href",
                      "data:text/plain;charset=utf-8," +
                        encodeURIComponent(
                          generatePartcloneScript(partitions, hostname)
                        )
                    );
                    element.setAttribute(
                      "download",
                      `partclone-backup-${hostname}.sh`
                    );
                    element.style.display = "none";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    toast.success("Script baixado com sucesso!");
                  }}
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <ReviewSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
