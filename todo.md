# A2F Lab 웹사이트 — 작업 현황 / TODO

> 마지막 업데이트: 2026-10-04
> 기준 문서: [CLAUDE.md](CLAUDE.md) (§7A 확정 결정사항, §7B CSS, §7C Admin in-context editing, §31 단계 순서, §39 현재 상태), [HOME_ANIMATION_GUIDE.md](HOME_ANIMATION_GUIDE.md)

---

## 내일 시작할 때

1. Claude Code 새 세션을 열고 `/mcp`에서 `figma · connected`인지 확인
2. 아래 프롬프트로 시작:
   > todo.md와 CLAUDE.md를 읽고 현재 상태를 파악해줘. 그다음 "다음 할 일"의 1번부터 진행 계획을 보고하고 멈춰.
3. **아직 커밋 안 됨** — 아래 "커밋 대기" 참고. 작업 전에 커밋할지 먼저 결정

---

## ✅ 완료한 것

### 분석 / 문서
- [x] 개발 지시서(`A2F_Lab_Development_Guide.md`) 분석
- [x] 의뢰자 SVG 22개, 개발 설명 PDF, all-size PDF 확인 → `references/`로 이동
- [x] §77 첫 번째 작업: 23개 항목 분석 보고서
- [x] `CLAUDE.md` 정리
  - 참조 파일 경로 (`references/dev_guide_svg/`, `references/animation/`)
  - 참조 우선순위: Figma MCP → SVG → 해당 MP4 → 개발 PDF → CLAUDE.md
  - **§7A 확정 결정사항** (디자인 토큰, 내비, Home, Project, Award Detail, 데이터)
  - §39 현재 상태
- [x] `HOME_ANIMATION_GUIDE.md`에 MP4 역할 확정 반영 (ani3만 Home)

### Phase 1 — 구조 / 기반 (완료)
- [x] `app/` → `src/app/` 이동 (내용 변경 없음)
- [x] TypeScript 설정 (`tsconfig.json`, `allowJs`로 기존 JS 유지), `jsconfig.json` 제거
- [x] ESLint 9 flat config (`eslint.config.mjs`)
- [x] npm scripts: `lint`, `typecheck`, `blob:test` (`hash-password`는 이후 `admin:bootstrap`으로 대체)
- [x] `src/config/` — 카테고리, 학위 목록 2종, 제한값, Blob 경로, 업로드 규칙(10MB)
- [x] `src/lib/validation/` — Zod 스키마 6종 (home, awards, projects, professor, members, settings)
- [x] `src/types/content.ts` — 스키마에서 타입 추출
- [x] `src/lib/blob/` — `readDocument` / `saveDocument` (version + ETag `ifMatch`), 이미지 경로 생성/삭제
- [x] `src/services/` — home, awards, projects, team (Next 캐시 태그)
- [x] `src/lib/auth/` — scrypt 비밀번호 해시, HMAC 서명 세션 쿠키, `requireAdmin()`
- [x] `.env.example`, `.gitignore` (`references/`, `.tmp/`, `!.env.example`)

### Phase 2 — Blob 연결 준비 (부분 완료)
- [x] Next.js 16.1.6 → **16.3.8** 보안 업데이트 (런타임 취약점 0, breaking change 없음)
- [x] Blob OIDC 지원 확인 (서버 `put/get/del` + `handleUploadPresigned`)
- [x] ETag `ifMatch` 공식 지원 확인 (`@vercel/blob` 2.8)
- [x] 연결 테스트 스크립트 `scripts/blob-connection-test.mjs` (`npm run blob:test`)
- [ ] **실제 Blob 연결 테스트** ← 자격 증명 없음 (아래 1번)

### Figma MCP (완료)
- [x] `.mcp.json`으로 Figma 원격 MCP 연결 (계정 swhwang, Dev seat)
- [x] SVG 임시 측정값 검증 → 레이아웃 대부분 일치, 정정 3건, 신규 발견 8건
- [x] 미결 사항 11건 확정 → CLAUDE.md §7A에 기록
- [x] Figma 노드 ID 맵 확보 (CLAUDE.md §2 / 메모리)

