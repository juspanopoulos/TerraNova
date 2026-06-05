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
  contentShell,
  containerPx,
  containerPyPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useAboutSectionAnimation } from "@/hooks/useAboutSectionAnimation";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useAboutSectionAnimation({ sectionRef });

  return (
    <main>
      <PageHeaderAccent />
      <div className={`${containerPx} ${containerPyPage}`}>
        <section ref={sectionRef} className={contentShell}>
          <PageBreadcrumb
            items={[
              { label: "Inicio", to: ROUTES.home },
              { label: "Sobre" },
            ]}
          />
          <PageTitle
            icon={Leaf}
            subtitle="Uma base digital para aproximar pessoas, territorio e boas ideias."
          >
            Sobre
          </PageTitle>

          <AboutIntro />
          <AboutMission />
          <AboutPlatformGrid />
          <AboutHighlights />
          <AboutCta />
        </section>
      </div>
    </main>
  );
}
