import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface OptionalPartition {
  id: string;
  name: string;
  mountPoint: string;
  minSize: number;
  recommendedSize: number;
  description: string;
  enabled: boolean;
}

interface AdvancedSettingsPanelProps {
  optionalPartitions?: OptionalPartition[];
  onPartitionToggle?: (partitionId: string, enabled: boolean) => void;
}

const DEFAULT_OPTIONAL_PARTITIONS: OptionalPartition[] = [
  {
    id: "home",
    name: "Home (/home)",
    mountPoint: "/home",
    minSize: 10,
    recommendedSize: 100,
    description: "Diretório de usuários. Recomendado para separar dados do sistema.",
    enabled: false,
  },
  {
    id: "var",
    name: "Var (/var)",
    mountPoint: "/var",
    minSize: 5,
    recommendedSize: 20,
    description: "Logs, cache e dados variáveis. Útil para evitar que logs preencham o disco raiz.",
    enabled: false,
  },
  {
    id: "tmp",
    name: "Tmp (/tmp)",
    mountPoint: "/tmp",
    minSize: 2,
    recommendedSize: 10,
    description: "Arquivos temporários. Isolado para melhor gerenciamento de espaço.",
    enabled: false,
  },
  {
    id: "opt",
    name: "Opt (/opt)",
    mountPoint: "/opt",
    minSize: 5,
    recommendedSize: 30,
    description: "Software adicional. Para aplicações instaladas manualmente.",
    enabled: false,
  },
  {
    id: "srv",
    name: "Srv (/srv)",
    mountPoint: "/srv",
    minSize: 5,
    recommendedSize: 20,
    description: "Dados de serviços. Para servidores web, FTP, etc.",
    enabled: false,
  },
  {
    id: "swap",
    name: "Swap",
    mountPoint: "swap",
    minSize: 2,
    recommendedSize: 8,
    description: "Memória virtual. Recomendado ter pelo menos 2GB para sistemas com pouca RAM.",
    enabled: true,
  },
];

export default function AdvancedSettingsPanel({
  optionalPartitions = DEFAULT_OPTIONAL_PARTITIONS,
  onPartitionToggle,
}: AdvancedSettingsPanelProps) {
  const [expandedPartition, setExpandedPartition] = useState<string | null>(null);
  const [showDecisionGuide, setShowDecisionGuide] = useState(false);

  const totalPartitionSize = optionalPartitions
    .filter((p) => p.enabled)
    .reduce((sum, p) => sum + p.recommendedSize, 0);
  
  const totalDiskSpace = 500;
  const systemPartitionSize = 50;
  const availableForOptional = totalDiskSpace - systemPartitionSize;
  const hasSpaceConflict = totalPartitionSize > availableForOptional;
  const spaceWarningMessage = hasSpaceConflict 
    ? `Espaco insuficiente! Particoes opcionais (${totalPartitionSize}GB) excedem o disponivel (${availableForOptional}GB)`
    : `Espaco disponivel: ${availableForOptional - totalPartitionSize}GB`;

  return (
    <div className="space-y-6">
      {/* Seção de Partições Opcionais */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">💾 Partições Opcionais</CardTitle>
              <Dialog open={showDecisionGuide} onOpenChange={setShowDecisionGuide}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      Guia Interativo: Escolhendo Partições
                    </DialogTitle>
                    <DialogDescription>
                      Dicas para ajudá-lo a escolher as partições ideais para seu sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">📌 Recomendação Geral</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Para a maioria dos usuários, recomendamos ativar <strong>Home</strong> (para separar dados
                        pessoais) e <strong>Swap</strong> (memória virtual).
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">🎯 Cenários Específicos:</h4>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="font-medium text-sm mb-1">👤 Usuário Doméstico</p>
                        <p className="text-xs text-muted-foreground">
                          Ative: Home, Swap. Mantenha simples para facilitar manutenção.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="font-medium text-sm mb-1">🖥️ Servidor Web</p>
                        <p className="text-xs text-muted-foreground">
                          Ative: Home, Var, Srv, Swap. Isso protege logs e dados de serviços.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="font-medium text-sm mb-1">💻 Desenvolvedor</p>
                        <p className="text-xs text-muted-foreground">
                          Ative: Home, Opt, Tmp, Swap. Útil para instalar ferramentas e gerenciar arquivos temporários.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="font-medium text-sm mb-1">⚡ Performance Máxima</p>
                        <p className="text-xs text-muted-foreground">
                          Ative apenas Swap. Menos partições = menos overhead, mas menos proteção.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">⚠️ Importante</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Partições separadas oferecem melhor proteção (um disco cheio não afeta outros), mas ocupam mais
                        espaço em disco. Escolha baseado em suas necessidades.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Badge variant="secondary" className="text-xs">
              {optionalPartitions.filter((p) => p.enabled).length} ativa(s)
            </Badge>
          </div>
          <CardDescription>Ative partições adicionais conforme necessário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {optionalPartitions.map((partition) => (
            <div key={partition.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setExpandedPartition(expandedPartition === partition.id ? null : partition.id)}>
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={partition.enabled}
                    onCheckedChange={(checked) => onPartitionToggle?.(partition.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{partition.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {partition.minSize}GB min / {partition.recommendedSize}GB recomendado
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {partition.enabled && (
                    <Badge variant="outline" className="text-xs">
                      Ativa
                    </Badge>
                  )}
                  {expandedPartition === partition.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedPartition === partition.id && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{partition.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-muted-foreground">Ponto de Montagem</p>
                      <p className="font-mono font-semibold">{partition.mountPoint}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-muted-foreground">Tamanho Recomendado</p>
                      <p className="font-mono font-semibold">{partition.recommendedSize}GB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Resumo de Espaco com Validacao */}
          <div className={`p-3 rounded-lg border ${
            hasSpaceConflict
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
              : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
          }`}>
            <p className={`text-xs font-medium ${
              hasSpaceConflict
                ? 'text-red-700 dark:text-red-400'
                : 'text-blue-700 dark:text-blue-400'
            }`}>
              {hasSpaceConflict ? 'Aviso: ' : 'Info: '}
              Espaco total das particoes ativas: <span className="font-bold">{totalPartitionSize}GB</span>
            </p>
            <p className={`text-xs mt-1 ${
              hasSpaceConflict
                ? 'text-red-600 dark:text-red-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {spaceWarningMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculatePasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strength = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

  // Requer todos os 4 criterios E minimo 12 caracteres para ser forte
  if (strength === 4 && password.length >= 12) return "strong";
  if (strength >= 3 || (strength >= 2 && password.length >= 10)) return "medium";
  return "weak";
}
