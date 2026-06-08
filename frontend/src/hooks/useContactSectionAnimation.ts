import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ContactSectionRefs = {
  sectionRef: RefObject<HTMLElement | null>;
};

export const useContactSectionAnimation = ({ sectionRef }: ContactSectionRefs) => {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const blocks = section.querySelectorAll<HTMLElement>("[data-contato-block]");
      const items = section.querySelectorAll<HTMLElement>("[data-contato-item]");

      gsap.set([...blocks, ...items], { autoAlpha: 0, y: 20 });

      blocks.forEach((block) => {
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
      });

      if (items.length > 0) {
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: items[0]?.parentElement ?? section,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
};
