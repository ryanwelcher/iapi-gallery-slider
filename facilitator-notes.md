# Facilitator Notes — WCEU 2026

**Session:** Building Interactive Blocks with the Interactivity API
**Date:** 2026-06-06
**Duration:** TBD
**Audience:** TBD

---

## Before the Workshop

- [ ] Confirm demo machine is running the latest WordPress version targeted by the workshop
- [ ] Run through every section once end-to-end on a fresh Studio site
- [ ] Have all API keys / external accounts configured and tested
- [ ] Load the blueprint link and confirm it works as a fallback
- [ ] Cue up the source files you'll be navigating

---

## Timing Overview

<!-- TODO: fill in once sections are declared. -->

| Section | Title                                          | Target Time | Cumulative |
| ------- | ---------------------------------------------- | ----------- | ---------- |
| 1       | Welcome & Setup                                | TBD         | TBD        |
| 2       | Anatomy of the Starter                         | TBD         | TBD        |
| 3       | Editor Controls                                | TBD         | TBD        |
| 4       | Interactivity API Primer                       | TBD         | TBD        |
| 5       | Hello, Store                                   | TBD         | TBD        |
| 6       | Sliding + Bounds                               | TBD         | TBD        |
| 7       | Server-Side Directive Injection                | TBD         | TBD        |
| 8       | Autoplay                                       | TBD         | TBD        |
| 9       | Polish: Focus, Touch, Continuous               | TBD         | TBD        |

---

## Section-by-Section Notes

### Section 1 — Welcome & Setup

**Goal:** Confirm everyone has a working Studio site, demo the finished product, set pacing expectations.

**Facilitator actions (not in learner outline):**
- Demo the finished slider on your machine before attendees start building — they're only told to set up their environment.
- Walk through the day's structure and pacing out loud.

**Talking points:**
- TBD

**Common sticking points:**
- Studio site didn't pick up the blueprint; Node version mismatch; plugin not active.

**If running short:** TBD

---

### Section 2 — Anatomy of the Starter

**Goal:** Tour the plugin's moving parts (`block.json`, `render.php`, `view.js`, the render filter).

**Talking points:**
- **Hammer the two-part opt-in.** `supports.interactivity: true` in `block.json` and `data-wp-interactive` in the rendered markup are a pair — block.json loads the runtime, the directive declares the hydration root. If learners only remember one thing from the tour, it should be that pair. Most "my directives aren't doing anything" debugging in IAPI work comes back to missing one of the two.
- A quick way to make it stick: ask "what happens if we delete `supports.interactivity: true` from block.json?" (the module never loads; directives are inert) and "what happens if we delete `data-wp-interactive` from the wrapper?" (the module loads but has no hydration root, so directives are inert). Same symptom, two different causes.

**Common sticking points:**
- `viewScriptModule` vs `viewScript` confusion; why `--experimental-modules` in the build script.

**If running short:** TBD

---

### Section 3 — Editor Controls

**Goal:** Learner builds `src/edit.js` from a near-empty stub up to the full editor preview + InspectorControls panel. No IAPI in this section — just block editor APIs.

**Facilitator actions (not in learner outline):**
- Call out explicitly that the starter `src/edit.js` is a placeholder — attendees should delete the whole file's contents before they start typing. The instruction says "replace its contents," but it's easy to miss; some learners try to merge their new code into the stub and end up with two `Edit` exports.

**Talking points:**
- `useBlockProps` is the bridge between our component and the editor — without it WordPress doesn't recognize the wrapper as the block root.
- `allowedBlocks` on `useInnerBlocksProps` is the contract that keeps the slider sane; the IAPI render filter in Section 7 will rely on those same class names (`wp-block-cover`, `wp-block-image`, `wp-block-media-text`) to count slides.
- `__experimentalNumberControl` — the `__experimental` prefix is its current public import path; we're not doing anything risky by using it.
- Conditional rendering: showing **Slide Duration** only when **Autoplay** is on keeps the inspector tidy and previews how attribute-driven UI works.
- The `data-wp-text` on the editor counter is dormant — IAPI doesn't run in the editor, so this is just a literal attribute. We keep it for parity with the front-end markup we'll build in Section 6.

