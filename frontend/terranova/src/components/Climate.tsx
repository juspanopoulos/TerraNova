import {
  copyAsideOnDark,
  eyebrowOnDark,
  sectionGridBase,
  sectionPy,
  titleOnDark,
} from "@/constants/layout";

export default function Climate() {
  return (
    <section
      data-section="climate"
      className={`flex min-h-[70vh] items-center bg-[#1a130d] text-bege-natural sm:min-h-[75vh] md:min-h-[80vh] ${sectionPy}`}
    >
      <div
        className={[
          sectionGridBase,
          "md:grid-cols-[0.9fr_1.1fr]",
          "lg:grid-cols-[0.9fr_1.1fr]",
          "xl:grid-cols-[0.9fr_1.1fr]",
        ].join(" ")}
      >
        <header className="max-w-xl">
          <p className={eyebrowOnDark}>dados climáticos</p>
          <h2 className={titleOnDark}>
            Monitoramento climático em tempo real
          </h2>
        </header>

        <p className={copyAsideOnDark}>
          Sensores, previsões e APIs ambientais se cruzam em uma camada viva de
          dados para reduzir incertezas antes que elas virem perdas.
        </p>
      </div>
    </section>
  );
}
