import { useRef } from 'react'
import { Footer } from '@/components/Footer'
import { HomeAlerts } from '@/components/home/HomeAlerts'
import { HomeClimate } from '@/components/home/HomeClimate'
import { HomeCta } from '@/components/home/HomeCta'
import { HomeGrowth } from '@/components/home/HomeGrowth'
import { HomeIntro } from '@/components/home/HomeIntro'
import { HomePlatform } from '@/components/home/HomePlatform'
import { HomeWater } from '@/components/home/HomeWater'
import { homePageStack } from '@/constants/tokens/home'
import { useHomeSectionAnimation } from '@/hooks/useHomeSectionAnimation'

export function HomeSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useHomeSectionAnimation({ sectionRef })

  return (
    <>
      <main ref={sectionRef} className={homePageStack}>
        <HomeIntro />
        <HomeClimate />
        <HomeGrowth />
        <HomeWater />
        <HomeAlerts />
        <HomePlatform />
        <HomeCta />
      </main>
      <Footer />
    </>
  )
}
