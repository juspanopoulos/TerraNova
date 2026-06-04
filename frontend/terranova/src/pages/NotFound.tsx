import { containerPx } from '@/constants/layout'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main
      className={`grid min-h-[50vh] place-items-center text-center sm:min-h-[60vh] ${containerPx} py-12 sm:py-16 md:py-20`}
    >
      <div className="max-w-lg px-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-laranja-solar sm:text-sm">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-verde-floresta xs:text-3xl sm:text-4xl md:text-5xl">
          Pagina nao encontrada
        </h1>
        <p className="mt-4 text-sm leading-6 text-preto-suave/70 sm:text-base">
          O endereco pode estar incorreto ou a pagina foi movida.
        </p>
        <Link
          className="mt-6 inline-flex rounded-md bg-verde-floresta px-4 py-2.5 text-sm font-semibold text-bege-natural transition hover:bg-preto-suave sm:mt-8 sm:px-5 sm:py-3 sm:text-base"
          to="/"
        >
          Voltar ao inicio
        </Link>
      </div>
    </main>
  )
}

export default NotFound
