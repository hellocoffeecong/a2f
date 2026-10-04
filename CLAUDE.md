# A2F Lab Website Development Guide

## 1. Project Overview

Build the official responsive website for A2F Design Lab.

The public website includes:
- Home
- Award & Activity
- Publication
- Project
- Team

A separate admin area must allow authorized administrators to create, edit, delete, reorder, and upload content where required.

The UI/UX is already designed in Figma.

Claude Code must use Figma MCP to inspect the actual design before implementing UI.

Do not invent visual design that is not supported by the Figma source, supplied SVG references, or project requirements.

If requirements, Figma, SVG references, and implementation constraints conflict, report the conflict before making an arbitrary decision.

---

## 2. Source of Truth Priority

Use the following priority when implementing the website:

1. Figma via Figma MCP
   - layout
   - dimensions
   - typography
   - spacing
   - image assets
   - components
   - responsive frames

2. Supplied SVG references for each viewport
   - visual verification
   - layout comparison
   - static target rendering

3. The MP4 reference for the interaction being built (see "Animation references" below)
   - movement
   - timing
   - scroll progression
   - transitions

4. Development requirement PDF
   - functionality
   - content fields
   - admin requirements
   - interaction requirements

5. This `CLAUDE.md`
   - project-wide engineering rules

If the sources conflict, do not silently choose one. Report the conflict and explain the impact.
When Figma and an older document conflict, use the confirmed Figma result unless instructed otherwise — but still report it.

Decisions already confirmed by the project owner are recorded in §7A and override older text elsewhere in this file, in `A2F_Lab_Development_Guide.md`, and in `HOME_ANIMATION_GUIDE.md`.

### Animation references

Each MP4 covers exactly one interaction. Analyze each only against its own Figma node; never merge them into one Home timeline.

| File | Interaction | Figma node |
|---|---|---|
| `a2f_ani1.mp4` | Award / Activity card hover | `Hover type 1` — 0:2757 |
| `a2f_ani2.mp4` | Project representative image hover | `Hover type 2` — 0:2875 |
| `a2f_ani3.mp4` | Home scroll animation | `A2F - Home` (Scroll) — 0:2642 |

Before implementing any of them: key-frame analysis of the video, comparison with its Figma node, then an implementation plan for approval.

### Reference File Locations

All reference files live under `references/`. Do not look for SVG or MP4 files in the project root.

```text
references/
├── dev_guide_svg/   # per-breakpoint SVGs — visual verification only
├── animation/       # a2f_ani1/2/3.mp4 — one interaction each (see table above)
├── a2f_allsize(365,768,1440,1920).pdf
└── a2f_개발설명포함(1920기준).pdf   # development notes (red annotations)
```

- Figma MCP is the primary design source. Do not derive CSS values from the SVGs; their text is outlined to paths, so typography and token values cannot be read from them.
- `references/dev_guide_svg/768 Home.svg` fails to parse in `rsvg-convert` (oversized embedded image). Use the allsize PDF for that frame when a render is needed.

---

## 3. Technology Stack

### Framework
- Next.js
- React
- TypeScript
- Next.js App Router

### Deployment
- Vercel

### Source Management
- Git
- GitHub

### Content and Image Storage
- Vercel Blob

Do not introduce the following unless explicitly approved:
- MySQL
- PostgreSQL
- Supabase Database
- Firebase
- AWS database services

---

## 4. Application Architecture

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
  ├── Public Website
  ├── Admin Website
  ├── Server Actions / Route Handlers
  └── Vercel Blob
      ├── JSON content
      └── images
```

Keep UI and data-access logic separate:

```text
Vercel Blob
  ↓
Data Service
  ↓
Page / Server Layer
  ↓
