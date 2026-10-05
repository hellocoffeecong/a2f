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
- Step 4 decisions (owner-approved):
  - Why A2F description: one canonical text (the long version in defaults). Figma's shorter 1440/768 copy is a layout abbreviation — no per-breakpoint text, no `shortDescription`.
  - Introduction: data keeps both paragraphs; 1440/1920 show two, 365/768 only the first (CSS).
  - Research Fields: 365 shows title + icon + subtitle; the description appears from 768 (data always kept).
  - Collage photos are data: `home.visuals.main` (3 slots) / `secondary` (2 slots), positions fixed in code (`src/config/home.ts`). The two black blocks are fixed decoration (Figma's black fill is opaque, so no photo would show) — no upload for them. The green gradient and light-blue blocks are CSS decoration too. The current Figma mockup photos are placeholder content.
  - Contact is shown at all four breakpoints. The 768 Home frame omits it (treated as an omission); 768 uses the 768 section-title size (36/37) and en) B1 (18/28).
  - The long Why A2F text makes the following sections sit 24–42px lower than Figma (365/768/1440; 1920 matches). Intended — do not switch to the Figma short copy.
  - Headline: Figma SVG lettering per breakpoint, not editable, with a visually hidden real `<h1>`.
  - Award card image box: Figma height per breakpoint and per position in the row, `object-fit: cover`.
  - Award date: 1440/1920 on hover or keyboard focus (ani1); 365/768 always shown (label ■ date, no green box).
  - Award cards do not link until `/award/[id]` exists and is verified (`AWARD_DETAIL_AVAILABLE` in `src/config/content.ts`, step 5). Without a link the card is a focusable `<article>`.
  - Approved small choices: "All" has no icon; pagination hidden for a single page; an empty filter result leaves the list empty on the public site (the admin shows a short note); empty photo slot = `#FAFAFA`; research icons centred; all research cards `#F3F3F3` → white.
  - No awards: the public page hides the whole section; the admin keeps it with "등록된 항목이 없습니다" + [추가].
  - Filter (Figma open state 0:2325 / 0:326 / 0:1721): the button shows the selected option, with the type icon for Award/Activity (All has none); options are text only, all green.
  - ani3 is a motion reference only (start state, vertical parallax, per-element speed, spread, pinned header); the final positions are the current Figma Home layout.

