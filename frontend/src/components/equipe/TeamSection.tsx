import { useRef } from "react";
import { PageHero } from "@/components/PageHero";
import { TeamBoard } from "@/components/equipe/TeamBoard";
import {
  contentShell,
  containerPx,
  pageContentGap,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamSectionAnimation } from "@/hooks/useTeamSectionAnimation";

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { members, isLoading, error } = useTeamMembers();

  useTeamSectionAnimation({ sectionRef, listRef });

  return (
    <main>
      <PageHero
        breadcrumb={[
          { label: "Inicio", to: ROUTES.home },
          { label: "Equipe" },
        ]}
        eyebrow="Quem constrói"
        title="Equipe"
        subtitle="Pessoas diferentes trabalhando por uma mesma paisagem."
      />

      <div className={`${containerPx} pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-20`}>
        <section ref={sectionRef} className={`${contentShell} ${pageContentGap}`}>
          {isLoading ? (
            <p className="text-base text-preto-suave/70">Carregando equipe...</p>
          ) : error ? (
            <p className="text-base font-medium text-red-600">{error}</p>
          ) : (
            <TeamBoard ref={listRef} members={members} />
          )}
        </section>
      </div>
    </main>
  );
}
