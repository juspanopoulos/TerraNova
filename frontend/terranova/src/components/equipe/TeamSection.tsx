import { useRef } from "react";
import { Users } from "lucide-react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PageHeaderAccent } from "@/components/PageHeaderAccent";
import { PageTitle } from "@/components/PageTitle";
import { TeamBoard } from "@/components/equipe/TeamBoard";
import { teamMembers } from "@/data/equipe";
import {
  contentShell,
  containerPx,
  containerPyPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useTeamSectionAnimation } from "@/hooks/useTeamSectionAnimation";

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useTeamSectionAnimation({ sectionRef, listRef });

  return (
    <main>
      <PageHeaderAccent />
      <div className={`${containerPx} ${containerPyPage}`}>
        <section ref={sectionRef} className={contentShell}>
          <PageBreadcrumb
            items={[
              { label: "Inicio", to: ROUTES.home },
              { label: "Equipe" },
            ]}
          />
          <PageTitle
            icon={Users}
            subtitle="Pessoas diferentes trabalhando por uma mesma paisagem."
          >
            Equipe
          </PageTitle>

          <TeamBoard ref={listRef} members={teamMembers} />
        </section>
      </div>
    </main>
  );
}
