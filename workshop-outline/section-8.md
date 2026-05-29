# Section 8 — Autoplay

**Type:** coding

## Goal

Make the slider advance automatically when the "Autoplay" inspector toggle is on, at the speed the editor chose. When autoplay turns off (or the slider leaves the DOM), the animation loop cleans itself up — no leaked frames.

This is the section where `callbacks` enter the picture. They're the third slot in the store, distinct from `state` and `actions`. They run at element lifecycle moments rather than DOM events.

## Concepts introduced

- `callbacks` — the lifecycle slot on the store.
- `data-wp-init` — fires its callback when the element is initialized.
- `withScope` — wraps a callback so it can read state/context and call actions even when invoked outside the Interactivity scope (a `requestAnimationFrame` tick is a classic example).
- **Cleanup functions** — returning a function from a callback registers cleanup; Interactivity calls it when the element is removed from the DOM.
- **Attribute-driven context** — pulling block attributes (`autoplay`, `speed`) into context via the render filter so the client store can read them through `getContext()`.
- Destructuring `const { state, actions } = store(…)` so callbacks can call actions on the returned reference.

## Steps

1. In `iapi-gallery-slider.php`, **replace** the `$context = array( … )` block we wrote in Section 7 with this `array_merge` version that prepends the two new attribute-driven values:
   ```php
   // Replaces the plain $context = array(...) from Section 7.
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
   The `array_merge` pattern keeps the attribute-driven values visually separated from the runtime-driven ones — it'll make Section 9c easier to read when we add `continuous` to the same block.
2. In `src/view.js`, four edits — three setup edits, then the new `callbacks` block. There's a natural checkpoint partway through; we'll call it out.
   - Add `withScope` to the `@wordpress/interactivity` import. Replace the import line at the top of the file with:

     ```js
     import { store, getContext, withScope } from '@wordpress/interactivity';
     ```
   - Capture a reference to the store by destructuring `state` and `actions` from its return value. Replace the existing `store( 'iapi-gallery', {` line with:

     ```js
     const { state, actions } = store( 'iapi-gallery', {
     ```

     Why destructure here? `store()` returns the same `{ state, actions, callbacks }` object you pass in (with the getters live). Up to now nothing inside the store needed a JS reference to the store itself — every action used `getContext()` to reach per-instance data, and directives in markup looked up `state.foo` / `actions.bar` by string. Callbacks change that: we'll call `actions.nextImage()` directly from inside a `requestAnimationFrame` tick, which means the callback code needs a real reference to `actions`. Destructuring the return value gives us `state` and `actions` in the same module scope, so the new `callbacks.initSlideShow` below can call them without re-entering the store. (`state` is destructured for the same reason — we read `state.transitionsSpeed` inside the same callback.)
   - Add a `transitionsSpeed` getter to the existing `state` block:
     ```js
     get transitionsSpeed() {
         const ctx = getContext();
         // `speed` is declared as a string in block.json, so coerce before
         // multiplying. requestAnimationFrame timestamps are in milliseconds.
         return Number( ctx.speed ) * 1000;
     },
     ```
   - Update `actions.nextImage` so it wraps when autoplay reaches the end. Replace the existing function with this complete version:
     ```js
     nextImage: () => {
         const ctx = getContext();
         // When autoplay reaches the end, wrap back to the first slide so
         // the loop keeps running. Manual clicks still stop at the end
         // because state.noNextSlide disables the button.
         if ( ctx.autoplay && ctx.currentSlide === ctx.totalSlides ) {
             ctx.currentSlide = 1;
             return;
         }
         ctx.currentSlide++;
     },
     ```

   **Checkpoint** — save and reload. The slider should still behave exactly as it did at the end of Section 7 (manual buttons work, no autoplay yet). If a hot reload throws, fix imports/syntax before adding the callbacks block below.

   - Add a `callbacks` block alongside `state` and `actions`:
     ```js
     callbacks: {
         initSlideShow: () => {
             const ctx = getContext();
             if ( ! ctx.autoplay ) {
                 return;
             }
             let start = null;
             let rafId = null;
             const update = withScope( ( timestamp ) => {
                 if ( ! start ) {
                     start = timestamp;
                 }
                 if ( timestamp - start > state.transitionsSpeed ) {
                     actions.nextImage();
                     start = null;
                 }
                 rafId = requestAnimationFrame( update );
             } );
             rafId = requestAnimationFrame( update );
             return () => cancelAnimationFrame( rafId );
         },
     },
     ```

     **Why `requestAnimationFrame` instead of `setInterval`?** `setInterval` queues callbacks on a timer the browser keeps running even when the tab is hidden, and it drifts under load. `requestAnimationFrame` is paced by the browser's render loop — it pauses automatically when the tab is in the background, doesn't pile up missed ticks, and aligns transitions with paint. The shape is a self-scheduling loop: each call to `update` schedules the next one, and we compare timestamps to decide when enough time has passed to advance the slide. `start = null` after each advance resets the clock for the next interval.

     **A note on `withScope`.** When a directive fires an action — say `data-wp-on--click="actions.nextImage"` — Interactivity runs that action inside a *scope* that's bound to the element the directive sits on. That scope is what makes `getContext()` work: it knows which instance's context to return, because the scope remembers which element triggered the call.

     A `requestAnimationFrame` tick has no such scope. It's a bare browser callback fired by the render loop, with no connection back to the DOM element our callback was registered on. So if `update` called `actions.nextImage()` directly, `getContext()` inside that action would have nothing to return (you'd get an error or the wrong instance's context — on a page with two sliders, the second one would advance the first one's state, or neither).

     `withScope( fn )` wraps `fn` so that when the browser eventually calls it on the next frame, Interactivity re-enters the scope of the element this `callbacks.initSlideShow` was bound to. From there, `getContext()` returns the right instance, `state` getters compute from the right context, and `actions.nextImage()` mutates the right slider. Because `update` re-schedules itself every frame, this crossing happens 60 times per second — `withScope` is doing real work on every tick.

     **Rule of thumb:** any time you cross a boundary the Interactivity runtime doesn't control — `requestAnimationFrame`, `setInterval`, `setTimeout`, a `fetch().then(…)`, a third-party event emitter — and the code on the other side needs to call actions or read state/context, wrap it in `withScope`.
3. In `src/render.php`, add `data-wp-init="callbacks.initSlideShow"` to the wrapper. This is what actually wires the lifecycle callback to the element.

## Verification

- Insert the slider, toggle Autoplay on with speed `2`, save, view the post. Slider advances every 2s and loops at the end.
- Toggle Autoplay off, save, reload — slider stops; manual buttons still work, and the next button still disables at the last slide.
- Open devtools, click around, navigate away from the post. No console warnings about leaked animation frames.
- Switch to another browser tab while autoplay is running, then return. The slider didn't race ahead — `requestAnimationFrame` paused with the tab.

## Code reference

End-of-section snapshot lives in `code-reference/section-8/`.

## What's Next

→ [Section 9 — Polish: Focus, Touch, Continuous](./section-9.md)
