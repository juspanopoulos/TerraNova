import {
  ArrowRight,
  Bell,
  Cloud,
  Droplets,
  Mail,
  MapPin,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoBranco from "@/assets/logos/logo-branco.png";
import { containerPx, contentShell, headerLogo } from "@/constants/layout";
import { NAV_LINKS, ROUTES } from "@/constants/routes";

const currentYear = new Date().getFullYear();

const footerHeading =
  "text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-laranja-solar";

const footerLink =
  "group inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-bege-natural/72 no-underline transition-colors duration-200 hover:text-bege-natural sm:text-[0.9375rem]";

const platformFeatures = [
  { icon: Cloud, label: "Clima" },
  { icon: Sprout, label: "Solo" },
  { icon: Droplets, label: "Água" },
  { icon: Bell, label: "Alertas" },
] as const;

const footerIconWrap =
  "flex shrink-0 items-center justify-center text-laranja-solar transition-colors duration-200 group-hover:text-laranja-solar";

const footerIconBox =
  `${footerIconWrap} size-8 rounded-lg border border-bege-natural/12 bg-bege-natural/8 group-hover:border-laranja-solar/30 group-hover:bg-laranja-solar/10`;

export const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden bg-surface-night text-bege-natural">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-16 left-1/2 h-48 w-[min(92vw,36rem)] -translate-x-1/2 rounded-full bg-[#2e241c]/80 blur-3xl sm:-top-24 sm:h-72 sm:w-[min(100%,52rem)]" />
      </div>

      <div
        className={`relative ${contentShell} ${containerPx} pt-10 pb-6 sm:pt-14 sm:pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12`}
      >
        <div className="grid gap-8 text-center md:grid-cols-2 md:items-start md:gap-10 md:text-left lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
          <div className="flex min-w-0 flex-col items-center md:items-start lg:col-span-5 xl:col-span-5">
            <Link
              className="inline-flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-85 sm:gap-3"
              to={ROUTES.home}
            >
              <img
                src={logoBranco}
                alt="TerraNova"
                className={headerLogo}
                width={64}
                height={64}
                decoding="async"
              />
              <span className="text-sm font-semibold tracking-tight text-bege-natural sm:text-base">
                TerraNova
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-[1.65] text-bege-natural/68 sm:mt-5 sm:text-[0.9375rem] sm:leading-[1.75] md:mx-0">
              Inteligência territorial para o agronegócio. Transformamos clima,
              solo e operação em informação clara para quem decide no campo.
            </p>

            <ul className="mt-6 grid w-full max-w-xs grid-cols-2 gap-2 sm:mt-8 sm:max-w-sm sm:gap-2.5 md:mx-0 md:max-w-sm">
              {platformFeatures.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex min-w-0 items-center gap-2 rounded-xl border border-bege-natural/12 bg-bege-natural/8 px-2.5 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5"
                >
                  <span
                    className={`${footerIconWrap} size-7 shrink-0 rounded-lg bg-laranja-solar/12 sm:size-8`}
                  >
                    <Icon className="size-3 sm:size-3.5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="truncate text-xs font-semibold tracking-[-0.01em] text-bege-natural/85 sm:text-sm">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid min-w-0 gap-8 border-t border-bege-natural/10 pt-8 sm:grid-cols-2 sm:gap-6 md:border-t-0 md:pt-0 lg:col-span-7 lg:gap-8 xl:gap-10">
            <div className="flex min-w-0 flex-col items-center md:items-start">
              <p className={footerHeading}>Navegação</p>
              <nav
                aria-label="Navegação secundária"
                className="mt-4 flex w-full flex-col items-center gap-1 md:mt-5 md:items-start"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    className={`${footerLink} min-w-0 justify-center rounded-lg px-1 py-2 md:justify-start sm:py-2.5`}
                    key={link.to}
                    to={link.to}
                  >
                    <span
                      className="hidden size-1 shrink-0 rounded-full bg-laranja-solar/0 transition-colors duration-200 group-hover:bg-laranja-solar md:block"
                      aria-hidden
                    />
                    {link.label}
                  </Link>
                ))}
                <Link
                  className={`${footerLink} min-w-0 justify-center rounded-lg px-1 py-2 md:justify-start sm:py-2.5`}
                  to={ROUTES.mapaDoSite}
                >
                  <span
                    className="hidden size-1 shrink-0 rounded-full bg-laranja-solar/0 transition-colors duration-200 group-hover:bg-laranja-solar md:block"
                    aria-hidden
                  />
                  Mapa do site
                </Link>
              </nav>
            </div>

            <div className="flex min-w-0 flex-col items-center md:items-start">
              <p className={footerHeading}>Contato</p>
              <ul className="mt-4 w-full space-y-3 sm:mt-5 sm:space-y-4">
                <li>
                  <a
                    href="mailto:contato@terranova.com.br"
                    className={`${footerLink} w-full justify-center gap-2.5 md:justify-start sm:gap-3`}
                  >
                    <span className={`${footerIconBox} size-7 sm:size-8`}>
                      <Mail className="size-3 sm:size-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-bege-natural/45">
                        E-mail
                      </span>
                      <span className="mt-0.5 block break-all text-sm sm:break-normal sm:text-[0.9375rem]">
                        contato@terranova.com.br
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=Av.+Paulista,+1100,+São+Paulo,+SP"
                    target="_blank"
                    rel="noreferrer"
                    className={`${footerLink} w-full justify-center gap-2.5 md:justify-start sm:gap-3`}
                  >
                    <span className={`${footerIconBox} size-7 sm:size-8`}>
                      <MapPin className="size-3 sm:size-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-bege-natural/45">
                        Base
                      </span>
                      <span className="mt-0.5 block text-sm sm:text-[0.9375rem]">
                        Av. Paulista, 1100 — SP
                      </span>
                    </span>
                  </a>
                </li>
              </ul>

              <Link
                to={ROUTES.contato}
                className={`${footerLink} mt-5 justify-center gap-1.5 font-semibold md:justify-start sm:mt-6`}
              >
                Ver página de contato
                <ArrowRight className="size-3.5 shrink-0 text-laranja-solar" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-bege-natural/10 pt-5 text-center md:mt-12 md:flex-row md:items-center md:justify-between md:text-left md:pt-8">
          <p className="text-xs text-bege-natural/45 sm:text-sm">
            &copy; {currentYear} TerraNova. Todos os direitos reservados.
          </p>
          <p className="text-[0.6875rem] leading-relaxed text-bege-natural/35 sm:text-[0.8125rem] sm:leading-normal">
            Agricultura de precisão · Monitoramento territorial
          </p>
        </div>
      </div>
    </footer>
  );
};
