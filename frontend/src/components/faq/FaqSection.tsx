import { useMemo, useRef, useState } from "react";
import { faqCategories } from "@/data/faq";
import { PageHero } from "@/components/PageHero";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { faqContentGap } from "@/constants/tokens/faq";
import { FaqSearch } from "@/components/faq/FaqSearch";
import {
  contentShell,
  containerPx,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useFaqSectionAnimation } from "@/hooks/useFaqSectionAnimation";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const resultCount = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return 0;

    return faqCategories.reduce(
      (total, category) =>
        total +
        category.items.filter(
          (item) =>
            normalize(item.question).includes(normalizedQuery) ||
            normalize(item.answer).includes(normalizedQuery),
        ).length,
      0,
    );
  }, [query]);

  useFaqSectionAnimation({ sectionRef });

  return (
    <main className="bg-bege-natural">
      <PageHero
        breadcrumb={[
          { label: "Inicio", to: ROUTES.home },
          { label: "FAQ" },
        ]}
        eyebrow="Central de ajuda"
        title="FAQ"
        subtitle="Encontre respostas para as dúvidas mais comuns antes de começar a usar a plataforma."
        aside={
          <FaqSearch
            query={query}
            onQueryChange={setQuery}
            resultCount={resultCount}
          />
        }
      />

      <div
        className={`${contentShell} ${containerPx} pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-20`}
      >
        <section ref={sectionRef} className={faqContentGap}>
          <FaqExplorer query={query} />
        </section>
      </div>
    </main>
  );
}
