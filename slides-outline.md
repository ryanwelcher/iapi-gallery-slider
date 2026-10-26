# Slides Outline — Building Interactive Blocks with the Interactivity API

**Delivery model:** slide-driven. Theory lives on slides (talk tracks); hands-on work happens during **pause slides** that stay on screen while the room codes from `workshop-outline/section-N.md`. Slides never carry copy-paste code — fragments for explanation only; the section files and `code-reference/` snapshots carry the code.

Three recurring slide types:

- **[T] Talk track** — theory, diagrams, annotated fragments. You narrate; laptops can be closed.
- **[P] Pause slide** — distinctive background. Mission / file pointer / done-when / timebox / rescue path. Stays up for the whole lab block.
- **[C] Checkpoint** — "you should now have…" + live demo of the working result on the projector. The pacing valve: anyone unfinished catches up via snapshot while you demo.

Timing references the run sheet in `facilitator-notes.md`.

---

## Opening (0:00–0:08 · slides 1–5)

### Slide 1 [T] — Title
- Building Interactive Blocks with the Interactivity API
- Ryan Welcher, Automattic · @ryanwelcher

### Slide 2 [T] — Who am I?
- Developer Advocate at Automattic
- Where to find me (YouTube / Twitch / blog)

### Slide 3 [T] — What are we building?
- Live demo of the finished gallery slider (real browser, not a screenshot): slide, bounds, autoplay, adaptive count
- One sentence: "server-rendered block, no front-end framework, fully interactive"
- Four behavior cards, each tagged with the section that builds it: slides + bounds (Sections 5–6) · adaptive (Section 7) · no flash (Section 7) · autoplay (Section 8). This doubles as the map of the day
- Lead-in says Section 3 (editor controls) comes first; a closing line names Section 9 (focus a11y, touch, continuous) as the take-home

### Slide 4 [T] — Setup check
- Studio site from `blueprint.json` · plugin active · `npm run start` running
- Editor open on the plugin folder — the `workshop-outline/` section files and `code-reference/` snapshots live in it
- Repo URL on screen (github.com/ryanwelcher/iapi-gallery-slider) — README has the Playground fallback
- Speaker note: don't hold the room — pair stragglers with a neighbor, keep moving

### Slide 5 [T] — How today works
- Talk tracks (watch) → pause slides (you code) → checkpoints (we sync)
- `workshop-outline/section-N.md` is your hands-on script; code from the files, not the screen
- **`code-reference/section-N/` is the rescue path — falling behind is never fatal**

---

## Section 2 — Anatomy of the Starter (0:08–0:16 · slides 6–8, all [T])

### Slide 6 [T] — The file map
- Tree view of the plugin: entry PHP, `block.json`, `edit.js`, `render.php`, `view.js`
- "We tour the starter now so every later change lands in a file you recognize"
- The PHP file only calls `register_block_type` (reads `build/block.json`, loads every asset); Section 7 adds a render filter, its only change today
- `edit.js` and `view.js` are near-empty stubs that Sections 3 and 5 build; the tree's comments say so, no separate slides

### Slide 7 [T] — `src/block.json`
- Four bullets, each lighting up its line in the code: `supports.interactivity: true` turns the API on (one half of the opt-in pair on the next slide) · `viewScriptModule` · three attributes · `speed` is a string
- Flag now: `speed` is `"type": "string"` because `NumberControl` hands back a string — "remember that — we convert it to a number before doing math with it in Section 8"

### Slide 8 [T] — **The opt-in pair** ★ recurring motif
- Two-panel diagram: `supports.interactivity: true` (loads the engine) ⇄ `data-wp-interactive` (gives it a place to bind)
- "Miss the flag → runtime never loads. Miss the directive → runtime has nothing to bind to."
- The `render.php` card carries a trimmed snippet of the starter markup (wrapper, `.slider-container`, buttons) with `data-wp-interactive='iapi-gallery'` highlighted: the half of the pair that's already in place
- Speaker note: you will flash back to this slide during debugging moments — keep its visual distinctive

---

## Section 3 — Editor Controls (0:16–0:31 · slides 9–11)

