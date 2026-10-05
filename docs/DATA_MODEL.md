# 데이터 모델

사이트 콘텐츠는 Vercel Blob에 JSON으로 저장한다. 별도 DB는 없다.
스키마의 원본은 코드다 — 이 문서와 코드가 다르면 **코드가 기준**이다.

| 무엇 | 파일 |
|---|---|
| 스키마 (Zod) | [src/lib/validation/content.ts](../src/lib/validation/content.ts), [common.ts](../src/lib/validation/common.ts) |
| 타입 | [src/types/content.ts](../src/types/content.ts) (스키마에서 추출) |
| 고정 목록·제한값 | [src/config/content.ts](../src/config/content.ts) |
| 저장 경로·보관 개수 | [src/config/storage.ts](../src/config/storage.ts) |
| 초기 문서 | [src/config/defaults.ts](../src/config/defaults.ts) |
| 읽기/저장/롤백 | [src/lib/blob/json-store.ts](../src/lib/blob/json-store.ts) |

> 아래 샘플 값은 모두 **더미**다. 실제 운영 데이터는 저장소에 두지 않는다.

---

## 1. 저장 방식

```text
data/<key>/v000001.json
data/<key>/v000002.json   ← 저장할 때마다 새 파일 (덮어쓰지 않음)
...
images/<kind>/<entityId>/<uuid>.<ext>
```

- `<key>`: `home`, `awards`, `projects`, `professor`, `members`, `settings`
- **최신 버전** = 파일명 번호가 가장 큰 파일
- 저장 = 다음 번호 파일을 "새로 만들기만 허용"으로 생성 → 동시에 저장하면 한 명만 성공, 나머지는 충돌 메시지
- 최근 **10개** 버전만 보관, 그 이전은 자동 삭제 — 보관된 버전으로 **롤백** 가능 (과거 내용을 새 버전으로 저장)
- 덮어쓰지 않는 이유: Public Blob의 CDN이 같은 URL의 예전 내용을 계속 반환함 (CLAUDE.md §24)

### 공통 포맷

목록형 (`awards`, `projects`, `members`):
```json
{ "version": 3, "updatedAt": "2026-10-04T05:30:00.000Z", "items": [ ... ] }
```

단일 객체 (`home`, `professor`, `settings`):
```json
{ "version": 3, "updatedAt": "2026-10-04T05:30:00.000Z", "data": { ... } }
```

`version`, `updatedAt`은 저장 시 자동으로 설정된다. 관리자 입력에 포함하지 않는다.

### 공통 타입

| 타입 | 형식 |
|---|---|
| `id` | 영문 소문자·숫자·하이픈. 새 항목은 `createId()`가 생성 (예: `award-k3f9x2ab`) |
| 날짜 | `YYYY-MM-DD` |
| 타임스탬프 | ISO 8601 (`createdAt`, `updatedAt`) |
| `ImageRef` | `{ url, pathname, width, height, alt }` — `pathname`은 store 이전 시 URL 재작성 기준, `width`/`height`는 원본 크기 |

```json
{
  "url": "https://<store>.public.blob.vercel-storage.com/images/awards/award-k3f9x2ab/1b2c….webp",
  "pathname": "images/awards/award-k3f9x2ab/1b2c….webp",
  "width": 1600,
  "height": 1200,
  "alt": "시상식 사진"
}
```

---

## 2. home (단일 객체)

관리자가 수정: 소개 문단, Why A2F 문구, Research Field 6개의 제목/소제목/설명, 콜라주 사진 5칸.
코드 고정: 로고, 메인 문구("Approach 2 Flux, Access 2 Frame"), 내비게이션, Research Field 아이콘, 장식 요소(초록 그라데이션·하늘색 블록·검은 블록 2개), 사진 칸의 위치.

