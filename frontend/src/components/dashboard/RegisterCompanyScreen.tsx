import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthBrandHeader } from "@/components/dashboard/AuthBrandHeader";
import { CompanyFieldsGrid } from "@/components/dashboard/CompanyFieldInput";
import { authLinkClass } from "@/constants/tokens/authForm";
import { btnClick } from "@/constants/dashboard";
import { ROUTES } from "@/constants/routes";
import { COMPANY_FIELDS, updateCompanyField } from "@/lib/dashboard/companyFields";
import {
  hasFieldErrors,
  validateCompanyProfile,
  type CompanyFieldErrors,
} from "@/lib/dashboard/authValidation";
import type { CompanyProfile } from "@/types/dashboard";

export function RegisterCompanyScreen({
  initialCompany,
  onBack,
  onSubmit,
}: {
  initialCompany: CompanyProfile;
  onBack: () => void;
  onSubmit: (company: CompanyProfile) => void;
}) {
  const [draft, setDraft] = useState<CompanyProfile>(initialCompany);
  const [errors, setErrors] = useState<CompanyFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (key: keyof CompanyProfile, value: string) => {
    setDraft((current) => updateCompanyField(current, key, value));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validateCompanyProfile(draft);
    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;
    onSubmit(draft);
  };

  return (
    <div className="w-full max-w-2xl shrink-0 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
      <AuthBrandHeader className="mb-6" />
      <div className="-mt-2 mb-6 text-center">
        <h1 className="text-2xl font-bold text-preto-suave">Dados da propriedade</h1>
        <p className="mt-2 text-sm text-preto-suave/55">
          Complete o cadastro da empresa e da fazenda — os mesmos dados de Configurações → Empresa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <CompanyFieldsGrid
          fields={COMPANY_FIELDS}
          draft={draft}
          errors={errors}
          onChange={updateField}
        />

        {submitted && hasFieldErrors(errors) && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            Corrija os campos destacados antes de continuar.
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className={`${btnClick} inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200/80 px-4 py-3 text-sm font-semibold text-preto-suave/70 hover:border-verde-floresta/30 hover:text-verde-floresta`}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Voltar
          </button>
          <button
            type="submit"
            className={`${btnClick} rounded-lg bg-verde-floresta px-6 py-3 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 sm:min-w-48`}
          >
            Concluir cadastro
          </button>
        </div>
      </form>

      <Link
        to={ROUTES.home}
        className={`${btnClick} ${authLinkClass} mt-6 flex items-center justify-center gap-2 text-sm text-preto-suave/50 no-underline`}
      >
        <ArrowLeft className="size-4" />
        Voltar ao site
      </Link>
    </div>
  );
}
