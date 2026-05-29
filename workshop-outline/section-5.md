# Section 5 — Hello, Store

**Type:** coding

## Goal

Get the smallest possible Interactivity API round-trip working: a directive on HTML reads from context, a button click mutates context, and the page re-renders. Everything in sections 6–9 sits on top of this loop, so we land it cleanly first before stacking more concepts.

By the end of this section, clicking the next button bumps a counter displayed on the page from 1 → 2 → 3 → 4 → … (no upper bound yet — we'll fix that in Section 6). The slides themselves do *not* visibly move yet either — we haven't told the page how to *react* visually. That's coming in Section 6.

## Concepts introduced

- The `store()` shape — `state`, `actions`, `callbacks` (we only fill `actions` this section).
- `data-wp-interactive` — sets the namespace once on the wrapper; descendants inherit (we'll come back to inheritance in Section 7).
- `data-wp-context` — seeded from the server with `wp_interactivity_data_wp_context()`.
- `data-wp-on--click` — wires a DOM event to a store action.
- `data-wp-text` — binds the text content of an element to a value.
- `getContext()` and mutating context inside an action (`ctx.currentSlide++`).

## Steps

1. In `src/render.php`, define a hardcoded `$context` array above the wrapper, then emit it as an attribute on the wrapper opening tag. Add this just inside the closing `?>` of the file's opening PHP block (above the `<div>`):

   ```php
   $context = array(
       'currentSlide' => 1,
       'totalSlides'  => 3,
   );
   ```

   Then update the wrapper opening tag — the wrapper already has `data-wp-interactive='iapi-gallery'`; add the `data-wp-context` line below it:

   ```php
   <div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
       data-wp-interactive='iapi-gallery'
       <?php echo wp_interactivity_data_wp_context( $context ); ?>
   >
   ```

   A quick note on that string: our block's name is `iapi/gallery-slider` (per `block.json`), but the Interactivity store namespace is `iapi-gallery`. They don't have to match — the store namespace is just a label we pick to scope directives and the `store()` call. We chose a shorter one here. The only contract is that the value in `data-wp-interactive` and the first argument to `store(…)` agree.
2. Change the counter `<p>` to read from context:

   ```html
   <p data-wp-text="context.currentSlide"></p>
   ```

   Reload — it should render `1`.

   Heads up: the editor preview from Section 3 reads `state.imageIndex`, but here on the front end we're reading `context.currentSlide` directly. That's intentional — we haven't built any `state` getters yet, so we go straight to context. Section 6 promotes this front-end counter to `state.imageIndex` so both sides converge.
3. Wire only the next button — add `data-wp-on--click` to its opening tag. Keep the existing `aria-label` and `&gt;` content in place; leave the prev button without a handler for now. The opening tag should now look like:

   ```html
   <button aria-label="go to previous slide">&lt;</button>
   <p data-wp-text="context.currentSlide"></p>
   <button data-wp-on--click="actions.nextImage" aria-label="go to next slide">&gt;</button>
   ```
4. In `src/view.js`, create the store shell:
   ```js
   import { store, getContext } from '@wordpress/interactivity';

   store( 'iapi-gallery', {
       state: {},
       actions: {
           nextImage: () => {
               const ctx = getContext();
               ctx.currentSlide++;
           },
       },
   } );
   ```
5. `npm run start` if you haven't already. Reload the post. Clicking next should bump the counter.

## Verification

- Counter renders "1" on first paint (no flash).
- Clicking next bumps it to 2, 3, 4 — and keeps going past 3. That's expected; Section 6 adds the disable logic.
- Prev button is inert.
- No console errors.

## Code reference

End-of-section snapshot lives in `code-reference/section-5/`.

## What's Next

→ [Section 6 — Sliding + Bounds](./section-6.md)
