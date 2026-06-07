import bgWaterImg from '@/assets/hero/background3.png'
import {
  aboutContentGap,
  aboutGridGap,
  aboutSoftPanel,
} from '@/components/sobre/aboutShared'
import { homeHeroTitle, homeLeadDark, homeShell } from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { copyOnLight, pageHeroEyebrow } from '@/constants/layout'
import { waterCopy, waterStats } from '@/data/home/content'

export function HomeWater() {
  return (
    <section
      data-section="water"
      className="relative overflow-hidden bg-bege-natural py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div
        className={`${styles.climateTopFade} pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />

      <div className={`${homeShell} relative`}>
        <header className="max-w-3xl">
          <p className={pageHeroEyebrow} data-home-item>
            {waterCopy.eyebrow}
          </p>
          <h2 data-home-item className={`${homeHeroTitle} mt-5 text-preto-suave`}>
            {waterCopy.title}
          </h2>
          <p data-home-item className={`${homeLeadDark} mt-6 max-w-xl`}>
            {waterCopy.body}
          </p>
        </header>

        <div
          className={`${aboutContentGap} mt-14 grid ${aboutGridGap} lg:mt-16 lg:grid-cols-12 xl:mt-20`}
        >
          <figure
            data-home-item
            className={`${styles.imageFrame} relative min-h-72 overflow-hidden rounded-3xl lg:col-span-5 lg:min-h-full`}
          >
            <img
              src={bgWaterImg}
              alt="Irrigação e gestão de água no campo"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-verde-floresta/75 via-verde-floresta/20 to-transparent"
              aria-hidden
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-laranja-solar">
                Visão por setor
              </p>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-bege-natural/95 sm:text-lg">
                {waterCopy.imageCaption}
              </p>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-center lg:col-span-7">
            <div data-home-item className={`${aboutSoftPanel} relative overflow-hidden p-6 sm:p-8`}>
              <div
                className="pointer-events-none absolute -left-12 -bottom-12 size-40 rounded-full bg-verde-floresta/10 blur-3xl"
                aria-hidden
              />

              <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-verde-floresta/70">
                Indicadores hídricos
              </p>

              <ol className="relative mt-6" aria-label="Indicadores de água">
                {waterStats.map((stat, index) => {
                  const Icon = stat.icon
                  const isLast = index === waterStats.length - 1

                  return (
                    <li
                      key={stat.id}
                      data-home-item
                      className={`relative flex gap-4 sm:gap-5 ${isLast ? '' : 'pb-7 sm:pb-8'}`}
                    >
                      {!isLast ? (
                        <span
                          className="absolute top-12 bottom-0 left-5 w-px bg-verde-floresta/15 sm:left-5.5"
                          aria-hidden
                        />
                      ) : null}

                      <span className="relative z-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-verde-floresta/10 text-verde-floresta ring-1 ring-verde-floresta/15 sm:size-11">
                        <Icon className="size-5" strokeWidth={2} aria-hidden />
                      </span>

                      <article className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-preto-suave/55">
                            {stat.label}
                          </h3>
                          <p className="text-2xl font-bold tabular-nums tracking-[-0.03em] text-verde-floresta sm:text-3xl">
                            {stat.value}
                          </p>
                        </div>
                        <p className={`${copyOnLight} mt-2 text-sm`}>{stat.detail}</p>
                      </article>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
