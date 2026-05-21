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
- The exception: if a descendant uses a directive from a *different* store, it either needs its own `data-wp-interactive` or it can use the cross-namespace value form `namespace::action` on the directive itself.
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

## References

- [Interactivity API docs](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [@wordpress/interactivity package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Studio](https://developer.wordpress.com/studio/)
