# A2F Home Animation Analysis and Implementation Guide

## 1. Purpose

This document defines how Claude Code must analyze and reproduce the supplied Home animation reference videos.

The project folder will contain **three MP4 animation reference files**.

These MP4 files are design references.

They are **not** intended to be inserted directly into the website as normal `<video>` backgrounds or autoplay videos unless explicitly requested.

The goal is to reproduce the intended visual motion as native web animation using the actual Figma/SVG assets.

> **Confirmed reference roles (overrides any wording below that treats all three videos as Home animation).**
>
> The three MP4 files are **not** three views of one Home animation. Each covers exactly one interaction:
>
> | File | Interaction | Figma node |
> |---|---|---|
> | `references/animation/a2f_ani1.mp4` | Award / Activity card hover | `Hover type 1` — 0:2757 |
> | `references/animation/a2f_ani2.mp4` | Project representative image hover | `Hover type 2` — 0:2875 |
> | `references/animation/a2f_ani3.mp4` | **Home scroll animation** | `A2F - Home` (Scroll) — 0:2642 |
>
> - The Home scroll animation (this guide's main subject) uses **only `a2f_ani3.mp4`**.
> - `a2f_ani1.mp4` and `a2f_ani2.mp4` are analyzed separately, each against its own Figma node, using the same procedure (metadata → key frames → Figma comparison → plan → approval). Their scroll-specific sections (§11, §12, §20, §21) do not apply.
> - Never merge the three videos into one Home timeline. Where sections §8, §17 and §25 say "compare the three videos", read it as "analyze each video against its own interaction".
> - The final Home phrase is "Approach 2 Flux, Access 2 Frame". The Figma animation frame shows "Approach 2 Flow" — an old version/typo; do not use it.
> - ffmpeg is not installed yet; decide on installing it before the animation phase starts.

---

## 2. Reference Priority

For Home animation work, use the following priority:

1. Figma via Figma MCP
   - exact visual elements
   - layers
   - coordinates
   - dimensions
   - typography
   - assets

2. Home SVG references
   - 365 Home.svg
   - 768 Home.svg
   - 1440 Home.svg
   - 1920 Home.svg
   - related Hamburger references where relevant

3. Three MP4 reference videos
   - motion behavior
   - sequence
   - direction
   - scale
   - opacity
   - overlap
   - timing
   - scroll feel

4. Development requirements
   - intended interaction behavior

Do not use video frames as substitutes for actual site graphics if the corresponding element exists in Figma.

---

## 3. Recommended Video Location

Preferred project structure:

```text
project-root/
├── CLAUDE.md
├── HOME_ANIMATION_GUIDE.md
└── references/
    └── animation/
        ├── a2f_ani1.mp4
        ├── a2f_ani2.mp4
        └── a2f_ani3.mp4
```

The exact filenames may differ.

When beginning animation analysis:

1. search `references/animation/` for MP4 files
2. confirm exactly three reference videos are present
3. list the filenames
4. report duration, resolution, and frame rate for each
5. do not rename or modify the originals

If the videos are instead stored in the project root, locate them there and report their paths.

---

## 4. Do Not Implement Before Analysis

Do not begin coding the Home animation immediately.

First:
1. inspect Figma
2. inspect Home SVG references
3. inspect all three MP4 files
4. extract representative video frames
5. compare the videos
6. build an animation timeline
7. report the proposed implementation
8. wait for approval if approval is requested

---

## 5. MP4 Technical Inspection

Use `ffprobe` or an equivalent local video tool if available.

For each MP4, collect:

```text
filename
duration
width
height
frame rate
codec
```

Example:

```bash
ffprobe -v error \
-show_entries format=duration \
-show_entries stream=width,height,r_frame_rate,codec_name \
-of default=noprint_wrappers=1 \
references/animation/example.mp4
```

Do not infer technical metadata from filename or appearance.

---

## 6. Frame Extraction

Do not rely only on interpreting the MP4 as a continuous video.

Extract representative frames first.

Create a temporary analysis directory:

```text
.tmp/home-animation-analysis/
```

Do not commit this directory.

Add it to `.gitignore` if necessary.

### Initial extraction

Start with approximately 2 frames per second:

```bash
mkdir -p .tmp/home-animation-analysis/video-1

ffmpeg \
-i references/animation/<video-file>.mp4 \
-vf "fps=2" \
.tmp/home-animation-analysis/video-1/frame_%04d.png
```

If movement is too fast or transitions are missed, increase only the relevant segment to approximately 4–5 fps.

Do not unnecessarily extract hundreds of frames at high frequency.

---

## 7. Contact Sheet

When useful, create a contact sheet from the extracted frames so the sequence can be inspected chronologically.

Use it to identify:
- major state changes
- image movement
- scaling
- fades
- overlap
- entry and exit points

Do not use contact sheets as production assets.

---

## 8. Analyze All Three Videos Separately

Do not assume the three MP4 files show identical behavior.

For each video, report:

```text
Video
Purpose / apparent viewport
Duration
Initial state
Final state
Major animation stages
Primary moving elements
Notes
```

Then compare the three videos.

Identify whether they represent:
- different breakpoints
- different parts of the animation
- alternate animation proposals
- different scroll ranges
- repeated recordings of the same interaction

Do not silently choose one video as authoritative if their purpose is unclear.

---

## 9. Element-Level Animation Analysis

For every meaningful animated element, identify:

```text
element
initial position
final position
translation
scale
opacity
rotation
clipping/masking
z-index / stacking
start point
end point
easing behavior
```

Exact numeric values should come from Figma where possible.

Video should primarily define the motion between states.

---

## 10. Build a Normalized Timeline

Represent animation progress using:

```text
0.00 → animation start
1.00 → animation end
```

Example only:

```text
0.00 Initial Hero
0.15 Primary image begins moving
0.30 Headline shifts
0.45 Secondary image appears
0.65 Image scale increases
0.80 Composition transitions toward next section
1.00 Animation complete
```

Do not copy these example values blindly.

Derive the actual stages from the three MP4 files.

---

## 11. Scroll-Driven Animation

If the videos represent a scroll interaction, implement the website animation as scroll-driven rather than simple autoplay.

Expected model:

```text
scroll position
↓
normalized progress 0..1
↓
animation state
```

The animation should respond naturally when the user:
- scrolls forward
- stops scrolling
- scrolls backward

If the reference behaves like scrubbed scrolling, the web version should be reversible with scroll.

Do not implement an irreversible autoplay sequence unless the source clearly indicates autoplay.

---

## 12. Determine Scroll Range

Before coding, propose the required scroll distance.

Example only:

```text
animation section height: 250vh
sticky viewport: 100vh
usable scroll range: 150vh
```

Derive the actual range from:
- number of stages
- visual complexity
- Figma composition
- MP4 behavior
- desired scroll feel

Report the proposed scroll range before final implementation.

---

## 13. Recommended DOM Strategy

Prefer real HTML and image elements.

Typical structure:

```text
<section class="hero-animation">
  <div class="hero-animation__sticky">
    <HeroText />
    <HeroImageA />
    <HeroImageB />
    <HeroImageC />
  </div>
</section>
```

Use:
- CSS transforms
- opacity
- clipping
- sticky positioning

Do not replace accessible text with rasterized video frames.

Avoid canvas unless there is a strong implementation reason.

---

## 14. Animation Technology Selection

Choose the simplest technology that can faithfully reproduce the motion.

Priority:

1. CSS transforms / opacity / sticky
2. requestAnimationFrame with normalized scroll progress
3. Framer Motion
4. GSAP + ScrollTrigger

Use CSS/native logic when:
- only translate / scale / opacity are needed
- timeline is simple
- only a few elements move

Consider Framer Motion when React motion values materially simplify implementation.

Consider GSAP ScrollTrigger when:
- accurate scrub timing is required
- many elements animate through multiple stages
- pinning/sticky coordination is complex
- transitions are tightly synchronized

Do not install both Framer Motion and GSAP without a clear reason.

Report the chosen approach before adding a large dependency.

---

## 15. Performance Requirements

Prefer GPU-friendly properties:
- transform
- opacity

Avoid frequent animation of layout-triggering properties:
- width
- height
- top
- left
- margin

Prefer transform-based positioning.

Do not trigger React state updates on every scroll pixel.

Use an efficient scroll mechanism such as:
- requestAnimationFrame
- motion values
- GSAP internals

Clean up:
- event listeners
- observers
- timers
- animation contexts

on unmount.

---

## 16. Responsive Animation Strategy

Do not apply one fixed desktop animation coordinate system to all breakpoints.

Analyze independently:
- 365
- 768
- 1440
- 1920

### 365
- prioritize readability
- simplify motion if necessary
- avoid excessive off-screen travel
- keep animation performant
- do not depend on hover

### 768
- use Tablet-specific Figma geometry
- do not simply enlarge 365 behavior

### 1440
- use as the initial desktop implementation reference unless the source clearly suggests otherwise

### 1920
- adjust coordinates, scale, and spacing using the actual 1920 Figma frame
- do not simply enlarge 1440 proportionally

Where possible, share normalized animation logic while using breakpoint-specific start/end geometry.

---

## 17. Handling the Three MP4 Files

If the three videos correspond to different screen sizes, map them explicitly:

```text
video A → breakpoint ...
video B → breakpoint ...
video C → breakpoint ...
```

If their relationship is uncertain:
- do not guess
- report the visual evidence
- ask for confirmation if required

If no video exists for one breakpoint, derive that animation conservatively from:
- Figma layout
- SVG state
- nearest relevant video

Clearly report when interpolation is being used.

---

## 18. Figma vs MP4 Responsibilities

Figma determines:
- what the element is
- where it begins/ends
- dimensions
- typography
- visual assets
- layer structure

MP4 determines:
- how it moves
- when it moves
- how fast it appears to move
- transition order
- visual rhythm
- intermediate-state behavior

Do not derive exact typography or artwork from compressed video when Figma provides the original.

---

## 19. Animation State Model

Prefer explicit stages or a normalized continuous progress value.

Avoid scattered magic numbers across components.

Centralize animation constants when practical, for example:

```text
src/config/home-animation.ts
```

Possible contents:
- stage boundaries
- easing definitions
- breakpoint-specific parameters

Do not over-engineer if the final animation is simple.

---

## 20. Sticky and Pinning Behavior

If the first viewport remains visually fixed while elements animate during scroll, prefer:

```text
long scroll section
└── sticky 100vh viewport
    └── animated elements
```

Do not use JavaScript to fake fixed positioning when CSS sticky is sufficient.

Check:
- section exit
- transition to next section
- browser resize
- Mobile Safari behavior

---

## 21. Reverse Scroll

Test reverse scrolling.

The user should be able to:
- scroll into the animation
- scroll backward
- return to the initial composition

Animation state must remain deterministic.

---

## 22. Reduced Motion

Support:

```css
@media (prefers-reduced-motion: reduce)
```

Possible reduced-motion behavior:
- shorten translation distances
- remove fast scale changes
- disable nonessential scrub effects
- show a stable representative composition

Core content must remain accessible when motion is reduced.

---

## 23. Visual Comparison

After implementation, compare the rendered site against:
- Figma
- SVG reference
- representative MP4 frames

At minimum compare:
- initial state
- 25% progress
- 50% progress
- 75% progress
- final state

Inspect:
- position
- scale
- opacity
- crop
- stacking
- typography alignment

Do not declare completion from memory alone.

---

## 24. Browser QA

At minimum test:
- Chromium-based browser
- Safari where available

Inspect especially:
- sticky positioning
- viewport-height behavior
- resize
- image loading
- reverse scroll
- mobile scroll

---

## 25. Required Animation Analysis Report Before Coding

Before implementing animation, report:

### A. Video inventory
For each of the three MP4s:
- filename
- duration
- resolution
- fps
- likely purpose

### B. Video relationship
Explain how the three videos relate to each other.

### C. Animation stages
List the detected sequence of stages.

### D. Animated elements
For each element:
- source asset
- start state
- end state
- motion
- progress interval

### E. Scroll mapping
Propose:
- sticky region
- scroll distance
- normalized progress mapping

### F. Technology
Recommend one:
- CSS/native
- Framer Motion
- GSAP ScrollTrigger

Explain why.

### G. Responsive behavior
Explain intended behavior for:
- 365
- 768
- 1440
- 1920

### H. Performance risks
Identify:
- large images
- excessive layers
- expensive effects
- mobile concerns

### I. Uncertain points
List anything that cannot be established from Figma/SVG/video.

Do not implement until this report is complete.

---

## 26. Implementation Procedure After Approval

After analysis is accepted:

1. create reusable Home animation components
2. implement 1440 behavior first
3. compare against 1440 Figma/SVG/video
4. implement 1920 adjustments
5. implement 768 behavior
6. implement 365 behavior
7. implement reduced-motion fallback
8. test forward/reverse scroll
9. verify performance
10. run lint/build
11. report differences from references

---

## 27. Do Not

Do not:
- insert the MP4 itself as the final animation without instruction
- convert the whole video to a production frame sequence by default
- use hundreds of PNG frames as the website animation without explicit justification
- guess Figma geometry from video
- add unrelated effects
- change the design because another animation appears more attractive
- use one fixed coordinate set at all breakpoints
- ignore reverse scrolling
- ignore reduced-motion accessibility
- commit extracted temporary frames
- modify the original MP4 files

---

## 28. First Animation Task

When animation work begins, do only the following:

1. locate all three MP4 reference videos
2. inspect their technical metadata
3. locate the relevant Home Figma frames
4. locate the Home SVG references
5. extract low-frequency analysis frames from each MP4
6. compare the videos
7. create the animation analysis report described above

Do not yet:
- install GSAP
- install Framer Motion
- modify Home production components
- write final animation code
- change Figma-derived layout
- embed the MP4 videos in the public site

Stop after presenting the analysis and proposed implementation plan.