### Slide 9 [T] — The pieces
- Lead line under the title: "This section is all block editor, with no Interactivity API at all. We're building the Inspector controls for `continuous`, `autoplay`, and `speed`, so the IAPI sections have something to read."
- `useBlockProps` / `useInnerBlocksProps` + `allowedBlocks` (Image, Cover, Media & Text)
- `InspectorControls` + `PanelBody` + `SwitchControl` (from `@wordpress/ui`) + `__experimentalNumberControl as NumberControl`
- Import-map callout: which package each import comes from (the #1 sticking point)
- Code shows the imports and, under them, the Inspector panel: `SwitchControl` with `onCheckedChange` → `setAttributes`, and `{ autoplay && <NumberControl … /> }` for Slide Duration only when Autoplay is on

### Slide 10 [P] — LAB: build `edit.js`
- **Mission:** editor preview + "Slider Controls" Inspector panel
- **Where:** `workshop-outline/section-3.md`, all steps
- **Files:** `src/edit.js`
- **Done when:** block inserts with inner-block area restricted to the 3 types; toggles + conditional number control work
- **⏱ 10 min** · behind? `code-reference/section-3/src/edit.js`
- **Done early?** open the post's code editor view and watch the attributes serialize into the block comment
- Speaker note: *this is the pre-planned cut* — running late, demo the finished panel for 3 min, point at the snapshot, jump to slide 12

### Slide 11 [C] — Checkpoint
- Demo: insert block, toggle Autoplay, watch Slide Duration appear
- "Everyone either has this or has copied it — both fine. Laptops closed for the next bit."

---

## Section 4 — IAPI Primer (0:31–0:39 · slides 12–16, all [T])

Five fast beats, content drawn from the "From Static to Dynamic" talk.

### Slide 12 [T] — What is the Interactivity API?
- A standardized way to add front-end interactivity to blocks — one pattern, shipped with Core; replaces ad-hoc per-plugin approaches
- Scales from a toggle to live search, carts, instant navigation
- Directives are `data-wp-*` attributes both the client *and* the server understand. "That's what makes Section 7's no-flash first paint possible"
- Credibility card: already running in Core — Search, Query Loop, Navigation, File, Image lightbox
- Speaker note: under the hood it's Preact + Signals on the client and the HTML Tag Processor on the server (no Node SSR), if anyone asks

### Slide 13 [T] — Declarative, not imperative ★ the mindset
- Side-by-side code: imperative `addEventListener` + `textContent` counter vs the `data-wp-on--click` / `data-wp-text` version with a one-line `nextImage` action
- The sentence: **"The state updates the UI, not the other way around"**, then "describe what the UI should be for a given state, never how to update the DOM step by step"
- Payoff line: the right-hand side is what they build in Section 5

### Slide 14 [T] — The round-trip loop ★ reused in Section 5
- Circular diagram: directive reads store → event fires action → action mutates context → directives re-render
- "Every section from here is this loop with more parts"

### Slide 15 [T] — Anatomy of a directive
- `data-wp-bind--hidden---id` broken into four segments: `data-wp-` (standard HTML data-* attribute) · `bind` (directive name — what kind of relationship) · `--hidden` (parameter, two dashes — which event/attribute/property) · `---id` (optional unique ID, three dashes — lets the same directive appear more than once on one element)
- "The `--parameter` pattern generalizes: any event, any attribute, any CSS property — and `---id` when you need the same one twice"
- Closing line names the seven directives used today (wp-interactive, wp-context, wp-bind, wp-style, wp-text, wp-on, wp-init); the rest are there when you need them

### Slide 16 [T] — Three kinds of data ★ reused in Sections 6 and 7
- Three cards, each with a "when to use" rule and a slider-based code sample: global state (`wp_interactivity_state()` with a page-wide `isLightboxOpen` flag, labeled as an example that isn't in today's plugin) · local context (`wp_interactivity_data_wp_context()` + its rendered `data-wp-context` output) · derived state (the `imageIndex` getter, full width)
- The sentence that predicts every later bug: **"context is per-instance; state is shared and derived"**
- Config, the fourth kind, waits for slide 34 (Beyond this workshop)

---

## Section 5 — Hello, Store (0:39–0:49 · slides 17–20)

### Slide 17 [T] — The smallest possible loop
- Re-show slide 14's loop diagram, now with real names: `data-wp-on--click` → `actions.nextImage` → `ctx.currentSlide++` → `data-wp-text`
- Mutation is allowed: the `ctx.currentSlide++` node reads "just mutate it"; speaker note says unlike frameworks that force immutability, it just works and reactivity still fires
- Closing note: that's two of the store's three parts already — `state` and `actions`; the third, `callbacks`, shows up in Section 8 (sets up the callbacks slide)

### Slide 18 [T] — The namespace contract
- Fragment pair, highlighted: `data-wp-interactive='iapi-gallery'` ⇄ `store( 'iapi-gallery', … )`
- "These must agree. Neither has to match the block name `iapi/gallery-slider`."
- Speaker note: say it *before* they type — a namespace typo fails silently and is the #1 failure of the day

### Slide 19 [P] — LAB: first round-trip
- **Mission:** next button bumps a counter on the page
- **Where:** `workshop-outline/section-5.md`, steps 1–5
- **Files:** `src/render.php` · `src/view.js`
- **Done when:** counter renders "1", next bumps it 2·3·4 *and keeps going past 3* (expected!), prev inert, no console errors
- **⏱ 7 min** · behind? `code-reference/section-5/`
- **Done early?** wire up the prev button — starting Section 6 early
- Speaker note: walk the room; check for silent-failure namespace typos and stopped watchers

### Slide 20 [C] — Checkpoint · minute-50 gate
- Demo the working counter, including running past 3 — "that bug is Section 6's job"
- Speaker note: **run-sheet checkpoint — if this slide isn't on screen by 0:50, engage cut lines (facilitator-notes.md)**

---

## Section 6 — Sliding + Bounds (0:49–0:59 · slides 21–23)

### Slide 21 [T] — Derived state
- Re-show slide 16 (three kinds of data), now filled in: `noPrevSlide`, `noNextSlide`, `imageIndex`, transform — all *computed from* `currentSlide`/`totalSlides`
- "Disable logic is derived, so it lives in state getters, not context. Getters re-run on every read — sync for free."
- New directives, one line each: `data-wp-style--transform`, `data-wp-bind--disabled`
- Code adds two `render.php` lines showing the new directives, `data-wp-style--transform` and `data-wp-bind--disabled`

### Slide 22 [P] — LAB: make it slide
- **Mission:** slides move, buttons gray out at the ends, counter reads "X/3"
- **Where:** `workshop-outline/section-6.md`, all steps
- **Files:** `src/view.js` · `src/render.php`
- **Done when:** prev+next both work, disabled at ends, transform animates
- **⏱ 7 min** · behind? `code-reference/section-6/`
- **Done early?** add a 4th image — the counter breaks; that's next section's setup
- Speaker note: watch for transform off-by-one (slide 1 = translateX(0)) and unitless getter returns

### Slide 23 [C] — Checkpoint
- Demo: full slide-and-bounds behavior
- "Still hardcoded `totalSlides: 3` — the server fixes that next"

---

## Section 7 — Server-Side Directive Injection (0:59–1:12 · slides 24–27)

### Slide 24 [T] — The render filter + tag processor walk
- Opens with the why: the count is still hardcoded to 3, and on the server the filter sees the real inner blocks
- Step diagram of the single-pass walk: land on wrapper → `set_bookmark` → count slide classes forward → `seek` back → `set_attribute( 'data-wp-context', … )`
- `render_block_iapi/gallery-slider` — exact hook name on screen
- Namespace inheritance callout: "we do NOT set `data-wp-interactive` on inner blocks — descendants inherit" (flash back to slide 8)

### Slide 25 [T] — The hydration flash
- Two-frame visual: pre-hydration empty counter → hydrated "1/N"
- Live demo on the projector with CPU 6× + Slow 4G throttling — "on your fast laptop you may never see it; real devices do"
- The fix: whatever you pass to `wp_interactivity_state()` **must match what the client getter computes** on first paint
- The fix's code: `wp_interactivity_state()` closures that call `wp_interactivity_get_context()`, so each slider gets its own first-paint values (plain values are global, and with two sliders the last one rendered wins)

### Slide 26 [P] — LAB: real slide counts, no flash
- **Mission:** filter counts inner blocks and seeds context + state
- **Where:** `workshop-outline/section-7.md`, steps 1–5
- **Files:** `iapi-gallery-slider.php` · `src/render.php`
- **⚠ Don't reload between steps 1 and 3** — no context = console errors until the filter is registered
- **Done when:** adding a 4th block makes the counter read "X/4" with no flash
- **⏱ 8 min** · behind? `code-reference/section-7/`
- **Done early?** throttle CPU + network in DevTools and try to catch the flash
- Speaker note: sticking points — hook-name mismatch, `wp-block-image` (not `core/image`) in `$allowed_blocks`

### Slide 27 [C] — Checkpoint
- Demo: add/remove an inner block in the editor, counter adapts
- "The slider is now adaptive. Last piece in the room: autoplay."

---

## Section 8 — Autoplay (1:12–1:25 · slides 28–31)

### Slide 28 [T] — Callbacks: the third part
- Store diagram grows its third branch: `state` / `actions` / **`callbacks`**
- `data-wp-init` fires at element initialization; returning a function *is* the cleanup registration
- Why destructure `const { state, actions } = store(…)`: callbacks call actions directly from a rAF tick

### Slide 29 [T] — `withScope` in one slide
- Fragment: the rAF `update` tick wrapped in `withScope`
- "A rAF tick runs outside the Interactivity scope — without the wrapper, `getContext()` and `state` are undefined"
- The string-attribute payoff from slide 7: `Number( ctx.speed ) * 1000`

### Slide 30 [P] — LAB: autoplay
- **Mission:** Autoplay toggle drives the slider at the chosen speed; loop cleans up
- **Files:** `src/view.js` · `iapi-gallery-slider.php` · `src/render.php`
- **Where:** `workshop-outline/section-8.md`
- **⚑ line:** setup edits first (`autoplay` and `speed` into the PHP context, then prep `view.js`), then save + reload with behavior unchanged, then the callbacks block
- **Done when:** autoplay advances and wraps; toggling off stops it; no leaked frames
- **⏱ 9 min** · behind? `code-reference/section-8/`
- **Done early?** two sliders on one page at different speeds — proof context is per-instance
- Speaker note: "autoplay doesn't start" → check the toggle in the Inspector *before* the code. Running late? This section demos well — see cut line 3.

### Slide 31 [C] — Checkpoint
- Demo: autoplay at two different speeds; toggle off mid-run
- "That's the complete slider."

---

## Wrap-up (1:25–1:30 · slides 32–35, all [T])

### Slide 32 [T] — The arc, revisited
- The build order from slide 3 with everything checked off, five rows: editor controls → round-trip → derived state → server-side injection → lifecycle

### Slide 33 [T] — Your take-home: Section 9
- Focus a11y (APG carousel pattern) · touch/swipe · continuous (prev/next buttons wrap; autoplay already loops)
- "Zero new IAPI primitives — you already know everything it needs"
- `workshop-outline/section-9.md` + `code-reference/section-9/` as the answer key

### Slide 34 [T] — Beyond this workshop
- Framing: everything on the left is already in WordPress; today's build just didn't need it
- Client-side navigation with `@wordpress/interactivity-router` — router regions swap page content in place, interactive state survives navigation
- `wp-each` for dynamic lists from state arrays · `wp_interactivity_config()` / `getConfig()` for REST URLs and nonces
- `watch()` (WP 7.0) to react to state changes from store code, with no DOM element needed
- TypeScript support for typed stores and context, with async action typing helpers new in WP 6.9
- Card on the right, "Where to go next", each a link that opens in a new tab: Interactivity API docs (developer.wordpress.org) · Developer Blog tutorials (`/news/tag/interactivity-api/`) · release dev notes (`make.wordpress.org/core/tag/interactivity-api/`) · example blocks (`WordPress/block-development-examples`) · #core-interactivity-api on Make WordPress Slack

### Slide 35 [T] — Thanks / Q&A
- Repo URL + QR code · contact
- Speaker note: likely questions are pre-gamed in the Q&A section of `facilitator-notes.md`
