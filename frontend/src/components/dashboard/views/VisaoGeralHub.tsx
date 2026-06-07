import { OverviewWelcomeCard } from "@/components/dashboard/views/OverviewWelcomeCard";
import { VisionNavCards } from "@/components/dashboard/ui";

export function VisaoGeralHub() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <OverviewWelcomeCard />
      <VisionNavCards />
    </div>
  );
}
