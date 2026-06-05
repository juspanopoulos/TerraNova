import logoVerde from "@/assets/logos/logo-colorido.png"; 

export function AboutIntro() {
  return (
    <div data-about-block className="mt-8 w-full space-y-10 sm:mt-10 md:space-y-12">
      
      {/* 🏛️ 1. O Manifesto (Título principal alinhado) */}
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold leading-tight text-verde-escuro sm:text-2xl md:text-3xl">
          A gente acredita que cuidar da terra também é cuidar de você: do seu tempo,
          da sua rotina e das suas decisões.
        </h2>
      </div>

      {/* 🧩 2. Composição Tripla 100% Simétrica e Balanceada */}
      {/* md:grid-cols-12 para gerenciar milimetricamente o tamanho do logo no centro */}
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-6 lg:gap-8 items-stretch">
        
        {/* ⬅️ Card da Esquerda (Ocupa 4 colunas no desktop) */}
        <div className="rounded-2xl border border-verde-escuro/15 bg-white/40 p-6 sm:p-7 md:col-span-4 flex flex-col justify-between shadow-xs backdrop-blur-xs">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-verde-oliva uppercase tracking-widest block">
              01 . Sentido
            </span>
            <p className="text-sm leading-relaxed text-grafite/90 md:text-base">
              Por aqui, a tecnologia entra devagar e com sentido para transformar o que 
              você já observa no campo em clareza, reunindo o essencial para você enxergar 
              o território com mais calma.
            </p>
          </div>
        </div>

        {/* 🟢 Centro: O Logo Bem Grande (Ocupa 4 colunas no desktop para dar imponência) */}
        <div className="flex justify-center items-center py-6 md:col-span-4 md:py-0">
          <img
            src={logoVerde}
            alt="TerraNova"
            className="h-20 w-auto sm:h-24 md:h-28 lg:h-32 transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* ➡️ Card da Direita (Ocupa 4 colunas - Identificado e igual ao da esquerda) */}
        <div className="rounded-2xl border border-verde-escuro/15 bg-white/40 p-6 sm:p-7 md:col-span-4 flex flex-col justify-between shadow-xs backdrop-blur-xs">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-verde-oliva uppercase tracking-widest block">
              02 . Resumo
            </span>
            <p className="text-sm italic leading-relaxed text-grafite/90 md:text-base font-medium">
              Um painel simples para acompanhar clima, solo, água e alertas, evitando 
              tempo perdido com informações espalhadas.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}