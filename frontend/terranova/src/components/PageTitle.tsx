import type { LucideIcon } from "lucide-react";
import {
  bodyLead,
  headingPage,
  pageDividerFull,
  pageHeaderEdgeGap,
} from "@/constants/layout";

type PageTitleProps = {
  icon: LucideIcon;
  children: string;
  subtitle: string;
};

export function PageTitle({ icon: Icon, children, subtitle }: PageTitleProps) {
  return (
    <header className="mt-3">
      <h1 className={`${headingPage} mt-0 max-w-3xl`}>{children}</h1>

      <p
        className={`${bodyLead} flex max-w-2xl items-start gap-3 sm:gap-3.5`}
      >
        <Icon
          className="mt-1 size-5 shrink-0 text-preto-suave sm:mt-1.5 sm:size-6"
          strokeWidth={2}
          aria-hidden
        />
        <span>{subtitle}</span>
      </p>

      <div className={pageHeaderEdgeGap}>
        <div className={pageDividerFull} />
      </div>
    </header>
  );
}
