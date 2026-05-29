import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

type BaseLayoutProps = {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-bege-natural font-sans text-preto-suave">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
