import logoBranco from "@/assets/logos/logo-branco.png";
import { footerInner, footerLink } from "@/constants/layout";
import { NAV_LINKS, ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="mt-auto bg-surface-night text-bege-natural">
      <div
        className="h-0.5 bg-linear-to-r from-laranja-solar via-verde-claro to-verde-floresta"
        aria-hidden
      />

      <div className={footerInner}>
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm xs:max-w-none">
            <Link
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
              to={ROUTES.home}
            >
              <img
                src={logoBranco}
                alt="TerraNova"
                className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                width={48}
                height={48}
                decoding="async"
              />
              <span className="text-lg font-semibold text-bege-natural sm:text-xl">
                TerraNova
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-bege-natural/65 sm:text-base sm:leading-7">
              Inteligencia territorial para o agronegocio. Transformamos dados de
              clima, solo e operacao em informacao clara para decisoes no campo.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-laranja-solar">
              Navegacao
            </p>
            <nav
              aria-label="Navegacao secundaria"
              className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2.5"
            >
              {NAV_LINKS.map((link) => (
                <Link className={footerLink} key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-verde-claro">
              Solucoes
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-6 text-bege-natural/65 sm:text-base sm:leading-7">
              <li>Monitoramento climatico e alertas em tempo real</li>
              <li>Gestao integrada de solo, agua e colheitas</li>
              <li>Painel unificado para visao operacional do territorio</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-bege-natural/10 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs text-bege-natural/50 sm:text-sm">
            &copy; {currentYear} TerraNova. Todos os direitos reservados.
          </p>
          <p className="text-xs text-bege-natural/40 sm:text-sm">
            Agricultura de precisao &middot; Monitoramento territorial
          </p>
        </div>
      </div>
    </footer>
  );
};
