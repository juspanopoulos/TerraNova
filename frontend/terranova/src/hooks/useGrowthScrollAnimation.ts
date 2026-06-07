import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HOME_NAVBAR_ID = 'home-navbar'

type UseGrowthScrollAnimationOptions = {
  trackRef: RefObject<HTMLDivElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  stageCount: number
}

type StepMotion = {
  inactiveAlpha: number
  inactiveY: number
}

function getNavbarOffset() {
  const navbar = document.getElementById(HOME_NAVBAR_ID)
  return navbar?.offsetHeight ?? 64
}

function applyGrowthPinStyles(content: HTMLElement) {
  content.style.pointerEvents = 'auto'
  content.style.zIndex = '10'

  const pinSpacer = content.parentElement
  if (!pinSpacer?.classList.contains('pin-spacer')) return

  pinSpacer.style.pointerEvents = 'none'
  pinSpacer.style.zIndex = '10'
}

function buildGrowthTimeline(
  track: HTMLElement,
  content: HTMLElement,
  stageCount: number,
  stepMotion: StepMotion,
) {
  const images = content.querySelectorAll<HTMLElement>('[data-growth-image]')
  const captions = content.querySelectorAll<HTMLElement>('[data-growth-caption]')
  const steps = content.querySelectorAll<HTMLElement>('[data-growth-step]')
  const progress = content.querySelector<HTMLElement>('[data-growth-progress]')

  gsap.set(images, { autoAlpha: (index) => (index === 0 ? 1 : 0) })
  gsap.set(captions, { autoAlpha: (index) => (index === 0 ? 1 : 0), y: 0 })
  gsap.set(steps, {
    autoAlpha: (index) => (index === 0 ? 1 : stepMotion.inactiveAlpha),
    y: (index) => (index === 0 ? 0 : stepMotion.inactiveY),
  })
  if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'home-growth-scroll',
      trigger: track,
      start: () => `top top+=${getNavbarOffset()}`,
      end: 'bottom bottom',
      pin: content,
      pinSpacing: true,
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => applyGrowthPinStyles(content),
      onToggle: (self) => {
        if (self.isActive) applyGrowthPinStyles(content)
      },
    },
  })

  if (progress) {
    tl.to(progress, { scaleX: 1, ease: 'none', duration: stageCount - 1 }, 0)
  }

  for (let index = 1; index < stageCount; index++) {
    const position = index - 0.35

    tl.to(images[index - 1], { autoAlpha: 0, duration: 0.85, ease: 'power1.inOut' }, position)
      .to(images[index], { autoAlpha: 1, duration: 0.85, ease: 'power1.inOut' }, position)
      .to(
        captions[index - 1],
        { autoAlpha: 0, y: -10, duration: 0.6, ease: 'power1.inOut' },
        position,
      )
      .to(captions[index], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power1.inOut' }, position)
      .to(
        steps[index - 1],
        {
          autoAlpha: stepMotion.inactiveAlpha,
          y: stepMotion.inactiveY,
          duration: 0.6,
          ease: 'power1.inOut',
        },
        position,
      )
      .to(steps[index], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power1.inOut' }, position)
  }

  return tl
}

export function useGrowthScrollAnimation({
  trackRef,
  contentRef,
  stageCount,
}: UseGrowthScrollAnimationOptions) {
  useLayoutEffect(() => {
    const track = trackRef.current
    const content = contentRef.current
    if (!track || !content || stageCount < 2) return

    const mm = gsap.matchMedia()

    mm.add('(max-width: 767px)', () => {
      buildGrowthTimeline(track, content, stageCount, {
        inactiveAlpha: 0,
        inactiveY: 10,
      })

      requestAnimationFrame(() => {
        applyGrowthPinStyles(content)
        ScrollTrigger.refresh()
      })
    })

    mm.add('(min-width: 768px)', () => {
      buildGrowthTimeline(track, content, stageCount, {
        inactiveAlpha: 0.42,
        inactiveY: 6,
      })

      requestAnimationFrame(() => {
        applyGrowthPinStyles(content)
        ScrollTrigger.refresh()
      })
    })

    return () => mm.revert()
  }, [trackRef, contentRef, stageCount])
}
