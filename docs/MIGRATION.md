# 의뢰자 계정 이전 가이드

개발·검증은 개발자 계정(GitHub `swhwang81/a2f`, 개발자 Vercel, Blob store `a2f-dev-blob`)에서 진행하고,
완료 후 **의뢰자의 GitHub / Vercel / Blob store**로 옮긴다. 이 문서는 그 절차다.

> 용어: **source** = 개발자 계정(옮기기 전), **target** = 의뢰자 계정(옮긴 후)

---

## 0. 왜 이전이 쉬운가 (구조 요약)

| 항목 | 계정에 묶이는 부분 | 이전 시 할 일 |
|---|---|---|
| 소스 코드 | 없음 (계정·저장소 ID·도메인 하드코딩 없음) | GitHub로 옮기기만 하면 됨 |
| Blob 인증 | 환경변수 (`VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID`) | target에서 Blob store 연결 시 자동 생성 |
| 이미지 도메인 | `next.config.mjs`가 `*.public.blob.vercel-storage.com` 전체 허용 | 없음 |
| 콘텐츠 / 이미지 | Blob store 안에 있음 (store 간 자동 이동 기능 없음) | `scripts/blob-migrate.mjs`로 복사 + URL 재작성 |
| 관리자 계정 | 환경변수 (`ADMIN_*`, `SESSION_SECRET`) | target용으로 **새로 생성** |
| Vercel 프로젝트 연결 | `.vercel/` (gitignore, 로컬 전용) | target 프로젝트로 다시 `vercel link` |
| Figma MCP | 각자 Figma 계정으로 로그인 (`.mcp.json`에는 비밀값 없음) | 의뢰자 측 개발자가 각자 `/mcp`로 인증 |

JSON의 이미지 정보는 `{ url, pathname, ... }`로 저장된다. store가 바뀌면 `url`의 호스트만 바뀌고
`pathname`은 그대로이므로, 이전 스크립트가 pathname 기준으로 파일을 옮기고 URL을 새로 써 준다.

---

## 1. 사전 준비 (이전 전에 확인)

- [ ] source 사이트가 정상 동작하고 QA가 끝났다
- [ ] 이전 기간 동안 **관리자 편집을 중지**하도록 의뢰자와 합의했다 (export 이후 수정분은 옮겨지지 않음)
- [ ] 의뢰자에게서 받을 것:
  - GitHub 계정 또는 Organization 이름
  - Vercel 계정(또는 팀) 접근 권한 — 의뢰자가 직접 작업하거나 개발자를 팀 멤버로 초대
  - 관리자 아이디 / 비밀번호 (비밀번호는 해시만 저장됨)
  - 사용할 도메인 (있으면)
  - Notion Publication 페이지 URL
- [ ] 로컬에서 최신 `main` 기준으로 `npm run lint`, `npm run build` 통과

---

## 2. GitHub 이전

둘 중 하나를 선택한다.

### 방법 A — 저장소 Transfer (권장: 히스토리·이슈 유지, 기존 주소 자동 리다이렉트)
1. GitHub `swhwang81/a2f` → **Settings → General → Danger Zone → Transfer ownership**
2. 새 owner로 의뢰자 계정/Organization 입력 → 의뢰자가 수락
3. 로컬 remote 갱신:
   ```bash
   git remote set-url origin https://github.com/<client>/<repo>.git
   git remote -v
   ```
4. Transfer하면 **기존 Vercel 프로젝트의 Git 연결이 끊긴다** → source Vercel은 이후 자동 배포되지 않음 (정상)

### 방법 B — 의뢰자 새 저장소에 push (히스토리는 유지, 이슈/설정은 이동 안 됨)
1. 의뢰자가 빈 저장소 생성 (README 없이)
2. 로컬에서:
   ```bash
   git remote add client https://github.com/<client>/<repo>.git
   git push client main
   ```
