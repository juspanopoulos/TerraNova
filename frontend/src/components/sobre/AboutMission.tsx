import leavesImg from "@/assets/hero/background5.png";
import { missionCopy, missionPillars } from "@/data/sobre/platform";
import { AboutSectionHeading } from "@/components/sobre/AboutSectionHeading";
import {
  aboutCardGrid,
  aboutContentGap,
  aboutSectionPad,
} from "@/constants/tokens/about";
import { containerPx, contentShell } from "@/constants/layout";

export function AboutMission() {
  return (
    <section
      data-about-block
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
    >
      <img
        src={leavesImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-bege-natural/92 via-bege-natural/78 to-bege-natural/92"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-bege-natural to-transparent sm:h-20 md:h-24"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-bege-natural to-transparent sm:h-20 md:h-24"
        aria-hidden
      />

      <div className={`relative ${contentShell} ${containerPx} ${aboutSectionPad}`}>
        <AboutSectionHeading
          eyebrow={missionCopy.eyebrow}
          title={missionCopy.title}
          description={missionCopy.body}
        />

        <ul className={`${aboutCardGrid} ${aboutContentGap}`}>
          {missionPillars.map((pillar) => (
            <li key={pillar.id} data-about-item>
              <article className="group relative aspect-4/3 overflow-hidden rounded-xl border border-verde-floresta/10">
                <img
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-linear-to-t from-preto-suave/75 via-preto-suave/15 to-transparent"
                  aria-hidden
                />
                <h3 className="absolute inset-x-0 bottom-0 p-4 text-base font-semibold text-bege-natural sm:p-5 sm:text-lg">
                  {pillar.title}
                </h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
