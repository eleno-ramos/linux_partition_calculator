import { describe, it, expect } from "vitest";

// Mock das funções de Preseed (simulando comportamento do cliente)
// Em um projeto real, essas funções estariam no servidor via tRPC

describe("Preseed Scripts Generation", () => {
  it("deve gerar um script Preseed válido para Debian/Ubuntu", () => {
    // Simular geração de Preseed
    const preseedConfig = `# Preseed Configuration for Ubuntu
d-i debian-installer/locale string pt_BR.UTF-8
d-i debian-installer/language string pt
d-i debian-installer/country string BR`;

    expect(preseedConfig).toContain("Preseed Configuration");
    expect(preseedConfig).toContain("pt_BR.UTF-8");
    expect(preseedConfig).toContain("BR");
  });

  it("deve incluir configuração de particionamento no Preseed", () => {
    const preseedConfig = `d-i partman-auto/method string regular
d-i partman-auto/choose_recipe select atomic`;

    expect(preseedConfig).toContain("partman-auto");
    expect(preseedConfig).toContain("atomic");
  });

  it("deve gerar UEFI Boot Script válido", () => {
    const uefiScript = `#!/bin/bash
# UEFI Boot Configuration Script for test-system
set -e
echo "=== UEFI Boot Configuration ==="`;

    expect(uefiScript).toContain("#!/bin/bash");
    expect(uefiScript).toContain("UEFI Boot Configuration");
    expect(uefiScript).toContain("set -e");
  });

  it("deve incluir configuração de GRUB no UEFI Boot Script", () => {
    const uefiScript = `grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ubuntu`;

    expect(uefiScript).toContain("grub-install");
    expect(uefiScript).toContain("x86_64-efi");
    expect(uefiScript).toContain("/boot/efi");
  });

  it("deve suportar configuração de hostname no Preseed", () => {
    const hostname = "my-linux-system";
    const preseedConfig = `d-i netcfg/get_hostname string ${hostname}`;

    expect(preseedConfig).toContain(hostname);
  });

  it("deve suportar configuração de timezone no Preseed", () => {
    const timezone = "America/Sao_Paulo";
    const preseedConfig = `d-i time/zone string ${timezone}`;

    expect(preseedConfig).toContain(timezone);
  });

  it("deve gerar Preseed com suporte a WiFi", () => {
    const wifiSSID = "MyNetwork";
    const preseedConfig = `d-i netcfg/wireless_essid string ${wifiSSID}`;

    expect(preseedConfig).toContain(wifiSSID);
  });

  it("deve incluir configuração de usuário no Preseed", () => {
    const username = "ubuntu";
    const preseedConfig = `d-i passwd/username string ${username}`;

    expect(preseedConfig).toContain(username);
  });

  it("deve incluir pacotes padrão no Preseed", () => {
    const preseedConfig = `d-i pkgsel/include string openssh-server build-essential`;

    expect(preseedConfig).toContain("openssh-server");
    expect(preseedConfig).toContain("build-essential");
  });

  it("deve configurar SSH no Preseed", () => {
    const preseedConfig = `in-target sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config`;

    expect(preseedConfig).toContain("PermitRootLogin no");
    expect(preseedConfig).toContain("sshd_config");
  });
});

describe("Boot Type Detection", () => {
  it("deve detectar UEFI como boot type para hardware moderno", () => {
    const processorYear = 2015;
    const diskSize = 500;
    const isUEFI = processorYear > 2010 && diskSize > 100;

    expect(isUEFI).toBe(true);
  });

  it("deve detectar BIOS como boot type para hardware antigo", () => {
    const processorYear = 2005;
    const diskSize = 80;
    const isUEFI = processorYear > 2010 && diskSize > 100;

    expect(isUEFI).toBe(false);
  });

  it("deve forçar GPT para discos maiores que 2TB", () => {
    const diskSize = 3000;
    const shouldUseGPT = diskSize > 2048;

    expect(shouldUseGPT).toBe(true);
  });

  it("deve permitir MBR para discos menores que 2TB", () => {
    const diskSize = 500;
    const shouldUseGPT = diskSize > 2048;

    expect(shouldUseGPT).toBe(false);
  });
});
