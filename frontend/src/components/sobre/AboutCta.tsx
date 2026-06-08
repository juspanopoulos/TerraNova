import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import sproutImg from "@/assets/images/sobre/broto.png";
import {
  aboutEyebrow,
  aboutGridGap,
  aboutSectionTitle,
} from "@/constants/tokens/about";
import { containerPx, contentShell, copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const sproutHeight =
  "h-[clamp(18rem,52vw,28rem)] sm:h-[clamp(20rem,48vw,30rem)] lg:h-[clamp(24rem,52vh,36rem)] xl:h-[clamp(26rem,56vh,38rem)]";

const sproutMobilePad =
  "pb-[clamp(18rem,52vw,28rem)] sm:pb-[clamp(20rem,48vw,30rem)]";

export function AboutCta() {
  return (
    <section
      data-about-block
      className="relative left-1/2 mt-[4.5rem] w-screen max-w-none -translate-x-1/2 overflow-visible pb-0 sm:mt-[5.5rem] md:mt-[6.5rem] lg:mt-[7.5rem]"
    >
      <div className={`${contentShell} ${containerPx} relative overflow-visible`}>
        <img
          src={sproutImg}
          alt=""
          className={`pointer-events-none absolute bottom-0 left-1/2 z-0 block w-auto max-w-[min(88vw,26rem)] -translate-x-1/2 object-contain object-bottom mix-blend-screen sm:max-w-[min(82vw,30rem)] lg:left-0 lg:max-w-[min(46vw,24rem)] lg:translate-x-0 xl:max-w-[min(42vw,28rem)] ${sproutHeight}`}
          loading="lazy"
          decoding="async"
          aria-hidden
        />

        <div className={`relative z-1 lg:grid lg:grid-cols-2 ${aboutGridGap}`}>
          <div className="hidden lg:block" aria-hidden />

          <div
            className={`flex flex-col items-center gap-6 pt-5 text-center ${sproutMobilePad} sm:pt-6 lg:col-start-2 lg:items-start lg:pb-8 lg:pt-9 lg:text-left xl:pb-10 xl:pt-11`}
          >
            <div>
              <p className={aboutEyebrow}>Próximo passo</p>
              <h2 className={aboutSectionTitle}>Entre na plataforma</h2>
              <p className={`${copyOnLight} mt-4 max-w-md lg:mx-0 mx-auto`}>
                O painel reúne clima, solo, água e alertas, tudo num só lugar.
                Explore os módulos e veja como o TerraNova organiza o dia a dia no
                campo.
              </p>
            </div>

            <Link
              to={ROUTES.plataforma}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-verde-floresta px-5 py-3 text-sm font-semibold text-bege-natural no-underline transition-colors hover:bg-verde-floresta/90 sm:px-6 sm:py-3.5 sm:text-base"
            >
              Ir para a plataforma
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
