import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import sproutImg from "@/assets/images/sobre/broto.png";
import {
  aboutCtaMt,
  aboutEyebrow,
  aboutGridGap,
  aboutSectionTitle,
} from "@/components/sobre/aboutShared";
import { containerPx, contentShell, copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

export function AboutCta() {
  return (
    <section
      data-about-block
      className={`${aboutCtaMt} relative left-1/2 mb-0 w-screen max-w-none -translate-x-1/2 pb-0`}
    >
      <div
        className={`${contentShell} ${containerPx} grid grid-cols-1 items-end pb-0 ${aboutGridGap} lg:grid-cols-2`}
      >
        <div className="order-2 flex justify-center self-end leading-none lg:order-1 lg:justify-start">
          <img
            src={sproutImg}
            alt=""
            className="block h-[clamp(11rem,38vw,18rem)] w-auto max-w-full object-contain object-bottom mix-blend-screen sm:h-[clamp(13rem,42vw,21rem)]"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        </div>

        <div className="order-1 flex flex-col justify-center gap-6 pb-8 sm:pb-10 lg:order-2 lg:pb-[clamp(4rem,10vw,7rem)]">
          <div>
            <p className={aboutEyebrow}>Próximo passo</p>
            <h2 className={aboutSectionTitle}>Entre na plataforma</h2>
            <p className={`${copyOnLight} mt-4 max-w-md`}>
              O painel reúne clima, solo, água e alertas — tudo num só lugar.
              Explore os módulos e veja como a TerraNova organiza o dia a dia no
              campo.
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
      </div>
    </section>
  );
}
