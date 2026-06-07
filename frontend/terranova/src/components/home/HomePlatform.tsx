import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  aboutCard,
  aboutCardGrid,
  aboutCardInner,
  aboutContentGap,
} from '@/components/sobre/aboutShared'
import { homeHeroTitle, homeLeadDark, homeShell } from '@/components/home/homeShared'
import { copyOnLight, pageHeroEyebrow } from '@/constants/layout'
import { homeModules, platformCopy } from '@/data/home/content'
import { ROUTES } from '@/constants/routes'

export function HomePlatform() {
  return (
    <section
      data-section="platform"
      className="relative overflow-hidden bg-bege-natural py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className={`${homeShell} relative`}>
        <header className="max-w-3xl">
          <p className={pageHeroEyebrow} data-home-item>
            {platformCopy.eyebrow}
          </p>
          <h2 data-home-item className={`${homeHeroTitle} mt-5 text-preto-suave`}>
            {platformCopy.title}
          </h2>
          <p data-home-item className={`${homeLeadDark} mt-6 max-w-xl`}>
            {platformCopy.body}
          </p>
        </header>

        <div
          data-home-item
          className="mt-8 max-w-3xl border-t border-verde-floresta/10 pt-8 sm:mt-10"
        >
          <Link
            to={ROUTES.plataforma}
            className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-verde-floresta px-6 py-3.5 text-sm font-semibold text-bege-natural no-underline shadow-md shadow-verde-floresta/20 transition-colors hover:bg-verde-floresta/90 sm:text-base"
          >
            Explorar plataforma
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ul
          className={`${aboutCardGrid} ${aboutContentGap} mt-14 sm:mt-16 md:mt-20`}
          aria-label="Módulos da plataforma"
        >
          {homeModules.map((module) => {
            const Icon = module.icon

            return (
              <li key={module.id} data-home-item>
                <article
                  className={`${aboutCard} ${aboutCardInner} ${module.featured ? 'ring-2 ring-laranja-solar/20' : ''}`}
                >
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-full ring-1 sm:size-11 ${
                      module.featured
                        ? 'bg-laranja-solar/12 text-laranja-solar ring-laranja-solar/25'
                        : 'bg-verde-floresta/10 text-verde-floresta ring-verde-floresta/15'
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-verde-floresta sm:text-lg">
                    {module.title}
                  </h3>
                  <p className={`${copyOnLight} mt-2 text-sm`}>{module.description}</p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
