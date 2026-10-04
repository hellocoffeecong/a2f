import publicationData from "../data/publication.json";
import styles from "./page.module.css";

export default function Publication() {
  return (
    <main>
      
      <ul className={styles.paperList}>
        {publicationData.map((item) => (
          <li key={item.id} className={styles.paperItem}>
            <div className={styles.paperInfo}>
            <h2>{item.title}</h2>
            <h5>{item.englishTitle}</h5>
            <h6>{item.year} | {item.authors} | {item.journal} </h6>
            </div>
            <div className={styles.paperSummary}> 
            <h6>{item.summary}</h6>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}