import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dicionário de traduções
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header
    "app.title": "Linux Partition Calculator",
    "app.subtitle": "Otimize o particionamento do seu disco para múltiplas distribuições Linux",
    
    // Features
    "feature.distributions": "Múltiplas Distribuições",
    "feature.distributions.desc": "Suporte para Ubuntu, Fedora, Debian, Arch, Linux Mint, openSUSE e CentOS",
    "feature.export": "Exportação Automática",
    "feature.export.desc": "Baixe arquivos XML e scripts para auto-instalação",
    "feature.recommendations": "Recomendações Inteligentes",
    "feature.recommendations.desc": "Baseadas em RAM, disco e tipo de processador",
    
    // Alert
    "alert.disclaimer": "Esta calculadora fornece recomendações baseadas em boas práticas da comunidade Linux. Sempre revise as configurações antes de instalar um sistema em produção.",
    
    // Tabs
    "tab.calculator": "Calculadora",
    "tab.advanced": "Avançado",
    "tab.validation": "Validação",
    "tab.backup": "Backup",
    "tab.export": "Exportar",
    "tab.reviews": "Avaliações",
    
    // Hardware Configuration
    "config.hardware": "Configuração do Hardware",
    "config.hardware.desc": "Insira as especificações do seu computador",
    "config.disk.size": "Tamanho do Disco (GB)",
    "config.disk.size.desc": "Tamanho total do seu disco rígido",
    "config.ram.size": "Memória RAM (GB)",
    "config.ram.size.desc": "Quantidade de RAM do seu sistema",
    "config.distro": "Distribuição Linux",
    "config.processor": "Processador",
    "config.firmware": "Firmware",
    "config.disk.type": "Tipo de Disco",
    "config.hibernation": "Suporte a Hibernação",
    
    // Partitions
    "partition.efi": "/boot/efi - Partição EFI",
    "partition.boot": "/boot - Kernel e Bootloader",
    "partition.root": "/ - Sistema de Arquivos Raiz",
    "partition.swap": "swap - Memória Virtual",
    "partition.home": "/home - Dados de Usuários",
    
    // Advanced
    "advanced.title": "Particionamento Avançado",
    "advanced.desc": "Customize o tamanho de cada partição e adicione pontos de montagem opcionais",
    "advanced.mandatory": "Partições Obrigatórias",
    "advanced.optional": "Partições Opcionais Adicionadas",
    "advanced.add": "Adicionar Partições Opcionais",
    "advanced.space": "Resumo de Espaço em Disco",
    "advanced.total": "Espaço Total:",
    "advanced.used": "Espaço Utilizado:",
    "advanced.available": "Espaço Disponível:",
    
    // Buttons
    "btn.save": "Salvar",
    "btn.download": "Baixar",
    "btn.copy": "Copiar",
    "btn.light": "Claro",
    "btn.dark": "Escuro",
    "btn.history": "Histórico",
    "btn.settings": "Configurações",
    "btn.language": "Idioma",
    
    // Messages
    "msg.success": "Sucesso!",
    "msg.error": "Erro!",
    "msg.copied": "Copiado para a área de transferência!",
    "msg.saved": "Configuração salva!",
  },
  en: {
    // Header
    "app.title": "Linux Partition Calculator",
    "app.subtitle": "Optimize disk partitioning for multiple Linux distributions",
    
    // Features
    "feature.distributions": "Multiple Distributions",
    "feature.distributions.desc": "Support for Ubuntu, Fedora, Debian, Arch, Linux Mint, openSUSE and CentOS",
    "feature.export": "Automatic Export",
    "feature.export.desc": "Download XML files and scripts for automated installation",
    "feature.recommendations": "Smart Recommendations",
    "feature.recommendations.desc": "Based on RAM, disk size and processor type",
    
    // Alert
    "alert.disclaimer": "This calculator provides recommendations based on Linux community best practices. Always review settings before installing a system in production.",
    
    // Tabs
    "tab.calculator": "Calculator",
    "tab.advanced": "Advanced",
    "tab.validation": "Validation",
    "tab.backup": "Backup",
    "tab.export": "Export",
    "tab.reviews": "Reviews",
    
    // Hardware Configuration
    "config.hardware": "Hardware Configuration",
    "config.hardware.desc": "Enter your computer specifications",
    "config.disk.size": "Disk Size (GB)",
    "config.disk.size.desc": "Total size of your hard drive",
    "config.ram.size": "RAM Memory (GB)",
    "config.ram.size.desc": "Amount of system RAM",
    "config.distro": "Linux Distribution",
    "config.processor": "Processor",
    "config.firmware": "Firmware",
    "config.disk.type": "Disk Type",
    "config.hibernation": "Hibernation Support",
    
    // Partitions
    "partition.efi": "/boot/efi - EFI Partition",
    "partition.boot": "/boot - Kernel and Bootloader",
    "partition.root": "/ - Root Filesystem",
    "partition.swap": "swap - Virtual Memory",
    "partition.home": "/home - User Data",
    
    // Advanced
    "advanced.title": "Advanced Partitioning",
    "advanced.desc": "Customize partition sizes and add optional mount points",
    "advanced.mandatory": "Mandatory Partitions",
    "advanced.optional": "Added Optional Partitions",
    "advanced.add": "Add Optional Partitions",
    "advanced.space": "Disk Space Summary",
    "advanced.total": "Total Space:",
    "advanced.used": "Used Space:",
    "advanced.available": "Available Space:",
    
    // Buttons
    "btn.save": "Save",
    "btn.download": "Download",
    "btn.copy": "Copy",
    "btn.light": "Light",
    "btn.dark": "Dark",
    "btn.history": "History",
    "btn.settings": "Settings",
    "btn.language": "Language",
    
    // Messages
    "msg.success": "Success!",
    "msg.error": "Error!",
    "msg.copied": "Copied to clipboard!",
    "msg.saved": "Configuration saved!",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("pt");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detectar idioma do navegador e geolocalização
    const detectLanguage = async () => {
      try {
        // Tentar obter país do visitante via IP
        const response = await fetch("/api/trpc/system.getVisitorCountry");
        if (response.ok) {
          const data = await response.json();
          const country = data.result?.data?.country || "BR";
          
          // Se não for Brasil, usar inglês
          const lang = country === "BR" ? "pt" : "en";
          setLanguageState(lang);
          localStorage.setItem("language", lang);
        } else {
          // Fallback para português
          setLanguageState("pt");
        }
      } catch (error) {
        console.error("Error detecting language:", error);
        // Fallback para português
        setLanguageState("pt");
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar se há idioma salvo no localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      setIsLoading(false);
    } else {
      detectLanguage();
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
