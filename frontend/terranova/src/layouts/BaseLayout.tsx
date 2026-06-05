import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ROUTES } from "@/constants/routes";

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.home;
  const isPlataforma = pathname.startsWith("/plataforma");
  const hideSiteChrome = isHome || isPlataforma;

  return (
    <div
      className={
        isPlataforma
          ? "flex h-dvh flex-col overflow-hidden bg-bege-natural font-sans text-preto-suave"
          : "min-h-screen overflow-x-hidden bg-bege-natural font-sans text-preto-suave"
      }
    >
      {!hideSiteChrome && <Navbar />}
      <div className={isPlataforma ? "flex min-h-0 flex-1 flex-col overflow-hidden" : undefined}>
        {children}
      </div>
      {!hideSiteChrome && <Footer />}
    </div>
  );
};
