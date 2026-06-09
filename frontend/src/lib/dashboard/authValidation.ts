import { digitsOnly } from "@/lib/dashboard/inputMasks";
import type { CompanyProfile } from "@/types/dashboard";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const HAS_UPPER = /[A-Z]/;
const HAS_LOWER = /[a-z]/;
const HAS_NUMBER = /\d/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export const PASSWORD_RULES_HINT =
  "Minimo 8 caracteres, com letra maiuscula, minuscula, numero e caractere especial.";

export type AuthFieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
};

export type CompanyFieldErrors = Partial<Record<keyof CompanyProfile, string>>;

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return "Informe seu e-mail.";
  if (trimmed.length > 254) return "E-mail muito longo.";
  const at = trimmed.indexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return "E-mail invalido. Ex.: nome@empresa.com.br";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return "E-mail invalido. Ex.: nome@empresa.com.br";
  }
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return "E-mail invalido. Ex.: nome@empresa.com.br";
  }
  if (!EMAIL_RE.test(trimmed)) return "E-mail invalido. Ex.: nome@empresa.com.br";
  return undefined;
}

export function validatePassword(
  password: string,
  options: { strict?: boolean } = {},
): string | undefined {
  if (!password) return "Informe sua senha.";
  if (!options.strict) return undefined;
  if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  if (!HAS_UPPER.test(password)) return "Inclua pelo menos uma letra maiuscula.";
  if (!HAS_LOWER.test(password)) return "Inclua pelo menos uma letra minuscula.";
  if (!HAS_NUMBER.test(password)) return "Inclua pelo menos um numero.";
  if (!HAS_SPECIAL.test(password)) return "Inclua pelo menos um caractere especial (ex.: ! @ # $ %).";
  return undefined;
}

export function validateFullName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return "Informe seu nome.";
  if (trimmed.length < 2) return "Nome muito curto.";
  return undefined;
}

export function validateLoginForm(email: string, password: string): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateRegisterStep1(
  fullName: string,
  email: string,
  password: string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const nameError = validateFullName(fullName);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password, { strict: true });
  if (nameError) errors.fullName = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

function validateCnpj(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return "Informe o CNPJ.";
  if (d.length !== 14) return "CNPJ deve ter 14 digitos.";
  return undefined;
}

function validateCpfOptional(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return undefined;
  if (d.length !== 11) return "CPF deve ter 11 digitos.";
  return undefined;
}

function validatePhoneOptional(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return undefined;
  if (d.length < 10) return "Telefone incompleto.";
  return undefined;
}

function validateLatitude(value: number | null): string | undefined {
  if (value === null) return undefined;
  if (value < -90 || value > 90) return "Latitude deve estar entre -90 e 90.";
  return undefined;
}

function validateLongitude(value: number | null): string | undefined {
  if (value === null) return undefined;
  if (value < -180 || value > 180) return "Longitude deve estar entre -180 e 180.";
  return undefined;
}

export function validateCompanyProfile(company: CompanyProfile): CompanyFieldErrors {
  const errors: CompanyFieldErrors = {};

  if (!company.nomeEmpresa.trim()) errors.nomeEmpresa = "Informe a empresa.";
  const cnpjError = validateCnpj(company.cnpj);
  if (cnpjError) errors.cnpj = cnpjError;

  const emailEmpresaError = validateEmail(company.emailEmpresa);
  if (emailEmpresaError) errors.emailEmpresa = emailEmpresaError;

  const phoneError = validatePhoneOptional(company.telefoneEmpresa);
  if (phoneError) errors.telefoneEmpresa = phoneError;

  if (!company.nomeUsuario.trim()) errors.nomeUsuario = "Informe o usuario responsavel.";
  const emailUsuarioError = validateEmail(company.emailUsuario);
  if (emailUsuarioError) errors.emailUsuario = emailUsuarioError;

  const cpfError = validateCpfOptional(company.cpf);
  if (cpfError) errors.cpf = cpfError;

  if (!company.nomePropriedade.trim()) errors.nomePropriedade = "Informe a propriedade.";
  if (!company.localizacao.trim()) errors.localizacao = "Informe a localizacao.";

  const latitudeError = validateLatitude(company.latitude);
  if (latitudeError) errors.latitude = latitudeError;

  const longitudeError = validateLongitude(company.longitude);
  if (longitudeError) errors.longitude = longitudeError;

  if (company.areaTotalHectares < 0) {
    errors.areaTotalHectares = "A area total nao pode ser negativa.";
  }

  return errors;
}

export function hasFieldErrors<T extends object>(errors: T): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCompanyFieldValue(
  key: keyof CompanyProfile,
  company: CompanyProfile,
): string | undefined {
  return validateCompanyProfile(company)[key];
}

export function toFieldValidator(validate: (value: string) => string | undefined) {
  return (value: string) => validate(value) ?? true;
}
