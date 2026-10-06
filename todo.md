# A2F Lab 웹사이트 — 작업 현황 / TODO

> 마지막 업데이트: 2026-10-06
> 기준 문서: [CLAUDE.md](CLAUDE.md) (§7A 확정 결정사항, §7B CSS, §7C Admin in-context editing, §31 단계 순서, §39 현재 상태), [HOME_ANIMATION_GUIDE.md](HOME_ANIMATION_GUIDE.md)

---

## ▶ 다시 시작할 때 (인계 — 2026-10-06 기준)

### 현재 상태 한 줄 요약
**개발(Step 1~8) 완료. 데모 확인용 계정(hellocoffeecong / Vercel "Soo's projects")으로 이전해 배포 중.** 의뢰자 계정 정보를 받으면 Step 9로 한 번 더 이전한다(지시가 있을 때만).

| 구분 | 현재 (데모 확인용, 사용 중) | 예전 (개발용, 보관) |
|---|---|---|
| GitHub | `hellocoffeecong/a2f` = git remote **`origin`** | `swhwang81/a2f` = remote `swhwang81` (`36ba43d`까지) |
| Vercel | 팀 `coffeecong` ("Soo's projects", Hobby), 프로젝트 `a2f` | 팀 swhwang81s-projects — **Paused** (아래 참고) |
| 주소 | https://a2f-delta.vercel.app | https://a2f-beryl.vercel.app (402) |
| Blob | `a2f-dev-blob`(Public) / `a2f-dev-private`(Private, prefix `AUTH_BLOB`) — 새 팀 | 같은 이름의 예전 저장소 |
| 로컬 폴더 | `vercel link` → coffeecong / a2f | — |

- 코드: `origin/main` 최신 `547e6bf` (Blob 최적화 + 충돌 시 캐시 갱신 포함)
- 데이터(새 저장소): home v1 = 기본 문구 + 콜라주 사진 5장(예전 저장소에서 복사한 **Figma 목업 임시 이미지**), 나머지(awards / projects / members / professor / settings)는 아직 저장 전 → 코드 기본값으로 표시(Figma 교수 프로필, 빈 목록)
- 관리자 계정: 새 private 저장소에 생성 완료(사용자가 `npm run admin:bootstrap`)
- Env(새 프로젝트): `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`(업로드에 필수), `AUTH_BLOB_STORE_ID`, `SESSION_SECRET`(Prod·Preview = Secret, Development = Config 다른 값). **미설정**: `NOTION_PUBLICATION_URL`, `NEXT_PUBLIC_SITE_URL` → Publication 메뉴 비활성, 모든 페이지 noindex

### 왜 계정을 옮겼나 — Blob 한도 (중요)
- 2026-10-06 09:49 KST, 예전 Hobby 팀이 **Blob Advanced Operations 3.9K / 2K** 초과로 Paused(자동 해제 2026-11-05). 원인: QA 자동화·반복 빌드에서 `list()`/`put()` 대량 사용
- 대응(`36ba43d`): Admin 읽기도 캐시 사용 → **화면 열기 0회, 저장 1회 ≈ 4회, 이미지 1장 1회, 세션 확인 10분에 1회, Public 0회** (CLAUDE.md §25-6)
- `547e6bf`: 스크립트로 쓴 데이터 때문에 Admin 캐시가 오래된 경우, 충돌이 나면 캐시를 갱신 → 새로고침하면 최신이 보임
- **새 팀도 Hobby → 월 2,000회.** 대량 E2E·반복 빌드 금지, 데모 데이터 대량 입력은 나눠서, Vercel Usage에서 사용량 확인

