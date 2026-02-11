import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Copy, Check, Search } from "lucide-react";
import InstallationWizard from "@/components/InstallationWizard";
import VideoPlayer from "@/components/VideoPlayer";

export default function Documentation() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const FAQCategories = [
    { id: "preseed", label: "Preseed & Automacao", icon: "🚀" },
    { id: "hardware", label: "Hardware & Firmware", icon: "⚙️" },
    { id: "particionamento", label: "Particionamento", icon: "💾" },
    { id: "boot", label: "Boot & UEFI", icon: "🔧" },
    { id: "troubleshooting", label: "Troubleshooting", icon: "🔍" },
    { id: "geral", label: "Geral", icon: "❓" }
  ];

  const FAQItems = [
    // Preseed & Automacao
    {
      id: "faq-1",
      category: "preseed",
      question: "O que eh Preseed?",
      answer: "Preseed eh um arquivo de configuracao que automatiza a instalacao do Debian/Ubuntu. Ele responde automaticamente as perguntas do instalador, permitindo instalacao sem intervencao humana."
    },
    {
      id: "faq-2",
      category: "preseed",
      question: "Qual eh a sintaxe correta do preseed.cfg?",
      answer: "Preseed usa formato 'chave = valor' com uma entrada por linha. Exemplo: 'd-i passwd/root-password password senha123'. Nao use espacos extras e certifique-se de usar tabs para indentacao."
    },
    {
      id: "faq-3",
      category: "preseed",
      question: "Como adicionar comandos pos-instalacao no Preseed?",
      answer: "Use a secao 'd-i preseed/late_command' para executar comandos apos instalacao. Exemplo: 'd-i preseed/late_command string in-target apt-get install -y openssh-server'"
    },
    {
      id: "faq-4",
      category: "preseed",
      question: "Posso usar Preseed com outras distribuicoes alem Debian/Ubuntu?",
      answer: "Preseed eh especifico para Debian/Ubuntu. Fedora/CentOS usam Kickstart, openSUSE usa AutoYaST. A calculadora gera scripts para cada distribuicao."
    },
    {
      id: "faq-5",
      category: "preseed",
      question: "Como validar se meu preseed.cfg esta correto?",
      answer: "Use 'debconf-set-selections --check' para validar. Ou instale em uma VM primeiro para testar antes de usar em producao."
    },
    
    // Hardware & Firmware
    {
      id: "faq-6",
      category: "hardware",
      question: "Qual eh a diferenca entre BIOS e UEFI?",
      answer: "BIOS eh o firmware antigo (pre-2010), enquanto UEFI eh o novo padrao. UEFI oferece melhor suporte a discos maiores (>2TB) e eh mais seguro. A maioria dos computadores modernos usa UEFI."
    },
    {
      id: "faq-7",
      category: "hardware",
      question: "Como verificar qual firmware meu computador usa?",
      answer: "No Windows: 'msinfo32' e procure 'Modo BIOS'. No Linux: 'ls /sys/firmware/efi' - se existir, eh UEFI. No macOS: 'System Report' > Hardware Overview."
    },
    {
      id: "faq-8",
      category: "hardware",
      question: "Posso converter BIOS para UEFI apos instalacao?",
      answer: "Nao eh recomendado. Voce precisaria reinstalar. Eh melhor fazer durante a instalacao inicial. Verifique se seu hardware suporta UEFI antes de instalar."
    },
    {
      id: "faq-9",
      category: "hardware",
      question: "Qual eh o minimo de RAM necessario?",
      answer: "Minimo: 512MB (muito lento). Recomendado: 2GB para desktop, 4GB+ para desenvolvimento. A calculadora sugere baseado no seu hardware."
    },
    {
      id: "faq-10",
      category: "hardware",
      question: "Posso instalar em um disco com menos de 20GB?",
      answer: "Sim, mas nao recomendado. Minimo: 10GB (apertado). Recomendado: 20GB+ para sistema + aplicacoes. A calculadora valida o tamanho."
    },
    
    // Particionamento
    {
      id: "faq-11",
      category: "particionamento",
      question: "O que eh MBR vs GPT?",
      answer: "MBR (Master Boot Record) eh o esquema antigo, limitado a 2TB. GPT (GUID Partition Table) eh o novo padrao, suportando discos maiores. Use GPT para discos >2TB ou sistemas UEFI."
    },
    {
      id: "faq-12",
      category: "particionamento",
      question: "Qual eh o tamanho minimo para cada particao?",
      answer: "/ (raiz): 10GB minimo. /home: 5GB minimo. /boot: 512MB. /boot/efi: 256MB (UEFI). swap: 2x RAM (ou 1x para SSD). A calculadora sugere tamanhos otimizados."
    },
    {
      id: "faq-13",
      category: "particionamento",
      question: "Preciso de uma particao /home separada?",
      answer: "Recomendado para facilitar atualizacoes. Se /home esta cheio, o sistema continua funcionando. Sem separacao, o sistema pode travar se disco encher."
    },
    {
      id: "faq-14",
      category: "particionamento",
      question: "Qual eh o melhor sistema de arquivos: ext4, btrfs ou XFS?",
      answer: "ext4: Estavel, compativel, recomendado. btrfs: Moderno, snapshots, mas menos estavel. XFS: Rapido, bom para grandes arquivos. Para iniciantes: ext4."
    },
    {
      id: "faq-15",
      category: "particionamento",
      question: "Posso redimensionar particoes apos instalacao?",
      answer: "Sim, com ferramentas como GParted ou LVM. Mas eh arriscado. Melhor fazer durante instalacao. Sempre faca backup antes de redimensionar."
    },
    
    // Boot & UEFI
    {
      id: "faq-16",
      category: "boot",
      question: "O que fazer se o boot UEFI nao funcionar?",
      answer: "Verifique: 1) Se /boot/efi existe, 2) Se efibootmgr mostra Linux, 3) Se UEFI esta habilitado no BIOS, 4) Se o disco eh GPT (nao MBR)."
    },
    {
      id: "faq-17",
      category: "boot",
      question: "Como acessar o menu de boot durante inicializacao?",
      answer: "Teclas variam por marca: Dell (F12), HP/Lenovo (F12/F2), ASUS (DEL/F2), Apple (Option). Pressione durante a inicializacao, antes do logo do SO."
    },
    {
      id: "faq-18",
      category: "boot",
      question: "O que eh GRUB e como configurar?",
      answer: "GRUB eh o gerenciador de boot do Linux. Arquivo de config: /etc/default/grub. Apos editar: 'sudo update-grub'. Permite escolher SO em dual-boot."
    },
    {
      id: "faq-19",
      category: "boot",
      question: "Como recuperar GRUB se estiver corrompido?",
      answer: "Boot pela USB Live, abra terminal, execute: 'sudo grub-install /dev/sdX' (substitua X pela letra do disco). Depois: 'sudo update-grub'."
    },
    {
      id: "faq-20",
      category: "boot",
      question: "Qual eh a diferenca entre /boot e /boot/efi?",
      answer: "/boot: Contem kernel e initramfs (BIOS/UEFI). /boot/efi: Particao EFI especifica para UEFI, contem bootloaders. Ambas sao necessarias em UEFI."
    },
    
    // Troubleshooting
    {
      id: "faq-21",
      category: "troubleshooting",
      question: "Como recuperar se a instalacao falhar?",
      answer: "1) Reinicie do USB e tente novamente. 2) Verifique logs em /var/log/syslog. 3) Valide preseed.cfg. 4) Tente com BIOS em vez de UEFI. 5) Teste em VM primeiro."
    },
    {
      id: "faq-22",
      category: "troubleshooting",
      question: "Instalacao congela no meio do processo. O que fazer?",
      answer: "Pode ser problema de USB ou hardware. Tente: 1) Outro USB. 2) Redownload da ISO. 3) Verificar integridade com md5sum. 4) Testar em outro computador."
    },
    {
      id: "faq-23",
      category: "troubleshooting",
      question: "Erro 'No bootable device found' apos instalacao.",
      answer: "Disco nao bootavel. Verifique: 1) UEFI/BIOS correto. 2) Disco eh GPT (UEFI) ou MBR (BIOS). 3) /boot/efi existe (UEFI). 4) Reinstale bootloader com grub-install."
    },
    {
      id: "faq-24",
      category: "troubleshooting",
      question: "Sistema inicia mas fica preso no logo do GRUB.",
      answer: "Kernel corrompido ou falta de espaco em /boot. Tente: 1) Boot pela USB Live. 2) Mount /boot. 3) Reinstale kernel: 'apt-get install --reinstall linux-image-generic'."
    },
    {
      id: "faq-25",
      category: "troubleshooting",
      question: "Como acessar logs de instalacao para debug?",
      answer: "Logs estao em /var/log/syslog (durante instalacao) ou /var/log/installer/ (apos instalacao). Use 'tail -f' para acompanhar em tempo real."
    },
    {
      id: "faq-26",
      category: "troubleshooting",
      question: "Preseed nao esta sendo lido. Como verificar?",
      answer: "1) Arquivo deve estar na raiz da USB. 2) Nome exato: preseed.cfg. 3) Sem espacos extras. 4) Verifique com 'debconf-set-selections --check'. 5) Veja logs de instalacao."
    },
    {
      id: "faq-27",
      category: "troubleshooting",
      question: "Disco nao eh detectado durante instalacao.",
      answer: "Pode ser driver faltando. Tente: 1) Ativar AHCI no BIOS. 2) Usar ISO com drivers adicionais. 3) Conectar disco a outra porta SATA. 4) Testar disco com ferramentas de diagnostico."
    },
    {
      id: "faq-28",
      category: "troubleshooting",
      question: "Instalacao muito lenta. Como acelerar?",
      answer: "Fatores: 1) SSD eh 10x mais rapido que HDD. 2) RAM insuficiente causa swap. 3) Internet lenta atrasa downloads. 4) USB 2.0 eh mais lento. Upgrade de hardware ajuda."
    },
    
    // Geral
    {
      id: "faq-29",
      category: "geral",
      question: "Quanto tempo leva a instalacao?",
      answer: "Com Preseed: 10-30 minutos (SSD) a 1 hora (HDD). Manual: 30-60 minutos. Fatores: velocidade do disco, internet, quantidade de pacotes."
    },
    {
      id: "faq-30",
      category: "geral",
      question: "Posso usar Preseed em maquinas virtuais?",
      answer: "Sim! Funciona perfeitamente em VirtualBox, VMware, KVM, Hyper-V. Basta configurar boot pela ISO com preseed.cfg. Otimo para testar."
    },
    {
      id: "faq-31",
      category: "geral",
      question: "Posso modificar o preseed.cfg apos geracao?",
      answer: "Sim! Eh texto simples. Edite com qualquer editor. Mantenha sintaxe correta (sem espacos extras, tabs para indentacao)."
    },
    {
      id: "faq-32",
      category: "geral",
      question: "Qual distribuicao Linux eh melhor para iniciantes?",
      answer: "Ubuntu: Mais facil, grande comunidade. Debian: Estavel, minimalista. Fedora: Moderno, atualizado. Mint: Baseado em Ubuntu, muito amigavel. Escolha conforme preferencia."
    },
    {
      id: "faq-33",
      category: "geral",
      question: "Como posso contribuir melhorias para a calculadora?",
      answer: "Abra issue ou pull request no GitHub. Feedback sobre bugs, sugestoes de features e melhorias sao bem-vindos. Comunidade open-source vive de contribuicoes!"
    }
  ];

  const filteredFAQ = FAQItems.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="container max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            📚 Documentacao de Uso
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Guias completos, tutoriais e respostas para suas duvidas sobre instalacao de Linux
          </p>
        </div>

        <Tabs defaultValue="wizard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wizard">Wizard</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
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
              <h3 className="text-xl font-semibold">Tutoriais em Video</h3>
              <p className="text-muted-foreground">Assista a tutoriais passo-a-passo sobre como instalar Linux com Preseed e UEFI Boot</p>
            </div>

            {/* Preseed Video */}
            <VideoPlayer
              title="Instalacao Automatica com Preseed - Guia Completo"
              description="Tutorial completo mostrando como usar Preseed para automatizar a instalacao de Debian/Ubuntu. Aprenda a preparar a USB, adicionar o arquivo preseed.cfg e executar a instalacao sem intervencao."
              youtubeId="dQw4w9WgXcQ"
              duration="15:32"
              channel="Linux Brasil"
              tags={["Preseed", "Debian", "Ubuntu", "Automacao"]}
              timestamps={[
                { time: "0:00", label: "Introducao" },
                { time: "1:15", label: "Preparando a USB" },
                { time: "3:45", label: "Criando preseed.cfg" },
                { time: "7:20", label: "Adicionando arquivo a USB" },
                { time: "9:00", label: "Boot e instalacao" },
                { time: "13:15", label: "Verificacao final" }
              ]}
            />

            {/* UEFI Boot Video */}
            <VideoPlayer
              title="Configurando UEFI Boot no Linux - Passo a Passo"
              description="Aprenda como configurar corretamente o UEFI Boot apos instalacao. Cobre verificacao de EFI, execucao de scripts de boot e solucao de problemas comuns."
              youtubeId="jNQXAC9IVRw"
              duration="12:45"
              channel="Linux Brasil"
              tags={["UEFI", "Boot", "Linux", "Configuracao"]}
              timestamps={[
                { time: "0:00", label: "Introducao" },
                { time: "1:30", label: "Verificando se UEFI esta ativo" },
                { time: "3:00", label: "Estrutura de diretorios EFI" },
                { time: "5:15", label: "Executando script UEFI" },
                { time: "7:45", label: "Verificando entrada UEFI" },
                { time: "10:00", label: "Solucao de problemas" }
              ]}
            />

            {/* Dual Boot Video */}
            <VideoPlayer
              title="Dual Boot: Linux + Windows com Preseed"
              description="Tutorial sobre como configurar dual boot com Linux e Windows usando Preseed. Inclui particionamento correto, configuracao de GRUB e selecao de boot."
              youtubeId="9bZkp7q19f0"
              duration="18:20"
              channel="Linux Brasil"
              tags={["Dual Boot", "Windows", "Preseed", "GRUB"]}
              timestamps={[
                { time: "0:00", label: "Introducao" },
                { time: "2:00", label: "Particionamento para dual boot" },
                { time: "5:30", label: "Preparando USB com Preseed" },
                { time: "8:15", label: "Instalacao do Linux" },
                { time: "12:00", label: "Configuracao do GRUB" },
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
                  Instalacao automatica de Debian/Ubuntu com arquivo Preseed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">O que voce precisa:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Computador com pelo menos 2GB de RAM</li>
                      <li>USB com minimo 2GB de espaco</li>
                      <li>Conexao com internet (recomendado)</li>
                      <li>Arquivo preseed.cfg gerado nesta calculadora</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Passo 1: Preparar USB</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Baixe a ISO da sua distribuicao Linux e grave na USB usando Rufus ou Etcher.
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
                      Copie o arquivo preseed.cfg para a raiz da USB apos gravacao.
                    </p>
                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                      <AlertDescription className="text-blue-800 dark:text-blue-200">
                        <strong>Importante:</strong> O arquivo deve estar na raiz da USB, nao em subpastas. Alguns instaladores procuram por preseed.cfg automaticamente.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Passo 3: Bootear e Instalar</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Reinicie o computador, selecione boot pela USB e a instalacao comecara automaticamente.
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
                  Configurar boot UEFI apos instalacao do Linux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Verificar se UEFI esta ativo:</h4>
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
                      <p className="text-xs text-muted-foreground">Se o diretorio existir, UEFI esta ativo</p>
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
                      <p className="text-xs text-muted-foreground">Procure por uma entrada com o nome da sua distribuicao</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6 mt-6">
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar perguntas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas ({FAQItems.length})
                </Button>
                {FAQCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.icon} {cat.label}
                  </Button>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Mostrando {filteredFAQ.length} de {FAQItems.length} perguntas
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map((item) => (
                  <Card
                    key={item.id}
                    className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base">{item.question}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {FAQCategories.find(c => c.id === item.category)?.label}
                          </p>
                        </div>
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
                ))
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma pergunta encontrada. Tente outro termo de busca ou categoria.
                  </CardContent>
                </Card>
              )}
            </div>
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
                <h4 className="font-semibold text-sm mb-1">Documentacao Preseed Debian</h4>
                <p className="text-xs text-muted-foreground">Referencia oficial completa</p>
              </a>
              <a
                href="https://ubuntu.com/server/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-sm mb-1">Documentacao Ubuntu Server</h4>
                <p className="text-xs text-muted-foreground">Guias oficiais do Ubuntu</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
