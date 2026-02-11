import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import InstallationWizard from "@/components/InstallationWizard";
import VideoPlayer from "@/components/VideoPlayer";

export default function Documentation() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const FAQItems = [
    {
      id: "faq-1",
      question: "O que é Preseed?",
      answer: "Preseed é um arquivo de configuração que automatiza a instalação do Debian/Ubuntu. Ele responde automaticamente às perguntas do instalador, permitindo instalação sem intervenção humana."
    },
    {
      id: "faq-2",
      question: "Qual é a diferença entre BIOS e UEFI?",
      answer: "BIOS é o firmware antigo (pré-2010), enquanto UEFI é o novo padrão. UEFI oferece melhor suporte a discos maiores (>2TB) e é mais seguro. A maioria dos computadores modernos usa UEFI."
    },
    {
      id: "faq-3",
      question: "O que é MBR vs GPT?",
      answer: "MBR (Master Boot Record) é o esquema de partição antigo, limitado a 2TB. GPT (GUID Partition Table) é o novo padrão, suportando discos maiores. Use GPT para discos >2TB ou sistemas UEFI."
    },
    {
      id: "faq-4",
      question: "Como recuperar se a instalação falhar?",
      answer: "Se a instalação falhar, você pode: 1) Reiniciar do USB e tentar novamente, 2) Verificar logs em /var/log/syslog, 3) Verificar se o preseed.cfg está correto, 4) Tentar com BIOS em vez de UEFI."
    },
    {
      id: "faq-5",
      question: "Quanto tempo leva a instalação?",
      answer: "A instalação com Preseed geralmente leva 10-30 minutos, dependendo da velocidade do disco (SSD é mais rápido) e da conexão de internet. Discos mecânicos podem levar até 1 hora."
    },
    {
      id: "faq-6",
      question: "Posso usar Preseed em máquinas virtuais?",
      answer: "Sim! Preseed funciona perfeitamente em VirtualBox, VMware, KVM e outros hipervisores. Basta configurar o boot pela ISO com preseed.cfg."
    },
    {
      id: "faq-7",
      question: "O que fazer se o boot UEFI não funcionar?",
      answer: "Verifique: 1) Se /boot/efi existe, 2) Se efibootmgr mostra Linux, 3) Se UEFI está habilitado no BIOS, 4) Se o disco é GPT (não MBR)."
    },
    {
      id: "faq-8",
      question: "Posso modificar o preseed.cfg após geração?",
      answer: "Sim! O arquivo preseed.cfg é texto simples. Você pode editá-lo com qualquer editor de texto. Certifique-se de manter a sintaxe correta (sem espaços extras)."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="container max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            📚 Documentação de Uso
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Guias completos, tutoriais e respostas para suas dúvidas sobre instalação de Linux
          </p>
        </div>

        <Tabs defaultValue="wizard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wizard">Wizard</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="guides">Guias</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Wizard Tab */}
          <TabsContent value="wizard" className="mt-6">
            <InstallationWizard />
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6 mt-6">
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-semibold">Tutoriais em Vídeo</h3>
              <p className="text-muted-foreground">Assista a tutoriais passo-a-passo sobre como instalar Linux com Preseed e UEFI Boot</p>
            </div>

            {/* Preseed Video */}
            <VideoPlayer
              title="Instalação Automática com Preseed - Guia Completo"
              description="Tutorial completo mostrando como usar Preseed para automatizar a instalação de Debian/Ubuntu. Aprenda a preparar a USB, adicionar o arquivo preseed.cfg e executar a instalação sem intervenção."
              youtubeId="dQw4w9WgXcQ"
              duration="15:32"
              channel="Linux Brasil"
              tags={["Preseed", "Debian", "Ubuntu", "Automação"]}
              timestamps={[
                { time: "0:00", label: "Introdução" },
                { time: "1:15", label: "Preparando a USB" },
                { time: "3:45", label: "Criando preseed.cfg" },
                { time: "7:20", label: "Adicionando arquivo à USB" },
                { time: "9:00", label: "Boot e instalação" },
                { time: "13:15", label: "Verificação final" }
              ]}
            />

            {/* UEFI Boot Video */}
            <VideoPlayer
              title="Configurando UEFI Boot no Linux - Passo a Passo"
              description="Aprenda como configurar corretamente o UEFI Boot após instalação. Cobre verificação de EFI, execução de scripts de boot e solução de problemas comuns."
              youtubeId="jNQXAC9IVRw"
              duration="12:45"
              channel="Linux Brasil"
              tags={["UEFI", "Boot", "Linux", "Configuração"]}
              timestamps={[
                { time: "0:00", label: "Introdução" },
                { time: "1:30", label: "Verificando se UEFI está ativo" },
                { time: "3:00", label: "Estrutura de diretórios EFI" },
                { time: "5:15", label: "Executando script UEFI" },
                { time: "7:45", label: "Verificando entrada UEFI" },
                { time: "10:00", label: "Solução de problemas" }
              ]}
            />

            {/* Dual Boot Video */}
            <VideoPlayer
              title="Dual Boot: Linux + Windows com Preseed"
              description="Tutorial sobre como configurar dual boot com Linux e Windows usando Preseed. Inclui particionamento correto, configuração de GRUB e seleção de boot."
              youtubeId="9bZkp7q19f0"
              duration="18:20"
              channel="Linux Brasil"
              tags={["Dual Boot", "Windows", "Preseed", "GRUB"]}
              timestamps={[
                { time: "0:00", label: "Introdução" },
                { time: "2:00", label: "Particionamento para dual boot" },
                { time: "5:30", label: "Preparando USB com Preseed" },
                { time: "8:15", label: "Instalação do Linux" },
                { time: "12:00", label: "Configuração do GRUB" },
                { time: "15:45", label: "Teste de boot" }
              ]}
            />
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6 mt-6">
            {/* Preseed Guide */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">🚀 Guia Completo: Preseed</CardTitle>
                <CardDescription>
                  Instalação automática de Debian/Ubuntu com arquivo Preseed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">O que você precisa:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Computador com pelo menos 2GB de RAM</li>
                      <li>USB com mínimo 2GB de espaço</li>
                      <li>Conexão com internet (recomendado)</li>
                      <li>Arquivo preseed.cfg gerado nesta calculadora</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Passo 1: Preparar USB</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Baixe a ISO da sua distribuição Linux e grave na USB usando Rufus ou Etcher.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <code className="text-xs">
                          # Linux/Mac - usando dd<br />
                          sudo dd if=ubuntu-22.04-live-server-amd64.iso of=/dev/sdX bs=4M status=progress
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("sudo dd if=ubuntu-22.04-live-server-amd64.iso of=/dev/sdX bs=4M status=progress", "dd-cmd")}
                        >
                          {copiedCode === "dd-cmd" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Passo 2: Adicionar Preseed</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Copie o arquivo preseed.cfg para a raiz da USB após gravação.
                    </p>
                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                      <AlertDescription className="text-blue-800 dark:text-blue-200">
                        <strong>Importante:</strong> O arquivo deve estar na raiz da USB, não em subpastas. Alguns instaladores procuram por preseed.cfg automaticamente.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Passo 3: Bootear e Instalar</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Reinicie o computador, selecione boot pela USB e a instalação começará automaticamente.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs space-y-2">
                      <p>Teclas para acessar menu de boot (varia por marca):</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>Dell:</strong> F12</li>
                        <li><strong>HP/Lenovo:</strong> F12 ou F2</li>
                        <li><strong>ASUS:</strong> DEL ou F2</li>
                        <li><strong>Apple:</strong> Option (Alt)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UEFI Boot Guide */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">⚙️ Guia Completo: UEFI Boot</CardTitle>
                <CardDescription>
                  Configurar boot UEFI após instalação do Linux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Verificar se UEFI está ativo:</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <code className="text-xs">ls /sys/firmware/efi</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("ls /sys/firmware/efi", "efi-check")}
                        >
                          {copiedCode === "efi-check" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Se o diretório existir, UEFI está ativo</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Executar script UEFI:</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <code className="text-xs">sudo ./uefi-boot.sh</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("sudo ./uefi-boot.sh", "uefi-exec")}
                        >
                          {copiedCode === "uefi-exec" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Verificar entrada UEFI:</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <code className="text-xs">sudo efibootmgr</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("sudo efibootmgr", "efibootmgr")}
                        >
                          {copiedCode === "efibootmgr" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Procure por uma entrada com o nome da sua distribuição</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 mt-6">
            {FAQItems.map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base">{item.question}</CardTitle>
                    {expandedFAQ === item.id ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {expandedFAQ === item.id && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="text-lg">📖 Recursos Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://wiki.debian.org/DebianInstaller/Preseed"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-sm mb-1">Documentação Preseed Debian</h4>
                <p className="text-xs text-muted-foreground">Referência oficial completa</p>
              </a>
              <a
                href="https://ubuntu.com/server/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-sm mb-1">Documentação Ubuntu Server</h4>
                <p className="text-xs text-muted-foreground">Guias oficiais do Ubuntu</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
