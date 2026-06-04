export default function Climate() {
  return (
    <section
      data-section="climate"
      className="relative flex min-h-[80vh] items-center overflow-hidden bg-[#1a130d] py-20 md:py-24"
    >
      <div
        className={[
          "relative z-10 mx-auto grid w-full max-w-6xl -translate-y-6 items-center gap-12 px-6",
          "md:grid-cols-[0.9fr_1.1fr]",
          "lg:grid-cols-[0.9fr_1.1fr]",
          "xl:grid-cols-[0.9fr_1.1fr]",
        ].join(" ")}
      >
        <div className="max-w-xl">
          <p className="mb-4 font-space text-sm font-bold uppercase tracking-[0.28em] text-solar">
            dados climáticos
          </p>
          <h2 className="font-space text-5xl font-bold leading-none text-bege-natural md:text-7xl">
            Monitoramento climático em tempo real
          </h2>
        </div>
        <div className="ml-auto max-w-md border-l border-bege-natural/20 pl-8 text-lg leading-8 text-bege-natural/70">
          Sensores, previsões e APIs ambientais se cruzam em uma camada viva de
          dados para reduzir incertezas antes que elas virem perdas.
        </div>
      </div>
    </section>
  );
}
