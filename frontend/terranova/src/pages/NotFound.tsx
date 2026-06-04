import { containerPx, eyebrow, headingPage } from "@/constants/layout";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main
      className={`grid min-h-[50vh] place-items-center text-center sm:min-h-[60vh] ${containerPx} py-12 sm:py-16 md:py-20`}
    >
      <div className="max-w-lg px-2">
        <p className={eyebrow}>404</p>
        <h1 className={headingPage}>Pagina nao encontrada</h1>
        <p className="mt-4 text-sm leading-6 text-preto-suave/70 sm:text-base">
          O endereco pode estar incorreto ou a pagina foi movida.
        </p>
        <Link
          className="mt-6 inline-flex rounded-lg border border-verde-floresta/15 bg-verde-floresta px-4 py-2.5 text-sm font-semibold text-bege-natural transition-colors hover:bg-preto-suave sm:mt-8 sm:px-5 sm:py-3 sm:text-base"
          to="/"
        >
          Voltar ao inicio
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
