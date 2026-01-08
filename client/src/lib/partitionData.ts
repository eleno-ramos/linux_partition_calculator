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
      "Combina GPT com BIOS legado",
      "Suporta discos maiores que 2TB",
      "Compatível com sistemas antigos",
      "Requer partição de boot dedicada",
    ],
  },
  mbr: {
    id: "mbr",
    name: "MBR (Legado)",
    description: "Tabela de partições MBR tradicional",
    requiresEFI: false,
    partitionTable: "MBR",
    maxPartitions: 4,
    notes: [
      "Compatível com qualquer BIOS",
      "Máximo de 4 partições primárias",
      "Suporta discos até 2TB",
      "Sem suporte a Secure Boot",
    ],
  },
};

export const DISK_TYPES: Record<DiskType, DiskConfig> = {
  ssd: {
    id: "ssd",
    name: "Disco Sólido (SSD)",
    description: "Unidade de estado sólido sem partes móveis",
    recommendations: [
      "Ative TRIM para otimização",
      "Use noatime em /home",
      "Considere usar btrfs",
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
    name: "Disco Rígido (HDD)",
    description: "Disco rígido mecânico tradicional",
    recommendations: [
      "Use ext4 para melhor compatibilidade",
      "Deixe mais espaço livre (~15%)",
      "Desfragmente periodicamente",
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
  intel_x86: {
    id: "intel_x86",
    brand: "Intel",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Core i3/i5/i7/i9", "Xeon", "Pentium (moderno)"],
  },
  intel_32bit: {
    id: "intel_32bit",
    brand: "Intel",
    architecture: "i386",
    bitness: "32-bit",
    examples: ["Pentium 4", "Pentium M", "Celeron (antigo)"],
  },
  amd_x86: {
    id: "amd_x86",
    brand: "AMD",
    architecture: "x86_64",
    bitness: "64-bit",
    examples: ["Ryzen", "FX", "Athlon X2"],
  },
  amd_32bit: {
    id: "amd_32bit",
    brand: "AMD",
    architecture: "i386",
    bitness: "32-bit",
    examples: ["Athlon", "Sempron", "Duron"],
  },
  arm64: {
    id: "arm64",
    brand: "ARM",
    architecture: "arm64",
    bitness: "64-bit",
    examples: ["Apple Silicon", "Qualcomm Snapdragon", "MediaTek"],
  },
  arm32: {
    id: "arm32",
    brand: "ARM",
    architecture: "armhf",
    bitness: "32-bit",
    examples: ["Raspberry Pi (antigo)", "Cortex-A9"],
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
  systemPercentage: number = 20
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
  const homeSize = Math.max(0, totalDiskGB - usedSize);

  return {
    efi: efiSize,
    boot: bootSize,
    root: rootSize,
    swap: swapSize,
    home: homeSize,
    total: totalDiskGB,
    systemPercentage: clampedSystemPercentage,
    otherPartitions: homeSize,
  };
}

export function generateKickstartXML(
  distroId: string,
  partitions: PartitionRecommendation,
  hostname: string = "linux-system",
  timezone: string = "UTC"
): string {
  const distro = DISTRIBUTIONS[distroId];

  if (["fedora", "centos"].includes(distroId)) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Kickstart configuration for ${distro.name} -->
<!-- Generated by Linux Partition Calculator -->
<kickstart>
  <version>1.0</version>
  
  <!-- System Configuration -->
  <system>
    <hostname>${hostname}</hostname>
    <timezone>${timezone}</timezone>
  </system>
  
  <!-- Partitioning -->
  <partitioning>
    <partition>
      <mount>/boot/efi</mount>
      <size>${partitions.efi * 1024}</size>
      <fstype>efi</fstype>
    </partition>
    <partition>
      <mount>/boot</mount>
      <size>${partitions.boot * 1024}</size>
      <fstype>${distro.filesystem}</fstype>
    </partition>
    <partition>
      <mount>/</mount>
      <size>${partitions.root * 1024}</size>
      <fstype>${distro.filesystem}</fstype>
    </partition>
    <partition>
      <mount>swap</mount>
      <size>${partitions.swap * 1024}</size>
      <fstype>swap</fstype>
    </partition>
    <partition>
      <mount>/home</mount>
      <size>${partitions.home * 1024}</size>
      <fstype>${distro.filesystem}</fstype>
    </partition>
  </partitioning>
</kickstart>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Partition configuration for ${distro.name} -->
<!-- Generated by Linux Partition Calculator -->
<partitions>
  <partition>
    <mount>/boot/efi</mount>
    <size>${partitions.efi}</size>
    <unit>GB</unit>
    <fstype>efi</fstype>
  </partition>
  <partition>
    <mount>/boot</mount>
    <size>${partitions.boot}</size>
    <unit>GB</unit>
    <fstype>${distro.filesystem}</fstype>
  </partition>
  <partition>
    <mount>/</mount>
    <size>${partitions.root}</size>
    <unit>GB</unit>
    <fstype>${distro.filesystem}</fstype>
  </partition>
  <partition>
    <mount>swap</mount>
    <size>${partitions.swap}</size>
    <unit>GB</unit>
    <fstype>swap</fstype>
  </partition>
  <partition>
    <mount>/home</mount>
    <size>${partitions.home}</size>
    <unit>GB</unit>
    <fstype>${distro.filesystem}</fstype>
  </partition>
</partitions>`;
}

export function generateUEFIBootScript(
  partitions: PartitionRecommendation
): string {
  return `#!/bin/bash
# UEFI Boot Script - Generated by Linux Partition Calculator
# WARNING: This script will partition your disk. Use with caution!

set -e

DISK="/dev/sda"  # Change this to your disk
BOOT_SIZE="${partitions.boot * 1024}M"
ROOT_SIZE="${partitions.root * 1024}M"
SWAP_SIZE="${partitions.swap * 1024}M"

echo "Creating UEFI partitions on $DISK..."

# Create partition table
sudo parted -s $DISK mklabel gpt

# Create EFI partition
sudo parted -s $DISK mkpart primary fat32 1MiB 513MiB
sudo parted -s $DISK set 1 esp on

# Create boot partition
sudo parted -s $DISK mkpart primary ext4 513MiB $((513 + ${partitions.boot * 1024}))MiB

# Create root partition
sudo parted -s $DISK mkpart primary ext4 $((513 + ${partitions.boot * 1024}))MiB $((513 + ${partitions.boot * 1024} + ${partitions.root * 1024}))MiB

# Create swap partition
sudo parted -s $DISK mkpart primary linux-swap $((513 + ${partitions.boot * 1024} + ${partitions.root * 1024}))MiB $((513 + ${partitions.boot * 1024} + ${partitions.root * 1024} + ${partitions.swap * 1024}))MiB

# Create home partition (rest of disk)
sudo parted -s $DISK mkpart primary ext4 $((513 + ${partitions.boot * 1024} + ${partitions.root * 1024} + ${partitions.swap * 1024}))MiB 100%

echo "Partitions created successfully!"
echo "Format partitions with: mkfs.fat -F32 /dev/sda1; mkfs.ext4 /dev/sda2; mkfs.ext4 /dev/sda3; mkswap /dev/sda4; mkfs.ext4 /dev/sda5"`;
}

export function generateMBRBootScript(
  partitions: PartitionRecommendation
): string {
  return `#!/bin/bash
# MBR Boot Script - Generated by Linux Partition Calculator
# WARNING: This script will partition your disk. Use with caution!

set -e

DISK="/dev/sda"  # Change this to your disk

echo "Creating MBR partitions on $DISK..."

# Create partition table
sudo parted -s $DISK mklabel msdos

# Create boot partition
sudo parted -s $DISK mkpart primary ext4 1MiB $((1 + ${partitions.boot * 1024}))MiB
sudo parted -s $DISK set 1 boot on

# Create root partition
sudo parted -s $DISK mkpart primary ext4 $((1 + ${partitions.boot * 1024}))MiB $((1 + ${partitions.boot * 1024} + ${partitions.root * 1024}))MiB

# Create swap partition
sudo parted -s $DISK mkpart primary linux-swap $((1 + ${partitions.boot * 1024} + ${partitions.root * 1024}))MiB $((1 + ${partitions.boot * 1024} + ${partitions.root * 1024} + ${partitions.swap * 1024}))MiB

# Create home partition (rest of disk)
sudo parted -s $DISK mkpart primary ext4 $((1 + ${partitions.boot * 1024} + ${partitions.root * 1024} + ${partitions.swap * 1024}))MiB 100%

echo "Partitions created successfully!"
echo "Format partitions with: mkfs.ext4 /dev/sda1; mkfs.ext4 /dev/sda2; mkswap /dev/sda3; mkfs.ext4 /dev/sda4"`;
}

export function generateGPTBIOSBootScript(
  partitions: PartitionRecommendation
): string {
  return `#!/bin/bash
# GPT BIOS Boot Script - Generated by Linux Partition Calculator
# WARNING: This script will partition your disk. Use with caution!

set -e

DISK="/dev/sda"  # Change this to your disk

echo "Creating GPT BIOS partitions on $DISK..."

# Create partition table
sudo parted -s $DISK mklabel gpt

# Create BIOS boot partition
sudo parted -s $DISK mkpart primary 1MiB 3MiB
sudo parted -s $DISK set 1 bios_grub on

# Create boot partition
sudo parted -s $DISK mkpart primary ext4 3MiB $((3 + ${partitions.boot * 1024}))MiB

# Create root partition
sudo parted -s $DISK mkpart primary ext4 $((3 + ${partitions.boot * 1024}))MiB $((3 + ${partitions.boot * 1024} + ${partitions.root * 1024}))MiB

# Create swap partition
sudo parted -s $DISK mkpart primary linux-swap $((3 + ${partitions.boot * 1024} + ${partitions.root * 1024}))MiB $((3 + ${partitions.boot * 1024} + ${partitions.root * 1024} + ${partitions.swap * 1024}))MiB

# Create home partition (rest of disk)
sudo parted -s $DISK mkpart primary ext4 $((3 + ${partitions.boot * 1024} + ${partitions.root * 1024} + ${partitions.swap * 1024}))MiB 100%

echo "Partitions created successfully!"
echo "Format partitions with: mkfs.ext4 /dev/sda2; mkfs.ext4 /dev/sda3; mkswap /dev/sda4; mkfs.ext4 /dev/sda5"`;
}

export function generateLVMScript(
  partitions: PartitionRecommendation,
  hostname: string = "linux-system"
): string {
  return `#!/bin/bash
# LVM Setup Script - Generated by Linux Partition Calculator
# This script sets up LVM on top of existing partitions

set -e

PV="/dev/sda3"  # Physical volume (usually root partition)
VG_NAME="${hostname}-vg"
LV_ROOT="${hostname}-root"
LV_HOME="${hostname}-home"

echo "Setting up LVM..."

# Create physical volume
sudo pvcreate $PV

# Create volume group
sudo vgcreate $VG_NAME $PV

# Create logical volumes
sudo lvcreate -L ${partitions.root}G -n $LV_ROOT $VG_NAME
sudo lvcreate -L ${partitions.home}G -n $LV_HOME $VG_NAME

echo "LVM setup complete!"
echo "Format logical volumes with: mkfs.ext4 /dev/mapper/$VG_NAME-$LV_ROOT; mkfs.ext4 /dev/mapper/$VG_NAME-$LV_HOME"`;
}

export function getPerformanceTips(
  diskType: DiskType,
  distroId: string
): string[] {
  const disk = DISK_TYPES[diskType];
  return disk.performanceTips;
}


// Validation and Analysis Functions

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export function validatePartitionConfiguration(
  partitions: PartitionRecommendation,
  distroId: string,
  systemPercentage: number
): ValidationResult {
  const distro = DISTRIBUTIONS[distroId];
  const warnings: string[] = [];
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Check if root partition is sufficient
  if (partitions.root < distro.minRootSize) {
    errors.push(
      `Partição raiz (${partitions.root}GB) é menor que o mínimo recomendado (${distro.minRootSize}GB)`
    );
    suggestions.push(
      `Aumente a porcentagem do sistema para pelo menos ${Math.ceil((distro.minRootSize + partitions.efi + partitions.boot + partitions.swap) / partitions.total * 100)}%`
    );
  }

  // Check if root partition is less than recommended
  if (partitions.root < distro.recommendedRootSize) {
    warnings.push(
      `Partição raiz (${partitions.root}GB) é menor que o recomendado (${distro.recommendedRootSize}GB)`
    );
    suggestions.push(
      `Para melhor desempenho, considere aumentar a partição raiz para ${distro.recommendedRootSize}GB`
    );
  }

  // Check if home partition is too small
  if (partitions.home < 10) {
    warnings.push(
      `Partição /home (${partitions.home.toFixed(1)}GB) é muito pequena para armazenar dados`
    );
    suggestions.push(
      `Reduza a porcentagem do sistema para deixar mais espaço para dados`
    );
  }

  // Check if swap is configured
  if (partitions.swap === 0) {
    warnings.push("Swap não está configurado");
    suggestions.push("Ative hibernação ou aumente a RAM para adicionar swap");
  }

  // Check if there's enough free space
  if (partitions.home < partitions.total * 0.1) {
    warnings.push(
      "Menos de 10% do disco disponível para dados pessoais"
    );
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    suggestions,
  };
}

export function generatePartcloneScript(
  partitions: PartitionRecommendation,
  hostname: string = "linux-system"
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
  echo "Total size: $(du -sh $BACKUP_DIR/$BACKUP_NAME)"
}

# Restore function
restore_partitions() {
  if [ -z "$1" ]; then
    echo "Usage: $0 restore <backup_name>"
    exit 1
  fi
  
  RESTORE_PATH="$BACKUP_DIR/$1"
  
  if [ ! -d "$RESTORE_PATH" ]; then
    echo "Backup not found: $RESTORE_PATH"
    exit 1
  fi
  
  echo "WARNING: This will overwrite your partitions!"
  read -p "Continue? (yes/no): " confirm
  
  if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
  fi
  
  echo "Starting partition restore from $RESTORE_PATH..."
  
  # Restore EFI partition
  echo "Restoring EFI partition..."
  sudo partclone.vfat -r -s "$RESTORE_PATH/efi.img" -o /dev/sda1
  
  # Restore Boot partition
  echo "Restoring Boot partition..."
  sudo partclone.ext4 -r -s "$RESTORE_PATH/boot.img" -o /dev/sda2
  
  # Restore Root partition
  echo "Restoring Root partition..."
  sudo partclone.ext4 -r -s "$RESTORE_PATH/root.img" -o /dev/sda3
  
  # Restore Home partition
  echo "Restoring Home partition..."
  sudo partclone.ext4 -r -s "$RESTORE_PATH/home.img" -o /dev/sda5
  
  echo "Restore completed successfully!"
}

# Main
case "$1" in
  backup)
    backup_partitions
    ;;
  restore)
    restore_partitions "$2"
    ;;
  *)
    echo "Usage: $0 {backup|restore <backup_name>}"
    exit 1
    ;;
esac`;
}

export interface SpaceGrowthProjection {
  year: number;
  systemUsage: number;
  homeUsage: number;
  totalUsage: number;
  freeSpace: number;
  warningLevel: boolean;
}

export function calculateSpaceGrowthProjection(
  partitions: PartitionRecommendation,
  distroId: string,
  years: number = 5
): SpaceGrowthProjection[] {
  const projections: SpaceGrowthProjection[] = [];
  
  // Different growth rates by distro (GB per year)
  const growthRates: Record<string, { system: number; home: number }> = {
    ubuntu: { system: 2, home: 50 },
    fedora: { system: 2.5, home: 50 },
    debian: { system: 1.5, home: 40 },
    mint: { system: 2, home: 50 },
    arch: { system: 1, home: 40 },
    opensuse: { system: 2, home: 50 },
    centos: { system: 2, home: 45 },
  };

  const rates = growthRates[distroId] || { system: 2, home: 45 };

  for (let year = 0; year <= years; year++) {
    const systemUsage = Math.min(
      partitions.root + rates.system * year,
      partitions.root + partitions.efi + partitions.boot + partitions.swap
    );
    const homeUsage = Math.min(
      50 + rates.home * year,
      partitions.home
    );
    const totalUsage = systemUsage + homeUsage + partitions.swap;
    const freeSpace = Math.max(0, partitions.total - totalUsage);
    const warningLevel = freeSpace < partitions.total * 0.1;

    projections.push({
      year,
      systemUsage,
      homeUsage,
      totalUsage,
      freeSpace,
      warningLevel,
    });
  }

  return projections;
}

// Social Sharing URLs

export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function getEmailShareUrl(
  subject: string,
  body: string
): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getInstagramShareText(text: string): string {
  // Instagram doesn't have a direct share URL, but we can copy to clipboard
  return text;
}
