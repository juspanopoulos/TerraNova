import { Leaf } from "lucide-react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PageHeaderAccent } from "@/components/PageHeaderAccent";
import { PageTitle } from "@/components/PageTitle";
import {
  contentShell,
  containerPx,
  containerPyPage,
} from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const Sobre = () => {
  return (
    <main>
      <PageHeaderAccent />
      <div className={`${containerPx} ${containerPyPage}`}>
        <section className={contentShell}>
          <PageBreadcrumb
            items={[
              { label: "Inicio", to: ROUTES.home },
              { label: "Sobre" },
            ]}
          />
          <PageTitle
            icon={Leaf}
            subtitle="Uma base digital para aproximar pessoas, territorio e boas ideias."
          >
            Sobre
          </PageTitle>
          <p className="mt-8 text-base leading-7 text-preto-suave/75 sm:mt-10 sm:text-lg sm:leading-8">
            A TerraNova nasce com uma identidade natural, acolhedora e preparada
            para crescer em paginas institucionais, conteudo e experiencias
            interativas.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Sobre;
