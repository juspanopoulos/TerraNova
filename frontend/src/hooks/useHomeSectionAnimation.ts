import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type HomeSectionRefs = {
  sectionRef: RefObject<HTMLElement | null>
}

export const useHomeSectionAnimation = ({ sectionRef }: HomeSectionRefs) => {
  useLayoutEffect(() => {
    const main = sectionRef.current
    if (!main) return

    const ctx = gsap.context(() => {
      const sections = main.querySelectorAll<HTMLElement>('section')

      sections.forEach((section) => {
        const items = section.querySelectorAll<HTMLElement>('[data-home-item]')
        if (!items.length) return

        gsap.set(items, { autoAlpha: 0, y: 20 })

        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.09,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }, main)

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => ctx.revert()
  }, [sectionRef])
}
