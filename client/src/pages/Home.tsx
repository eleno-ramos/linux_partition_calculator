import { useAuth } from "@/_core/hooks/useAuth";
import { Cpu, HardDrive, Zap, Shield, Download, BookOpen } from "lucide-react";
import PartitionCalculator from "@/components/PartitionCalculator";
import VisitorGlobe from "@/components/VisitorGlobe";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";
import ShareButtons from "@/components/ShareButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <>
      <VisitorGlobe />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Simplified Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
          <div className="container py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Linux Partition Calculator
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Otimize seu particionamento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 md:py-8">
          {/* Hero Features - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                      7 Distribuições
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Ubuntu, Fedora, Debian, Arch, Mint, openSUSE, CentOS
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                    <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                      Auto-Instalação
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      XML/Kickstart prontos para deploy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                      Inteligente
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Recomendações baseadas em hardware
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert - Compact */}
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
              Sempre revise as configurações antes de instalar em produção
            </AlertDescription>
          </Alert>

          {/* Main Calculator */}
          <PartitionCalculator />

          {/* Footer Info - Reorganized */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Sobre Particionamento
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Particionamento adequado garante um sistema Linux estável e eficiente.
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white min-w-16">/boot/efi:</span>
                    <span>512MB para inicialização UEFI</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white min-w-16">/boot:</span>
                    <span>Kernel e arquivos de boot</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white min-w-16">/:</span>
                    <span>Sistema operacional</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white min-w-16">swap:</span>
                    <span>Memória virtual</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white min-w-16">/home:</span>
                    <span>Dados do usuário</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Dicas de Otimização
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</span>
                    <span>Separe /home para facilitar reinstalações</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</span>
                    <span>Use ext4 para máxima compatibilidade</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</span>
                    <span>Ative hibernação se necessário</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</span>
                    <span>Deixe ~10% de espaço livre</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</span>
                    <span>Considere SSD para melhor performance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reviews and Share Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ReviewsList />
            </div>
            <div className="space-y-4">
              <ReviewForm />
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Compartilhe com Amigos</h3>
                  <ShareButtons title="Linux Partition Calculator" text="Descubra a melhor forma de particionar seu disco para Linux!" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p className="mb-2">
              ❤️ Este serviço é gratuito e mantido com apoio da comunidade
            </p>
            <p className="text-xs">
              Se ajudou, considere fazer uma doação: <span className="font-mono text-slate-900 dark:text-white">eleno.ramos@gmail.com</span>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