| 필드 | 타입 | 규칙 |
|---|---|---|
| `introduction.paragraphs` | string[] | 각 항목 필수 |
| `why.statementLead` | string | 초록색 강조 부분 (예: "We study") |
| `why.statement` | string | 이어지는 영문 문장 |
| `why.description` | string | 한글 설명 |
| `researchFields` | object[] | **정확히 6개** (추가/삭제 불가) |
| `researchFields[].id` | id | `field-01` ~ `field-06` 고정 — 아이콘 연결 키 |
| `researchFields[].title` | string | 영문 제목, 필수 |
| `researchFields[].subtitle` | string | 한글 소제목 |
| `researchFields[].description` | string | 한글 설명 |
| `researchFields[].order` | number | 표시 순서 |
| `visuals.main` | (ImageRef \| null)[] | **정확히 3칸**. 0 왼쪽 가로 사진, 1 가운데, 2 오른쪽 세로 사진 — [src/config/home.ts](../src/config/home.ts) |
| `visuals.secondary` | (ImageRef \| null)[] | **정확히 2칸**. 0 왼쪽 세로 사진, 1 오른쪽 사진 (Research Fields와 Award 사이) |

- 빈 칸은 `null` (자리는 유지, 연한 회색 배경). 이미지는 `images/home/` 아래만 허용.
- `visuals`가 없는 예전 버전은 읽을 때 빈 칸으로 채워진다 (롤백 가능).
- Step 4a 중 저장된 5칸 `main`(앞 2칸 = 지금은 장식인 검은 블록)은 읽을 때 뒤 3칸만 사용한다.

```json
{
  "version": 1,
  "updatedAt": "2026-10-04T05:00:00.000Z",
  "data": {
    "introduction": { "paragraphs": ["First paragraph.", "Second paragraph."] },
    "why": { "statementLead": "We study", "statement": "design activity ...", "description": "한글 설명" },
    "researchFields": [
      { "id": "field-01", "title": "Field Title", "subtitle": "한글 소제목", "description": "설명", "order": 1 }
    ],
    "visuals": {
      "main": [{ "url": "https://…/images/home/main-0/….png", "pathname": "images/home/main-0/….png", "width": 640, "height": 1050, "alt": "" }, null, null],
      "secondary": [null, null]
    }
  }
}
```
(실제로는 `researchFields` 6개 필요)

---

## 3. awards (목록)

Home의 Award & Activity 목록과 `/award/[id]` 상세에 사용. 별도 목록 페이지는 없다 (`/award` → `/#award`).

| 필드 | 타입 | 규칙 |
|---|---|---|
| `id` | id | |
| `type` | `"AWARD"` \| `"ACTIVITY"` | |
| `title` | string | 행사/프로젝트명, 필수 |
| `label` | string | 수상명·활동명 (예: "Excellence Prize", "Academic Conference"), 필수 |
| `date` | 날짜 | 정렬 기준 (최신순) |
| `body` | string | 본문 |
| `images` | ImageRef[] | 여러 장, 순서 유지 |
| `people` | object[] | **최대 4명** |
| `people[].name` | string | 필수 |
| `people[].degree` | Award 학위 | `N/A`, `Associate`, `Bachelor`, `Master`, `Doctor`, `Honorary Doctorate`, `Microdegree`, `Professor` |
| `people[].role` | string | 자유 입력 (예: "Designer") |
| `people[].profileImage` | ImageRef | 선택 |
| `createdAt`, `updatedAt` | 타임스탬프 | |

```json
{
  "id": "award-k3f9x2ab",
  "type": "AWARD",
  "title": "Sample Youth Talent Project",
  "label": "Excellence Prize",
  "date": "2026-03-12",
  "body": "본문 내용",
  "images": [],
  "people": [{ "name": "Hong Gildong", "degree": "Master", "role": "Designer" }],
  "createdAt": "2026-10-04T05:00:00.000Z",
  "updatedAt": "2026-10-04T05:00:00.000Z"
}
```

---

## 4. projects (목록)