### Project list
- Not Masonry. Each row is its own aligned row; row height = tallest card in that row.
- Columns / column gap / row gap: 365 → 1 col, cards ~36 apart; 768 → 2 cols, 20, row gap 40; 1440 → 3 cols, 24, row gap 100; 1920 → 3 cols, 30, row gap 200.
- Card image box: use the Figma-defined box size per breakpoint and crop with `object-fit: cover`. Do not expose the original image ratio on cards. (Original dimensions are still stored in Blob.)
- Card element order: 365 / 768 / 1440 → title, then tag/date; 1920 → tag/date, then title.
- Card body text is `#555` at every breakpoint (1920's `#888` in Figma is treated as an inconsistency). Metadata may use `#888`.
- Year filter: dropdown at the right end of the category row at 768 / 1440 / 1920; the open state lists years vertically. Not shown at 365.

- Step 6 decisions (owner-approved): card image box = Figma height pattern per position (365: 3 cards, 768: 6, 1440/1920: 9), cover crop of `images[0]` — list cards only. Reading order image → title → tag/date → body; 1920 shows tag/date above the title by CSS `order` only. Category filter All + 5 at all sizes; year filter "All" (default) + years that exist in the data, 768 and up (365: all years). Filters in the URL (`?category=&year=`, pushed: back/forward work); a filter change starts again at 9 cards; +9 when the end of the list is reached (IntersectionObserver). Scroll to top only from 1920 (reusable `ScrollToTop`), smooth unless reduced motion.
- ani2 (project image hover): Figma timing — the next photo every ~235 ms with a crossfade, back to `images[0]` on leave; only with a mouse on hover-capable 1440+ layouts without reduced motion; only previous/current/next layers are mounted.

### Project detail
- Keep the original image ratio (no crop) for every image.
- 1440/1920: title/date, then body → tags (category + custom tag) → member (pushed down to end with the representative image) on the left, `images[0]` on the right; the other images below at full width. 365/768: title/date → body → tags → all images → member.
- Member (max 1): same display rules as Award People; `role` is optional (added in step 6).

### Award detail
- Desktop (1440/1920): title/meta on top, then two columns. Left = body + People, right = images.
- Left column stretches to the right column's height; People is pushed to the bottom so it ends with the last image. Minimum body ↔ People gap from Figma per breakpoint: 1920 → 300 (Figma ~351), 1440 → 160, 768/365 → 60. When the body is the longer side, the minimum gap wins and the bottoms are not forced to align.
- Horizontal column gap: 1440 → 133, 1920 → 176 (columns 519 | 628 and 553 | 991).
- 365 / 768: single column, title/meta → images → body → People.
- Images keep their original ratio (width 100%, height auto, no crop) — Figma's fixed/stretched heights are mockup convenience. Gaps between images follow Figma.
- People (max 4): no profile photo → Figma gray gradient placeholder; degree "N/A" is not shown; the separator square only between degree and role; text bottom-aligned from 768, vertically centred at 365.
- Body is plain text; a blank line separates paragraphs (a blank-line gap at 1440/1920, none at 365/768).
- Award and Activity share the layout; only the type icon differs. No active GNB item (the 1920 PROJECT-active is a design error).
- Unknown id → `notFound()` (real 404, minimal "페이지를 찾을 수 없습니다" + Home link inside the site chrome). In the admin: "해당 항목을 찾을 수 없습니다" with the AdminBar kept. `/award` → `/#award` (next.config redirect).

### Team (step 7, owner-approved)
- `professor.json` holds the Team-page-only intro: `teamIntro { text, image? }` (text keeps its line breaks; 365 sets it in Pretendard per Figma). The 365 empty box beside the intro photo is layout only.
- Subtitle = `nameKo + " " + title + ", " + department`, composed in the UI (never stored as one sentence). Professor contact uses the professor's own fields, not `settings.contact`.
- Layout: 365 contact beside the photo, sections below; 768 photo left (223) | four sections right; 1440/1920 Education–Research | photo | Project (3 equal columns). 1440 contact: address 248 wide, phone/email from the 2nd column.
- Photos (max 3): ~3 s rotation with crossfade; the squares select directly (selected = filled, others = outline) and switch at once; pause on hover / keyboard focus; reduced motion = no rotation; 1 photo = no squares; 0 = no photo area (public). Admin: no rotation (`autoRotate={false}`).
- Sections stay `string[]` (StringListEditor: add / edit / delete / ↑↓, no rich text). An empty section is hidden on the public page.
- Student / Alumni share `MemberSection` / `TeamMember`; order = members.json `order`, renumbered 0, 1, 2 … per type after every add / delete / move / type change. Email = `mailto:` in `#888`, underline only on hover, focus ring on keyboard focus, nothing rendered when empty. No photo → the People gray gradient. Degree N/A → name only. Korean list text uses `word-break: keep-all`.
- Empty Student / Alumni: public hides the section; the admin shows "등록된 구성원이 없습니다" + [추가].

### Data
- Award: `title` = event/project name; `label` = e.g. "Excellence Prize", "Academic Conference"; `images: []` (multiple).
- Project member: entered directly (not linked to Team), max 1, `{ name, degree, profileImage? }`, degree uses the Award degree list.
- Professor sections (education, experience, research, projects): `string[]`, edited per section with add / delete / reorder.
- Home admin-editable: introduction paragraphs, Why A2F text, research field title/subtitle/description. Fixed in code: logo, navigation labels, research field icons, decorative elements.
- `settings.json`: `{ contact: { addressLines, phone, email }, footerLines }` — footer phrases split after commas, recombined per breakpoint (1920 one line; 1440/768 first phrase + rest; 365 one per line); the admin edits it as one sentence. The Publication URL stays in `NOTION_PUBLICATION_URL` (menu shown disabled until set; opens in a new tab).
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
- Components that must have their own module: Header, Hamburger, Footer, AwardCard, AwardDetail, ProjectCard, ProjectGrid, ProjectDetail, Pagination, FilterDropdown, ProfessorProfile, TeamMember, and the admin editing kit (AdminBar, Editable, InlineTextEditor, ImageReplace, ListControls, EditPanel, ConfirmDialog).
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
- The admin shares the A2F Design System (tokens, typography, fonts, logo, `Button`, `Field`) and shows the public page design itself — see §7C.

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
- `globals.css` was cleaned in the legacy-cleanup step: only `body { margin: 0 }` and the `html` scroll padding for the sticky header remain. Every `<main>` sets its own padding.

### Report after every UI task
- CSS Module files created / modified
- whether `globals.css` changed
- design tokens added
- inline styles removed, and any remaining (with the reason)
- Check with: `grep -rn 'style={' src`

---

## 7C. Admin: In-Context Editing (confirmed)

The admin is **not** a separate CMS/dashboard. It shows the real public pages and adds editing controls on top of them.

### Structure
- Admin URLs mirror public URLs: `/` ↔ `/admin`, `/award/[id]` ↔ `/admin/award/[id]`, `/project` ↔ `/admin/project`, `/project/[id]` ↔ `/admin/project/[id]`, `/team` ↔ `/admin/team`. `/admin/login` is the only admin-only page. Mapping helpers: `src/lib/admin-paths.ts`.
- Public and admin pages render the **same presentation components** (pure, data-in). No duplicate admin versions of public UI.
- **Never** add admin flags to public components (`editable={true}` etc.). Editing is added from the outside by composition:
  ```tsx
  // admin page only
  <Editable editor={<IntroductionEditor value={...} version={v} />}>
    <Introduction data={...} />            {/* same component as the public page */}
  </Editable>
  <ProjectGrid items={...} renderItemActions={(p) => <ItemActions id={p.id} />} />  {/* neutral slot */}
  ```
- Public pages must not import anything from `components/admin/` or admin actions, so editing code never reaches public visitors' bundles.
- Controls render only in admin routes, under `src/app/admin/(protected)/` (authorized by `requireAdmin()`).

### Admin chrome
- `AdminBar` (thin sticky strip, `src/components/admin/AdminBar.tsx`): edit-mode label, "사이트에서 보기" (matching public URL), user, logout. Nothing else.
- Page navigation uses the **shared public GNB**; in admin routes its links point to the `/admin/...` equivalents (pass the link mapping in, do not fork the component).
- Public Header/Footer/page design stay as is in the admin. Contact/footer text is edited in place on the Footer.
- No dashboard, no admin side/top nav, no Settings page.

### Editing kit (`src/components/admin/edit/`, built as needed per page)
- `Editable` — hover outline + edit chip around a region; opens its editor.
- `InlineTextEditor` — simple text in place: input/textarea + 저장 / 취소.
- `ImageReplace` — "이미지 변경" over an image → upload UI.
- `ListControls` — 추가 / 삭제 (with `ConfirmDialog`) / 위·아래 정렬.
- `EditPanel` — right-side drawer for complex input (Award/Project detail, Professor sections).
- All controls use the A2F Design System (Hanken Grotesk, Pretendard, `#008C2A`, `#555`, `#888`, spacing tokens, square corners) so the site's look is not broken.

### Saving
Each admin Server Action: `requireAdmin()` → validate (Zod) → `saveDocument(key, expectedVersion, …)` → `refreshContent(key)`. A version conflict is shown inside the editor.

### Do not
- Build temporary CRUD dashboards or interim admin screens for pages whose public UI does not exist yet — no code that will soon be deleted.

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

### In the admin
The same GNB component is reused; its links go to the `/admin/...` equivalents (§7C).

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

Publication opens the configured external Notion publication page. There is no internal `/publication` page: with `NOTION_PUBLICATION_URL` set, `/publication` redirects (307) to it (`next.config.mjs`, read at build time like the GNB link); without it, `/publication` is a 404.

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

Admin URLs mirror the public URLs (in-context editing, §7C):

```text
/admin/login          login (the only admin-only page)
/admin                ↔ /
/admin/award/[id]     ↔ /award/[id]
/admin/project        ↔ /project
/admin/project/[id]   ↔ /project/[id]
/admin/team           ↔ /team
```

Each admin page is added together with its public page (§31). No dashboard or per-collection CRUD pages.

---

## 23. Admin Authentication

Authorization is checked on the server: `src/proxy.ts` (first gate, cookie presence only) → `requireAdmin()` in `src/app/admin/(protected)/layout.tsx` and in **every** admin Server Action / Route Handler.

### Credentials (operator-managed, no env vars)
- Admin username and password hash live in a **separate private Blob store** (env `AUTH_BLOB_STORE_ID`), file `data/admin-auth/vNNNNNN.json`, **latest version only**. Never in the public store, the public content keys (`DataKey`) or content services.
- Content: `{ username, passwordHash ("scrypt:..."), sessionEpoch }`. Never a plaintext password; never log or display the password or the hash.
- Modules are `server-only` (`lib/auth/account-store.ts`, `account-cache.ts`, `session.ts`, `password.ts`) — importing them from client code fails the build.
- First account: `npm run admin:bootstrap` (developer, once). Forgotten password: `npm run admin:bootstrap -- --reset`. No web-based first-run setup.
- Afterwards the admin changes username/password at `/admin/account` (admin-only page). Order: `requireAdmin()` → verify current password (required even for a username-only change; ~1 s delay on failure) → Zod → server-side scrypt hash → versioned save → new `sessionEpoch` → refresh account cache → delete cookie → `/admin/login?changed=1`.

### Sessions
- Stateless HMAC-signed cookie (`SESSION_SECRET`, Vercel env, never editable in the admin UI): `{ sub, exp (8 h), epoch }`. HttpOnly, Secure (production), SameSite=Strict, no "keep me signed in".
- `requireAdmin()` checks signature, expiry **and** that the token's epoch equals the account's current `sessionEpoch` (read from a server-side cache tagged `auth:admin`, 60 s max age). Any account change invalidates all sessions at once; a CLI reset takes effect within ~1 minute.
- Login failure: ~1 s delay and one generic message for wrong ID or password. No lockout/IP blocking (no DB).

---

## 24. Vercel Blob Structure

JSON — each document is a folder of **immutable version files** (never overwritten):

```text
data/
├── home/       v000001.json, v000002.json, ...
├── awards/     v000001.json, ...
├── projects/
├── professor/
├── members/
└── settings/
```

Why: a public Blob store's CDN keeps serving the old content of an overwritten URL (observed `x-vercel-cache: HIT` with the old body minutes after an overwrite; `cache-control: max-age=2592000`), and `get({ useCache: false })` only bypasses the CDN for private stores. A new file per version always has a fresh URL.

Images (immutable too — unique file names, never overwritten):

```text
images/
├── home/
├── awards/
├── projects/
├── professor/
└── members/
```

Implementation: `src/config/storage.ts` (paths, `DATA_HISTORY_LIMIT`), `src/lib/blob/json-store.ts`, `src/lib/blob/initialize.ts`. Field-level reference: `docs/DATA_MODEL.md`.

---

## 25. JSON Versioning

Every version file contains its own metadata:

```json
{ "version": 3, "updatedAt": "2026-10-04T05:30:00.000Z", "items": [] }
{ "version": 3, "updatedAt": "2026-10-04T05:30:00.000Z", "data": {} }
```

Rules (implemented in `json-store.ts` — do not bypass it):
1. **Latest** = highest version among the files `list()`ed under `data/<key>/` (list is always current).
2. Admin edit starts from the latest version and remembers its number.
3. **Save** = create `data/<key>/v{n+1}.json` with `allowOverwrite: false`, only if the latest is still `n`. If two admins save from the same version, only one create succeeds; the other gets the conflict message. No last-write-wins.
4. **Retention**: the newest `DATA_HISTORY_LIMIT` (10) versions are kept; older ones are deleted after each save.
5. **Rollback** = `restoreDocumentVersion()`: save an older kept version's content as a new version (history is never rewritten).
6. **Reads**: public pages use `getPublishedDocument()` (Next data cache, tag `data:<key>`); admin code reads `json-store` directly (always latest). After a save call `refreshContent(key)` in a Server Action or `expireContent(key)` in a Route Handler.
7. Missing documents are created from `src/config/defaults.ts` via `ensureDocument()`.
8. **Version / pathname rules (confirmed):**
   - Never reuse a version number.
   - Never reset a document by deleting all versions and starting again at v1.
   - To reset, save the initial state as a new version above the current maximum (then prune older ones).
   - Never reuse a pathname that has been exposed through the CDN (data versions and images alike).
   Reason: version URLs that were ever read stay cached by the CDN, so a reused path serves stale content.

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

Flow (no upload-completed webhook):
1. `prepareImageUpload` (Server Action, `requireAdmin`): validates MIME / extension / size (jpeg, png, webp, avif; ≤ 10 MB) and **generates the path on the server**: `images/{kind}/{entityId}/{uuid}.{ext}`. The original file name is never used in storage.
2. Browser uploads directly with `uploadPresigned` → `src/app/api/admin/upload/route.ts` (own session check, 401 otherwise) issues a presigned PUT for **exactly that server-format path**, that content type, ≤ 10 MB, no overwrite, 5-minute validity.
3. `finalizeImageUpload` (Server Action): checks the stored file (exists, real size, content type, **image signature** from the first bytes). File-level failures delete the file and reject. Width/height come from the browser as metadata only (range 1–20000), never used for security; a metadata error rejects without deleting.
Client: `components/admin/edit/useImageUpload`, `ImageReplace`, `ImageListEditor` (add, ↑/↓, native drag & drop, delete with `ConfirmDialog`).

Lifecycle:
- An upload is temporary until a content save references it.
- A document may only reference images under its own kind (`DATA_IMAGE_KIND`); `saveDocument` refuses others.
- Removing an image from content never deletes the file immediately. When old content versions are pruned, an image is deleted only if a removed version referenced it **and no kept version of that document references it** (rollback-safe).
- Orphans (never referenced, e.g. cancelled edits or a lost version conflict): `npm run images:cleanup` (dry run) / `-- --delete`, only files older than `ORPHAN_IMAGE_MIN_AGE_HOURS` (24 h).
- `BLOB_WEBHOOK_PUBLIC_KEY` is not used for callbacks; it only has to exist because `handleUploadPresigned` checks for it (it is created automatically when the Blob store is connected).

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
│   │   └── (protected)/   # mirrors (public): page.tsx (= /), award/[id], project, team
│   └── api/
├── components/
│   ├── public/      # presentation components shared by public and admin pages
│   ├── admin/       # AdminBar, edit/ (editing kit) — never imported by public pages
│   └── common/      # design system: Logo, Button, form/Field
├── lib/
│   ├── auth/
│   ├── blob/
│   ├── validation/
│   └── utils/
├── services/        # content (cache), home, awards, projects, team
├── styles/          # tokens.css, typography.css
├── types/
└── config/
```

Simplify this structure where appropriate.

Do not introduce unnecessary architectural complexity.

---

## 31. Development Phases

Completed:
- Architecture and project structure; Vercel Blob connection (OIDC); JSON schemas, defaults and versioned storage; admin authentication (proxy, `requireAdmin`, session, logout).

Current order (confirmed — each page is built as Public UI first, then its in-context editing on the same components):

1. **Auth cleanup and AdminBar-based structure** — done
2. **Common Header / Footer public UI** (GNB, hamburger panel, footer; GNB link mapping for admin; footer contact editing)
3. **Image upload foundation** (`handleUploadPresigned` / `uploadPresigned`, validation, unique names, delete-after-save, ordering helpers)
4. **Home public UI + Home editing** (introduction, Why A2F, research fields, award list/pagination)
5. **Award Detail public UI + editing** (`/award/[id]`, `/award` → `/#award`)
6. **Project List / Detail public UI + editing**
7. **Team public UI + editing** (professor, students, alumni)
8. **Responsive / animation / QA** (ani1–3 analysis first), then production deployment

Content migration from the legacy JSON happens when each page's data is first needed; legacy public pages are removed as their replacements land.

---

## 32. UI Implementation Order

For each page:

```text
Figma MCP analysis (all four frames)
↓
layout / token summary
↓
component plan (shared presentation components + admin composition points)
↓
1440 → 1920 → 768 → 365
↓
admin page: same components + editing kit
↓
interaction implementation
↓
QA (public and admin)
↓
next page
```

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
VERCEL_OIDC_TOKEN        (Blob auth; provided on Vercel, pulled locally via `vercel env pull`)
BLOB_STORE_ID            (required with OIDC)
BLOB_WEBHOOK_PUBLIC_KEY  (required: handleUploadPresigned throws without it; auto-created with the public store)
AUTH_BLOB_STORE_ID       (private store for admin credentials; connect that store with prefix AUTH_BLOB)
SESSION_SECRET
NOTION_PUBLICATION_URL   (optional; GNB link + /publication redirect, read at build time)
NEXT_PUBLIC_SITE_URL     (optional until the final domain; see below)
```

- Do not add `BLOB_READ_WRITE_TOKEN` (OIDC only; it survives as a fallback in `blob:test` only).
- `AUTH_BLOB_WEBHOOK_PUBLIC_KEY` was removed (referenced by neither our code nor `@vercel/blob`; the private store has no upload path). Reconnecting the private store may create it again — it can be removed again.
- Site URL: `getSiteUrl()` in `src/config/site.ts` is the only source of absolute URLs (`metadataBase`, `sitemap.ts`, `robots.ts`): `NEXT_PUBLIC_SITE_URL` → `https://` + `VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000`. Only with `NEXT_PUBLIC_SITE_URL` set are pages indexable (robots announces the sitemap, no `noindex`); otherwise every page is `noindex, nofollow` and robots.txt only blocks `/admin` (crawlers must be able to fetch a page to see its noindex). Setting the final domain = set this one env and redeploy.

Admin username/password are not environment variables (see §23). Prefer OIDC for Blob. Browser image uploads must use `handleUploadPresigned` / `uploadPresigned` (works with OIDC); the older `handleUpload` requires `BLOB_READ_WRITE_TOKEN`.

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
- Phase 3 (schemas, defaults, versioned JSON storage — see §24/§25, `docs/DATA_MODEL.md`): done and verified on the dev store (freshness, concurrent saves, retention, rollback, Next cache invalidation). The dev store holds the initial documents for all six keys.
- Accounts: development runs on the owner's GitHub (`swhwang81/a2f`) / Vercel / Blob; the finished site moves to the client's accounts later (see `todo.md` §11).
- Figma MCP: connected (`.mcp.json`); SVG measurements verified and the resulting decisions recorded in §7A.
- Phase 4 (admin authentication): done and verified on a production build. Root `src/app/layout.tsx` = html/body, fonts (Hanken via next/font, Pretendard CDN), `styles/tokens.css`, `styles/typography.css`, globals; public chrome in `src/app/(public)/layout.tsx`; admin in `src/app/admin/` (`login/`, `(protected)/` guarded by `requireAdmin()` and showing `AdminBar`, `(protected)/account/`); first gate in `src/proxy.ts`. `SESSION_SECRET` is set in Vercel for all three environments.
- Admin credentials moved from env vars to the private Blob store (§23): code done (`versioned-store` factory shared with content, `account-store`, epoch-based session invalidation, `/admin/account`, `npm run admin:bootstrap`). Private store `a2f-dev-private` connected; verified on a production build (24 checks: login, current-password checks, username-only and password changes, all sessions invalidated, logout; anonymous access 403). The test account was deleted — the private store is empty until the owner runs `npm run admin:bootstrap`.
- Admin direction changed to in-context editing (§7C) and the phase order to page-by-page "public UI + editing" (§31). Step 1 (auth cleanup + AdminBar structure) is done; `/admin` shows a placeholder until the Home step. Shared design system so far: tokens, typography, fonts, `Logo` (Figma assets in `src/assets/brand/`), `Button`, `form/Field`.
- Legacy cleanup (after step 7): the old `/news`, `/education`, `/publication` pages, `src/app/(public)/data/` (legacy JSON, templates, README) and the legacy global `main` rule were removed; `/news` and `/education` are 404. No reference to the deleted old Blob store remains. Lint: 0 errors, 0 warnings. Production preparation: `getSiteUrl()` + `metadataBase` / `sitemap.ts` (static pages + existing award/project details) / `robots.ts`; `AUTH_BLOB_WEBHOOK_PUBLIC_KEY` removed from Vercel.
- Not yet decided: ffmpeg installation (decide before the animation phase).

- Step 2 (common Header / Footer): done — `components/public/layout/` (SiteHeader, HeaderNav, MobileMenu, FooterView, SiteFooter), sticky header (below the AdminBar in admin via `--sticky-offset`), hamburger panel (0.25 s slide/fade, off with reduced motion), footer in-context editing (`components/admin/edit/Editable`, `InlineTextEditor`, `editors/FooterTextEditor`, `admin/(protected)/settings-actions.ts`). Verified against Figma at 365/768/1440/1920 and with an admin editing E2E test.

- Step 3 (image upload foundation): done — §27. Verified on the dev store (UI 23, HTTP security 15, retention/orphan 11 checks); the temporary test page was removed.

- Step 4a (Home static UI + Home in-context editing): approved and cleaned up (Contact at 768, black blocks as decoration, sample awards removed — awards.json is an empty list again, card links off until step 5). Implemented — `components/public/home/` (HomeMain, HomeHeadline, HomeCollage, HomeVisual, WhySection, ResearchFieldGrid, HomeGallery, AwardSection, ContactSection), `components/public/award/` (AwardCard, AwardTypeIcon), `components/public/ui/` (FilterDropdown, Pagination, useMediaQuery); admin `/admin` composes the same sections with `Editable`, `InlineFieldsEditor`, `ImageReplace` (fill), `EditPanel`, `ListControls` and the actions in `admin/(protected)/{home,award,settings}-actions.ts`. `home.json` gained `visuals`. The legacy `(public)/page.js` and its global styles were removed. `next.config.mjs` sets `agentRules: false` (otherwise `next dev` appends its own block to this file).

- Step 4b (animations): approved — ani1 in `components/public/award/AwardCard.module.css` (1440+), ani3 in `components/public/home/HomeCollage.module.css` (`animation-timeline: scroll(root)`, 768+, guarded by `prefers-reduced-motion: no-preference` and `@supports`). Confirmed scope: public 1920/1440 full ani3, 768 simplified, 365 / reduced motion / unsupported browsers static; the admin Home is always static (its page wrapper sets `--scroll-motion-timeline: none`; no admin flag in public components). ani1 runs in the admin too.

- Step 5 (Award Detail): approved — public `/award/[id]` (`components/public/award/AwardDetail`), admin `/admin/award/[id]` (summary / body / images in place, People in an EditPanel via `Editable panelTitle`, delete with confirmation; partial save actions in `award-actions.ts`), `not-found.tsx` (root and `(public)`), redirects in `next.config.mjs`. `AWARD_DETAIL_AVAILABLE` is now `true` (Home cards link to the detail page).
- Step 6 (Project List / Detail): approved; Award/Home regression after the shared refactors verified — public `/project` (`components/public/project/ProjectList`, `ProjectCard` + `useHoverCycle`, `ProjectTag`, `ProjectPage`), `/project/[id]` (`ProjectDetail`), shared `components/public/people/PeopleList` (Award People + Project member), `components/public/ui/ScrollToTop`, `useUrlSearch`; admin `/admin/project` (`AdminProjectList`, `ProjectForm`) and `/admin/project/[id]` (`ProjectDetailEditors`), actions in `project-actions.ts`. Legacy `(public)/project/*` and `data/project.json` removed.
- Step 7 (Team): approved (pixel match yields to operational stability: addresses wrap from the stored addressLines, no forced Figma line breaks; long 1920 Research lines wrap inside the column) — public `/team` (`components/public/team/`: TeamPage, TeamIntro, ProfessorProfile, ProfessorPhotos, MemberSection, TeamMember; `config/team.ts`), admin `/admin/team` (`TeamEditors`, `AdminMemberSection`, `MemberForm`, kit `edit/StringListEditor`), actions in `team-actions.ts`. `professor.json` gained `teamIntro`; the dev store's empty initial profile was replaced by the Figma profile as a new version. Legacy `data/members.json` removed.
- Note: data written outside the admin (scripts) does not invalidate the Next data cache; a local `next build` can reuse `.next/cache` from an earlier build (clear it when testing with script-written data).