UI Components
```

Do not access Vercel Blob directly from arbitrary client components.

---

## 5. Responsive Design

The project has four fixed reference widths:

- 365px — Mobile
- 768px — Tablet
- 1440px — Desktop
- 1920px — Large Desktop

Each width has its own completed design reference and must be inspected independently.

Do not implement the 1920 design and simply scale it down.

Intermediate widths should interpolate naturally:

```text
below 768px       → Mobile-based layout
768px–1439px      → Tablet-based layout
1440px–1919px     → Desktop-based layout
1920px and above  → Large Desktop-based layout
```

Exact media-query thresholds may be adjusted slightly if required to prevent layout breakage.

Never allow unnecessary horizontal page scrolling.

---

## 6. Responsive Design References

Expected visual reference files include:

### 365
- 365 Home.svg
- 365 Home_Hambuger.svg
- 365 Home_NewsDetail.svg
- 365 Project.svg
- 365 Project_Detail.svg
- 365 Team.svg

### 768
- 768 Home.svg
- 768 Home_Hambuger.svg
- 768 Home_NewsDetail.svg
- 768 Project.svg
- 768 Project_Detail.svg
- 768 Team.svg

### 1440
- 1440 Home.svg
- 1440 Home_NewsDetail.svg
- 1440 Project.svg
- 1440 Project_Detail.svg
- 1440 Team.svg

### 1920
- 1920 Home.svg
- 1920 Home_NewsDetail.svg
- 1920 Project.svg
- 1920 Project_Detail.svg
- 1920 Team.svg

Use Figma as the primary implementation reference and SVGs as visual verification targets.

---

## 7. Figma MCP Rules

Before implementing a page:

1. Inspect the relevant Figma frame.
2. Identify layout hierarchy.
3. Identify reusable components.
4. Extract design tokens.
5. Compare all four viewport variants.
6. Identify interaction states.
7. Report the implementation plan.
8. Implement only after the plan is accepted when approval is requested.

Inspect:
- frame width
- auto layout
- grid
- gaps
- margins
- padding
- font family
- font size
- font weight
- line height
- letter spacing
- colors
- borders
- radius
- image ratio
- alignment
- variants
- hover states
- responsive differences

Do not guess values that can be retrieved from Figma.

Figma file key: `Qvvu1kXMZGMpyTNs9EZUbu` (page `0:1` "GUI"). Use the first row of 1920 frames (y=0); the second row (y=7453) is the annotated dev-PDF copy.

---

## 7A. Confirmed Decisions (Figma-verified)

These were confirmed by the project owner after Figma MCP verification. They take precedence over conflicting text elsewhere.

### Design tokens
- English type: Hanken Grotesk. Korean type: Pretendard.
- English letter spacing: -4% unless the actual Figma node says otherwise.
- Colors: green `#008C2A`, body `#555`, secondary/metadata `#888`, tag background `#FAFAFA`. No Figma color variables exist; these are the agreed tokens.
- Figma text styles exist only on 1920 frames (`en) H1/H2/H4/H5/B1`, `kr) B1`, `kr) B1(short)`, `GNB`). Other breakpoints use raw values — read them per node.
- SVG-measured typography is no longer a source.

### Navigation
- Desktop (1440 and 1920): Logo = Home, then PUBLICATION, PROJECT, TEAM.
- Active menu at both 1440 and 1920: SemiBold + `#008C2A`. (1440 Figma has no active variant; apply the 1920 treatment.)
- Award Detail shows no active menu. The 1920 Award Detail frame reuses the PROJECT-active header by mistake — do not reproduce it.
- Hamburger panel (365/768): panel from the right, not full-screen. 365: x=76, width 289. 768: x=158, width 610.
  `background: linear-gradient(rgba(255,255,255,.7) → #FAFAFA)`, `backdrop-filter: blur(10px)`, `box-shadow: 0 -4px 70px rgba(0,0,0,.2)`.
  Items 20px uppercase; gap 30 (365) / 40 (768); active item SemiBold `#008C2A`.

