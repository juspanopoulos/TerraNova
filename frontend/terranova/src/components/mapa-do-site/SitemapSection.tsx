import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  aboutCardGrid,
  aboutContentGap,
  aboutEyebrow,
  aboutSoftPanel,
  aboutSoftPanelInner,
} from "@/components/sobre/aboutShared";
import { sitemapContentGap, sitemapSectionsStack } from "@/components/mapa-do-site/sitemapShared";
import { PageHero } from "@/components/PageHero";
import { containerPx, contentShell, copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { sitemapSections } from "@/data/mapaDoSite";

export function SitemapSection() {
  return (
    <main className="bg-bege-natural">
      <PageHero
        breadcrumb={[
          { label: "Inicio", to: ROUTES.home },
          { label: "Mapa do site" },
        ]}
        eyebrow="Indice do site"
        title="Mapa do site"
        subtitle="Todas as paginas navegaveis do site institucional e da plataforma TerraNova."
      />

      <div
        className={`${contentShell} ${containerPx} pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-20`}
      >
        <section className={`${sitemapContentGap} ${sitemapSectionsStack}`}>
          {sitemapSections.map((section) => {
            const SectionIcon = section.icon;

            return (
              <article key={section.id}>
                <header className="max-w-2xl">
                  <p className={aboutEyebrow}>{section.eyebrow}</p>
                  <div className="mt-2 flex items-start gap-3 sm:mt-3">
                    <SectionIcon
                      className="mt-1 size-5 shrink-0 text-verde-floresta sm:size-6"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <h2 className="text-2xl font-bold leading-tight tracking-[-0.018em] text-preto-suave sm:text-3xl">
                        {section.title}
                      </h2>
                      <p className={`${copyOnLight} mt-1.5 text-sm sm:mt-2 sm:text-[0.9375rem]`}>
                        {section.description}
                      </p>
                    </div>
                  </div>
                </header>

                <ul className={`${aboutCardGrid} ${aboutContentGap}`}>
                  {section.links.map((link) => {
                    const LinkIcon = link.icon;

                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className={`${aboutSoftPanel} ${aboutSoftPanelInner} group relative block h-full no-underline outline-none transition-[box-shadow,ring-color] duration-200 hover:shadow-md hover:shadow-verde-floresta/8 hover:ring-verde-floresta/20 focus-visible:ring-2 focus-visible:ring-verde-floresta/35`}
                        >
                          <div
                            className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-laranja-solar/8 blur-3xl"
                            aria-hidden
                          />
                          <div
                            className="pointer-events-none absolute -bottom-14 -left-10 size-40 rounded-full bg-verde-floresta/10 blur-3xl"
                            aria-hidden
                          />

                          <div className="relative flex h-full flex-col">
                            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-verde-floresta/10 text-verde-floresta transition-colors group-hover:bg-verde-floresta/15 sm:size-12">
                              <LinkIcon className="size-5" strokeWidth={2} aria-hidden />
                            </span>

                            <h3 className="mt-4 text-base font-semibold leading-snug tracking-[-0.012em] text-preto-suave transition-colors group-hover:text-verde-floresta sm:text-lg">
                              {link.label}
                            </h3>

                            {link.description ? (
                              <p className={`${copyOnLight} mt-2 flex-1 text-sm md:text-base`}>
                                {link.description}
                              </p>
                            ) : (
                              <span className="flex-1" aria-hidden />
                            )}

                            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-verde-floresta">
                              Acessar
                              <ArrowRight
                                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                aria-hidden
                              />
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
