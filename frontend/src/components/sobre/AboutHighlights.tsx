import backgroundFoliage from "@/assets/hero/background2.png";
import {
  howItWorksCopy,
  howItWorksSteps,
  platformHighlights,
} from "@/data/sobre/platform";
import { copyOnLight } from "@/constants/layout";
import {
  aboutCardGrid,
  aboutContentGap,
  aboutEyebrow,
  aboutGridGap,
  aboutSectionTitle,
  aboutSoftPanel,
  aboutSoftPanelInner,
} from "@/components/sobre/aboutShared";

export function AboutHighlights() {
  return (
    <section data-about-block>
      <header>
        <p className={aboutEyebrow}>{howItWorksCopy.eyebrow}</p>
        <h2 className={aboutSectionTitle}>{howItWorksCopy.title}</h2>
        <p className={`${copyOnLight} mt-4 max-w-3xl sm:mt-5`}>
          {howItWorksCopy.description}
        </p>
      </header>

      <div className={`${aboutContentGap} grid ${aboutGridGap} lg:grid-cols-2`}>
        <div className="relative min-h-[14rem] overflow-hidden rounded-2xl sm:min-h-[18rem] lg:min-h-[26rem]">
          <img
            src={backgroundFoliage}
            alt="Luz filtrada por folhas verdes"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-verde-floresta/50 via-transparent to-transparent"
            aria-hidden
          />
          <p className="absolute inset-x-0 bottom-0 px-5 py-5 text-sm leading-relaxed text-bege-natural/95 sm:px-6 sm:py-6 sm:text-base">
            Menos idas e vindas entre ferramentas — mais tempo olhando para o que
            realmente importa.
          </p>
        </div>

        <ol className="relative flex flex-col">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === howItWorksSteps.length - 1;

            return (
              <li
                key={step.id}
                data-about-item
                className={`relative flex gap-4 sm:gap-5 ${isLast ? "" : "pb-7 sm:pb-8"}`}
              >
                {!isLast ? (
                  <span
                    className="absolute left-5 top-11 bottom-0 w-px bg-verde-floresta/15 sm:left-[1.375rem]"
                    aria-hidden
                  />
                ) : null}

                <span className="relative z-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-verde-floresta/10 text-verde-floresta ring-1 ring-verde-floresta/15 sm:size-11">
                  <Icon className="size-5 sm:size-[1.125rem]" strokeWidth={2} aria-hidden />
                </span>

                <article className="min-w-0 pt-1">
                  <h3 className="text-base font-semibold text-verde-floresta sm:text-lg">
                    {step.title}
                  </h3>
                  <p className={`${copyOnLight} mt-2 text-sm`}>{step.description}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <ul className={`${aboutCardGrid} ${aboutContentGap}`}>
        {platformHighlights.map((item) => (
          <li key={item.label} data-about-item>
            <article className={`${aboutSoftPanel} ${aboutSoftPanelInner}`}>
              <span
                className="pointer-events-none absolute right-4 top-4 font-mono text-5xl font-bold tabular-nums leading-none text-verde-floresta/10 sm:right-5 sm:top-5 sm:text-6xl"
                aria-hidden
              >
                {item.value}
              </span>

              <div className="relative flex flex-1 flex-col justify-end gap-3 pt-6 sm:pt-8">
                <h3 className="max-w-[12rem] text-base font-semibold leading-snug tracking-[-0.012em] text-preto-suave sm:max-w-none sm:text-lg">
                  {item.label}
                </h3>
                <p className={`${copyOnLight} text-sm md:text-base`}>{item.detail}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
