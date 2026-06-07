/** Espaço entre o PageHero e o conteúdo da página Contato */
export const contactContentGap = "mt-12 sm:mt-14 md:mt-16";

export const contactGridGap = "gap-8 lg:gap-10 xl:gap-12";

export const contactLabel =
  "text-xs font-semibold uppercase tracking-[0.22em] text-verde-floresta/70";

export const contactSectionTitle =
  "mt-3 text-xl font-bold leading-tight tracking-[-0.018em] text-preto-suave sm:text-2xl";

/** Painel do formulário e estado de sucesso */
export const contactPanel =
  "relative overflow-hidden rounded-3xl bg-verde-floresta/5 p-6 ring-1 ring-inset ring-verde-floresta/10 sm:p-8 lg:p-9";

/** Card de canal de contato */
export const contactChannelCard =
  "group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl bg-verde-floresta/5 p-4 ring-1 ring-inset ring-verde-floresta/10 outline-none transition-[background-color] duration-200 hover:bg-verde-floresta/10 hover:ring-verde-floresta/30 focus-visible:ring-2 focus-visible:ring-verde-floresta/35 active:shadow-none sm:p-5";

export const contactInput = [
  "w-full rounded-xl border border-verde-floresta/12 bg-white px-4 py-3.5 text-base text-preto-suave",
  "placeholder:text-preto-suave/40",
  "outline-none transition-[border-color,box-shadow] duration-200",
  "focus:border-laranja-solar focus:shadow-sm focus:shadow-laranja-solar/10",
].join(" ");

export const contactTextarea = [
  contactInput,
  "min-h-[9.5rem] resize-y leading-relaxed",
].join(" ");

export const contactInputError =
  "border-red-400 focus:border-red-500 focus:shadow-red-500/10";

export const contactFieldError = "mt-1.5 text-sm font-medium text-red-600";

export const contactFieldLabel =
  "mb-2 block text-sm font-semibold text-preto-suave/90";
