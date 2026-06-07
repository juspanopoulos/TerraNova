import { copyOnLight } from "@/constants/layout";
import { aboutEyebrow, aboutSectionTitle } from "@/constants/tokens/about";

type AboutSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function AboutSectionHeading({
  eyebrow,
  title,
  description,
}: AboutSectionHeadingProps) {
  return (
    <header>
      <p className={aboutEyebrow}>{eyebrow}</p>
      <h2 className={aboutSectionTitle}>{title}</h2>
      {description ? (
        <p className={`${copyOnLight} mt-4 max-w-2xl sm:mt-5`}>{description}</p>
      ) : null}
    </header>
  );
}
