# A2F Lab Website Development Guide

A2F Design Lab 공식 웹사이트를 구축한다.

이 프로젝트의 UI/UX 디자인은 Figma에서 제공된다.

Claude Code는 반드시 **Figma MCP를 이용해 실제 Figma 디자인을 확인한 뒤 구현**한다.

Figma에 없는 디자인을 임의로 생성하지 않는다.

디자인, 개발 설명서, 기능 요구사항 사이에 충돌하거나 불명확한 부분이 있으면 임의로 판단하지 말고 먼저 보고한다.

---

# 1. 프로젝트 목표

A2F Design Lab의 공식 반응형 웹사이트를 구축한다.

Public 사이트에서는 다음 정보를 제공한다.

- 연구실 소개
- 연구 분야
- Award & Activity
- Publication
- Project
- Professor
- Student
- Alumni

별도의 관리자 페이지를 제공하며 관리자는 주요 콘텐츠를 직접 등록, 수정, 삭제할 수 있어야 한다.

---

# 2. 확정 기술 스택

## Framework

- Next.js
- React
- TypeScript
- Next.js App Router

## Deployment

- Vercel

## Source Management

- Git
- GitHub

## Data Storage

별도의 관계형 데이터베이스는 사용하지 않는다.

Vercel Blob을 다음 두 용도로 사용한다.

- JSON 콘텐츠 데이터
- 이미지 파일

사용하지 않는 서비스:

- MySQL
- PostgreSQL
- Supabase Database
- Firebase
- 별도 AWS Database

---

# 3. 전체 Architecture

기본 구조는 다음과 같다.

```text
Figma
   ↓
Figma MCP
   ↓
Claude Code
   ↓
Next.js
   ↓
GitHub
   ↓
Vercel
   │
   ├── Public Website
   ├── Admin Website
   ├── Server Actions / Route Handlers
   │
   └── Vercel Blob
        ├── JSON Data
        └── Images
```

Public UI와 데이터 처리 코드는 반드시 분리한다.

```text
Vercel Blob
   ↓
Data Service
   ↓
Page
   ↓
Figma 기반 UI Component
```

React Component 내부에서 직접 Blob 접근 코드를 작성하지 않는다.

---

# 4. 확정 Responsive Breakpoint

다음 네 가지 디자인 기준을 사용한다.

```text
365px
768px
1440px
1920px
```

각 기준:

```text
365px  = Mobile
768px  = Tablet
1440px = Desktop
1920px = Large Desktop
```

이 네 크기는 단순한 CSS breakpoint가 아니라 **각각 별도로 제공된 디자인 기준**이다.

각 Figma Frame을 독립적으로 분석해야 한다.

1920 디자인 하나를 단순 축소해 Mobile / Tablet을 만들지 않는다.

---

# 5. Responsive 구현 원칙

각 breakpoint별 Figma Frame을 직접 확인한다.

반드시 확인할 요소:

- Container Width
- Grid
- Column Count
- Gap
- Margin
- Padding
- Typography
- Font Size
- Line Height
- Image Ratio
- Element Order
- Navigation 구조
- Card Layout
- Filter 위치
- Footer 배치

Breakpoint 사이 화면에서는 자연스럽게 연결한다.

기본 해석:

```text
~767px
→ Mobile 기반

768~1439px
→ Tablet 기반

1440~1919px
→ Desktop 기반

1920px 이상
→ Large Desktop 기반
```

단, 실제 media query 경계는 레이아웃이 깨지지 않도록 조정할 수 있다.

---

# 6. 365 Mobile 디자인 원칙

365px 디자인을 별도 기준으로 구현한다.

## Header

- Logo 표시
- Hamburger Menu 사용
- Desktop Navigation 직접 노출하지 않음

## Mobile Menu

Hamburger 클릭 시 전체 화면에 가까운 Navigation Overlay를 연다.

메뉴:

```text
HOME
PUBLICATION
PROJECT
TEAM
```

현재 선택된 메뉴는 Figma 디자인에 맞춰 강조한다.

Overlay Background, Blur, Close Icon 등은 Figma를 그대로 따른다.

