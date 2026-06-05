import { missionCopy } from "@/data/sobre/platform";
import { copyOnLight, titleOnLight } from "@/constants/layout";

export function AboutMission() {
  return (
    <section
      data-about-block
      className="mt-14 rounded-2xl border border-verde-floresta/10 bg-verde-floresta/[0.04] px-5 py-8 sm:mt-16 sm:px-8 sm:py-10 md:mt-20 md:px-10 md:py-12"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-laranja-solar">
        {missionCopy.eyebrow}
      </p>
      <h2 className={`${titleOnLight} mt-3 max-w-3xl text-2xl sm:text-3xl md:text-4xl`}>
        {missionCopy.title}
      </h2>
      <p className={`${copyOnLight} mt-5 max-w-2xl sm:mt-6`}>{missionCopy.body}</p>
    </section>
  );
}
