import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logoColorido from "@/assets/logos/logo-colorido.png";
import { containerPx, contentShell, headerLogo, headerNav } from "@/constants/layout";
import { NAV_LINKS, ROUTES } from "@/constants/routes";

const navShell = [
  contentShell,
  containerPx,
  "flex min-h-16 items-center sm:min-h-[4.25rem] md:min-h-[4.75rem] lg:min-h-20",
].join(" ");

const navLinkBase =
  "cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm";

const desktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    navLinkBase,
    isActive
      ? "bg-verde-floresta text-bege-natural shadow-sm shadow-verde-floresta/20"
      : "text-preto-suave/80 hover:bg-verde-claro/50 hover:text-verde-floresta",
  ].join(" ");

const mobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "block cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors",
    isActive
      ? "bg-verde-floresta text-bege-natural"
      : "text-preto-suave/85 hover:bg-verde-claro/45 hover:text-verde-floresta",
  ].join(" ");

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const logoLink = (
    <NavLink
      className="inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-85 sm:gap-3"
      to={ROUTES.home}
      onClick={closeMenu}
    >
      <img
        src={logoColorido}
        alt="TerraNova"
        className={headerLogo}
        width={64}
        height={64}
        decoding="async"
      />
      <span className="text-sm font-semibold tracking-tight text-verde-floresta sm:text-base">
        TerraNova
      </span>
    </NavLink>
  );

  const renderLink = (
    link: (typeof NAV_LINKS)[number],
    className: typeof desktopLinkClassName,
    tabIndex?: number,
  ) => (
    <NavLink
      className={className}
      key={link.to}
      to={link.to}
      onClick={closeMenu}
      tabIndex={tabIndex}
    >
      {link.label}
    </NavLink>
  );

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-20 w-full border-b border-verde-floresta/10 bg-bege-natural shadow-sm shadow-verde-floresta/5">
        <div
          className="h-px bg-linear-to-r from-laranja-solar/70 via-verde-claro/50 to-verde-floresta/70"
          aria-hidden
        />

        <div className={navShell}>
          <div className="flex w-full items-center justify-between gap-4 md:hidden">
            {logoLink}
            <button
              type="button"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-verde-floresta/15 text-verde-floresta transition-colors hover:bg-verde-claro/45"
              aria-expanded={menuOpen}
              aria-controls="site-mobile-nav"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Menu className="size-4" aria-hidden />
            </button>
          </div>

          <div className="hidden w-full items-center justify-between gap-6 md:flex">
            {logoLink}
            <nav aria-label="Navegacao principal" className={headerNav}>
              {NAV_LINKS.map((link) => renderLink(link, desktopLinkClassName))}
            </nav>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={[
          "fixed inset-0 z-30 cursor-pointer bg-preto-suave/40 transition-opacity duration-300 md:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-label="Fechar menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <aside
        id="site-mobile-nav"
        aria-hidden={!menuOpen}
        className={[
          "fixed top-0 right-0 z-40 flex h-dvh w-[min(17rem,82vw)] flex-col border-l border-verde-floresta/10 bg-bege-natural shadow-2xl shadow-preto-suave/20 transition-transform duration-300 ease-out md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="h-px bg-linear-to-r from-laranja-solar/70 via-verde-claro/50 to-verde-floresta/70" />

        <div className="flex items-center justify-between border-b border-verde-floresta/10 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-verde-floresta/70">
            Menu
          </span>
          <button
            type="button"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-verde-floresta transition-colors hover:bg-verde-claro/45"
            aria-label="Fechar menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <nav
          aria-label="Navegacao mobile"
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
        >
          {NAV_LINKS.map((link) =>
            renderLink(link, mobileLinkClassName, menuOpen ? 0 : -1),
          )}
        </nav>
      </aside>
    </>
  );
};
