import { useLayoutEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import notFoundImg from "@/assets/images/not-found/404.png";
import notFoundMobileImg from "@/assets/images/not-found/404-mobile.png";
import { ROUTES } from "@/constants/routes";
import { scrollToTop } from "@/lib/scrollToTop";

const NotFound = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <img
        src={notFoundMobileImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        aria-hidden
      />
      <img
        src={notFoundImg}
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover object-[32%_center] sm:object-[38%_center] lg:object-[45%_center] md:block"
        aria-hidden
      />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 justify-items-center content-start px-5 pb-10 pt-[9vh] xs:pt-[10vh] sm:px-8 sm:pt-[11vh] md:grid-cols-12 md:justify-items-stretch md:px-10 md:pb-16 md:pt-[20vh] lg:max-w-7xl lg:px-12 lg:pt-[18vh] xl:px-16 xl:pt-[19vh]">
        <div className="w-full max-w-sm text-center md:col-span-6 md:col-start-7 md:max-w-none md:text-left lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-laranja-solar">
            Página não encontrada
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-[1.1] tracking-[-0.022em] text-preto-suave xs:mt-4 xs:text-[1.65rem] sm:text-3xl md:mt-4 md:text-4xl lg:text-[2.75rem]">
            Você saiu do trilho!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-preto-suave/75 sm:mt-4 sm:text-base md:text-lg">
            Esse endereço não existe no TerraNova ou já não está disponível.
            Retome de onde parou ou volte ao início.
          </p>

          <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3 md:justify-start">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-verde-floresta/20 bg-white/85 px-4 py-2.5 text-sm font-semibold text-preto-suave shadow-sm shadow-preto-suave/5 backdrop-blur-sm transition-colors hover:border-verde-floresta/35 hover:bg-white sm:px-5 sm:py-3 sm:text-base"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Pagina anterior
            </button>
            <Link
              to={ROUTES.home}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-verde-floresta px-4 py-2.5 text-sm font-semibold text-bege-natural no-underline shadow-sm shadow-verde-floresta/20 transition-colors hover:bg-verde-floresta/90 sm:px-5 sm:py-3 sm:text-base"
            >
              <Home className="size-4" aria-hidden />
              Ir para o inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