## Layout

대부분 콘텐츠는 1 Column 중심이다.

## Project

Project Card는 1 Column 배치한다.

Desktop Hover Preview를 Mobile에서 강제로 구현하지 않는다.

Card Tap 시 Project Detail로 이동한다.

## Award Detail

Desktop의 좌우 구조를 그대로 축소하지 않는다.

본문, 이미지, 인원 정보를 Mobile Figma 순서대로 세로 재배치한다.

## Team

대략 다음 흐름의 세로 배치를 따른다.

```text
Intro
↓
Professor
↓
Professor Detail
↓
Education
↓
Experience
↓
Research
↓
Project
↓
Student
↓
Alumni
```

실제 순서와 spacing은 Figma MCP 결과를 우선한다.

---

# 7. 768 Tablet 디자인 원칙

768px은 단순 Mobile 확대가 아니다.

## Header

- Hamburger Navigation 유지
- Mobile Overlay 방식의 Navigation 사용

## Home

Desktop 구조를 단순 축소하지 않는다.

Tablet Frame의 실제 배치와 spacing을 따른다.

## Project

기본적으로 2 Column Grid를 사용한다.

Figma MCP 결과가 다르면 해당 값을 우선한다.

## Award

본문과 이미지를 Tablet 폭에 맞게 재배치한다.

## Team

Professor 정보와 이미지, Education / Experience / Research / Project 영역을 Tablet 전용 Layout으로 구성한다.

---

# 8. 1440 Desktop 디자인 원칙

1440px을 기본 Desktop 구현 기준으로 사용한다.

## Header

상단에 다음 Navigation을 직접 표시한다.

```text
PUBLICATION
PROJECT
TEAM
```

Logo 클릭 시 Home으로 이동한다.

## Project

기본 3 Column Grid를 사용한다.

## Home Research Fields

여러 Column을 사용하는 Grid 구조로 구현한다.

## Award Detail

본문과 이미지가 좌우 구조를 사용한다.

## Team

Professor 정보, 중앙 이미지, Project 영역 등을 다단 Layout으로 구성한다.

1440 Frame을 먼저 완성한 뒤 1920 Frame으로 확장한다.

---

# 9. 1920 Large Desktop 디자인 원칙

1920은 1440을 단순 확대하지 않는다.

Figma 1920 Frame에서 다음을 별도로 확인한다.

- Container Width
- Section Max Width
- Grid Gap
- Typography
- Image Width
- Header Position
- Footer Position

## Project

기본:

```text
3 Column × 3 Row
= 9 Project
```

Project Year Filter는 우측에 세로 배치한다.

Content가 화면 전체 폭으로 지나치게 늘어나지 않도록 Figma의 Max Width를 따른다.

---

# 10. Figma MCP 사용 원칙

UI 구현 전에 반드시 Figma MCP로 해당 Frame을 분석한다.

작업 순서:

```text
Figma Frame 확인
↓
Layout 분석
↓
Component 구조 분석
↓
Design Token 분석
↓
Responsive 차이 분석
↓
Interaction 분석
↓
구현 계획 보고
↓
구현
```

확인할 항목:

- Frame Width
- Auto Layout
- Grid
- Spacing
- Font Family
- Font Size
- Font Weight
- Line Height
- Letter Spacing
- Color
- Border
- Border Radius
- Image Ratio
- Alignment
- Component
- Variant
- Hover State
- Mobile State
- Tablet State

Figma에 존재하는 값은 임의 값으로 대체하지 않는다.

---

# 11. Design Token

가능하면 공통 값은 CSS Variable로 관리한다.

예:

```css
:root {
  --color-primary: ...;
  --color-text: ...;
  --color-background: ...;

  --space-xs: ...;
  --space-sm: ...;
  --space-md: ...;
  --space-lg: ...;

  --font-body: ...;
  --font-heading: ...;
}
```

Figma MCP에서 확인되는 실제 값을 사용한다.

---

# 12. Public Route

다음 Route를 기본으로 한다.

