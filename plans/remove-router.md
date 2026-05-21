# Plan: Remove the Interactivity Router work

**Goal:** Roll the workshop back to the "core finish line" state at the end of Section 6. Section 7 (Deep-Linkable Slides with the Interactivity Router) disappears entirely — file, snapshot, and every reference in supporting docs. The slider stays fully working without per-slide URLs, the share button/toast, the `firstPaint` flash suppression, or the `iapi-gallery-router` store.

**Why tracer-bullet:** Each slice leaves the repo in a coherent, demoable state. If we have to stop after any slice, nothing is half-wired.

**Target state** (already snapshotted in the repo): `code-reference/section-6/` is the source of truth for what `src/` and `iapi-gallery-slider.php` should look like at the end of this work.

---

## Slice 1 — Revert live code to the Section 6 snapshot

**End state:** Slider builds and runs in Studio with click / keyboard / touch / autoplay / continuous. No per-slide URLs, no share button, no router import. Docs are still stale — that's fine for now.

- [ ] `src/view.js` — restore to `code-reference/section-6/src/view.js`. Drops: `slideHref` helper, `./router` side-effect import, `pushState` calls in `prevImage`/`nextImage`, the `popstate` listener in `initSlideShow`, the `shareSlide` generator, `state.shareCopied`, and the use of `state.firstPaint`. Restores the simpler `prevImage`/`nextImage` that just mutate `ctx.currentSlide` and the simpler `initSlideShow` that returns `clearInterval` directly when autoplay is on.
- [ ] `src/render.php` — restore to `code-reference/section-6/src/render.php`. Drops: `data-wp-router-region="iapi-gallery"`, `data-wp-on-document--click="iapi-gallery-router::actions.navigate"`, `data-wp-class--no-transition="state.firstPaint"`, the share button, and the toast div.
- [ ] `src/router.js` — delete.
- [ ] `iapi-gallery-slider.php` — restore to `code-reference/section-6/iapi-gallery-slider.php`. Drops: `?slide=` reading + clamping, `firstPaint` in `wp_interactivity_state`, the `slider-container` bookmark and inline `transform`/`no-transition` writes, and the `$tags`/`$found_container` rename. Restores the simpler `$slides` walker that just counts inner blocks and seeds `currentSlide: 1`.
- [ ] `npm run build`.
- [ ] Smoke test in Studio: confirm prev/next buttons, keyboard arrows, touch swipe, autoplay, and continuous mode all still work. URL should NOT change on slide change.

**Verification gate:** Slider works end-to-end with zero references to `router`/`pushState`/`popstate`/`shareCopied`/`firstPaint` in `src/` or the plugin entry.

---

## Slice 2 — Remove Section 7 from the workshop outline

**End state:** `workshop-outline/` ends at Section 6. Section 5 and Section 6 no longer forward-reference Section 7.

- [ ] Delete `workshop-outline/section-7.md`.
- [ ] Delete `code-reference/section-7/` (whole directory).
- [ ] `workshop-outline/section-6.md` — remove the "Bonus (if time permits)" block at the bottom that links to section-7. The "Wrap-up" paragraph above it becomes the natural ending. Update or remove the "core finish line" framing if it now reads oddly without a bonus follow-up.
- [ ] `workshop-outline/section-5.md` — in the "Key concept: namespace inheritance" section, remove the parenthetical forward-reference to `iapi-gallery-router` in section 7. The inheritance teaching itself stands on its own (descendants inherit `data-wp-interactive` from the nearest ancestor; you only re-declare when switching namespaces). Keep that — just drop the section-7 example.

**Verification gate:** `grep -ri "section-7\|router\|pushState\|popstate" workshop-outline code-reference` returns nothing.

---

## Slice 3 — Scrub supporting docs

**End state:** README, slides outline, and facilitator notes all match a 6-section workshop with no router content.

- [ ] `README.md`
  - Remove the Section 7 row from the section-map table (`README.md:78`).
  - Remove `[@wordpress/interactivity-router package]` from the documentation links list (`README.md:48`).
  - Sanity-check the section count / any "7 sections" copy elsewhere.
- [ ] `slides-outline.md`
  - Delete the `## Section 7 — Deep-Linkable Slides with the Interactivity Router (bonus / optional)` heading and everything under it down to the next top-level section (`slides-outline.md:69`).
  - Remove the `@wordpress/interactivity-router package` link from the docs list (`slides-outline.md:79`).
- [ ] `facilitator-notes.md`
  - Remove the Section 7 row from the timing table (`facilitator-notes.md:32`).
  - Delete the entire `### Section 7 — Deep-Linkable Slides with the Interactivity Router (bonus)` subsection — goal, talking points, sticking points, "if running short" paragraph (`facilitator-notes.md:127–147`).
  - In the Section 5 talking points, remove the bullet that ends "Section 7 demonstrates this with `iapi-gallery-router::actions.navigate`" (`facilitator-notes.md:102`). Keep the rest of the inheritance bullet.
  - Remove the `[@wordpress/interactivity-router package]` doc link (`facilitator-notes.md:155`).
  - Re-check timing totals if any sum-row exists.

**Verification gate:** `grep -rni "section 7\|router\|pushState\|popstate\|shareCopied\|interactivity-router\|firstPaint" README.md slides-outline.md facilitator-notes.md workshop-outline` returns nothing meaningful (false positives like the word "router" inside a sentence are fine to inspect, but there shouldn't be any).

---

## Slice 4 — Remove the dependency

**End state:** `@wordpress/interactivity-router` is gone from the dep tree; nothing imports it.

- [ ] `package.json` — remove `"@wordpress/interactivity-router"` from `dependencies`.
- [ ] `npm install` to regenerate `package-lock.json`.
- [ ] `npm run build` to confirm the build is clean and no transitive import was relying on the package.
- [ ] Smoke test the slider one more time in Studio.

**Verification gate:** `grep -r "interactivity-router" .` (excluding `node_modules` and `.git`) returns nothing.

---

## Out of scope / leave alone

- The `wp-workshop-scaffold` skill conformance shape — still passes after this work; nothing in the canonical shape requires a Section 7.
- The wider Workshop skill / facilitator timing strategy — once 6 is the finish line, the schedule has more breathing room; that's a content decision, not a code one.
- The `@wordpress/interactivity-router` reference in any external slides/docs outside this repo.

## Rollback

If we want this back, every removed artifact lives in git history on `trunk` (commit `b25b95d Wire interactivity router for per-slide URLs and add share-link toast` and the subsequent snapshot syncs). Cherry-pick or revert as needed.
