# A2F Lab 웹사이트 — 작업 현황 / TODO

> 마지막 업데이트: 2026-10-03
> 기준 문서: [CLAUDE.md](CLAUDE.md) (§7A 확정 결정사항, §39 현재 상태), [HOME_ANIMATION_GUIDE.md](HOME_ANIMATION_GUIDE.md)

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
- [x] npm scripts: `lint`, `typecheck`, `hash-password`, `blob:test`
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

### 3. Phase 3 — JSON 스키마 / 타입 마무리 ✅ (2026-10-04, 커밋 전)
- [x] 스키마 최종 점검 (Figma 기준). 교수 `address` → `addressLines[]`
- [x] 초기 문서 `src/config/defaults.ts` (Home·settings = Figma 문구, 나머지 빈 값), `ensureDocument()`
- [x] ID 생성 `src/lib/utils/id.ts`
- [x] **저장 방식 변경**: Public Blob CDN이 덮어쓴 URL의 예전 내용을 계속 반환 → JSON을 버전별 새 파일(`data/<key>/v000001.json`)로 저장
  - 최신 = 파일 번호 최대값 (list), 저장 = `allowOverwrite:false`로 새 버전 생성, 최근 10개 보관, 롤백 = 과거 내용을 새 버전으로 저장
  - dev Blob 실검증: 즉시 반영 ✅ / 동시 저장 5건 중 1건만 성공 ✅ / 보관 10개 ✅ / 롤백 ✅ / Next 캐시 무효화 ✅
- [x] `docs/DATA_MODEL.md` (필드·제한값·더미 샘플)
- [x] `blob:test`를 새 방식 기준으로 재작성
- [ ] 커밋 & push
- 참고: 저장 1회 약 2.4초 (오래된 버전 삭제 시 약 4.2초) — Blob API 지연. 관리자 화면에서는 Server Action의 `after()`로 삭제를 응답 뒤로 미루는 것 검토 (Phase 5)

### 4. Phase 4 — 관리자 인증
- [ ] `npm run hash-password -- '<비밀번호>'` → `ADMIN_PASSWORD_HASH` 생성
- [ ] `ADMIN_USERNAME`, `SESSION_SECRET` 설정 (로컬 `.env.local` + Vercel)
- [ ] `/admin/login` 페이지, 로그인/로그아웃 Server Action
- [ ] `proxy.ts`로 `/admin/*` 리다이렉트 + 모든 admin layout/action에서 `requireAdmin()`

### 5. Phase 5~9 — 관리자 CRUD (각각 승인 후 진행)
- [ ] Phase 5: Home 관리 (소개 문단, Why A2F, Research Field 6개)
- [ ] Phase 6: Award 관리 (label, 이미지 복수, People 최대 4명)
- [ ] Phase 7: Project 관리 (category, customTag 1개, member 직접 입력 1명)
- [ ] Phase 8: Professor 관리 (영역별 `string[]` 추가/삭제/순서)
- [ ] Phase 9: Student / Alumni 관리 (순서 변경)
- [ ] `settings.json` 관리 (연락처, footer)

### 6. Phase 10 — 이미지 업로드 / 삭제 / 순서
- [ ] `handleUploadPresigned` + `uploadPresigned` (OIDC 지원 방식)
- [ ] `BLOB_WEBHOOK_PUBLIC_KEY` 요구사항 확인
- [ ] 업로드 시 이미지 width/height 저장 (원본 비율 보존)
- [ ] JSON 저장 성공 후에만 Blob 이미지 삭제
- [ ] 이미지 순서: 위/아래 버튼 + 기본 drag & drop (라이브러리 없이)

### 7. Phase 11 — Public 데이터 연결
- [ ] 기존 `src/app/data/*.json`의 **텍스트** 내용을 새 스키마로 변환해 Blob(`a2f-dev-blob`)으로 이전
- [ ] **이미지는 다시 업로드해야 함**: 기존 JSON의 이미지는 삭제된 예전 store(`twtzambetzsy1e8g`)를 가리켜 모두 404 (2026-10-04 확인). 원본 이미지 파일을 확보해 관리자 화면(Phase 10 업로드) 또는 일괄 업로드 스크립트로 `images/**`에 올린다
- [ ] 원본 이미지 파일 확보 (의뢰자 또는 내 로컬 보관본)
- [ ] 이전 완료 후 repo에서 운영 JSON 삭제
- 참고: 현재 배포된 기존 사이트도 같은 이유로 이미지가 깨져 있음 (새 UI로 교체 예정이라 수정하지 않음)
- [x] `next.config`에 Blob 이미지 도메인(`*.public.blob.vercel-storage.com`) 추가 — 계정 무관

