import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

const HOME_NAVBAR_ID = 'home-navbar'
const HOME_NAVBAR_PIN_HOST_ID = 'home-navbar-pin-host'
const HOME_NAVBAR_PIN_ID = 'home-navbar-pin'

const navShell = [
  contentShell,
  containerPx,
  'flex min-h-16 items-center sm:min-h-[4.25rem] md:min-h-[4.75rem] lg:min-h-20',
].join(' ')

const PIN_INLINE_PROPS = [
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'max-width',
  'transform',
  'translate',
  'rotate',
  'scale',
  'pointer-events',
  'z-index',
  'min-height',
] as const

function isNavActive(pathname: string, to: string) {
  if (to === ROUTES.home) return pathname === ROUTES.home
  if (to === ROUTES.plataforma) {
    return pathname === ROUTES.plataforma || pathname.startsWith(`${ROUTES.plataforma}/`)
  }
  return pathname === to
}

function clearInlineStyles(element: HTMLElement) {
  for (const prop of PIN_INLINE_PROPS) {
    element.style.removeProperty(prop)
  }
}

function releaseHomeNavbarFromPinSpacer() {
  document.querySelectorAll<HTMLElement>('.pin-spacer').forEach((spacer) => {
    const pinHost = spacer.querySelector<HTMLElement>(`#${HOME_NAVBAR_PIN_HOST_ID}`)
    if (!pinHost) return

    spacer.replaceWith(pinHost)
    clearInlineStyles(pinHost)

    const header = pinHost.querySelector<HTMLElement>(`#${HOME_NAVBAR_ID}`)
    if (header) clearInlineStyles(header)
  })
}

function destroyHomeNavbarPin() {
  ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)?.kill(true)
  releaseHomeNavbarFromPinSpacer()
}

function applyPinLayerStyles(pinHost: HTMLElement) {
  const header = pinHost.querySelector<HTMLElement>(`#${HOME_NAVBAR_ID}`)
  if (header) {
    header.style.pointerEvents = 'auto'
    header.style.zIndex = '100'
  }

  const pinSpacer = pinHost.parentElement
  if (!pinSpacer?.classList.contains('pin-spacer')) return

  pinSpacer.style.pointerEvents = 'none'
  pinSpacer.style.zIndex = '100'
  pinSpacer.style.backgroundColor = '#1a130d'
  pinSpacer.style.minHeight = `${pinHost.offsetHeight}px`
}

function syncHomeNavbarPin(pinHost: HTMLElement) {
  applyPinLayerStyles(pinHost)
  ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)?.refresh()
}

export const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pinHostRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const goTo = useCallback(
    (to: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      closeMenu()
      navigate(to)
    },
    [closeMenu, navigate],
  )

  useLayoutEffect(() => {
    const pinHost = pinHostRef.current
    if (!pinHost) return

    destroyHomeNavbarPin()

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: HOME_NAVBAR_PIN_ID,
        trigger: pinHost,
        start: 'top top',
        endTrigger: document.querySelector('.site-root') ?? document.body,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        fastScrollEnd: true,
        onRefresh: () => {
          applyPinLayerStyles(pinHost)
        },
      })
    }, pinHost)

    const initFrame = requestAnimationFrame(() => {
      applyPinLayerStyles(pinHost)
    })

    return () => {
      cancelAnimationFrame(initFrame)
      ctx.revert()
      destroyHomeNavbarPin()
    }
  }, [])

  useEffect(() => {
    const pinHost = pinHostRef.current
    if (!pinHost) return

    const frame = requestAnimationFrame(() => {
      syncHomeNavbarPin(pinHost)
    })

    return () => cancelAnimationFrame(frame)
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const logoLink = (
    <a
      href={ROUTES.home}
      className={`inline-flex shrink-0 items-center transition-opacity hover:opacity-85 ${styles.logo}`}
      onClick={goTo(ROUTES.home)}
    >
      <img
        src={logoColorido}
        alt="TerraNova"
        className={headerLogo}
        width={64}
        height={64}
        decoding="async"
      />
    </a>
  )

  return (
    <div
      ref={pinHostRef}
      id={HOME_NAVBAR_PIN_HOST_ID}
      className={styles.pinHost}
    >
      <header id={HOME_NAVBAR_ID} className={styles.header}>
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
            <nav aria-label="Navegacao principal" className={`${headerNav} ${styles.nav}`}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className={[
                    headerNavLinkBase,
                    styles.navLink,
                    isNavActive(pathname, link.to) ? styles.linkActive : styles.link,
                  ].join(' ')}
                  onClick={goTo(link.to)}
                  aria-current={isNavActive(pathname, link.to) ? 'page' : undefined}
                >
                  {link.label}
                </a>
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
                <a
                  key={link.to}
                  href={link.to}
                  className={[
                    styles.accordionLink,
                    isNavActive(pathname, link.to) ? styles.accordionLinkActive : '',
                  ].join(' ')}
                  onClick={goTo(link.to)}
                  tabIndex={menuOpen ? 0 : -1}
                  aria-current={isNavActive(pathname, link.to) ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </div>
  )
}
