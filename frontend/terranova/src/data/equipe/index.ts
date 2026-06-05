import type { TeamMember, TeamMemberData } from "@/types/equipe";
import manifest from "./team.json";

const memberModules = import.meta.glob("./members/*.json", {
  eager: true,
  import: "default",
}) as Record<string, TeamMemberData>;

const photoModules = import.meta.glob("@/assets/images/equipe/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const membersById = Object.values(memberModules).reduce<
  Record<string, TeamMemberData>
>((acc, member) => {
  acc[member.id] = member;
  return acc;
}, {});

function resolvePhoto(memberId: string): string {
  const match = Object.entries(photoModules).find(([path]) => {
    const fileName = path.split("/").pop() ?? "";
    const baseName = fileName.replace(/\.[^.]+$/, "");
    return baseName === memberId;
  });

  return match?.[1] ?? "";
}

export const teamMembers: TeamMember[] = manifest.memberIds
  .map((id) => {
    const member = membersById[id];

    if (!member) {
      console.error(
        `[equipe] Membro nao encontrado: "${id}". Verifique team.json e o campo "id" em members/*.json.`,
      );
      return null;
    }

    return {
      ...member,
      photo: resolvePhoto(id),
    };
  })
  .filter((member): member is TeamMember => member !== null)
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
