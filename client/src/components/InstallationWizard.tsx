import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  content: string;
  checklist: string[];
  warnings?: string[];
  tips?: string[];
}

const PRESEED_STEPS: WizardStep[] = [
  {
    id: "preseed-1",
    title: "Preparar Mídia de Instalação",
    description: "Criar USB bootável com o script Preseed",
    content: "Você precisa de uma USB com pelo menos 2GB. Use o Rufus (Windows) ou Etcher (Linux/Mac) para gravar a imagem ISO.",
    checklist: [
      "Baixar ISO da distribuição Linux",
      "Conectar USB (mínimo 2GB)",
      "Abrir Rufus ou Etcher",
      "Selecionar ISO e USB",
      "Clicar em 'Gravar' ou 'Flash'"
    ],
    warnings: ["Todos os dados da USB serão apagados"],
    tips: ["Use USB 3.0 para gravação mais rápida"]
  },
  {
    id: "preseed-2",
    title: "Copiar Script Preseed",
    description: "Adicionar arquivo preseed.cfg à mídia",
    content: "Após gravar a ISO, você precisa copiar o arquivo preseed.cfg para a raiz da USB.",
    checklist: [
      "Abrir gerenciador de arquivos",
      "Navegar até a USB",
      "Copiar arquivo preseed.cfg",
      "Colar na raiz da USB",
      "Ejetar USB com segurança"
    ],
    warnings: ["Certifique-se que o arquivo está na raiz, não em subpastas"],
    tips: ["Se a USB estiver vazia após gravação, copie o arquivo preseed.cfg manualmente"]
  },
  {
    id: "preseed-3",
    title: "Iniciar Instalação",
    description: "Bootear do USB e iniciar instalação automática",
    content: "Reinicie o computador e selecione boot pela USB. O Preseed iniciará automaticamente.",
    checklist: [
      "Conectar USB ao computador",
      "Reiniciar o computador",
      "Pressionar F12, F2 ou DEL durante boot (varia por marca)",
      "Selecionar USB como primeiro boot",
      "Pressionar Enter para iniciar"
    ],
    warnings: ["O processo é automático - não interrompa"],
    tips: ["Se não bootear, verifique se UEFI/BIOS está configurado para USB"]
  },
  {
    id: "preseed-4",
    title: "Monitorar Instalação",
    description: "Acompanhar o progresso da instalação automática",
    content: "A instalação ocorrerá automaticamente sem intervenção. Isso pode levar 10-30 minutos.",
    checklist: [
      "Observar mensagens de progresso",
      "Aguardar conclusão da instalação",
      "Sistema reiniciará automaticamente",
      "Remover USB após reboot",
      "Fazer login com credenciais configuradas"
    ],
    warnings: ["Não desligue o computador durante a instalação"],
    tips: ["Você pode ver logs em /var/log/syslog após instalação"]
  }
];

const UEFI_STEPS: WizardStep[] = [
  {
    id: "uefi-1",
    title: "Preparar Script UEFI",
    description: "Baixar e preparar script de configuração UEFI",
    content: "Salve o script UEFI em um local acessível após a instalação do Linux.",
    checklist: [
      "Baixar arquivo uefi-boot.sh",
      "Salvar em /tmp ou /home",
      "Abrir terminal",
      "Dar permissão de execução: chmod +x uefi-boot.sh"
    ],
    warnings: ["Você precisa de acesso sudo/root"],
    tips: ["Salve o script em um local que você lembre"]
  },
  {
    id: "uefi-2",
    title: "Executar Script",
    description: "Executar o script UEFI com privilégios de root",
    content: "Execute o script com sudo para configurar o boot UEFI corretamente.",
    checklist: [
      "Abrir terminal",
      "Navegar até o diretório do script",
      "Executar: sudo ./uefi-boot.sh",
      "Inserir senha quando solicitado",
      "Aguardar conclusão"
    ],
    warnings: ["O script modificará configurações de boot - certifique-se de ter backup"],
    tips: ["Se erro de permissão, use: sudo bash uefi-boot.sh"]
  },
  {
    id: "uefi-3",
    title: "Verificar Configuração",
    description: "Confirmar que UEFI foi configurado corretamente",
    content: "Verifique se o boot UEFI está ativo e funcionando.",
    checklist: [
      "Abrir terminal",
      "Executar: efibootmgr",
      "Verificar se Linux aparece na lista",
      "Executar: ls /sys/firmware/efi",
      "Se existir, UEFI está ativo"
    ],
    warnings: ["Se não aparecer, execute o script novamente"],
    tips: ["Você também pode verificar em /boot/efi/"]
  },
  {
    id: "uefi-4",
    title: "Testar Boot",
    description: "Reiniciar e testar boot UEFI",
    content: "Reinicie o sistema para confirmar que o boot UEFI está funcionando.",
    checklist: [
      "Salvar trabalho aberto",
      "Reiniciar o computador",
      "Observar mensagens de boot",
      "Verificar se Linux inicia normalmente",
      "Fazer login e confirmar funcionamento"
    ],
    warnings: ["Se não bootear, você pode precisar ajustar BIOS/UEFI manualmente"],
    tips: ["Pressione ESC durante boot para ver menu UEFI"]
  }
];

export default function InstallationWizard() {
  const [activeTab, setActiveTab] = useState("preseed");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = activeTab === "preseed" ? PRESEED_STEPS : UEFI_STEPS;
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="text-2xl">🧙 Wizard de Instalação</CardTitle>
          <CardDescription>
            Guia passo-a-passo para instalar Linux com Preseed ou configurar UEFI Boot
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preseed">Preseed (Auto-Instalação)</TabsTrigger>
          <TabsTrigger value="uefi">UEFI Boot (Pós-Instalação)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Passo {currentStep + 1} de {steps.length}</span>
              <span className="text-muted-foreground">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  idx === currentStep
                    ? "bg-blue-600 text-white"
                    : idx < currentStep
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {idx < currentStep ? <CheckCircle className="w-4 h-4 mr-2 inline" /> : `${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Current Step Content */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Content */}
              <p className="text-base text-foreground">{step.content}</p>

              {/* Checklist */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Passos a Seguir
                </h4>
                <ul className="space-y-2 ml-7">
                  {step.checklist.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {idx + 1}
                      </span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              {step.warnings && step.warnings.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <strong>⚠️ Atenção:</strong> {step.warnings.join(" • ")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Tips */}
              {step.tips && step.tips.length > 0 && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>💡 Dica:</strong> {step.tips.join(" • ")}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground flex items-center">
              Passo {currentStep + 1} de {steps.length}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
