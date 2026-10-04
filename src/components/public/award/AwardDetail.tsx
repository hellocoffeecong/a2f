import Image from "next/image";
import type { ReactNode } from "react";
import { formatDisplayDate } from "@/lib/utils/date";
import type { Award, AwardPerson } from "@/types/content";
import AwardTypeIcon from "./AwardTypeIcon";
import styles from "./AwardDetail.module.css";

type Wrap = (node: ReactNode) => ReactNode;

type Props = {
  award: Award;
  // Admin composition hooks (neutral slots; the public page passes none). When a hook is
  // given, its area is rendered even if empty, so it can be filled in.
  toolbar?: ReactNode;
  renderHeader?: Wrap;
  renderBody?: Wrap;
  renderImages?: Wrap;
  renderPeople?: Wrap;
};

const identity: Wrap = (node) => node;

// Award / Activity detail (Figma "Home_NewsDetail": 365 0:1480 / 768 0:1735 / 1440 0:2339 /
// 1920 0:892). 365/768: title → images → body → People. 1440+: title, then body + People on
// the left (People pushed to the bottom, after a minimum gap) and the images on the right.
export default function AwardDetail({
  award,
  toolbar,
  renderHeader = identity,
  renderBody,
  renderImages,
  renderPeople,
}: Props) {
  const showBody = Boolean(award.body) || Boolean(renderBody);
  const showImages = award.images.length > 0 || Boolean(renderImages);
  const showPeople = award.people.length > 0 || Boolean(renderPeople);

  return (
    <main className={styles.main}>
      {toolbar}
      <article className={styles.detail}>
        {renderHeader(
          <header className={styles.header}>
            <h1 className={styles.title}>{award.title}</h1>
            <p className={styles.meta}>
              <AwardTypeIcon className={styles.typeIcon} type={award.type} />
              <span>{award.label}</span>
              <span className={styles.square} aria-hidden="true" />
              <time dateTime={award.date}>{formatDisplayDate(award.date)}</time>
            </p>
          </header>,
        )}
        <div className={styles.content}>
          <div className={styles.text}>
            {showBody && <div className={styles.bodyCell}>{(renderBody ?? identity)(<AwardBody body={award.body} />)}</div>}
            {showPeople && (
              <div className={styles.peopleCell}>{(renderPeople ?? identity)(<AwardPeople people={award.people} />)}</div>
            )}
          </div>
          {showImages && (
            <div className={styles.imagesCell}>
              {(renderImages ?? identity)(<AwardImages images={award.images} title={award.title} />)}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

// Plain text; a blank line separates paragraphs, single line breaks are kept.
function AwardBody({ body }: { body: string }) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return (
    <div className={styles.body}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

// Original aspect ratio, full column width, no crop.
function AwardImages({ images, title }: { images: Award["images"]; title: string }) {
  if (images.length === 0) return null;
  return (
    <div className={styles.images}>
      {images.map((image, index) => (
        <Image
          key={image.pathname}
          className={styles.image}
          src={image.url}
          alt={image.alt || `${title} 이미지 ${index + 1}`}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1440px) 58vw, 100vw"
          priority={index === 0}
        />
      ))}
    </div>
  );
}

const DEGREE_HIDDEN = "N/A";

function AwardPeople({ people }: { people: AwardPerson[] }) {
  if (people.length === 0) return null;
  return (
    <ul className={styles.people} aria-label="People">
      {people.map((person, index) => {
        const details = [person.degree === DEGREE_HIDDEN ? "" : person.degree, person.role].filter(Boolean);
        return (
          <li key={index} className={styles.person}>
            <div className={styles.photo}>
              {person.profileImage && (
                <Image
                  className={styles.photoImage}
                  src={person.profileImage.url}
                  alt=""
                  fill
                  sizes="100px"
                />
              )}
            </div>
            <div className={styles.personText}>
              <p className={styles.name}>{person.name}</p>
              {details.length > 0 && (
                <p className={styles.personMeta}>
                  {details.map((detail, i) => (
                    <span key={detail} className={styles.personDetail}>
                      {i > 0 && <span className={styles.personSquare} aria-hidden="true" />}
                      {detail}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
