import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ROUTES, isSmoothScrollRoute } from "@/constants/routes";
import { BaseLayout } from "@/layouts";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { setupSmoothScroll } from "@/lib/smoothScroll";
import Contato from "@/pages/Contato";
import Equipe from "@/pages/Equipe";
import FAQ from "@/pages/FAQ";
import Home from "@/pages/Home";
import MapaDoSite from "@/pages/MapaDoSite";
import NotFound from "@/pages/NotFound";
import Sobre from "@/pages/Sobre";
import AguaPage from "@/pages/plataforma/AguaPage";
import AlertasPage from "@/pages/plataforma/AlertasPage";
import CadastrarAreaPage from "@/pages/plataforma/CadastrarAreaPage";
import ClimaPage from "@/pages/plataforma/ClimaPage";
import ColheitasPage from "@/pages/plataforma/ColheitasPage";
import EmpresaPage from "@/pages/plataforma/EmpresaPage";
import GeralPage from "@/pages/plataforma/GeralPage";
import IntegracoesPage from "@/pages/plataforma/IntegracoesPage";
import SoloPage from "@/pages/plataforma/SoloPage";
import VisaoAnualPage from "@/pages/plataforma/VisaoAnualPage";
import VisaoDiaPage from "@/pages/plataforma/VisaoDiaPage";
import VisaoGeralPage from "@/pages/plataforma/VisaoGeralPage";
import VisaoMesPage from "@/pages/plataforma/VisaoMesPage";
import VisaoSemanaPage from "@/pages/plataforma/VisaoSemanaPage";

function SiteSmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isSmoothScrollRoute(pathname)) return;
    return setupSmoothScroll();
  }, [pathname]);

  return null;
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteSmoothScroll />
      <BaseLayout>
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.sobre} element={<Sobre />} />
          <Route path={ROUTES.equipe} element={<Equipe />} />
          <Route path={ROUTES.faq} element={<FAQ />} />
          <Route path={ROUTES.contato} element={<Contato />} />
          <Route path={ROUTES.mapaDoSite} element={<MapaDoSite />} />
          <Route path={ROUTES.plataforma} element={<DashboardLayout />}>
            <Route index element={<Navigate to="visao-geral" replace />} />
            <Route path="visao-geral" element={<VisaoGeralPage />} />
            <Route path="areas/cadastrar" element={<CadastrarAreaPage />} />
            <Route path="visao/dia" element={<VisaoDiaPage />} />
            <Route path="visao/semana" element={<VisaoSemanaPage />} />
            <Route path="visao/mes" element={<VisaoMesPage />} />
            <Route path="visao/anual" element={<VisaoAnualPage />} />
            <Route path="alertas" element={<AlertasPage />} />
            <Route path="clima" element={<ClimaPage />} />
            <Route path="solo" element={<SoloPage />} />
            <Route path="colheitas" element={<ColheitasPage />} />
            <Route path="agua" element={<AguaPage />} />
            <Route path="configuracoes" element={<Navigate to="geral" replace />} />
            <Route path="configuracoes/geral" element={<GeralPage />} />
            <Route path="configuracoes/empresa" element={<EmpresaPage />} />
            <Route path="configuracoes/integracoes" element={<IntegracoesPage />} />
          </Route>
          <Route path="/platform" element={<Navigate to={ROUTES.plataforma} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
};
