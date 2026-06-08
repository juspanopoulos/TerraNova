import { Fragment } from "react";
import { Link } from "react-router-dom";
import { copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const CONTACT_LINK_MARKER = "[Contato]";

const contactLinkClassName =
  "font-semibold text-verde-floresta underline decoration-verde-floresta/30 underline-offset-[0.2em] transition-colors hover:text-verde-floresta/85 hover:decoration-verde-floresta/55";

type FaqAnswerProps = {
  answer: string;
};

export function FaqAnswer({ answer }: FaqAnswerProps) {
  if (!answer.includes(CONTACT_LINK_MARKER)) {
    return (
      <p className={`${copyOnLight} max-w-2xl break-words text-sm sm:text-base`}>
        {answer}
      </p>
    );
  }

  const parts = answer.split(CONTACT_LINK_MARKER);

  return (
    <p className={`${copyOnLight} max-w-2xl break-words text-sm sm:text-base`}>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 ? (
            <Link to={ROUTES.contato} className={contactLinkClassName}>
              página Contato
            </Link>
          ) : null}
        </Fragment>
      ))}
    </p>
  );
}
