export function SettingsToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-4 sm:gap-6">
      <div className="min-w-0 flex-1">
        <p id={`${id}-label`} className="text-sm font-semibold text-[var(--db-text)] sm:text-base">
          {label}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--db-text-muted)]">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40",
          checked ? "bg-verde-floresta" : "bg-[var(--db-toggle-off)]",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          ].join(" ")}
          aria-hidden
        />
      </button>
    </div>
  );
}
