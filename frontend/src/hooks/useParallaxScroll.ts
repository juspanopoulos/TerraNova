import { type RefObject, useEffect } from "react";
import { gsap } from "gsap";

export type ParallaxLayerConfig = {
  id: string;
  yPercent: number;
};

type UseParallaxScrollOptions = {
  layers: readonly ParallaxLayerConfig[];
  scrub?: number | boolean;
};

/**
 * anima camadas em velocidades diferentes conforme o scroll da seção.
 * requer Lenis + ScrollTrigger sincronizados em setupSmoothScroll.
 */
export const useParallaxScroll = (
  sectionRef: RefObject<HTMLElement | null>,
  { layers, scrub = 0 }: UseParallaxScrollOptions,
) => {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "0% 0%",
          end: "100% 0%",
          scrub,
        },
      });

      layers.forEach((layer, index) => {
        const targets = section.querySelectorAll<HTMLElement>(
          `[data-layer="${layer.id}"]`,
        );
        if (!targets.length) return;

        timeline.to(
          targets,
          { yPercent: layer.yPercent, ease: "none" },
          index === 0 ? 0 : "<",
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, layers, scrub]);
};
