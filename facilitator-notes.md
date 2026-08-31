# Facilitator Notes — Building Interactive Blocks with the Interactivity API

## Overview

- **Total time:** 90 minutes
- **Sections:** 9 (sections 1–8 in the room; section 9 is overflow / take-home)
- **Audience:** intermediate — comfortable with block development basics, new to the Interactivity API

---

## Before the workshop

- Demo machine: Studio site created from `blueprint.json`, plugin active, `npm install` done, `npm run start` tested once and stopped.
- Have the repo open in your editor with `src/`, `workshop-outline/`, and `code-reference/` in the file tree — you'll point people at snapshots all session.
- Have a browser tab on the test post and one on `wp-admin`.
- DevTools ready with CPU/Network throttling profiles saved (needed for the Section 7 flash demo).
- Projector-check the focus ring and disabled-button styling — some themes make both nearly invisible at projector contrast.
- Remind the room at the top: **every section has a full snapshot in `code-reference/section-N/`**. Falling behind is never fatal — copy the snapshot and rejoin.

---

## Delivery model: slide-driven

The session runs from slides (see `slides-outline.md`), not live copy-paste. Three slide types repeat all day:

- **Talk tracks [T]** — theory on slides; you narrate, laptops closed. All the "just me talking" theory (opt-in pair, round-trip loop, context-vs-state, `withScope`) lives on a slide you can point at — and flash back to during debugging moments.
- **Pause slides [P]** — one per coding section, distinctive background, stays on screen for the whole lab: mission, `workshop-outline/section-N.md` pointer, done-when checklist, timebox, snapshot rescue path. While it's up, you walk the room (the sticking-point lists below are for exactly this).
- **Checkpoints [C]** — after each lab you demo the working result on the projector; anyone unfinished copies the snapshot and rejoins. This is the pacing valve.

Slides never carry copy-paste code — attendees type from the section files, which show full cumulative code. Slides show fragments for explanation only.

## Timing table (90-minute run sheet)

Coding sections split roughly ⅓ talk track / ⅔ lab. Slide numbers reference `slides-outline.md`.

| Clock | Section | Type | Budget | Talk / Lab | Slides |
|-------|---------|------|--------|-----------|--------|
| 0:00–0:08 | 1 — Welcome & Setup | tour | 8 min | all talk | 1–6 |
| 0:08–0:16 | 2 — Anatomy of the Starter | tour | 8 min | all talk | 7–12 |
| 0:16–0:31 | 3 — Editor Controls | coding | 15 min | 4 / 10 (+1 checkpoint) | 13–16 |
| 0:31–0:39 | 4 — Interactivity API Primer | reading | 8 min | all talk | 17–25 |
| 0:39–0:49 | 5 — Hello, Store | coding | 10 min | 3 / 7 | 26–29 |
| 0:49–0:59 | 6 — Sliding + Bounds | coding | 10 min | 3 / 7 | 30–32 |
| 0:59–1:12 | 7 — Server-Side Directive Injection | coding | 13 min | 5 / 8 | 33–36 |
| 1:12–1:25 | 8 — Autoplay | coding | 13 min | 4 / 9 | 37–40 |
| 1:25–1:30 | Wrap-up + pointer to Section 9 | — | 5 min | all talk | 41–45 |
| take-home | 9 — Polish: Focus, Touch, Continuous | coding | ~25–30 min solo | — | — |

### The minute-50 checkpoint

**Section 5 must be done by 0:50.** It's the core round-trip (directive → action → context mutation → re-render); everything after it stacks on that loop, and everything before it is preamble. If you hit 0:50 and Section 5 isn't landed, use the cut lines below. If you're *ahead* at 0:50, don't bank the time — spend it in Section 7 and Section 8, which have the richest teaching moments.

### Cut lines (in order of preference)

1. **Compress Section 3 to a hand-out.** It's pure block editor — no IAPI content, and the section says so itself. Demo the finished Inspector panel for 3 minutes, tell everyone to copy `code-reference/section-3/src/edit.js`, and jump straight from slide 14 to slide 17 (skip Section 3's pause slide, keep its theory slides). Recovers ~10 min. Decide by 0:16; this is the cut to pre-plan.
2. **Compress Section 4 to 4 minutes.** Talk the directives table and the context-vs-state distinction; skip the rest — Sections 5–8 re-teach every concept at the moment it's used. Recovers ~4 min.
3. **Demo-only Section 8.** If you reach 1:12 without Section 7 finished, finish Section 7 with the room, then live-code Section 8 solo on the projector while they watch, and point at the snapshot. Autoplay is the most self-contained section — watching it still teaches `callbacks`/`withScope`/cleanup.
4. **Never cut Section 5, Section 6, or Section 7.** They're the spine: round-trip, derived state, server-side seeding.

