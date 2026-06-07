import { useRef } from 'react'
import backdropImg from '@/assets/hero/background2.png'
import sproutImg from '@/assets/hero/background3.png'
import soilImg from '@/assets/hero/background4.png'
import leavesImg from '@/assets/hero/background5.png'
import { useParallaxScroll } from '@/hooks/useParallaxScroll'
import styles from './HeroParallax.module.css'

const HERO_LAYERS = [
  { id: 'backdrop', yPercent: 70 },
  { id: 'leaves', yPercent: 48 },
  { id: 'title', yPercent: 55 },
  { id: 'sprout', yPercent: 40 },
  { id: 'soil', yPercent: 0 },
] as const

export const HeroParallax = () => {
  const layersRef = useRef<HTMLDivElement>(null)

  useParallaxScroll(layersRef, { layers: HERO_LAYERS })

  return (
    <section className={styles.hero} aria-label="Destaque TerraNova">
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div ref={layersRef} className={styles.layers}>
            <img
              src={backdropImg}
              alt=""
              width={800}
              loading="eager"
              decoding="async"
              data-layer="backdrop"
              className={`${styles.layerMedia} ${styles.layerMediaBackdrop}`}
            />
            <img
              src={leavesImg}
              alt=""
              width={800}
              loading="lazy"
              decoding="async"
              data-layer="leaves"
              className={`${styles.layerMedia} ${styles.layerMediaLeaves}`}
            />
            <div data-layer="title" className={styles.layerTitle}>
              <h1 className={styles.title}>TerraNova</h1>
            </div>
            <img
              src={sproutImg}
              alt=""
              width={800}
              loading="eager"
              decoding="async"
              data-layer="sprout"
              className={`${styles.layerMedia} ${styles.layerMediaSprout}`}
            />
            <img
              src={soilImg}
              alt=""
              width={800}
              loading="eager"
              decoding="async"
              data-layer="soil"
              className={`${styles.layerMedia} ${styles.layerMediaSoil}`}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottomFade} aria-hidden />
    </section>
  )
}
