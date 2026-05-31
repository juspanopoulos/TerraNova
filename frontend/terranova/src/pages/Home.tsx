const Home = () => {
  return (
    <main className="px-6 py-10 xs:px-4 md:px-8 lg:px-12 xl:px-16">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex rounded-full bg-verde-claro px-4 py-2 text-sm font-semibold text-verde-floresta">
            TerraNova
          </span>
          <h1 className="text-5xl font-bold leading-tight text-verde-floresta xs:text-4xl md:text-5xl lg:text-6xl">
            Projeto pronto para crescer com Tailwind.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-preto-suave/80 xs:text-base xs:leading-7">
            Inter, cores da marca, rotas, GSAP e Lenis ja estao configurados
            como base do frontend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded-md bg-verde-floresta px-5 py-3 font-semibold text-bege-natural transition hover:bg-preto-suave"
              href="#conteudo"
            >
              Ver base
            </a>
            <a
              className="rounded-md border border-verde-floresta px-5 py-3 font-semibold text-verde-floresta transition hover:bg-verde-claro"
              href="/"
            >
              Inicio
            </a>
          </div>
        </div>
      </section>
      <section id="conteudo" className="mx-auto w-full max-w-6xl py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ['Verde Floresta', '#3F6B4B', 'bg-verde-floresta'],
            ['Laranja Solar', '#E59B3A', 'bg-laranja-solar'],
            ['Verde Claro', '#A8C7A1', 'bg-verde-claro'],
          ].map(([name, hex, color]) => (
            <article
              className="rounded-md border border-verde-floresta/15 bg-white/40 p-5"
              key={name}
            >
              <div className={`mb-4 h-12 rounded-md ${color}`} />
              <h2 className="font-semibold text-verde-floresta">{name}</h2>
              <p className="mt-1 text-sm text-preto-suave/70">{hex}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
