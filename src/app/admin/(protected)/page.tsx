import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Home 편집" };

// Placeholder until the Figma-based Home UI exists (new phase 4: Home Public UI + editing).
// Then this page renders the shared Home presentation components with editing controls.
export default function AdminHomePage() {
  return (
    <main className={styles.page}>
      <p className={styles.notice}>Home 편집 화면은 Home Public UI 구현과 함께 제공됩니다.</p>
    </main>
  );
}