```text
/
/award
/award/[id]
/project
/project/[id]
/team
```

Publication은 내부 상세 페이지를 만들지 않는다.

Publication 클릭 시 지정된 Notion Publication 페이지로 이동한다.

---

# 13. Header / Navigation

Desktop:

```text
Logo

PUBLICATION
PROJECT
TEAM
```

Mobile / Tablet:

```text
Logo
Hamburger
```

Hamburger 클릭 시 Overlay Menu 표시.

Figma에서 현재 페이지 표시 상태가 존재하면 동일하게 구현한다.

---

# 14. Home Page

Home에는 다음 영역이 존재한다.

```text
Main Visual
Introducing
Research Fields
Award & Activity
Footer
```

---

# 15. Home Main Visual

Figma 디자인과 개발 설명서의 Scroll Interaction을 구현한다.

주요 기능:

- Scroll 기반 이미지 이동
- Scroll 기반 Text 이동
- Transition
- Element Position 변화

Animation 구현 우선순위:

```text
CSS
↓
Framer Motion
↓
GSAP
```

CSS로 충분하면 Animation Library를 설치하지 않는다.

---

# 16. Home Introduction

연구실 소개 텍스트를 표시한다.

관리자에서 수정 가능하도록 한다.

데이터:

```text
data/home.json
```

---

# 17. Research Fields

총 6개 Research Field를 사용한다.

```text
1. Cognitive Design Activity

2. Design Thinking

3. Integrated Brand Experience Design

4. Experience Strategy in Digital Contexts

5. Service Design for User Experience

6. Human–AI Co-thinking in Design
```

각 항목:

```text
id
title
description
order
```

관리자는 설명 Text를 수정할 수 있다.

기본적으로 개수는 6개 고정이다.

관리자가 임의로 항목을 추가 / 삭제하는 기능은 구현하지 않는다.

---

# 18. Home Award & Activity

Home의 Award & Activity는 별도 데이터를 만들지 않는다.

```text
awards.json
↓
최근 데이터 조회
↓
Home 표시
```

Figma에 정의된 개수 및 정렬 방식을 따른다.

Hover Interaction도 Figma 기준으로 구현한다.

---

# 19. Award & Activity List

Route:

```text
/award
```

Filter:

```text
All
Award
Activity
```

지원 Interaction:

- Dropdown Open / Close
- Hover
- Selected State

Figma를 기준으로 한다.

---

# 20. Award 데이터 구조

Blob:

```text
data/awards.json
```

Type:

```ts
type AwardActivityType = "AWARD" | "ACTIVITY";
```

예:

```json
{
  "id": "award-001",
  "type": "AWARD",
  "title": "Hana Youth Financial Talent Training Project",
  "date": "2026-03-12",
  "body": "",
  "images": [],
  "people": [],
  "createdAt": "",
  "updatedAt": ""
}
```

---

# 21. Award Detail

Route:

```text
/award/[id]
```

구성:

```text
Title
Award / Activity Type
Date
Body
Images
People
```

365 / 768 / 1440 / 1920 각각의 Figma Frame을 기준으로 Layout을 구현한다.

Desktop의 좌우 배치를 Mobile에서 유지하지 않는다.

---

# 22. Award People

관련 인원은 최대 4명이다.

각 인원:

```text
name
degree
role
profileImage(optional)
```

Degree:

```text
N/A
Associate
Bachelor
Master
Doctor
Honorary Doctorate
Microdegree
Professor
```

Role은 자유 입력이다.

예:

```text
Designer
Developer
Researcher
Master Designer
```

---

# 23. Award Admin

기능:

```text
목록
등록
수정
삭제
```

관리 항목:

```text
Title
Award / Activity 선택
Date
Body
Images
People 최대 4명
Name
Degree
Role
```

삭제 전 Confirmation을 제공한다.

---

# 24. Project List

Route:

```text
/project
```

기능:

```text
Category Filter
Year Filter
Card Hover
Image Preview
Incremental Loading
Scroll To Top
```

---

# 25. Project Category

고정 Category:

```text
All
UX/UI
BX/BI
Planning
Graphic
ETC
```

