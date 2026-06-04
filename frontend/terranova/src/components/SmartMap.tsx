export default function SmartMap() {
  return (
    <section
      data-section="map"
      className="section-shell relative flex items-center bg-[linear-gradient(180deg,#202522_0%,#3F6B4B_54%,#EFE4D2_100%)] px-6 py-28 text-natural"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,199,161,0.28),transparent_34%)]" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[0.95fr_1.05fr]">
        <div data-reveal>
          <p className="mb-4 font-space text-sm font-bold uppercase tracking-[0.28em] text-solar">
            mapa inteligente
          </p>
          <h2 className="font-space text-5xl font-bold leading-none md:text-7xl">
            Dados conectados para decisões mais seguras
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-8 text-natural/72">
            Regiões, sensores e alertas se organizam em uma rede visual para
            priorizar ações no campo.
          </p>
        </div>
        <div className="relative">
          <div
            className="flex aspect-[980/620] w-full items-center justify-center rounded-lg border-2 border-dashed border-natural/25 bg-natural/5 drop-shadow-2xl"
            role="img"
            aria-label="Placeholder do Mapa Inteligente"
          >
            <p className="px-6 text-center font-space text-sm font-medium text-natural/55 sm:text-base">
              Placeholder do Mapa Inteligente
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
