import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SitemapSectionRefs = {
  sectionRef: RefObject<HTMLElement | null>;
};

export const useSitemapSectionAnimation = ({ sectionRef }: SitemapSectionRefs) => {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const blocks = section.querySelectorAll<HTMLElement>("[data-sitemap-block]");

      blocks.forEach((block) => {
        const items = block.querySelectorAll<HTMLElement>("[data-sitemap-item]");
        gsap.set([block, ...items], { autoAlpha: 0, y: 20 });

        gsap.to(block, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 88%",
            once: true,
          },
        });

        if (items.length > 0) {
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              once: true,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
};
