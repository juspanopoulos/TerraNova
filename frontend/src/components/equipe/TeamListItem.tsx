import { TeamMemberAvatar } from "@/components/equipe/TeamMemberAvatar";
import { TeamSocialLinks } from "@/components/equipe/TeamSocialLinks";
import type { TeamMember } from "@/types/equipe";

type TeamListItemProps = {
  member: TeamMember;
};

export function TeamListItem({ member }: TeamListItemProps) {
  return (
    <li
      data-team-item
      className="border-b border-verde-floresta/12 py-8 last:border-b-0 sm:py-9 md:py-10"
    >
      {/* Mobile */}
      <div className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-4 md:hidden">
        <TeamMemberAvatar name={member.name} photo={member.photo} />

        <div className="min-w-0 border-l-2 border-verde-floresta/12 pl-3 sm:pl-6">
          <h2 className="text-base font-semibold leading-snug text-verde-floresta">
            {member.name}
          </h2>
          <p className="mt-1 text-xs font-medium text-preto-suave/45 sm:text-sm">
            RM {member.rm} · {member.turma}
          </p>
          <p className="mt-1.5 text-sm text-preto-suave/65">{member.role}</p>
        </div>

        <p className="col-span-2 text-sm leading-6 text-preto-suave/75">
          {member.bio}
        </p>

        <div className="col-span-2">
          <TeamSocialLinks social={member.social} memberName={member.name} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden items-start gap-8 md:grid md:grid-cols-[12rem_1fr] lg:grid-cols-[13rem_1fr] lg:gap-10 xl:grid-cols-[14rem_1fr]">
        <TeamMemberAvatar name={member.name} photo={member.photo} />

        <div className="min-w-0 border-l-2 border-verde-floresta/12 pl-8 lg:pl-10">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-lg font-semibold text-verde-floresta sm:text-xl">
              {member.name}
            </h2>
            <span className="text-xs font-medium text-preto-suave/45">
              RM {member.rm} · {member.turma}
            </span>
          </div>

          <p className="mt-2 text-sm text-preto-suave/65">{member.role}</p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-preto-suave/75 sm:text-[0.95rem] sm:leading-8">
            {member.bio}
          </p>

          <div className="mt-5">
            <TeamSocialLinks social={member.social} memberName={member.name} />
          </div>
        </div>
      </div>
    </li>
  );
}
