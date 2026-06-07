import type { CSSProperties } from 'react'
import alertsBgImg from '@/assets/images/home/alertas-ambientais.jpg'
import {
  aboutCard,
  aboutCardGrid,
  aboutCardInner,
  aboutContentGap,
} from '@/components/sobre/aboutShared'
import {
  homeAlertsOverlayOpacity,
  homeHeroTitle,
  homeLeadDark,
  homeShell,
} from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { pageHeroEyebrow } from '@/constants/layout'
import { alertsCopy, homeAlerts } from '@/data/home/content'

const alertStripeMap = {
  alertStripeDry: styles.alertStripeDry,
  alertStripeRain: styles.alertStripeRain,
  alertStripeHeat: styles.alertStripeHeat,
} as const

export function HomeAlerts() {
  return (
    <section
      data-section="alerts"
      className="relative overflow-hidden bg-bege-natural"
      style={homeAlertsOverlayOpacity as CSSProperties}
    >
      <img
        src={alertsBgImg}
        alt=""
        className={`${styles.bgFixed} absolute inset-0 h-full w-full object-cover object-center`}
        aria-hidden
      />
      <div className={`${styles.growthOverlay} absolute inset-0`} aria-hidden />
      <div
        className={`${styles.climateTopFade} pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />
      <div
        className={`${styles.introBottomFade} pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />

      <div className={`${homeShell} relative py-16 sm:py-20 md:py-24 lg:py-28`}>
        <header className="max-w-3xl">
          <p className={pageHeroEyebrow} data-home-item>
            {alertsCopy.eyebrow}
          </p>
          <h2 data-home-item className={`${homeHeroTitle} mt-5 text-preto-suave`}>
            {alertsCopy.title}
          </h2>
          <p data-home-item className={`${homeLeadDark} mt-6 max-w-xl`}>
            {alertsCopy.body}
          </p>
        </header>

        <ul
          className={`${aboutCardGrid} ${aboutContentGap} mt-14 sm:mt-16 md:mt-20`}
          aria-label="Tipos de alerta"
        >
          {homeAlerts.map((alert) => {
            const Icon = alert.icon
            const stripe =
              alertStripeMap[alert.stripeClass as keyof typeof alertStripeMap]

            return (
              <li key={alert.id} data-home-item>
                <article className={`${aboutCard} flex h-full min-h-44 flex-col overflow-hidden sm:min-h-48`}>
                  <div className={`h-1.5 w-full shrink-0 ${stripe}`} aria-hidden />
                  <div className={`${aboutCardInner} flex-1 pt-4 sm:pt-5`}>
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-verde-floresta/10 text-verde-floresta ring-1 ring-verde-floresta/15 sm:size-11">
                      <Icon className="size-5" strokeWidth={2} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-verde-floresta sm:text-lg">
                      {alert.title}
                    </h3>
                    <p className="mt-2 text-sm text-preto-suave/75">{alert.description}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