Config에서 관리한다.

예:

```ts
export const PROJECT_CATEGORIES = [
  "UX/UI",
  "BX/BI",
  "Planning",
  "Graphic",
  "ETC"
];
```

---

# 26. Project Year Filter

연도 필터를 제공한다.

예:

```text
2026
2025
2024
2023
```

Project date를 기준으로 사용 가능한 연도 목록을 자동 생성한다.

연도를 코드에 고정하지 않는다.

---

# 27. Project Grid Responsive Rule

기본 방향:

```text
365
→ 1 Column

768
→ 2 Columns

1440
→ 3 Columns

1920
→ 3 Columns × 3 Rows
```

각 breakpoint에서 실제 width / gap / card ratio는 Figma MCP로 확인한다.

---

# 28. Project Loading

기본 9개 단위 표시를 사용한다.

```text
처음 9개
↓
추가 로딩
↓
다음 9개
↓
반복
```

개발 설명서의:

```text
무한 스크롤
9개씩 Page Up
```

요구를 위 방식으로 해석한다.

다만 Figma MCP 또는 최종 사용자 요구와 다르면 구현 전에 보고한다.

---

# 29. Project Hover Preview

Desktop에서 Project 대표 이미지에 Hover하면 여러 이미지가 빠르게 순환한다.

```text
Mouse Enter
↓
Image 1
↓
Image 2
↓
Image 3
↓
Image 4
↓
반복

Mouse Leave
↓
Image 1
```

권장 Interval:

```text
300~500ms
```

적용:

- Crossfade
- Image Preload
- Timer Cleanup
- Memory Leak 방지

Mobile에서는 사용하지 않는다.

Tap 시 상세 페이지로 이동한다.

---

# 30. Project 데이터 구조

Blob:

```text
data/projects.json
```

구조:

```text
id
title
date
body
category
customTag
member
images
createdAt
updatedAt
```

예:

```json
{
  "id": "project-001",
  "title": "Talia",
  "date": "2026-03-12",
  "body": "",
  "category": "UX/UI",
  "customTag": "AI agent app",
  "member": null,
  "images": [],
  "createdAt": "",
  "updatedAt": ""
}
```

---

# 31. Project Tag

두 종류만 사용한다.

## Category

고정 목록 중 1개.

## Custom Tag

관리자가 자유 입력하는 Tag 1개.

여러 개의 Custom Tag array로 만들지 않는다.

---

# 32. Project Member

Project 참여 인원은 최대 1명이다.

필드:

```text
name
degree
profileImage(optional)
```

기존 Team Member 선택 방식인지 직접 입력 방식인지는 구현 전에 확인한다.

임의 결정하지 않는다.

---

# 33. Project Images

Project에는 여러 이미지를 등록한다.

첫 번째 이미지:

```text
images[0]
```

를 대표 이미지로 사용한다.

별도의 Thumbnail을 중복 저장하지 않는다.

관리자는 Image Order를 변경할 수 있어야 한다.

가능하면 Drag & Drop을 사용한다.

Drag & Drop dependency가 과도하면 Up / Down 방식 사용 여부를 먼저 보고한다.

---

# 34. Project Detail

Route:

```text
/project/[id]
```

구성:

```text
Title
Date
Body
Category
Custom Tag
Member
Main Image
Additional Images
```

Additional Images는 저장된 배열 순서대로 표시한다.

---

# 35. Team Page

Route:

```text
/team
```

구성:

```text
Intro
Professor
Student
Alumni
Footer
```

각 breakpoint의 Figma Layout을 독립적으로 구현한다.

---

# 36. Team Intro

Figma에 정의된 소개 Text 및 Image를 구현한다.

Mobile / Tablet / Desktop마다 위치가 다를 수 있으므로 각 Frame을 확인한다.

---

# 37. Professor Data

Professor는 일반 Member와 구조가 다르므로 별도 JSON으로 관리한다.

```text
data/professor.json
```

필드:

```text
name
title
department
address
phone
email

education
experience
research
projects

images
updatedAt
```

---

