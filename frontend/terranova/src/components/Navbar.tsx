import { NavLink } from 'react-router-dom'
import logoColorido from '@/assets/logos/logo-colorido.png'
import {
  headerInner,
  headerLogo,
  headerNav,
  headerNavLinkBase,
} from '@/constants/layout'
import { NAV_LINKS, ROUTES } from '@/constants/routes'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    headerNavLinkBase,
    'xs:text-center',
    isActive
      ? 'bg-verde-floresta text-bege-natural'
      : 'text-preto-suave hover:bg-verde-claro/60 hover:text-verde-floresta',
  ].join(' ')

export const Navbar = () => {
  return (
    <header className="relative z-10 border-b border-verde-floresta/15 bg-bege-natural/95">
      <div className={headerInner}>
        <NavLink
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-85"
          to={ROUTES.home}
        >
          <img
            src={logoColorido}
            alt="TerraNova"
            className={headerLogo}
            width={64}
            height={64}
            decoding="async"
          />
        </NavLink>
        <nav
          aria-label="Navegacao principal"
          className={`${headerNav} xs:w-full xs:flex-col xs:items-stretch`}
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
