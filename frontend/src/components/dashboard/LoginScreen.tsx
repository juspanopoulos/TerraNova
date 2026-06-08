import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthBrandHeader } from "@/components/dashboard/AuthBrandHeader";
import {
  authErrorClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authLinkClass,
} from "@/constants/tokens/authForm";
import { btnClick } from "@/constants/dashboard";
import { ROUTES } from "@/constants/routes";
import {
  PASSWORD_RULES_HINT,
  toFieldValidator,
  validateEmail,
  validateFullName,
  validatePassword,
} from "@/lib/dashboard/authValidation";
import type { AuthMode, RegisterCredentials } from "@/types/dashboard";

type AuthFormValues = {
  fullName: string;
  email: string;
  password: string;
};

const authFormDefaultValues: AuthFormValues = {
  fullName: "",
  email: "",
  password: "",
};

function fieldClass(hasError: boolean, extra = "") {
  return [authInputClass, extra, hasError ? authInputErrorClass : ""]
    .filter(Boolean)
    .join(" ");
}

export function LoginScreen({
  mode,
  onModeChange,
  onLogin,
  onRegisterStep1,
}: {
  mode: Extract<AuthMode, "login" | "register">;
  onModeChange: (m: AuthMode) => void;
  onLogin: () => void;
  onRegisterStep1: (credentials: RegisterCredentials) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: authFormDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    reset(authFormDefaultValues);
    setShowPassword(false);
  }, [mode, reset]);

  const onSubmit = (data: AuthFormValues) => {
    if (isRegister) {
      onRegisterStep1({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      return;
    }

    onLogin();
  };

  return (
    <div className="w-full max-w-md shrink-0 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
      <AuthBrandHeader />
      <h1 className="-mt-4 mb-6 text-center text-2xl font-bold text-preto-suave">
        {isRegister ? "Crie sua conta" : "Acesse sua propriedade"}
      </h1>
      {isRegister && (
        <p className="-mt-4 mb-6 text-center text-sm text-preto-suave/55">
          Depois você informará os dados da empresa e da fazenda.
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {isRegister && (
          <label className="block">
            <span className={authLabelClass}>Nome</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Maria Silva"
              className={fieldClass(Boolean(errors.fullName))}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "auth-fullName-error" : undefined}
              {...register("fullName", {
                validate: toFieldValidator(validateFullName),
              })}
            />
            {errors.fullName ? (
              <p id="auth-fullName-error" className={authErrorClass} role="alert">
                {errors.fullName.message}
              </p>
            ) : null}
          </label>
        )}
        <label className="block">
          <span className={authLabelClass}>E-mail</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="produtor@terranova.app"
            className={fieldClass(Boolean(errors.email))}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "auth-email-error" : undefined}
            {...register("email", {
              validate: toFieldValidator(validateEmail),
            })}
          />
          {errors.email ? (
            <p id="auth-email-error" className={authErrorClass} role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </label>
        <label className="block">
          <span className={authLabelClass}>Senha</span>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="••••••••"
              className={fieldClass(Boolean(errors.password), "mt-0 pr-11")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "auth-password-error" : undefined}
              {...register("password", {
                validate: toFieldValidator((value) =>
                  validatePassword(value, { strict: isRegister }),
                ),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className={`${btnClick} absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-preto-suave/45 hover:text-verde-floresta`}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {isRegister && !errors.password && (
            <p className="mt-1.5 text-xs text-preto-suave/50">{PASSWORD_RULES_HINT}</p>
          )}
          {errors.password ? (
            <p id="auth-password-error" className={authErrorClass} role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${btnClick} w-full rounded-lg bg-verde-floresta px-4 py-3 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isRegister ? "Continuar cadastro" : "Entrar no dashboard"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-preto-suave/55">
        {isRegister ? "Já possui conta?" : "Ainda não tem conta?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange(isRegister ? "login" : "register")}
          className={`${btnClick} ${authLinkClass} text-verde-floresta hover:underline`}
        >
          {isRegister ? "Fazer login" : "Criar conta"}
        </button>
      </p>
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
