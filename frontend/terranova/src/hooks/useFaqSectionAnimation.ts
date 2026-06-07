import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FaqSectionRefs = {
  sectionRef: RefObject<HTMLElement | null>;
};

export const useFaqSectionAnimation = ({ sectionRef }: FaqSectionRefs) => {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const blocks = section.querySelectorAll<HTMLElement>("[data-faq-block]");
      const items = section.querySelectorAll<HTMLElement>("[data-faq-item]");

      gsap.set(blocks, { autoAlpha: 0, y: 20 });
      gsap.set(items, { autoAlpha: 0, y: 12 });

      gsap.to(blocks, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          once: true,
        },
      });

      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
};
