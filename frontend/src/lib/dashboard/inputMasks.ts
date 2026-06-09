import {
  formatCnpj,
  formatCpf,
  formatPhone,
} from "@/utils/format/masks";

export {
  digitsOnly,
  formatCnpj,
  formatCpf,
  formatPhone,
} from "@/utils/format/masks";

export function formatCompanyField(key: string, value: string): string {
  switch (key) {
    case "cnpj":
      return formatCnpj(value);
    case "cpf":
      return formatCpf(value);
    case "telefoneEmpresa":
      return formatPhone(value);
    default:
      return value;
  }
}
