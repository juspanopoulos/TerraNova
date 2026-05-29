import { NAV_LINKS } from '@/constants/routes'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="border-t border-verde-floresta/15 bg-preto-suave text-bege-natural">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-8 xs:flex-col xs:items-start md:px-8 lg:px-12 xl:px-16">
        <div>
          <p className="text-lg font-bold text-verde-claro">TerraNova</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-bege-natural/75">
            Uma base preparada para paginas institucionais, navegacao simples e
            evolucao do frontend.
          </p>
        </div>
        <nav aria-label="Navegacao secundaria" className="flex flex-wrap gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              className="text-sm font-medium text-bege-natural/80 transition hover:text-laranja-solar"
              key={link.to}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
