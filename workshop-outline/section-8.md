# Section 8 — Autoplay

**Type:** coding

## Goal

Make the slider advance automatically when the "Autoplay" inspector toggle is on, at the speed the editor chose. When autoplay turns off (or the slider leaves the DOM), the interval cleans itself up — no leaked timers.

This is the section where `callbacks` enter the picture. They're the third slot in the store, distinct from `state` and `actions`. They run at element lifecycle moments rather than DOM events.

## Concepts introduced

- `callbacks` — the lifecycle slot on the store.
- `data-wp-init` — fires its callback when the element is initialized.
- `withScope` — wraps a callback so it can read state/context and call actions even when invoked outside the Interactivity scope (a `setInterval` tick is a classic example).
- **Cleanup functions** — returning a function from a callback registers cleanup; Interactivity calls it when the element is removed from the DOM.
- **Attribute-driven context** — pulling block attributes (`autoplay`, `speed`) into context via the render filter so the client store can read them through `getContext()`.
- Destructuring `const { state, actions } = store(…)` so callbacks can call actions on the returned reference.

## Steps

1. In `iapi-gallery-slider.php`, expand the `$context` array from Section 7:
   ```php
   $context = array_merge(
       array(
           'autoplay' => $block['attrs']['autoplay'] ?? false,
           'speed'    => $block['attrs']['speed'] ?? '3',
       ),
       array(
           'currentSlide' => 1,
           'totalSlides'  => $total_slides,
       )
   );
   ```
2. In `src/view.js`:
   - Add `withScope` to the `@wordpress/interactivity` import.
   - Change `store( … )` to `const { state, actions } = store( … )`. We need that reference for the callback below.
   - Add a `transitionsSpeed` state getter: `Number( ctx.speed ) * 1000`.
   - Update `actions.nextImage` so it wraps when autoplay reaches the end:
     ```js
     if ( ctx.autoplay && ctx.currentSlide === ctx.totalSlides ) {
         ctx.currentSlide = 1;
         return;
     }
     ```
   - Add `callbacks.initSlideShow`:
     ```js
     callbacks: {
         initSlideShow: () => {
             const ctx = getContext();
             if ( ! ctx.autoplay ) {
                 return;
             }
             const int = setInterval(
                 withScope( () => {
                     actions.nextImage();
                 } ),
                 state.transitionsSpeed
             );
             return () => clearInterval( int );
         },
     },
     ```
3. In `src/render.php`, add `data-wp-init="callbacks.initSlideShow"` to the wrapper.

## Verification

- Insert the slider, toggle Autoplay on with speed `2`, save, view the post. Slider advances every 2s and loops at the end.
- Toggle Autoplay off, save, reload — slider stops; manual buttons still work, and the next button still disables at the last slide.
- Open devtools, click around, navigate away from the post. No console warnings about leaked timers.

## Code reference

End-of-section snapshot lives in `code-reference/section-8/`.

## What's Next

→ [Section 9 — Polish: Focus, Touch, Continuous](./section-9.md)
