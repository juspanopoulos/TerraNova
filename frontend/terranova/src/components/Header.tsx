import { NavLink } from 'react-router-dom'
import { NAV_LINKS, ROUTES } from '@/constants/routes'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-verde-floresta text-bege-natural'
      : 'text-preto-suave hover:bg-verde-claro/60 hover:text-verde-floresta',
  ].join(' ')

export const Header = () => {
  return (
    <header className="border-b border-verde-floresta/15 bg-bege-natural/95">
      <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-6 px-6 xs:flex-col xs:items-start xs:py-4 md:px-8 lg:px-12 xl:px-16">
        <NavLink
          className="text-xl font-bold tracking-normal text-verde-floresta"
          to={ROUTES.home}
        >
          TerraNova
        </NavLink>
        <nav
          aria-label="Navegacao principal"
          className="flex flex-wrap items-center gap-2"
        >
          {NAV_LINKS.map((link) => (
            <NavLink className={linkClassName} key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
