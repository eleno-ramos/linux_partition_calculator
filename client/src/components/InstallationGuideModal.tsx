"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Zap,
  Download,
  Terminal,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InstallationGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstallationGuideModal({
  open,
  onOpenChange,
}: InstallationGuideModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  const preseedSteps = [
    {
      title: "1. Preparar Mídia USB",
      description: "Criar USB bootável com o ISO do Linux",
      details: [
        "Baixe o ISO da distribuição Linux (Ubuntu, Debian, Fedora, etc)",
        "Use ferramentas como Etcher, Ventoy ou dd para criar USB bootável",
        "Copie o arquivo preseed.cfg para a raiz da USB ou para /preseed/",
        "Certifique-se de que a USB tem pelo menos 4GB de espaço",
      ],
    },
    {
      title: "2. Iniciar Instalação com Preseed",
      description: "Usar o arquivo preseed durante a instalação",
      details: [
        "Reinicie o computador e faça boot pela USB",
        "Na tela GRUB, pressione 'e' para editar a linha de boot",
        "Adicione ao final: preseed/file=/preseed.cfg",
        "Pressione Ctrl+X para iniciar com o arquivo preseed",
        "Exemplo: linux /boot/linux preseed/file=/preseed.cfg",
      ],
    },
    {
      title: "3. Instalação Automática",
      description: "O Preseed automatiza todas as respostas",
      details: [
        "O instalador lerá o arquivo preseed.cfg automaticamente",
        "Todas as perguntas serão respondidas conforme configurado",
        "Particionamento será feito automaticamente",
        "Pacotes serão instalados sem intervenção",
        "Processo leva 15-30 minutos dependendo do hardware",
      ],
    },
    {
      title: "4. Pós-Instalação",
      description: "Verificar e ajustar configurações",
      details: [
        "Sistema reinicia automaticamente ao final da instalação",
        "Faça login com as credenciais configuradas no preseed",
        "Verifique se todas as partições foram criadas corretamente",
        "Teste conectividade de rede e acesso à internet",
        "Instale atualizações: sudo apt update && sudo apt upgrade",
      ],
    },
  ];

  const uefiSteps = [
    {
      title: "1. Após Instalação do Linux",
      description: "Executar script UEFI Boot após instalar o sistema",
      details: [
        "Instale o Linux normalmente (com ou sem Preseed)",
        "Após a instalação, faça login no sistema",
        "Abra um terminal (Ctrl+Alt+T)",
        "Baixe o script UEFI Boot gerado pela calculadora",
        "Salve o arquivo em um local acessível (ex: ~/uefi-boot-setup.sh)",
      ],
    },
    {
      title: "2. Preparar Ambiente",
      description: "Configurar permissões e dependências",
      details: [
        "Abra um terminal com privilégios de root: sudo -i",
        "Navegue até o diretório do script: cd ~/",
        "Dê permissão de execução: chmod +x uefi-boot-setup.sh",
        "Verifique se você tem acesso a /boot/efi",
        "Faça backup do EFI atual: sudo cp -r /boot/efi /boot/efi.backup",
      ],
    },
    {
      title: "3. Executar Script UEFI",
      description: "Aplicar configurações de boot UEFI",
      details: [
        "Execute o script: sudo ./uefi-boot-setup.sh",
        "O script irá:",
        "  • Verificar se o firmware é UEFI",
        "  • Configurar variáveis UEFI",
        "  • Instalar bootloader GRUB para UEFI",
        "  • Criar entrada de boot no firmware",
        "Processo leva 2-5 minutos",
      ],
    },
    {
      title: "4. Verificar Configuração",
      description: "Validar se UEFI Boot foi configurado corretamente",
      details: [
        "Verifique o status do UEFI: efibootmgr",
        "Confirme que a entrada de boot foi criada",
        "Reinicie o computador: sudo reboot",
        "Verifique se o sistema inicia corretamente",
        "Acesse BIOS/UEFI (Del, F2, F10, etc) para confirmar ordem de boot",
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Guia de Instalação - Preseed & UEFI Boot
          </DialogTitle>
          <DialogDescription>
            Passo-a-passo completo para usar os scripts durante a instalação do Linux
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preseed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preseed" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Preseed
            </TabsTrigger>
            <TabsTrigger value="uefi" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              UEFI Boot
            </TabsTrigger>
          </TabsList>

          {/* Preseed Tab */}
          <TabsContent value="preseed" className="space-y-4 mt-4">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                O Preseed automatiza completamente a instalação do Linux. Ideal para instalações em
                massa ou quando você quer evitar intervenção manual.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {preseedSteps.map((step, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    activeStep === index
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-base">{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                      {activeStep === index && (
                        <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                      )}
                    </div>
                  </CardHeader>

                  {activeStep === index && (
                    <CardContent className="space-y-3 border-t pt-3">
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">{detail}</p>
                          </div>
                        ))}
                      </div>

                      {index === 1 && (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                          <div>linux /boot/linux preseed/file=/preseed.cfg</div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Após a instalação, o sistema estará completamente configurado e pronto para uso!
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* UEFI Boot Tab */}
          <TabsContent value="uefi" className="space-y-4 mt-4">
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                Execute este script APÓS instalar o Linux para configurar corretamente o boot UEFI.
                Requer acesso root.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {uefiSteps.map((step, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    activeStep === index + preseedSteps.length
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => setActiveStep(index + preseedSteps.length)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-base">{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                      {activeStep === index + preseedSteps.length && (
                        <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-1" />
                      )}
                    </div>
                  </CardHeader>

                  {activeStep === index + preseedSteps.length && (
                    <CardContent className="space-y-3 border-t pt-3">
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex gap-3">
                            {detail.startsWith("  •") ? (
                              <>
                                <div className="w-4" />
                                <p className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                                  {detail.replace("  •", "•")}
                                </p>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">{detail}</p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {index === 1 && (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto space-y-1">
                          <div>$ sudo -i</div>
                          <div>$ chmod +x uefi-boot-setup.sh</div>
                          <div>$ sudo cp -r /boot/efi /boot/efi.backup</div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                          <div>$ sudo ./uefi-boot-setup.sh</div>
                        </div>
                      )}

                      {index === 3 && (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto space-y-1">
                          <div>$ efibootmgr</div>
                          <div>$ sudo reboot</div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Seu sistema Linux agora está configurado com UEFI Boot corretamente!
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
