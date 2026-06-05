import { platformHighlights } from "@/data/sobre/platform";
import { copyOnLight, titleOnLight } from "@/constants/layout";

export function AboutHighlights() {
  return (
    <section data-about-block className="mt-14 sm:mt-16 md:mt-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
        Como funciona
      </p>
      <h2 className={`${titleOnLight} mt-3 max-w-3xl text-2xl sm:text-3xl md:text-4xl`}>
        Dados que conversam entre si
      </h2>

      <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5 md:gap-6">
        {platformHighlights.map((item) => (
          <li
            key={item.label}
            data-about-item
            className="rounded-xl border border-verde-floresta/10 bg-white px-5 py-6 sm:px-6 sm:py-7"
          >
            <p className="text-3xl font-bold tabular-nums text-verde-floresta sm:text-4xl">
              {item.value}
            </p>
            <h3 className="mt-2 text-sm font-semibold uppercase tracking-wide text-preto-suave/80 sm:text-base">
              {item.label}
            </h3>
            <p className={`${copyOnLight} mt-3 text-sm`}>{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
