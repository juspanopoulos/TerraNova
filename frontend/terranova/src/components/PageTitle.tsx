import type { LucideIcon } from "lucide-react";
import {
  bodyLead,
  headingPage
} from "@/constants/layout";

type PageTitleProps = {
  icon: LucideIcon;
  children: string;
  subtitle: string;
};

export function PageTitle({ icon: Icon, children, subtitle }: PageTitleProps) {
  return (
    // 📐 Usando flex-col com gap-1 para controlar milimetricamente a distância entre eles
    <header className="mt-3 flex flex-col gap-1 sm:gap-1.5">
      {/* Forcei o !m-0 para garantir que nenhuma margem interna da constante headingPage empurre o texto para baixo */}
      <h1 className={`${headingPage} !m-0 max-w-3xl`}>{children}</h1>

      {/* Forcei o !mt-0 aqui também pelo mesmo motivo */}
      <p
        className={`${bodyLead} !mt-0 flex max-w-2xl items-start gap-2 sm:gap-3`}
      >
        <Icon
          className="mt-1 size-5 shrink-0 text-preto-suave sm:mt-1"
          strokeWidth={2}
          aria-hidden
        />
        <span>{subtitle}</span>
      </p>
    </header>
  );
}