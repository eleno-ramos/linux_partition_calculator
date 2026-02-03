export interface DistributionConfig {
  id: string;
  name: string;
  description: string;
  filesystem: string;
  bootSize: number; // in GB
  minRootSize: number;
  recommendedRootSize: number;
  supportsSwap: boolean;
  defaultSwapMultiplier: number;
  efiRequired: boolean;
}

export interface ProcessorInfo {
  id: string;
  brand: string;
  architecture: string;
  bitness: "32-bit" | "64-bit";
  examples: string[];
  releaseYear?: number;
  generation?: string;
}

export interface PartitionRecommendation {
  efi: number;
  boot: number;
  root: number;
  swap: number;
  home: number;
  total: number;
  systemPercentage?: number;
  otherPartitions?: number;
}

export type FirmwareType = "bios" | "uefi" | "gpt" | "mbr";
export type DiskType = "hdd" | "ssd";
export type PartitionMode = "optimized" | "custom";

export interface FirmwareConfig {
  id: FirmwareType;
  name: string;
  description: string;
  requiresEFI: boolean;
  partitionTable: "MBR" | "GPT";
  maxPartitions: number;
  notes: string[];
}

export interface DiskConfig {
  id: DiskType;
  name: string;
  description: string;
  recommendations: string[];
  alignmentSize: number; // in MB
  performanceTips: string[];
}

export interface CustomPartition {
  name: string;
  mountPoint: string;
  sizeGB: number;
  filesystem: string;
  priority: number; // 1-10, higher = more important
}

export const FIRMWARE_TYPES: Record<FirmwareType, FirmwareConfig> = {
  bios: {
    id: "bios",
    name: "BIOS (MBR)",
    description: "Legacy BIOS com tabela de partições MBR",
    requiresEFI: false,
    partitionTable: "MBR",
    maxPartitions: 4,
    notes: [
      "Máximo de 4 partições primárias",
      "Suporta discos até 2TB",
      "Compatível com sistemas antigos",
      "Sem suporte a boot seguro",
    ],
  },
  uefi: {
    id: "uefi",
    name: "UEFI (GPT)",
    description: "UEFI moderno com tabela de partições GPT",
    requiresEFI: true,
    partitionTable: "GPT",
    maxPartitions: 128,
    notes: [
      "Suporta discos maiores que 2TB",
      "Requer partição EFI",
      "Suporta Secure Boot",
      "Recomendado para sistemas modernos",
    ],
  },
  gpt: {
    id: "gpt",
    name: "GPT (Sem UEFI)",
    description: "GPT com BIOS legado",
    requiresEFI: false,
    partitionTable: "GPT",
    maxPartitions: 128,
    notes: [
      "Suporta discos maiores que 2TB",
      "Compatível com BIOS legado",
      "Sem Secure Boot",
      "Bom para dual-boot antigo",
    ],
  },
  mbr: {
    id: "mbr",
    name: "MBR Tradicional",
    description: "Master Boot Record tradicional",
    requiresEFI: false,
    partitionTable: "MBR",
    maxPartitions: 4,
    notes: [
      "Compatibilidade máxima",
      "Limite de 2TB",
      "Sem boot seguro",
      "Para sistemas muito antigos",
    ],
  },
};

export const DISK_TYPES: Record<DiskType, DiskConfig> = {
  ssd: {
    id: "ssd",
    name: "Disco Sólido (SSD)",
    description: "Unidade de estado sólido sem partes móveis",
    recommendations: [
      "Use ext4 ou btrfs para melhor performance",
      "Ative TRIM automático (fstrim.timer)",
      "Deixe 10-20% de espaço livre",
      "Considere usar noatime",
    ],
    alignmentSize: 4,
    performanceTips: [
      "Ative fstrim.timer para limpeza automática",
      "Use noatime em /home",
      "Considere usar btrfs para snapshots",
      "Monitore SMART para vida útil do SSD",
    ],
  },
  hdd: {
    id: "hdd",
    name: "Disco Mecânico (HDD)",
    description: "Disco rígido tradicional com partes móveis",
    recommendations: [
      "Use ext4 para máxima compatibilidade",
      "Deixe espaço livre para evitar fragmentação",
      "Considere usar noatime para reduzir I/O",
      "Monitore SMART para detectar falhas",
    ],
    alignmentSize: 4,
    performanceTips: [
      "Use ext4 para máxima compatibilidade",
      "Deixe espaço livre para evitar fragmentação",
      "Considere usar noatime para reduzir I/O",
      "Monitore SMART para detectar falhas",
    ],
  },
};

