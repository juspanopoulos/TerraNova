import { useMemo, useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { faqCategories } from "@/data/faq";
import { FaqCta } from "@/components/faq/FaqCta";
import { FaqQuestionRow } from "@/components/faq/FaqQuestionRow";
import {
  faqCategoryEyebrow,
  faqCategoryTitle,
  faqExplorerGrid,
  faqExplorerShell,
  faqMobileChip,
  faqMobileChipActive,
  faqMobileChipIdle,
  faqMobileChipWrap,
  faqSidebarBtn,
  faqSidebarBtnActive,
  faqSidebarBtnIdle,
  faqSidebarLabel,
  faqSidebarMeta,
} from "@/constants/tokens/faq";

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

  const selectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setOpenId(null);
  };

  return (
    <div className={faqExplorerShell}>
      <div className={faqExplorerGrid}>
        <aside
          data-faq-block
          className="hidden min-w-0 lg:block lg:sticky lg:top-20 lg:self-start"
          aria-label="Categorias do FAQ"
        >
          <p className={faqCategoryEyebrow}>Temas</p>

          <ul className="mt-5 space-y-1.5">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              const isActive = !isSearching && category.id === activeCategoryId;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => selectCategory(category.id)}
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
        </aside>

        <div className="min-w-0">
          <header
            data-faq-block
            className="border-b border-verde-floresta/12 pb-5 sm:pb-6 md:pb-8"
          >
            {isSearching ? (
              <div className="min-w-0">
                <p className={faqCategoryEyebrow}>Busca</p>
                <h2 className={`${faqCategoryTitle} mt-2 break-words`}>
                  Resultados para &ldquo;{trimmedQuery}&rdquo;
                </h2>
              </div>
            ) : (
              <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-laranja-solar/15 text-laranja-solar sm:size-12 md:size-14">
                  <ActiveIcon className="size-5 sm:size-6 md:size-7" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h2 className={`${faqCategoryTitle} break-words`}>
                    {activeCategory.label}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-preto-suave/75 sm:text-base">
                    {activeCategory.description}
                  </p>
                </div>
              </div>
            )}
          </header>

          {!isSearching ? (
            <nav
              className="border-b border-verde-floresta/12 py-5 sm:py-6 lg:hidden"
              aria-label="Categorias do FAQ"
            >
              <p className={faqCategoryEyebrow}>Temas</p>
              <div className={`${faqMobileChipWrap} mt-3`}>
                {faqCategories.map((category) => {
                  const isActive = category.id === activeCategoryId;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => selectCategory(category.id)}
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
            </nav>
          ) : null}

          <div data-faq-block className="mt-5 space-y-1 sm:mt-6 sm:space-y-1.5 md:mt-8">
            {visibleQuestions.length === 0 ? (
              <div className="flex flex-col items-center px-2 py-12 text-center sm:py-16 md:py-20">
                <MessageCircleQuestion
                  className="size-9 text-verde-floresta/30 sm:size-10"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <p className="mt-4 text-base font-semibold text-preto-suave sm:text-lg">
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
