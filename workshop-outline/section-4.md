# Section 4 — Wiring Up Navigation

**Type:** coding

## Goal

Make the slider actually move. By the end, prev/next buttons advance the slider, the current slide indicator updates, and the buttons disable correctly at the ends.

## Steps

1. Add `data-wp-context` to the wrapper with `currentSlide`, `totalSlides`.
2. Implement `actions.prevImage` and `actions.nextImage`.
3. Add state getters: `noPrevSlide`, `noNextSlide`, `currentPos`, `imageIndex`.
4. Bind buttons with `data-wp-on--click` and disable state with `data-wp-bind--disabled`.
5. Use `data-wp-style--transform` (or a class) to translate the track based on `currentPos`.
6. Test end-to-end in the browser.

## Code reference

End-of-section snapshot will live in `code-reference/section-4/`.

## What's Next

→ [Section 5 — Server-Side: Injecting Directives](./section-5.md)
