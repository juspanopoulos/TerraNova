import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { btnClick } from "@/constants/dashboard";
import type { BreadcrumbItem } from "@/types/dashboard";

export function DashboardBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-[var(--db-text-faint)]"
                  aria-hidden
                />
              )}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={`${btnClick} cursor-pointer truncate font-medium text-[var(--db-text-muted)] no-underline hover:text-verde-floresta`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={[
                    "truncate font-semibold",
                    isLast ? "text-verde-floresta" : "text-[var(--db-text-muted)]",
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
