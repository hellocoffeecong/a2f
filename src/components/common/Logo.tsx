import Image from "next/image";
import lockupBlack from "@/assets/brand/a2f-logo-lockup-black.svg";
import markGreen from "@/assets/brand/a2f-logo-mark-green.svg";
import styles from "./Logo.module.css";

// A2F logo assets exported from Figma (unaltered):
// - "lockup": A2F mark + "Design Lab", black (header, 1440: 205×55)
// - "mark":   A2F mark only, green (footer, 1440: 95×55)
const VARIANTS = {
  lockup: { src: lockupBlack, className: styles.lockup },
  mark: { src: markGreen, className: styles.mark },
} as const;

type LogoProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
  priority?: boolean;
};

export default function Logo({ variant = "lockup", className, priority }: LogoProps) {
  const { src, className: variantClass } = VARIANTS[variant];
  return (
    <Image
      src={src}
      alt="A2F Design Lab"
      className={className ? `${variantClass} ${className}` : variantClass}
      priority={priority}
      unoptimized
    />
  );
}
