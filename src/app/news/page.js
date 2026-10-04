import styles from "./page.module.css";
import newsData from "../data/news.json";

export default function News() {
  return (
    <main className={styles.newsPage}>
      <h2 className={styles.newsHeading}>
        Check out <br />
        The news from A2F.
      </h2>
      <hr />
      {newsData.map((item) => (
        <div key={item.id}>
          <div className={styles.newsItem}>
            <div className={styles.newsItemTitle}>
              <h3>{item.title}</h3>
              <h5>{item.subtitle}</h5>
              <h6>{item.date}</h6>
            </div>
            <div className={styles.newsItemBody}>
              {item.contentBlocks.map((block, index) =>
                block.type === "paragraph" ? (
                  <div className={styles.newsItemContent} key={`${item.id}-p-${index}`}>
                    <h5>{block.text}</h5>
                  </div>
                ) : (
                  <div className={styles.newsItemImage} key={`${item.id}-i-${index}`}>
                    <h6 className={styles.newsImageDescription}>{block.description}</h6>
                    <img className={styles.newsImage} alt={block.description} src={block.src} />
                  </div>
                ),
              )}
            </div>
          </div>
          <hr />
        </div>
      ))}
    </main>
  );
}