### 세션 시작 전 확인
1. `gh auth status` → 활성 계정이 **hellocoffeecong**인지 (다른 작업으로 바꿨다면 `gh auth switch -u hellocoffeecong`)
2. `npx vercel whoami` → hellocoffeecong 계정(팀 coffeecong)인지 (아니면 `npx vercel login`)
3. 로컬 env 갱신(OIDC 토큰 약 12시간 만료): `npx vercel env pull .env.local --yes`
   - **다른 계정/프로젝트로 다시 연결(`vercel link`)한 뒤에는 `.env.local`을 지우고 받을 것** — pull은 기존 파일에 합쳐서 예전 계정 값이 남는다(2026-10-06 bootstrap 실패 원인)
   - `AUTH_BLOB_WEBHOOK_PUBLIC_KEY`가 생기면 지워도 됨(미사용)
4. `/mcp`에서 `figma · connected` 확인
5. 시작 프롬프트 예: "todo.md와 CLAUDE.md를 읽고 현재 상태를 파악한 뒤, 지금 할 수 있는 일을 보고하고 멈춰."

### 다음 할 일 (사용자 지시가 있을 때만)
1. **사용자 직접 확인 (a2f-delta)** — Admin 로그인/로그아웃, 저장→공개 반영, 이미지 변경, `/admin/account` 변경, 동시 편집 충돌 / 실제 Safari·iPhone·iPad
2. **데모 데이터 입력·검수** — 의뢰자 데모 데이터를 사용자가 Admin에서 직접 입력, Claude는 화면 검수·버그 수정. 데이터를 임의로 넣거나 지우지 않는다. Blob 한도에 유의
3. **도메인 / Notion 주소 수령 후** — `NEXT_PUBLIC_SITE_URL`, `NOTION_PUBLICATION_URL` 설정 → 재배포 → 색인·sitemap·robots·`/publication`·GNB 확인 (CLAUDE.md §34)
4. **Step 9 의뢰자 계정 이전** — 의뢰자 GitHub / Vercel 정보를 받은 뒤에만. 2026-10-06의 이전 과정이 리허설:
   GitHub push → Vercel import → Public Blob(prefix `BLOB`) + Private Blob(prefix `AUTH_BLOB`, 모든 환경) 연결 → `SESSION_SECRET`(Secret: Prod·Preview / Config: Development, 다른 값) → Redeploy → 로컬 `vercel login` · `vercel link` · `.env.local` 삭제 후 `env pull` · `npm run admin:bootstrap` → 필요한 데이터만 복사(공개 URL로 읽어 새 저장소에 새 파일명으로 put + `saveDocument`, 배포/재배포 후 확인). 상세: [docs/MIGRATION.md](docs/MIGRATION.md)

### 작업 규칙 요약 (자세한 것은 CLAUDE.md)
- 보고는 한국어. 단계마다 분석 → 계획 보고 → 승인 → 구현 → 검증 → 보고 → 멈춤
- Claude는 로그인 정보·`SESSION_SECRET` 값을 요청하거나 출력·변경하지 않는다
- 테스트 데이터는 `[..-qa]`처럼 표시해서 새 버전으로 넣고, 끝나면 **새 빈 버전으로 정리**(버전 삭제·재사용 금지, CLAUDE.md §25-8)
- 스크립트로 쓴 데이터는 캐시를 갱신하지 않는다 → 재배포하거나 Admin에서 한 번 저장(충돌 후 새로고침)하면 반영. 로컬 빌드 검증 시 `.next/cache` 삭제
- 로컬과 배포 사이트는 같은 Blob 저장소를 쓴다 → 임시 데이터가 있는 동안 배포 Admin에서 저장 금지

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
- [x] 저장소 read-write 토큰 Revoke 확인 (2026-10-05, OIDC만 사용)
- 참고: `VERCEL_OIDC_TOKEN`은 약 12시간 후 만료 → 로컬 인증 오류 시 `npx vercel env pull .env.local --yes` 다시 실행

### 2. 커밋 ✅ (2026-10-04)
- [x] Phase 1·2 + 문서 + `.mcp.json` 커밋 `1be8245` → `main` push → Vercel 재배포 Ready (Next 16.3.8)
- [x] Blob store `a2f-dev-blob`의 read-write 토큰 Revoke 확인 (2026-10-05, 이미 Revoke 상태)
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

