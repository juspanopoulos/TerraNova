import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const createGrowthTimeline = (section: HTMLElement) => {
  const sprout = section.querySelector<SVGSVGElement>(
    `[data-plant-stage="sprout"]`,
  )
  const bush = section.querySelector<SVGSVGElement>(`[data-plant-stage="bush"]`)
  const tree = section.querySelector<SVGSVGElement>(`[data-plant-stage="tree"]`)
  const reveal = section.querySelector<HTMLElement>('[data-reveal]')

  if (!sprout || !bush || !tree || !reveal) return

  gsap.set(bush, { opacity: 0, scale: 0.82 })
  gsap.set(tree, { opacity: 0, scale: 0.82 })
  gsap.set(reveal, { opacity: 0, y: 32 })
  gsap.set([sprout, bush, tree], { transformOrigin: '50% 100%' })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      end: 'bottom 18%',
      scrub: 0.35,
      pin: false,
      pinSpacing: false,
      invalidateOnRefresh: true,
    },
  })

  timeline
    .to(reveal, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0)
    .fromTo(
      sprout,
      { scale: 0.8, opacity: 1 },
      { scale: 1.25, duration: 0.3, ease: 'none' },
    )
    .to(sprout, { opacity: 0, scale: 0.8, duration: 0.18 })
    .to(bush, { opacity: 1, scale: 1.08, duration: 0.34 }, '<')
    .to(bush, { opacity: 0, scale: 0.82, duration: 0.2 })
    .to(tree, { opacity: 1, scale: 1.06, duration: 0.42 }, '<')

  return timeline
}

export default function Growth() {
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
      createGrowthTimeline(section)
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
      data-section="growth"
      className="relative z-0 flex min-h-[80vh] items-center overflow-hidden bg-[linear-gradient(180deg,#F3E7D3_0%,#D4E2C9_58%,#B7CFAD_100%)] py-20 md:py-24"
    >
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#3F6B4B_130%)] md:h-48" />

      <div
        className={[
          'relative z-10 mx-auto grid w-full max-w-6xl -translate-y-6 items-center gap-12 px-6',
          'md:grid-cols-2',
          'lg:grid-cols-2',
          'xl:grid-cols-2',
        ].join(' ')}
      >
        <div className="relative flex min-h-[14rem] items-end justify-center md:min-h-[18rem]">
          <svg
            data-plant-stage="sprout"
            className="absolute bottom-10 h-36 w-36 origin-bottom opacity-100 md:bottom-12 md:h-44 md:w-44"
            viewBox="0 0 220 220"
            aria-hidden
          >
            <path
              d="M111 194V106"
              stroke="#315a3b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M111 131C67 126 47 92 54 62c43 7 65 32 57 69Z"
              fill="#A8C7A1"
            />
            <path
              d="M113 128c47-24 62-66 48-100-45 16-64 51-48 100Z"
              fill="#3F6B4B"
            />
          </svg>

          <svg
            data-plant-stage="bush"
            className="absolute bottom-6 h-44 w-44 origin-bottom opacity-0 md:bottom-8 md:h-52 md:w-52"
            viewBox="0 0 260 260"
            aria-hidden
          >
            <path
              d="M130 232V116"
              stroke="#315a3b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M130 163C72 151 42 103 53 61c56 12 87 47 77 102Z"
              fill="#A8C7A1"
            />
            <path
              d="M132 157c64-31 90-88 70-132-60 20-88 69-70 132Z"
              fill="#3F6B4B"
            />
            <path
              d="M130 174c-44 5-78-18-91-51 44-15 83 4 91 51Z"
              fill="#6F936F"
            />
            <path
              d="M132 181c48-8 82-40 91-79-49-6-86 24-91 79Z"
              fill="#A8C7A1"
            />
          </svg>

          <svg
            data-plant-stage="tree"
            className="absolute bottom-0 h-52 w-52 origin-bottom opacity-0 md:h-64 md:w-64"
            viewBox="0 0 360 360"
            aria-hidden
          >
            <path
              d="M181 332V155"
              stroke="#5D4630"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M181 230c-35-33-70-54-113-63"
              stroke="#5D4630"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M181 207c36-40 69-65 118-78"
              stroke="#5D4630"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="119" cy="117" r="61" fill="#A8C7A1" />
            <circle cx="186" cy="91" r="74" fill="#3F6B4B" />
            <circle cx="244" cy="139" r="64" fill="#6F936F" />
            <circle cx="164" cy="163" r="71" fill="#86AC7F" />
            <circle cx="224" cy="197" r="54" fill="#A8C7A1" />
          </svg>

          <div className="absolute bottom-0 h-3 w-56 rounded-full bg-soft-black/10 blur-sm md:w-72" />
        </div>

        <div data-reveal className="max-w-xl">
          <p className="mb-4 font-space text-sm font-bold uppercase tracking-[0.28em] text-forest">
            crescimento
          </p>
          <h2 className="font-space text-5xl font-bold leading-none text-soft-black md:text-7xl">
            Previsões que impulsionam produtividade
          </h2>
          <p className="mt-8 text-lg leading-8 text-soft-black/68">
            Modelos agrícolas transformam clima, umidade e histórico de safra em
            janelas de plantio, irrigação e colheita mais inteligentes.
          </p>
        </div>
      </div>
    </section>
  )
}
