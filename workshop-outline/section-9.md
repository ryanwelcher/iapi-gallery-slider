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

We need to clear the interval on focus and recreate it on blur. First, lift the interval ID out of the closure and into context so new actions can reach it. In `src/view.js`, update `callbacks.initSlideShow`:

```js
initSlideShow: () => {
    const ctx = getContext();
    if ( ! ctx.autoplay ) return;
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

We use `focusin` / `focusout` (not `focus` / `blur`) because they bubble — focus landing on Prev/Next inside the wrapper still triggers the pause. The `resumeAutoplay` guard (`if ( ctx.intervalId )`) prevents double intervals when focus moves between children.

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
   Note that `ctx.swipe` is *ephemeral* per-instance state — it lives in context because that's where per-instance scratch data goes; we never seed it from the server.
2. In `src/render.php`, on the `.slider-container`, add `data-wp-on--touchstart="actions.onTouchStart"` and `data-wp-on--touchend="actions.onTouchEnd"`.

**Verify:** in Chrome devtools touch emulation, swiping left/right changes slides.

## Sub-stage 9c — Continuous

1. In `iapi-gallery-slider.php`, add `'continuous' => $block['attrs']['continuous'] ?? false` to the `array_merge` context. Then change the `wp_interactivity_state( 'iapi-gallery', … )` call we added in Section 7 so `'noPrevSlide' => ! $context['continuous']` (when continuous is on, the prev button is enabled from first paint).
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

This is the finish line. The slider is complete: server-rendered with directives, navigable by buttons / touch / screen reader, optionally autoplaying (and pausing politely for keyboard users), optionally continuous. The interactive layer is roughly 100 lines of `view.js` and a ~40-line render filter — small for what it does.

→ Return to [README](../README.md).
