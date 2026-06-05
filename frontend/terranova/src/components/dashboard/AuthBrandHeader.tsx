import logoColorido from "@/assets/logos/logo-colorido.png";

export function AuthBrandHeader({ className = "mb-8" }: { className?: string }) {
  return (
    <div className={`${className} text-center`}>
      <img
        src={logoColorido}
        alt="TerraNova"
        className="mx-auto mb-4 h-20 w-auto object-contain sm:h-24 md:h-28"
      />
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-verde-floresta">TerraNova</p>
    </div>
  );
}
