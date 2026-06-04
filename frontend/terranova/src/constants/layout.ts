/**
 * Classes alinhadas aos breakpoints em tailwind.config.ts:
 * xs ≤480 | sm 481–767 | md 768–991 | lg 992–1299 | xl ≥1300
 *
 * Em ranges (md/lg/sm), repita em xl quando o estilo deve continuar acima de 1299px.
 */

export const containerPx =
  'px-4 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'

export const containerPyPage =
  'py-10 sm:py-12 md:py-16 lg:py-20 xl:py-20'

export const containerPyMain =
  'py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16'

export const contentShell = 'mx-auto w-full max-w-6xl'

export const pageMain = [contentShell, containerPx, containerPyPage].join(' ')

export const homeMain = [contentShell, containerPx, containerPyMain].join(' ')

export const eyebrow =
  'text-xs font-semibold uppercase tracking-wide text-laranja-solar sm:text-sm'

export const headingPage =
  'mt-3 max-w-3xl text-3xl font-bold leading-tight text-verde-floresta xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl'

export const bodyLead =
  'mt-4 text-base leading-7 text-preto-suave/75 sm:mt-6 sm:text-lg sm:leading-8'

export const gridCards =
  'grid gap-4 sm:grid-cols-1 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-3 xl:gap-6'

export const headerInner = [
  'mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between',
  'gap-3 px-4 py-3',
  'xs:flex-col xs:items-start xs:gap-3 xs:py-4',
  'sm:min-h-[4.25rem] sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4',
  'md:min-h-[4.75rem] md:gap-6 md:px-8 md:py-0',
  'lg:min-h-20 lg:px-12',
  'xl:min-h-20 xl:px-16',
].join(' ')

export const headerLogo =
  'h-11 w-11 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-16 xl:w-16'

export const headerNav =
  'flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-2.5'

export const headerNavLinkBase =
  'rounded-md px-2.5 py-2 text-sm font-semibold transition sm:px-3 sm:py-2 sm:text-sm md:text-base md:px-3.5 md:py-2.5 lg:text-base lg:px-4 lg:py-2.5 xl:text-base xl:px-4 xl:py-2.5'

export const footerInner = [
  'mx-auto flex w-full max-w-6xl flex-wrap items-start justify-between',
  'gap-6 px-4 py-8',
  'xs:flex-col xs:items-start xs:gap-5',
  'sm:px-6 sm:py-10',
  'md:flex-row md:items-center md:px-8',
  'lg:px-12 lg:py-12',
  'xl:px-16 xl:py-12',
].join(' ')
