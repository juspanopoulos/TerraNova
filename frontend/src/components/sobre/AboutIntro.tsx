import logoColorido from "@/assets/logos/logo-colorido.png";
import { aboutSoftPanel } from "@/constants/tokens/about";
import { copyOnLight } from "@/constants/layout";

const introPoints = [
  "Por aqui, a tecnologia entra devagar e com sentido para transformar o que você já observa no campo em clareza, reunindo o essencial para você enxergar o território com mais calma.",
  "Um painel simples para acompanhar clima, solo, água e alertas, evitando tempo perdido com informações espalhadas.",
] as const;

export function AboutIntro() {
  return (
    <div data-about-block className="w-full">
      <figure className="relative mx-auto max-w-4xl text-center">
        <span
          className="pointer-events-none absolute -left-1 top-0 font-serif text-7xl leading-none text-laranja-solar/25 sm:-left-2 sm:text-8xl"
          aria-hidden
        >
          “
        </span>
        <blockquote className="relative px-2 sm:px-6">
          <p className="text-pretty text-xl font-semibold leading-snug tracking-[-0.018em] text-preto-suave sm:text-2xl md:text-[1.75rem] lg:text-3xl">
            A gente acredita que cuidar da terra também é cuidar de você: do seu
            tempo, da sua rotina e das suas decisões.
          </p>
        </blockquote>
      </figure>

      <div data-about-item className={`${aboutSoftPanel} mt-10 sm:mt-12`}>
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-laranja-solar/8 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full bg-verde-floresta/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid grid-cols-1 items-center gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto_1fr] md:gap-6 lg:gap-10 lg:p-10">
          <p
            data-about-item
            className={`${copyOnLight} text-center text-sm md:text-left md:text-base`}
          >
            {introPoints[0]}
          </p>

          <div
            data-about-item
            className="flex justify-center px-2 md:px-4 lg:px-6"
          >
            <div className="relative flex items-center justify-center before:absolute before:inset-y-4 before:-left-6 before:hidden before:w-px before:bg-verde-floresta/15 after:absolute after:inset-y-4 after:-right-6 after:hidden after:w-px after:bg-verde-floresta/15 md:before:block md:after:block">
              <img
                src={logoColorido}
                alt="TerraNova"
                className="relative z-1 h-32 w-auto sm:h-40 md:h-44 lg:h-52 xl:h-56"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <p
            data-about-item
            className={`${copyOnLight} text-center text-sm md:text-right md:text-base`}
          >
            {introPoints[1]}
          </p>
        </div>
      </div>
    </div>
  );
}
