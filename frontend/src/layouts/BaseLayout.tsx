import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { siteHeaderSpacer } from "@/constants/layout";
import { ROUTES, isNotFoundRoute } from "@/constants/routes";

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.home;
  const isPlataforma = pathname.startsWith("/plataforma");
  const hideSiteChrome = isHome || isPlataforma || isNotFoundRoute(pathname);

  return (
    <div
      className={
        isPlataforma
          ? "flex h-dvh flex-col overflow-hidden bg-bege-natural font-sans text-preto-suave"
          : "site-root flex min-h-screen flex-col overflow-x-hidden bg-bege-natural font-sans text-preto-suave"
      }
    >
      {!hideSiteChrome && (
        <>
          <Navbar />
          <div className={siteHeaderSpacer} aria-hidden />
        </>
      )}
      <div
        className={
          isPlataforma
            ? "flex min-h-0 flex-1 flex-col overflow-hidden"
            : "flex flex-1 flex-col"
        }
      >
        {children}
      </div>
      {!hideSiteChrome && <Footer />}
    </div>
  );
};
