// Distribution configurations and partition recommendations
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
}

export const DISTRIBUTIONS: Record<string, DistributionConfig> = {
  ubuntu: {
    id: "ubuntu",
    name: "Ubuntu",
    description: "Distribuição baseada em Debian, fácil de usar",
    filesystem: "ext4",
    bootSize: 0.5,
    minRootSize: 30,
    recommendedRootSize: 50,
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
    minRootSize: 30,
    recommendedRootSize: 50,
    supportsSwap: true,
    defaultSwapMultiplier: 1,
    efiRequired: true,
  },
  fedora: {
    id: "fedora",
    name: "Fedora",
    description: "Distribuição moderna com tecnologias recentes",
    filesystem: "btrfs",
    bootSize: 1,
    minRootSize: 40,
    recommendedRootSize: 60,
    supportsSwap: false, // Uses zram by default
    defaultSwapMultiplier: 0,
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
    return 0; // Fedora uses zram
  }

  if (hibernation) {
    // Hibernation requires swap >= RAM
    if (ramGB <= 2) {
      return ramGB * 3;
    } else if (ramGB <= 8) {
      return ramGB * 2;
    } else if (ramGB <= 64) {
      return Math.max(ramGB * 1.5, 4);
    } else {
      return 0; // Not recommended for very large RAM
    }
  } else {
    // Without hibernation
    if (ramGB <= 2) {
      return ramGB * 2;
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
  useMinimum: boolean = false
): PartitionRecommendation {
  const distro = DISTRIBUTIONS[distroId];

  const efiSize = 0.5; // Always 512MB for EFI
  const bootSize = distro.bootSize;
  const swapSize = calculateSwapSize(ramGB, hibernation, distroId);

  const rootSize = useMinimum
    ? distro.minRootSize
    : Math.min(distro.recommendedRootSize, totalDiskGB * 0.2);

  const usedSize = efiSize + bootSize + swapSize + rootSize;
  const homeSize = Math.max(0, totalDiskGB - usedSize);

  return {
    efi: efiSize,
    boot: bootSize,
    root: rootSize,
    swap: swapSize,
    home: homeSize,
    total: totalDiskGB,
  };
}

export function generateKickstartXML(
  distroId: string,
  partitions: PartitionRecommendation,
  hostname: string = "linux-system",
  timezone: string = "UTC"
): string {
  const distro = DISTRIBUTIONS[distroId];

  // Kickstart format for Fedora/CentOS/RHEL
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
    <clearpart type="all"/>
    <autopart type="lvm"/>
    
    <!-- EFI Partition -->
    <partition>
      <mount>/boot/efi</mount>
      <size>${partitions.efi * 1024}</size>
      <fstype>efi</fstype>
    </partition>
    
    <!-- Boot Partition -->
    <partition>
      <mount>/boot</mount>
      <size>${partitions.boot * 1024}</size>
      <fstype>${distro.filesystem}</fstype>
    </partition>
    
    <!-- Root Partition -->
    <partition>
      <mount>/</mount>
      <size>${partitions.root * 1024}</size>
      <fstype>${distro.filesystem}</fstype>
    </partition>
    
    <!-- Swap -->
    ${
      partitions.swap > 0
        ? `<partition>
      <mount>swap</mount>
      <size>${partitions.swap * 1024}</size>
      <fstype>swap</fstype>
    </partition>`
        : ""
    }
    
    <!-- Home Partition -->
    <partition>
      <mount>/home</mount>
      <size>${partitions.home * 1024}</size>
      <fstype>${distro.filesystem}</fstype>
    </partition>
  </partitioning>
  
  <!-- Installation Options -->
  <install>
    <text/>
    <network --onboot yes --bootproto dhcp --noipv6/>
  </install>
  
</kickstart>`;
  }

  // Preseed format for Debian/Ubuntu/Linux Mint
  return `# Preseed configuration for ${distro.name}
# Generated by Linux Partition Calculator

# Localization
d-i debian-installer/locale string en_US.UTF-8
d-i debian-installer/language string en
d-i debian-installer/country string US
d-i debian-installer/keymap select us

# Network configuration
d-i netcfg/choose_interface select auto
d-i netcfg/get_hostname string ${hostname}
d-i netcfg/get_domain string localdomain

# Partitioning
d-i partman-auto/method string regular
d-i partman-auto/choose_recipe select atomic
d-i partman-auto/disk string /dev/sda

# Partition sizes (in MB)
d-i partman-auto/expert_recipe string \\
  boot-root :: \\
    ${Math.round(partitions.efi * 1024)} 512 ${Math.round(partitions.efi * 1024)} fat32 \\
      \$primary{ } \$bootable{ } method{ efi } format{ } . \\
    ${Math.round(partitions.boot * 1024)} 512 ${Math.round(partitions.boot * 1024)} ${distro.filesystem} \\
      \$primary{ } method{ format } format{ } use_filesystem{ } filesystem{ ${distro.filesystem} } mountpoint{ /boot } . \\
    ${Math.round(partitions.root * 1024)} 512 ${Math.round(partitions.root * 1024)} ${distro.filesystem} \\
      \$primary{ } method{ format } format{ } use_filesystem{ } filesystem{ ${distro.filesystem} } mountpoint{ / } . \\
    ${
      partitions.swap > 0
        ? `${Math.round(partitions.swap * 1024)} 512 ${Math.round(partitions.swap * 1024)} linux-swap \\
      method{ swap } format{ } . \\`
        : ""
    }
    ${Math.round(partitions.home * 1024)} 512 -1 ${distro.filesystem} \\
      method{ format } format{ } use_filesystem{ } filesystem{ ${distro.filesystem} } mountpoint{ /home } .

# Timezone
d-i time/zone string ${timezone}

# Root password (change this!)
d-i passwd/root-password password root
d-i passwd/root-password-again password root

# User account
d-i passwd/user-fullname string Linux User
d-i passwd/username string user
d-i passwd/user-password password password
d-i passwd/user-password-again password password

# Apt setup
d-i apt-setup/restricted boolean true
d-i apt-setup/universe boolean true

# Package selection
tasksel tasksel/first multiselect standard
d-i pkgsel/include string openssh-server build-essential

# Grub bootloader
d-i grub-installer/only_debian boolean true
d-i grub-installer/with_other_os boolean true

# Finish
d-i finish-install/reboot_in_seconds integer 10
`;
}

export function generateUEFIBootScript(
  partitions: PartitionRecommendation
): string {
  return `#!/bin/bash
# UEFI Boot Configuration Script
# Generated by Linux Partition Calculator

# Create partition table (GPT for UEFI)
parted -s /dev/sda mklabel gpt

# Create EFI partition
parted -s /dev/sda mkpart primary fat32 1MiB ${partitions.efi + 1}GiB
parted -s /dev/sda set 1 esp on
mkfs.fat -F32 /dev/sda1

# Create boot partition
parted -s /dev/sda mkpart primary ext4 ${partitions.efi + 1}GiB ${partitions.efi + partitions.boot + 1}GiB
mkfs.ext4 /dev/sda2

# Create root partition
parted -s /dev/sda mkpart primary ext4 ${partitions.efi + partitions.boot + 1}GiB ${partitions.efi + partitions.boot + partitions.root + 1}GiB
mkfs.ext4 /dev/sda3

# Create swap partition (if needed)
${
  partitions.swap > 0
    ? `parted -s /dev/sda mkpart primary linux-swap ${partitions.efi + partitions.boot + partitions.root + 1}GiB ${partitions.efi + partitions.boot + partitions.root + partitions.swap + 1}GiB
mkswap /dev/sda4`
    : ""
}

# Create home partition
parted -s /dev/sda mkpart primary ext4 ${partitions.efi + partitions.boot + partitions.root + partitions.swap + 1}GiB 100%
mkfs.ext4 /dev/sda${partitions.swap > 0 ? "5" : "4"}

echo "Partitions created successfully!"
`;
}
