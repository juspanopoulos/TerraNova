import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export type PageBreadcrumbItem = {
  label: string;
  to?: string;
};

type PageBreadcrumbProps = {
  items: PageBreadcrumbItem[];
};

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-preto-suave/35"
                  aria-hidden
                />
              )}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="truncate font-medium text-preto-suave/55 no-underline transition-colors hover:text-verde-floresta"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={[
                    "truncate font-semibold",
                    isLast ? "text-verde-floresta" : "text-preto-suave/55",
                  ].join(" ")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
