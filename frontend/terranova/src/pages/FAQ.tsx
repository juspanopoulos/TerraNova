import { CircleHelp } from "lucide-react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PageHeaderAccent } from "@/components/PageHeaderAccent";
import { PageTitle } from "@/components/PageTitle";
import {
  card,
  contentShell,
  containerPx,
  containerPyPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const questions = [
  {
    question: "O que ja esta configurado no frontend?",
    answer:
      "React, Vite, Tailwind, rotas, alias de importacao, Inter, GSAP e Lenis.",
  },
  {
    question: "Onde ficam as paginas do projeto?",
    answer:
      "As paginas ficam em src/pages e sao conectadas em src/routes/AppRoutes.tsx.",
  },
  {
    question: "Como reaproveitar estrutura comum?",
    answer:
      "Use o BaseLayout em src/layouts para manter Navbar e Footer nas paginas.",
  },
];

const FAQ = () => {
  return (
    <main>
      <PageHeaderAccent />
      <div className={`${containerPx} ${containerPyPage}`}>
        <section className={contentShell}>
          <PageBreadcrumb
            items={[
              { label: "Inicio", to: ROUTES.home },
              { label: "FAQ" },
            ]}
          />
          <PageTitle
            icon={CircleHelp}
            subtitle="Perguntas frequentes sobre a base do projeto."
          >
            FAQ
          </PageTitle>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6">
            {questions.map((item) => (
              <article className={card} key={item.question}>
                <h2 className="text-base font-semibold text-verde-floresta sm:text-lg md:text-xl">
                  {item.question}
                </h2>
                <p className="mt-2 text-sm leading-6 text-preto-suave/70 sm:text-base sm:leading-7">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FAQ;
