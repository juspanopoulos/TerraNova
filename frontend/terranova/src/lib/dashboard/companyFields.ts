import type { CompanyProfile } from "@/types/dashboard";

export type CompanyFieldKind =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "cnpj"
  | "cpf"
  | "phone"
  | "cep"
  | "uf";

export type CompanyFieldConfig = {
  key: keyof CompanyProfile;
  label: string;
  kind: CompanyFieldKind;
  col?: 1 | 2;
  placeholder?: string;
  required?: boolean;
};

/** Campos na ordem do formulário (grid 2 colunas no cadastro e em Empresa). */
export const COMPANY_FIELDS: CompanyFieldConfig[] = [
  { key: "tradeName", label: "Nome fantasia", kind: "text", col: 1, placeholder: "Terra Nova" },
  { key: "legalName", label: "Razão social", kind: "text", col: 1, placeholder: "Terra Nova Agropecuária Ltda." },
  { key: "cnpj", label: "CNPJ", kind: "cnpj", col: 1, placeholder: "00.000.000/0000-00", required: false },
  { key: "cpf", label: "CPF do responsável", kind: "cpf", col: 1, placeholder: "000.000.000-00" },
  { key: "responsibleName", label: "Responsável", kind: "text", col: 1, placeholder: "Nome do responsável" },
  { key: "email", label: "E-mail", kind: "email", col: 1, placeholder: "contato@empresa.com.br" },
  { key: "phone", label: "Telefone", kind: "phone", col: 1, placeholder: "(00) 0000-0000", required: false },
  { key: "mobile", label: "Celular", kind: "phone", col: 1, placeholder: "(00) 00000-0000", required: true },
  { key: "street", label: "Rua / logradouro", kind: "text", col: 2, placeholder: "Rua das Flores" },
  { key: "streetNumber", label: "Número", kind: "text", col: 1, placeholder: "123" },
  { key: "neighborhood", label: "Bairro", kind: "text", col: 1, placeholder: "Centro" },
  { key: "city", label: "Cidade", kind: "text", col: 1, placeholder: "Cidade" },
  { key: "state", label: "Estado (UF)", kind: "uf", col: 1 },
  { key: "zipCode", label: "CEP", kind: "cep", col: 1, placeholder: "00000-000" },
  { key: "farmName", label: "Nome da fazenda", kind: "text", col: 1, placeholder: "Fazenda Exemplo" },
  { key: "farmRegion", label: "Região da fazenda", kind: "text", col: 1, placeholder: "Sul de Minas" },
  { key: "totalAreaHa", label: "Área total (ha)", kind: "number", col: 1, placeholder: "0" },
  { key: "activeSectors", label: "Setores ativos", kind: "number", col: 1, placeholder: "0" },
];

export const COMPANY_FIELDS_EMPRESA = {
  empresa: COMPANY_FIELDS.slice(0, 7),
  localizacao: COMPANY_FIELDS.slice(7),
};

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  legalName: "",
  tradeName: "",
  cnpj: "",
  cpf: "",
  email: "",
  phone: "",
  mobile: "",
  street: "",
  streetNumber: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  farmName: "",
  farmRegion: "",
  totalAreaHa: 0,
  activeSectors: 0,
  responsibleName: "",
};

export function companyProfileFromRegister(
  credentials: { fullName: string; email: string },
  draft: CompanyProfile,
): CompanyProfile {
  return {
    ...draft,
    responsibleName: draft.responsibleName.trim() || credentials.fullName,
    email: draft.email.trim() || credentials.email,
  };
}

export function updateCompanyField(
  current: CompanyProfile,
  key: keyof CompanyProfile,
  value: string,
): CompanyProfile {
  if (key === "totalAreaHa") {
    const n = Number(value);
    return {
      ...current,
      totalAreaHa: Number.isFinite(n) && n > 0 ? n : 0,
    };
  }
  if (key === "activeSectors") {
    const n = Number(value);
    return {
      ...current,
      activeSectors: Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0,
    };
  }
  return { ...current, [key]: value };
}
