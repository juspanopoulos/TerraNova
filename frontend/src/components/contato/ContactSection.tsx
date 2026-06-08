import { useRef } from "react";
import { Clock3 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/contato/ContactForm";
import {
  contactChannelCard,
  contactContentGap,
  contactGridGap,
  contactLabel,
  contactSectionTitle,
} from "@/constants/tokens/contact";
import { contactChannels, contactCopy } from "@/data/contato";
import { containerPx, contentShell, copyOnLight } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useContactSectionAnimation } from "@/hooks/useContactSectionAnimation";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useContactSectionAnimation({ sectionRef });

  return (
    <main className="bg-bege-natural">
      <PageHero
        breadcrumb={[
          { label: "Inicio", to: ROUTES.home },
          { label: "Contato" },
        ]}
        eyebrow="Fale conosco"
        title="Contato"
        subtitle="Estamos disponíveis para ouvir suas dúvidas, sugestões e necessidades da propriedade."
      />

      <div
        className={`${contentShell} ${containerPx} pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-20`}
      >
        <section ref={sectionRef} className={contactContentGap}>
          <div
            className={`grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start ${contactGridGap}`}
          >
            <div className="space-y-6">
              <header data-contato-block>
                <p className={contactLabel}>{contactCopy.channelsTitle}</p>
                <h2 className={`${contactSectionTitle} max-w-md`}>
                  {contactCopy.channelsDescription}
                </h2>
              </header>

              <ul className="space-y-3">
                {contactChannels.map((channel) => {
                  const Icon = channel.icon;
                  const opensNewTab =
                    channel.id === "location" || channel.id === "whatsapp";

                  return (
                    <li key={channel.id} data-contato-item>
                      <a
                        href={channel.href}
                        target={opensNewTab ? "_blank" : undefined}
                        rel={opensNewTab ? "noreferrer" : undefined}
                        className={contactChannelCard}
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-verde-floresta/10 text-verde-floresta transition-colors duration-200 group-hover:bg-verde-floresta/15">
                          <Icon className="size-5" strokeWidth={2} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-verde-floresta/55">
                            {channel.label}
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-preto-suave transition-colors group-hover:text-verde-floresta sm:text-base">
                            {channel.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p
                data-contato-item
                className={`${copyOnLight} flex items-center gap-2.5 text-sm sm:text-base`}
              >
                <Clock3
                  className="size-4 shrink-0 text-laranja-solar/80"
                  aria-hidden
                />
                Resposta em dias úteis, em geral até 1 dia útil.
              </p>
            </div>

            <div data-contato-block>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
