/** Espaço extra entre o PageHero e o conteúdo da página Sobre */
export const aboutHeroContentGap = "mt-12 sm:mt-14 md:mt-16";

/** Espaço uniforme entre blocos da página Sobre (usar no wrapper pai; excluir AboutCta) */
export const aboutPageStack = "flex flex-col gap-16 sm:gap-20 md:gap-24";

/** Respiro inferior antes do CTA (Highlights → AboutCta) */
export const aboutPreCtaPad = "pb-12 sm:pb-16 md:pb-20";

/** Margem superior do CTA — complementa o pb do Highlights */
export const aboutCtaMt = "mt-12 sm:mt-16 md:mt-20";

/** Respiro inferior antes do próximo bloco — espelha o pb interno da Mission */
export const aboutSectionEndPad = "pb-10 sm:pb-12 md:pb-14";

/** Espaço entre título da seção e o conteúdo abaixo */
export const aboutContentGap = "mt-8 sm:mt-10";

/** Espaço vertical interno (ex.: blockquote → grid) */
export const aboutStackGap = "space-y-8 sm:space-y-10";

/** Gap padrão em grids de duas colunas ou mistos */
export const aboutGridGap = "gap-6 lg:gap-8";

/** Grid de cards: empilha no mobile, 3 colunas a partir de md */
export const aboutCardGrid =
  "grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6";

/** Padding vertical em seções full-bleed */
export const aboutSectionPad = "py-10 sm:py-12 md:py-14";

export const aboutEyebrow =
  "text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar";

export const aboutSectionTitle =
  "mt-3 max-w-3xl text-2xl font-bold leading-tight tracking-[-0.018em] text-preto-suave sm:text-3xl";

export const aboutCard =
  "rounded-2xl border border-verde-floresta/10 bg-white shadow-sm shadow-verde-floresta/[0.04]";

/** Painel verde suave — mesmo visual do AboutIntro */
export const aboutSoftPanel =
  "relative overflow-hidden rounded-3xl bg-verde-floresta/5 ring-1 ring-inset ring-verde-floresta/10";

/** Conteúdo interno do painel suave */
export const aboutSoftPanelInner =
  "flex h-full min-h-[11rem] flex-col p-5 sm:min-h-[12rem] sm:p-6";

/** Card padrão da página Sobre — altura mínima e padding responsivos */
export const aboutCardInner =
  "flex h-full min-h-[11rem] flex-col p-5 sm:min-h-[12rem] sm:p-6";
