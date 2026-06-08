export const ROUTES = {
  home: "/",
  sobre: "/sobre",
  equipe: "/equipe",
  faq: "/faq",
  contato: "/contato",
  mapaDoSite: "/mapa-do-site",
  plataforma: "/plataforma",
  notFound: "*",
} as const;

export const SMOOTH_SCROLL_ROUTES = [
  ROUTES.home,
  ROUTES.sobre,
  ROUTES.equipe,
  ROUTES.faq,
  ROUTES.contato,
  ROUTES.mapaDoSite,
] as const;

function isPlataformaPath(pathname: string) {
  return (
    pathname === ROUTES.plataforma ||
    pathname.startsWith(`${ROUTES.plataforma}/`)
  );
}

export function isKnownSiteRoute(pathname: string) {
  if (pathname === ROUTES.home) return true;
  if (pathname === ROUTES.sobre) return true;
  if (pathname === ROUTES.equipe) return true;
  if (pathname === ROUTES.faq) return true;
  if (pathname === ROUTES.contato) return true;
  if (pathname === ROUTES.mapaDoSite) return true;
  if (pathname === "/platform") return true;
  if (isPlataformaPath(pathname)) return true;
  return false;
}

export function isNotFoundRoute(pathname: string) {
  return !isKnownSiteRoute(pathname);
}

export function isSmoothScrollRoute(pathname: string) {
  return SMOOTH_SCROLL_ROUTES.includes(
    pathname as (typeof SMOOTH_SCROLL_ROUTES)[number],
  );
}

export const NAV_LINKS = [
  { label: "Inicio", to: ROUTES.home },
  { label: "Sobre", to: ROUTES.sobre },
  { label: "Equipe", to: ROUTES.equipe },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Contato", to: ROUTES.contato },
  { label: "Plataforma", to: ROUTES.plataforma },
] as const;