# 38. Professor Admin

다음 영역을 개별 관리 가능하게 한다.

```text
Basic Information
Education
Experience
Research
Project
```

가능하면 항목 배열로 관리한다.

예:

```json
{
  "education": [
    {
      "id": "edu-01",
      "text": "(BA) ..."
    }
  ]
}
```

관리 기능:

```text
추가
수정
삭제
순서 변경
```

단순 textarea 방식이 요구사항에 더 적합하다면 구현 전에 보고한다.

---

# 39. Professor Images

Professor 중앙 이미지 영역에는 최대 3장 등록 가능하다.

```text
images.length <= 3
```

Public Team에서는 약 3초마다 이미지가 변경된다.

```text
Image 1
↓ 3 sec
Image 2
↓ 3 sec
Image 3
↓ 3 sec
반복
```

Figma Indicator가 있다면 동일하게 구현한다.

`prefers-reduced-motion`을 고려한다.

---

# 40. Student / Alumni

공통 구조:

```text
id
type
degree
name
email
field
profileImage
order
createdAt
updatedAt
```

Type:

```text
STUDENT
ALUMNI
```

---

# 41. Student / Alumni Degree

다음 Dropdown을 사용한다.

```text
N/A
AA.
BA.
MA.
Dr.
Hon. D.
Prof.
```

Award Degree와 Team Degree는 서로 다르므로 별도 Config로 관리한다.

---

# 42. Student / Alumni Admin

Student:

```text
등록
수정
삭제
순서 변경
```

Alumni:

```text
등록
수정
삭제
순서 변경
```

입력:

```text
Degree
Name
Email
Research Field 한 줄
Profile Image
```

---

# 43. Publication

Publication 데이터를 자체 관리하지 않는다.

지정된 Notion Publication 페이지에서 관리한다.

사이트에서는 해당 페이지로 이동한다.

환경변수:

```text
NOTION_PUBLICATION_URL
```

을 우선 사용한다.

---

# 44. Admin Route

Public Site와 별도 관리자 경로를 사용한다.

```text
/admin
/admin/login
/admin/home
/admin/awards
/admin/projects
/admin/professor
/admin/members
```

Admin UI는 Public Site와 별도 Layout을 사용한다.

Admin 전용 Figma가 없다면 과도하게 디자인하지 않는다.

기능 중심의 단순 UI를 만든다.

---

# 45. Admin Dashboard

`/admin`에서 최소 다음 메뉴를 제공한다.

```text
Home 관리
Award & Activity 관리
Project 관리
Professor 관리
Student 관리
Alumni 관리
```

---

# 46. 관리자 인증

서버 측에서 인증한다.

환경변수:

```text
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
SESSION_SECRET
```

Password 원문을 환경변수나 코드에 넣지 않는다.

Session Cookie:

```text
HttpOnly
Secure
SameSite
```

관리자 Route 접근 권한은 반드시 Server Side에서 확인한다.

Client에서 UI를 숨기는 것만으로 인증하지 않는다.

---

# 47. Vercel Blob 데이터 구조

```text
data/
├── home.json
├── awards.json
├── projects.json
├── professor.json
├── members.json
└── settings.json
```

이미지:

```text
images/
├── home/
├── awards/
├── projects/
├── professor/
└── members/
```

---

# 48. JSON 공통 구조

List:

```json
{
  "version": 1,
  "updatedAt": "",
  "items": []
}
```

Single Object:

```json
{
  "version": 1,
  "updatedAt": "",
  "data": {}
}
```

---

# 49. JSON Version Conflict

관리자가 편집을 시작할 때 version을 저장한다.

저장 시 Blob 최신 version과 비교한다.

동일하면:

```text
Save
```

다르면 저장하지 않는다.

메시지:

```text
다른 관리자가 데이터를 수정했습니다.
최신 데이터를 다시 불러온 후 수정해주세요.
```

Last Write Wins 방식으로 무조건 덮어쓰지 않는다.

---

# 50. JSON 운영 데이터

실제 운영 JSON 데이터를 Source Repository에 두지 않는다.

금지:

