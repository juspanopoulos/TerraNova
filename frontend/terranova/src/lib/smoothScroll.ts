import Lenis from 'lenis'

export const setupSmoothScroll = () => {
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  })

  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  const frame = requestAnimationFrame(raf)

  return () => {
    cancelAnimationFrame(frame)
    lenis.destroy()
  }
}
