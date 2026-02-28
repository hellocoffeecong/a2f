import newsData from "./data/news.json";
import membersData from "./data/members.json";

function getLatestNewsItems(items, count = 3) {
  return [...items]
    .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
    .slice(0, count);
}

function getFirstParagraph(blocks = []) {
  const paragraph = blocks.find((block) => block.type === "paragraph");
  return paragraph ? paragraph.text : "";
}

function getFirstImage(blocks = []) {
  const image = blocks.find((block) => block.type === "image" && block.src);
  return image || null;
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

export default function Home() {
  const latestNews = getLatestNewsItems(newsData, 3);
  const facultyMembers = membersData.faculty || [];
  const studentMembers = membersData.students || [];

  return (
    <main>
      <nav className="home-sub-nav">
        <ul>
          <li><a href="#about">about</a></li>
          <li><a href="#news">news</a></li>
          <li><a href="#contact">contact</a></li>
          <li><a href="#members">members</a></li>
        </ul>
      </nav>
      <section className="hero">
        <h1>
          <span className="hero-title-strong">A</span>
          <span className="hero-title-muted">ccess </span>
          <span className="hero-title-strong">To F</span>
          <span className="hero-title-muted">lux</span>
        </h1>
      </section>

      <section className="hero-news">
        <h2>Dummy, Hanyang University Completion of 'RUSE Linkage and Collaboration Program Demo Day'</h2>
        <hr/>
        <div className='hero-news-image'></div>
      </section>

     
      <section className="hero-description" id="about">
        <h3>We study design activity through the cognitive structures of thinking that shape designers' processes of problem recognition, interpretation, and judgement, and develop this perspective in our research on design thinking.</h3>
        
      </section>
      <section className="hero-description-sub">
        <div className="left">
        <article className="hero-description-sub-en">
          <h4>We focus on UX/BX design as an integrated experience of cognition, sensation, and emotion, exploring the cognitive and experiential mechanisms of experience in digital environments.</h4>
        </article>
        <article className="hero-description-sub-en">
          <h4>We further engage with generative AI as a co-thinking tool that supports designers' judgement and thinking tool that supports designers' judgement and thinking investigation AI-mediated design thinking and human-AI co-thinking design medels.</h4>
        </article>
        </div>
        <div className="right">
        <article className="hero-description-sub-ko">
          <h6>A2F 디자인랩은 디자인 활동의 본질을 디자이너의 문제 인식, 해석, 판단 과정에서 작동하는 인지적 차원의 사고 구조를 바라보고 이를 근원적인 연구 주제로 삼아 디자인 씽킹에 대해 연구합니다. 디자인을 기술 중심의 결과물이 아닌 사고의 실현 과정으로 이해하며, 변화하는 디지털 환경 속에서 디자인 사고,경험,전략의 질적 깊이를 모색하고자 합니다. <br>
          </br>인지,감각,정서가 결합된 경험으로서의 UX/BX 디자인을 중심으로 디지털 환경에서 경험 전략을 위한 인지적,경험적 메커니즘을 탐구합니다.<br>
          </br>또한 생성형 AI를 디자이너의 판단과 사고를 확장,조율하는 공동 사고 도구로 접근하여, 인공지능 매개 디자인 사고 연구와 UX/BX 디자인에서의 인간-AI 공동 사고 및 디자인 모델에 대한 연구를 수행합니다.</h6>
        </article>
        </div>

      </section>
      <hr/>
      <section className="contact" id="contact">
        <div className="right"><h2>Contact</h2></div>
        <div className="left">
          <article className="contact-item">
            <h3>Talk</h3>
            <h6>82)55-320-3412</h6>
            <h6>ryou@inje.ac.kr</h6>
          </article>
          <article className="contact-item">
            <h3>Address</h3>
            <h6>경상남도 김해시 인제로 197 신어관 C동 519호</h6>
            <h6>Rm 519, Bldg C, Sinmyeong Building, 197, Inje-ro, Gimhae-si, Gyeongsangnam-do, Korea</h6>
          </article>
        </div>
      </section>
      <hr/>
      <section className="news-summary-list" id="news">
        <h2>Check out The news from A2F.</h2>
        <ul>
          {latestNews.map((item) => {
            const firstImage = getFirstImage(item.contentBlocks);

            return (
              <li key={item.id}>
                {firstImage ? (
                  <img
                    className="news-summary-item-image"
                    src={firstImage.src}
                    alt={firstImage.description || item.title}
                  />
                ) : (
                  <div className="news-summary-item-image news-summary-item-image-placeholder"></div>
                )}
                <div className="news-summary-item-content">
                  <h3>{item.title}</h3>
                  <h5>{item.subtitle}</h5>
                  <h6>{item.date}</h6>
                </div>
                <hr/>
              </li>
            );
          })}
        </ul>
      </section>
      <hr/>
      <section className="members" id="members">
        <h2>Faculty</h2>
        {facultyMembers.map((member) => (
          <div className="member-list" key={`faculty-${member.id}`}>
            {(() => {
              const educationList = normalizeList(member.education ?? member.Education ?? member.educations);
              const experienceList = normalizeList(member.experience ?? member.Experience ?? member.experiences);
              const researchList = normalizeList(member.research ?? member.Research ?? member.researches);

              return (
                <>
            <div className="member-item">
              {member.image ? (
                <img className="member-item-image member-item-image-real" src={member.image} alt={member.name} />
              ) : (
                <div className="member-item-image member-item-image-placeholder"></div>
              )}
              <div className="member-item-name">
                <h3>{member.name}</h3>
                <h6>{member.englishName}</h6>
              </div>
            </div>
            {member.quote ? (
              <div className="faculty-quote">
                <h3>{`"${member.quote}"`}</h3>
              </div>
            ) : null}
            <div className="profile-info">
              <h5>Education</h5>
              <ul>
                {educationList.map((item, index) => (
                  <li key={`${member.id}-edu-${index}`}>{item}</li>
                ))}
                {educationList.length === 0 ? <li>No education data</li> : null}
              </ul>
              <h5>Experience</h5>
              <ul>
                {experienceList.map((item, index) => (
                  <li key={`${member.id}-exp-${index}`}>{item}</li>
                ))}
                {experienceList.length === 0 ? <li>No experience data</li> : null}
              </ul>
              <h5>Research</h5>
              <ul>
                {researchList.map((item, index) => (
                  <li key={`${member.id}-res-${index}`}>{item}</li>
                ))}
                {researchList.length === 0 ? <li>No research data</li> : null}
              </ul>
            </div>
                </>
              );
            })()}
          </div>
        ))}
        <hr/>
        <h2>Student</h2>
        {studentMembers.map((member) => (
          <div className="member-list" key={`student-${member.id}`}>
            <div className="member-item">
              {member.image ? (
                <img className="member-item-image member-item-image-real" src={member.image} alt={member.name} />
              ) : (
                <div className="member-item-image member-item-image-placeholder"></div>
              )}
              <div className="member-item-name">
                <h3>{member.name}</h3>
                <h6>{member.englishName}</h6>
              </div>
            </div>
            <div className="profile-info">
              <h5>Research</h5>
              <ul>
                {(member.research || []).map((item, index) => (
                  <li key={`${member.id}-stu-res-${index}`}>{item}</li>
                ))}
              </ul>
              <h5>Award</h5>
              <ul>
                {(member.award || []).map((item, index) => (
                  <li key={`${member.id}-stu-awd-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