### 새 단계 6. Project List / Detail Public UI + 편집 — 승인 (2026-10-05)
- [x] 목록: 행 정렬 Grid(Masonry 아님), 위치별 Figma 이미지 높이 패턴 + cover crop, 카테고리·연도(All 기본) 필터, URL 동기화(뒤로/앞으로), 9개 + 9개씩 추가, Scroll to top(1920+)
- [x] ani2 hover: 약 235ms 간격 crossfade, 마우스·1440+·hover 가능·reduced motion 아님에서만
- [x] 상세: 원본 비율, 멤버 최대 1명(role 추가), 커스텀 태그 1개, 404
- [x] Admin `/admin/project`(추가·수정·삭제), `/admin/project/[id]`(요약·본문·이미지 순서/삭제·멤버 패널·삭제)
- [x] 기존 `(public)/project/*`, `data/project.json` 삭제 / 검증용 [6-test] 데이터 → 새 빈 버전(projects v128)
- [x] 공통 refactor 후 Award / Home Award 회귀 테스트 (임시 [7r-test] 데이터 → 새 빈 버전 awards v30)
- [x] `news`, `education`, `publication` legacy 페이지 정리 (Legacy Cleanup 단계, 2026-10-05)
- [x] 커밋 & push

### 새 단계 7. Team Public UI + 편집 — 승인 (2026-10-05)
- [x] Public `/team`: 상단 소개(teamIntro 문구 + 사진), 교수(이름·부제 조합·연락처·사진 최대 3장·4개 영역), Student / Alumni (1 / 2 / 3 / 3열) — 365/768/1440/1920 Figma 비교
- [x] 교수 사진: 약 3초 자동 회전(crossfade), 표시기 클릭 즉시 선택, hover·키보드 포커스 시 일시정지, reduced motion이면 정지. 1장이면 표시기 없음, 0장이면 사진 영역 생략
- [x] `professor.json`에 `teamIntro { text, image? }` 추가 (이전 버전은 Figma 문구로 읽힘). 연락처는 교수 자체 필드 (settings와 공유 안 함)
- [x] dev store의 초기(빈) 교수 프로필 → Figma 실제 프로필 내용으로 새 버전 저장 (§31 콘텐츠 이관)
- [x] Admin `/admin/team`: 소개 문구·사진, 이름/소속, 연락처(패널), 사진(패널, 최대 3장, 자동 회전 꺼짐), 4개 영역 `StringListEditor`(추가·수정·삭제·↑↓), Student/Alumni 추가·수정·삭제(확인)·↑↓ (order 재정렬)
- [x] 빈 목록: Public은 섹션 숨김, Admin은 "등록된 구성원이 없습니다" + [추가]
- [x] 검증용 데이터 → 새 버전으로 정리 (professor v35 = Figma 프로필·사진 없음, members v15 = 빈 목록)
- [x] legacy `data/members.json`, `templates/members.template.json` 삭제
- [ ] 실제 교수 사진·소개 사진·구성원 등록 (Admin에서, 운영자)
- [x] 남은 legacy `(public)/data/*.json`(news, education, publication) 삭제 (Legacy Cleanup 단계)
- [x] 커밋 & push

### Legacy Cleanup + Production Preparation — 승인 (2026-10-05)
- [x] `/news`, `/education`, `/publication` 페이지와 `(public)/data/` 전체 삭제 → `/news`·`/education` 404
- [x] `/publication`: `NOTION_PUBLICATION_URL`이 있으면 307 redirect (next.config, 빌드 시점), 없으면 404. GNB는 그대로 (없으면 비활성, 있으면 새 탭)
- [x] `globals.css` legacy `main` 규칙과 각 페이지의 `max-width: none` 덮어쓰기 제거
- [x] 로그인/계정 폼 365 가로 넘침 수정 (`box-sizing: border-box`)
- [x] `AUTH_BLOB_WEBHOOK_PUBLIC_KEY` 삭제 (Production·Preview·Development). 계정 읽기, private 저장, 세션 epoch, 로그인 실패 경로 확인
- [x] Blob store read-write 토큰: 운영자 확인 (2026-10-05) — a2f-dev-blob, a2f-dev-private 모두 legacy 토큰 이미 Revoke 상태("Restore Read-Write Token" 표시). Restore/Rotate/Delete 하지 않음, OIDC 유지
- [x] `getSiteUrl()` + metadataBase / sitemap / robots (최종 도메인 env가 있을 때만 색인)
- [ ] 최종 도메인 확정 시 `NEXT_PUBLIC_SITE_URL` 설정 → 재배포