### Home
- Main phrase is "Approach 2 Flux, Access 2 Frame". "Approach 2 Flow" in the animation frame is an old version/typo — never use it.
- Award & Activity is paginated (not infinite scroll). Cards per page: 365 → 3, 768 → 2, 1440 → 3, 1920 → 3.
  Recompute page count from the current breakpoint's page size; clamp the current page index when the viewport changes.
- Pagination: selected number SemiBold black, others Regular `#888`; enabled arrows green.
- Award filter (All / Award / Activity): shown at 768 / 1440 / 1920 per Figma. Not shown at 365 (the empty 365 frame is unfinished UI).
- Keep filter and page state in query parameters where practical.
- No separate `/award` list page: `/award` redirects to `/#award`; only `/award/[id]` exists.

### Project list
- Not Masonry. Each row is its own aligned row; row height = tallest card in that row.
- Columns / column gap / row gap: 365 → 1 col, cards ~36 apart; 768 → 2 cols, 20, row gap 40; 1440 → 3 cols, 24, row gap 100; 1920 → 3 cols, 30, row gap 200.
- Card image box: use the Figma-defined box size per breakpoint and crop with `object-fit: cover`. Do not expose the original image ratio on cards. (Original dimensions are still stored in Blob.)
- Card element order: 365 / 768 / 1440 → title, then tag/date; 1920 → tag/date, then title.
- Card body text is `#555` at every breakpoint (1920's `#888` in Figma is treated as an inconsistency). Metadata may use `#888`.
- Year filter: dropdown at the right end of the category row at 768 / 1440 / 1920; the open state lists years vertically. Not shown at 365.

### Project detail
- Keep the original image ratio as far as possible.

### Award detail
- Desktop: two columns. Left = title/meta, body, People. Right = images.
- Left column stretches to the right column's height: `display: flex; flex-direction: column; justify-content: space-between`, with a minimum vertical gap of ~300px between body and People when space allows. The bottom of People aligns with the bottom of the final image.
- 300 is NOT the horizontal column gap (actual horizontal gap: 1440 → 133, 1920 → 176).
- 365 / 768: single column.

### Data
- Award: `title` = event/project name; `label` = e.g. "Excellence Prize", "Academic Conference"; `images: []` (multiple).
- Project member: entered directly (not linked to Team), max 1, `{ name, degree, profileImage? }`, degree uses the Award degree list.
- Professor sections (education, experience, research, projects): `string[]`, edited per section with add / delete / reorder.
- Home admin-editable: introduction paragraphs, Why A2F text, research field title/subtitle/description. Fixed in code: logo, navigation labels, research field icons, decorative elements.
- `settings.json`: `{ contact: { addressLines, phone, email }, footerText }`. The Publication URL stays in `NOTION_PUBLICATION_URL`.
- Image upload limit: 10MB per file, same value in admin and server validation.

---

## 7B. Styling Rules (CSS)

Principle: **JSX/TSX = structure, data, state, events, behavior. CSS = layout, size, spacing, type, color, effects, responsive, hover, animation.** Applies to public and admin UI.

### No inline styles
- Do not use `style={{ ... }}`, CSS strings in components, or temporary inline styles left in final code.
- Only exception: passing a JS-computed value as a CSS custom property, with the actual styling in CSS:
  ```tsx
  <div className={styles.progress} style={{ "--progress": `${value}%` } as React.CSSProperties} />
  ```
  ```css
  .progress { width: var(--progress); }
  ```
- States (hover, active, selected, disabled, open) are classes, not inline styles: `` className={`${styles.item} ${active ? styles.active : ""}`} ``. Do not add `clsx` unless truly needed.
- `:hover`, `:focus`, `:active`, `transition`, `transform`, `opacity`, `visibility`, `pointer-events`, `@keyframes` live in CSS. React state only decides which class applies. With GSAP/rAF, static styles, initial state and base layout stay in CSS; JS handles only timelines and computed coordinates.

### File structure
- CSS Modules by default: `Component.tsx` + `Component.module.css` side by side.
- Page-only layout: `page.module.css`. Do not pile a whole page into one huge `page.module.css` — split into components (e.g. ProjectPage → ProjectFilter, ProjectGrid, ProjectCard), each with its own module.
- Components that must have their own module: Header, Hamburger, Footer, AwardCard, AwardDetail, ProjectCard, ProjectGrid, ProjectDetail, Pagination, FilterDropdown, ProfessorProfile, TeamMember, AdminForm, AdminTable, AdminButton, AdminImageUploader.
  ```text
  src/
  ├── app/globals.css
  ├── components/<area>/<Component>.tsx + <Component>.module.css
  └── styles/
      ├── tokens.css       # CSS variables
      ├── typography.css   # shared type rules / classes
      └── utilities.css    # small shared utilities (only if needed)
  ```
- `globals.css` holds only site-wide basics: reset, `html`/`body` defaults, `@font-face`, base background/color, box-sizing, anchor/button/input resets. No page or component styles.
- Admin UI uses the same rules with its own shared admin components; it does not reuse the public visual system.

### Tokens and typography
- Repeated values become CSS variables in `src/styles/tokens.css`, e.g.:
  ```css
  :root {
    --color-green: #008c2a;
    --color-text: #555;
    --color-text-secondary: #888;
    --color-tag-bg: #fafafa;
    --page-padding-mobile: 20px;   /* 365 */
    --page-padding-tablet: 30px;   /* 768 */
    --page-padding-desktop: 80px;  /* 1440 */
    --page-padding-large: 100px;   /* 1920 */
  }
  ```
  Do not turn every one-off value into a variable.
- English: Hanken Grotesk. Korean: Pretendard. English letter-spacing −4% by default; an explicit Figma node value wins. Repeated type styles go in `typography.css` or shared classes.

### Responsive
- Mobile-first, and only these breakpoints across the whole project — no ad-hoc ones per component:
  ```css
  @media (min-width: 768px)  { }
  @media (min-width: 1440px) { }
  @media (min-width: 1920px) { }
  ```
- Values per breakpoint come from the matching Figma frame.

### Values and conflicts
- Take CSS values from Figma MCP; do not guess (priority as in §2).
- If an existing CSS value conflicts with Figma, report it instead of silently overwriting.
- Share genuinely repeated styles (variable, utility class or shared component), but do not force small differences into a common abstraction.

### Declaration order
layout → size → spacing → typography → color/background → border → effect → interaction.

### Existing code
- When editing a file within the task scope, move any inline styles found there into CSS Modules — no unrelated refactoring, behavior changes or design changes.
- Legacy note: the current `src/app/globals.css` contains page styles (`.hero` etc.) from the old site. Clean it up when those pages are replaced in the UI phases, not before.

### Report after every UI task
- CSS Module files created / modified
- whether `globals.css` changed
- design tokens added
- inline styles removed, and any remaining (with the reason)
- Check with: `grep -rn 'style={' src`

---

## 8. Navigation

### 365 and 768
Use:
- Logo
- Hamburger button
- Navigation overlay

Overlay menu:
- HOME
- PUBLICATION
- PROJECT
- TEAM

Follow the dedicated Hamburger design references.

### 1440 and 1920
Show desktop navigation directly:
- PUBLICATION
- PROJECT
- TEAM

Logo returns to Home.

---

## 9. Public Routes

```text
/
/award        → redirects to /#award (no list page; Home is the list)
/award/[id]
/project
/project/[id]
/team
```

Publication opens the configured external Notion publication page.

---

## 10. Home

Home contains:
- Main visual
- Introduction
- Research Fields
- Award & Activity
- Footer

The Home scroll animation is governed by `HOME_ANIMATION_GUIDE.md` and uses only `a2f_ani3.mp4` (Figma 0:2642).

Do not implement the supplied MP4 files as normal background videos unless explicitly instructed.

---

## 11. Research Fields

Use six fixed research fields:

1. Cognitive Design Activity
2. Design Thinking
3. Integrated Brand Experience Design
4. Experience Strategy in Digital Contexts
5. Service Design for User Experience
6. Human–AI Co-thinking in Design

Each item:

```text
id
title
description
order
```

Administrators may edit the content.

Do not add or remove research-field slots unless explicitly requested.

---

## 12. Home Award & Activity

Home pulls recent items from Award & Activity data.

Do not duplicate News data in a separate file unless required.

This section is the Award & Activity list (paginated, filterable). See §7A for page sizes, filter visibility and pagination states. The card hover follows `a2f_ani1.mp4` / Figma 0:2757.

---

## 13. Award & Activity

Routes:

```text
/award        → redirect to /#award
/award/[id]
```

Filter values:
- All
- Award
- Activity

Award data should include:

```text
id
type
title     (event / project name)
label     (e.g. Excellence Prize, Academic Conference)
date
body
images
people
createdAt
updatedAt
```

Type:

```ts
type AwardActivityType = "AWARD" | "ACTIVITY";
```

### Award people
Maximum 4 people.

Each person:

```text
name
degree
role
profileImage(optional)
```

Degree options:
- N/A
- Associate
- Bachelor
- Master
- Doctor
- Honorary Doctorate
- Microdegree
- Professor

Admin functions:
- list
- create
- edit
- delete
- upload images
- manage up to 4 people

Require confirmation before destructive deletion.

---

## 14. Project

Routes:

```text
/project
/project/[id]
```

Fixed category options:
- All
- UX/UI
- BX/BI
- Planning
- Graphic
- ETC

Project data:

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

Only one fixed category and one custom tag are required.

Do not convert `customTag` into a multi-value array.

### Project member
Maximum 1 person.

Fields:

```text
name
degree
profileImage(optional)
```

Confirmed: the project member is entered directly (not linked to Team data), and `degree` uses the Award degree list.

### Images
Multiple project images are supported.

`images[0]` is the representative image.

Admin must support image ordering.

---

## 15. Project Responsive Grid

General behavior:

```text
365  → 1 column
768  → 2 columns
1440 → 3 columns
1920 → 3 columns × 3 visible rows where shown
```

The year filter is a dropdown at the right end of the category row (768 / 1440 / 1920); its open state lists years vertically. It is not shown at 365. The layout is row-aligned, not Masonry — see §7A for gaps and image boxes.

---

## 16. Project Loading

The requirements mention:
- infinite scroll
- 9 items at a time

Interpret this by default as:

```text
initial 9
↓
load next 9
↓
load next 9
...
```

Do not build classic numbered pagination unless explicitly requested.

---

## 17. Project Hover Preview

On desktop-capable layouts, hovering over the project representative image should cycle through project images.

Typical interval:
- approximately 300–500 ms

Requirements:
- smooth crossfade where appropriate
- preload only necessary preview images
- clear timers on mouse leave and unmount
- prevent memory leaks
- avoid oversized originals for hover previews

Do not require hover preview on Mobile.

---

## 18. Team

Route:

```text
/team
```

Sections:
- Intro
- Professor
- Student
- Alumni
- Footer

Professor has a separate content model from Student and Alumni.

---

## 19. Professor

Use:

```text
data/professor.json
```

Fields:

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

Admin areas:
- Basic Information
- Education
- Experience
- Research
- Project

Support:
- add
- edit
- delete
- reorder

### Professor images
Maximum 3 images.

Public Team page should rotate them approximately every 3 seconds.

Honor `prefers-reduced-motion`.

---

## 20. Student and Alumni

Shared member structure:

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

Degree options:
- N/A
- AA.
- BA.
- MA.
- Dr.
- Hon. D.
- Prof.

Admin functions:
- create
- edit
- delete
- reorder

---

## 21. Publication

Use a configured external Notion URL.

Preferred environment variable:

```text
NOTION_PUBLICATION_URL
```

Do not create an internal Publication CMS unless explicitly requested.

---

## 22. Admin Routes

Recommended routes:

```text
/admin
/admin/login
/admin/home
/admin/awards
/admin/projects
/admin/professor
/admin/members
```

Admin UI is separate from the public-site visual system.

If no admin Figma design is supplied, use a clean and functional interface rather than inventing an elaborate visual design.

---

## 23. Admin Authentication

Perform authorization on the server.

Suggested environment variables:

```text
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
SESSION_SECRET
```

Do not store a plaintext password.

Use secure session cookies:
- HttpOnly
- Secure
- SameSite

Do not rely on client-side hiding of admin controls as authentication.

---

## 24. Vercel Blob Structure

JSON:

```text
data/
├── home.json
├── awards.json
├── projects.json
├── professor.json
├── members.json
└── settings.json
```

Images:

```text
images/
├── home/
├── awards/
├── projects/
├── professor/
└── members/
```

---

## 25. JSON Versioning

For list-based data:

```json
{
  "version": 1,
  "updatedAt": "",
  "items": []
}
```

For single-object data:

```json
{
  "version": 1,
  "updatedAt": "",
  "data": {}
}
```

When editing:
1. record the version at edit start
2. compare with current Blob version before save
3. save only if versions match
4. increment version after successful save

Avoid silent last-write-wins behavior.

---

## 26. Production Data

Do not store live production JSON in:

```text
/src/data
/public/data
```

Live data belongs in Vercel Blob.

---

## 27. Image Upload

Allowed image types should initially include:
- image/jpeg
- image/png
- image/webp
- image/avif

Validate on the server:
- MIME type
- extension
- file size
- file name

Use generated unique names.

---

## 28. Validation

Validate admin input on the server.

Examples:
- required title
- valid date
- category enum
- Award people <= 4
- Project member <= 1
- Professor images <= 3
- valid email
- image MIME type
- image size

Use Zod if appropriate and not duplicative of an existing validation approach.

---

## 29. Accessibility

Apply:
- semantic HTML
- correct button/link semantics
- keyboard focus
- alt text
- labels
- accessible dropdowns
- appropriate touch targets
- sufficient contrast
- `prefers-reduced-motion`

---

## 30. Recommended Source Structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── award/
│   │   ├── project/
│   │   └── team/
│   ├── admin/
│   │   ├── login/
│   │   ├── home/
│   │   ├── awards/
│   │   ├── projects/
│   │   ├── professor/
│   │   └── members/
│   └── api/
├── components/
│   ├── public/
│   ├── admin/
│   └── common/
├── lib/
│   ├── auth/
│   ├── blob/
│   ├── validation/
│   └── utils/
├── services/
│   ├── home/
│   ├── awards/
│   ├── projects/
│   ├── professor/
│   └── members/
├── types/
└── config/
```

Simplify this structure where appropriate.

Do not introduce unnecessary architectural complexity.

---

## 31. Development Phases

### Phase 1
Architecture and project structure

### Phase 2
Vercel Blob connection

### Phase 3
JSON schema and TypeScript types

### Phase 4
Admin authentication

### Phase 5
Home admin

### Phase 6
Award admin

### Phase 7
Project admin

### Phase 8
Professor admin

### Phase 9
Student / Alumni admin

### Phase 10
Image upload / delete / ordering

### Phase 11
Public data connection

### Phase 12
Figma MCP analysis

### Phase 13
1440 Desktop UI

### Phase 14
1920 Large Desktop UI

### Phase 15
768 Tablet UI

### Phase 16
365 Mobile UI

### Phase 17
Interactions and animation

### Phase 18
Responsive and functional QA

### Phase 19
Vercel production deployment

---

## 32. UI Implementation Order

For each page:

```text
Figma MCP analysis
↓
layout/token summary
↓
component plan
↓
1440 implementation
↓
1920 implementation
↓
768 implementation
↓
365 implementation
↓
interaction implementation
↓
QA
↓
next page
```

Recommended page order:
1. Header / Navigation / Footer
2. Home
3. Award List
4. Award Detail
5. Project List
6. Project Detail
7. Team
8. Admin UI

---

## 33. Required QA Viewports

Test at:
- 365px
- 768px
- 1440px
- 1920px

Check:
- layout
- container width
- grid
- spacing
- typography
- text wrapping
- overflow
- image ratio
- navigation
- hamburger overlay
- filters
- hover
- touch
- animations
- footer

---

## 34. Environment Variables

Review at minimum:

```text
VERCEL_OIDC_TOKEN      (preferred Blob auth; provided on Vercel, pulled locally via `vercel env pull`)
BLOB_STORE_ID          (required with OIDC)
BLOB_READ_WRITE_TOKEN  (fallback only)
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
SESSION_SECRET
NOTION_PUBLICATION_URL
NEXT_PUBLIC_SITE_URL
```

Prefer OIDC for Blob. Browser image uploads must use `handleUploadPresigned` / `uploadPresigned` (works with OIDC); the older `handleUpload` requires `BLOB_READ_WRITE_TOKEN`.

Do not commit secrets.

---

## 35. Git Rules

Commit:
- source code
- types
- components
- config
- sample schemas
- documentation

Do not commit:
- `.env`
- secrets
- plaintext passwords
- access tokens
- live production JSON

---

## 36. Deployment

Before pushing:

```bash
npm run lint
npm run build
```

If deployment fails, inspect the first meaningful Vercel build/deployment error before changing unrelated configuration.

---

## 37. Prohibited Actions

Do not:
- invent UI not present in Figma
- scale the 1920 design down to all sizes
- force desktop hover interaction on Mobile
- introduce an unrequested database
- store live JSON in GitHub
- store plaintext passwords
- hardcode secrets
- expose Blob write credentials to the client
- skip server-side validation
- exceed Award people limit of 4
- exceed Project member limit of 1
- convert the Project custom tag into an arbitrary multi-tag array
- exceed Professor image limit of 3
- install unnecessary packages
- implement the whole site in one uncontrolled batch
- guess CSS values that can be read from Figma
- distort image aspect ratios
- create unnecessary horizontal scrolling

---

## 38. Claude Working Procedure

For every phase:

### Step 1 — Inspect
Inspect existing project files before editing.

### Step 2 — Analyze
Compare requirements, Figma, SVGs, and existing code.

### Step 3 — Plan
Report:
- files to create
- files to modify
- files to remove
- implementation approach
- risks / ambiguities

### Step 4 — Implement
Implement only the approved scope.

### Step 5 — Validate
Run relevant:
- type checking
- lint
- build
- focused tests

### Step 6 — Report
Report:
- created files
- modified files
- implementation summary
- validation results
- remaining issues
- proposed next phase

### Step 7 — Stop
Do not automatically proceed to the next major phase when approval is expected.

---

## 39. Current Status

- First task (architecture analysis report): done.
- Phase 1 (TypeScript, ESLint, `src/` structure, config/types, Blob/validation/auth skeletons): done. Next.js updated to 16.3.8.
- Phase 2 (Vercel Blob connection): done. Dev store `a2f-dev-blob` (Public, icn1) connected to Vercel project `a2f` via OIDC; `npm run blob:test` passes all steps. Locally, `VERCEL_OIDC_TOKEN` expires after ~12h — re-run `npx vercel env pull .env.local --yes`.
- Accounts: development runs on the owner's GitHub (`swhwang81/a2f`) / Vercel / Blob; the finished site moves to the client's accounts later (see `todo.md` §11).
- Figma MCP: connected (`.mcp.json`); SVG measurements verified and the resulting decisions recorded in §7A.
- Existing public pages under `src/app/*.js` and `src/app/data/*.json` are legacy: leave them unchanged (including their lint errors) until they are replaced in the UI phases.
- Not yet decided: ffmpeg installation (decide before the animation phase).

Do not start Public UI or animation work without explicit approval of that phase.
