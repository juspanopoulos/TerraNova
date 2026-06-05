import { platformModules } from "@/data/sobre/platform";
import { copyOnLight, gridCards, titleOnLight } from "@/constants/layout";

export function AboutPlatformGrid() {
  return (
    <section data-about-block className="mt-14 sm:mt-16 md:mt-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
        A plataforma
      </p>
      <h2 className={`${titleOnLight} mt-3 max-w-3xl text-2xl sm:text-3xl md:text-4xl`}>
        Modulos pensados para o ciclo completo da propriedade
      </h2>
      <p className={`${copyOnLight} mt-4 max-w-2xl sm:mt-5`}>
        Cada area do dashboard foi desenhada para responder uma pergunta
        pratica do produtor — do clima imediato ao planejamento de safra.
      </p>

      <ul className={`${gridCards} mt-8 sm:mt-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2`}>
        {platformModules.map((module) => {
          const Icon = module.icon;

          return (
            <li key={module.id} data-about-item>
              <article className="group h-full rounded-xl border border-verde-floresta/10 bg-white p-5 transition-colors hover:border-verde-floresta/20 hover:bg-verde-floresta/[0.03] sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-verde-floresta/8 text-verde-floresta transition-colors group-hover:bg-verde-floresta/12 sm:size-12">
                    <Icon className="size-5 sm:size-6" strokeWidth={2} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-verde-floresta sm:text-lg">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-preto-suave/70 sm:text-[0.95rem] sm:leading-7">
                      {module.description}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
