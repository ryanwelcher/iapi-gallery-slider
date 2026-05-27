# Section 5 — Hello, Store

**Type:** coding

## Goal

Get the smallest possible Interactivity API round-trip working: a directive on HTML reads from context, a button click mutates context, and the page re-renders. Everything in sections 6–9 sits on top of this loop, so we land it cleanly first before stacking more concepts.

By the end of this section, clicking the next button bumps a counter displayed on the page from 1 → 2 → 3 → 4 → … (no upper bound yet — we'll fix that in §6). The slides themselves do *not* visibly move yet either — we haven't told the page how to *react* visually. That's coming in §6.

## Concepts introduced

- The `store()` shape — `state`, `actions`, `callbacks` (we only fill `actions` this section).
- `data-wp-interactive` — sets the namespace once on the wrapper; descendants inherit (we'll come back to inheritance in §7).
- `data-wp-context` — seeded from the server with `wp_interactivity_data_wp_context()`.
- `data-wp-on--click` — wires a DOM event to a store action.
- `data-wp-text` — binds the text content of an element to a value.
- `getContext()` and mutating context inside an action (`ctx.currentSlide++`).

## Steps

1. In `src/render.php`, define a hardcoded `$context = array( 'currentSlide' => 1, 'totalSlides' => 3 )` and emit it on the wrapper via `<?php echo wp_interactivity_data_wp_context( $context ); ?>`. The wrapper already has `data-wp-interactive='iapi-gallery'`.
2. Change the counter `<p>` to `<p data-wp-text="context.currentSlide"></p>`. Reload — it should render `1`.
3. Wire only the next button: `<button data-wp-on--click="actions.nextImage" …>`. Leave the prev button without a handler for now.
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
- Clicking next bumps it to 2, 3, 4 — and keeps going past 3. That's expected; §6 adds the disable logic.
- Prev button is inert.
- No console errors.

## Code reference

End-of-section snapshot lives in `code-reference/section-5/`.

## What's Next

→ [Section 6 — Sliding + Bounds](./section-6.md)
