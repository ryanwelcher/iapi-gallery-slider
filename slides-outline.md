# Slides Outline — Building Interactive Blocks with the Interactivity API

**Delivery model:** slide-driven. Theory lives on slides (talk tracks); hands-on work happens during **pause slides** that stay on screen while the room codes from `workshop-outline/section-N.md`. Slides never carry copy-paste code — fragments for explanation only; the section files and `code-reference/` snapshots carry the code.

Three recurring slide types:

- **[T] Talk track** — theory, diagrams, annotated fragments. You narrate; laptops can be closed.
- **[P] Pause slide** — distinctive background. Mission / file pointer / done-when / timebox / rescue path. Stays up for the whole lab block.
- **[C] Checkpoint** — "you should now have…" + live demo of the working result on the projector. The pacing valve: anyone unfinished catches up via snapshot while you demo.

Timing references the run sheet in `facilitator-notes.md`.

---

## Opening (0:00–0:08 · slides 1–6)

### Slide 1 [T] — Title
- Building Interactive Blocks with the Interactivity API
- WCEU 2026 · Ryan Welcher, Automattic · @ryanwelcher

### Slide 2 [T] — Who am I?
- Developer Advocate at Automattic
- Where to find me (YouTube / Twitch / blog)

### Slide 3 [T] — What are we building?
- Live demo of the finished gallery slider (real browser, not a screenshot): slide, bounds, autoplay, adaptive count
- One sentence: "server-rendered block, no front-end framework, fully interactive"

### Slide 4 [T] — Setup check
- Studio site from `blueprint.json` · plugin active · `npm run start` running
- Playground fallback link for anyone stuck
- Speaker note: don't hold the room — pair stragglers with a neighbor, keep moving

### Slide 5 [T] — How today works
- Talk tracks (watch) → pause slides (you code) → checkpoints (we sync)
- `workshop-outline/section-N.md` is your hands-on script; code from the files, not the screen
- **`code-reference/section-N/` is the rescue path — falling behind is never fatal**

### Slide 6 [T] — The arc
- Editor controls → smallest interactive loop → sliding + bounds → server-seeded context → autoplay
- Section 9 (focus a11y, touch, continuous) is your take-home

---

## Section 2 — Anatomy of the Starter (0:08–0:16 · slides 7–12, all [T])

### Slide 7 [T] — The file map
- Tree view of the plugin: entry PHP, `block.json`, `edit.js`, `render.php`, `view.js`
- "We tour the starter now so every later change lands in a file you recognize"

### Slide 8 [T] — `iapi-gallery-slider.php`
- Screenshot/fragment: `register_block_type` and nothing else
- "In Section 7 this file grows a render filter — that's the only PHP we'll write"

### Slide 9 [T] — `src/block.json`
- Highlighted lines: `supports.interactivity: true`, `viewScriptModule`, three attributes
- Flag now: `speed` is `"type": "string"` — "remember that; it bites in Section 8"

### Slide 10 [T] — **The opt-in pair** ★ recurring motif
- Two-panel diagram: `supports.interactivity: true` (loads the engine) ⇄ `data-wp-interactive` (gives it a place to bind)
- "Miss the flag → runtime never loads. Miss the directive → runtime has nothing to bind to."
- Speaker note: you will flash back to this slide during debugging moments — keep its visual distinctive

### Slide 11 [T] — `src/edit.js` + `src/render.php`
- edit.js: near-empty stub — "Section 3 builds this"
- render.php: wrapper, `.slider-container`, prev/next buttons, and the one directive already present: `data-wp-interactive='iapi-gallery'`

### Slide 12 [T] — `src/view.js`
- Doesn't exist meaningfully yet — "Section 5 creates the store here; this file is where the workshop lives from Section 5 on"

---

## Section 3 — Editor Controls (0:16–0:31 · slides 13–16)

### Slide 13 [T] — What Section 3 is (and isn't)
- "Pure block editor — zero Interactivity API. We're building the attributes the IAPI sections will read."
- The three attributes → the three Inspector controls