| 필드 | 타입 | 규칙 |
|---|---|---|
| `id` | id | |
| `title` | string | 필수 |
| `date` | 날짜 | 연도 필터는 이 값에서 자동 생성 |
| `body` | string | |
| `category` | `"UX/UI"` \| `"BX/BI"` \| `"Planning"` \| `"Graphic"` \| `"ETC"` | 1개 ("All"은 필터 옵션일 뿐 저장값 아님) |
| `customTag` | string | 자유 입력 **1개** (배열 아님) |
| `member` | object \| null | **최대 1명**, 직접 입력 (Team 데이터와 연결 안 함) |
| `member.name` | string | 필수 |
| `member.degree` | Award 학위 | Award와 같은 목록 (`N/A`는 화면에 표시 안 함) |
| `member.role` | string | 선택 (예: Designer). Step 6에서 추가 — 이전 버전은 `""`로 읽힘 |
| `member.profileImage` | ImageRef | 선택 |
| `images` | ImageRef[] | `images[0]` = 대표 이미지. 순서 = 표시 순서 |
| `createdAt`, `updatedAt` | 타임스탬프 | |

```json
{
  "id": "project-p8d2m1qz",
  "title": "Sample Project",
  "date": "2026-03-12",
  "body": "프로젝트 설명",
  "category": "UX/UI",
  "customTag": "AI agent app",
  "member": { "name": "Hong Gildong", "degree": "Master", "role": "Designer" },
  "images": [],
  "createdAt": "2026-10-04T05:00:00.000Z",
  "updatedAt": "2026-10-04T05:00:00.000Z"
}
```

---

## 5. professor (단일 객체)

Team 페이지 전용 정보(상단 소개)도 여기에 둔다. 연락처는 `settings.contact`와 공유하지 않는다.

| 필드 | 타입 | 규칙 |
|---|---|---|
| `teamIntro.text` | string | Team 상단 소개 문구. 줄바꿈 그대로 표시. Step 7 이전 버전은 Figma 문구로 읽힘 |
| `teamIntro.image` | ImageRef? | 소개 사진 1장 (없으면 공개 화면에서 생략) |
| `name` | string | 영문 이름, 필수 (화면에서 앞에 "Prof." 고정 표시) |
| `nameKo` | string | 한글 이름 |
| `title` | string | 직함 (예: "교수") |
| `department` | string | 소속. 부제는 `nameKo + " " + title + ", " + department`로 조합 (문장 전체를 저장하지 않음) |
| `addressLines` | string[] | 주소 줄 단위 |
| `phone` | string | |
| `email` | string | 이메일 형식 또는 빈 값 |
| `education`, `experience`, `research`, `projects` | string[] | 영역별 한 줄씩. 관리자에서 추가/수정/삭제/순서 변경 (서식 없음). 빈 영역은 공개 화면에서 생략 |
| `images` | ImageRef[] | **최대 3장**, 약 3초마다 순환 표시 (reduced motion이면 정지, 표시기 클릭으로 선택) |

```json
{
  "version": 1,
  "updatedAt": "2026-10-04T05:00:00.000Z",
  "data": {
    "teamIntro": { "text": "We are researchers with an approach\nto flux and access to a frame." },
    "name": "Sample Name",
    "nameKo": "홍길동",
    "title": "교수",
    "department": "인제대학교 멀티미디어학과",
    "addressLines": ["Lab, C000, Sample University,", "Sample-ro, Sample-si,", "South Korea"],
    "phone": "+82. 00. 000. 0000",
    "email": "professor@example.com",
    "education": ["(BA) 학부", "(MA) 석사", "(Ph.D) 박사"],
    "experience": ["경력 1"],
    "research": ["연구 1"],
    "projects": ["프로젝트 1"],
    "images": []
  }
}
```

---

## 6. members (목록) — Student / Alumni

| 필드 | 타입 | 규칙 |
|---|---|---|
| `id` | id | |
| `type` | `"STUDENT"` \| `"ALUMNI"` | |
| `degree` | Team 학위 | `N/A`, `AA.`, `BA.`, `MA.`, `Dr.`, `Hon. D.`, `Prof.` (Award 학위와 다른 목록) |
| `name` | string | 필수 |
| `email` | string | 이메일 형식 또는 빈 값 (값이 있을 때만 mailto 링크로 표시) |
| `field` | string | 연구 분야 한 줄 |
| `profileImage` | ImageRef \| null | |
| `order` | number | 같은 type 안에서 표시 순서. 추가/삭제/이동 때마다 type별 0, 1, 2 …로 다시 매김 |
| `createdAt`, `updatedAt` | 타임스탬프 | |

