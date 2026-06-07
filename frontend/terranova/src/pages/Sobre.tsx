import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  bodyLead,
  contentShell,
  containerPx,
  containerPyPage,
  headingPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const Sobre = () => {
  return (
    <main className={`${containerPx} ${containerPyPage}`}>
      <section className={contentShell}>
        <PageBreadcrumb
          items={[
            { label: "Inicio", to: ROUTES.home },
            { label: "Sobre" },
          ]}
        />
        <h1 className={headingPage}>Sobre</h1>
        <p className={bodyLead}>
          Uma base digital para aproximar pessoas, territorio e boas ideias.
        </p>
        <p className="mt-4 text-base leading-7 text-preto-suave/75 sm:mt-6 sm:text-lg sm:leading-8">
          A TerraNova nasce com uma identidade natural, acolhedora e preparada
          para crescer em paginas institucionais, conteudo e experiencias
          interativas.
        </p>
      </section>
    </main>
  );
};

export default Sobre;
