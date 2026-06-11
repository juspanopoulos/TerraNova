import { Link } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { OverviewWelcomeCard } from "@/components/dashboard/views/OverviewWelcomeCard";
import { VisionNavCards } from "@/components/dashboard/ui";
import { btnClick, DASHBOARD_ROUTES } from "@/constants/dashboard";

export function VisaoGeralHub() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <Link
          to={DASHBOARD_ROUTES.cadastrarArea}
          className={`${btnClick} inline-flex items-center gap-2 rounded-lg bg-verde-floresta px-4 py-2 text-sm font-semibold text-bege-natural shadow-sm hover:bg-verde-floresta/90`}
        >
          <MapPinned className="size-4" aria-hidden />
          Cadastrar uma área
        </Link>
      </div>
      <OverviewWelcomeCard />
      <VisionNavCards />
    </div>
  );
}
