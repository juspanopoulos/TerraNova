import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  ['desperdício detectado', '18.4%', 'vazões anômalas localizadas'],
  ['eficiência hídrica', '91%', 'irrigação orientada por solo e clima'],
  ['economia prevista', '32 mil L', 'redução estimada por ciclo'],
] as const

const RESERVOIR_LEVELS = [58, 82, 66] as const

const createWaterTimeline = (section: HTMLElement) => {
  const waterDrop = section.querySelector<SVGPathElement>('[data-water-drop]')
  const reservoirs = section.querySelectorAll<HTMLElement>('[data-reservoir]')
  const reveal = section.querySelector<HTMLElement>('[data-reveal]')
  const cards = section.querySelectorAll<HTMLElement>('[data-water-card]')

  if (!waterDrop || reservoirs.length === 0 || cards.length === 0) return

  gsap.set(waterDrop, { scale: 1, y: 0, transformOrigin: 'center center' })
  gsap.set(reservoirs, { scaleY: 0, transformOrigin: '50% 100%' })
  gsap.set(cards, { y: 28, opacity: 0, scale: 0.96 })
  if (reveal) gsap.set(reveal, { opacity: 0, y: 24 })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 58%',
      end: 'bottom 48%',
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
    .to(waterDrop, {
      scale: 0.78,
      y: -28,
      transformOrigin: 'center center',
      ease: 'power1.inOut',
    })
    .to(reservoirs, { scaleY: 1, stagger: 0.1, ease: 'power2.out' }, '<')
    .to(
      cards,
      { y: 0, opacity: 1, scale: 1, stagger: 0.12, ease: 'power3.out' },
      '<0.05',
    )

  return timeline
}

export default function Water() {
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
      createWaterTimeline(section)
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
      data-section="water"
      className="relative z-0 flex min-h-[80vh] items-center overflow-hidden bg-[linear-gradient(180deg,#B7CFAD_0%,#D9E8E8_44%,#EFE4D2_100%)] py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-3xl md:h-[42rem] md:w-[42rem]"
      />

      <div
        className={[
          'relative z-10 mx-auto grid w-full max-w-6xl -translate-y-6 items-center gap-12 px-6',
          'md:grid-cols-[1.05fr_0.95fr]',
          'lg:grid-cols-[1.05fr_0.95fr]',
          'xl:grid-cols-[1.05fr_0.95fr]',
        ].join(' ')}
      >
        <div className="relative min-h-[22rem] sm:min-h-[28rem] md:min-h-[32rem]">
          <svg
            className="absolute left-1/2 top-0 h-[18rem] w-[18rem] -translate-x-1/2 drop-shadow-2xl sm:h-[22rem] sm:w-[22rem] md:h-[27rem] md:w-[27rem]"
            viewBox="0 0 340 420"
            aria-hidden
          >
            <defs>
              <linearGradient id="waterDropGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#DFF8F4" />
                <stop offset="1" stopColor="#5AAFA8" />
              </linearGradient>
            </defs>
            <path
              data-water-drop
              d="M170 24C102 116 58 183 58 257c0 87 56 139 112 139s112-52 112-139c0-74-44-141-112-233Z"
              fill="url(#waterDropGradient)"
              opacity={0.92}
            />
            <path
              d="M120 174c-20 42-20 85 5 124"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeWidth={10}
              opacity={0.42}
            />
          </svg>

          <div className="absolute bottom-6 left-1/2 flex w-full max-w-xl -translate-x-1/2 items-end justify-center gap-3 sm:bottom-8 sm:gap-5">
            {RESERVOIR_LEVELS.map((level, index) => (
              <div
                key={index}
                className="relative h-36 w-20 overflow-hidden rounded-t-3xl border border-forest/20 bg-white/24 shadow-aqua backdrop-blur-md sm:h-44 sm:w-24"
              >
                <div
                  data-reservoir
                  data-level={level}
                  className="absolute bottom-0 left-0 w-full rounded-t-3xl bg-[linear-gradient(180deg,#8ED8D0,#3F8C85)]"
                  style={{ height: `${level}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div data-reveal>
            <p className="mb-4 font-space text-sm font-bold uppercase tracking-[0.28em] text-forest">
              água
            </p>
            <h2 className="font-space text-5xl font-bold leading-none text-soft-black md:text-7xl">
              Irrigação inteligente, sem desperdício
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10">
            {CARDS.map(([label, value, detail]) => (
              <article
                key={label}
                data-water-card
                className="rounded-lg border border-white/50 bg-white/32 p-5 shadow-aqua backdrop-blur-xl"
              >
                <p className="font-space text-xs font-bold uppercase tracking-[0.22em] text-forest/70">
                  {label}
                </p>
                <strong className="mt-3 block font-space text-3xl text-soft-black sm:text-4xl">
                  {value}
                </strong>
                <p className="mt-2 text-sm leading-6 text-soft-black/62">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
