import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthBrandHeader } from "@/components/dashboard/AuthBrandHeader";
import { CompanyFieldsGridForm } from "@/components/dashboard/CompanyFieldInput";
import { authLinkClass } from "@/constants/tokens/authForm";
import { btnClick } from "@/constants/dashboard";
import { ROUTES } from "@/constants/routes";
import { COMPANY_FIELDS } from "@/lib/dashboard/companyFields";
import {
  hasFieldErrors,
  validateCompanyProfile,
} from "@/lib/dashboard/authValidation";
import type { CompanyProfile } from "@/types/dashboard";

export function RegisterCompanyScreen({
  initialCompany,
  onBack,
  onSubmit,
  errorMessage,
}: {
  initialCompany: CompanyProfile;
  onBack: () => void;
  onSubmit: (company: CompanyProfile) => Promise<void>;
  errorMessage?: string | null;
}) {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setError,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<CompanyProfile>({
    defaultValues: initialCompany,
    mode: "onTouched",
  });

  useEffect(() => {
    reset(initialCompany);
  }, [initialCompany, reset]);

  const onFormSubmit = async (data: CompanyProfile) => {
    const fieldErrors = validateCompanyProfile(data);
    if (hasFieldErrors(fieldErrors)) {
      (Object.entries(fieldErrors) as [keyof CompanyProfile, string][]).forEach(
        ([key, message]) => {
          setError(key, { type: "manual", message });
        },
      );
      return;
    }

    await onSubmit(data);
  };

  const hasVisibleErrors = submitCount > 0 && hasFieldErrors(errors);

  return (
    <div className="w-full max-w-2xl shrink-0 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
      <AuthBrandHeader className="mb-6" />
      <div className="-mt-2 mb-6 text-center">
        <h1 className="text-2xl font-bold text-preto-suave">Dados da propriedade</h1>
        <p className="mt-2 text-sm text-preto-suave/55">
          Complete o cadastro da empresa e da fazenda — os mesmos dados de Configurações → Empresa.
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
        <CompanyFieldsGridForm
          fields={COMPANY_FIELDS}
          control={control}
          getValues={getValues}
          errors={errors}
        />

        {hasVisibleErrors && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            Corrija os campos destacados antes de continuar.
          </p>
        )}

        {errorMessage && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {errorMessage}
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
            disabled={isSubmitting}
            className={`${btnClick} rounded-lg bg-verde-floresta px-6 py-3 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-48`}
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
