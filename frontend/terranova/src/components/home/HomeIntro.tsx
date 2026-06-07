import farmImg from '@/assets/hero/farm.jpeg'
import { aboutCardGrid } from '@/components/sobre/aboutShared'
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
import { homeManifesto } from '@/data/home/content'

export function HomeIntro() {
  return (
    <section
      data-section="intro"
      className="relative overflow-hidden border-b border-bege-natural/15 bg-bege-natural text-bege-natural"
    >
      <img
        src={farmImg}
        alt=""
        className={`${styles.bgFixed} absolute inset-0 h-full w-full object-cover object-[center_38%]`}
        aria-hidden
      />
      <div className={`${styles.overlayNavbarToPage} absolute inset-0`} aria-hidden />

      <div className={`${homeShell} relative ${homeSectionPad}`}>
        <header className="max-w-3xl">
          <p className={pageHeroEyebrow} data-home-item>
            {homeManifesto.eyebrow}
          </p>
          <h1 data-home-item className={`${homeHeroTitle} ${homeHeaderTitleGap}`}>
            {homeManifesto.title}{' '}
            <span className="text-laranja-solar">{homeManifesto.titleAccent}</span>
          </h1>
          <p data-home-item className={`${homeLeadLight} ${homeHeaderBodyGap} max-w-xl`}>
            {homeManifesto.body}
          </p>
        </header>

        <ul
          className={`${aboutCardGrid} ${homeSectionBlockGap}`}
          aria-label="Pilares TerraNova"
        >
          {homeManifesto.pillars.map((pillar) => {
            const Icon = pillar.icon

            return (
              <li key={pillar.id} data-home-item>
                <article
                  className={`${homeImpactCard} flex h-full min-h-44 flex-col sm:min-h-48`}
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-laranja-solar/20 text-laranja-solar ring-1 ring-laranja-solar/35 sm:size-11">
                    <Icon className="size-5" strokeWidth={2.25} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-verde-floresta sm:text-lg">
                    {pillar.title}
                  </h3>
                  <p className={`${copyOnLight} mt-2 text-sm`}>{pillar.description}</p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