3. 이전 완료 후 `origin`을 의뢰자 저장소로 바꾸고, 개발자 저장소는 보관(Archive) 처리

> 저장소 공개 여부: 운영 데이터와 비밀값은 저장소에 없지만, 의뢰자 정책에 따라 Private 전환 가능.

---

## 3. 의뢰자 Vercel 프로젝트 생성

1. 의뢰자 Vercel → **Add New → Project** → 2번의 저장소 Import
   - Framework: Next.js (자동 인식), 설정 변경 없음
   - 첫 배포는 환경변수가 없어 관리자/데이터 기능이 동작하지 않아도 정상
2. **Storage → Create → Blob**
   | 항목 | 값 |
   |---|---|
   | Store Name | 예: `a2f-blob` |
   | Region | Seoul (icn1) |
   | Access | **Public** (기본값 Private에서 변경할 것) |
   | Env Prefix | `BLOB` 그대로 |
   | read-write token 추가 | 체크하지 않음 (OIDC 사용) |
3. 생성 후 Connections에서 프로젝트 연결 환경에 **Development / Preview / Production 모두** 체크
   (기본은 Production, Preview만 — Development가 없으면 로컬 `vercel env pull`에서 `BLOB_STORE_ID`를 못 받음)

---

## 4. 환경변수 설정 (의뢰자 Vercel → Settings → Environment Variables)

Blob 연결로 `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`는 자동 생성된다. 나머지를 추가한다.

| 변수 | 값 만드는 법 | 환경 |
|---|---|---|
| `ADMIN_USERNAME` | 의뢰자 관리자 아이디 | Production, Preview (+Development 필요 시) |
| `ADMIN_PASSWORD_HASH` | `npm run hash-password -- '<의뢰자 비밀번호>'` 출력값 | 위와 같음 |
| `SESSION_SECRET` | `openssl rand -base64 48` (**source 값 재사용 금지**) | 위와 같음 |
| `NOTION_PUBLICATION_URL` | 의뢰자 Notion Publication 페이지 URL | 전체 |
| `NEXT_PUBLIC_SITE_URL` | 의뢰자 도메인 (예: `https://a2f.example.ac.kr`) | Production (Preview는 비워도 됨) |

- 비밀번호 원문은 어디에도 저장하지 않는다. 해시만 Vercel에 넣는다.
- `BLOB_READ_WRITE_TOKEN`은 넣지 않는다 (OIDC 사용).

---

## 5. Blob 데이터 이전

store 간 이동 기능이 없으므로 **export(내 계정) → import(의뢰자 계정)** 두 단계로 옮긴다.
두 계정의 인증 정보를 동시에 쓰지 않도록 env 파일을 분리한다. (`.env.source`, `.env.target`, `migration-data/`는 gitignore 대상)

### 5-1. source 환경 받기 (개발자 계정)
```bash
npx vercel login                     # 개발자 계정
npx vercel link --yes --project a2f  # 개발자 Vercel 프로젝트
npx vercel env pull .env.source --yes
```

### 5-2. export
```bash
npm run blob:export
# → migration-data/manifest.json + migration-data/files/** 생성
```
출력의 blob 개수와 Vercel 대시보드(Storage → a2f-dev-blob → Manage Blobs)의 개수가 같은지 확인한다.

### 5-3. target 환경 받기 (의뢰자 계정)
```bash
npx vercel logout
npx vercel login                                        # 의뢰자 계정 (또는 초대받은 팀)
npx vercel link --yes --project <의뢰자 프로젝트 이름>
npx vercel env pull .env.target --yes
```

### 5-4. import (먼저 dry-run)
```bash
node --env-file=.env.target scripts/blob-migrate.mjs import ./migration-data --dry-run
# 업로드될 파일 목록과 JSON별 URL 재작성 개수 확인

npm run blob:import
# → 이미지 업로드 → data/*.json의 이미지 URL을 target 주소로 재작성 → JSON 업로드 → 누락 검사
```
스크립트 안전장치:
- source와 같은 store면 중단 (env를 잘못 불러온 경우 방지)
- target store가 비어 있지 않으면 중단 (`--force`를 붙여야만 덮어씀)
- 재작성 후 JSON에 source store 주소가 남아 있으면 중단

