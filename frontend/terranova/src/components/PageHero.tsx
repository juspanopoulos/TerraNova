import type { ReactNode } from "react";
import farmHero from "@/assets/hero/farm.jpeg";
import {
  PageBreadcrumb,
  type PageBreadcrumbItem,
} from "@/components/PageBreadcrumb";
import {
  contentShell,
  containerPx,
  pageHeroEyebrow,
  pageHeroSubtitle,
  pageHeroTitle,
} from "@/constants/layout";

type PageHeroProps = {
  breadcrumb: PageBreadcrumbItem[];
  eyebrow: string;
  title: string;
  subtitle: string;
  aside?: ReactNode;
};

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  subtitle,
  aside,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#2d5238] text-bege-natural">
      <img
        src={farmHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[#2d5238]/62"
        aria-hidden
      />

      <div
        className={`relative ${contentShell} ${containerPx} py-10 sm:py-12 md:py-14 lg:py-16`}
      >
        <PageBreadcrumb items={breadcrumb} tone="onDark" />

        <div
          className={`grid gap-8 ${
            aside
              ? "lg:grid-cols-[1fr_min(100%,22rem)] lg:items-end lg:gap-12"
              : ""
          }`}
        >
          <header>
            <p className={pageHeroEyebrow}>{eyebrow}</p>
            <h1 className={`${pageHeroTitle} mt-3`}>{title}</h1>
            <p className={pageHeroSubtitle}>{subtitle}</p>
          </header>

          {aside ? <div className="w-full shrink-0">{aside}</div> : null}
        </div>
      </div>

      <div className="h-px bg-bege-natural/10" aria-hidden />
    </section>
  );
}
