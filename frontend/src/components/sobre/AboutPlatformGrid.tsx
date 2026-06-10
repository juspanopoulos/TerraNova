import { useState } from "react";
import type { PlatformModule } from "@/data/sobre/platform";
import { platformModules } from "@/data/sobre/platform";
import { AboutSectionHeading } from "@/components/sobre/AboutSectionHeading";
import { aboutCard, aboutContentGap } from "@/constants/tokens/about";
import { copyOnLight } from "@/constants/layout";

/** Proporção comum das capturas do painel (~1918×909) para uniformizar exibição. */
const modulePreviewFrameClass =
  "aspect-[1918/909] w-full overflow-hidden rounded-xl border border-verde-floresta/10 shadow-sm shadow-verde-floresta/5";

const modulePreviewImageClass = "h-full w-full object-cover object-left-top";

function ModuleDetailPanel({ module }: { module: PlatformModule }) {
  const Icon = module.icon;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-4 sm:gap-5">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-verde-floresta/10 text-verde-floresta sm:size-14">
          <Icon className="size-6 sm:size-7" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
            Módulo
          </p>
          <h3 className="mt-2 text-xl font-bold leading-tight text-verde-floresta sm:text-2xl">
            {module.title}
          </h3>
        </div>
      </div>

      <p className={`${copyOnLight} mt-5 max-w-2xl text-sm sm:mt-6 sm:text-base`}>
        {module.description}
      </p>

      {module.previewImage ? (
        <div className={`${modulePreviewFrameClass} mt-6 sm:mt-8`}>
          <img
            src={module.previewImage}
            alt={`Prévia do módulo ${module.title} no dashboard`}
            className={modulePreviewImageClass}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
    </div>
  );
}

export function AboutPlatformGrid() {
  const [selectedId, setSelectedId] = useState(platformModules[0]?.id ?? "");
  const selected =
    platformModules.find((module) => module.id === selectedId) ?? platformModules[0];

  return (
    <section data-about-block>
      <AboutSectionHeading
        eyebrow="A plataforma"
        title="Módulos pensados para o ciclo completo da propriedade"
        description="Cada área do dashboard foi desenhada para responder uma pergunta prática do produtor, do clima imediato ao planejamento de safra."
      />

      <div className={`${aboutContentGap} lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]`}>
        <ul
          role="tablist"
          aria-label="Módulos da plataforma"
          className="flex flex-col gap-1 sm:gap-1.5"
        >
          {platformModules.map((module, index) => {
            const Icon = module.icon;
            const isActive = module.id === selected.id;

            return (
              <li key={module.id} data-about-item>
                <button
                  type="button"
                  role="tab"
                  id={`module-tab-${module.id}`}
                  aria-selected={isActive}
                  aria-controls={
                    isActive
                      ? `module-detail-panel-${module.id}`
                      : undefined
                  }
                  onClick={() => setSelectedId(module.id)}
                  className={[
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg border-l-2 px-3 py-3 text-left transition-colors sm:px-4 sm:py-3.5",
                    isActive
                      ? "border-l-laranja-solar bg-verde-floresta/10 text-verde-floresta shadow-sm shadow-verde-floresta/5"
                      : "border-l-transparent text-preto-suave/80 hover:border-l-verde-floresta/20 hover:bg-verde-floresta/4 hover:text-verde-floresta",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:size-10",
                      isActive
                        ? "bg-verde-floresta/15 text-verde-floresta"
                        : "bg-verde-floresta/8 text-verde-floresta/80",
                    ].join(" ")}
                  >
                    <Icon className="size-4 sm:size-4.5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug sm:text-[0.95rem]">
                      {module.title}
                    </span>
                    <span
                      className="mt-0.5 block text-[10px] font-semibold tabular-nums text-preto-suave/35"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                </button>

                {isActive ? (
                  <article
                    id={`module-detail-panel-${module.id}`}
                    role="tabpanel"
                    aria-labelledby={`module-tab-${module.id}`}
                    className={`${aboutCard} mt-3 p-5 sm:p-6 lg:hidden`}
                  >
                    <ModuleDetailPanel module={module} />
                  </article>
                ) : null}
              </li>
            );
          })}
        </ul>

        <article
          id="module-detail-panel-desktop"
          role="tabpanel"
          aria-labelledby={`module-tab-${selected.id}`}
          className={`${aboutCard} hidden min-h-56 p-6 sm:min-h-64 sm:p-8 lg:sticky lg:top-24 lg:block`}
        >
          <ModuleDetailPanel module={selected} />
        </article>
      </div>
    </section>
  );
}
