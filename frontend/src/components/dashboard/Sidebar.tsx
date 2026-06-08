import { ChevronLeft, ChevronRight, Home, LogOut } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoColorido from "@/assets/logos/logo-colorido.png";
import {
  btnClick,
  LOGO_SRC,
  NAV_ITEMS,
  pathToViewId,
  VIEW_ROUTE_BY_ID,
} from "@/constants/dashboard";
import { ROUTES } from "@/constants/routes";
import { SettingsNavGroup } from "@/components/dashboard/SettingsNavGroup";
import { useDashboard } from "@/context/DashboardContext";

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar, logout, resetSelections } = useDashboard();

  return (
    <aside
      className={[
        "flex h-full max-h-dvh shrink-0 flex-col border-r border-[var(--db-border)] bg-[var(--db-surface)] transition-[width] duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-18",
      ].join(" ")}
      aria-label="Navegação"
    >
      <div
        className={[
          "flex shrink-0 flex-col gap-2 border-b border-[var(--db-border-soft)] py-4",
          isSidebarOpen ? "px-4" : "items-center px-2",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-full items-center",
            isSidebarOpen ? "justify-between gap-2" : "flex-col justify-center gap-2",
          ].join(" ")}
        >
          <Link
            to={ROUTES.home}
            className={[
              btnClick,
              "flex min-w-0 cursor-pointer items-center",
              isSidebarOpen ? "gap-2.5" : "justify-center",
            ].join(" ")}
            title="TerraNova"
          >
            <img
              src={LOGO_SRC}
              alt={isSidebarOpen ? "" : "TerraNova"}
              className={isSidebarOpen ? "h-12 w-12 object-contain" : "h-11 w-11 object-contain"}
              aria-hidden={isSidebarOpen}
              onError={(e) => {
                (e.target as HTMLImageElement).src = logoColorido;
              }}
            />
            {isSidebarOpen && (
              <span className="truncate text-lg font-bold tracking-tight text-verde-floresta">
                TerraNova
              </span>
            )}
          </Link>
          {isSidebarOpen ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className={`${btnClick} rounded-lg p-2 text-[var(--db-text-muted)] hover:bg-[var(--db-hover)] hover:text-verde-floresta`}
              aria-label="Recolher menu"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              className={`${btnClick} rounded-lg p-2 text-[var(--db-text-muted)] hover:bg-[var(--db-hover)] hover:text-verde-floresta`}
              aria-label="Expandir menu"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2 sm:p-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <NavLink
            key={id}
            to={VIEW_ROUTE_BY_ID[id]}
            end={id !== "overview"}
            title={!isSidebarOpen ? label : undefined}
            onClick={resetSelections}
            className={({ isActive }) => {
              const active =
                id === "overview"
                  ? pathToViewId(location.pathname) === "overview"
                  : isActive;
              return [
                btnClick,
                "flex w-full cursor-pointer items-center rounded-lg text-sm font-semibold no-underline",
                isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
                active
                  ? "bg-verde-floresta/10 text-verde-floresta"
                  : "text-[var(--db-text-muted)] hover:bg-[var(--db-hover)]",
              ].join(" ");
            }}
          >
            <Icon className="size-4 shrink-0" />
            {isSidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
        <SettingsNavGroup isSidebarOpen={isSidebarOpen} />
      </nav>

      <div className="shrink-0 space-y-1 border-t border-[var(--db-border-soft)] p-2 sm:p-3">
        <Link
          to={ROUTES.home}
          title="Voltar ao Início"
          className={[
            btnClick,
            "flex w-full cursor-pointer items-center rounded-lg text-sm font-semibold text-[var(--db-text-muted)] hover:bg-[var(--db-hover)] no-underline",
            isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
          ].join(" ")}
        >
          <Home className="size-4 shrink-0" />
          {isSidebarOpen && <span>Voltar ao Início</span>}
        </Link>
        <button
          type="button"
          onClick={logout}
          className={[
            btnClick,
            "flex w-full items-center rounded-lg text-sm font-semibold text-[var(--db-text-faint)] hover:bg-laranja-solar/10 hover:text-laranja-solar",
            isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
          ].join(" ")}
        >
          <LogOut className="size-4 shrink-0" />
          {isSidebarOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