### Slide 14 [T] — The pieces
- `useBlockProps` / `useInnerBlocksProps` + `allowedBlocks` (Image, Cover, Media & Text)
- `InspectorControls` + `PanelBody` + `ToggleControl` + `__experimentalNumberControl as NumberControl`
- Import-map callout: which package each import comes from (the #1 sticking point)
- Conditional rendering: Slide Duration only when Autoplay is on

### Slide 15 [P] — LAB: build `edit.js`
- **Mission:** editor preview + "Slider Controls" Inspector panel
- **Where:** `workshop-outline/section-3.md`, all steps
- **Done when:** block inserts with inner-block area restricted to the 3 types; toggles + conditional number control work
- **⏱ 10 min** · behind? `code-reference/section-3/src/edit.js`
- Speaker note: *this is the pre-planned cut* — running late, demo the finished panel for 3 min, point at the snapshot, jump to slide 17

### Slide 16 [C] — Checkpoint
- Demo: insert block, toggle Autoplay, watch Slide Duration appear
- "Everyone either has this or has copied it — both fine. Laptops closed for the next bit."

---

## Section 4 — IAPI Primer (0:31–0:39 · slides 17–21, all [T])

### Slide 17 [T] — The round-trip loop ★ reused in Section 5
- Circular diagram: directive reads store → event fires action → action mutates context → directives re-render
- "Every section from here is this loop with more parts"

### Slide 18 [T] — Directives at a glance (1 of 2)
- `data-wp-interactive` (the region), `data-wp-context` (per-instance data), `data-wp-text`, `data-wp-on--{event}`
- One-line job description each — no exhaustive reading; "each gets re-taught the moment we use it"

### Slide 19 [T] — Directives at a glance (2 of 2)
- `data-wp-bind--{attr}`, `data-wp-style--{prop}`, `data-wp-init`
- Same treatment

### Slide 20 [T] — Context vs state ★ reused in Section 6 and Section 7
- Diagram: N slider instances, each with its own context box; one shared state box with getters reaching into context
- The sentence that predicts every later bug: **"context is per-instance; state is shared and derived"**

### Slide 21 [T] — The server's role
- `wp_interactivity_data_wp_context()` seeds context; `wp_interactivity_state()` seeds state
- "The server paints the first frame; the client takes over without a flash — Section 7 proves this with a demo"

---

## Section 5 — Hello, Store (0:39–0:49 · slides 22–25)

### Slide 22 [T] — The smallest possible loop
- Re-show slide 17's loop diagram, now with real names: `data-wp-on--click` → `actions.nextImage` → `ctx.currentSlide++` → `data-wp-text`

### Slide 23 [T] — The namespace contract
- Fragment pair, highlighted: `data-wp-interactive='iapi-gallery'` ⇄ `store( 'iapi-gallery', … )`
- "These must agree. Neither has to match the block name `iapi/gallery-slider`."
- Speaker note: say it *before* they type — a namespace typo fails silently and is the #1 failure of the day

### Slide 24 [P] — LAB: first round-trip
- **Mission:** next button bumps a counter on the page
- **Where:** `workshop-outline/section-5.md`, steps 1–5
- **Done when:** counter renders "1", next bumps it 2·3·4 *and keeps going past 3* (expected!), prev inert, no console errors
- **⏱ 7 min** · behind? `code-reference/section-5/`
- Speaker note: walk the room; check for silent-failure namespace typos and stopped watchers

### Slide 25 [C] — Checkpoint · minute-50 gate
- Demo the working counter, including running past 3 — "that bug is Section 6's job"
- Speaker note: **run-sheet checkpoint — if this slide isn't on screen by 0:50, engage cut lines (facilitator-notes.md)**

---

## Section 6 — Sliding + Bounds (0:49–0:59 · slides 26–28)

### Slide 26 [T] — Derived state
- Re-show slide 20 (context vs state), now filled in: `noPrevSlide`, `noNextSlide`, `imageIndex`, transform — all *computed from* `currentSlide`/`totalSlides`
- "Disable logic is derived, so it lives in state getters, not context. Getters re-run on every read — sync for free."
- New directives, one line each: `data-wp-style--transform`, `data-wp-bind--disabled`

### Slide 27 [P] — LAB: make it slide
- **Mission:** slides move, buttons gray out at the ends, counter reads "X/3"
- **Where:** `workshop-outline/section-6.md`, all steps
- **Done when:** prev+next both work, disabled at ends, transform animates
- **⏱ 7 min** · behind? `code-reference/section-6/`
- Speaker note: watch for transform off-by-one (slide 1 = translateX(0)) and unitless getter returns

### Slide 28 [C] — Checkpoint
- Demo: full slide-and-bounds behavior
- "Still hardcoded `totalSlides: 3` — the server fixes that next"

---

## Section 7 — Server-Side Directive Injection (0:59–1:12 · slides 29–32)

### Slide 29 [T] — The render filter + tag processor walk
- Step diagram of the single-pass walk: land on wrapper → `set_bookmark` → count slide classes forward → `seek` back → `set_attribute( 'data-wp-context', … )`
- `render_block_iapi/gallery-slider` — exact hook name on screen
- Namespace inheritance callout: "we do NOT set `data-wp-interactive` on inner blocks — descendants inherit" (flash back to slide 10)

### Slide 30 [T] — The hydration flash
- Two-frame visual: pre-hydration empty counter → hydrated "1/N"
- Live demo on the projector with CPU 6× + Slow 4G throttling — "on your fast laptop you may never see it; real devices do"
- The fix and the contract: `wp_interactivity_state()` seed **must mirror what the client getter computes** on first paint

### Slide 31 [P] — LAB: real slide counts, no flash
- **Mission:** filter counts inner blocks and seeds context + state
- **Where:** `workshop-outline/section-7.md`, steps 1–5
- **⚠ Don't reload between steps 1 and 3** — no context = console errors until the filter is registered
- **Done when:** adding a 4th block makes the counter read "X/4" with no flash
- **⏱ 8 min** · behind? `code-reference/section-7/`
- Speaker note: sticking points — hook-name mismatch, `wp-block-image` (not `core/image`) in `$allowed_blocks`

### Slide 32 [C] — Checkpoint
- Demo: add/remove an inner block in the editor, counter adapts
- "The slider is now adaptive. Last piece in the room: autoplay."

---

## Section 8 — Autoplay (1:12–1:25 · slides 33–36)

### Slide 33 [T] — Callbacks: the third slot
- Store diagram grows its third branch: `state` / `actions` / **`callbacks`**
- `data-wp-init` fires at element initialization; returning a function *is* the cleanup registration
- Why destructure `const { state, actions } = store(…)`: callbacks call actions directly from a rAF tick

### Slide 34 [T] — `withScope` in one slide
- Fragment: the rAF `update` tick wrapped in `withScope`
- "A rAF tick runs outside the Interactivity scope — without the wrapper, `getContext()` and `state` are undefined"
- The string-attribute payoff from slide 9: `Number( ctx.speed ) * 1000`

### Slide 35 [P] — LAB: autoplay
- **Mission:** Autoplay toggle drives the slider at the chosen speed; loop cleans up
- **Where:** `workshop-outline/section-8.md` — setup edits first, then **mid-lab checkpoint** (save/reload, behavior unchanged), then the callbacks block
- **Done when:** autoplay advances and wraps; toggling off stops it; no leaked frames
- **⏱ 9 min** · behind? `code-reference/section-8/`
- Speaker note: "autoplay doesn't start" → check the toggle in the Inspector *before* the code. Running late? This section demos well — see cut line 3.

### Slide 36 [C] — Checkpoint
- Demo: autoplay at two different speeds; toggle off mid-run
- "That's the complete slider."

---

## Wrap-up (1:25–1:30 · slides 37–40, all [T])

### Slide 37 [T] — The arc, revisited
- Slide 6's arc with everything checked off: opt-in pair → round-trip → derived state → server seeding → lifecycle

### Slide 38 [T] — Your take-home: Section 9
- Focus a11y (APG carousel pattern) · touch/swipe · continuous wrap
- "Zero new IAPI primitives — you already know everything it needs"
- `workshop-outline/section-9.md` + `code-reference/section-9/` as the answer key

### Slide 39 [T] — Where to go next
- Interactivity API reference on developer.wordpress.org · Block Editor Handbook
- #core-interactivity-api on Make WordPress Slack

### Slide 40 [T] — Thanks / Q&A
- Repo URL + QR code · contact
- Speaker note: likely questions are pre-gamed in the Q&A section of `facilitator-notes.md`
