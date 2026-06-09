import type { CompanyProfile } from "@/types/dashboard";

export type CompanyFieldKind = "text" | "email" | "tel" | "number" | "cnpj" | "cpf" | "phone";

export type CompanyFieldConfig = {
  key: keyof CompanyProfile;
  label: string;
  kind: CompanyFieldKind;
  col?: 1 | 2;
  placeholder?: string;
  required?: boolean;
};

export const COMPANY_FIELDS: CompanyFieldConfig[] = [
  { key: "nomeEmpresa", label: "Empresa", kind: "text", col: 1, placeholder: "Terra Nova Agro" },
  { key: "cnpj", label: "CNPJ", kind: "cnpj", col: 1, placeholder: "00.000.000/0000-00" },
  { key: "emailEmpresa", label: "E-mail da empresa", kind: "email", col: 1, placeholder: "contato@empresa.com.br" },
  { key: "telefoneEmpresa", label: "Telefone", kind: "phone", col: 1, placeholder: "(00) 0000-0000", required: false },
  { key: "nomeUsuario", label: "Usuário responsável", kind: "text", col: 1, placeholder: "Nome do usuário" },
  { key: "emailUsuario", label: "E-mail do usuário", kind: "email", col: 1, placeholder: "usuario@empresa.com.br" },
  { key: "cpf", label: "CPF", kind: "cpf", col: 1, placeholder: "000.000.000-00", required: false },
  { key: "nomePropriedade", label: "Propriedade", kind: "text", col: 1, placeholder: "Fazenda Exemplo" },
  { key: "localizacao", label: "Localização", kind: "text", col: 2, placeholder: "Cidade, UF" },
  { key: "latitude", label: "Latitude", kind: "number", col: 1, placeholder: "-23.000000", required: false },
  { key: "longitude", label: "Longitude", kind: "number", col: 1, placeholder: "-46.000000", required: false },
  { key: "areaTotalHectares", label: "Área total (ha)", kind: "number", col: 1, placeholder: "0", required: false },
];

export const COMPANY_FIELDS_EMPRESA = {
  empresa: COMPANY_FIELDS.slice(0, 7),
  localizacao: COMPANY_FIELDS.slice(7),
};

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  idEmpresa: null,
  idPropriedade: null,
  idUsuario: null,
  nomeEmpresa: "",
  cnpj: "",
  emailEmpresa: "",
  telefoneEmpresa: "",
  nomePropriedade: "",
  localizacao: "",
  latitude: null,
  longitude: null,
  areaTotalHectares: 0,
  nomeUsuario: "",
  emailUsuario: "",
  cpf: "",
  perfil: "ADMIN",
  status: "ATIVO",
};

export function companyProfileFromRegister(
  credentials: { fullName: string; email: string },
  draft: CompanyProfile,
): CompanyProfile {
  return {
    ...draft,
    nomeUsuario: draft.nomeUsuario.trim() || credentials.fullName,
    emailUsuario: draft.emailUsuario.trim() || credentials.email,
  };
}

export function updateCompanyField(
  current: CompanyProfile,
  key: keyof CompanyProfile,
  value: string,
): CompanyProfile {
  if (key === "areaTotalHectares") {
    const n = Number(value);
    return { ...current, areaTotalHectares: Number.isFinite(n) && n > 0 ? n : 0 };
  }
  if (key === "latitude" || key === "longitude") {
    const n = Number(value);
    return { ...current, [key]: Number.isFinite(n) ? n : null };
  }
  return { ...current, [key]: value };
}
