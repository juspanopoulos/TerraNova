import leavesImg from "@/assets/hero/background5.png";
import { missionCopy, missionPillars } from "@/data/sobre/platform";
import { AboutSectionHeading } from "@/components/sobre/AboutSectionHeading";
import {
  aboutCardGrid,
  aboutContentGap,
  aboutSectionPad,
} from "@/components/sobre/aboutShared";
import { containerPx, contentShell } from "@/constants/layout";

function MissionDecor() {
  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 h-28 w-28 text-verde-floresta/[0.07] sm:h-36 sm:w-36"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
      <path
        d="M18 78 C38 58, 58 92, 78 68 S102 42, 108 28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M44 34 C52 28, 62 30, 68 38"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="68" cy="38" r="3" fill="currentColor" />
    </svg>
  );
}

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

      <div className={containerPx}>
        <div className={`relative ${contentShell} ${aboutSectionPad}`}>
          <MissionDecor />

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
      </div>
    </section>
  );
}
