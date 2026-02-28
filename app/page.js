import Image from "next/image";
import newsData from "./data/news.json";

function getLatestNewsItems(items, count = 3) {
  return [...items]
    .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
    .slice(0, count);
}

function getFirstParagraph(blocks = []) {
  const paragraph = blocks.find((block) => block.type === "paragraph");
  return paragraph ? paragraph.text : "";
}

export default function Home() {
  const latestNews = getLatestNewsItems(newsData, 3);

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
          {latestNews.map((item) => (
            <li key={item.id}>
              <div className="news-summary-item-image"></div>
              <div className="news-summary-item-content">
                <h3>{item.title}</h3>
                <h5>{item.subtitle}</h5>
                <h6>{item.date}</h6>
              </div>
              <hr/>
            </li>
          ))}
        </ul>
      </section>
      <hr/>
      <section className="members" id="members">
      <h2>Faculty</h2>
      <div className="member-list">
       <div className="member-item">
        <div className="member-item-image"></div>
        <div className="member-item-name">
        <h3>Name</h3>
        <h6>English Name</h6>
        </div>
        </div>
        <div className="faculty-quote">
        <h3>"I will study hard to make a good design so that I can give people a good experience.</h3>
        </div>
        
        <div className="profile-info">
          <h5>Education</h5>
          <ul>
            <li>(BA)</li>
            <li>(MA)</li>
            <li>(PhD)</li>
          </ul>
          <h5>Experience</h5>
          <ul>
            <li>웅진씽크빅 편집개발본부 전집디자인팀 연구원</li>
            <li>부산디자인센터 동남권디자인 지원사업 평가위원</li>
            <li>Planning Works Studio 디렉터</li>
            <li>(주)The Party 디자인팀장</li>
            <li>인제대학교 멀티미디어학부 부교수</li>
            <li>부산대학교 디자인학과 겸임교수</li>
            <li>(주)D-insight 디자인 실장</li>
            <li>인제대학교 멀티미디어학부장 역임</li>
          </ul>
          <h5>Research</h5>
          <ul>
            <li>디자인 씽킹 연구</li>
            <li>디자인 씽킹 연구</li>
            <li>디자인 씽킹 연구</li>
          </ul>
        </div>
        </div>
        <hr/>
        <h2>Student</h2>
        <div className="member-list">
        <div className="member-item">
        <div className="member-item-image"></div>
        <div className="member-item-name">
        <h3>Name</h3>
        <h6>English Name</h6>
        </div>
        </div>
          <div className="profile-info">
            
          <h5>Research</h5>
          <ul>
            <li>(BA)</li>
            <li>(MA)</li>
            <li>(PhD)</li>
          </ul>
          <h5>Award</h5>
          <ul>
            <li>(BA)</li>
            <li>(MA)</li>
            <li>(PhD)</li>
          </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
