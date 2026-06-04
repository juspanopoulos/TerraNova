import { footerInner } from "@/constants/layout";
import { NAV_LINKS } from "@/constants/routes";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-verde-floresta/10 bg-preto-suave text-bege-natural">
      <div className={footerInner}>
        <div className="max-w-md xs:max-w-none">
          <p className="text-base font-semibold text-verde-claro sm:text-lg">
            TerraNova
          </p>
          <p className="mt-2 text-sm leading-6 text-bege-natural/70 sm:text-base sm:leading-7">
            Uma base preparada para paginas institucionais, navegacao simples e
            evolucao do frontend.
          </p>
        </div>
        <nav
          aria-label="Navegacao secundaria"
          className="flex flex-wrap gap-2 sm:gap-3 xs:w-full"
        >
          {NAV_LINKS.map((link) => (
            <Link
              className="text-xs font-medium text-bege-natural/70 transition-colors hover:text-laranja-solar sm:text-sm"
              key={link.to}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