If the wheels come off early (wifi, Studio installs), the floor is: Sections 1–2 fast, Section 4 as a talk, then Sections 5–6 with everyone, Section 7 as demo. That's still a coherent 90 minutes.

---

## Section-by-section notes

### Section 1 — Welcome & Setup (~8 min)

**Goal:** Studio site running, plugin active, `npm run start` watching, test post in place.

**Talking points:**
- Frame the arc up front: "editor controls first, then the smallest possible interactive loop, then we grow it — sliding, server-seeded context, autoplay."
- Point at `code-reference/` now, before anyone needs it.

**Common sticking points:**
- Someone skipped the pre-work. Don't hold the room — pair them with a neighbor or hand them the Playground fallback, and keep moving.
- `node -v` shows v18 or older: `nvm install 20 && nvm use 20`, then re-run `npm install`.
- `npm run start` appears to hang — that's the watcher working. It's not stuck; leave it running all session.

### Section 2 — Anatomy of the Starter (~8 min)

**Goal:** Everyone can name the moving parts: entry PHP, `block.json`, `edit.js`, `render.php`, `view.js`.

**Talking points:**
- The one thing to land hard: **`supports.interactivity: true` and `data-wp-interactive` are a pair.** The flag loads the runtime; the directive gives it a place to bind. Miss either and nothing works. You'll lean on this in every debugging moment later.
- Flag the `speed`-is-a-string detail now, exactly as the outline does — it pays off in Section 8.

**Common sticking points:**
- None really — it's a tour. The risk is time, not confusion. Skim, don't read.

### Section 3 — Editor Controls (~15 min) — *pre-planned cut*

**Goal:** `edit.js` built from scratch: inner-block area with `allowedBlocks`, Inspector panel with two toggles + conditional NumberControl.

**Talking points:**
- Say explicitly: "no Interactivity API in this section — we're building the attributes the IAPI sections will read."
- The conditional Slide Duration control (only when Autoplay is on) is the one interesting beat.

**Common sticking points:**
- Import errors from `@wordpress/block-editor` vs `@wordpress/components` — people put `InspectorControls` in the wrong import.
- `__experimentalNumberControl as NumberControl` — the alias syntax trips people; have it on screen.
- Editor preview doesn't update: the watcher isn't running, or they need a hard reload of the editor.

### Section 4 — Interactivity API Primer (~8 min)

**Goal:** Mental model: what the API is and why it's standardized, the declarative/reactive mindset, directive anatomy, the four kinds of data (global state / local context / derived state / config), server seeding. Nine slides, fast beats — content drawn from the "From Static to Dynamic" talk.

**Talking points:**
- This is a talk, not a follow-along — tell people to close their editors and listen.
- Credibility beat up front: Core already runs on this API (Search, Query Loop, Navigation, File, Image lightbox).
- The mindset sentence: **the state updates the UI — not the other way around.** And mutation is allowed — `ctx.currentSlide++` just works.
- The distinction that predicts every later bug: **context is per-instance, state is shared/derived.** Come back to this sentence in Section 6 and Section 7. Config is the fourth kind — file it away for REST URLs/nonces; the workshop doesn't use it.
- Directive anatomy (`data-wp-` / name / `--parameter`) replaces reading the directive list; the taxonomy slide shows the toolbox shape with today's seven highlighted — don't read it exhaustively.

### Section 5 — Hello, Store (~10 min) — **checkpoint section, never cut**

**Goal:** The smallest round-trip: hardcoded context on the wrapper, `data-wp-text` counter, next button bumps `ctx.currentSlide`.

**Talking points:**
- The namespace contract: `data-wp-interactive='iapi-gallery'` and `store('iapi-gallery', …)` must agree — and neither has to match the block name `iapi/gallery-slider`. Say this before someone hits the typo.
- The counter running past 3 is *expected* — resist the urge to fix it early; Section 6 owns bounds.

**Common sticking points:**
- Clicking does nothing, no errors: namespace typo between the directive and `store()` — silently binds to nothing. This is the #1 failure of the whole workshop.
- Clicking does nothing, console error: watcher not running, so `build/` is stale.
- `data-wp-text` renders nothing: they wrote `state.currentSlide` instead of `context.currentSlide`.

### Section 6 — Sliding + Bounds (~10 min) — *never cut*

**Goal:** Derived state getters; `data-wp-style--transform` slides the track; `data-wp-bind--disabled` grays out buttons at the ends; counter shows "X/3".

