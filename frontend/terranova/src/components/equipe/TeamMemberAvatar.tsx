type TeamMemberAvatarProps = {
  name: string;
  photo?: string;
  className?: string;
};

const avatarFrame =
  "relative aspect-square shrink-0 overflow-hidden rounded-2xl ring-1 ring-verde-floresta/12 size-28 sm:size-40 md:size-44 lg:size-48";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamMemberAvatar({
  name,
  photo,
  className = "",
}: TeamMemberAvatarProps) {
  const initials = getInitials(name);
  const frameClass = [avatarFrame, className].filter(Boolean).join(" ");

  if (photo) {
    return (
      <div className={frameClass}>
        <img
          src={photo}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <span
      className={[
        frameClass,
        "grid place-items-center bg-linear-to-br from-verde-claro/80 to-verde-floresta/30 text-base font-semibold text-verde-floresta sm:text-lg",
      ].join(" ")}
      aria-hidden
    >
      {initials}
    </span>
  );
}