**Common sticking points:**
- Forgetting `useBlockProps` → block doesn't register / wrapper missing block-editor classes.
- Spreading `blockProps` onto something other than the outer element.
- Trying to mutate `attributes` directly instead of using `setAttributes( { key: value } )`.
- Mixing up imports: `InspectorControls` is from `@wordpress/block-editor`, but `PanelBody`/`ToggleControl`/`NumberControl` are from `@wordpress/components`.
- Using `NumberControl` without the `__experimentalNumberControl as NumberControl` alias.

**If running short:** Skip the conditional `NumberControl` rendering — always show it. Or drop the Continuous toggle entirely and add it back when Section 9c needs it. Either trims a couple of minutes without losing the InspectorControls teaching beat.

---

### Section 4 — Interactivity API Primer

**Goal:** Mental model for directives, store shape, and server-side state seeding.

**Facilitator actions (not in learner outline):**
- Run a live minimal-example demo before attendees write any code themselves — the learner-facing Section 4 is concept reading only, so the demo is yours to add in person.

**Talking points:**
- TBD

**Common sticking points:**
- Local context vs global state; when getters re-run; the role of `data-wp-init` vs `callbacks`.

**If running short:** TBD

---

### Section 5 — Hello, Store

**Goal:** Smallest IAPI round-trip working end-to-end. A button click mutates context; a `data-wp-text` reflects it. No visible sliding yet.

**Talking points:**
- This is the loop every other section sits on top of: directive reads context, action mutates context, DOM re-renders.
- `data-wp-interactive` on the wrapper sets the *namespace* for everything inside. Mention "we set it once" — full payoff lands in Section 7.
- Why we don't add `data-wp-style--transform` yet: the lesson is that data changing doesn't automatically mean the page reacts visually. That separation lands cleanly in Section 6.

**Common sticking points:**
- Forgetting `data-wp-interactive` on the wrapper → directives silently no-op.
- Mutating `state` instead of `context` from inside an action — `state` getters are read-only computed values.
- `wp_interactivity_data_wp_context()` vs writing `data-wp-context='...'` by hand. The helper handles escaping for you.

**If running short:** Skip the "no upper bound" reveal at the end of Section 5 and just transition into Section 6 immediately.

---

### Section 6 — Sliding + Bounds

**Goal:** Slider visibly slides; prev/next disable at ends; counter switches to derived state.

**Talking points:**
- `state` vs `context`: context is per-instance data; state holds derived/computed values that everyone reads from. The disable booleans are derived → they belong in state.
- `data-wp-style--transform` is one of many `data-wp-style--<property>` forms — show that.
- The switch from `context.currentSlide` to `state.imageIndex` in the counter is a great hook to point out the difference between reading raw context and reading derived state.

**Common sticking points:**
- Trying to assign to a `state` getter from an action (it's a getter, not a field — won't work).
- Binding to the boolean `disabled` HTML attribute without `data-wp-bind--disabled`.
- Off-by-one in `currentPos`: `(currentSlide - 1) * 100`, not `currentSlide * 100`.

**If running short:** Skip the `currentPos` transform; use opacity/visibility per slide instead. Loses the smooth animation but keeps the state/disable lesson.

---

### Section 7 — Server-Side Directive Injection

**Goal:** Render filter walks inner blocks, counts them, seeds context. Then `wp_interactivity_state()` kills the first-paint flash. Namespace inheritance lands as the headline mental model.

**Talking points:**
- **Namespace inheritance — the headline concept of this section.** `data-wp-interactive` is declared once on the wrapper; every descendant inherits that namespace. That's why the tag walk only *counts* inner blocks — we deliberately don't call `set_attribute( 'data-wp-interactive', ... )` on each one. Setting it again would be redundant and would suggest (incorrectly) that every interactive element needs its own namespace declaration.
- The exception: a descendant using a directive from a *different* store needs its own `data-wp-interactive` (or the cross-namespace `namespace::action` value form on the directive).
- Bookmarks (`set_bookmark`/`seek`) let us do a single pass: count slides while walking, then jump back to the wrapper to set `data-wp-context` with the final count.
- The two-stage demo (count without state seeding → see the flash → add `wp_interactivity_state` → flash gone) is the whole reason state seeding earns its place in this section.

