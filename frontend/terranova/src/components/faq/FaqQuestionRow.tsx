import { Minus, Plus } from "lucide-react";
import { copyOnLight } from "@/constants/layout";
import {
  faqQuestionNumber,
  faqQuestionNumberActive,
  faqQuestionRow,
  faqQuestionRowIdle,
  faqQuestionRowOpen,
} from "@/components/faq/faqShared";

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
          className="grid w-full grid-cols-[3rem_1fr] items-start gap-3 py-4 text-left sm:grid-cols-[3.5rem_1fr] sm:gap-4 sm:py-5"
        >
          <span
            className={`${faqQuestionNumber} pt-1 transition-colors duration-200 ${
              isOpen
                ? faqQuestionNumberActive
                : "group-hover:text-verde-floresta"
            }`}
            aria-hidden
          >
            {paddedIndex}
          </span>

          <span className="flex min-w-0 items-start gap-3 sm:gap-4">
            <span className="min-w-0 flex-1 pt-0.5">
              {categoryLabel ? (
                <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-laranja-solar">
                  {categoryLabel}
                </span>
              ) : null}
              <span
                className={`block text-base font-semibold leading-snug tracking-[-0.012em] transition-colors duration-200 sm:text-lg ${
                  isOpen
                    ? "text-verde-floresta"
                    : "text-preto-suave group-hover:text-verde-floresta"
                }`}
              >
                {question}
              </span>
            </span>

            <span
              className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
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
          <div className="grid grid-cols-[3rem_1fr] gap-3 pb-5 sm:grid-cols-[3.5rem_1fr] sm:gap-4 sm:pb-6">
            <div aria-hidden />
            <p className={`${copyOnLight} max-w-2xl text-sm sm:text-base`}>{answer}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