```text
/src/data/projects.json
/public/data/projects.json
```

운영 데이터는 Vercel Blob에서 읽는다.

Repository에는 Sample Schema만 둘 수 있다.

---

# 51. Blob Image Upload

지원 이미지:

```text
image/jpeg
image/png
image/webp
image/avif
```

업로드 전 확인:

```text
MIME Type
Extension
File Size
Unique Filename
```

원본 사용자 파일명을 그대로 Blob Key로 사용하지 않는다.

---

# 52. Blob Image Naming

예:

```text
images/projects/project-id/uuid.webp
images/awards/award-id/uuid.jpg
images/members/member-id/uuid.webp
```

---

# 53. Image Delete

관리자가 이미지를 삭제하면 실제 Blob 파일 삭제도 수행한다.

다음 상태를 피한다.

```text
JSON에서 삭제
BUT
Blob 파일 남음
```

단, JSON 저장 실패 시 이미지만 먼저 삭제되어 데이터 손실이 생기지 않도록 안전한 순서를 사용한다.

---

# 54. Image Optimization

Public Site:

- Next.js Image 사용
- width / height 지정
- sizes 지정
- Lazy Loading
- 필요한 경우 priority 적용
- 적절한 Responsive Size 사용

Project Hover Preview에서 지나치게 큰 원본 이미지를 매번 다운로드하지 않는다.

---

# 55. Data Validation

관리자 입력은 서버에서도 검증한다.

예:

```text
Required Title
Valid Date
Enum Category
Maximum Award People = 4
Maximum Project Member = 1
Maximum Professor Images = 3
Email Validation
Image MIME
Image Size
```

가능하면 Zod를 사용한다.

기존 프로젝트에 다른 Validation 구조가 있으면 불필요한 Library를 추가하지 않는다.

---

# 56. Cache / Revalidation

관리자가 저장한 데이터가 Public Site에 정상 반영되어야 한다.

Next.js Cache를 사용하는 경우:

```text
revalidatePath()
```

등 적절한 Cache Invalidation을 사용한다.

사이트 전체에 무조건 `no-store`를 적용하지 않는다.

---

# 57. Interaction

## Home

```text
Scroll Animation
Image Movement
Text Movement
Transition
```

## Award

```text
Filter Open / Close
Filter Hover
Selected State
Card Hover
Page Transition
```

## Project

```text
Category Filter
Year Filter
Filter Interaction
Card Hover
Image Cycle Preview
Incremental Loading
Scroll To Top
Page Transition
```

## Team

```text
Professor Image Auto Rotation
```

---

# 58. Mobile Interaction

Mobile에서는 Hover를 필수 interaction으로 사용하지 않는다.

대신:

```text
Tap
Click
Dropdown
Accordion
```

방식으로 대체한다.

Desktop에서 Hover로만 보이는 중요 정보가 Mobile에서 사라지지 않도록 한다.

---

# 59. Accessibility

기본적으로 다음을 적용한다.

```text
semantic HTML
button / link 구분
keyboard navigation
focus state
alt text
form label
accessible dropdown
touch target
color contrast
prefers-reduced-motion
```

---

# 60. 권장 Source Structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── award/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── project/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   └── team/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── page.tsx
│   │   ├── home/
│   │   ├── awards/
│   │   ├── projects/
│   │   ├── professor/
│   │   └── members/
│   │
│   └── api/
│
├── components/
│   ├── public/
│   ├── admin/
│   └── common/
│
├── lib/
│   ├── auth/
│   ├── blob/
│   ├── validation/
│   └── utils/
│
├── services/
│   ├── home/
│   ├── awards/
│   ├── projects/
│   ├── professor/
│   └── members/
│
├── types/
└── config/
```

현재 규모에 필요하지 않은 Directory는 제거해도 된다.

과도한 Architecture를 만들지 않는다.

---

# 61. TypeScript Type

예:

```ts
type ProjectCategory =
  | "UX/UI"
  | "BX/BI"
  | "Planning"
  | "Graphic"
  | "ETC";
