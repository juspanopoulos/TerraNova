import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import leavesBgImg from '@/assets/hero/background5.png'
import logoColorido from '@/assets/logos/logo-colorido.png'
import {
  homeHeaderBodyGap,
  homeHeaderTitleGap,
  homeHeroTitle,
  homeLeadDark,
  homeSectionContentGap,
  homeSectionPadBottom,
  homeSectionPadTopCompact,
  homeShell,
} from '@/components/home/homeShared'
import styles from '@/components/home/home.module.css'
import { pageHeroEyebrow } from '@/constants/layout'
import { homeCtaCopy, homeCtaLinks } from '@/data/home/content'

export function HomeCta() {
  return (
    <section
      data-section="cta"
      className="relative overflow-hidden bg-bege-natural"
    >
      <img
        src={leavesBgImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />
      <div
        className={`${styles.climateTopFade} pointer-events-none absolute inset-x-0 top-0 z-10 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />

      <div
        className={`${homeShell} relative z-10 ${homeSectionPadTopCompact} ${homeSectionPadBottom}`}
      >
        <article
          data-home-item
          className={`${styles.ctaPanel} relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-verde-floresta/10 bg-bege-natural/95 p-8 text-center backdrop-blur-sm sm:p-10 md:p-12`}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-laranja-solar/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-verde-floresta/10 blur-3xl"
            aria-hidden
          />

          <img
            src={logoColorido}
            alt="TerraNova"
            className="relative mx-auto h-16 w-auto sm:h-20"
            width={80}
            height={80}
            loading="lazy"
          />

          <p className={`${pageHeroEyebrow} relative ${homeHeaderBodyGap}`}>
            Comece agora
          </p>
          <h2
            className={`${homeHeroTitle} relative ${homeHeaderTitleGap} text-3xl text-preto-suave sm:text-4xl md:text-5xl`}
          >
            {homeCtaCopy.title}
          </h2>
          <p className={`${homeLeadDark} relative mx-auto ${homeHeaderBodyGap} max-w-md`}>
            {homeCtaCopy.body}
          </p>

          <div className={`relative ${homeSectionContentGap} flex flex-col items-center gap-5`}>
            {homeCtaLinks
              .filter((link) => link.primary)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-xl bg-laranja-solar px-8 py-4 text-base font-bold text-surface-night no-underline shadow-lg shadow-laranja-solar/30 transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  {link.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              ))}

            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
              {homeCtaLinks
                .filter((link) => !link.primary)
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex w-full items-center justify-center rounded-xl border-2 border-verde-floresta/25 px-6 py-3.5 text-sm font-semibold text-verde-floresta no-underline transition-colors hover:border-verde-floresta/45 hover:bg-verde-floresta/8 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
