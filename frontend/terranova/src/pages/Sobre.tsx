import {
  bodyLead,
  contentShell,
  containerPx,
  containerPyPage,
  eyebrow,
  headingPage,
} from '@/constants/layout'

const Sobre = () => {
  return (
    <main className={`${containerPx} ${containerPyPage}`}>
      <section className={contentShell}>
        <p className={eyebrow}>Sobre</p>
        <h1 className={headingPage}>
          Uma base digital para aproximar pessoas, territorio e boas ideias.
        </h1>
        <p className={bodyLead}>
          A TerraNova nasce com uma identidade natural, acolhedora e preparada
          para crescer em paginas institucionais, conteudo e experiencias
          interativas.
        </p>
      </section>
    </main>
  )
}

export default Sobre
