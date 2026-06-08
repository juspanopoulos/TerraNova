import { Minus, Plus } from "lucide-react";
import { FaqAnswer } from "@/components/faq/FaqAnswer";
import {
  faqQuestionAnswerGrid,
  faqQuestionNumber,
  faqQuestionNumberActive,
  faqQuestionRow,
  faqQuestionRowIdle,
  faqQuestionRowOpen,
  faqQuestionTrigger,
} from "@/constants/tokens/faq";

type FaqQuestionRowProps = {
  id: string;
  index: number;
  question: string;
  answer: string;
  categoryLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function FaqQuestionRow({
  id,
  index,
  question,
  answer,
  categoryLabel,
  isOpen,
  onToggle,
}: FaqQuestionRowProps) {
  const paddedIndex = String(index + 1).padStart(2, "0");

  return (
    <article
      data-faq-item
      className={`${faqQuestionRow} ${isOpen ? faqQuestionRowOpen : faqQuestionRowIdle}`}
    >
      <h3>
        <button
          type="button"
          id={`faq-trigger-${id}`}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${id}`}
          onClick={onToggle}
          className={faqQuestionTrigger}
        >
          <span
            className={`${faqQuestionNumber} pt-0.5 transition-colors duration-200 sm:pt-1 ${
              isOpen
                ? faqQuestionNumberActive
                : "group-hover:text-verde-floresta"
            }`}
            aria-hidden
          >
            {paddedIndex}
          </span>

          <span className="flex min-w-0 items-start gap-2 sm:gap-3 md:gap-4">
            <span className="min-w-0 flex-1 pt-0.5">
              {categoryLabel ? (
                <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-laranja-solar">
                  {categoryLabel}
                </span>
              ) : null}
              <span
                className={`block break-words text-[0.9375rem] font-semibold leading-snug tracking-[-0.012em] transition-colors duration-200 sm:text-base md:text-lg ${
                  isOpen
                    ? "text-verde-floresta"
                    : "text-preto-suave group-hover:text-verde-floresta"
                }`}
              >
                {question}
              </span>
            </span>

            <span
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 sm:size-9 ${
                isOpen
                  ? "bg-verde-floresta/15 text-verde-floresta"
                  : "text-verde-floresta/80 group-hover:bg-verde-floresta/15 group-hover:text-verde-floresta"
              }`}
              aria-hidden
            >
              {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
            </span>
          </span>
        </button>
      </h3>

      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-trigger-${id}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className={faqQuestionAnswerGrid}>
            <div aria-hidden />
            <FaqAnswer answer={answer} />
          </div>
        </div>
      </div>
    </article>
  );
}