### 5-5. 정리
```bash
rm -rf migration-data .env.source .env.target
```
`migration-data/`에는 운영 데이터가 들어 있으므로 반드시 삭제한다.

---

## 6. 배포 및 검증

1. 의뢰자 Vercel에서 **Redeploy** (환경변수 반영)
2. 로컬을 target 기준으로 맞추고 연결 확인:
   ```bash
   npx vercel env pull .env.local --yes
   npm run blob:test        # 6단계 모두 통과해야 함
   ```
3. 사이트 확인 체크리스트
   - [ ] Home: 소개 / Research Field / Award 목록·페이지네이션 / 이미지 표시
   - [ ] Award Detail, Project 목록·필터·추가 로딩, Project Detail, Team
   - [ ] 이미지 URL이 의뢰자 store 주소(`<새 store>.public.blob.vercel-storage.com`)인지 (개발자 도구에서 확인)
   - [ ] `/admin/login` — 의뢰자 계정으로 로그인
   - [ ] 관리자에서 항목 수정·저장 → Public 페이지 반영
   - [ ] 이미지 업로드 / 삭제 / 순서 변경
   - [ ] Publication 메뉴 → Notion 페이지
   - [ ] 365 / 768 / 1440 / 1920 화면 확인
4. Blob store의 **Revoke Token** 배너가 있으면 재배포 확인 후 Revoke (OIDC만 사용)

---

## 7. 도메인 연결 (의뢰자 도메인이 있는 경우)

1. 의뢰자 Vercel → Project → **Settings → Domains → Add**
2. 안내된 DNS 레코드(A 또는 CNAME)를 도메인 관리처에 등록 — 학교 도메인이면 전산 담당 부서 요청 필요
3. 연결 후 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 맞추고 Redeploy

---

## 8. 개발자 계정 정리 (의뢰자 사이트 검증 완료 후)

- [ ] 개발자 Vercel 프로젝트 삭제 또는 일시 중지
- [ ] 개발자 Blob store `a2f-dev-blob` 삭제 (데이터가 의뢰자 store에 있는지 재확인 후)
- [ ] (방법 B였다면) 개발자 GitHub 저장소 Archive
- [ ] 로컬 `.env.local`, `.vercel/`이 의뢰자 프로젝트를 가리키는지 확인

---

## 9. 문제 해결

| 증상 | 원인 / 조치 |
|---|---|
| `No blob credentials found` | `.env.*`에 `VERCEL_OIDC_TOKEN` 또는 `BLOB_STORE_ID` 없음 → Blob 연결 환경에 Development 체크 후 `vercel env pull` 다시 |
| 인증 오류 (로컬) | `VERCEL_OIDC_TOKEN`은 약 12시간 후 만료 → `vercel env pull` 다시 |
| import가 "not empty"로 중단 | target store에 이미 파일이 있음 → 의도한 덮어쓰기면 `--force`, 아니면 store 확인 |
| import가 "same as the source"로 중단 | `.env.target`에 source 값이 들어감 → 5-3을 의뢰자 계정으로 다시 |
| 이미지가 깨짐 | 이미지 URL이 이전 store를 가리킴 → import 로그의 "URLs rewritten" 확인, JSON 재확인 |
| 관리자 로그인 실패 | `ADMIN_PASSWORD_HASH`를 다른 비밀번호로 만들었거나, 값이 잘림 → 다시 생성해 붙여넣기, `SESSION_SECRET` 32자 이상 확인 |
| 저장 시 "다른 관리자가 수정" | 정상 동작(버전 충돌). 새로고침 후 다시 저장 |