### 8. Phase 12~16 — Figma 기반 UI (페이지별: 1440 → 1920 → 768 → 365)
- [ ] 스타일 기반 구성 (CLAUDE.md §7B): `src/styles/tokens.css`, `typography.css`, 필요 시 `utilities.css`
- [ ] `globals.css`를 reset·기본값·폰트만 남기도록 정리 (기존 `.hero` 등 페이지 스타일 제거 — 기존 페이지 교체 시점에)
- [ ] 폰트 로드 (Hanken Grotesk, Pretendard)
- [ ] 각 UI 작업 후 CSS 보고 (새/수정 CSS Module, 토큰, inline style 잔존 `grep -rn 'style={' src`)
- [ ] Header / Navigation / Footer (활성 상태, 햄버거 패널)
- [ ] Home (Award 페이지네이션, 크기별 페이지당 카드 수)
- [ ] Award Detail (space-between + 최소 300 세로 간격)
- [ ] Project List (행 정렬, cover crop, 9개씩 추가 로딩, Scroll to top)
- [ ] Project Detail (원본 비율 유지)
- [ ] Team (교수 이미지 3초 회전)
- [ ] 기존 Public 페이지 교체 → 전체 lint 오류 해소
- [ ] 아직 노드 상세를 안 본 프레임: Project Detail, Team

### 9. Phase 17 — 인터랙션 / 애니메이션
- [ ] **ffmpeg 설치 여부 결정** (프레임 추출에 필요)
- [ ] ani1 (Award hover, 0:2757) 분석 → 계획 보고
- [ ] ani2 (Project image hover, 0:2875) 분석 → 계획 보고
- [ ] ani3 (Home scroll, 0:2642) 분석 → 계획 보고
- [ ] 애니메이션 라이브러리 필요 여부 결정 (GSAP / Framer Motion은 분석 후)

### 10. Phase 18~19 — QA / 배포
- [ ] 365 / 768 / 1440 / 1920 반응형 QA
- [ ] 관리자 기능 QA
- [ ] Vercel 프로덕션 배포 (내 계정에서 먼저 검증)

### 11. 의뢰자 계정으로 이전 (개발 완료 후)
> 개발·검증은 **내 GitHub(`swhwang81/a2f`) + 내 Vercel**에서 진행하고, 완료 후 의뢰자 GitHub/Vercel로 옮겨 새로 연결한다.
> **상세 절차: [docs/MIGRATION.md](docs/MIGRATION.md)** — 이전 스크립트 `scripts/blob-migrate.mjs` (`npm run blob:export` / `blob:import`) 준비 완료
- [ ] 의뢰자 GitHub로 소스 이전 (repo transfer 또는 새 repo에 push — 커밋 히스토리 유지 여부 결정)
- [ ] 의뢰자 Vercel에 프로젝트 생성 + 의뢰자 Blob store(Public) 생성·연결
- [ ] 의뢰자 Vercel 환경변수 새로 설정: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`(의뢰자 비밀번호로 새로 생성), `SESSION_SECRET`(새 값), `NOTION_PUBLICATION_URL`, `NEXT_PUBLIC_SITE_URL`(의뢰자 도메인)
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
- 기존 Public 페이지(`src/app/*.js`)는 **레거시** — UI 단계 전까지 수정하지 않음
- 운영 JSON이 아직 git에 있음 (`src/app/data/`) — Phase 11에서 제거
- dev 의존성(`eslint-config-next`)에 high 취약점 5건 남음 (배포 런타임과 무관)
- 전역 npm 캐시 권한 문제 → `sudo chown -R 501:20 ~/.npm` 실행하면 해결 (아직 미해결이면 `npx --cache /tmp/npm-cache-a2f ...`로 우회)
- SVG 4개(1440/1920/768 Home, 768 Hamburger)는 로컬 렌더러로 안 열림 → Figma나 PDF로 확인

## 📦 커밋 대기 중인 변경
- `app/` → `src/app/` 이동 (staged)
- `jsconfig.json` 삭제 (staged)
- 수정: `.gitignore`, `package.json`, `package-lock.json`
- 신규: `.env.example`, `.mcp.json`, `CLAUDE.md`, `HOME_ANIMATION_GUIDE.md`, `A2F_Lab_Development_Guide.md`, `eslint.config.mjs`, `tsconfig.json`, `scripts/`, `src/config/`, `src/lib/`, `src/services/`, `src/types/`, `todo.md`
