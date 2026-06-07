import { useEffect, useState } from "react";
import { ChevronDown, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  btnClick,
  DASHBOARD_ROUTES,
  isSettingsPath,
  SETTINGS_NAV_ITEMS,
  SETTINGS_ROUTE_BY_TAB,
} from "@/constants/dashboard";

export function SettingsNavGroup({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const location = useLocation();
  const settingsActive = isSettingsPath(location.pathname);
  const [open, setOpen] = useState(settingsActive);

  useEffect(() => {
    if (settingsActive) setOpen(true);
  }, [settingsActive]);

  return (
    <div className="mt-2 border-t border-[var(--db-border-soft)] pt-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title={!isSidebarOpen ? "Configurações" : undefined}
        className={[
          btnClick,
          "flex w-full items-center rounded-lg text-sm font-semibold",
          isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
          settingsActive
            ? "bg-verde-floresta/10 text-verde-floresta"
            : "text-[var(--db-text-muted)] hover:bg-[var(--db-hover)]",
        ].join(" ")}
        aria-expanded={open}
      >
        <Settings className="size-4 shrink-0" />
        {isSidebarOpen && (
          <>
            <span className="flex-1 truncate text-left">Configurações</span>
            <ChevronDown
              className={[
                "size-4 shrink-0 dashboard-soft",
                open ? "rotate-180" : "rotate-0",
              ].join(" ")}
              aria-hidden
            />
          </>
        )}
      </button>

      {open && isSidebarOpen && (
        <div className="mt-1 space-y-0.5 pl-2">
          {SETTINGS_NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <NavLink
              key={id}
              to={SETTINGS_ROUTE_BY_TAB[id]}
              end
              className={({ isActive }) =>
                [
                  btnClick,
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 pl-7 pr-3 text-sm font-semibold no-underline",
                  isActive
                    ? "bg-verde-floresta/10 text-verde-floresta"
                    : "text-[var(--db-text-muted)] hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]",
                ].join(" ")
              }
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {!isSidebarOpen && settingsActive && (
        <NavLink
          to={DASHBOARD_ROUTES.configuracoesGeral}
          className={`${btnClick} mt-1 flex w-full cursor-pointer justify-center rounded-lg p-2 text-verde-floresta`}
          title="Configurações"
        >
          <Settings className="size-4" />
        </NavLink>
      )}
    </div>
  );
}
