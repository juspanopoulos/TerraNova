import { useEffect } from 'react'
import { gsap } from 'gsap'
import { setupSmoothScroll } from '@/lib/smoothScroll'
import { AppRoutes } from '@/routes'

const App = () => {
  useEffect(() => {
    gsap.defaults({
      duration: 0.8,
      ease: 'power3.out',
    })

    return setupSmoothScroll()
  }, [])

  return <AppRoutes />
};

export default App;
