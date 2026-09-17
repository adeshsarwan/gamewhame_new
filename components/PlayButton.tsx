import Link from "next/link";
import { PlayTriangle } from "./BrandMarks";
import styles from "./PlayButton.module.css";

type Variant = "overlay" | "cta" | "big" | "pill";

interface PlayButtonProps {
  variant?: Variant;
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * PlayButton — always the custom Play triangle (BrandMarks).
 *  overlay = white pill in the card hover layer
 *  cta     = pink-to-orange gradient full CTA
 *  big     = round white button on the player stage
 *  pill    = compact pink pill
 */
export default function PlayButton({
  variant = "cta",
  label,
  href,
  onClick,
  className,
  ariaLabel,
}: PlayButtonProps) {
  const triSize = variant === "big" ? 34 : variant === "overlay" ? 15 : 18;
  const triColor = variant === "overlay" || variant === "big" ? "var(--pink)" : "#fff";
  const content = (
    <>
      <span className={styles.tri}>
        <PlayTriangle size={triSize} color={triColor} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </>
  );
  const cls = [styles.btn, styles[variant], className].filter(Boolean).join(" ");
  const aria = ariaLabel ?? label ?? "Play";

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={aria}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={aria}>
      {content}
    </button>
  );
}
