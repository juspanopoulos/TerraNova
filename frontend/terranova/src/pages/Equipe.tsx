import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  card,
  contentShell,
  containerPx,
  containerPyPage,
  bodyLead,
  gridCards,
  headingPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const team = [
  {
    name: "Ana Verde",
    role: "Direcao de projeto",
  },
  {
    name: "Bruno Sol",
    role: "Estrategia e conteudo",
  },
  {
    name: "Clara Raiz",
    role: "Experiencia e comunidade",
  },
];

const Equipe = () => {
  return (
    <main className={`${containerPx} ${containerPyPage}`}>
      <section className={contentShell}>
        <PageBreadcrumb
          items={[
            { label: "Inicio", to: ROUTES.home },
            { label: "Equipe" },
          ]}
        />
        <h1 className={headingPage}>Equipe</h1>
        <p className={bodyLead}>
          Pessoas diferentes trabalhando por uma mesma paisagem.
        </p>
        <div className={`mt-8 sm:mt-10 ${gridCards}`}>
          {team.map((person) => (
            <article className={card} key={person.name}>
              <div className="mb-4 grid size-12 place-items-center rounded-lg bg-verde-claro/60 text-sm font-semibold text-verde-floresta sm:mb-5 sm:size-14 sm:text-base">
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <h2 className="text-lg font-semibold text-verde-floresta sm:text-xl">
                {person.name}
              </h2>
              <p className="mt-2 text-xs text-preto-suave/65 sm:text-sm">
                {person.role}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Equipe;
