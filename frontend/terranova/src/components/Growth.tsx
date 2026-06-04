import {
  copyOnLight,
  eyebrow,
  panel,
  sectionGridBase,
  sectionPy,
  titleOnLight,
} from "@/constants/layout";

export default function Growth() {
  return (
    <section
      data-section="growth"
      className={`flex min-h-[70vh] items-center bg-bege-natural sm:min-h-[75vh] md:min-h-[80vh] ${sectionPy}`}
    >
      <div
        className={[
          sectionGridBase,
          "md:grid-cols-2",
          "lg:grid-cols-2",
          "xl:grid-cols-2",
        ].join(" ")}
      >
        <div
          className={`${panel} relative flex min-h-[14rem] items-end justify-center md:min-h-[18rem]`}
        >
          <svg
            className="h-40 w-40 text-verde-floresta/30 md:h-52 md:w-52"
            viewBox="0 0 360 360"
            fill="none"
            aria-hidden
          >
            <path
              d="M181 332V155"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="186" cy="91" r="74" fill="currentColor" opacity="0.4" />
            <circle cx="119" cy="117" r="61" fill="currentColor" opacity="0.25" />
            <circle cx="244" cy="139" r="64" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        <header className="max-w-xl">
          <p className={eyebrow}>crescimento</p>
          <h2 className={titleOnLight}>
            Previsões que impulsionam produtividade
          </h2>
          <p className={`${copyOnLight} mt-8`}>
            Modelos agrícolas transformam clima, umidade e histórico de safra em
            janelas de plantio, irrigação e colheita mais inteligentes.
          </p>
        </header>
      </div>
    </section>
  );
}
