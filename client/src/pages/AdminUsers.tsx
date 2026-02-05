import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Shield, Trash2, Edit, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastSignedIn: string;
}

interface AuditEntry {
  id: number;
  action: string;
  targetUserName: string;
  targetUserEmail: string;
  oldRole: string;
  newRole: string;
  reason: string;
  status: "success" | "failed";
  createdAt: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<"user" | "admin">("admin");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em produção, viria do tRPC
  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: "Eleno Ramos",
        email: "eleno.ramos@gmail.com",
        role: "admin",
        createdAt: "2024-01-15",
        lastSignedIn: "2026-02-05",
      },
      {
        id: 2,
        name: "João Silva",
        email: "joao@example.com",
        role: "user",
        createdAt: "2024-02-20",
        lastSignedIn: "2026-02-04",
      },
      {
        id: 3,
        name: "Maria Santos",
        email: "maria@example.com",
        role: "user",
        createdAt: "2024-03-10",
        lastSignedIn: "2026-02-03",
      },
      {
        id: 4,
        name: "Carlos Oliveira",
        email: "carlos@example.com",
        role: "admin",
        createdAt: "2024-04-05",
        lastSignedIn: "2026-02-05",
      },
    ]);

    setAuditLog([
      {
        id: 1,
        action: "promote",
        targetUserName: "Carlos Oliveira",
        targetUserEmail: "carlos@example.com",
        oldRole: "user",
        newRole: "admin",
        reason: "Colaborador confiável da comunidade",
        status: "success",
        createdAt: "2026-02-01 14:30:00",
      },
      {
        id: 2,
        action: "demote",
        targetUserName: "Pedro Costa",
        targetUserEmail: "pedro@example.com",
        oldRole: "admin",
        newRole: "user",
        reason: "Inatividade por 6 meses",
        status: "success",
        createdAt: "2026-01-28 10:15:00",
      },
      {
        id: 3,
        action: "promote",
        targetUserName: "Ana Silva",
        targetUserEmail: "ana@example.com",
        oldRole: "user",
        newRole: "admin",
        reason: "Contribuições significativas ao projeto",
        status: "success",
        createdAt: "2026-01-20 16:45:00",
      },
    ]);
  }, []);

  const handlePromoteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      // Simular chamada tRPC
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Atualizar usuário
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );

      // Adicionar ao log de auditoria
      const newAuditEntry: AuditEntry = {
        id: auditLog.length + 1,
        action: newRole === "admin" ? "promote" : "demote",
        targetUserName: selectedUser.name,
        targetUserEmail: selectedUser.email,
        oldRole: selectedUser.role,
        newRole: newRole,
        reason: reason,
        status: "success",
        createdAt: new Date().toLocaleString(),
      };

      setAuditLog([newAuditEntry, ...auditLog]);

      toast.success(
        `${selectedUser.name} foi ${newRole === "admin" ? "promovido" : "rebaixado"} com sucesso!`
      );

      setIsPromoteDialogOpen(false);
      setSelectedUser(null);
      setNewRole("admin");
      setReason("");
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar usuários.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Promova ou rebaixe administradores e visualize o log de auditoria
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usuários */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Usuários do Sistema</CardTitle>
                <CardDescription>
                  Total de {users.length} usuários registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {u.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {u.email}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          Registrado em {u.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          {u.role === "admin" ? (
                            <Shield className="w-3 h-3" />
                          ) : null}
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                        {u.id !== user?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role === "admin" ? "user" : "admin");
                              setIsPromoteDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total de Usuários
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {users.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Administradores
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {users.filter((u) => u.role === "admin").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Usuários Comuns
                  </p>
                  <p className="text-3xl font-bold text-slate-600">
                    {users.filter((u) => u.role === "user").length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {auditLog.length} ações registradas
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  Última ação: {auditLog[0]?.createdAt || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Log de Auditoria */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Log de Auditoria</CardTitle>
            <CardDescription>
              Histórico de todas as mudanças de permissões de usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLog.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="mt-1">
                    {entry.status === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {entry.targetUserName}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {entry.action === "promote" ? "Promoção" : "Rebaixamento"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {entry.targetUserEmail}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{entry.oldRole}</Badge>
                      <span className="text-slate-500">→</span>
                      <Badge variant="default">{entry.newRole}</Badge>
                    </div>
                    {entry.reason && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <strong>Motivo:</strong> {entry.reason}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      {entry.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Promoção/Rebaixamento */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newRole === "admin" ? "Promover" : "Rebaixar"} Usuário
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Função Atual</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {selectedUser?.role === "admin" ? "Administrador" : "Usuário"}
              </p>
            </div>

            <div>
              <Label htmlFor="new-role">Nova Função</Label>
              <Select
                value={newRole}
                onValueChange={(value) =>
                  setNewRole(value as "user" | "admin")
                }
              >
                <SelectTrigger id="new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Motivo (Opcional)</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo desta mudança..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsPromoteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePromoteUser}
                disabled={isLoading}
                className={
                  newRole === "admin"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {isLoading ? "Processando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
