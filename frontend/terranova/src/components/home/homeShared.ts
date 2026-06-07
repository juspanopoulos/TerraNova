export const homePageStack = 'flex flex-col'

export const homeShell =
  'mx-auto w-full max-w-6xl px-4 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'

export const homeEyebrow =
  'text-xs font-bold uppercase tracking-[0.24em] text-laranja-solar'

export const homeEyebrowLight =
  'text-xs font-bold uppercase tracking-[0.24em] text-laranja-solar'

export const homeHeroTitle =
  'text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-bege-natural sm:text-5xl md:text-6xl lg:text-[4.25rem]'

export const homeSectionTitle =
  'text-3xl font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl md:text-[2.75rem] lg:text-5xl'

export const homeSectionTitleLight = `${homeSectionTitle} text-bege-natural`

export const homeSectionTitleForest = `${homeSectionTitle} text-verde-floresta`

export const homeLeadLight =
  'text-base leading-relaxed text-bege-natural/85 sm:text-lg sm:leading-[1.75]'

export const homeLeadDark =
  'text-base leading-relaxed text-preto-suave/75 sm:text-lg sm:leading-[1.75]'

export const homeImpactCard =
  'rounded-2xl border border-white/25 bg-bege-natural/96 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:rounded-3xl sm:p-7'

export const homeImpactCardSolid =
  'rounded-2xl border border-verde-floresta/10 bg-bege-natural p-6 shadow-xl shadow-verde-floresta/12 sm:rounded-3xl sm:p-7'

export const homeImpactCardDark =
  'rounded-2xl border border-bege-natural/18 bg-surface-night/90 p-6 text-bege-natural shadow-2xl shadow-black/35 backdrop-blur-md sm:rounded-3xl sm:p-7'

export const homeGlassCard =
  'rounded-2xl border border-white/20 bg-white/12 p-6 text-bege-natural shadow-xl shadow-black/20 backdrop-blur-lg sm:rounded-3xl sm:p-7'

export const homeStatCard =
  'rounded-2xl bg-white p-6 text-center shadow-xl shadow-verde-floresta/15 ring-1 ring-verde-floresta/10 sm:p-8'

export const homeIconCircle =
  'inline-flex size-12 items-center justify-center rounded-full bg-verde-floresta text-bege-natural shadow-lg shadow-verde-floresta/30'

export const homeIconCircleSoft =
  'inline-flex size-12 items-center justify-center rounded-full bg-verde-floresta/12 text-verde-floresta'

export const homeIconCircleLaranja =
  'inline-flex size-12 items-center justify-center rounded-full bg-laranja-solar text-surface-night shadow-lg shadow-laranja-solar/30'

export const homeModuleCard =
  'group relative overflow-hidden rounded-2xl bg-bege-natural/95 p-6 shadow-lg shadow-black/15 ring-1 ring-bege-natural/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-laranja-solar/40 sm:p-7'

export const homeStatNumber =
  'text-4xl font-bold tabular-nums tracking-[-0.04em] text-verde-floresta sm:text-5xl'

export const homeStatNumberLight =
  'text-4xl font-bold tabular-nums tracking-[-0.04em] text-bege-natural sm:text-5xl'

/** Opacidade do overlay bege (0–1) — defina na section pai com style */
export type HomeSectionOverlayOpacity = {
  '--home-overlay-start': string
  '--home-overlay-mid': string
  '--home-overlay-end': string
}

export const homeAlertsOverlayOpacity: HomeSectionOverlayOpacity = {
  '--home-overlay-start': '0.42',
  '--home-overlay-mid': '0.32',
  '--home-overlay-end': '0.38',
}

export const homeGrowthOverlayOpacity: HomeSectionOverlayOpacity = {
  '--home-overlay-start': '0.58',
  '--home-overlay-mid': '0.42',
  '--home-overlay-end': '0.52',
}

export const homePlatformOverlayOpacity: HomeSectionOverlayOpacity = {
  '--home-overlay-start': '0.48',
  '--home-overlay-mid': '0.36',
  '--home-overlay-end': '0.44',
}

export const homeCtaOverlayOpacity: HomeSectionOverlayOpacity = {
  '--home-overlay-start': '0.28',
  '--home-overlay-mid': '0.18',
  '--home-overlay-end': '0.24',
}
