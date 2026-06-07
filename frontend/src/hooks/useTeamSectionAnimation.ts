import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TeamSectionRefs = {
  sectionRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
};

export const useTeamSectionAnimation = ({
  sectionRef,
  listRef,
}: TeamSectionRefs) => {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;

    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const items = list.querySelectorAll<HTMLElement>("[data-team-item]");

      gsap.set(items, { autoAlpha: 0, y: 16 });

      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: list,
          start: "top 90%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, listRef]);
};