export const DISTRIBUTIONS: Record<string, DistributionConfig> = {
  ubuntu: {
    id: "ubuntu",
    name: "Ubuntu",
    description: "Distribuição popular, fácil de usar",
    filesystem: "ext4",
    bootSize: 0.5,
    minRootSize: 20,
    recommendedRootSize: 40,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  fedora: {
    id: "fedora",
    name: "Fedora",
    description: "Cutting-edge, atualizado frequentemente",
    filesystem: "ext4",
    bootSize: 1,
    minRootSize: 25,
    recommendedRootSize: 45,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  debian: {
    id: "debian",
    name: "Debian",
    description: "Estável e confiável, base para muitas distros",
    filesystem: "ext4",
    bootSize: 0.5,
    minRootSize: 25,
    recommendedRootSize: 45,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  mint: {
    id: "mint",
    name: "Linux Mint",
    description: "Baseada em Ubuntu, interface amigável",
    filesystem: "ext4",
    bootSize: 0.5,
    minRootSize: 20,
    recommendedRootSize: 40,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  arch: {
    id: "arch",
    name: "Arch Linux",
    description: "Minimalista, rolling release, para usuários avançados",
    filesystem: "ext4",
    bootSize: 0.5,
    minRootSize: 20,
    recommendedRootSize: 40,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  opensuse: {
    id: "opensuse",
    name: "openSUSE",
    description: "Distribuição estável com ferramentas avançadas",
    filesystem: "btrfs",
    bootSize: 0.5,
    minRootSize: 35,
    recommendedRootSize: 55,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  centos: {
    id: "centos",
    name: "CentOS",
    description: "Baseada em Red Hat, focada em estabilidade",
    filesystem: "ext4",
    bootSize: 1,
    minRootSize: 40,
    recommendedRootSize: 60,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
};

export const PROCESSORS: Record<string, ProcessorInfo> = {
  // Intel - Moderno (2015+)
  intel_x86: {
    id: "intel_x86",
    brand: "Intel",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Core i3/i5/i7/i9 (6ª gen+)", "Xeon Scalable", "Pentium Gold"],
    releaseYear: 2015,
    generation: "Skylake e posteriores",
  },
  // Intel - Intermediário (2009-2014)
  intel_sandy_ivy: {
    id: "intel_sandy_ivy",
    brand: "Intel",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Core i3/i5/i7 (2ª-4ª gen)", "Xeon E5", "Pentium G"],
    releaseYear: 2011,
    generation: "Sandy Bridge a Haswell",
  },
  // Intel - Antigo (2006-2008)
  intel_core2_penryn: {
    id: "intel_core2_penryn",
    brand: "Intel",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Core 2 Duo/Quad", "Pentium D", "Xeon 5000 series"],
    releaseYear: 2006,
    generation: "Core 2 e Penryn",
  },
  // Intel - Muito Antigo (2001-2005)
  intel_32bit: {
    id: "intel_32bit",
    brand: "Intel",
    architecture: "i386",
    bitness: "32-bit",
    examples: ["Pentium 4", "Pentium M", "Celeron (antigo)"],
    releaseYear: 2001,
    generation: "Pentium 4 e anteriores",
  },
  // AMD - Moderno (2015+)
  amd_x86: {
    id: "amd_x86",
    brand: "AMD",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Ryzen 3/5/7/9", "Ryzen Threadripper", "EPYC"],
    releaseYear: 2017,
    generation: "Ryzen (Zen+)",
  },
  // AMD - Intermediário (2011-2014)
  amd_bulldozer: {
    id: "amd_bulldozer",
    brand: "AMD",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["FX-8350/9590", "A10/A8 APU", "Opteron 6200 series"],
    releaseYear: 2012,
    generation: "Bulldozer e Piledriver",
  },
  // AMD - Antigo (2003-2008)
  amd_athlon64_phenom: {
    id: "amd_athlon64_phenom",
    brand: "AMD",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Athlon 64 X2", "Phenom II X4", "Opteron 2000 series"],
    releaseYear: 2003,
    generation: "Athlon 64 e Phenom",
  },
  // AMD - Muito Antigo (2001-2002)
  amd_32bit: {
    id: "amd_32bit",
    brand: "AMD",
    architecture: "i386",
    bitness: "32-bit",
    examples: ["Athlon", "Sempron", "Duron"],
    releaseYear: 2001,
    generation: "Athlon K7 e anteriores",
  },
  // ARM - Moderno (2015+)
  arm64: {
    id: "arm64",
    brand: "ARM",
    architecture: "arm64",
    bitness: "64-bit",
    examples: ["Apple Silicon M1/M2/M3", "Qualcomm Snapdragon 8 Gen", "MediaTek Dimensity"],
    releaseYear: 2020,
    generation: "ARMv8-A (moderno)",
  },
  // ARM - Intermediário (2012-2014)
  arm64_cortex_a57: {
    id: "arm64_cortex_a57",
    brand: "ARM",
    architecture: "arm64",
    bitness: "64-bit",
    examples: ["Cortex-A57/A72", "Samsung Exynos", "Qualcomm Snapdragon 810"],
    releaseYear: 2014,
    generation: "ARMv8-A (primeira geração)",
  },
  // ARM - 32-bit Moderno (2010+)
  arm32: {
    id: "arm32",
    brand: "ARM",
    architecture: "armhf",
    bitness: "32-bit",
    examples: ["Cortex-A8/A9/A15", "Raspberry Pi 1-3", "Qualcomm Snapdragon 400"],
    releaseYear: 2010,
    generation: "ARMv7-A",
  },
  // ARM - 32-bit Antigo (2005-2009)
  arm32_cortex_a8: {
    id: "arm32_cortex_a8",
    brand: "ARM",
    architecture: "armhf",
    bitness: "32-bit",
    examples: ["Cortex-A8", "Apple A4/A5", "Samsung Hummingbird"],
    releaseYear: 2005,
    generation: "ARMv7-A (antigo)",
  },
};

export function calculateSwapSize(
  ramGB: number,
  hibernation: boolean,
  distroId: string
): number {
  const distro = DISTRIBUTIONS[distroId];

  if (!distro.supportsSwap) {
    return 0;
  }

  if (hibernation) {
    return Math.max(ramGB, 2);
  } else {
    if (ramGB <= 2) {
      return Math.max(ramGB * 2, 2);
    } else if (ramGB <= 8) {
      return ramGB;
    } else {
      return Math.max(4, ramGB * 0.5);
    }
  }
}

export function calculatePartitions(
  totalDiskGB: number,
  ramGB: number,
  distroId: string,
  hibernation: boolean,
  useMinimum: boolean = false,
  systemPercentage: number = 20,
  includeHome: boolean = true
): PartitionRecommendation {
  const distro = DISTRIBUTIONS[distroId];

  // Clamp system percentage between 10% and 80%
  const clampedSystemPercentage = Math.max(10, Math.min(80, systemPercentage));
  const systemDiskGB = (totalDiskGB * clampedSystemPercentage) / 100;

  const efiSize = 0.5;
  const bootSize = distro.bootSize;
  const swapSize = calculateSwapSize(ramGB, hibernation, distroId);

  const rootSize = useMinimum
    ? Math.min(distro.minRootSize, systemDiskGB - efiSize - bootSize - swapSize)
    : Math.min(
        distro.recommendedRootSize,
        systemDiskGB - efiSize - bootSize - swapSize
      );

  const usedSize = efiSize + bootSize + swapSize + rootSize;
  const homeSize = includeHome ? Math.max(0, totalDiskGB - usedSize) : 0;

  return {
    efi: efiSize,
    boot: bootSize,
    root: rootSize,
    swap: swapSize,
    home: homeSize,
    total: totalDiskGB,
    systemPercentage: clampedSystemPercentage,
    otherPartitions: includeHome ? 0 : totalDiskGB - usedSize,
  };
}

export function validatePartitionConfiguration(
  partitions: PartitionRecommendation,
  distroId: string,
  systemPercentage: number
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
} {
  const distro = DISTRIBUTIONS[distroId];
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check root size
  if (partitions.root < distro.minRootSize) {
    errors.push(
      `Partição raiz (${partitions.root}GB) menor que mínimo recomendado (${distro.minRootSize}GB)`
    );
  }

  if (partitions.root < distro.recommendedRootSize) {
    warnings.push(
      `Partição raiz abaixo do recomendado. Atual: ${partitions.root}GB, Recomendado: ${distro.recommendedRootSize}GB`
    );
  }

  // Check swap
  if (partitions.swap < 2) {
    warnings.push("Swap muito pequeno. Recomenda-se no mínimo 2GB");
  }

  // Check home space
  if (partitions.home > 0 && partitions.home < 50) {
    warnings.push(
      `Espaço /home limitado (${partitions.home}GB). Considere aumentar para melhor experiência`
    );
  }

  // Check free space
  const freePercentage = (partitions.home / partitions.total) * 100;
  if (freePercentage < 5) {
    warnings.push("Pouco espaço livre. Deixe pelo menos 10% para melhor performance");
  }

  // Suggestions
  if (partitions.root === distro.minRootSize) {
    suggestions.push(
      `Você está usando o tamanho mínimo. Considere aumentar para ${distro.recommendedRootSize}GB para melhor performance`
    );
  }

  if (systemPercentage < 15) {
    suggestions.push(
      "Você alocou menos de 15% para o sistema. Certifique-se de que tem espaço suficiente para atualizações"
    );
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    suggestions,
  };
}

export function calculateSpaceGrowthProjection(
  partitions: PartitionRecommendation,
  distroId: string
): Array<{
  year: number;
  system: number;
  home: number;
  free: number;
}> {
  const growthRates: Record<string, number> = {
    ubuntu: 0.15,
    fedora: 0.2,
    debian: 0.1,
    mint: 0.12,
    arch: 0.18,
    opensuse: 0.14,
    centos: 0.08,
  };

  const growthRate = growthRates[distroId] || 0.12;
  const projection = [];

  for (let year = 0; year <= 5; year++) {
    const systemGrowth = partitions.root * Math.pow(1 + growthRate, year);
    const homeGrowth = partitions.home * Math.pow(1 + growthRate * 0.5, year);
    const totalUsed = partitions.efi + partitions.boot + partitions.swap + systemGrowth + homeGrowth;
    const free = Math.max(0, partitions.total - totalUsed);

    projection.push({
      year,
      system: Math.round(systemGrowth * 10) / 10,
      home: Math.round(homeGrowth * 10) / 10,
      free: Math.round(free * 10) / 10,
    });
  }

  return projection;
}

export function generateKickstartXML(
  distroId: string,
  partitions: PartitionRecommendation,
  hostname: string,
  timezone: string,
  username?: string,
  password?: string,
  wifiSSID?: string,
  wifiPassword?: string
): string {
  const distro = DISTRIBUTIONS[distroId];

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Kickstart Configuration for ${distro.name} -->
<!-- Generated by Linux Partition Calculator -->

# System Configuration
lang pt_BR
keyboard br-abnt2
timezone ${timezone}
auth --useshadow --passalgo=sha512
selinux --enforcing
firewall --enabled

# Network Configuration
network --bootproto=dhcp --onboot=on --hostname=${hostname}
${wifiSSID ? `network --device=wlan0 --bootproto=dhcp --onboot=on --ssid=${wifiSSID} --password=${wifiPassword}` : ''}

# Partitioning
zerombr
clearpart --all --initlabel
part /boot/efi --fstype=efi --size=${Math.round(partitions.efi * 1024)}
part /boot --fstype=${distro.filesystem} --size=${Math.round(partitions.boot * 1024)}
part / --fstype=${distro.filesystem} --size=${Math.round(partitions.root * 1024)}
part swap --size=${Math.round(partitions.swap * 1024)}
part /home --fstype=${distro.filesystem} --size=${Math.round(partitions.home * 1024)}

# Installation
url --url=https://archive.ubuntu.com/ubuntu/
install

# Packages
%packages
@core
@standard
%end

# Post-installation
%post
echo "System installed successfully"
${username && password ? `
# Create user account
useradd -m -s /bin/bash ${username}
echo "${username}:${password}" | chpasswd

# Add user to sudo group
usermod -aG sudo ${username}
` : ''}
%end

# Reboot
reboot`;
}

export function generatePartcloneScript(
  partitions: PartitionRecommendation,
  hostname: string
): string {
  return `#!/bin/bash
# Partclone Backup/Restore Script - Generated by Linux Partition Calculator
# This script creates and restores partition images using partclone

set -e

BACKUP_DIR="/mnt/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${hostname}_backup_$TIMESTAMP"

# Backup function
backup_partitions() {
  echo "Starting partition backup to $BACKUP_DIR/$BACKUP_NAME..."
  
  mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
  
  # Backup EFI partition
  echo "Backing up EFI partition..."
  sudo partclone.vfat -c -s /dev/sda1 -o "$BACKUP_DIR/$BACKUP_NAME/efi.img" 2>&1 | tee "$BACKUP_DIR/$BACKUP_NAME/efi.log"
  
  # Backup Boot partition
  echo "Backing up Boot partition..."
  sudo partclone.ext4 -c -s /dev/sda2 -o "$BACKUP_DIR/$BACKUP_NAME/boot.img" 2>&1 | tee "$BACKUP_DIR/$BACKUP_NAME/boot.log"
  
  # Backup Root partition
  echo "Backing up Root partition..."
  sudo partclone.ext4 -c -s /dev/sda3 -o "$BACKUP_DIR/$BACKUP_NAME/root.img" 2>&1 | tee "$BACKUP_DIR/$BACKUP_NAME/root.log"
  
  # Backup Home partition
  echo "Backing up Home partition..."
  sudo partclone.ext4 -c -s /dev/sda5 -o "$BACKUP_DIR/$BACKUP_NAME/home.img" 2>&1 | tee "$BACKUP_DIR/$BACKUP_NAME/home.log"
  
  echo "Backup completed successfully!"
  echo "Backup location: $BACKUP_DIR/$BACKUP_NAME"
}

# Restore function
restore_partitions() {
  local backup_path="$1"
  
  if [ ! -d "$backup_path" ]; then
    echo "Error: Backup path does not exist: $backup_path"
    exit 1
  fi
  
  echo "Starting partition restore from $backup_path..."
  
  # Restore EFI partition
  echo "Restoring EFI partition..."
  sudo partclone.vfat -r -s "$backup_path/efi.img" -o /dev/sda1
  
  # Restore Boot partition
  echo "Restoring Boot partition..."
  sudo partclone.ext4 -r -s "$backup_path/boot.img" -o /dev/sda2
  
  # Restore Root partition
  echo "Restoring Root partition..."
  sudo partclone.ext4 -r -s "$backup_path/root.img" -o /dev/sda3
  
  # Restore Home partition
  echo "Restoring Home partition..."
  sudo partclone.ext4 -r -s "$backup_path/home.img" -o /dev/sda5
  
  echo "Restore completed successfully!"
}

# Main script
case "$1" in
  backup)
    backup_partitions
    ;;
  restore)
    if [ -z "$2" ]; then
      echo "Usage: $0 restore <backup_path>"
      exit 1
    fi
    restore_partitions "$2"
    ;;
  *)
    echo "Usage: $0 {backup|restore <backup_path>}"
    exit 1
    ;;
esac`;
}

export function getPerformanceTips(diskType: DiskType, distroId: string): string[] {
  const diskTips = DISK_TYPES[diskType].performanceTips;
  const distroTips: Record<string, string[]> = {
    ubuntu: [
      "Mantenha o Ubuntu atualizado com 'sudo apt update && sudo apt upgrade'",
      "Use o Ubuntu Software Center para instalar aplicativos",
      "Considere usar LTS (Long Term Support) para estabilidade",
    ],
    fedora: [
      "Use dnf em vez de yum para melhor performance",
      "Mantenha o Fedora atualizado regularmente",
      "Considere usar SELinux para segurança adicional",
    ],
    debian: [
      "Use 'apt' para gerenciar pacotes",
      "Considere usar testing ou unstable para software mais recente",
      "Mantenha backups regulares de seus dados",
    ],
    mint: [
      "Use o Gerenciador de Software do Linux Mint",
      "Mantenha o sistema atualizado com o Gerenciador de Atualizações",
      "Aproveite a interface amigável para configurações",
    ],
    arch: [
      "Mantenha o sistema atualizado com 'pacman -Syu'",
      "Leia o Arch Linux News antes de atualizar",
      "Considere usar AUR para software adicional",
    ],
    opensuse: [
      "Use YaST para gerenciamento do sistema",
      "Mantenha o openSUSE atualizado com 'zypper up'",
      "Considere usar Snapper para snapshots de sistema",
    ],
    centos: [
      "Use yum ou dnf para gerenciar pacotes",
      "Mantenha o CentOS atualizado para segurança",
      "Considere usar SELinux para segurança adicional",
    ],
  };

  return [...diskTips, ...(distroTips[distroId] || [])];
}

export interface SavedConfiguration {
  id: string;
  name: string;
  diskSize: number;
  ramSize: number;
  distro: string;
  processor: string;
  firmware: FirmwareType;
  diskType: DiskType;
  hibernation: boolean;
  useMinimum: boolean;
  useLVM: boolean;
  hostname: string;
  timezone: string;
  systemPercentage: number;
  includeHome: boolean;
  createdAt: string;
}
