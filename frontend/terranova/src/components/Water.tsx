import {
  card,
  eyebrow,
  sectionGridBase,
  sectionPy,
  titleOnLight,
} from "@/constants/layout";

const CARDS = [
  ["desperdício detectado", "18.4%", "vazões anômalas localizadas"],
  ["eficiência hídrica", "91%", "irrigação orientada por solo e clima"],
  ["economia prevista", "32 mil L", "redução estimada por ciclo"],
] as const;

const RESERVOIR_LEVELS = [58, 82, 66] as const;

export default function Water() {
  return (
    <section
      data-section="water"
      className={`flex min-h-[70vh] items-center bg-[#f4f6f4] sm:min-h-[75vh] md:min-h-[80vh] ${sectionPy}`}
    >
      <div
        className={[
          sectionGridBase,
          "md:grid-cols-[1.05fr_0.95fr]",
          "lg:grid-cols-[1.05fr_0.95fr]",
          "xl:grid-cols-[1.05fr_0.95fr]",
        ].join(" ")}
      >
        <div className="relative flex min-h-[18rem] items-end justify-center sm:min-h-[22rem] md:min-h-[26rem]">
          <div className="flex items-end justify-center gap-3 sm:gap-5">
            {RESERVOIR_LEVELS.map((level, index) => (
              <div
                key={index}
                className="relative h-36 w-20 overflow-hidden rounded-t-2xl border border-verde-floresta/15 bg-white sm:h-44 sm:w-24"
              >
                <div
                  className="absolute bottom-0 w-full bg-verde-floresta/85"
                  style={{ height: `${level}%` }}
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className={eyebrow}>água</p>
          <h2 className={titleOnLight}>
            Irrigação inteligente, sem desperdício
          </h2>

          <div className="mt-8 grid gap-4 sm:mt-10">
            {CARDS.map(([label, value, detail]) => (
              <article key={label} className={card}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-verde-floresta/70">
                  {label}
                </p>
                <p className="mt-3 text-2xl font-bold tabular-nums text-preto-suave sm:text-3xl md:text-4xl">
                  {value}
                </p>
                <p className="mt-2 text-sm leading-6 text-preto-suave/65">
                  {detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
