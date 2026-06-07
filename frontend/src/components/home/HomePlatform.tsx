import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  homeCaptionAside,
  homeHeaderBodyGap,
  homeHeaderTitleGap,
  homeHeroTitle,
  homePanelEyebrow,
  homeSectionBlockGap,
  homeSectionContentGap,
  homeSectionPadBottomCompact,
  homeSectionPadTop,
  homeShell,
  homeStatDetail,
} from '@/constants/tokens/home'
import styles from '@/styles/modules/home.module.css'
import { pageHeroEyebrow } from '@/constants/layout'
import { homeModules, platformCopy, type HomeModule } from '@/data/home/content'
import { ROUTES } from '@/constants/routes'

function PlatformModuleCard({ module }: { module: HomeModule }) {
  const Icon = module.icon

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:gap-12">
      <div>
        <p className={homePanelEyebrow}>Módulo</p>

        <div className="mt-4 flex items-start gap-4 sm:gap-5">
          <Icon
            className="size-5 shrink-0 text-laranja-solar sm:size-[1.375rem]"
            strokeWidth={2.25}
            aria-hidden
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold tracking-[-0.025em] text-verde-floresta sm:text-3xl">
              {module.title}
            </h3>
            <p className={`${homeStatDetail} mt-3 max-w-2xl`}>
              {module.description}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex size-44 items-center justify-center sm:size-52 lg:mx-0 lg:ml-auto">
        <Icon
          className={`${styles.platformStageIcon} size-20 sm:size-24`}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </div>
  )
}

export function HomePlatform() {
  const [activeId, setActiveId] = useState(homeModules[0]?.id ?? 'overview')
  const activeModule =
    homeModules.find((module) => module.id === activeId) ?? homeModules[0]

  return (
    <section
      data-section="platform"
      className={`relative overflow-hidden bg-bege-natural ${homeSectionPadTop} ${homeSectionPadBottomCompact}`}
    >
      <div
        className={`${styles.climateTopFade} pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 md:h-48`}
        aria-hidden
      />

      <div className={`${homeShell} relative`}>
        <header className="max-w-3xl lg:max-w-5xl">
          <p className={pageHeroEyebrow} data-home-item>
            {platformCopy.eyebrow}
          </p>

          <div data-home-item className="lg:flex lg:items-start lg:gap-8">
            <h2 className={`${homeHeroTitle} ${homeHeaderTitleGap} text-preto-suave`}>
              {platformCopy.title}
            </h2>

            <div className="lg:max-w-md lg:shrink-0">
              <p className={homeCaptionAside}>{platformCopy.body}</p>

              <Link
                to={ROUTES.plataforma}
                className={`${homeHeaderBodyGap} inline-flex w-fit items-center gap-2.5 rounded-xl bg-verde-floresta px-6 py-3.5 text-sm font-semibold text-bege-natural no-underline shadow-md shadow-verde-floresta/20 transition-colors hover:bg-verde-floresta/90 sm:text-base`}
              >
                Explorar plataforma
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </header>

        <div data-home-item className={homeSectionBlockGap}>
          <article
            role="tabpanel"
            id="platform-module-panel"
            aria-labelledby={`platform-tab-${activeModule.id}`}
            className={styles.platformStage}
          >
            <PlatformModuleCard module={activeModule} />
          </article>

          <div
            role="tablist"
            aria-label="Módulos da plataforma"
            className={`${styles.platformTabList} ${homeSectionContentGap}`}
          >
            {homeModules.map((module) => {
              const Icon = module.icon
              const isActive = module.id === activeId

              return (
                <button
                  key={module.id}
                  type="button"
                  role="tab"
                  id={`platform-tab-${module.id}`}
                  aria-selected={isActive}
                  aria-controls="platform-module-panel"
                  onClick={() => setActiveId(module.id)}
                  className={[
                    styles.platformTab,
                    isActive ? styles.platformTabActive : '',
                  ].join(' ')}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                  {module.title}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
