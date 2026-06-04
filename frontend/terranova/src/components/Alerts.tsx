import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ALERTS = ['seca', 'enchente', 'calor extremo'] as const

const RAIN_COUNT = 42

const createStormTimeline = (section: HTMLElement) => {
  const stormClouds = section.querySelectorAll<SVGElement>('[data-storm-cloud]')
  const rain = section.querySelectorAll<HTMLElement>('[data-rain]')
  const alertGlow = section.querySelector<HTMLElement>('[data-alert-glow]')
  const alertCards = section.querySelectorAll<HTMLElement>('[data-alert-card]')
  const reveal = section.querySelector<HTMLElement>('[data-reveal]')

  if (stormClouds.length === 0 || rain.length === 0 || alertCards.length === 0) return

  gsap.set(stormClouds, { x: 0, scale: 1 })
  gsap.set(rain, { y: -36, opacity: 0.12 })
  gsap.set(alertGlow, { scale: 1, opacity: 0.35 })
  gsap.set(alertCards, { y: 40, opacity: 0, scale: 0.95 })
  if (reveal) gsap.set(reveal, { opacity: 0, y: 28 })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      end: 'bottom 40%',
      scrub: true,
      pin: false,
      pinSpacing: false,
      invalidateOnRefresh: true,
    },
  })

  if (reveal) {
    timeline.to(reveal, { opacity: 1, y: 0, ease: 'power2.out' }, 0)
  }

  timeline
    .to(stormClouds, {
      x: (index) => (index ? -120 : 160),
      scale: 1.08,
      ease: 'none',
    })
    .to(
      rain,
      { y: 190, opacity: 0.85, stagger: 0.01, ease: 'none' },
      '<',
    )
    .to(
      alertGlow,
      { scale: 1.8, opacity: 0.95, ease: 'power2.inOut' },
      '<',
    )
    .to(
      alertCards,
      { y: 0, opacity: 1, scale: 1, stagger: 0.12, ease: 'power3.out' },
      '<0.15',
    )

  return timeline
}

export default function Alerts() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === section) trigger.kill(true)
    })

    const pinParent = section.parentElement
    if (pinParent?.classList.contains('pin-spacer')) {
      pinParent.replaceWith(section)
    }

    const ctx = gsap.context(() => {
      createStormTimeline(section)
    }, section)

    const refresh = () => ScrollTrigger.refresh(true)
    requestAnimationFrame(refresh)

    const onResize = () => refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-section="alerts"
      className="relative z-0 flex min-h-[80vh] items-center overflow-hidden bg-[linear-gradient(180deg,#EFE4D2_0%,#55615A_45%,#202522_100%)] py-20 text-bege-natural md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        <svg
          data-storm-cloud
          className="absolute left-[-6%] top-[4%] w-[min(140%,48rem)] max-w-none sm:left-[-8%] sm:w-[min(120%,56rem)] md:left-[-10%] md:w-[70rem]"
          viewBox="0 0 900 240"
          aria-hidden
        >
          <path
            fill="#2F3934"
            d="M80 158c42-58 112-58 151-15 23-62 109-92 169-37 44-48 127-36 149 26 48-19 104 7 124 52H47c5-10 16-20 33-26Z"
          />
        </svg>
        <svg
          data-storm-cloud
          className="absolute right-[-6%] top-[14%] w-[min(130%,42rem)] max-w-none sm:right-[-10%] sm:w-[min(115%,50rem)] md:right-[-12%] md:w-[62rem]"
          viewBox="0 0 840 220"
          aria-hidden
        >
          <path
            fill="#3E4943"
            d="M119 146c38-41 98-41 133-4 28-68 130-79 176-21 46-38 117-25 141 30 40-10 83 8 104 43H86c4-20 15-36 33-48Z"
          />
        </svg>

        {Array.from({ length: RAIN_COUNT }, (_, index) => (
          <span
            key={index}
            data-rain
            className="absolute h-8 w-px rotate-12 bg-cyan-100/40 sm:h-11 md:h-14"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 29) % 100}%`,
            }}
          />
        ))}
      </div>

      <div
        data-alert-glow
        className="pointer-events-none absolute right-[8%] top-[20%] h-32 w-32 rounded-full bg-solar/20 blur-3xl sm:right-[10%] sm:h-40 sm:w-40 md:right-[12%] md:top-[24%] md:h-44 md:w-44"
        aria-hidden
      />

      <div
        className={[
          'relative z-10 mx-auto grid w-full max-w-6xl -translate-y-6 items-center gap-10 px-6',
          'md:grid-cols-[1fr_0.85fr] md:gap-12',
          'lg:grid-cols-[1fr_0.85fr]',
          'xl:grid-cols-[1fr_0.85fr]',
        ].join(' ')}
      >
        <div data-reveal>
          <p className="mb-4 font-space text-sm font-bold uppercase tracking-[0.28em] text-solar">
            alertas ambientais
          </p>
          <h2 className="max-w-4xl font-space text-4xl font-bold leading-tight sm:text-5xl sm:leading-none md:text-7xl">
            Antecipe riscos antes que eles aconteçam
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-bege-natural/70 sm:mt-8 sm:text-lg sm:leading-8">
            A plataforma detecta sinais de estresse ambiental e transforma
            instabilidade em resposta operacional.
          </p>
        </div>

        <div className="grid gap-4">
          {ALERTS.map((alert) => (
            <article
              key={alert}
              data-alert-card
              className="rounded-lg border border-bege-natural/15 bg-bege-natural/10 p-5 backdrop-blur-xl sm:p-6"
            >
              <span className="mb-4 block h-2 w-2 rounded-full bg-solar shadow-[0_0_34px_rgba(229,155,58,0.8)] sm:mb-5" />
              <h3 className="font-space text-2xl font-bold capitalize sm:text-3xl">
                {alert}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
