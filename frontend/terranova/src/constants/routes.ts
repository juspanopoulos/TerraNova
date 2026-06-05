export const ROUTES = {
  home: "/",
  sobre: "/sobre",
  equipe: "/equipe",
  faq: "/faq",
  plataforma: "/plataforma",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", to: ROUTES.home },
  { label: "Sobre", to: ROUTES.sobre },
  { label: "Equipe", to: ROUTES.equipe },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Plataforma", to: ROUTES.plataforma },
] as const;