**Talking points:**
- The section's own framing is the right one: disable logic is *derived* from context, so it lives in `state` getters, not in context. This is the context-vs-state payoff from Section 4.
- Getters re-run on every read — that's why the UI stays in sync with no extra wiring.

**Common sticking points:**
- Transform doesn't move: off-by-one in the calc (slide 1 should be translateX(0)) or the getter returns a number without units.
- Buttons don't disable: bound to `context.…` instead of `state.…`, or the getter name doesn't match the directive string.

### Section 7 — Server-Side Directive Injection (~13 min) — *never cut*

**Goal:** `render_block_iapi/gallery-slider` filter counts real inner blocks with `WP_HTML_Tag_Processor`, seeds `data-wp-context`; `wp_interactivity_state()` kills the hydration flash.

**Talking points:**
- **Honor the outline's "don't reload between steps 1 and 3" warning** — say it before anyone deletes the hardcoded context, or half the room hits "currentSlide is not defined" and thinks they broke something.
- The bookmark/seek walk is the star: land on wrapper → bookmark → count forward → seek back → write.
- Namespace inheritance: we deliberately do *not* set `data-wp-interactive` on inner blocks.
- The flash demo needs CPU 6× + Slow 4G throttling; on fast hardware it may not show. Demo it on the projector rather than having everyone chase it — the outline explicitly allows "take our word for it."
- The seeding contract: server-seeded state must mirror what the client getter computes on first paint, or hydration visibly snaps.

**Common sticking points:**
- Filter never fires: block name mismatch in the hook (`render_block_iapi/gallery-slider`, exact).
- Count is 0: class names in `$allowed_blocks` don't match (`wp-block-image`, not `core/image`).
- PHP edits not showing: unlike the JS watcher, PHP changes are live — but people forget which side they're editing and stare at the wrong file.

### Section 8 — Autoplay (~13 min) — *demo-only if behind*

**Goal:** `callbacks` + `data-wp-init` start a rAF loop when the Autoplay toggle is on; `withScope` keeps ticks inside the IAPI scope; returned cleanup cancels the frame.

**Talking points:**
- Use the section's built-in **mid-section checkpoint**: after the three setup edits, save/reload and confirm nothing changed before writing the callbacks block. Cheap insurance against compound errors.
- `withScope` gets one clear sentence: a rAF tick runs outside the Interactivity scope, so `getContext()`/`state` would be undefined without the wrapper.
- `Number( ctx.speed ) * 1000` — the string-attribute coercion you promised back in Section 2.
- Returning a function from a callback *is* the cleanup registration — no removeEventListener ceremony.

**Common sticking points:**
- Autoplay doesn't start: the toggle is off in the block they're testing (check the Inspector before the code), or `data-wp-init` isn't on the wrapper.
- Slides advance instantly / too fast: forgot the `Number()` coercion — string math.
- Autoplay stops at the last slide: they skipped the `nextImage` wrap-around edit.

### Wrap-up (~5 min, 1:25–1:30)

- Recap the arc: opt-in pair → round-trip → derived state → server seeding → lifecycle.
- Hand off **Section 9** as take-home: three sub-stages (focus a11y, touch, continuous), explicitly no new IAPI primitives — everything needed is already in their heads. Point at `code-reference/section-9/` as the answer key.
- Where to go next: the Interactivity API reference on developer.wordpress.org, the Block Editor Handbook, and #core-interactivity-api on Make WordPress Slack.

### Section 9 — Polish: Focus, Touch, Continuous (take-home; ~25–30 min in-room if you ever have 2 hours)

If you do run it live: 9a (focus a11y) is the highest-value sub-stage — the APG carousel pattern, `focusin`/`focusout` bubbling vs `focus`/`blur`, and promoting the rAF id from a closure local onto context so pause/resume actions can reach it. 9b (touch) and 9c (continuous) are quick variations. Sticking points: forgetting the `|| ctx.rafId` guard in `resumeAutoplay` (double loops), and testing 9a with autoplay toggled off (nothing to pause).

---

## Q&A — likely questions

- **"Why not just use React/Alpine on the front end?"** — Server-rendered first paint with no client framework payload; directives hydrate in place. The Section 7 flash demo is your evidence.
- **"Context vs state, one more time?"** — Context is per-instance and lives in the DOM; state is shared and where derived getters live. Two sliders on one page each get their own context.
- **"Does the store namespace have to match the block name?"** — No; the only contract is `data-wp-interactive` ⇄ `store()` agreement (Section 5).
- **"Can blocks talk to each other?"** — Yes — shared state across namespaces; out of scope today, good take-home research.
