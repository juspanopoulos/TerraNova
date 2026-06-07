import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoColorido from '@/assets/logos/logo-colorido.png'
import {
  containerPx,
  contentShell,
  headerLogo,
  headerNav,
  headerNavLinkBase,
} from '@/constants/layout'
import { NAV_LINKS, ROUTES } from '@/constants/routes'
import styles from './HomeNavbar.module.css'

gsap.registerPlugin(ScrollTrigger)

const navShell = [
  contentShell,
  containerPx,
  'flex min-h-16 items-center sm:min-h-[4.25rem] md:min-h-[4.75rem] lg:min-h-20',
].join(' ')

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
  const headerRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: header,
        start: 'top top',
        endTrigger: document.querySelector('.site-root') ?? document.body,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          const spacer = self.pin
          if (!spacer) return
          spacer.style.minHeight = self.isActive
            ? `${header.offsetHeight}px`
            : ''
        },
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const header = headerRef.current
    ScrollTrigger.refresh()

    if (!header) return

    const trigger = ScrollTrigger.getAll().find(
      (instance) => instance.trigger === header,
    )

    if (trigger?.isActive && trigger.pin) {
      trigger.pin.style.minHeight = `${header.offsetHeight}px`
    }
  }, [menuOpen])

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
    <header ref={headerRef} className={`${styles.header} border-b`}>
      <div className={`${navShell} ${styles.shell}`}>
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
