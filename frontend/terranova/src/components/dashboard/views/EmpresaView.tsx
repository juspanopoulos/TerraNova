import { useState } from "react";
import { Building2, Check, MapPin, Pencil, X } from "lucide-react";
import { CompanyFieldInput } from "@/components/dashboard/CompanyFieldInput";
import { DashboardCard } from "@/components/dashboard/ui";
import {
  btnClick,
  btnSecondary,
  btnSecondaryMuted,
  gridSplit2,
  labelMuted,
  sectionTitle,
  textFaint,
  textMuted,
  textPrimary,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { formatStreetAddress } from "@/lib/dashboard/authValidation";
import { COMPANY_FIELDS_EMPRESA, updateCompanyField } from "@/lib/dashboard/companyFields";
import type { CompanyProfile } from "@/types/dashboard";

export function EmpresaView() {
  const { company, updateCompany } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CompanyProfile>(company);
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setDraft(company);
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    setDraft(company);
    setEditing(false);
  };

  const save = () => {
    updateCompany(draft);
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const updateField = (key: keyof CompanyProfile, value: string) => {
    setDraft((current) => updateCompanyField(current, key, value));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={labelMuted}>Cadastro</p>
            <h2 className={`mt-1 ${sectionTitle}`}>Dados da empresa</h2>
            <p className={`mt-1 text-sm ${textMuted}`}>
              Informações cadastradas da propriedade e da empresa responsável.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {saved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-verde-floresta/10 px-3 py-1 text-xs font-semibold text-verde-floresta">
                <Check className="size-3.5" aria-hidden />
                Salvo
              </span>
            )}
            {!editing ? (
              <button type="button" onClick={startEdit} className={`${btnClick} ${btnSecondary}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </button>
            ) : (
              <>
                <button type="button" onClick={cancelEdit} className={`${btnClick} ${btnSecondaryMuted}`}>
                  <X className="size-4" aria-hidden />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={save}
                  className={`${btnClick} inline-flex items-center gap-2 rounded-lg bg-verde-floresta px-3 py-2 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90`}
                >
                  <Check className="size-4" aria-hidden />
                  Salvar
                </button>
              </>
            )}
          </div>
        </div>
      </DashboardCard>

      <div className={gridSplit2}>
        <DashboardCard>
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="size-4 text-verde-floresta" aria-hidden />
            <p className={`${labelMuted} mb-0`}>Empresa</p>
          </div>
          {editing ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COMPANY_FIELDS_EMPRESA.empresa.map((field) => (
                <div key={field.key} className={field.col === 2 ? "sm:col-span-2" : undefined}>
                  <CompanyFieldInput
                    field={field}
                    value={draft[field.key]}
                    onChange={updateField}
                    inputClassName="w-full rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm text-[var(--db-text)] outline-none focus:border-verde-floresta/40 focus:ring-2 focus:ring-verde-floresta/15"
                    labelClassName="text-xs font-bold uppercase tracking-wide text-[var(--db-text-muted)]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <dl className="space-y-4">
              {COMPANY_FIELDS_EMPRESA.empresa.map((field) => (
                <FieldRow key={field.key} label={field.label} value={String(draft[field.key])} />
              ))}
            </dl>
          )}
        </DashboardCard>

        <DashboardCard>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-4 text-verde-floresta" aria-hidden />
            <p className={`${labelMuted} mb-0`}>Localização e propriedade</p>
          </div>
          {editing ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COMPANY_FIELDS_EMPRESA.localizacao.map((field) => (
                <div key={field.key} className={field.col === 2 ? "sm:col-span-2" : undefined}>
                  <CompanyFieldInput
                    field={field}
                    value={draft[field.key]}
                    onChange={updateField}
                    inputClassName="w-full rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm text-[var(--db-text)] outline-none focus:border-verde-floresta/40 focus:ring-2 focus:ring-verde-floresta/15"
                    labelClassName="text-xs font-bold uppercase tracking-wide text-[var(--db-text-muted)]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <dl className="space-y-4">
              {COMPANY_FIELDS_EMPRESA.localizacao.map((field) => {
                if (field.key === "street") {
                  return (
                    <FieldRow
                      key="address-line"
                      label="Endereço"
                      value={formatStreetAddress(draft)}
                    />
                  );
                }
                if (field.key === "streetNumber" || field.key === "neighborhood") {
                  return null;
                }
                return (
                  <FieldRow key={field.key} label={field.label} value={String(draft[field.key])} />
                );
              })}
            </dl>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={`text-xs font-semibold uppercase tracking-wide ${textFaint}`}>{label}</dt>
      <dd className="mt-1">
        <span className={`text-sm font-medium sm:text-base ${textPrimary}`}>{value || "—"}</span>
      </dd>
    </div>
  );
}
