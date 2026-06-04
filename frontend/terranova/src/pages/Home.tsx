import { HomeNavbar } from '@/components/HomeNavbar'
import { HeroParallax } from '@/components/HeroParallax'
import { gridCards, homeMain } from '@/constants/layout'
import styles from './Home.module.css'

const Home = () => {
  return (
    <>
      <div className={styles.homeTop}>
        <HeroParallax />
        <HomeNavbar />
      </div>
      <main className={homeMain}>
        <section id="conteudo" className="w-full py-8 sm:py-10 md:py-12 lg:py-16 xl:py-16">
          <div className={gridCards}>
            {[
              ['Verde Floresta', '#3F6B4B', 'bg-verde-floresta'],
              ['Laranja Solar', '#E59B3A', 'bg-laranja-solar'],
              ['Verde Claro', '#A8C7A1', 'bg-verde-claro'],
            ].map(([name, hex, color]) => (
              <article
                className="rounded-md border border-verde-floresta/15 bg-white/40 p-4 sm:p-5"
                key={name}
              >
                <div
                  className={`mb-3 h-10 rounded-md sm:mb-4 sm:h-12 ${color}`}
                />
                <h2 className="text-base font-semibold text-verde-floresta sm:text-lg">
                  {name}
                </h2>
                <p className="mt-1 text-xs text-preto-suave/70 sm:text-sm">
                  {hex}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
