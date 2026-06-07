import { useRef } from "react";
import { AboutCta } from "@/components/sobre/AboutCta";
import { AboutHighlights } from "@/components/sobre/AboutHighlights";
import { AboutIntro } from "@/components/sobre/AboutIntro";
import { AboutMission } from "@/components/sobre/AboutMission";
import { AboutPlatformGrid } from "@/components/sobre/AboutPlatformGrid";
import { PageHero } from "@/components/PageHero";
import {
  aboutPageStack,
  aboutPreCtaPad,
  aboutSectionEndPad,
} from "@/components/sobre/aboutShared";
import {
  contentShell,
  containerPx,
  pageContentGap,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useAboutSectionAnimation } from "@/hooks/useAboutSectionAnimation";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useAboutSectionAnimation({ sectionRef });

  return (
    <main>
      <PageHero
        breadcrumb={[
          { label: "Inicio", to: ROUTES.home },
          { label: "Sobre" },
        ]}
        eyebrow="Institucional"
        title="Sobre"
        subtitle="Uma base digital para aproximar pessoas, território e boas ideias."
      />

      <div className={`${containerPx} pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-20`}>
        <div ref={sectionRef} className={`${contentShell} ${pageContentGap}`}>
          <div className={aboutPageStack}>
            <AboutIntro />

            <AboutMission />

            <div className={aboutSectionEndPad}>
              <AboutPlatformGrid />
            </div>

            <div className={aboutPreCtaPad}>
              <AboutHighlights />
            </div>
          </div>

          <AboutCta />
        </div>
      </div>
    </main>
  );
}
