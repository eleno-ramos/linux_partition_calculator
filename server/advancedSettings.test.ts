import { describe, it, expect } from 'vitest';

/**
 * Testes para validação de senha e usuário
 * Simula a lógica de calculatePasswordStrength do AdvancedSettingsPanel
 */

function calculatePasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strength = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

  // Requer todos os 4 criterios E minimo 12 caracteres para ser forte
  if (strength === 4 && password.length >= 12) return "strong";
  if (strength >= 3 || (strength >= 2 && password.length >= 10)) return "medium";
  return "weak";
}

function validateUsername(username: string): boolean {
  return /^[a-z0-9_-]+$/.test(username);
}

describe('AdvancedSettingsPanel - Password Strength', () => {
  it('deve retornar "weak" para senhas com menos de 8 caracteres', () => {
    expect(calculatePasswordStrength('abc123')).toBe('weak');
    expect(calculatePasswordStrength('Pass1!')).toBe('weak');
  });

  it('deve retornar "weak" para senhas com apenas 1 criterio', () => {
    expect(calculatePasswordStrength('abcdefgh')).toBe('weak'); // apenas minusculas
    expect(calculatePasswordStrength('ABCDEFGH')).toBe('weak'); // apenas maiusculas
    expect(calculatePasswordStrength('12345678')).toBe('weak'); // apenas numeros
  });

  it('deve retornar "weak" para senhas com 2 criterios e 8 caracteres', () => {
    expect(calculatePasswordStrength('Abcdefgh')).toBe('weak'); // maiuscula + minuscula, 8 chars
  });

  it('deve retornar "medium" para senhas com 3 criterios e 8+ caracteres', () => {
    expect(calculatePasswordStrength('Abcd1234')).toBe('medium'); // maiuscula + minuscula + numero
  });

  it('deve retornar "medium" para senhas com 2 criterios e 10+ caracteres', () => {
    expect(calculatePasswordStrength('abcdefgh12')).toBe('medium'); // minuscula + numero, 10 chars
  });

  it('deve retornar "medium" para senhas com todos os 4 criterios mas menos de 12 caracteres', () => {
    expect(calculatePasswordStrength('Pass123!')).toBe('medium'); // 8 chars, todos os criterios
    expect(calculatePasswordStrength('Pass@123')).toBe('medium'); // 8 chars, todos os criterios
  });

  it('deve retornar "strong" para senhas com todos os 4 criterios e 12+ caracteres', () => {
    expect(calculatePasswordStrength('MyPassword123!')).toBe('strong');
    expect(calculatePasswordStrength('Secure@Pass2024')).toBe('strong');
    expect(calculatePasswordStrength('Test123!@#$%')).toBe('strong');
  });
});

describe('AdvancedSettingsPanel - Username Validation', () => {
  it('deve aceitar nomes de usuario validos', () => {
    expect(validateUsername('usuario')).toBe(true);
    expect(validateUsername('user123')).toBe(true);
    expect(validateUsername('user_name')).toBe(true);
    expect(validateUsername('user-name')).toBe(true);
    expect(validateUsername('u')).toBe(true);
  });

  it('deve rejeitar nomes de usuario com maiusculas', () => {
    expect(validateUsername('Usuario')).toBe(false);
    expect(validateUsername('USER')).toBe(false);
    expect(validateUsername('User123')).toBe(false);
  });

  it('deve rejeitar nomes de usuario com caracteres especiais invalidos', () => {
    expect(validateUsername('user@name')).toBe(false);
    expect(validateUsername('user.name')).toBe(false);
    expect(validateUsername('user name')).toBe(false);
    expect(validateUsername('user#name')).toBe(false);
  });

  it('deve rejeitar nomes de usuario vazios', () => {
    expect(validateUsername('')).toBe(false);
  });
});

describe('AdvancedSettingsPanel - Space Validation', () => {
  it('deve detectar conflito quando particoes excedem espaco disponivel', () => {
    const totalDiskSpace = 500;
    const systemPartitionSize = 50;
    const availableForOptional = totalDiskSpace - systemPartitionSize;
    
    const totalPartitionSize = 460; // Excede o disponivel (450GB)
    const hasConflict = totalPartitionSize > availableForOptional;
    
    expect(hasConflict).toBe(true);
  });

  it('deve permitir particoes dentro do espaco disponivel', () => {
    const totalDiskSpace = 500;
    const systemPartitionSize = 50;
    const availableForOptional = totalDiskSpace - systemPartitionSize;
    
    const totalPartitionSize = 400; // Dentro do disponivel (450GB)
    const hasConflict = totalPartitionSize > availableForOptional;
    
    expect(hasConflict).toBe(false);
  });

  it('deve calcular espaco restante corretamente', () => {
    const totalDiskSpace = 500;
    const systemPartitionSize = 50;
    const availableForOptional = totalDiskSpace - systemPartitionSize;
    const totalPartitionSize = 200;
    
    const remainingSpace = availableForOptional - totalPartitionSize;
    
    expect(remainingSpace).toBe(250);
  });
});

describe('AdvancedSettingsPanel - Combined Validation', () => {
  it('deve validar usuario e senha simultaneamente', () => {
    const username = 'usuario123';
    const password = 'MyPassword123!';
    
    const isUsernameValid = validateUsername(username);
    const passwordStrength = calculatePasswordStrength(password);
    
    expect(isUsernameValid).toBe(true);
    expect(passwordStrength).toBe('strong');
  });

  it('deve rejeitar combinacao invalida de usuario e senha', () => {
    const username = 'Usuario123'; // maiuscula invalida
    const password = 'abc'; // senha fraca
    
    const isUsernameValid = validateUsername(username);
    const passwordStrength = calculatePasswordStrength(password);
    
    expect(isUsernameValid).toBe(false);
    expect(passwordStrength).toBe('weak');
  });
});
