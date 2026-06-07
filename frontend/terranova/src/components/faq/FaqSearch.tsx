import { Search, X } from "lucide-react";
import { faqSearchInput } from "@/components/faq/faqShared";

type FaqSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
};

export function FaqSearch({ query, onQueryChange, resultCount }: FaqSearchProps) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="w-full shrink-0 lg:max-w-md xl:max-w-lg">
      <label htmlFor="faq-search" className="sr-only">
        Buscar pergunta no FAQ
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-[1.125rem] -translate-y-1/2 text-preto-suave/45"
          aria-hidden
        />
        <input
          id="faq-search"
          type="text"
          role="searchbox"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar pergunta..."
          autoComplete="off"
          className={faqSearchInput}
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-preto-suave/50 transition-colors hover:bg-verde-floresta/10 hover:text-verde-floresta"
            aria-label="Limpar busca"
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
          hasQuery
            ? "mt-2 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-bege-natural">
            {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
          </p>
        </div>
      </div>
    </div>
  );
}
