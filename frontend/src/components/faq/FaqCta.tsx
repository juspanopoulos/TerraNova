import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { faqCategoryTitle } from "@/components/faq/faqShared";

export function FaqCta() {
  return (
    <section data-faq-block className="mt-10 sm:mt-12 md:mt-14">
      <div className="rounded-2xl bg-verde-floresta/10 px-5 py-7 sm:px-8 sm:py-10 md:flex md:items-center md:justify-between md:gap-8">
        <div className="min-w-0 max-w-xl">
          <h2 className={faqCategoryTitle}>Entre na plataforma</h2>
          <p className={`${copyOnLight} mt-3 text-sm sm:text-base`}>
            O painel reúne clima, solo, água e alertas — veja na prática o que
            a TerraNova organiza no dia a dia no campo.
          </p>
        </div>

        <Link
          to={ROUTES.plataforma}
          className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-verde-floresta px-5 py-3 text-sm font-semibold text-bege-natural no-underline transition-colors hover:bg-verde-floresta/90 sm:w-fit sm:px-6 sm:py-3.5 sm:text-base md:mt-0"
        >
          Ir para a plataforma
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
