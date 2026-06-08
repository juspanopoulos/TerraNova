import {
  formatCnpj,
  formatCpf,
  formatPhone,
  formatZipCode,
} from "@/utils/format/masks";

export {
  digitsOnly,
  formatCnpj,
  formatCpf,
  formatPhone,
  formatZipCode,
} from "@/utils/format/masks";

export function formatCompanyField(key: string, value: string): string {
  switch (key) {
    case "cnpj":
      return formatCnpj(value);
    case "cpf":
      return formatCpf(value);
    case "phone":
    case "mobile":
      return formatPhone(value);
    case "zipCode":
      return formatZipCode(value);
    default:
      return value;
  }
}
