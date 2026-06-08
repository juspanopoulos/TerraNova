import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoColorido from '@/assets/logos/logo-colorido.png'
import { containerPx, contentShell, headerLogo, headerNav } from '@/constants/layout'
import { NAV_LINKS, ROUTES } from '@/constants/routes'
import styles from '@/styles/modules/home-navbar.module.css'

gsap.registerPlugin(ScrollTrigger)

const HOME_NAVBAR_ID = 'home-navbar'
const HOME_NAVBAR_PIN_HOST_ID = 'home-navbar-pin-host'
const HOME_NAVBAR_PIN_ID = 'home-navbar-pin'
const HOME_NAVBAR_THEME_ID = 'home-navbar-theme'
const NAV_THEME_SCROLL_RANGE = 112

const navShell = [
  contentShell,
  containerPx,
  'flex min-h-16 items-center sm:min-h-[4.25rem] md:min-h-[4.75rem] lg:min-h-20',
].join(' ')

const navLinkBase =
  'cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [navLinkBase, styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')

const mobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'block cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors',
    styles.navLinkMobile,
    isActive ? styles.navLinkActive : '',
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
  ScrollTrigger.getById(HOME_NAVBAR_THEME_ID)?.kill()
  ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)?.kill(true)
  releaseHomeNavbarFromPinSpacer()
  document.documentElement.style.removeProperty('--home-nav-theme')
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
  pinSpacer.style.minHeight = `${pinHost.offsetHeight}px`
}

function applyNavTheme(pinHost: HTMLElement, theme: number) {
  const clamped = Math.min(1, Math.max(0, theme))
  const value = clamped.toFixed(4)

  document.documentElement.style.setProperty('--home-nav-theme', value)
  pinHost.dataset.pinned = clamped >= 0.98 ? 'true' : 'false'

  const pinSpacer = pinHost.parentElement
  if (pinSpacer?.classList.contains('pin-spacer')) {
    pinSpacer.dataset.pinned = pinHost.dataset.pinned
  }
}

function readNavThemeProgress() {
  const themeTrigger = ScrollTrigger.getById(HOME_NAVBAR_THEME_ID)
  if (themeTrigger) return themeTrigger.progress

  return 0
}

export const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pinHostRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  useLayoutEffect(() => {
    const pinHost = pinHostRef.current
    if (!pinHost) return

    destroyHomeNavbarPin()

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: HOME_NAVBAR_THEME_ID,
        trigger: pinHost,
        start: 'top top',
        end: `+=${NAV_THEME_SCROLL_RANGE}`,
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyNavTheme(pinHost, self.progress)
        },
        onRefresh: (self) => {
          applyNavTheme(pinHost, self.progress)
        },
        onLeaveBack: () => {
          applyNavTheme(pinHost, 0)
        },
      })

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
          applyNavTheme(pinHost, readNavThemeProgress())
          applyPinLayerStyles(pinHost)
        },
      })
    }, pinHost)

    const initFrame = requestAnimationFrame(() => {
      applyNavTheme(pinHost, readNavThemeProgress())
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

    applyPinLayerStyles(pinHost)

    if (!menuOpen) return

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)?.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const logoLink = (
    <NavLink
      className="inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-85 sm:gap-3"
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
      <span
        className={[
          'text-sm font-semibold tracking-tight sm:text-base',
          styles.brandName,
        ].join(' ')}
      >
        TerraNova
      </span>
    </NavLink>
  )

  const renderLink = (
    link: (typeof NAV_LINKS)[number],
    className: typeof navLinkClassName,
    tabIndex?: number,
  ) => (
    <NavLink
      className={className}
      key={link.to}
      to={link.to}
      onClick={closeMenu}
      tabIndex={tabIndex}
    >
      {link.label}
    </NavLink>
  )

  const mobileMenu = (
    <>
      <button
        type="button"
        className={[
          'fixed inset-0 z-110 cursor-pointer bg-preto-suave/40 transition-opacity duration-300 md:hidden',
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-label="Fechar menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <aside
        id="home-mobile-nav"
        aria-hidden={!menuOpen}
        className={[
          'fixed top-0 right-0 z-120 flex h-dvh w-[min(17rem,82vw)] flex-col border-l border-verde-floresta/10 shadow-2xl shadow-preto-suave/20 transition-transform duration-300 ease-out md:hidden',
          styles.mobileDrawer,
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="h-px bg-linear-to-r from-laranja-solar/70 via-verde-claro/50 to-verde-floresta/70" />

        <div className="flex items-center justify-between border-b border-verde-floresta/10 px-4 py-3">
          <span
            className={[
              'text-xs font-semibold uppercase tracking-[0.16em]',
              styles.mobileDrawerLabel,
            ].join(' ')}
          >
            Menu
          </span>
          <button
            type="button"
            className={[
              'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg',
              styles.drawerClose,
            ].join(' ')}
            aria-label="Fechar menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <nav
          aria-label="Navegacao mobile"
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
        >
          {NAV_LINKS.map((link) =>
            renderLink(link, mobileLinkClassName, menuOpen ? 0 : -1),
          )}
        </nav>
      </aside>
    </>
  )

  return (
    <div
      ref={pinHostRef}
      id={HOME_NAVBAR_PIN_HOST_ID}
      className={styles.pinHost}
    >
      <header
        id={HOME_NAVBAR_ID}
        className={[styles.header, 'w-full'].join(' ')}
      >
        <div className={styles.headerAccentLine} aria-hidden />

        <div className={navShell}>
          <div className="flex w-full items-center justify-between gap-4 md:hidden">
            {logoLink}
            <button
              type="button"
              className={[
                'relative z-1 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors',
                styles.menuButton,
              ].join(' ')}
              aria-expanded={menuOpen}
              aria-controls="home-mobile-nav"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Menu className="size-4" aria-hidden />
            </button>
          </div>

          <div className="hidden w-full items-center justify-between gap-6 md:flex">
            {logoLink}
            <nav aria-label="Navegacao principal" className={headerNav}>
              {NAV_LINKS.map((link) => renderLink(link, navLinkClassName))}
            </nav>
          </div>
        </div>
      </header>

      {createPortal(mobileMenu, document.body)}
    </div>
  )
}
