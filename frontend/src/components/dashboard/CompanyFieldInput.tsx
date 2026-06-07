import { CustomSelect } from "@/components/dashboard/DashboardPickers";
import {
  authErrorClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
} from "@/constants/tokens/authForm";
import { BRAZIL_UFS } from "@/lib/dashboard/brazilStates";
import type { CompanyFieldConfig } from "@/lib/dashboard/companyFields";
import { formatCompanyField } from "@/lib/dashboard/inputMasks";
import type { CompanyProfile } from "@/types/dashboard";

const UF_OPTIONS = BRAZIL_UFS.map((uf) => ({ value: uf, label: uf }));

function isCompanyFieldRequired(field: CompanyFieldConfig): boolean {
  if (field.required === false) return false;
  if (field.required === true) return true;
  if (field.kind === "cnpj" || field.kind === "number") return false;
  return true;
}

type Props = {
  field: CompanyFieldConfig;
  value: string | number;
  error?: string;
  onChange: (key: keyof CompanyProfile, value: string) => void;
  inputClassName?: string;
  labelClassName?: string;
};

function handleNumberChange(
  key: "totalAreaHa" | "activeSectors",
  raw: string,
  onChange: (key: keyof CompanyProfile, value: string) => void,
) {
  if (raw === "") {
    onChange(key, "0");
    return;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return;
  if (key === "totalAreaHa") {
    if (n <= 0) return;
    onChange(key, String(n));
    return;
  }
  onChange(key, String(Math.max(0, Math.floor(n))));
}

export function CompanyFieldInput({
  field,
  value,
  error,
  onChange,
  inputClassName = authInputClass,
  labelClassName = authLabelClass,
}: Props) {
  const { key, label, kind, placeholder } = field;
  const hasError = Boolean(error);
  const inputClass = [inputClassName, hasError ? authInputErrorClass : ""].filter(Boolean).join(" ");
  const isRequired = isCompanyFieldRequired(field);

  const handleChange = (raw: string) => {
    if (kind === "number") {
      handleNumberChange(key as "totalAreaHa" | "activeSectors", raw, onChange);
      return;
    }
    if (kind === "cnpj" || kind === "cpf" || kind === "phone" || kind === "cep") {
      onChange(key, formatCompanyField(key, raw));
      return;
    }
    onChange(key, raw);
  };

  if (kind === "uf") {
    return (
      <div className="block">
        <span className={labelClassName}>{label}</span>
        <div className={`dashboard-root mt-1.5 ${hasError ? "rounded-lg ring-2 ring-red-400/60" : ""}`}>
          <CustomSelect
            id={`company-${key}`}
            value={String(value)}
            onChange={(uf) => onChange(key, uf)}
            placeholder="Selecione a UF"
            options={UF_OPTIONS}
          />
        </div>
        {hasError && (
          <p id={`${key}-error`} className={authErrorClass} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  const inputType =
    kind === "email" ? "email" : kind === "tel" || kind === "phone" ? "tel" : kind === "number" ? "number" : "text";

  const displayValue = kind === "number" ? (Number(value) > 0 || key === "activeSectors" ? String(value) : "") : String(value);

  return (
    <label className="block">
      <span className={labelClassName}>{label}</span>
      <input
        type={inputType}
        required={isRequired}
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        className={inputClass}
        placeholder={placeholder}
        inputMode={
          kind === "cnpj" || kind === "cpf" || kind === "cep" || kind === "phone" || key === "mobile"
            ? "numeric"
            : undefined
        }
        min={key === "totalAreaHa" ? 0.01 : key === "activeSectors" ? 0 : undefined}
        step={key === "totalAreaHa" ? "any" : key === "activeSectors" ? 1 : undefined}
        maxLength={
          kind === "cnpj"
            ? 18
            : kind === "cpf"
              ? 14
              : kind === "phone" || key === "mobile"
                ? 15
                : kind === "cep"
                  ? 9
                  : undefined
        }
        aria-invalid={hasError}
        aria-describedby={hasError ? `${key}-error` : undefined}
      />
      {hasError && (
        <p id={`${key}-error`} className={authErrorClass} role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export function CompanyFieldsGrid({
  fields,
  draft,
  errors,
  onChange,
}: {
  fields: CompanyFieldConfig[];
  draft: CompanyProfile;
  errors: Partial<Record<keyof CompanyProfile, string>>;
  onChange: (key: keyof CompanyProfile, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className={field.col === 2 ? "sm:col-span-2" : undefined}>
          <CompanyFieldInput
            field={field}
            value={draft[field.key]}
            error={errors[field.key]}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
}