**Common sticking points:**
- `WP_HTML_Tag_Processor` cursor model and bookmarks; matching only the allowed inner block classes. (The Tag Processor escapes attribute values for you, so plain `wp_json_encode()` is enough for `data-wp-context`.)
- Misconception that every directive-bearing element needs `data-wp-interactive`. Reinforce: it's declared once per namespace scope, and descendants inherit.
- Forgetting that `wp_interactivity_state()` mirrors what the client getters compute — both sides need to agree on the initial value or you'll get a flicker the other way.

**If running short:** Skip the bookmark dance — count in a first pass, then construct a new `WP_HTML_Tag_Processor` for the wrapper write. Slower but easier to follow.

---

### Section 8 — Autoplay

**Goal:** Autoplay toggle drives a `requestAnimationFrame` loop via a `callbacks.initSlideShow` lifecycle. Cleanup function returns from the callback. `withScope` enters the picture.

**Talking points:**
- `callbacks` is the third slot on the store — distinct from `state` (computed) and `actions` (event handlers). Callbacks run on element lifecycle.
- Why `withScope`: a `requestAnimationFrame` tick fires outside the Interactivity scope. Any code in that tick that calls actions or reads state/context needs `withScope` to re-enter the scope.
- The cleanup contract: returning a function from a callback registers cleanup. Interactivity calls it when the element is removed.
- Why we destructure `const { state, actions } = store(…)` here: callbacks live inside the store definition but need to call actions back into themselves; the destructured reference gives us that.
- Attribute-driven context: the render filter is the bridge between editor toggles and the client store.

**Common sticking points:**
- Forgetting `withScope` → `actions.nextImage()` doesn't see the right `getContext()`.
- Not returning the cleanup function → leaked animation frames after navigation.
- Trying to call `actions.nextImage()` directly inside the `requestAnimationFrame` tick instead of wrapping the loop body in `withScope( ( timestamp ) => { … } )`.
- Forgetting to extend `actions.nextImage` to wrap on the last slide when autoplay is on — without that, autoplay stops at the end.

**If running short:** Hardcode `state.transitionsSpeed` to a constant (e.g. 3000) and skip the `speed` attribute wiring. Keeps the callbacks/withScope lesson intact.

---

### Section 9 — Polish: Focus, Touch, Continuous

**Goal:** Three additive enhancements as sub-stages. Each is self-contained and drop-friendly if running short. No new IAPI primitives — variations on Sections 5–8 patterns.

**Talking points:**
- These three live together because none of them introduce a new IAPI concept. Each is a variation on something we've already seen.
- Focus demonstrates the bubbling `focusin`/`focusout` events — one pair of directives on the wrapper catches focus landing on any descendant button, so we don't have to wire each button individually.
- **If someone asks "what about arrow keys?":** the short answer is that APG's Prev/Next carousel pattern doesn't include them, and bolting them on causes real harm — a document-level listener hijacks ArrowLeft/Right everywhere on the page (WCAG 2.1.4 *Character Key Shortcuts*), and a focusable wrapper with `data-wp-on--keydown` collides with screen readers in browse mode (NVDA/JAWS) that use arrows as their primary navigation. Arrow keys belong to APG's *Tabbed Carousel* variant (a different widget with `role="tablist"` and roving tabindex), not this one. The Prev/Next buttons are the keyboard interface; our job is making them work well.
- Touch demonstrates ephemeral per-instance scratch state (`ctx.swipe`) — context isn't just server-seeded values, it's also where the client stashes per-instance data.
- Continuous is a great showcase of how a single block attribute can ripple through state, actions, and the initial server seed — the same context value gets read in four different places.
- Drop policy: if pressed for time, do 9a (focus) only. It's the smallest and best-rewards-effort. 9c (continuous) is the touchiest because it modifies existing code in place.

**Common sticking points:**
- Swipe-direction sign errors in `onTouchEnd` — `clientX < swipe` means swiped left → next slide.
- Forgetting the `wp_interactivity_state` seed update for `noPrevSlide` when continuous is enabled → flash of disabled prev button on first paint.
- Mis-ordering the condition in `actions.nextImage` so continuous + non-last-slide doesn't increment.

**If running short:** Demo continuous as a code walkthrough rather than having attendees type it. The two-line getter changes are easier to read than to write live.

---

## References

- [Interactivity API docs](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [@wordpress/interactivity package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)
