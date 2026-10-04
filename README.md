# A2F Design Lab Website

인제대학교 A2F Design Lab 공식 웹사이트. Next.js (App Router) + TypeScript, Vercel 배포, 콘텐츠와 이미지는 Vercel Blob에 저장한다 (별도 DB 없음).

- 개발 규칙과 확정된 디자인 결정: [CLAUDE.md](CLAUDE.md)
- 진행 현황과 다음 할 일: [todo.md](todo.md)
- 다른 GitHub / Vercel 계정으로 이전: [docs/MIGRATION.md](docs/MIGRATION.md)

## 로컬 개발 환경

필요: Node.js 22.9 이상 (권장 24), Vercel 계정, 이 저장소에 연결된 Vercel 프로젝트 + Blob store(Public).

```bash
npm install
npx vercel login
npx vercel link            # 이 폴더를 Vercel 프로젝트에 연결 (.vercel/, gitignore)
npx vercel env pull .env.local --yes
npm run blob:test          # Blob 읽기/쓰기 연결 확인
npm run dev
```

`.env.local`의 `VERCEL_OIDC_TOKEN`은 약 12시간 후 만료된다. 인증 오류가 나면 `vercel env pull`을 다시 실행한다.

## 환경변수

전체 목록은 [.env.example](.env.example) 참고. 실제 값은 Vercel 프로젝트 설정에만 둔다.

| 변수 | 설명 |
|---|---|
| `VERCEL_OIDC_TOKEN`, `BLOB_STORE_ID` | Blob 인증 (OIDC). Blob store 연결 시 자동 생성 |
| `BLOB_WEBHOOK_PUBLIC_KEY` | 브라우저 이미지 업로드 콜백 검증. 자동 생성 |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` | 관리자 로그인. 해시는 `npm run hash-password -- '<비밀번호>'` |
| `SESSION_SECRET` | 관리자 세션 서명 키 (32자 이상) |
| `NOTION_PUBLICATION_URL` | Publication 메뉴가 여는 Notion 페이지 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 대표 URL |

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` / `build` / `start` | 개발 서버 / 빌드 / 실행 |
| `npm run lint` / `typecheck` | ESLint / TypeScript 검사 |
| `npm run hash-password -- '<pw>'` | `ADMIN_PASSWORD_HASH` 생성 |
| `npm run blob:test` | Blob 연결 테스트 (임시 파일만 사용 후 삭제) |
| `npm run blob:export` / `blob:import` | Blob store 이전 ([docs/MIGRATION.md](docs/MIGRATION.md)) |

## 구조

```text
src/
├── app/          # 라우트 (현재 기존 Public 페이지 — UI 단계에서 교체 예정)
├── config/       # 카테고리·학위·제한값, Blob 경로, 업로드 규칙
├── lib/
│   ├── auth/     # 비밀번호 해시, 세션 쿠키, requireAdmin
│   ├── blob/     # JSON 읽기/저장(버전 충돌 처리), 이미지 경로/삭제
│   └── validation/ # Zod 스키마
├── services/     # 페이지가 사용하는 데이터 조회 (캐시 태그)
└── types/        # 스키마에서 추출한 타입
scripts/          # hash-password, blob 연결 테스트, blob 이전
```

운영 데이터(JSON)와 이미지는 저장소가 아닌 Vercel Blob에 있다.
