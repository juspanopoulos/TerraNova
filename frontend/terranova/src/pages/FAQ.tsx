const questions = [
  {
    question: 'O que ja esta configurado no frontend?',
    answer:
      'React, Vite, Tailwind, rotas, alias de importacao, Inter, GSAP e Lenis.',
  },
  {
    question: 'Onde ficam as paginas do projeto?',
    answer:
      'As paginas ficam em src/pages e sao conectadas em src/routes/AppRoutes.tsx.',
  },
  {
    question: 'Como reaproveitar estrutura comum?',
    answer:
      'Use o BaseLayout em src/layouts para manter Header e Footer nas paginas.',
  },
]

const FAQ = () => {
  return (
    <main className="px-6 py-16 xs:px-4 md:px-8 lg:px-12 xl:px-16">
      <section className="mx-auto w-full max-w-6xl">
        <p className="text-sm font-semibold uppercase text-laranja-solar">
          FAQ
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-verde-floresta xs:text-3xl md:text-5xl">
          Perguntas frequentes sobre a base do projeto.
        </h1>
        <div className="mt-10 grid gap-4">
          {questions.map((item) => (
            <article
              className="rounded-md border border-verde-floresta/15 bg-white/40 p-5"
              key={item.question}
            >
              <h2 className="text-lg font-semibold text-verde-floresta">
                {item.question}
              </h2>
              <p className="mt-2 leading-7 text-preto-suave/75">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default FAQ
