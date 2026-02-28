"use client";

import { useState } from "react";
import educationData from "../data/education.json";
import styles from "./page.module.css";

export default function Education() {
  const [activeIndex, setActiveIndex] = useState(0);
  const educationListItems = [
    {
      key: "concept-ideation",
      titleKo: "컨셉과 아이데이션",
      titleEn: "concept & Ideation",
      summary: "concept & Ideation summary",
    },
    {
      key: "design-thinking-workshop",
      titleKo: "디자인씽킹 워크샵",
      titleEn: "Design Thinking Workshop",
      summary: "문제 해결을 위한 혁신적 사고, 다지인 씽킹 워크샵, 본 강의는 사용자 중심의 공감부터 프로토타입 제작, 테스트까지의 전 과정을 직접 경헙하는 실습 중심 수업입니다. 팀원들과 협업하여 창의적 아이디어를 구체화하고, 반복적인 실험을 통해 실질적인 솔루션을 완성해 봅니다.",
    },
    {
      key: "bx-design-basics",
      titleKo: "BX디자인 기초",
      titleEn: "BX Design Basics",
      summary: "BX Design Basics summary",
    },
    {
      key: "ui-design-guide",
      titleKo: "UI디자인 가이드",
      titleEn: "UI Design Guide",
      summary: "UI Design Guide summary",
    },
    {
      key: "bx-media",
      titleKo: "BX와 미디어",
      titleEn: "BX & Media",
      summary: "BX & Media summary",
    },
    {
      key: "dc-graduation-exhibition",
      titleKo: "DC 졸업전시회",
      titleEn: "DC Graduation Exhibition",
      summary: "DC Graduation Exhibition summary",
    },
  ];

  const activeCategory = educationListItems[activeIndex]?.key;
  const filteredProjects = educationData.filter((item) => item.category === activeCategory);

  return (
    <main>
      <div className={styles.layout}>
      <ul className={styles.educationList}>
        {educationListItems.map((item, index) => (
          <li
            key={item.titleKo}
            className={`${styles.educationItem} ${activeIndex === index ? styles.active : ""}`}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
            tabIndex={0}
          >
            <h2>{item.titleKo}</h2>
            <h5>{item.titleEn}</h5>
            <h6>{item.summary}</h6>
          </li>
        ))}
      </ul>
     
      
      <ul className={styles.educationProjectsList}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((item) => (
            <li key={item.id} className={styles.projectItem}>
              <div className={styles.projectMeta}>
                <h5>{item.title}</h5>
                <h6>{item.author}</h6>
              </div>
              <img className={styles.projectImage} src={item.image} alt={item.title} />
            </li>
          ))
        ) : (
          <li>
            <p>선택한 항목에 해당하는 프로젝트가 없습니다.</p>
          </li>
        )}
      </ul>
      </div>
    </main>
  );
}