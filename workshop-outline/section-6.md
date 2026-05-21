# Section 6 — Enhancements: Autoplay, Keyboard, Touch, Continuous

**Type:** coding

## Goal

Layer four independent enhancements onto the working slider. Attendees who fall behind on one enhancement can still land on the next.

## Steps

1. **Autoplay** — `callbacks.initSlideShow` with `setInterval` + `withScope`, returning a cleanup function. Speed driven by the `speed` attribute via `state.transitionsSpeed`.
2. **Keyboard** — `actions.onKeyDown` for ArrowLeft / ArrowRight, gated by `noPrevSlide` / `noNextSlide`. Wire with `data-wp-on--keydown`.
3. **Touch** — `actions.onTouchStart` / `actions.onTouchEnd` capturing `clientX` to detect swipe direction.
4. **Continuous mode** — wrap-around logic in `prevImage` / `nextImage`, and adjust `noPrevSlide` / `noNextSlide` getters so the buttons stay enabled when `continuous` is true.

## Code reference

End-of-section snapshot will live in `code-reference/section-6/`.

## Wrap-up

This is the finish line for the workshop. The slider is complete: server-rendered with directives, navigable by click/keyboard/touch, optionally autoplaying, and optionally continuous. Everyone walking away at this point has built a real, working interactive block.

→ Return to [README](../README.md).
