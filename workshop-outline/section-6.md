# Section 6 — Sliding + Bounds

**Type:** coding

## Goal

Make the slider actually slide, and stop us from going past either end. Both prev and next buttons work; the buttons gray out at the ends; the counter shows "X/3" instead of just "X". Still using a hardcoded `totalSlides: 3`.

Section 4 introduced `state` as a concept — the global, shared branch of the store, distinct from per-instance `context`. Section 5 created an empty `state: {}` placeholder. This is the section where we actually fill it in, and where one specific form of state — **derived state via getters** — enters the picture. A getter is a function on `state` that computes a value from `context` (or other state) every time it's read. Directives that read `state.imageIndex` re-invoke the getter, so the value always reflects the current context. Disable booleans, transform strings, and the "X/Y" counter label are all *derived* from `currentSlide` and `totalSlides`, so they belong here.

## Concepts introduced

- `state` — getters on the store that compute values from context.
- `data-wp-style--transform` — binds a CSS transform to a state value (one of many `data-wp-style--<property>` forms).
- `data-wp-bind--disabled` — binds an HTML attribute (here, the disabled property of a button) to a state value.
- Why disable logic belongs in `state` not `context`: it's *derived* from other context values, so it lives where computed values live.

## Steps

1. In `src/view.js`, fill in the (currently empty) `state` block with four getters. Each one reads context and returns a derived value:
   ```js
   state: {
       get noPrevSlide() {
           const ctx = getContext();
           return ctx.currentSlide === 1;
       },
       get noNextSlide() {
           const ctx = getContext();
           return ctx.currentSlide === ctx.totalSlides;
       },
       get currentPos() {
           const ctx = getContext();
           return `translateX(-${ ( ctx.currentSlide - 1 ) * 100 }%)`;
       },
       get imageIndex() {
           const ctx = getContext();
           return `${ ctx.currentSlide }/${ ctx.totalSlides }`;
       },
   },
   ```
   The `get` keyword turns each one into a getter — directives that reference `state.imageIndex` invoke this function every time they re-evaluate, so the returned value always reflects current context.
2. Add `actions.prevImage` alongside the existing `nextImage`:
   ```js
   prevImage: () => {
       const ctx = getContext();
       ctx.currentSlide--;
   },
   ```
3. In `src/render.php`, wire up sliding first:
   - Add `data-wp-style--transform="state.currentPos"` on `.slider-container`.
   - Wire prev button: `data-wp-on--click="actions.prevImage"`.
   - Change the counter to `data-wp-text="state.imageIndex"`. Notice the shift: we used to read `context.currentSlide` directly; now we read derived state.

   Reload and click through — the slides should visibly move, and the counter should read X/3. Prev and next are still both clickable past the ends; we'll lock that down next.
4. Back in `src/render.php`, add the disable bindings:
   - `data-wp-bind--disabled="state.noPrevSlide"` on the prev button.
   - `data-wp-bind--disabled="state.noNextSlide"` on the next button.
5. Reload and test.

## Verification

- The three slides visibly slide left/right when you click.
- Prev button is disabled on slide 1; next button is disabled on slide 3.
- Counter reads X/3.
- Add a 4th cover/image block in the editor → save → reload. Counter still says X/3 and you can't reach the 4th slide. That's the Section 7 bug. **Keep the 4th block in place** — Section 7 verifies the fix by checking that the counter now reads X/4.

## Code reference

End-of-section snapshot lives in `code-reference/section-6/`.

## What's Next

→ [Section 7 — Server-Side Directive Injection](./section-7.md)
