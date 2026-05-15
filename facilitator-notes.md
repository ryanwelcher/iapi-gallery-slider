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
| 7       | Picture-in-Picture with the Interactivity Router   | TBD         | TBD        |

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

**Goal:** Server-side filter adds directives to inner blocks and seeds initial state with no client flash.

**Talking points:**
- TBD

**Common sticking points:**
- `WP_HTML_Tag_Processor` cursor model and bookmarks; JSON-escaping context with the right flags; matching only the allowed inner block classes.

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

### Section 7 — Picture-in-Picture with the Interactivity Router

**Goal:** Slider keeps playing in a floating panel across client-side navigations.

**Talking points:**
- TBD

**Common sticking points:**
- Understanding which region the router swaps; element persistence across route changes; focus management when a floating element survives navigation.

**If running short:** Demo only — show the finished `actions.navigate()` + pop-out behavior without attendees typing.

---

## References

- [Interactivity API docs](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [@wordpress/interactivity package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)
- [@wordpress/interactivity-router package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity-router/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)
