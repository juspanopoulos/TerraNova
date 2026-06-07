import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logoColorido from '@/assets/logos/logo-colorido.png'
import {
  headerInner,
  headerLogo,
  headerNav,
  headerNavLinkBase,
} from '@/constants/layout'
import { NAV_LINKS, ROUTES } from '@/constants/routes'
import styles from './HomeNavbar.module.css'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    headerNavLinkBase,
    isActive ? styles.linkActive : styles.link,
  ].join(' ')

const accordionLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    styles.accordionLink,
    isActive ? styles.accordionLinkActive : '',
  ].join(' ')

export const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const logoLink = (
    <NavLink
      className={`inline-flex shrink-0 items-center transition-opacity hover:opacity-85 ${styles.logo}`}
      to={ROUTES.home}
      onClick={closeMenu}
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
  )

  return (
    <header className={`relative z-10 border-b ${styles.header}`}>
      <div className={`${headerInner} ${styles.shell}`}>
        <div className={styles.mobileBar}>
          {logoLink}
          <button
            type="button"
            className={[
              styles.menuButton,
              menuOpen ? styles.menuButtonOpen : '',
            ].join(' ')}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>

        <div className={styles.desktopRow}>
          {logoLink}
          <nav aria-label="Navegacao principal" className={headerNav}>
            {NAV_LINKS.map((link) => (
              <NavLink className={linkClassName} key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div
        className={[
          styles.mobileAccordion,
          menuOpen ? styles.mobileAccordionOpen : '',
        ].join(' ')}
        id="home-mobile-nav"
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileAccordionInner}>
          <nav aria-label="Navegacao mobile" className={styles.accordionNav}>
            {NAV_LINKS.map((link) => (
              <NavLink
                className={accordionLinkClassName}
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