```json
{
  "id": "member-q1w2e3r4",
  "type": "STUDENT",
  "degree": "MA.",
  "name": "Hong Gildong",
  "email": "student@example.com",
  "field": "사용자 행동변화 디자인",
  "profileImage": null,
  "order": 0,
  "createdAt": "2026-10-04T05:00:00.000Z",
  "updatedAt": "2026-10-04T05:00:00.000Z"
}
```

---

## 7. settings (단일 객체)

사이트 공통 설정. Publication 링크는 여기 두지 않고 환경변수 `NOTION_PUBLICATION_URL`을 쓴다.

| 필드 | 타입 | 규칙 |
|---|---|---|
| `contact.addressLines` | string[] | Home 하단 주소 (앞의 A2F 로고는 UI 장식) |
| `contact.phone` | string | |
| `contact.email` | string | 이메일 형식 또는 빈 값 |
| `footerLines` | string[] (1~6) | Footer 문구를 쉼표 뒤에서 나눈 구절. 화면 크기별 조합: 1920 한 줄, 1440·768 첫 구절 + 나머지, 365 구절마다 줄바꿈. 관리자는 한 문장으로 편집 |

```json
{
  "version": 1,
  "updatedAt": "2026-10-04T05:00:00.000Z",
  "data": {
    "contact": { "addressLines": ["Line 1,", "Line 2,", "South Korea"], "phone": "+82. 00. 000. 0000", "email": "lab@example.com" },
    "footerLines": ["2026 Sample Lab,", "Department,", "University"]
  }
}
```

---

## 8. admin-auth (관리자 계정) — **Private store 전용**

공개 콘텐츠와 분리된 **Private Blob store**(`AUTH_BLOB_STORE_ID`)의 `data/admin-auth/vNNNNNN.json`. 최신 1개 버전만 보관.
Public store·Public 서비스·`DataKey`에는 포함되지 않으며 서버 전용 모듈(`src/lib/auth/account-store.ts`)에서만 읽는다.

| 필드 | 타입 | 규칙 |
|---|---|---|
| `username` | string | 영문 소문자·숫자·`. _ -`, 3~32자 |
| `passwordHash` | string | `scrypt:N:r:p:<salt>:<hash>` — 평문 비밀번호는 저장하지 않음 |
| `sessionEpoch` | string | 계정 변경 때마다 새 무작위 값. 세션 토큰의 epoch와 다르면 로그인 무효 |

생성: `npm run admin:bootstrap` (최초 1회) · 변경: `/admin/account` · 분실: `npm run admin:bootstrap -- --reset`
(샘플 값은 싣지 않는다.)

---

## 9. 이미지 업로드 규칙

- 허용: `image/jpeg`, `image/png`, `image/webp`, `image/avif` (확장자와 MIME 일치 필요)
- 크기: 파일당 **10MB** 이하 (관리자·서버 동일)
- 저장 이름: `images/<kind>/<entityId>/<uuid>.<ext>` — 원본 파일명은 쓰지 않음
- 업로드 흐름: prepare(서버가 경로 생성) → 브라우저 직접 업로드 → finalize(파일 존재·크기·형식·이미지 시그니처 검증, 실패 시 삭제)
- 문서는 자기 kind 폴더의 이미지만 참조 가능 (`home` → `images/home/` 등, settings는 이미지 없음)
- 삭제: 콘텐츠에서 빠져도 즉시 지우지 않음. 오래된 버전이 정리될 때, **남아 있는 모든 버전에서 참조하지 않는 이미지만** 삭제 (롤백 안전)
- 고아 파일(저장되지 않은 업로드): `npm run images:cleanup` (24시간 지난 것만, 기본은 미리보기)