```

Award Degree와 Team Degree도 별도 Type으로 관리한다.

---

# 62. 개발 전체 순서

## Phase 1
Architecture / Project Structure

## Phase 2
Vercel Blob 연결

## Phase 3
JSON Schema / Type 정의

## Phase 4
Admin Authentication

## Phase 5
Home Admin

## Phase 6
Award Admin

## Phase 7
Project Admin

## Phase 8
Professor Admin

## Phase 9
Student / Alumni Admin

## Phase 10
Image Upload / Delete / Order

## Phase 11
Public Data Connection

## Phase 12
Figma MCP 분석

## Phase 13
1440 Desktop UI 구현

## Phase 14
1920 Large Desktop UI 구현

## Phase 15
768 Tablet UI 구현

## Phase 16
365 Mobile UI 구현

## Phase 17
Interaction 구현

## Phase 18
Responsive / Functional QA

## Phase 19
Vercel Production Deployment

---

# 63. UI 구현 순서

전체 UI를 한 번에 만들지 않는다.

각 페이지별로:

```text
Figma MCP 분석
↓
Layout / Token 정리
↓
Component 설계 보고
↓
1440 구현
↓
1920 구현
↓
768 구현
↓
365 구현
↓
Interaction 구현
↓
QA
↓
다음 페이지
```

순서로 진행한다.

---

# 64. 페이지 구현 순서

```text
1. Header / Navigation / Footer

2. Home

3. Award List

4. Award Detail

5. Project List

6. Project Detail

7. Team

8. Admin UI
```

---

# 65. Responsive QA

반드시 다음 viewport를 직접 확인한다.

```text
365
768
1440
1920
```

확인 항목:

```text
Layout
Container
Grid
Spacing
Typography
Text Wrapping
Text Overflow
Image Ratio
Navigation
Menu Overlay
Filter
Hover
Touch
Animation
Footer
```

---

# 66. Functional QA — Home

```text
Admin Login
↓
Research Field 수정
↓
Save
↓
Public Home 확인
```

---

# 67. Functional QA — Award

```text
Award 등록
↓
Type 선택
↓
Date 입력
↓
Body 입력
↓
Image Upload
↓
People 최대 4명 입력
↓
Save
↓
Award List 확인
↓
Award Detail 확인
```

---

# 68. Functional QA — Project

```text
Project 등록
↓
Category 선택
↓
Custom Tag 입력
↓
Member 입력 / 선택
↓
여러 Image Upload
↓
Image Order 변경
↓
Save
↓
Project List
↓
Filter 확인
↓
Year Filter 확인
↓
Hover Preview
↓
Project Detail
```

---

# 69. Functional QA — Professor

```text
Professor 정보 수정
↓
Education 수정
↓
Experience 수정
↓
Research 수정
↓
Project 수정
↓
Image 최대 3장 Upload
↓
Save
↓
Team Page
↓
3초 Image Rotation 확인
```

---

# 70. Functional QA — Student / Alumni

```text
등록
↓
Degree 선택
↓
Name
↓
Email
↓
Field
↓
Image Upload
↓
Save
↓
Team Page 확인
```

---

# 71. Environment Variables

최소 다음을 검토한다.

```text
BLOB_READ_WRITE_TOKEN

ADMIN_USERNAME
ADMIN_PASSWORD_HASH
SESSION_SECRET

NOTION_PUBLICATION_URL

