export const ROUTES = {
  home: "/",
  sobre: "/sobre",
  equipe: "/equipe",
  faq: "/faq",
  contato: "/contato",
  plataforma: "/plataforma",
  notFound: "*",
} as const;

export const SMOOTH_SCROLL_ROUTES = [
  ROUTES.home,
  ROUTES.sobre,
  ROUTES.equipe,
  ROUTES.faq,
  ROUTES.contato,
  ROUTES.notFound,
] as const;

const SMOOTH_SCROLL_FIXED_ROUTES = SMOOTH_SCROLL_ROUTES.filter(
  (route) => route !== ROUTES.notFound,
);

function isPlataformaPath(pathname: string) {
  return (
    pathname === ROUTES.plataforma ||
    pathname.startsWith(`${ROUTES.plataforma}/`)
  );
}

export function isSmoothScrollRoute(pathname: string) {
  if (
    SMOOTH_SCROLL_FIXED_ROUTES.includes(
      pathname as (typeof SMOOTH_SCROLL_FIXED_ROUTES)[number],
    )
  ) {
    return true;
  }

  if (!SMOOTH_SCROLL_ROUTES.includes(ROUTES.notFound)) return false;
  if (pathname === "/platform" || isPlataformaPath(pathname)) return false;

  return true;
}

export const NAV_LINKS = [
  { label: "Inicio", to: ROUTES.home },
  { label: "Sobre", to: ROUTES.sobre },
  { label: "Equipe", to: ROUTES.equipe },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Contato", to: ROUTES.contato },
  { label: "Plataforma", to: ROUTES.plataforma },
] as const;
