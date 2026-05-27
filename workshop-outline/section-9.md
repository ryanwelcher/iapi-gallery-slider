# Section 9 — Polish: Keyboard, Touch, Continuous

**Type:** coding

## Goal

Three additive enhancements that each reuse patterns from §5–8 — no new IAPI primitives. The slider's finish line is here: arrow keys navigate, swipe navigates on touch devices, and continuous mode wraps prev/next around the ends.

This is our last coding section. Now that we know `state`, `actions`, `callbacks`, and the server-side filter, the three sub-stages below are variations on what we've already built:

- **Keyboard** is the smallest enhancement — one new action, one new directive on the wrapper.
- **Touch** is a variation on the same action pattern, with two events instead of one.
- **Continuous** doesn't add new directives at all — it modifies existing actions/getters in place to wrap around the ends.

## Sub-stage 8a — Keyboard

1. In `src/view.js`, add to the `actions` block:
   ```js
   onKeyDown: ( e ) => {
       switch ( e.key ) {
           case 'ArrowLeft':
               if ( ! state.noPrevSlide ) actions.prevImage();
               break;
           case 'ArrowRight':
               if ( ! state.noNextSlide ) actions.nextImage();
               break;
       }
   },
   ```
2. In `src/render.php`, add `data-wp-on-document--keydown="actions.onKeyDown"` to the wrapper.

**Verify:** arrow keys navigate the slider; they no-op at the ends (gated by `state.noPrev/noNextSlide`).

## Sub-stage 8b — Touch

1. In `src/view.js`, add to the `actions` block:
   ```js
   onTouchStart: ( e ) => {
       const ctx = getContext();
       ctx.swipe = e.changedTouches[ 0 ].clientX;
   },
   onTouchEnd: ( e ) => {
       const { swipe } = getContext();
       if ( e.changedTouches[ 0 ].clientX < swipe ) {
           if ( ! state.noNextSlide ) actions.nextImage();
       } else if ( ! state.noPrevSlide ) {
           actions.prevImage();
       }
   },
   ```
   Note that `ctx.swipe` is *ephemeral* per-instance state — it lives in context because that's where per-instance scratch data goes; we never seed it from the server.
2. In `src/render.php`, on the `.slider-container`, add `data-wp-on--touchstart="actions.onTouchStart"` and `data-wp-on--touchend="actions.onTouchEnd"`.

**Verify:** in Chrome devtools touch emulation, swiping left/right changes slides.

## Sub-stage 8c — Continuous

1. In `iapi-gallery-slider.php`, add `'continuous' => $block['attrs']['continuous'] ?? false` to the `array_merge` context. Update the `wp_interactivity_state` seed so `'noPrevSlide' => ! $context['continuous']` (when continuous is on, the prev button is enabled from first paint).
2. In `src/view.js`:
   - `state.noPrevSlide` and `state.noNextSlide` early-return `false` when `ctx.continuous`:
     ```js
     if ( ctx.continuous ) return false;
     ```
   - `actions.prevImage` wraps when continuous:
     ```js
     if ( ctx.continuous && ctx.currentSlide === 1 ) {
         ctx.currentSlide = ctx.totalSlides;
         return;
     }
     ```
   - Broaden the existing `actions.nextImage` wrap condition from `ctx.autoplay` to `( ctx.continuous || ctx.autoplay )`.

**Verify:** toggle Continuous on, click prev from slide 1 → jumps to the last slide; click next from the last → jumps to 1. Buttons stay enabled. Autoplay still works alongside continuous.

## Code reference

End-of-section snapshot lives in `code-reference/section-9/`.

## Wrap-up

This is the finish line. The slider is complete: server-rendered with directives, navigable by click / keyboard / touch, optionally autoplaying, optionally continuous. The interactive layer is roughly 100 lines of `view.js` and a ~40-line render filter — small for what it does.

→ Return to [README](../README.md).
