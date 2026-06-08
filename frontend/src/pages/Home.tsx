import { useLocation } from 'react-router-dom'
import { HomeSection } from '@/components/home/HomeSection'
import { HomeNavbar } from '@/components/HomeNavbar'
import { HeroParallax } from '@/components/HeroParallax'

const Home = () => {
  const { key: navigationKey } = useLocation()

  return (
    <div className="bg-bege-natural">
      <div className="bg-surface-night">
        <HeroParallax />
      </div>
      <HomeNavbar key={navigationKey} />
      <HomeSection />
    </div>
  )
}

export default Home
