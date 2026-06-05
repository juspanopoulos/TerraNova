import background6 from "@/assets/images/login/background6.jpeg";

export function PageHeaderAccent() {
  return (
    <div
      className="relative h-16 w-full overflow-hidden sm:h-30 md:h-40"
      aria-hidden
    >
      <img
        src={background6}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
      />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-bege-natural to-transparent sm:h-0 md:h-0" />
    </div>
  );
}
