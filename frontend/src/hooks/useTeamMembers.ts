import { useEffect, useState } from "react";
import { loadTeamMembers } from "@/services/equipeService";
import type { TeamMember } from "@/types/equipe";

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadTeamMembers()
      .then((loadedMembers) => {
        if (!cancelled) setMembers(loadedMembers);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Nao foi possivel carregar a equipe.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { members, isLoading, error };
}
