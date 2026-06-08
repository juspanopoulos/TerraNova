import { copyOnLight } from "@/constants/layout";
import { aboutEyebrow, aboutSectionDescription, aboutSectionHeadingTitle } from "@/constants/tokens/about";

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
      <h2 className={aboutSectionHeadingTitle}>{title}</h2>
      {description ? (
        <p className={`${copyOnLight} ${aboutSectionDescription}`}>{description}</p>
      ) : null}
    </header>
  );
}
