import { forwardRef } from "react";
import type { TeamMember } from "@/types/equipe";
import { TeamListItem } from "@/components/equipe/TeamListItem";

type TeamListProps = {
  members: TeamMember[];
};

export const TeamList = forwardRef<HTMLUListElement, TeamListProps>(
  function TeamList({ members }, ref) {
    return (
      <ul
        ref={ref}
        data-team-list
        className="mx-auto mt-8 w-full max-w-4xl sm:mt-10 lg:max-w-5xl"
      >
        {members.map((member) => (
          <TeamListItem key={member.id} member={member} />
        ))}
      </ul>
    );
  },
);
