import { useRef } from "react";
import { Leaf } from "lucide-react";
import { AboutCta } from "@/components/sobre/AboutCta";
import { AboutHighlights } from "@/components/sobre/AboutHighlights";
import { AboutIntro } from "@/components/sobre/AboutIntro";
import { AboutMission } from "@/components/sobre/AboutMission";
import { AboutPlatformGrid } from "@/components/sobre/AboutPlatformGrid";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PageHeaderAccent } from "@/components/PageHeaderAccent";
import { PageTitle } from "@/components/PageTitle";
import {
  aboutPageStack,
  aboutPreCtaPad,
  aboutSectionEndPad,
} from "@/components/sobre/aboutShared";
import {
  contentShell,
  containerPx,
  pageHeaderEdgeGap,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useAboutSectionAnimation } from "@/hooks/useAboutSectionAnimation";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useAboutSectionAnimation({ sectionRef });

  return (
    <main>
      <PageHeaderAccent />
      <div className={`${containerPx} ${pageHeaderEdgeGap}`}>
        <div ref={sectionRef}>
          <div className={aboutPageStack}>
            <div className={contentShell}>
              <PageBreadcrumb
                items={[
                  { label: "Inicio", to: ROUTES.home },
                  { label: "Sobre" },
                ]}
              />
              <PageTitle
                icon={Leaf}
                subtitle="Uma base digital para aproximar pessoas, território e boas ideias."
              >
                Sobre
              </PageTitle>

              <AboutIntro />
            </div>

            <AboutMission />

            <div className={`${contentShell} ${aboutSectionEndPad}`}>
              <AboutPlatformGrid />
            </div>

            <div className={`${contentShell} ${aboutPreCtaPad}`}>
              <AboutHighlights />
            </div>
          </div>

          <AboutCta />
        </div>
      </div>
    </main>
  );
}
