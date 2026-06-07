import { useEffect, useState } from "react";
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
  hasFieldErrors,
  PASSWORD_RULES_HINT,
  validateLoginForm,
  validateRegisterStep1,
  type AuthFieldErrors,
} from "@/lib/dashboard/authValidation";
import type { AuthMode, RegisterCredentials } from "@/types/dashboard";

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (mode === "login") {
      setFullName("");
      setErrors({});
      setSubmitted(false);
    }
  }, [mode]);

  const clearError = (field: keyof AuthFieldErrors) => {
    if (!errors[field]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const nextErrors =
      mode === "login"
        ? validateLoginForm(email, password)
        : validateRegisterStep1(fullName, email, password);

    setErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;

    if (mode === "login") {
      onLogin();
      return;
    }
    onRegisterStep1({ fullName: fullName.trim(), email: email.trim(), password });
  };

  return (
    <div className="w-full max-w-md shrink-0 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <AuthBrandHeader />
        <h1 className="-mt-4 mb-6 text-center text-2xl font-bold text-preto-suave">
          {mode === "login" ? "Acesse sua propriedade" : "Crie sua conta"}
        </h1>
        {mode === "register" && (
          <p className="-mt-4 mb-6 text-center text-sm text-preto-suave/55">
            Depois você informará os dados da empresa e da fazenda.
          </p>
        )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {mode === "register" && (
          <label className="block">
            <span className={authLabelClass}>Nome</span>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError("fullName");
              }}
              className={[authInputClass, errors.fullName ? authInputErrorClass : ""].join(" ")}
              placeholder="Maria Silva"
              aria-invalid={Boolean(errors.fullName)}
            />
            {(submitted || errors.fullName) && errors.fullName && (
              <p className={authErrorClass} role="alert">
                {errors.fullName}
              </p>
            )}
          </label>
        )}
        <label className="block">
          <span className={authLabelClass}>E-mail</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            className={[authInputClass, errors.email ? authInputErrorClass : ""].join(" ")}
            placeholder="produtor@terranova.app"
            aria-invalid={Boolean(errors.email)}
          />
          {(submitted || errors.email) && errors.email && (
            <p className={authErrorClass} role="alert">
              {errors.email}
            </p>
          )}
        </label>
        <label className="block">
          <span className={authLabelClass}>Senha</span>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              className={[
                authInputClass,
                "mt-0 pr-11",
                errors.password ? authInputErrorClass : "",
              ].join(" ")}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={`${btnClick} absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-preto-suave/45 hover:text-verde-floresta`}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {mode === "register" && !errors.password && (
            <p className="mt-1.5 text-xs text-preto-suave/50">{PASSWORD_RULES_HINT}</p>
          )}
          {(submitted || errors.password) && errors.password && (
            <p className={authErrorClass} role="alert">
              {errors.password}
            </p>
          )}
        </label>
        <button
          type="submit"
          className={`${btnClick} w-full rounded-lg bg-verde-floresta px-4 py-3 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90`}
        >
          {mode === "login" ? "Entrar no dashboard" : "Continuar cadastro"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-preto-suave/55">
        {mode === "login" ? "Ainda não tem conta?" : "Já possui conta?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange(mode === "login" ? "register" : "login")}
          className={`${btnClick} ${authLinkClass} text-verde-floresta hover:underline`}
        >
          {mode === "login" ? "Criar conta" : "Fazer login"}
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
