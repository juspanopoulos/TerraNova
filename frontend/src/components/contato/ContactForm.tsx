import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Send } from "lucide-react";
import { copyOnLight } from "@/constants/layout";
import {
  contactFieldError,
  contactFieldLabel,
  contactInput,
  contactInputError,
  contactLabel,
  contactPanel,
  contactSectionTitle,
  contactTextarea,
} from "@/constants/tokens/contact";
import { contactCopy } from "@/data/contato";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_RESET_MS = 3000;

function fieldClass(base: string, hasError: boolean) {
  return [base, hasError ? contactInputError : ""].filter(Boolean).join(" ");
}

function ContactPanelDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-laranja-solar/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full bg-verde-floresta/10 blur-3xl"
        aria-hidden
      />
    </>
  );
}

export function ContactForm() {
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues,
    mode: "onTouched",
  });

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setSubmittedName(null);
  }, [reset]);

  const onSubmit = (data: ContactFormValues) => {
    setSubmittedName(data.name);
  };

  useEffect(() => {
    if (submittedName === null) return;

    const resetTimer = window.setTimeout(handleReset, SUCCESS_RESET_MS);
    return () => window.clearTimeout(resetTimer);
  }, [submittedName, handleReset]);

  if (submittedName !== null) {
    return (
      <div className={`${contactPanel} text-center`}>
        <ContactPanelDecor />
        <div className="relative py-6 sm:py-8">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-verde-floresta/10 text-verde-floresta ring-1 ring-inset ring-verde-floresta/15">
            <Check className="size-7" strokeWidth={2.5} aria-hidden />
          </span>
          <p className={`${contactLabel} mt-5`}>Mensagem enviada</p>
          <h2 className={`${contactSectionTitle} mt-3`}>Recebemos seu contato</h2>
          <p className={`${copyOnLight} mx-auto mt-4 max-w-md text-sm sm:text-base`}>
            Obrigado, {submittedName}. Em breve a equipe TerraNova responde no e-mail
            informado.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 cursor-pointer text-sm font-semibold text-verde-floresta transition hover:text-preto-suave/80"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={contactPanel}>
      <ContactPanelDecor />

      <div className="relative">
        <p className={contactLabel}>{contactCopy.formTitle}</p>
        <h2 className={`${contactSectionTitle} max-w-lg`}>
          {contactCopy.formDescription}
        </h2>

        <div className="mt-6 space-y-4 sm:mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={contactFieldLabel}>Nome</span>
              <input
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                className={fieldClass(contactInput, Boolean(errors.name))}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                {...register("name", {
                  required: "Informe seu nome.",
                  minLength: {
                    value: 2,
                    message: "Use pelo menos 2 caracteres.",
                  },
                  maxLength: {
                    value: 80,
                    message: "Nome muito longo (máximo 80 caracteres).",
                  },
                })}
              />
              {errors.name ? (
                <p id="contact-name-error" className={contactFieldError} role="alert">
                  {errors.name.message}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className={contactFieldLabel}>E-mail</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                className={fieldClass(contactInput, Boolean(errors.email))}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                {...register("email", {
                  required: "Informe seu e-mail.",
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: "Digite um e-mail válido.",
                  },
                  maxLength: {
                    value: 120,
                    message: "E-mail muito longo.",
                  },
                })}
              />
              {errors.email ? (
                <p id="contact-email-error" className={contactFieldError} role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </label>
          </div>

          <label className="block">
            <span className={contactFieldLabel}>Assunto</span>
            <input
              type="text"
              placeholder="Como podemos ajudar?"
              className={fieldClass(contactInput, Boolean(errors.subject))}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              {...register("subject", {
                required: "Informe o assunto.",
                minLength: {
                  value: 3,
                  message: "Use pelo menos 3 caracteres.",
                },
                maxLength: {
                  value: 120,
                  message: "Assunto muito longo (máximo 120 caracteres).",
                },
              })}
            />
            {errors.subject ? (
              <p id="contact-subject-error" className={contactFieldError} role="alert">
                {errors.subject.message}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className={contactFieldLabel}>Mensagem</span>
            <textarea
              placeholder="Descreva sua dúvida ou proposta."
              className={fieldClass(contactTextarea, Boolean(errors.message))}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              {...register("message", {
                required: "Escreva sua mensagem.",
                minLength: {
                  value: 10,
                  message: "Use pelo menos 10 caracteres.",
                },
                maxLength: {
                  value: 2000,
                  message: "Mensagem muito longa (máximo 2000 caracteres).",
                },
              })}
            />
            {errors.message ? (
              <p id="contact-message-error" className={contactFieldError} role="alert">
                {errors.message.message}
              </p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-verde-floresta px-5 py-3.5 text-sm font-semibold text-bege-natural shadow-sm shadow-verde-floresta/20 transition-colors hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6 sm:text-base"
          >
            Enviar mensagem
            <Send className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
}
