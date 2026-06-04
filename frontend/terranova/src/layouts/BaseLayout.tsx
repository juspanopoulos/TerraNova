import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ROUTES } from '@/constants/routes'

type BaseLayoutProps = {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { pathname } = useLocation()
  const isHome = pathname === ROUTES.home

  return (
    <div className="min-h-screen overflow-x-hidden bg-bege-natural font-sans text-preto-suave">
      {!isHome && <Navbar />}
      {children}
      <Footer />
    </div>
  )
}
