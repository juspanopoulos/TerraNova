import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { BaseLayout } from "@/layouts";
import { setupSmoothScroll } from "@/lib/smoothScroll";
import Equipe from "@/pages/Equipe";
import FAQ from "@/pages/FAQ";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Plataform from "@/pages/Plataform";
import Sobre from "@/pages/Sobre";

function SmoothScrollOnHome() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== ROUTES.home) return;
    return setupSmoothScroll();
  }, [pathname]);

  return null;
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <SmoothScrollOnHome />
      <BaseLayout>
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.sobre} element={<Sobre />} />
          <Route path={ROUTES.equipe} element={<Equipe />} />
          <Route path={ROUTES.faq} element={<FAQ />} />
          <Route path={ROUTES.plataforma} element={<Plataform />} />
          <Route path="/platform" element={<Navigate to={ROUTES.plataforma} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
};
