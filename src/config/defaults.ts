import type { DataKey } from "@/config/storage";
import type { DocumentContent } from "@/lib/validation/content";

// Initial content for each Blob document, used only when the document does not exist yet
// (see lib/blob/initialize). Home and settings start from the Figma design copy; list data
// and the professor profile start empty and are filled through the admin (or the one-time
// content migration). Do not put live production content here.

export const DEFAULT_CONTENT: { [K in DataKey]: DocumentContent<K> } = {
  home: {
    data: {
      introduction: {
        paragraphs: [
          "We focus on UX/BX design as an integrated experience of cognition, sensation, and emotion, exploring the cognitive and experiential mechanisms of experience in digital environments.",
          "We further engage with generative AI as a co-thinking tool that supports designers’ judgment and thinking, investigating AI-mediated design thinking and human–AI co-thinking design models.",
        ],
      },
      why: {
        statementLead: "We study",
        statement:
          "design activity through the cognitive structures of thinking that shape designers’ processes of problem recognition, interpretation, and judgment, and develop this perspective in our research on design thinking.",
        description:
          "A2F 디자인랩은 디자인 활동의 본질을 디자이너의 문제 인식, 해석, 판단 과정에서 작동하는 인지적 차원의 사고 구조로 바라보고 디자인을 기술 중심의 결과물이 아닌 사고의 실현 과정으로 이해, 변화하는 디지털 환경 속에서 디자인 사고·경험·전략에 대해 모색하고자 합니다.",
      },
      // Six fixed slots. Icons are mapped in code by id.
      researchFields: [
        {
          id: "field-01",
          title: "Cognitive Design Activity",
          subtitle: "디자인 활동의 인지적 과정 연구",
          description:
            "디자이너가 문제를 인식하고 아이디어를 발전시키며 해결안을 도출하는 과정에서 나타나는 인지적 메커니즘을 탐구한다.",
          order: 1,
        },
        {
          id: "field-02",
          title: "Design Thinking",
          subtitle: "디자인 씽킹 연구",
          description:
            "사용자 중심의 문제 해결 방법으로서 디자인 씽킹의 원리를 활용하여 다양한 산업 및 조직 맥락에서의 적용을 탐색한다.",
          order: 2,
        },
        {
          id: "field-03",
          title: "Integrated Brand Experience Design",
          subtitle: "통합적 브랜드 경험 디자인 연구",
          description: "다양한 접점에서 브랜드의 일관되고 통합된 경험을 제공할 수 있는 디자인 전략을 연구한다.",
          order: 3,
        },
        {
          id: "field-04",
          title: "Experience Strategy in Digital Contexts",
          subtitle: "디지털 환경에서의 경험 전략 연구",
          description: "디지털 컨텐츠 분야에서 사용자 경험을 설계하고 최적화하는 방법론을 연구한다.",
          order: 4,
        },
        {
          id: "field-05",
          title: "Service Design for User Experience",
          subtitle: "사용자 경험 개선을 위한 서비스 디자인 연구",
          description:
            "사용자 및 이해관계자의 니즈를 토대로 서비스 생태계를 유기적으로 설계, 새로운 가치를 창출하는 인간 중심적 방법론을 연구한다.",
          order: 5,
        },
        {
          id: "field-06",
          title: "Human–AI Co-thinking in Design",
          subtitle: "디자인에서의 인간–AI 공동 사고 연구",
          description:
            "인간과 AI가 상호 보완적으로 사고하며 협업하는 방식을 탐구하고, AI 시대에 적합한 새로운 디자인 프로세스를 제안한다.",
          order: 6,
        },
      ],
      // Photos are uploaded through the admin (Figma mockup photos are placeholders, not seeded).
      visuals: {
        main: [null, null, null],
        secondary: [null, null],
      },
    },
  },

  settings: {
    data: {
      contact: {
        // The A2F logo glyph before "Lab" is decoration rendered by the UI.
        // Figma spells "Gyeonsangnam-do"; seeded with the standard romanization.
        addressLines: ["Lab, C522, Inje University,", "197 Inje-ro, Gimhae-si, Gyeongsangnam-do,", "South Korea"],
        phone: "+82. 055. 320. 3412",
        email: "ryou@inje.ac.kr",
      },
      footerLines: ["2026 A2F Design Lab,", "Department of Multimedia Design,", "Inje University"],
    },
  },

  professor: {
    data: {
      name: "Anyoung Ryou",
      nameKo: "",
      title: "",
      department: "",
      addressLines: [],
      phone: "",
      email: "",
      education: [],
      experience: [],
      research: [],
      projects: [],
      images: [],
    },
  },

  awards: { items: [] },
  projects: { items: [] },
  members: { items: [] },
};
