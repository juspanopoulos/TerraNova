import cloudsImg from '@/assets/images/home/nuvens.jpg'
import { aboutGridGap } from '@/components/sobre/aboutShared'
import {
  homeCaptionAside,
  homeHeaderTitleGap,
  homeHeroTitle,
  homePanelEyebrow,
  homeSectionBlockGap,
  homeSectionPad,
  homeShell,
  homeStatDetail,
  homeStatLabel,
  homeStatsPanel,
} from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { pageHeroEyebrow } from '@/constants/layout'
import { climateCopy, climateStats } from '@/data/home/content'

export function HomeClimate() {
  return (
    <section
      data-section="climate"
      className="relative overflow-hidden bg-bege-natural py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32"
    >
      <div
        className={`${styles.climateTopFade} pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />

      <div className={`${homeShell} relative`}>
        <header className="max-w-3xl lg:max-w-5xl">
          <p className={pageHeroEyebrow} data-home-item>
            {climateCopy.eyebrow}
          </p>

          <div data-home-item className="lg:flex lg:items-center lg:gap-8">
            <h2 className={`${homeHeroTitle} ${homeHeaderTitleGap} text-preto-suave`}>
              {climateCopy.title}
            </h2>
            <p className={homeCaptionAside}>{climateCopy.imageCaption}</p>
          </div>
        </header>

        <div
          className={`${homeSectionBlockGap} grid ${aboutGridGap} lg:grid-cols-12`}
        >
          <figure
            data-home-item
            className={`${styles.imageFrame} relative min-h-72 overflow-hidden rounded-3xl lg:col-span-5 lg:min-h-full`}
          >
            <img
              src={cloudsImg}
              alt="Nuvens sobre o horizonte"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />
          </figure>

          <div className="flex flex-col justify-center lg:col-span-7">
            <div data-home-item className={homeStatsPanel}>
              <div
                className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-laranja-solar/10 blur-3xl"
                aria-hidden
              />

              <p className={`relative ${homePanelEyebrow}`}>Indicadores agora</p>

              <ol className="relative mt-6" aria-label="Indicadores climaticos">
                {climateStats.map((stat, index) => {
                  const Icon = stat.icon
                  const isLast = index === climateStats.length - 1

                  return (
                    <li
                      key={stat.id}
                      data-home-item
                      className={`relative flex gap-4 sm:gap-5 ${isLast ? '' : 'pb-7 sm:pb-8'}`}
                    >
                      {!isLast ? (
                        <span
                          className="absolute top-12 bottom-0 left-5 w-px bg-laranja-solar/20 sm:left-5.5"
                          aria-hidden
                        />
                      ) : null}

                      <span className="relative z-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-laranja-solar/15 text-laranja-solar ring-1 ring-laranja-solar/25 sm:size-11">
                        <Icon className="size-5" strokeWidth={2.25} aria-hidden />
                      </span>

                      <article className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h3 className={homeStatLabel}>{stat.label}</h3>
                          <p className="text-2xl font-bold tabular-nums tracking-[-0.03em] text-laranja-solar sm:text-3xl">
                            {stat.value}
                          </p>
                        </div>
                        <p className={homeStatDetail}>{stat.detail}</p>
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
