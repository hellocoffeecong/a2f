import Link from "next/link";
import projectData from "../data/project.json";
import styles from "./page.module.css";

export default function Project() {
  return (
    <main>
      <ul className={styles.projectList}>
        {projectData.map((item) => (
          <li key={item.id} className={styles.projectItem}>
            <Link href={`/project/${item.id}`} className={styles.projectInfoLink}>
              <div className={styles.projectInfo}>
              <h3>{item.title}</h3>
              <h6 className={styles.projectMetaLine}>{item.author} | {item.period}</h6>
              <h6 className={styles.projectSummary}>{item.summary}</h6>
              </div>
            </Link>
            <div className={styles.projectImages}>
              {item.images.slice(0, 4).map((image, index) => (
                <img
                  key={`${item.id}-${index}`}
                  className={styles.projectImage}
                  src={image.src}
                  alt={image.alt}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}