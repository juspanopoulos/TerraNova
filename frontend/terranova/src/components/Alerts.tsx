import {
  cardOnDark,
  copyOnDark,
  eyebrowOnDark,
  sectionGridBase,
  sectionPy,
  titleOnDark,
} from "@/constants/layout";

const ALERTS = ["seca", "enchente", "calor extremo"] as const;

export default function Alerts() {
  return (
    <section
      data-section="alerts"
      className={`flex min-h-[70vh] items-center bg-verde-floresta text-bege-natural sm:min-h-[75vh] md:min-h-[80vh] ${sectionPy}`}
    >
      <div
        className={[
          sectionGridBase,
          "md:grid-cols-[1fr_0.85fr]",
          "lg:grid-cols-[1fr_0.85fr]",
          "xl:grid-cols-[1fr_0.85fr]",
        ].join(" ")}
      >
        <header className="max-w-xl">
          <p className={eyebrowOnDark}>alertas ambientais</p>
          <h2 className={`${titleOnDark} max-w-4xl`}>
            Antecipe riscos antes que eles aconteçam
          </h2>
          <p className={`${copyOnDark} mt-6 max-w-xl sm:mt-8`}>
            A plataforma detecta sinais de estresse ambiental e transforma
            instabilidade em resposta operacional.
          </p>
        </header>

        <ul className="grid gap-4" aria-label="Tipos de alerta">
          {ALERTS.map((alert) => (
            <li key={alert}>
              <article className={cardOnDark}>
                <span
                  className="mb-4 block size-2 rounded-full bg-laranja-solar sm:mb-5"
                  aria-hidden
                />
                <h3 className="text-2xl font-bold capitalize sm:text-3xl">
                  {alert}
                </h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
