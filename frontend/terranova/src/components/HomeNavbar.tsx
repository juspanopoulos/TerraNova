import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoColorido from '@/assets/logos/logo-colorido.png'
import { containerPx, contentShell, headerLogo, headerNav } from '@/constants/layout'
import { NAV_LINKS, ROUTES } from '@/constants/routes'
import styles from './HomeNavbar.module.css'

gsap.registerPlugin(ScrollTrigger)

const HOME_NAVBAR_ID = 'home-navbar'
const HOME_NAVBAR_PIN_HOST_ID = 'home-navbar-pin-host'
const HOME_NAVBAR_PIN_ID = 'home-navbar-pin'
const NAV_SURFACE_DARK = '#1a130d'
const NAV_SURFACE_LIGHT = '#efe4d2'

const navShell = [
  contentShell,
  containerPx,
  'flex min-h-16 items-center sm:min-h-[4.25rem] md:min-h-[4.75rem] lg:min-h-20',
].join(' ')

const navLinkBase =
  'cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm'

const navbarDesktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    navLinkBase,
    isActive
      ? 'bg-verde-floresta text-bege-natural shadow-sm shadow-verde-floresta/20'
      : 'text-preto-suave/80 hover:bg-verde-claro/50 hover:text-verde-floresta',
  ].join(' ')

const navbarMobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'block cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors',
    isActive
      ? 'bg-verde-floresta text-bege-natural'
      : 'text-preto-suave/85 hover:bg-verde-claro/45 hover:text-verde-floresta',
  ].join(' ')

const darkDesktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    navLinkBase,
    isActive
      ? 'bg-verde-floresta text-bege-natural shadow-sm shadow-verde-floresta/20'
      : 'text-bege-natural/80 hover:bg-verde-claro/50 hover:text-bege-natural',
  ].join(' ')

const darkMobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'block cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors',
    isActive
      ? 'bg-verde-floresta text-bege-natural'
      : 'text-bege-natural/85 hover:bg-verde-claro/45 hover:text-bege-natural',
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
  ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)?.kill(true)
  releaseHomeNavbarFromPinSpacer()
}

function applyPinLayerStyles(pinHost: HTMLElement, pinned: boolean) {
  const header = pinHost.querySelector<HTMLElement>(`#${HOME_NAVBAR_ID}`)
  if (header) {
    header.style.pointerEvents = 'auto'
    header.style.zIndex = '100'
  }

  const pinSpacer = pinHost.parentElement
  if (!pinSpacer?.classList.contains('pin-spacer')) return

  pinSpacer.style.pointerEvents = 'none'
  pinSpacer.style.zIndex = '100'
  pinSpacer.style.backgroundColor = pinned ? NAV_SURFACE_LIGHT : NAV_SURFACE_DARK
  pinSpacer.style.minHeight = `${pinHost.offsetHeight}px`
}

function syncHomeNavbarPin(pinHost: HTMLElement, pinned: boolean) {
  applyPinLayerStyles(pinHost, pinned)
  ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)?.refresh()
}

function isNavbarBeige(trigger: ScrollTrigger) {
  return trigger.scroll() >= trigger.start
}

export const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const pinHostRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const desktopLinkClassName = isPinned ? navbarDesktopLinkClassName : darkDesktopLinkClassName
  const mobileLinkClassName = isPinned ? navbarMobileLinkClassName : darkMobileLinkClassName

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
        id: HOME_NAVBAR_PIN_ID,
        trigger: pinHost,
        start: 'top top',
        endTrigger: document.querySelector('.site-root') ?? document.body,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        fastScrollEnd: true,
        onEnter: () => {
          setIsPinned(true)
        },
        onLeaveBack: () => {
          setIsPinned(false)
        },
        onRefresh: (self) => {
          const beige = isNavbarBeige(self)
          setIsPinned(beige)
          applyPinLayerStyles(pinHost, beige)
        },
      })
    }, pinHost)

    const initFrame = requestAnimationFrame(() => {
      const trigger = ScrollTrigger.getById(HOME_NAVBAR_PIN_ID)
      const beige = trigger ? isNavbarBeige(trigger) : false
      setIsPinned(beige)
      applyPinLayerStyles(pinHost, beige)
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

    pinHost.dataset.pinned = isPinned ? 'true' : 'false'

    const frame = requestAnimationFrame(() => {
      syncHomeNavbarPin(pinHost, isPinned)
    })

    return () => cancelAnimationFrame(frame)
  }, [menuOpen, isPinned])

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
          isPinned ? 'text-verde-floresta' : 'text-bege-natural',
        ].join(' ')}
      >
        TerraNova
      </span>
    </NavLink>
  )

  const renderLink = (
    link: (typeof NAV_LINKS)[number],
    className: typeof navbarDesktopLinkClassName,
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
          isPinned ? 'bg-bege-natural' : 'bg-surface-night',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="h-px bg-linear-to-r from-laranja-solar/70 via-verde-claro/50 to-verde-floresta/70" />

        <div className="flex items-center justify-between border-b border-verde-floresta/10 px-4 py-3">
          <span
            className={[
              'text-xs font-semibold uppercase tracking-[0.16em]',
              isPinned ? 'text-verde-floresta/70' : 'text-bege-natural/80',
            ].join(' ')}
          >
            Menu
          </span>
          <button
            type="button"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-verde-floresta transition-colors hover:bg-verde-claro/45"
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
      data-pinned={isPinned ? 'true' : 'false'}
    >
      <header
        id={HOME_NAVBAR_ID}
        className={[
          styles.header,
          'w-full border-b border-verde-floresta/10 md:border-b-0',
          isPinned ? 'shadow-sm shadow-verde-floresta/5' : '',
          isPinned ? styles.headerPinned : styles.headerDark,
        ].join(' ')}
      >
        <div
          className="h-px bg-linear-to-r from-laranja-solar/70 via-verde-claro/50 to-verde-floresta/70 md:hidden"
          aria-hidden
        />

        <div className={navShell}>
          <div className="flex w-full items-center justify-between gap-4 md:hidden">
            {logoLink}
            <button
              type="button"
              className="relative z-1 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-verde-floresta/15 text-verde-floresta transition-colors hover:bg-verde-claro/45"
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
              {NAV_LINKS.map((link) => renderLink(link, desktopLinkClassName))}
            </nav>
          </div>
        </div>
      </header>

      {createPortal(mobileMenu, document.body)}
    </div>
  )
}
