# Section 9 — Polish: Focus, Touch, Continuous

**Type:** coding

## Goal

Three additive enhancements that each reuse patterns from Sections 5–8 — no new IAPI primitives. The slider's finish line is here: it pauses for keyboard users, swipe navigates on touch devices, and continuous mode wraps prev/next around the ends.

This is our last coding section. Now that we know `state`, `actions`, `callbacks`, and the server-side filter, the three sub-stages below are variations on what we've already built:

- **Focus a11y** labels the carousel region and pauses autoplay while a keyboard user is interacting — one ARIA group, two new actions, two new directives.
- **Touch** is a variation on the same action pattern, with two events instead of one.
- **Continuous** doesn't add new directives at all — it modifies existing actions/getters in place to wrap around the ends.

## Sub-stage 9a — Focus a11y

Two small additions, both grounded in the ARIA Authoring Practices Guide (APG) Carousel pattern. Neither needs a new IAPI primitive — we're recombining `data-wp-on--*`, `actions`, and context. The Prev/Next buttons from Section 5 are already the keyboard interface (Tab to reach them, Enter/Space to activate); our job here is to make sure that interface is labelled, undisturbed, and visible.

### Step 1 — Label the carousel region

In `src/render.php`, on the outer wrapper, add:

```php
role="region"
aria-roledescription="carousel"
aria-label="Image gallery"
```

This is the APG-recommended labelling for a carousel. No `tabindex` — the region takes focus naturally when a user tabs onto the Prev/Next buttons inside it. Screen readers now announce "Image gallery, carousel, region" when focus enters, so users know what kind of widget they're in.

### Step 2 — Pause autoplay on focus

APG Carousel: *"Automatic slide rotation stops when any element in the carousel receives keyboard focus."* Without this, a keyboard user lands on the Next button, autoplay advances under them, and the button they meant to press is now pointing at a different slide.

We need to clear the interval on focus and recreate it on blur. First, lift the interval ID out of the closure and into context so new actions can reach it. In `src/view.js`, update `callbacks.initSlideShow` — **replace** the `const int = setInterval(...)` line from Section 8 with `ctx.intervalId = setInterval(...)`, and update the cleanup to read from context too:

```js
initSlideShow: () => {
    const ctx = getContext();
    if ( ! ctx.autoplay ) return;
    // Was: const int = setInterval( ... ). Promoted to ctx.intervalId so
    // pauseAutoplay / resumeAutoplay below can reach it.
    ctx.intervalId = setInterval(
        withScope( () => { actions.nextImage(); } ),
        state.transitionsSpeed
    );
    return () => {
        if ( ctx.intervalId ) clearInterval( ctx.intervalId );
    };
},
```

Then add two actions:

```js
pauseAutoplay: () => {
    const ctx = getContext();
    if ( ctx.intervalId ) {
        clearInterval( ctx.intervalId );
        ctx.intervalId = null;
    }
},
resumeAutoplay: () => {
    const ctx = getContext();
    if ( ! ctx.autoplay || ctx.intervalId ) return;
    ctx.intervalId = setInterval(
        withScope( () => { actions.nextImage(); } ),
        state.transitionsSpeed
    );
},
```

In `src/render.php`, on the same outer wrapper, add:

```php
data-wp-on--focusin="actions.pauseAutoplay"
data-wp-on--focusout="actions.resumeAutoplay"
```

We use `focusin` / `focusout` (not `focus` / `blur`) because they bubble — focus landing on Prev/Next inside the wrapper still triggers the pause. The second half of the `resumeAutoplay` guard (`|| ctx.intervalId`) prevents double intervals when focus moves between children.

One subtle thing about `resumeAutoplay`: it doesn't fire `nextImage()` immediately, it just starts a fresh interval. So if a keyboard user tabs out 1.9s into a 2s cycle, they'll wait a full 2s after blur before the next advance. That's intentional — restarting the cycle on blur is more predictable than catching it up.

By the end of 9a, your wrapper opening tag in `src/render.php` should look like this:

```php
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    data-wp-interactive='iapi-gallery'
    data-wp-init="callbacks.initSlideShow"
    role="region"
    aria-roledescription="carousel"
    aria-label="Image gallery"
    data-wp-on--focusin="actions.pauseAutoplay"
    data-wp-on--focusout="actions.resumeAutoplay"
>
```

### Step 3 — Visible focus indicator

A focus ring is the only cue keyboard users get that they've arrived somewhere. If your theme doesn't already provide a strong one on the Prev/Next buttons, add a rule to `src/style.scss`:

```scss
.wp-block-iapi-gallery-slider .buttons button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}
```

**Verify:**

- Tab into the slider — focus lands on the Prev button with a visible ring.
- If autoplay was running, it pauses the moment focus enters the carousel.
- Tab through Prev → counter → Next; autoplay stays paused.
- Tab away from the slider entirely — autoplay resumes (if it was on).
- With a screen reader, focusing into the carousel announces "Image gallery, carousel, region."
- Two sliders on one page: each only pauses while *its own* children have focus.

## Sub-stage 9b — Touch

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
   Note that `ctx.swipe` is *ephemeral* per-instance state — it lives in context because that's where per-instance scratch data goes; we never seed it from the server. No need to declare it anywhere ahead of time either: the first `ctx.swipe = …` write on touchstart creates the field, and onTouchEnd reads it back from the same context.
2. In `src/render.php`, on the `.slider-container`, add `data-wp-on--touchstart="actions.onTouchStart"` and `data-wp-on--touchend="actions.onTouchEnd"`.

**Verify:** in Chrome devtools touch emulation (toggle with `Cmd-Shift-M` / `Ctrl-Shift-M` inside DevTools), swiping left/right changes slides.

## Sub-stage 9c — Continuous

1. In `iapi-gallery-slider.php`, two in-place edits to the filter from Section 8. These are the most fragile edits in the workshop because they sit inside multi-line PHP that already exists — go slow.

   **a.** Add `'continuous'` to the attribute-driven half of the `array_merge`. Before/after:

   ```php
   // Before (end of Section 8):
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

   // After:
   $context = array_merge(
       array(
           'autoplay'   => $block['attrs']['autoplay'] ?? false,
           'continuous' => $block['attrs']['continuous'] ?? false,
           'speed'      => $block['attrs']['speed'] ?? '3',
       ),
       array(
           'currentSlide' => 1,
           'totalSlides'  => $total_slides,
       )
   );
   ```

   **b.** Update the `wp_interactivity_state()` call we added in Section 7. When continuous is on, the prev button should be enabled from first paint — so seed `noPrevSlide` as the inverse of continuous. Before/after:

   ```php
   // Before (end of Section 7, unchanged through Section 8):
   wp_interactivity_state(
       'iapi-gallery',
       array(
           'noPrevSlide' => true,
           'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}",
       )
   );

   // After:
   wp_interactivity_state(
       'iapi-gallery',
       array(
           'noPrevSlide' => ! $context['continuous'],
           'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}",
       )
   );
   ```
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
   - Broaden the existing `actions.nextImage` wrap condition from `ctx.autoplay` to `( ctx.continuous || ctx.autoplay )`. The full updated function:
     ```js
     nextImage: () => {
         const ctx = getContext();
         // Both autoplay and continuous wrap from the last slide to the
         // first. Manual clicks in non-continuous mode stop at the end
         // because state.noNextSlide keeps the button disabled.
         if (
             ( ctx.continuous || ctx.autoplay ) &&
             ctx.currentSlide === ctx.totalSlides
         ) {
             ctx.currentSlide = 1;
             return;
         }
         ctx.currentSlide++;
     },
     ```

**Verify:** toggle Continuous on, click prev from slide 1 → jumps to the last slide; click next from the last → jumps to 1. Buttons stay enabled. Autoplay still works alongside continuous.

## Code reference

End-of-section snapshot lives in `code-reference/section-9/`.

## Wrap-up

This is the finish line. The slider is complete: server-rendered with directives, navigable by buttons, keyboard, touch, and screen reader, optionally autoplaying (and pausing politely for keyboard users), optionally continuous. The interactive layer is roughly 120 lines of `view.js` and a ~50-line render filter — small for what it does.

→ Return to [README](../README.md).
