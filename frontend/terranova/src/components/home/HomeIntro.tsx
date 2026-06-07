import farmImg from '@/assets/hero/farm.jpeg'
import logoColorido from '@/assets/logos/logo-colorido.png'
import {
  aboutCard,
  aboutCardGrid,
  aboutCardInner,
  aboutContentGap,
} from '@/components/sobre/aboutShared'
import { homeHeroTitle, homeLeadLight, homeShell } from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { copyOnDark, copyOnLight, pageHeroEyebrow } from '@/constants/layout'
import { homeManifesto } from '@/data/home/content'

export function HomeIntro() {
  return (
    <section
      data-section="intro"
      className="relative overflow-hidden bg-bege-natural text-bege-natural"
    >
      <img
        src={farmImg}
        alt=""
        className={`${styles.bgFixed} absolute inset-0 h-full w-full object-cover object-[center_38%]`}
        aria-hidden
      />
      <div className={`${styles.overlayNavbarToPage} absolute inset-0`} aria-hidden />
      <div
        className={`${styles.introBottomFade} pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />

      <div
        className={`${homeShell} relative py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32`}
      >
        <header className="max-w-3xl">
          <p className={pageHeroEyebrow} data-home-item>
            {homeManifesto.eyebrow}
          </p>
          <h1 data-home-item className={`${homeHeroTitle} mt-5`}>
            {homeManifesto.title}{' '}
            <span className="text-laranja-solar">{homeManifesto.titleAccent}</span>
          </h1>
          <p data-home-item className={`${homeLeadLight} mt-6 max-w-xl`}>
            {homeManifesto.body}
          </p>
        </header>

        <div
          data-home-item
          className="mt-8 max-w-3xl border-t border-bege-natural/12 pt-8 sm:mt-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <img
              src={logoColorido}
              alt="TerraNova"
              className="h-14 w-auto shrink-0 sm:h-16"
              width={64}
              height={64}
              loading="eager"
              decoding="async"
            />
            <p className={`${copyOnDark} max-w-xl text-sm sm:text-base`}>
              Tecnologia territorial com o ritmo de quem cuida da terra — clara,
              próxima e feita para o dia a dia no campo.
            </p>
          </div>
        </div>

        <ul
          className={`${aboutCardGrid} ${aboutContentGap} mt-14 sm:mt-16 md:mt-20`}
          aria-label="Pilares TerraNova"
        >
          {homeManifesto.pillars.map((pillar) => {
            const Icon = pillar.icon

            return (
              <li key={pillar.id} data-home-item>
                <article className={`${aboutCard} ${aboutCardInner}`}>
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-verde-floresta/10 text-verde-floresta ring-1 ring-verde-floresta/15 sm:size-11">
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
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
