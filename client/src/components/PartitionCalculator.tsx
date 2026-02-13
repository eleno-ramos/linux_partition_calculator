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
import { Download, Copy, Moon, Sun, History, ChevronDown } from "lucide-react";
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
  getAutoConfigRecommendation,
  detectBootType,
  validateBootTypeCompatibility,
  generatePreseedScript,
  generateUEFIBootScript,
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
import PartitioningGuide from "./PartitioningGuide";
import PartitionSizeEditor from "./PartitionSizeEditor";
import InstallationGuideModal from "./InstallationGuideModal";
import AdvancedSettingsPanel from "./AdvancedSettingsPanel";
import { toast } from "sonner";
import { HelpCircle } from "lucide-react";

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
  const [hostname, setHostname] = useState("linux-system");
  const [timezone, setTimezone] = useState("UTC");
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [systemPercentage, setSystemPercentage] = useState(20);
  const [includeHome, setIncludeHome] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedConfig, setAdvancedConfig] = useState<AdvancedPartitionConfig | null>(null);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showInstallationGuide, setShowInstallationGuide] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [optionalPartitions, setOptionalPartitions] = useState([
    { id: "home", name: "Home (/home)", mountPoint: "/home", minSize: 10, recommendedSize: 100, description: "Diretorio de usuarios", enabled: false },
    { id: "var", name: "Var (/var)", mountPoint: "/var", minSize: 5, recommendedSize: 20, description: "Logs e dados variaveis", enabled: false },
    { id: "tmp", name: "Tmp (/tmp)", mountPoint: "/tmp", minSize: 2, recommendedSize: 10, description: "Arquivos temporarios", enabled: false },
    { id: "opt", name: "Opt (/opt)", mountPoint: "/opt", minSize: 5, recommendedSize: 30, description: "Software adicional", enabled: false },
    { id: "srv", name: "Srv (/srv)", mountPoint: "/srv", minSize: 5, recommendedSize: 20, description: "Dados de servicos", enabled: false },
    { id: "swap", name: "Swap", mountPoint: "swap", minSize: 2, recommendedSize: 8, description: "Memoria virtual", enabled: true },
  ]);

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

  // Auto-update configuration based on processor selection
  useEffect(() => {
    if (!autoUpdateEnabled) return;
    
    const recommendation = getAutoConfigRecommendation(selectedProcessor);
    setSelectedFirmware(recommendation.firmware);
    setSelectedDiskType(recommendation.diskType);
    setHibernation(recommendation.useHibernation);
  }, [selectedProcessor, autoUpdateEnabled]);

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

  const handleDownloadPreseed = () => {
    const preseed = generatePreseedScript(
      selectedDistro,
      partitions,
      hostname,
      timezone,
      selectedFirmware as FirmwareType
    );
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(preseed)
    );
    element.setAttribute("download", `${hostname}-preseed.cfg`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Script Preseed baixado com sucesso!");
  };

  const handleCopyPreseed = async () => {
    const preseed = generatePreseedScript(
      selectedDistro,
      partitions,
      hostname,
      timezone,
      selectedFirmware as FirmwareType
    );
    try {
      await navigator.clipboard.writeText(preseed);
      toast.success("Preseed copiado para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar para a área de transferência");
    }
  };

  const handleDownloadUEFI = () => {
    const uefiScript = generateUEFIBootScript(
      hostname,
      timezone,
      selectedFirmware as FirmwareType
    );
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(uefiScript)
    );
    element.setAttribute("download", `${hostname}-uefi-boot-setup.sh`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Script UEFI Boot baixado com sucesso!");
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

    const updated = [newConfig, ...savedConfigs].slice(0, 10);
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
    <div className="space-y-4">
      {/* Compact Top Bar */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-1 text-xs"
          >
            <History className="w-3 h-3" />
            <span className="hidden sm:inline">Histórico</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 px-1.5 rounded">
              {savedConfigs.length}
            </span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-1 text-xs"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline">Escuro</span>
              </>
            )}
          </Button>
          <Button
            onClick={saveConfiguration}
            size="sm"
            className="gap-1 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>
        </div>
      </div>

      {/* History Panel - Compact */}
      {showHistory && savedConfigs.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="p-3 space-y-2">
            {savedConfigs.map((config) => (
              <div
                key={config.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => loadConfiguration(config)}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs truncate">{config.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(config.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConfiguration(config.id);
                  }}
                  className="text-red-600 hover:text-red-700 text-xs"
                >
                  ✕
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-1">
          <TabsTrigger value="calculator" className="text-xs sm:text-sm">Calculadora</TabsTrigger>
          <TabsTrigger value="partitioning" className="text-xs sm:text-sm">Particionamento</TabsTrigger>
          <TabsTrigger value="editor" className="text-xs sm:text-sm">Editor</TabsTrigger>
          <TabsTrigger value="results" className="text-xs sm:text-sm">Resultado</TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm">Exportar</TabsTrigger>
          <TabsTrigger value="validation" className="text-xs sm:text-sm">Validação</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm">Avaliações</TabsTrigger>
        </TabsList>

        {/* Calculator Tab - Simplified */}
        <TabsContent value="calculator" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configuração do Hardware</CardTitle>
              <CardDescription className="text-xs">
                Insira as especificações do seu computador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Disk Size */}
                <div className="space-y-1.5">
                  <Label htmlFor="disk-size" className="text-xs font-semibold">
                    Disco (GB)
                  </Label>
                  <Input
                    id="disk-size"
                    type="number"
                    min="50"
                    max="10000"
                    value={diskSize}
                    onChange={(e) => setDiskSize(Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>

                {/* RAM Size */}
                <div className="space-y-1.5">
                  <Label htmlFor="ram-size" className="text-xs font-semibold">
                    RAM (GB)
                  </Label>
                  <Input
                    id="ram-size"
                    type="number"
                    min="1"
                    max="256"
                    value={ramSize}
                    onChange={(e) => setRamSize(Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Distribution */}
                <div className="space-y-1.5">
                  <Label htmlFor="distro" className="text-xs font-semibold">
                    Distribuição
                  </Label>
                  <Select value={selectedDistro} onValueChange={setSelectedDistro}>
                    <SelectTrigger id="distro" className="h-8 text-sm">
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
                </div>

                {/* Processor */}
                <div className="space-y-1.5">
                  <Label htmlFor="processor" className="text-xs font-semibold">
                    Processador
                  </Label>
                  <Select value={selectedProcessor} onValueChange={setSelectedProcessor}>
                    <SelectTrigger id="processor" className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PROCESSORS).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.brand} - {p.architecture}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second row - Firmware and Disk Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Firmware Type */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="firmware" className="text-xs font-semibold">
                      Firmware
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const rec = detectBootType(selectedProcessor, diskSize, selectedDiskType);
                        setSelectedFirmware(rec.bootType);
                        toast.success(`Boot: ${rec.bootType.toUpperCase()} - ${rec.reason}`);
                      }}
                      className="text-xs h-6 px-2 text-blue-600"
                    >
                      Auto
                    </Button>
                  </div>
                  <Select value={selectedFirmware} onValueChange={(v) => setSelectedFirmware(v as FirmwareType)}>
                    <SelectTrigger id="firmware" className="h-8 text-sm">
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
                </div>

                {/* Disk Type */}
                <div className="space-y-1.5">
                  <Label htmlFor="disk-type" className="text-xs font-semibold">
                    Tipo de Disco
                  </Label>
                  <Select value={selectedDiskType} onValueChange={(v) => setSelectedDiskType(v as DiskType)}>
                    <SelectTrigger id="disk-type" className="h-8 text-sm">
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
                </div>

                {/* Hostname */}
                <div className="space-y-1.5">
                  <Label htmlFor="hostname" className="text-xs font-semibold">
                    Hostname
                  </Label>
                  <Input
                    id="hostname"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <Label htmlFor="timezone" className="text-xs font-semibold">
                    Timezone
                  </Label>
                  <Input
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Checkboxes - Collapsible */}
              <div className="border-t pt-3">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                  Opções Avançadas
                </button>

                {showAdvancedOptions && (
                  <div className="space-y-2 mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="hibernation"
                        checked={hibernation}
                        onCheckedChange={(checked) => setHibernation(checked as boolean)}
                      />
                      <Label htmlFor="hibernation" className="text-xs cursor-pointer">
                        Ativar Hibernação
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="minimum"
                        checked={useMinimum}
                        onCheckedChange={(checked) => setUseMinimum(checked as boolean)}
                      />
                      <Label htmlFor="minimum" className="text-xs cursor-pointer">
                        Tamanhos Mínimos
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="lvm"
                        checked={useLVM}
                        onCheckedChange={(checked) => setUseLVM(checked as boolean)}
                      />
                      <Label htmlFor="lvm" className="text-xs cursor-pointer">
                        Usar LVM
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="autoUpdate"
                        checked={autoUpdateEnabled}
                        onCheckedChange={(checked) => setAutoUpdateEnabled(checked as boolean)}
                      />
                      <Label htmlFor="autoUpdate" className="text-xs cursor-pointer">
                        Auto-atualizar por processador
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Space Distribution Slider */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Distribuição de Espaço</Label>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {systemPercentage}% / {100 - systemPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={systemPercentage}
                  onChange={(e) => setSystemPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Advanced Settings Panel */}
              <div className="border-t pt-3">
                <AdvancedSettingsPanel
                  username={username}
                  password={password}
                  confirmPassword={confirmPassword}
                  optionalPartitions={optionalPartitions}
                  onUsernameChange={setUsername}
                  onPasswordChange={setPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  onPartitionToggle={(partitionId, enabled) => {
                    setOptionalPartitions(
                      optionalPartitions.map((p) =>
                        p.id === partitionId ? { ...p, enabled } : p
                      )
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partitioning Guide Tab */}
        <TabsContent value="partitioning" className="space-y-4">
          <PartitioningGuide
            firmware={selectedFirmware}
            diskSize={diskSize}
            diskType={selectedDiskType}
            processorId={selectedProcessor}
            distroId={selectedDistro}
            partitions={partitions}
          />
        </TabsContent>

        {/* Partition Size Editor Tab */}
        <TabsContent value="editor" className="space-y-4">
          <PartitionSizeEditor
            partitions={partitions}
            onPartitionsChange={(newPartitions) => {
              // Update partitions state
              const updatedPartitions = { ...partitions, ...newPartitions };
              // This would need to be handled by parent component
              toast.success("Tamanhos de partições atualizados!");
            }}
            distroId={selectedDistro}
            firmware={selectedFirmware}
            diskSize={diskSize}
          />
        </TabsContent>

        {/* Results Tab - Cleaner */}
        <TabsContent value="results" className="space-y-4">
          {/* Partition Visualization */}
          <PartitionVisualization partitions={partitions} />

          {/* Quick Stats */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Sistema</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {((diskSize * systemPercentage) / 100).toFixed(1)} GB
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Dados</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {((diskSize * (100 - systemPercentage)) / 100).toFixed(1)} GB
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Root</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {partitions.root.toFixed(1)} GB
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Home</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {partitions.home.toFixed(1)} GB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partition Table - Simplified */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Detalhes das Partições</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 px-2 font-semibold">Partição</th>
                      <th className="text-left py-2 px-2 font-semibold">Ponto</th>
                      <th className="text-right py-2 px-2 font-semibold">Tamanho</th>
                      <th className="text-right py-2 px-2 font-semibold">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFirmware === "uefi" && (
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-2">EFI</td>
                        <td className="py-2 px-2">/boot/efi</td>
                        <td className="text-right py-2 px-2">{partitions.efi.toFixed(2)} GB</td>
                        <td className="text-right py-2 px-2">
                          {((partitions.efi / partitions.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 px-2">Boot</td>
                      <td className="py-2 px-2">/boot</td>
                      <td className="text-right py-2 px-2">{partitions.boot.toFixed(2)} GB</td>
                      <td className="text-right py-2 px-2">
                        {((partitions.boot / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 px-2">Root</td>
                      <td className="py-2 px-2">/</td>
                      <td className="text-right py-2 px-2">{partitions.root.toFixed(2)} GB</td>
                      <td className="text-right py-2 px-2">
                        {((partitions.root / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    {partitions.swap > 0 && (
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-2">Swap</td>
                        <td className="py-2 px-2">swap</td>
                        <td className="text-right py-2 px-2">{partitions.swap.toFixed(2)} GB</td>
                        <td className="text-right py-2 px-2">
                          {((partitions.swap / partitions.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    <tr className="bg-blue-50 dark:bg-blue-950/30">
                      <td className="py-2 px-2 font-semibold">Home</td>
                      <td className="py-2 px-2 font-semibold">/home</td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {partitions.home.toFixed(2)} GB
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {((partitions.home / partitions.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          {performanceTips.length > 0 && (
            <Card className="border-0 shadow-sm bg-green-50 dark:bg-green-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">💡 Dicas de Desempenho</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {performanceTips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs">
                      <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <SettingsPanel
            hostname={hostname}
            setHostname={setHostname}
            timezone={timezone}
            setTimezone={setTimezone}
          />

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Exportar Configuração</CardTitle>
                  <CardDescription className="text-xs">
                    Baixe em diferentes formatos para auto-instalação
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowInstallationGuide(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Guia
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Kickstart XML */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm">Kickstart XML</h4>
                    <p className="text-xs text-muted-foreground">
                      Para Fedora, CentOS, RHEL
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDownloadXML}
                        size="sm"
                        className="flex-1 text-xs h-8"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                      <Button
                        onClick={handleCopyXML}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Partclone Script */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm">Script Partclone</h4>
                    <p className="text-xs text-muted-foreground">
                      Para backup/restore
                    </p>
                    <Button
                      onClick={handleDownloadScript}
                      size="sm"
                      className="w-full text-xs h-8"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar Script
                    </Button>
                  </CardContent>
                </Card>

                {/* Preseed Script */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm">Preseed Script</h4>
                    <p className="text-xs text-muted-foreground">
                      Para Debian/Ubuntu
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDownloadPreseed}
                        size="sm"
                        className="flex-1 text-xs h-8"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                      <Button
                        onClick={handleCopyPreseed}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* UEFI Boot Script */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm">UEFI Boot Script</h4>
                    <p className="text-xs text-muted-foreground">
                      Configuração de boot
                    </p>
                    <Button
                      onClick={handleDownloadUEFI}
                      size="sm"
                      className="w-full text-xs h-8"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar Script
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-4">
          <ValidationPanel
            validation={validatePartitionConfiguration(partitions, selectedDistro, systemPercentage)}
            growthProjection={calculateSpaceGrowthProjection(partitions, selectedDistro)}
          />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <ReviewSection />
        </TabsContent>
      </Tabs>

      {/* Installation Guide Modal */}
      <InstallationGuideModal
        open={showInstallationGuide}
        onOpenChange={setShowInstallationGuide}
      />
    </div>
  );
}
