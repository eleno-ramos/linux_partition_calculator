import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ExportSettingsProps {
  username?: string;
  password?: string;
  confirmPassword?: string;
  onUsernameChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
}

function calculatePasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strength = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

  if (strength === 4 && password.length >= 12) return "strong";
  if (strength >= 3 || (strength >= 2 && password.length >= 10)) return "medium";
  return "weak";
}

export default function ExportSettings({
  username = "",
  password = "",
  confirmPassword = "",
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: ExportSettingsProps) {
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const passwordStrength = calculatePasswordStrength(password);

  return (
    <div className="space-y-6">
      {/* Seção de Usuário e Senha para Exportação */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            👤 Usuário e Autenticação
          </CardTitle>
          <CardDescription>Configure as credenciais de acesso ao sistema para os scripts exportados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="export-username" className="font-medium">
              Nome de Usuário
            </Label>
            <Input
              id="export-username"
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
            <Label htmlFor="export-password" className="font-medium">
              Senha
            </Label>
            <Input
              id="export-password"
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
            <Label htmlFor="export-confirmPassword" className="font-medium">
              Confirmar Senha
            </Label>
            <Input
              id="export-confirmPassword"
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

          {/* Info Box */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              💡 Estas credenciais serão incluídas automaticamente nos scripts Kickstart e Preseed que você exportar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
