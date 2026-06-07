import { Leaf, Sprout, Wheat } from 'lucide-react'
import { useRef, type CSSProperties } from 'react'
import {
  aboutCard,
  aboutCardGrid,
  aboutCardInner,
} from '@/components/sobre/aboutShared'
import {
  homeGrowthOverlayOpacity,
  homeHeaderBodyGap,
  homeHeaderTitleGap,
  homeHeroTitle,
  homeLeadDark,
  homeSectionBlockGap,
  homeShell,
} from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { copyOnLight, pageHeroEyebrow } from '@/constants/layout'
import { growthCopy, growthStages } from '@/data/home/content'
import { useGrowthScrollAnimation } from '@/hooks/useGrowthScrollAnimation'

const growthScrollLength = `${growthStages.length * 100}vh`

const stageIcons = [Sprout, Leaf, Wheat] as const

export function HomeGrowth() {
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGrowthScrollAnimation({
    trackRef,
    contentRef,
    stageCount: growthStages.length,
  })

  return (
    <section data-section="growth" className="relative bg-bege-natural">
      <div ref={trackRef} className="relative" style={{ height: growthScrollLength }}>
        <div
          ref={contentRef}
          data-growth-pin
          className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-start overflow-hidden sm:min-h-[calc(100vh-4.25rem)] md:min-h-[calc(100vh-4.75rem)] md:justify-center lg:min-h-[calc(100vh-5rem)]"
          style={homeGrowthOverlayOpacity as CSSProperties}
        >
          <div className={`${styles.growthImageStack} pointer-events-none absolute inset-0`} aria-hidden>
            {growthStages.map((stage) => (
              <img
                key={stage.id}
                data-growth-image
                src={stage.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="lazy"
              />
            ))}
          </div>

          <div className={`${styles.growthOverlay} absolute inset-0`} aria-hidden />

          <div className={`${homeShell} ${styles.growthMobileShell} relative z-10 py-6 sm:py-8 md:py-12`}>
            <header className="max-w-3xl">
              <p className={pageHeroEyebrow} data-home-item>
                {growthCopy.eyebrow}
              </p>
              <h2
                data-home-item
                className={`${homeHeroTitle} ${homeHeaderTitleGap} text-preto-suave`}
              >
                {growthCopy.title}
              </h2>
              <p data-home-item className={`${homeLeadDark} ${homeHeaderBodyGap} max-w-xl`}>
                {growthCopy.body}
              </p>
            </header>

            <ul
              className={`${styles.growthStepStack} relative ${homeSectionBlockGap} min-h-52 sm:min-h-56 md:min-h-0 ${aboutCardGrid}`}
              aria-label="Fases de crescimento"
            >
              {growthStages.map((stage, index) => {
                const Icon = stageIcons[index] ?? Sprout

                return (
                  <li
                    key={stage.id}
                    data-growth-step
                    aria-current={index === 0 ? 'step' : undefined}
                  >
                    <article className={`${aboutCard} ${aboutCardInner}`}>
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-verde-floresta/10 text-verde-floresta ring-1 ring-verde-floresta/15 sm:size-11">
                        <Icon className="size-5" strokeWidth={2} aria-hidden />
                      </span>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-laranja-solar">
                        {stage.phase}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-verde-floresta sm:text-lg">
                        {stage.title}
                      </h3>
                      <p className={`${copyOnLight} mt-3 text-sm md:mt-2`}>{stage.detail}</p>
                    </article>
                  </li>
                )
              })}
            </ul>

            <div className={styles.growthMobileFooter}>
              <div
                className="relative h-1 w-full shrink-0 overflow-hidden rounded-full bg-verde-floresta/12"
                aria-hidden
              >
                <div
                  data-growth-progress
                  className="h-full w-full origin-left rounded-full bg-laranja-solar"
                />
              </div>

              <nav
                className={`${styles.growthPhaseNav} md:hidden`}
                aria-label="Indicador de fases"
              >
                {growthStages.map((stage, index) => {
                  const Icon = stageIcons[index] ?? Sprout

                  return (
                    <div
                      key={`${stage.id}-pill`}
                      data-growth-pill
                      className={styles.growthPhasePill}
                    >
                      <span className={styles.growthPhaseIcon}>
                        <Icon className="size-4" strokeWidth={2} aria-hidden />
                      </span>
                      <span className={styles.growthPhaseLabel}>{stage.phase}</span>
                    </div>
                  )
                })}
              </nav>

              <p className={`${styles.growthScrollHint} md:hidden`}>
                Role para avançar pelas fases
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
