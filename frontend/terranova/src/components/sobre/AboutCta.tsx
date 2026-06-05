import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

export function AboutCta() {
  return (
    <section
      data-about-block
      className="mt-14 overflow-hidden rounded-2xl border border-verde-floresta/12 bg-linear-to-br from-verde-floresta/8 via-white to-laranja-solar/8 sm:mt-16 md:mt-20"
    >
      <div className="flex flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
            Pronto para explorar
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-verde-floresta sm:text-3xl">
            Conheca a plataforma TerraNova
          </h2>
          <p className={`${copyOnLight} mt-4`}>
            Acesse o painel com visao geral, alertas, modulos de clima, solo,
            agua e o assistente integrado.
          </p>
        </div>

        <Link
          to={ROUTES.plataforma}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-verde-floresta px-5 py-3 text-sm font-semibold text-bege-natural no-underline transition-colors hover:bg-verde-floresta/90 sm:px-6 sm:py-3.5 sm:text-base"
        >
          Ir para a plataforma
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