### 새 단계 8. 최종 QA — 승인 (2026-10-05)
- [x] 로컬 production 빌드 + 임시 [8-qa] 데이터로 Public/Admin/반응형/애니메이션/접근성/SEO 회귀 → 새 버전으로 정리
- [x] QA 중 수정: 저장 직후 가짜 충돌, 인라인 편집 후 focus 복귀, `<html lang="ko">`, 미사용 `public/` 파일 삭제
- [x] ani1: hover 가능 + fine pointer에서만 실행. 1440+ 터치/coarse 기기는 날짜 항상 표시, 탭 한 번으로 상세 이동
- 외부 입력 대기: 최종 도메인, NOTION_PUBLICATION_URL, Award/Project/Student/Alumni 데이터, 교수 사진, Team 소개 사진, Home 콜라주 최종 이미지
- 운영자 확인: Production Admin (Blob read-write 토큰은 확인 완료)

### (이전 계획) 새 단계 8. Responsive / Animation / QA / 배포
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
- [ ] `A2F_Lab_Development_Guide.md`도 확정사항에 맞게 수정할지 (현재는 CLAUDE.md §7A가 우선)
- [ ] Step 9: 의뢰자 GitHub로 커밋 기록을 유지해 옮길지(repo transfer) / 새 repo에 push할지
- (해결) ffmpeg — 애니메이션은 설치 없이 분석·구현 완료

## ⚠️ 알아둘 것
- Legacy 페이지·JSON은 모두 삭제됨 (`/news`, `/education`은 404, `/publication`은 env 있을 때 Notion으로 redirect)
- 미사용 헬퍼 `ensureDocument()`(lib/blob/initialize), `createId()`(lib/utils/id)는 Step 9 빈 저장소 초기화용으로 남겨 둠
- `npm audit`: 개발 의존성(eslint 계열)에 high 5건, 배포 런타임(`--omit=dev`)은 0건 — `audit fix --force`는 하지 않음
- 전역 npm 캐시 권한 문제 → `sudo chown -R 501:20 ~/.npm` (미해결이면 `npx --cache /tmp/npm-cache-a2f ...`로 우회)
- SVG 4개(1440/1920/768 Home, 768 Hamburger)는 로컬 렌더러로 안 열림 → Figma나 PDF로 확인
- 애니메이션 확인 조건: 브라우저 폭 1440 이상 + 마우스 + reduced motion 꺼짐 (외부 모니터 1288 폭에서는 태블릿 레이아웃이라 ani1/ani2가 꺼짐 → ⌘− 로 축소해서 확인)

## 📦 커밋 상태 (모두 push 완료, `main`; 2026-10-06부터 `origin` = hellocoffeecong/a2f)
- `1be8245` Phase 1·2 / `74e96b5` Phase 3 / `cc7dab5` Phase 4 + 계정 Private store
- `07c67ed` Step 2 Header/Footer / `d416948` Step 3 이미지 업로드
- `16dde2e` Step 4a Home / `5342284` Step 4b 애니메이션
- `6daf31c` Step 5 Award Detail / `88c6b34` Step 6 Project
- `eb16c3a` Step 7 Team / `42f0a88` Legacy cleanup + metadata·sitemap·robots
- `3f43146` Step 8 최종 QA 수정
- `36ba43d` Blob advanced operation 최적화 (예전 저장소 `swhwang81`의 마지막 커밋)
- `547e6bf` 충돌 시 캐시 갱신 — 여기부터 `origin` = hellocoffeecong/a2f
