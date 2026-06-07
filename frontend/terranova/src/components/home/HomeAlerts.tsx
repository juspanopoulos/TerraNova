import alertsBgImg from '@/assets/images/home/chuva-fazenda.jpg'
import { aboutGridGap } from '@/components/sobre/aboutShared'
import {
  homeHeaderBodyGap,
  homeHeaderTitleGap,
  homeHeroTitle,
  homeImpactCard,
  homeLeadLight,
  homeSectionBlockGap,
  homeSectionPad,
  homeShell,
} from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { copyOnLight, pageHeroEyebrow } from '@/constants/layout'
import { alertsCopy, homeAlerts } from '@/data/home/content'

const alertIconMap = {
  alertStripeDry: styles.alertsDockIconDry,
  alertStripeRain: styles.alertsDockIconRain,
  alertStripeHeat: styles.alertsDockIconHeat,
} as const

export function HomeAlerts() {
  return (
    <section
      data-section="alerts"
      className="relative overflow-hidden bg-bege-natural"
    >
      <img
        src={alertsBgImg}
        alt=""
        className={`${styles.bgFixed} absolute inset-0 h-full w-full object-cover object-[center_40%]`}
        aria-hidden
      />

      <div
        className={`${homeShell} relative ${homeSectionPad}`}
      >
        <div className={`grid ${aboutGridGap} lg:grid-cols-12 lg:items-start`}>
          <header className="max-w-3xl lg:col-span-5">
            <p className={pageHeroEyebrow} data-home-item>
              {alertsCopy.eyebrow}
            </p>
            <h2 data-home-item className={`${homeHeroTitle} ${homeHeaderTitleGap}`}>
              {alertsCopy.title}
            </h2>
            <p data-home-item className={`${homeLeadLight} ${homeHeaderBodyGap} max-w-xl`}>
              {alertsCopy.body}
            </p>
          </header>

          <ul
            className={`${homeSectionBlockGap} flex flex-col gap-4 sm:gap-5 lg:col-span-7 lg:mt-0`}
            aria-label="Tipos de alerta"
          >
            {homeAlerts.map((alert) => {
              const Icon = alert.icon
              const iconTheme =
                alertIconMap[alert.stripeClass as keyof typeof alertIconMap]

              return (
                <li key={alert.id} data-home-item>
                  <article
                    className={`${homeImpactCard} flex gap-4 sm:min-h-[7.5rem] sm:gap-5`}
                  >
                    <span
                      className={[
                        'inline-flex size-10 shrink-0 items-center justify-center rounded-full sm:size-11',
                        iconTheme,
                      ].join(' ')}
                    >
                      <Icon className="size-5" strokeWidth={2.25} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-verde-floresta sm:text-lg">
                        {alert.title}
                      </h3>
                      <p className={`${copyOnLight} mt-2 text-sm`}>
                        {alert.description}
                      </p>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
