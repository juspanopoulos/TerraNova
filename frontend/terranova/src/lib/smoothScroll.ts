import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const setupSmoothScroll = () => {
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const lenisRaf = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(lenisRaf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(lenisRaf)
    lenis.destroy()
  }
}
