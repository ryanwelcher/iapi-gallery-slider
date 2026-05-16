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

| Section | Title                                              | Target Time | Cumulative |
| ------- | -------------------------------------------------- | ----------- | ---------- |
| 1       | Welcome & Setup                                    | TBD         | TBD        |
| 2       | Anatomy of the Starter                             | TBD         | TBD        |
| 3       | Interactivity API Primer                           | TBD         | TBD        |
| 4       | Wiring Up Navigation                               | TBD         | TBD        |
| 5       | Server-Side: Injecting Directives                  | TBD         | TBD        |
| 6       | Enhancements: Autoplay, Keyboard, Touch, Continuous| TBD         | TBD        |
| 7 (bonus) | Deep-Linkable Slides with the Interactivity Router | TBD       | TBD        |

**Sections 1–6 are the core workshop and deliver a complete, working slider.** Section 7 is bonus material — only run it if the room is on time and energised at the end of section 6. If you skip it, point attendees to `code-reference/section-7/` and `workshop-outline/section-7.md` for self-study.

---

## Section-by-Section Notes

### Section 1 — Welcome & Setup

**Goal:** Confirm everyone has a working Studio site, demo the finished product, set pacing expectations.

**Talking points:**
- TBD

**Common sticking points:**
- Studio site didn't pick up the blueprint; Node version mismatch; plugin not active.

**If running short:** TBD

---

### Section 2 — Anatomy of the Starter

**Goal:** Tour the plugin's moving parts (`block.json`, `render.php`, `view.js`, the render filter).

**Talking points:**
- TBD

**Common sticking points:**
- `viewScriptModule` vs `viewScript` confusion; why `--experimental-modules` in the build script.

**If running short:** TBD

---

### Section 3 — Interactivity API Primer

**Goal:** Mental model for directives, store shape, and server-side state seeding.

**Talking points:**
- TBD

**Common sticking points:**
- Local context vs global state; when getters re-run; the role of `data-wp-init` vs `callbacks`.

**If running short:** TBD

---

### Section 4 — Wiring Up Navigation

**Goal:** Slider visibly moves; prev/next disable at ends.

**Talking points:**
- TBD

**Common sticking points:**
- Forgetting `data-wp-interactive` on the wrapper; mutating `state` instead of `context`; binding to `disabled` without `data-wp-bind--disabled`.

**If running short:** Skip the `currentPos` transform; use opacity/visibility per slide instead.

---

### Section 5 — Server-Side: Injecting Directives

**Goal:** Server-side filter walks inner blocks (counts them, seeds context on the wrapper) and seeds initial state with no client flash.

**Talking points:**
- **Namespace inheritance — the headline concept of this section.** `data-wp-interactive` is declared once on the wrapper; every descendant inherits that namespace. That's why the tag walk only *counts* inner blocks — we deliberately don't call `set_attribute( 'data-wp-interactive', ... )` on each one. Setting it again would be redundant and would suggest (incorrectly) that every interactive element needs its own namespace declaration. Inheritance is what makes server-injected directives work without any extra ceremony.
- The exception: if a descendant uses a directive from a *different* store, it either needs its own `data-wp-interactive` or it can use the cross-namespace value form `namespace::action` on the directive itself. Section 7 demonstrates this with `iapi-gallery-router::actions.navigate`.
- Bookmarks (`set_bookmark`/`seek`) let us do a single pass: count slides while walking, then jump back to the wrapper to set `data-wp-context` with the final count.

**Common sticking points:**
- `WP_HTML_Tag_Processor` cursor model and bookmarks; matching only the allowed inner block classes. (The Tag Processor escapes attribute values for you, so plain `wp_json_encode()` is enough for `data-wp-context` — no `JSON_HEX_*` flags needed.)
- Misconception that every directive-bearing element needs `data-wp-interactive`. Reinforce: it's declared once per namespace scope, and descendants inherit.

**If running short:** Hardcode `totalSlides` instead of counting; skip the bookmark dance and reseed via a second pass.

---

### Section 6 — Enhancements: Autoplay, Keyboard, Touch, Continuous

**Goal:** Layer four independent enhancements; people can drop off at any layer.

**Talking points:**
- TBD

**Common sticking points:**
- Forgetting `withScope` in `setInterval`; not returning a cleanup function from `callbacks.initSlideShow`; swipe-direction sign errors.

**If running short:** Cut touch (last layer); leave continuous as a discussion-only walkthrough.

---

### Section 7 — Deep-Linkable Slides with the Interactivity Router (bonus)

**Status:** Optional / bonus material. The workshop's core arc is complete after section 6. Only run this if section 6 wrapped on time and the room still has energy. Otherwise, demo the finished product briefly and point attendees at `code-reference/section-7/` for self-study.

**Goal:** URL is the source of truth for which slide is showing. Two distinct router uses: explicit `history.pushState` for per-slide URLs (preserves the CSS animation) and a separate `iapi-gallery-router` store for delegated cross-page link clicks. Finish with a share-link toast.

**Talking points:**
- Why `history.pushState` for prev/next instead of `routerActions.navigate()`: replacing the region's HTML on every slide change kills the CSS transition. `pushState` updates the URL without touching the DOM, so the animation runs.
- `popstate` listener with `withScope` so back/forward stay in sync with `ctx.currentSlide`.
- `firstPaint` flag — single source of truth for "suppress the transition right now," server-seeded and flipped to `false` on first interaction. Avoids the DOM-walk hack of removing a class imperatively.
- Cross-namespace directive values: `data-wp-on-document--click="iapi-gallery-router::actions.navigate"`. A directive on an element with `data-wp-interactive='iapi-gallery'` can still reference an action defined in a different store.
- Per the docs, "client-side state is never automatically overwritten by the server" — that's *why* state in the store survives router-driven page navigations. Per-instance `context` does not; it's replaced with the new server-rendered values.
- The router falls back to a full page reload if the destination page has no matching `data-wp-router-region` ID — and a full reload destroys the JS store, so client state is lost.

**Common sticking points:**
- `state.firstPaint` flips to `false` on first prev/next click but if `wp_interactivity_state()` doesn't seed it as `true`, the no-transition class won't be present during the first paint.
- Forgetting `withScope` around the `setTimeout` callback that resets `state.shareCopied` — without it, scope is lost and the assignment is a no-op.
- Using a regular `async` function for `shareSlide` instead of a generator — scope is lost across `await`, so the post-clipboard state writes silently fail. Use `function*` + `yield`.
- Cookie/localStorage rabbit holes for cross-page state. Don't go there; the router preserves store state for free as long as the region matches.

**If running short:** Skip the share-toast step (just `console.log` after the clipboard write) and skip the `router.js` extraction (inline the `*navigate` action in `view.js` and reference it from the wrapper without a namespace prefix).

---

## References

- [Interactivity API docs](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [@wordpress/interactivity package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)
- [@wordpress/interactivity-router package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity-router/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)
