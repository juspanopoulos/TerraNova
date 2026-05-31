import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-laranja-solar">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold text-verde-floresta">
          Pagina nao encontrada
        </h1>
        <Link
          className="mt-6 inline-flex rounded-md bg-verde-floresta px-5 py-3 font-semibold text-bege-natural transition hover:bg-preto-suave"
          to="/"
        >
          Voltar ao inicio
        </Link>
      </div>
    </main>
  )
}

export default NotFound
