import { useRef } from "react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { TeamBoard } from "@/components/equipe/TeamBoard";
import { teamMembers } from "@/data/equipe";
import {
  bodyLead,
  contentShell,
  containerPx,
  containerPyPage,
  headingPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useTeamSectionAnimation } from "@/hooks/useTeamSectionAnimation";

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useTeamSectionAnimation({ sectionRef, listRef });

  return (
    <main className={`${containerPx} ${containerPyPage}`}>
      <section ref={sectionRef} className={contentShell}>
        <PageBreadcrumb
          items={[
            { label: "Inicio", to: ROUTES.home },
            { label: "Equipe" },
          ]}
        />
        <h1 className={headingPage}>Equipe</h1>
        <p className={bodyLead}>
          Pessoas diferentes trabalhando por uma mesma paisagem.
        </p>

        <TeamBoard ref={listRef} members={teamMembers} />
      </section>
    </main>
  );
}
