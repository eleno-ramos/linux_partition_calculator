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
  username?: string;
  password?: string;
  confirmPassword?: string;
  optionalPartitions?: OptionalPartition[];
  onUsernameChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
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
  username = "",
  password = "",
  confirmPassword = "",
  optionalPartitions = DEFAULT_OPTIONAL_PARTITIONS,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onPartitionToggle,
}: AdvancedSettingsPanelProps) {
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [expandedPartition, setExpandedPartition] = useState<string | null>(null);
  const [showDecisionGuide, setShowDecisionGuide] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const passwordStrength = calculatePasswordStrength(password);
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
      {/* Seção de Usuário e Senha */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            👤 Usuário e Autenticação
          </CardTitle>
          <CardDescription>Configure as credenciais de acesso ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="font-medium">
              Nome de Usuário
            </Label>
            <Input
              id="username"
              placeholder="ex: usuario"
              value={username}
              onChange={(e) => onUsernameChange?.(e.target.value)}
              className={`bg-slate-50 dark:bg-slate-900 ${
                username && !/^[a-z0-9_-]+$/.test(username) ? "border-red-500" : ""
              }`}
            />
            {username && !/^[a-z0-9_-]+$/.test(username) && (
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠️ Use apenas letras minúsculas, números, hífens e underscores
              </p>
            )}
            {username && /^[a-z0-9_-]+$/.test(username) && (
              <p className="text-xs text-green-600 dark:text-green-400">✓ Nome de usuário válido</p>
            )}
            <p className="text-xs text-muted-foreground">
              Será o nome de login do seu sistema. Use apenas letras minúsculas, números, hífens e underscores.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite uma senha segura"
              value={password}
              onChange={(e) => onPasswordChange?.(e.target.value)}
              onFocus={() => setShowPasswordValidation(true)}
              className="bg-slate-50 dark:bg-slate-900"
            />

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength === "weak"
                          ? "w-1/3 bg-red-500"
                          : passwordStrength === "medium"
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-green-500"
                      }`}
                    />
                  </div>
                  <Badge
                    variant={
                      passwordStrength === "weak"
                        ? "destructive"
                        : passwordStrength === "medium"
                          ? "secondary"
                          : "default"
                    }
                    className="text-xs"
                  >
                    {passwordStrength === "weak"
                      ? "Fraca"
                      : passwordStrength === "medium"
                        ? "Média"
                        : "Forte"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>🔐 Recomendações para senha forte:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1">
                    <li>Mínimo 12 caracteres</li>
                    <li>Pelo menos 1 letra maiúscula (A-Z)</li>
                    <li>Pelo menos 1 letra minúscula (a-z)</li>
                    <li>Pelo menos 1 número (0-9)</li>
                    <li>Pelo menos 1 símbolo (!@#$%^&*)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-medium">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
              className={`bg-slate-50 dark:bg-slate-900 ${
                confirmPassword && !passwordsMatch ? "border-red-500" : ""
              }`}
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-600 dark:text-red-400">As senhas não correspondem</p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-xs text-green-600 dark:text-green-400">✓ Senhas correspondem</p>
            )}
          </div>
        </CardContent>
      </Card>

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
