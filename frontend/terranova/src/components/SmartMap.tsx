import {
  copyOnDark,
  eyebrowMuted,
  panelOnDark,
  sectionGridBase,
  sectionPy,
  titleOnDark,
} from "@/constants/layout";

export default function SmartMap() {
  return (
    <section
      data-section="map"
      className={`flex min-h-[70vh] items-center bg-[#2a2f2c] text-bege-natural sm:min-h-[75vh] md:min-h-[80vh] ${sectionPy}`}
    >
      <div
        className={[
          sectionGridBase,
          "md:grid-cols-[0.95fr_1.05fr]",
          "lg:grid-cols-[0.95fr_1.05fr]",
          "xl:grid-cols-[0.95fr_1.05fr]",
        ].join(" ")}
      >
        <header className="max-w-lg">
          <p className={eyebrowMuted}>mapa inteligente</p>
          <h2 className={titleOnDark}>
            Dados conectados para decisões mais seguras
          </h2>
          <p className={`${copyOnDark} mt-8 max-w-lg`}>
            Regiões, sensores e alertas se organizam em uma rede visual para
            priorizar ações no campo.
          </p>
        </header>

        <div
          className={`${panelOnDark} flex aspect-[980/620] w-full items-center justify-center`}
          role="img"
          aria-label="Placeholder do Mapa Inteligente"
        >
          <p className="px-6 text-center text-sm font-medium text-bege-natural/55 sm:text-base">
            Placeholder do Mapa Inteligente
          </p>
        </div>
      </div>
    </section>
  );
}
