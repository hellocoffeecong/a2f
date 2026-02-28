import { notFound } from "next/navigation";
import projectData from "../../data/project.json";
import styles from "./page.module.css";

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const projectId = Number(id);
  const project = projectData.find((item) => item.id === projectId);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.detailPage}>
      <h2>{project.title}</h2>
      <h6 className={styles.meta}>{project.author} | {project.period}</h6>
      <h6 className={styles.summary}>{project.summary}</h6>
      <div className={styles.images}>
        {project.images.map((image, index) => (
          <img
            key={`${project.id}-${index}`}
            src={image.src}
            alt={image.alt}
            className={styles.image}
          />
        ))}
      </div>
    </main>
  );
}
