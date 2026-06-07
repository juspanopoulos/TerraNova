export const ROUTES = {
  home: "/",
  sobre: "/sobre",
  equipe: "/equipe",
  faq: "/faq",
  contato: "/contato",
  plataforma: "/plataforma",
} as const;

export const SMOOTH_SCROLL_ROUTES = [
  ROUTES.home,
  ROUTES.sobre,
  ROUTES.equipe,
  ROUTES.faq,
  ROUTES.contato,
] as const;

export const NAV_LINKS = [
  { label: "Inicio", to: ROUTES.home },
  { label: "Sobre", to: ROUTES.sobre },
  { label: "Equipe", to: ROUTES.equipe },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Contato", to: ROUTES.contato },
  { label: "Plataforma", to: ROUTES.plataforma },
] as const;
