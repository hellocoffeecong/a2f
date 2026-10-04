import Image from "next/image";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/utils/date";
import type { Award } from "@/types/content";
import AwardTypeIcon from "./AwardTypeIcon";
import styles from "./AwardCard.module.css";

type Props = {
  award: Award;
  href?: string;     // no link until the detail page exists
  position: number; // place in the row: Figma gives each position its own image height
};

const POSITION_CLASS = [styles.position0, styles.position1, styles.position2];

// Award & Activity card. The date shows on hover/keyboard focus from 1440 up (Figma "Hover"),
// and always below 1440 (no hover on touch screens). Without `href` the card is not a link.
export default function AwardCard({ award, href, position }: Props) {
  const image = award.images[0];
  const className = `${styles.card} ${POSITION_CLASS[position % POSITION_CLASS.length]}`;
  const content = (
    <>
      <div className={styles.media}>
        {image && (
          <Image
            className={styles.image}
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1440px) 32vw, (min-width: 768px) 48vw, 100vw"
          />
        )}
      </div>
      <p className={styles.event}>
        <AwardTypeIcon className={styles.typeIcon} type={award.type} />
        <span>{award.title}</span>
      </p>
      <p className={styles.labelRow}>
        <span className={styles.label}>{award.label}</span>
        <span className={styles.dateGroup}>
          <span className={styles.dot} aria-hidden="true" />
          <time className={styles.date} dateTime={award.date}>
            {formatDisplayDate(award.date)}
          </time>
        </span>
      </p>
      {award.body && <p className={styles.body}>{award.body}</p>}
    </>
  );

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    // Focusable so keyboard users get the same date reveal as hover.
    <article className={className} tabIndex={0}>
      {content}
    </article>
  );
}
