import logoColorido from "@/assets/logos/logo-colorido.png";
import { copyOnLight, pageContentGap } from "@/constants/layout";
import {
  aboutCard,
  aboutGridGap,
  aboutStackGap,
} from "@/components/sobre/aboutShared";

const introCardClass = `${aboutCard} flex h-full min-h-[11rem] flex-col p-5 sm:min-h-[12rem] sm:p-6 md:col-span-4 md:p-7`;

export function AboutIntro() {
  return (
    <div data-about-block className={`${pageContentGap} w-full ${aboutStackGap}`}>
      <blockquote className="relative w-full border-l-2 border-laranja-solar/60 pl-5 sm:pl-6">
        <p className="text-pretty text-lg font-semibold leading-snug tracking-[-0.018em] text-preto-suave sm:text-xl md:text-2xl">
          A gente acredita que cuidar da terra também é cuidar de você: do seu tempo,
          da sua rotina e das suas decisões.
        </p>
      </blockquote>

      <div className={`grid grid-cols-1 items-stretch ${aboutGridGap} md:grid-cols-12 md:gap-5 lg:gap-6`}>
        <div className={introCardClass} data-about-item>
          <div className="flex flex-1 flex-col space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
              01 · Sentido
            </span>
            <p className={`${copyOnLight} flex-1 text-sm md:text-base`}>
              Por aqui, a tecnologia entra devagar e com sentido para transformar o que
              você já observa no campo em clareza, reunindo o essencial para você enxergar
              o território com mais calma.
            </p>
          </div>
        </div>

        <div
          className="flex items-center justify-center py-4 md:col-span-4 md:py-0"
          data-about-item
        >
          <img
            src={logoColorido}
            alt="TerraNova"
            className="h-28 w-auto transition-transform duration-300 hover:scale-[1.03] sm:h-36 md:h-44 lg:h-52 xl:h-56"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={introCardClass} data-about-item>
          <div className="flex flex-1 flex-col space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
              02 · Resumo
            </span>
            <p className={`${copyOnLight} flex-1 text-sm md:text-base`}>
              Um painel simples para acompanhar clima, solo, água e alertas, evitando
              tempo perdido com informações espalhadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
