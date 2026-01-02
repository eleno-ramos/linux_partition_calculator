import { Cpu, HardDrive, Info } from "lucide-react";
import PartitionCalculator from "@/components/PartitionCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Linux Partition Calculator
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Otimize o particionamento do seu disco para múltiplas distribuições Linux
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Info Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="w-5 h-5 text-blue-600" />
                Múltiplas Distribuições
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Suporte para Ubuntu, Fedora, Debian, Arch, Linux Mint, openSUSE e CentOS
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HardDrive className="w-5 h-5 text-green-600" />
                Exportação Automática
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Baixe arquivos XML e scripts para auto-instalação
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="w-5 h-5 text-purple-600" />
                Recomendações Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Baseadas em RAM, disco e tipo de processador
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Esta calculadora fornece recomendações baseadas em boas práticas da comunidade Linux.
            Sempre revise as configurações antes de instalar um sistema em produção.
          </AlertDescription>
        </Alert>

        {/* Calculator */}
        <PartitionCalculator />

        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sobre Particionamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                O particionamento adequado é essencial para um sistema Linux estável e eficiente.
                Esta ferramenta ajuda a determinar os tamanhos ideais para suas partições.
              </p>
              <div className="space-y-2 text-xs">
                <p>
                  <span className="font-semibold text-foreground">/boot/efi:</span> Partição de
                  inicialização UEFI (512MB)
                </p>
                <p>
                  <span className="font-semibold text-foreground">/boot:</span> Kernel e arquivos
                  de inicialização
                </p>
                <p>
                  <span className="font-semibold text-foreground">/:</span> Sistema operacional e
                  programas
                </p>
                <p>
                  <span className="font-semibold text-foreground">swap:</span> Memória virtual para
                  hibernação
                </p>
                <p>
                  <span className="font-semibold text-foreground">/home:</span> Dados pessoais do
                  usuário
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dicas de Otimização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2 text-xs">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Separe /home para facilitar reinstalações</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Use ext4 para máxima compatibilidade</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Ative hibernação se precisar suspender para disco</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Deixe espaço livre (~10%) para performance</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Considere SSD para melhor desempenho</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            Linux Partition Calculator • Ferramenta educacional para otimização de partições
          </p>
          <p className="mt-2 text-xs">
            Baseado em recomendações oficiais de Red Hat, Debian, Fedora e comunidades Linux
          </p>
        </div>
      </footer>
    </div>
  );
}
