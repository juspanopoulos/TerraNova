import type { TeamMember, TeamMemberData, TeamManifest } from "@/types/equipe";
import { resolveAssetById } from "@/utils/assets/resolveAssetById";

const memberLoaders = import.meta.glob<TeamMemberData>(
  "@/data/equipe/members/*.json",
  { import: "default" },
);

const photoLoaders = import.meta.glob<string>("@/assets/images/equipe/*", {
  import: "default",
});

async function loadMemberData(id: string): Promise<TeamMemberData | null> {
  const loaderKey = Object.keys(memberLoaders).find((path) =>
    path.endsWith(`/${id}.json`),
  );

  if (!loaderKey) {
    console.error(
      `[equipe] Membro nao encontrado: "${id}". Verifique team.json e o campo "id" em members/*.json.`,
    );
    return null;
  }

  return memberLoaders[loaderKey]();
}

export async function loadTeamMembers(): Promise<TeamMember[]> {
  const { default: manifest } = await import("@/data/equipe/team.json");
  const { memberIds } = manifest as TeamManifest;

  const members = await Promise.all(
    memberIds.map(async (id) => {
      const member = await loadMemberData(id);
      if (!member) return null;

      const photo = await resolveAssetById(photoLoaders, id);
      return { ...member, photo };
    }),
  );

  return members
    .filter((member): member is TeamMember => member !== null)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}
