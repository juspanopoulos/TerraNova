import { useMemo, useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { faqCategories } from "@/data/faq";
import { FaqCta } from "@/components/faq/FaqCta";
import { FaqQuestionRow } from "@/components/faq/FaqQuestionRow";
import {
  faqCategoryEyebrow,
  faqCategoryTitle,
  faqExplorerShell,
  faqMobileChip,
  faqMobileChipActive,
  faqMobileChipIdle,
  faqSidebarBtn,
  faqSidebarBtnActive,
  faqSidebarBtnIdle,
  faqSidebarLabel,
  faqSidebarMeta,
} from "@/components/faq/faqShared";

type FaqExplorerProps = {
  query: string;
};

type FlatQuestion = {
  key: string;
  categoryId: string;
  categoryLabel: string;
  item: (typeof faqCategories)[number]["items"][number];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function FaqExplorer({ query }: FaqExplorerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(faqCategories[0].id);
  const [openId, setOpenId] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const normalizedQuery = normalize(trimmedQuery);

  const flatQuestions = useMemo<FlatQuestion[]>(
    () =>
      faqCategories.flatMap((category) =>
        category.items.map((item) => ({
          key: `${category.id}-${item.id}`,
          categoryId: category.id,
          categoryLabel: category.label,
          item,
        })),
      ),
    [],
  );

  const filteredQuestions = useMemo(() => {
    if (!normalizedQuery) return [];

    return flatQuestions.filter(
      ({ item }) =>
        normalize(item.question).includes(normalizedQuery) ||
        normalize(item.answer).includes(normalizedQuery),
    );
  }, [flatQuestions, normalizedQuery]);

  const isSearching = normalizedQuery.length > 0;
  const activeCategory =
    faqCategories.find((category) => category.id === activeCategoryId) ??
    faqCategories[0];

  const visibleQuestions = isSearching
    ? filteredQuestions
    : activeCategory.items.map((item) => ({
        key: `${activeCategory.id}-${item.id}`,
        categoryId: activeCategory.id,
        categoryLabel: activeCategory.label,
        item,
      }));

  const ActiveIcon = activeCategory.icon;

  return (
    <div className={faqExplorerShell}>
      <div className="grid gap-10 md:grid-cols-[17rem_1fr] md:gap-12 xl:grid-cols-[19rem_1fr] xl:gap-14">
        <aside
          data-faq-block
          className="md:sticky md:top-20 md:self-start"
          aria-label="Categorias do FAQ"
        >
          <p className={`${faqCategoryEyebrow} text-sm sm:text-[0.7rem]`}>Temas</p>

          <ul className="mt-5 space-y-1.5 max-md:hidden">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              const isActive = !isSearching && category.id === activeCategoryId;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategoryId(category.id);
                      setOpenId(null);
                    }}
                    className={`${faqSidebarBtn} ${
                      isActive ? faqSidebarBtnActive : faqSidebarBtnIdle
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-laranja-solar/15 text-laranja-solar"
                          : "bg-verde-floresta/12 text-verde-floresta group-hover:bg-laranja-solar/15 group-hover:text-laranja-solar"
                      }`}
                    >
                      <Icon className="size-[1.125rem]" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={faqSidebarLabel}>{category.label}</span>
                      <span className={faqSidebarMeta}>
                        {category.items.length} perguntas
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {faqCategories.map((category) => {
              const isActive = !isSearching && category.id === activeCategoryId;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setOpenId(null);
                  }}
                  className={`${faqMobileChip} ${
                    isActive ? faqMobileChipActive : faqMobileChipIdle
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">
          <header
            data-faq-block
            className="border-b border-verde-floresta/12 pb-6 sm:pb-8"
          >
            {isSearching ? (
              <div>
                <p className={faqCategoryEyebrow}>Busca</p>
                <h2 className={`${faqCategoryTitle} mt-2`}>
                  Resultados para &ldquo;{trimmedQuery}&rdquo;
                </h2>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-laranja-solar/15 text-laranja-solar sm:size-14">
                  <ActiveIcon className="size-6 sm:size-7" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className={faqCategoryTitle}>{activeCategory.label}</h2>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-preto-suave/75">
                    {activeCategory.description}
                  </p>
                </div>
              </div>
            )}
          </header>

          <div data-faq-block className="mt-6 space-y-1.5 sm:mt-8">
            {visibleQuestions.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center sm:py-20">
                <MessageCircleQuestion
                  className="size-10 text-verde-floresta/30"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <p className="mt-4 text-lg font-semibold text-preto-suave">
                  Nenhuma pergunta encontrada
                </p>
                <p className="mt-2 max-w-sm text-sm text-preto-suave/60">
                  Tente outro termo ou navegue pelas categorias.
                </p>
              </div>
            ) : (
              visibleQuestions.map(({ key, categoryLabel, item }, index) => (
                <FaqQuestionRow
                  key={key}
                  id={key}
                  index={index}
                  question={item.question}
                  answer={item.answer}
                  categoryLabel={isSearching ? categoryLabel : undefined}
                  isOpen={openId === key}
                  onToggle={() =>
                    setOpenId((current) => (current === key ? null : key))
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      <FaqCta />
    </div>
  );
}
