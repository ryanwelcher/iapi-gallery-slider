# Slides Outline — Building Interactive Blocks with the Interactivity API

### WCEU 2026

---

## Title Slide

- Building Interactive Blocks with the Interactivity API
- WCEU 2026 | 2026-06-06
- Ryan Welcher, Automattic

---

## Who Are We?

<!-- TODO: one bullet block per presenter. -->

---

## What We're Building Today

- A WordPress block called **Gallery Slider** — turns any group of inner blocks (Image / Cover / Media & Text) into an interactive slider.
- Clickable prev/next, an optional autoplay with configurable speed, optional continuous looping, touch swipe, and an accessible keyboard / screen-reader experience.
- Built end-to-end with **only** the Interactivity API — no React on the front end, no custom JS framework.
- Live demo of the finished block here.

---

## Why This, Why Now

- The Interactivity API is WordPress's official answer to "how do I make a block interactive on the front end?" — server-rendered first, JS-enhanced second.
- Replaces the old pattern of "block.json → render.php → ad-hoc jQuery / vanilla JS in `viewScript`".
- Directives + a small store: easy to author, easy to read, easy to maintain.
- Ships in WordPress core; no extra dependencies; no client-side framework lock-in.

---

## Section 1 — Welcome & Setup

- Studio site from `blueprint.json`.
- Verify: `studio site status`, `studio wp plugin list`.
- `npm install` + `npm run start` in the plugin directory — leave the watcher running.
- Create a test post with the Gallery Slider block + 3 inner blocks. We'll keep using this post.

---

## Section 2 — Anatomy of the Starter

- Tour the files: `iapi-gallery-slider.php`, `block.json`, `edit.js`, `render.php`, `view.js`, styles, build pipeline.
- One IAPI directive is already in the starter: `data-wp-interactive='iapi-gallery'` on the wrapper — sets the store namespace.
- `viewScriptModule` vs `viewScript`: ESM vs classic; IAPI requires ESM; `--experimental-modules` is what enables it.
- Heads up: `speed` is a string in `block.json` — we'll coerce it later.

---

## Section 3 — Editor Controls

- Pure block editor — no IAPI yet.
- `useBlockProps` + `useInnerBlocksProps` with `allowedBlocks: [ core/cover, core/image, core/media-text ]`.
- `InspectorControls` + `PanelBody` with `ToggleControl` × 2 and `__experimentalNumberControl`.
- Conditional render: **Slide Duration** only when **Autoplay** is on.
- Editor preview mirrors front-end markup (counter shows `1/3`) — sets up the IAPI work that follows.

---

## Section 4 — Interactivity API Primer

- Directives = HTML attributes that bind the DOM to a store. Always `data-wp-*`.
- The eight we'll use: `data-wp-interactive`, `data-wp-context`, `data-wp-on--<event>`, `data-wp-text`, `data-wp-bind--<attr>`, `data-wp-style--<prop>`, `data-wp-class--<name>`, `data-wp-init`.
- Store shape: **state** (values & getters), **actions** (event handlers), **callbacks** (lifecycle).
- Loop: event → action → mutates context/state → directives re-evaluate → DOM updates.
- **Context vs state**: context is per-instance; state is global to the namespace. Two sliders on a page each have their own `currentSlide`, but share `state`.
- `wp_interactivity_state()` seeds initial values from PHP so first paint matches — no content flash.

---

## Section 5 — Hello, Store

- Smallest possible IAPI round-trip: directive reads context, action mutates context, DOM updates.
- Seed `$context = array( currentSlide, totalSlides )` via `wp_interactivity_data_wp_context()`.
- Counter: `data-wp-text="context.currentSlide"`. Next button: `data-wp-on--click="actions.nextImage"`.
- `store( 'iapi-gallery', { state: {}, actions: { nextImage } } )` — `getContext()` + `ctx.currentSlide++`.
- Block name (`iapi/gallery-slider`) vs store namespace (`iapi-gallery`) — they don't have to match.
- No bounds yet — counter walks past `totalSlides`. We fix that in Section 6.

---

## Section 6 — Sliding + Bounds

- `state` vs `context`: state is *derived* (getters); context is per-instance raw data.
- Four getters: `noPrevSlide`, `noNextSlide`, `currentPos`, `imageIndex`.
- Three new directives on the front end: `data-wp-style--transform="state.currentPos"`, `data-wp-bind--disabled="state.noPrevSlide/noNextSlide"`, counter promoted to `state.imageIndex`.
- Add `actions.prevImage` alongside `nextImage`.
- The Section 7 cliffhanger: add a 4th inner block in the editor. Counter still says X/3 — `totalSlides` is hardcoded. Keep that 4th block in for the next section.

---

## Section 7 — Server-Side Directive Injection

- **Namespace inheritance — the headline concept.** `data-wp-interactive` declared once on the wrapper; descendants resolve directives against it. We do *not* set it on each inner block.
- `render_block_iapi/gallery-slider` filter walks the rendered HTML with `WP_HTML_Tag_Processor`: bookmark the wrapper, count matching inner-block classes, jump back, write `data-wp-context`.
- `wp_interactivity_state()` seeds initial global state so first paint matches the hydrated state — no client-side flash.
- The seeded value must *mirror what the client getter would compute* on first paint. Disagreement = flicker.

---

## Section 8 — Autoplay

- `callbacks` — the third slot in the store, distinct from state/actions. Runs on element lifecycle.
- `data-wp-init="callbacks.initSlideShow"` wires the lifecycle.
- `withScope` — wraps callbacks that fire outside the IAPI scope (a `requestAnimationFrame` tick is the classic case) so they can still call actions / read state.
- Cleanup contract: return a function from a callback → IAPI calls it when the element leaves the DOM. No leaked animation frames.
- Attribute-driven context: render filter pulls `autoplay` + `speed` into context via `array_merge`, so the client store reads them with `getContext()`.
- `speed` is a string from `block.json` → `Number( ctx.speed ) * 1000`.

---

## Section 9 — Polish: Focus, Touch, Continuous

- Three additive enhancements; no new IAPI primitives — recombinations of what we have.
- **9a Focus a11y** — APG carousel labelling (`role="region"`, `aria-roledescription="carousel"`, `aria-label`), `data-wp-on--focusin`/`focusout` to pause autoplay on keyboard focus, `:focus-visible` ring.
- Lift the rAF id into context (`ctx.rafId`) so the focus actions can cancel it; extract a `startAutoplayLoop( ctx )` helper that both `initSlideShow` and `resumeAutoplay` call.
- **9b Touch** — `data-wp-on--touchstart`/`touchend` with ephemeral per-instance `ctx.swipe`. Context is also where the client stashes scratch state.
- **9c Continuous** — one block attribute rippling through state getters, actions, and the server-side seed (`noPrevSlide => ! continuous`). No new directives at all.

---

## Wrap-up

- ~120 lines of `view.js` + ~50 lines of render filter = the whole interactive layer.
- Server-first, JS-enhanced. Accessible. Two instances on a page don't interfere.
- The patterns generalize: state vs context, attribute-driven context, namespace inheritance, server-seeded state.

---

## References

- [Interactivity API docs](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [@wordpress/interactivity package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)
