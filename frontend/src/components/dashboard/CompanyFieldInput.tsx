import { Controller, type Control, type FieldErrors, type UseFormGetValues } from "react-hook-form";
import {
  authErrorClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
} from "@/constants/tokens/authForm";
import type { CompanyFieldConfig } from "@/lib/dashboard/companyFields";
import { updateCompanyField } from "@/lib/dashboard/companyFields";
import { validateCompanyFieldValue } from "@/lib/dashboard/authValidation";
import { formatCompanyField } from "@/lib/dashboard/inputMasks";
import type { CompanyProfile } from "@/types/dashboard";

function isCompanyFieldRequired(field: CompanyFieldConfig): boolean {
  if (field.required === false) return false;
  if (field.required === true) return true;
  if (field.kind === "number") return false;
  return true;
}

type Props = {
  field: CompanyFieldConfig;
  value: string | number | null;
  error?: string;
  onChange: (key: keyof CompanyProfile, value: string) => void;
  inputClassName?: string;
  labelClassName?: string;
};

function handleNumberChange(
  key: "areaTotalHectares" | "latitude" | "longitude",
  raw: string,
  onChange: (key: keyof CompanyProfile, value: string) => void,
) {
  if (raw === "") {
    onChange(key, key === "areaTotalHectares" ? "0" : "");
    return;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return;
  if (key === "areaTotalHectares") {
    if (n <= 0) return;
    onChange(key, String(n));
    return;
  }
  onChange(key, String(n));
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
      handleNumberChange(key as "areaTotalHectares" | "latitude" | "longitude", raw, onChange);
      return;
    }
    if (kind === "cnpj" || kind === "cpf" || kind === "phone") {
      onChange(key, formatCompanyField(key, raw));
      return;
    }
    onChange(key, raw);
  };

  const inputType =
    kind === "email" ? "email" : kind === "tel" || kind === "phone" ? "tel" : kind === "number" ? "number" : "text";

  const displayValue =
    kind === "number" ? (value === null || Number(value) === 0 ? "" : String(value)) : String(value ?? "");

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
          kind === "cnpj" || kind === "cpf" || kind === "phone" ? "numeric" : undefined
        }
        min={key === "areaTotalHectares" ? 0.01 : undefined}
        step={kind === "number" ? "any" : undefined}
        maxLength={
          kind === "cnpj"
            ? 18
            : kind === "cpf"
              ? 14
              : kind === "phone"
                ? 15
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

type CompanyFieldsGridFormProps = {
  fields: CompanyFieldConfig[];
  control: Control<CompanyProfile>;
  getValues: UseFormGetValues<CompanyProfile>;
  errors: FieldErrors<CompanyProfile>;
};

export function CompanyFieldsGridForm({
  fields,
  control,
  getValues,
  errors,
}: CompanyFieldsGridFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className={field.col === 2 ? "sm:col-span-2" : undefined}>
          <Controller
            name={field.key}
            control={control}
            rules={{
              validate: () => validateCompanyFieldValue(field.key, getValues()) ?? true,
            }}
            render={({ field: rhfField, fieldState }) => (
              <CompanyFieldInput
                field={field}
                value={rhfField.value}
                error={fieldState.error?.message ?? errors[field.key]?.message}
                onChange={(key, value) => {
                  const next = updateCompanyField(getValues(), key, value);
                  rhfField.onChange(next[key]);
                }}
              />
            )}
          />
        </div>
      ))}
    </div>
  );
}
