import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { BaseLayout } from '@/layouts'
import Equipe from '@/pages/Equipe'
import FAQ from '@/pages/FAQ'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import Sobre from '@/pages/Sobre'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.sobre} element={<Sobre />} />
          <Route path={ROUTES.equipe} element={<Equipe />} />
          <Route path={ROUTES.faq} element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  )
}
