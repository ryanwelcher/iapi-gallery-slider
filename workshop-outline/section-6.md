# Section 6 — Sliding + Bounds

**Type:** coding

## Goal

Make the slider actually slide, and stop us from going past either end. Both prev and next buttons work; the buttons gray out at the ends; the counter shows "X/3" instead of just "X". Still using a hardcoded `totalSlides: 3`.

This section is where `state` enters the picture — distinct from `context`. Context is per-instance data; state is derived/computed values shared across instances of the store.

## Concepts introduced

- `state` — getters on the store that compute values from context.
- `data-wp-style--transform` — binds a CSS transform to a state value (one of many `data-wp-style--<property>` forms).
- `data-wp-bind--disabled` — binds an HTML attribute (here, the disabled property of a button) to a state value.
- Why disable logic belongs in `state` not `context`: it's *derived* from other context values, so it lives where computed values live.

## Steps

1. In `src/view.js`, fill in `state` with four getters:
   - `noPrevSlide` — `ctx.currentSlide === 1`
   - `noNextSlide` — `ctx.currentSlide === ctx.totalSlides`
   - `currentPos` — `` `translateX(-${ ( ctx.currentSlide - 1 ) * 100 }%)` ``
   - `imageIndex` — `` `${ ctx.currentSlide }/${ ctx.totalSlides }` ``
2. Add `actions.prevImage` that decrements `ctx.currentSlide`.
3. In `src/render.php`:
   - Add `data-wp-style--transform="state.currentPos"` on `.slider-container`.
   - Wire prev button: `data-wp-on--click="actions.prevImage"`.
   - Add `data-wp-bind--disabled="state.noPrevSlide"` to the prev button and `data-wp-bind--disabled="state.noNextSlide"` to the next button.
   - Change the counter to `data-wp-text="state.imageIndex"`. Notice the shift: we used to read `context.currentSlide` directly; now we read derived state.
4. Reload and test.

## Verification

- The three slides visibly slide left/right when you click.
- Prev button is disabled on slide 1; next button is disabled on slide 3.
- Counter reads X/3.
- Add a 4th cover/image block in the editor → save → reload. Counter still says X/3 and you can't reach the 4th slide. That's the §7 bug.

## Code reference

End-of-section snapshot lives in `code-reference/section-6/`.

## What's Next

→ [Section 7 — Server-Side Directive Injection](./section-7.md)
