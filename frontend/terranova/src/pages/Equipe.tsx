const team = [
  {
    name: 'Ana Verde',
    role: 'Direcao de projeto',
  },
  {
    name: 'Bruno Sol',
    role: 'Estrategia e conteudo',
  },
  {
    name: 'Clara Raiz',
    role: 'Experiencia e comunidade',
  },
]

const Equipe = () => {
  return (
    <main className="px-6 py-16 xs:px-4 md:px-8 lg:px-12 xl:px-16">
      <section className="mx-auto w-full max-w-6xl">
        <p className="text-sm font-semibold uppercase text-laranja-solar">
          Equipe
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-verde-floresta xs:text-3xl md:text-5xl">
          Pessoas diferentes trabalhando por uma mesma paisagem.
        </h1>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => (
            <article
              className="rounded-md border border-verde-floresta/15 bg-white/40 p-5"
              key={person.name}
            >
              <div className="mb-5 grid size-14 place-items-center rounded-full bg-verde-claro font-bold text-verde-floresta">
                {person.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <h2 className="text-xl font-semibold text-verde-floresta">
                {person.name}
              </h2>
              <p className="mt-2 text-sm text-preto-suave/70">{person.role}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Equipe