NEXT_PUBLIC_SITE_URL
```

현재 Vercel Blob 인증 방식이 OIDC 기반이라면 실제 설정에 맞게 변경한다.

Secret을 Source에 작성하지 않는다.

---

# 72. GitHub

Commit 대상:

```text
Source Code
Types
Components
Config
Sample Schema
Documentation
```

Commit 금지:

```text
.env
Password
Secret
Token
Production JSON Data
```

---

# 73. Vercel Deployment

GitHub와 Vercel을 연결한다.

Push 전:

```bash
npm run lint
npm run build
```

를 실행한다.

Build Error 발생 시 설정을 무작정 변경하지 않는다.

Vercel Deployment Log에서 최초 오류를 먼저 확인한다.

---

# 74. 구현 중 금지 사항

다음을 금지한다.

- Figma에 없는 UI 임의 추가
- 1920 디자인을 단순 축소해 모든 화면 생성
- Mobile에서 Desktop Hover 강제 적용
- 요구사항 없는 기능 추가
- MySQL 사용
- PostgreSQL 사용
- Supabase 사용
- Firebase 사용
- 운영 JSON을 GitHub에 저장
- Password 평문 저장
- Secret 하드코딩
- Client-only 관리자 인증
- Blob Token 노출
- Image Validation 생략
- Award People 최대 4명 제한 무시
- Project Member 최대 1명 제한 무시
- Project Custom Tag를 복수 Array로 변경
- Professor Image 최대 3장 제한 무시
- 불필요한 npm package 추가
- 전체 사이트를 한 번에 생성
- Figma 확인 없이 CSS 값을 추측
- Fixed Width 때문에 Horizontal Scroll 발생
- 이미지 Aspect Ratio 왜곡

---

# 75. 아직 구현 전 확인이 필요한 사항

## Project Incremental Loading

현재 요구사항:

```text
무한 스크롤
+
9개씩 추가
```

기본적으로:

```text
9개씩 자동 추가 로딩
```

으로 해석한다.

실제 구현 전에 확인한다.

## Award Images

Award Detail Image가 단수인지 복수인지 확인한다.

Data 구조는 복수 지원 가능하게 설계한다.

## Project Member

다음 중 어떤 방식인지 확인한다.

```text
기존 Team Member 선택

또는

직접 입력
```

## Professor Content 관리

Education / Experience / Research / Project를:

```text
항목별 CRUD
```

로 할지:

```text
영역별 Text Editing
```

으로 할지 확인한다.

---

# 76. Claude 작업 절차

Claude는 모든 Phase에서 다음 순서를 따른다.

## Step 1 — Inspect

현재 Project Structure와 기존 코드를 확인한다.

기존 파일을 보지 않고 새 코드로 덮어쓰지 않는다.

## Step 2 — Analyze

현재 요구사항과 Figma를 확인한다.

## Step 3 — Plan

다음을 먼저 보고한다.

```text
새로 만들 파일
수정할 파일
삭제할 파일
구현 방식
주의할 부분
```

## Step 4 — Implement

승인된 범위만 구현한다.

## Step 5 — Validate

가능한 경우:

```text
Type Check
Lint
Build
Relevant Test
```

를 수행한다.

## Step 6 — Report

완료 후 다음을 보고한다.

```text
생성 파일
수정 파일
구현 내용
Test 결과
남아 있는 문제
다음 Phase
```

## Step 7 — STOP

다음 Phase로 자동 진행하지 않는다.

내 승인을 기다린다.

---

# 77. 첫 번째 작업

지금은 코드를 작성하지 않는다.

현재 Project와 요구사항을 분석하고 다음 내용만 보고한다.

```text
1. 전체 Architecture

2. 권장 Next.js Directory Structure

3. Vercel Blob 데이터 저장 방식

4. home.json Schema

5. awards.json Schema

6. projects.json Schema

7. professor.json Schema

8. members.json Schema

9. settings.json Schema

10. Admin Authentication 방식

11. Image Upload / Delete 방식

12. Image Order 관리 방식

13. JSON Version Conflict 처리 방식

14. Public / Admin Route 구조

15. 365 Responsive 구조

16. 768 Responsive 구조

17. 1440 Responsive 구조

18. 1920 Responsive 구조

19. 각 Breakpoint 사이 Responsive 전략

20. Figma MCP 작업 절차

21. 필요한 Environment Variables

22. 구현 전 확인이 필요한 요구사항

23. 예상되는 기술적 위험 요소
```

아직 다음 작업은 하지 않는다.

```text
코드 생성
파일 수정
패키지 설치
UI 구현
Vercel 설정 변경
Blob 생성
Deployment
```

분석 결과만 보고하고 작업을 중단한다.

내 승인을 받은 뒤 Phase 1부터 단계별로 진행한다.