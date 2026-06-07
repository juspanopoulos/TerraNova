import { digitsOnly } from "@/lib/dashboard/inputMasks";
import type { CompanyProfile } from "@/types/dashboard";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const HAS_UPPER = /[A-Z]/;
const HAS_LOWER = /[a-z]/;
const HAS_NUMBER = /\d/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export const PASSWORD_RULES_HINT =
  "Mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.";

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
  if (at <= 0 || at === trimmed.length - 1) {
    return "E-mail inválido. Ex.: nome@empresa.com.br";
  }
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return "E-mail inválido. Ex.: nome@empresa.com.br";
  }
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return "E-mail inválido. Ex.: nome@empresa.com.br";
  }
  if (!EMAIL_RE.test(trimmed)) return "E-mail inválido. Ex.: nome@empresa.com.br";
  return undefined;
}

export function validatePassword(
  password: string,
  options: { strict?: boolean } = {},
): string | undefined {
  if (!password) return "Informe sua senha.";

  if (!options.strict) {
    return undefined;
  }

  if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  if (!HAS_UPPER.test(password)) return "Inclua pelo menos uma letra maiúscula.";
  if (!HAS_LOWER.test(password)) return "Inclua pelo menos uma letra minúscula.";
  if (!HAS_NUMBER.test(password)) return "Inclua pelo menos um número.";
  if (!HAS_SPECIAL.test(password)) {
    return "Inclua pelo menos um caractere especial (ex.: ! @ # $ %).";
  }
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
  if (!d) return undefined;
  if (d.length !== 14) return "CNPJ deve ter 14 dígitos.";
  return undefined;
}

function validateCpf(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return "Informe o CPF.";
  if (d.length !== 11) return "CPF deve ter 11 dígitos.";
  return undefined;
}

function validatePhoneRequired(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return "Informe o celular.";
  if (d.length < 10) return "Celular incompleto.";
  return undefined;
}

function validatePhoneOptional(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return undefined;
  if (d.length < 10) return "Telefone incompleto.";
  return undefined;
}

function validateZipCode(value: string): string | undefined {
  const d = digitsOnly(value);
  if (!d) return "Informe o CEP.";
  if (d.length !== 8) return "CEP deve ter 8 dígitos.";
  return undefined;
}

export function validateCompanyProfile(company: CompanyProfile): CompanyFieldErrors {
  const errors: CompanyFieldErrors = {};

  if (!company.tradeName.trim()) errors.tradeName = "Informe o nome fantasia.";
  if (!company.legalName.trim()) errors.legalName = "Informe a razão social.";

  const cnpjError = validateCnpj(company.cnpj);
  if (cnpjError) errors.cnpj = cnpjError;

  const cpfError = validateCpf(company.cpf);
  if (cpfError) errors.cpf = cpfError;

  if (!company.responsibleName.trim()) errors.responsibleName = "Informe o responsável.";

  const emailError = validateEmail(company.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhoneOptional(company.phone);
  if (phoneError) errors.phone = phoneError;

  const mobileError = validatePhoneRequired(company.mobile);
  if (mobileError) errors.mobile = mobileError;

  if (!company.street.trim()) errors.street = "Informe a rua ou logradouro.";
  if (!company.streetNumber.trim()) errors.streetNumber = "Informe o número.";
  if (!company.neighborhood.trim()) errors.neighborhood = "Informe o bairro.";
  if (!company.city.trim()) errors.city = "Informe a cidade.";
  if (!company.state.trim()) errors.state = "Selecione o estado (UF).";

  const zipError = validateZipCode(company.zipCode);
  if (zipError) errors.zipCode = zipError;

  if (!company.farmName.trim()) errors.farmName = "Informe o nome da fazenda.";
  if (!company.farmRegion.trim()) errors.farmRegion = "Informe a região da fazenda.";
  if (company.totalAreaHa <= 0) {
    errors.totalAreaHa = "A área total deve ser maior que zero.";
  }
  if (company.activeSectors < 0) {
    errors.activeSectors = "Setores ativos não pode ser negativo.";
  }

  return errors;
}

export function hasFieldErrors<T extends object>(errors: T): boolean {
  return Object.keys(errors).length > 0;
}

export function formatStreetAddress(company: Pick<CompanyProfile, "street" | "streetNumber" | "neighborhood">) {
  const parts = [
    company.street.trim(),
    company.streetNumber.trim() ? `nº ${company.streetNumber.trim()}` : "",
    company.neighborhood.trim(),
  ].filter(Boolean);
  return parts.join(", ");
}
