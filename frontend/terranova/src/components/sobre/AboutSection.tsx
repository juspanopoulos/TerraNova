import { useRef } from "react";
import { AboutCta } from "@/components/sobre/AboutCta";
import { AboutHighlights } from "@/components/sobre/AboutHighlights";
import { AboutIntro } from "@/components/sobre/AboutIntro";
import { AboutMission } from "@/components/sobre/AboutMission";
import { AboutPlatformGrid } from "@/components/sobre/AboutPlatformGrid";
import { PageHero } from "@/components/PageHero";
import {
  aboutHeroContentGap,
  aboutPageStack,
  aboutSectionEndPad,
} from "@/components/sobre/aboutShared";
import {
  contentShell,
  containerPx,
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

      <div
        className={`${contentShell} ${containerPx} pb-0`}
      >
        <div ref={sectionRef} className={aboutHeroContentGap}>
          <div className={aboutPageStack}>
            <AboutIntro />

            <AboutMission />

            <div className={aboutSectionEndPad}>
              <AboutPlatformGrid />
            </div>

            <AboutHighlights />
          </div>
        </div>
      </div>

      <AboutCta />
    </main>
  );
}