### 검증 상태 (마지막 실행)
| 항목 | 결과 |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run build` | ✅ (Next 16.3.8) |
| 신규 코드 lint | ✅ 0 / 0 |
| 전체 `npm run lint` | ❌ 기존 Public 페이지 13건 (교체 예정이라 그대로 둠) |

---

## ⏭️ 다음 할 일 (순서대로)

### 1. Phase 2 마무리 — Vercel Blob 실연결 ✅ (2026-10-04)
- [x] GitHub repo `swhwang81/a2f` (public) → Vercel 프로젝트 `a2f` 연결, 첫 배포 완료
- [x] Blob store `a2f-dev-blob` 생성 (Public, Seoul icn1, OIDC) → `a2f`에 Development/Preview/Production 연결
- [x] `npx vercel link`, `npx vercel env pull .env.local` → `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`, `VERCEL_OIDC_TOKEN`
- [x] `npm run blob:test` 6단계 모두 통과 (OIDC)
- [x] 최초 생성 충돌(일반 `BlobError`) → `saveDocument`에서 재조회 후 conflict 처리
- [ ] 다음 push로 재배포된 뒤 Vercel 대시보드에서 저장소 read-write 토큰 **Revoke** (OIDC만 사용)
- 참고: `VERCEL_OIDC_TOKEN`은 약 12시간 후 만료 → 로컬 인증 오류 시 `npx vercel env pull .env.local --yes` 다시 실행

### 2. 커밋 ✅ (2026-10-04)
- [x] Phase 1·2 + 문서 + `.mcp.json` 커밋 `1be8245` → `main` push → Vercel 재배포 Ready (Next 16.3.8)
- [ ] Blob store `a2f-dev-blob`의 read-write 토큰 **Revoke** (재배포 완료됐으므로 지금 가능)
- 참고: 이 Mac의 `gh` 활성 계정은 `swhwang81` (다른 프로젝트에서 `hellocoffeecong` 필요 시 `gh auth switch -u hellocoffeecong`)
- 빌드 로그 경고 (배포에는 영향 없음): `engines` 범위 지정 안내, ESLint 9 지원 종료 안내 → `eslint-config-next`가 ESLint 10을 지원하면 업그레이드 검토

### 3. Phase 3 — JSON 스키마 / 타입 마무리 ✅ (2026-10-04, `74e96b5`)
- [x] 스키마 최종 점검 (Figma 기준). 교수 `address` → `addressLines[]`
- [x] 초기 문서 `src/config/defaults.ts` (Home·settings = Figma 문구, 나머지 빈 값), `ensureDocument()`
- [x] ID 생성 `src/lib/utils/id.ts`
- [x] **저장 방식 변경**: Public Blob CDN이 덮어쓴 URL의 예전 내용을 계속 반환 → JSON을 버전별 새 파일(`data/<key>/v000001.json`)로 저장
  - 최신 = 파일 번호 최대값 (list), 저장 = `allowOverwrite:false`로 새 버전 생성, 최근 10개 보관, 롤백 = 과거 내용을 새 버전으로 저장
  - dev Blob 실검증: 즉시 반영 ✅ / 동시 저장 5건 중 1건만 성공 ✅ / 보관 10개 ✅ / 롤백 ✅ / Next 캐시 무효화 ✅
- [x] `docs/DATA_MODEL.md`, `blob:test` 재작성
- 참고: 저장 1회 약 2.4초 (오래된 버전 삭제 시 약 4.2초). 편집 기능 구현 시 Server Action의 `after()`로 삭제를 응답 뒤로 미루는 것 검토

### 4. Phase 4 — 관리자 인증 ✅ (2026-10-04, `cc7dab5`)
- [x] Public/Admin 레이아웃 분리: root layout = html/body/폰트/토큰/globals, 기존 Public 페이지 → `src/app/(public)/` (URL·내용 그대로)
- [x] `src/proxy.ts`: `/admin/*` 1차 게이트(쿠키 유무만) + `X-Robots-Tag: noindex`
- [x] `/admin/login` + `LoginForm`, 로그인/로그아웃 Server Action (`src/app/admin/actions.ts`)
- [x] `(protected)/layout.tsx`에서 `requireAdmin()` (서명·만료 검증) + `AdminBar`
- [x] `next` 리다이렉트는 내부 `/admin` 경로만 허용 / 로그인 실패 약 1초 지연 + 구분 없는 메시지
- [x] `SESSION_SECRET` Vercel 설정 (Production·Preview = Secret, Development = Config, 환경별 다른 값) + `vercel env pull`
- [x] production 서버 검증 32/32 통과 (AdminBar 구조 변경 후 재검증 29/29)
- [x] 공용 A2F 디자인 시스템 시작: `styles/tokens.css`, `styles/typography.css`, 폰트(Hanken = next/font, Pretendard = CDN), `Logo`(Figma 에셋), `Button`, `form/Field`
- [x] **관리자 계정 관리 방식 변경**: 환경변수(`ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`) 폐기 → **Private Blob store**의 `data/admin-auth/` (최신 1개 버전)
  - `npm run admin:bootstrap`(최초 1회, `-- --reset`으로 재설정), `/admin/account`에서 관리자가 직접 아이디·비밀번호 변경
  - 세션에 `sessionEpoch` 포함 → 계정 변경 시 모든 세션 즉시 무효 (기존 "복사된 토큰 8시간 유효" 한계 해결)
  - `versioned-store` 공통 팩토리(콘텐츠/계정 공용), `server-only` 빌드 가드 확인, `tsx` 추가
- [x] Private Blob store `a2f-dev-private` 생성·연결 (`AUTH_BLOB_STORE_ID`)
- [x] Private store 검증: 익명 접근 403, Public store에 admin-auth 없음, 평문 비밀번호 없음, 최신 1개 버전만 보관
- [x] 임시 계정으로 bootstrap → production 검증 24/24 (로그인, 현재 비밀번호 확인, 아이디만 변경, 비밀번호 변경, 기존·복사 세션 즉시 무효화, 로그아웃) → **테스트 계정 삭제, store 비움**
- [x] 운영 관리자 계정 생성 (`npm run admin:bootstrap`, 2026-10-04)

  **Private store 생성 (Vercel → a2f 프로젝트 → Storage → Create Database → Blob)**
  | 항목 | 값 |
  |---|---|
  | Store Name | `a2f-dev-private` |
  | Region | Seoul (icn1) |
  | Access | **Private** (기본값 그대로) |
  | Custom Environment Variable Prefix | **`AUTH_BLOB`** (기본 `BLOB`에서 반드시 변경) |
  | Add a read-write token | 체크하지 않음 |
  → 생성 후 Connections의 `a2f` 행 ⋮ → 환경에 **Development** 추가 (Production·Preview·Development 모두)
  → Settings → Environment Variables에 `AUTH_BLOB_STORE_ID`가 생겼는지 확인
- [x] 커밋 & push (`cc7dab5`)
- 참고: 로그아웃은 해당 브라우저 쿠키만 지운다. 모든 세션을 끊으려면 `/admin/account`에서 계정 정보를 변경(epoch 갱신)하거나 `SESSION_SECRET` 교체

---

> **2026-10-04 방향 변경**: 관리자는 별도 CMS 대시보드가 아니라 **실제 Public 화면 위에서 수정하는 in-context editing** (CLAUDE.md §7C).
> Phase 순서도 **페이지 단위로 "Public UI → 같은 컴포넌트에 편집 기능"**으로 변경 (CLAUDE.md §31).
> Public UI가 없는 페이지에 임시 관리자 화면을 만들지 않는다.

### 새 단계 1. 인증 정리 + AdminBar 구조 ✅ (2026-10-04, `cc7dab5`)
- [x] 대시보드, AdminNav, `config/admin.ts`, AdminShell 삭제
- [x] `AdminBar` (편집 모드 표시 · 사이트에서 보기 · 로그아웃) + `src/lib/admin-paths.ts` (`/` ↔ `/admin` 경로 대응)
- [x] `/admin`은 Home 단계 전까지 안내 문구만 표시
- [x] CLAUDE.md §7C(in-context editing 원칙), §22, §30~32, §39 / todo.md 반영

### 새 단계 2. 공통 Header / Footer Public UI ✅ (2026-10-04, 커밋 전)
- [x] Figma 분석: GNB(1440·1920 데스크톱, 365·768 햄버거 패널), Footer 4종
- [x] `globals.css`에서 기존 nav·footer 규칙 제거, `NavLinks.js` 삭제 (`.hero` 등 페이지 스타일은 각 페이지 교체 시점에)
- [x] Header / GNB (sticky, 현재 페이지 SemiBold #008C2A), Hamburger 패널(0.25초 slide/fade), Footer(`footerLines`) — 4개 크기 Figma 비교 완료
- [x] Admin: 같은 GNB(`basePath="/admin"`), AdminBar 아래 sticky, Footer 문구 in-context 편집 — E2E 14/14
- [x] 편집 도구 첫 구현: `Editable`, `InlineTextEditor` (+ Server Action: `requireAdmin` → 검증 → `saveDocument` → `refreshContent`)
- [ ] Publication Notion URL 확정 시 Vercel에 `NOTION_PUBLICATION_URL` 설정 (지금은 메뉴 비활성 표시)
- [ ] 커밋 & push

### 새 단계 3. 이미지 업로드 기반 ✅ (2026-10-04, 커밋 전)
- [x] prepare(서버가 경로 생성·검증) → `uploadPresigned` 직접 업로드(`/api/admin/upload`, 세션 확인, 경로 하나·형식·10MB·덮어쓰기 금지·5분) → finalize(존재·크기·형식·이미지 시그니처, 실패 시 삭제)
- [x] 편집 도구: `useImageUpload`, `ImageReplace`, `ImageListEditor`(추가·↑↓·drag & drop·삭제 확인), `ConfirmDialog`
- [x] 이미지 삭제를 버전 보관과 연동: 남은 모든 버전에서 참조하지 않을 때만 삭제 (롤백 안전), 문서별 kind 폴더 강제
- [x] 고아 파일 정리 `npm run images:cleanup` (24시간 기준, 기본 미리보기)
- [x] dev Blob 실검증: UI 23/23, HTTP 보안 15/15, 보관 연동 삭제·고아 정리 11/11 → 임시 테스트 페이지 삭제, 저장소 이미지 0개
- 알게 된 점: 버전 번호는 절대 재사용하지 않는다 (전체 버전 삭제 후 v1부터 다시 만들면 CDN 캐시 때문에 예전 내용이 보임 → CLAUDE.md §25-8)
- [ ] 커밋 & push

### 새 단계 4. Home Public UI + Home 편집
**4a (정적 UI + 편집)** — 승인 (2026-10-04)
- [x] Main Visual(정적), Introduction, Why A2F, Research Fields(6개 고정, 아이콘 코드 고정), Award & Activity(필터·페이지네이션·크기별 카드 수), 하단 연락처 — 365/768/1440/1920 Figma 비교
- [x] `home.json`에 `visuals` (main 3칸, secondary 2칸) 추가, 콜라주 사진 5장은 Admin 이미지 변경으로 업로드 (Figma 목업 = 임시 콘텐츠). 검은 블록 2개는 고정 장식
- [x] Admin `/admin`: 문단·Why·Research Field·연락처 인라인 편집, 사진 교체, Award 추가/수정/삭제(`EditPanel`, `ListControls`, 삭제 확인)
- [x] 기존 `(public)/page.js`와 전역 Home 스타일 삭제
- [x] 768에도 Contact 표시 (Figma 768 누락으로 판단)
- [x] 검증용 Award 샘플 삭제 → awards.json 빈 목록 (새 버전으로 저장)
- [x] Award 카드 링크 비활성 (`AWARD_DETAIL_AVAILABLE`, Step 5에서 켬)
- [x] 커밋 & push

**4b (애니메이션)** — 승인 (2026-10-04). Admin Home은 ani3 끔(항상 최종 배치), ani1은 유지
- [x] ani1 Award hover/focus (1440/1920): 흰 글자+초록 박스 wipe 0.4s ease-out, 마지막 0.1s에 ■·날짜 등장, mouse-out 0.2s 역방향. reduced motion = 즉시 상태 변경
- [x] ani3 Home scroll (CSS scroll-driven, JS 없음): 1920 시작 -185px + 아래 블록 일부만 보임 → 750px 스크롤 동안 최종 배치로, 1440 -110px/500px, 768 -60px/350px(이동만), 365·reduced motion·미지원 브라우저 = 정적 최종 배치
- [ ] 커밋 & push

### 새 단계 5. Award Detail Public UI + 편집 — 승인 (2026-10-04)
- [x] Public `/award/[id]` (Figma 4개 크기, 원본 비율 이미지, People 최대 4명, 최소 간격 1920 300 / 1440 160 / 768·365 60), 404, `/award` → `/#award`
- [x] Admin `/admin/award/[id]`: 제목·구분·라벨·날짜 / 본문 / 이미지(추가·삭제·순서) 제자리 편집, People `EditPanel`, 삭제 확인 → `/admin#award`
- [x] 상세 페이지 검증 후 `AWARD_DETAIL_AVAILABLE = true` (Home 카드 링크 활성)
- [x] 검증용 [5-test] 항목 → 새 빈 버전으로 정리 (awards v23)
- [x] 커밋 & push, production 확인

### 새 단계 6. Project List / Detail Public UI + 편집
- [ ] 목록: 행 정렬(Masonry 아님), 이미지 cover crop, 카테고리·연도 필터, 9개씩 추가 로딩, Scroll to top
- [ ] 상세: 원본 비율 유지
- [ ] Admin `/admin/project`, `/admin/project/[id]`: 카드 추가/삭제/정렬, 상세 `EditPanel`, 이미지 순서
- [ ] 기존 `(public)/project/*`, `news`, `education`, `publication` 페이지 정리 (Publication은 Notion 링크)

### 새 단계 7. Team Public UI + 편집
- [ ] 교수(영역별 string[], 사진 최대 3장 3초 회전), Student / Alumni (순서 변경)
- [ ] Admin `/admin/team`
- [ ] 기존 `(public)/data/*.json` 삭제 (모든 데이터 이전 후) → 전체 lint 오류 해소

### 새 단계 8. Responsive / Animation / QA / 배포
- [ ] **ffmpeg 설치 여부 결정** → ani1(Award hover, 0:2757) / ani2(Project hover, 0:2875) / ani3(Home scroll, 0:2642) 각각 분석 → 계획 보고
- [ ] 애니메이션 라이브러리 필요 여부 결정 (분석 후)
- [ ] 365 / 768 / 1440 / 1920 반응형 QA (Public + Admin)
- [ ] Vercel 프로덕션 배포 (내 계정에서 먼저 검증)

### 새 단계 9. 의뢰자 계정으로 이전 (개발 완료 후)
> 개발·검증은 **내 GitHub(`swhwang81/a2f`) + 내 Vercel**에서 진행하고, 완료 후 의뢰자 GitHub/Vercel로 옮겨 새로 연결한다.
> **상세 절차: [docs/MIGRATION.md](docs/MIGRATION.md)** — 이전 스크립트 `scripts/blob-migrate.mjs` (`npm run blob:export` / `blob:import`) 준비 완료
- [ ] 의뢰자 GitHub로 소스 이전 (repo transfer 또는 새 repo에 push — 커밋 히스토리 유지 여부 결정)
- [ ] 의뢰자 Vercel에 프로젝트 생성 + 의뢰자 Blob store(Public) 생성·연결
- [ ] 의뢰자 Private Blob store 생성(prefix `AUTH_BLOB`) + `npm run admin:bootstrap`으로 의뢰자 관리자 계정 생성
- [ ] 의뢰자 Vercel 환경변수 새로 설정: `SESSION_SECRET`(새 값), `NOTION_PUBLICATION_URL`, `NEXT_PUBLIC_SITE_URL`(의뢰자 도메인)
- [ ] **Blob 데이터 이전**: 내 store의 `data/*.json`과 `images/**`를 의뢰자 store로 복사
  - JSON 안의 이미지 URL은 store 호스트가 바뀌므로 **URL 재작성 필요** (`pathname`은 그대로라 이것을 기준으로 재작성)
  - 이전 스크립트를 만들어 한 번에 처리 (복사 → URL 재작성 → 검증)
- [ ] 의뢰자 환경에서 `npm run blob:test`, 관리자 로그인, CRUD, 이미지 업로드 재검증
- [ ] 커스텀 도메인 연결 (의뢰자 소유 시)
- [ ] 내 계정의 Vercel 프로젝트 / Blob store 정리 (이전 검증 끝난 뒤)
- [ ] `.mcp.json`의 Figma는 개인 계정 인증이므로 의뢰자 쪽 개발자가 각자 연결

---

## ❓ 아직 결정 안 된 것
- [ ] ffmpeg 설치 (애니메이션 단계 전)
- [ ] `A2F_Lab_Development_Guide.md`도 확정사항에 맞게 수정할지 (현재는 CLAUDE.md §7A가 우선)

## ⚠️ 알아둘 것
- 기존 Public 페이지(`src/app/(public)/*.js`)는 **레거시** — UI 단계 전까지 수정하지 않음
- 운영 JSON이 아직 git에 있음 (`src/app/(public)/data/`) — Phase 11에서 제거
- dev 의존성(`eslint-config-next`)에 high 취약점 5건 남음 (배포 런타임과 무관)
- 전역 npm 캐시 권한 문제 → `sudo chown -R 501:20 ~/.npm` 실행하면 해결 (아직 미해결이면 `npx --cache /tmp/npm-cache-a2f ...`로 우회)
- SVG 4개(1440/1920/768 Home, 768 Hamburger)는 로컬 렌더러로 안 열림 → Figma나 PDF로 확인

## 📦 커밋 상태
- `1be8245` Phase 1·2 + 문서 (push 완료)
- `74e96b5` Phase 3 + 버전 파일 저장 방식 (push 완료)
- `cc7dab5` Phase 4 + 관리자 계정 Private store + AdminBar 구조 + 디자인 시스템 시작 (push 완료, 배포 Ready: https://a2f-beryl.vercel.app)
