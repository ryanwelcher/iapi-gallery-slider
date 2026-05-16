# Section 7 — Deep-Linkable Slides with the Interactivity Router

**Type:** coding · **Bonus / optional**

> This section is bonus material. The workshop's core arc finishes at [Section 6](./section-6.md) — every attendee should leave with a complete, working slider before this section starts. Run section 7 only if there's time and energy in the room; otherwise treat it as a take-home reference.

## Goal

Make each slide individually addressable so the URL is the source of truth for which slide is showing. Along the way, attendees see two distinct uses of `@wordpress/interactivity-router`: explicit per-slide URLs driven by `history.pushState`, and full delegated link routing that keeps client store state alive across page transitions. Finish with a polished share-link feature that copies the current slide URL and shows a toast.

## Steps

1. **Read the slide from the URL on the server.** In the `render_block_*` filter, read `?slide=` (with `absint( wp_unslash( $_GET['slide'] ) )`), clamp to `[1, totalSlides]`, and seed `currentSlide` in `data-wp-context`. Deep-linking now works on a hard reload.
2. **Suppress the first-paint animation.** Add `firstPaint: true` to `wp_interactivity_state()` and bind it on `.slider-container` with `data-wp-class--no-transition="state.firstPaint"`. Also inline `style="transform: translateX(-N%)"` server-side so the rendered position matches `state.currentPos` and nothing animates on hydration.
3. **Update `actions.prevImage` / `nextImage`.** Mutate `ctx.currentSlide` locally so the CSS transition animates, flip `state.firstPaint = false`, and call `window.history.pushState({}, '', slideHref(next))` to keep the URL in sync.
4. **Wire `popstate`.** In `callbacks.initSlideShow`, register a `withScope` `popstate` listener that re-reads `?slide=` and writes it back into `ctx.currentSlide` so browser back/forward step through slides. Return a cleanup that removes the listener.
5. **Add a share button.** Replace any earlier "pop out" stub with a button that calls a generator action `*shareSlide()` — `yield navigator.clipboard.writeText(window.location.href)`, set `state.shareCopied = true`, and use `setTimeout(withScope(() => { state.shareCopied = false; }), 1500)` to reset it. Bind a toast via `data-wp-class--is-visible="state.shareCopied"`.
6. **Introduce the Interactivity Router as a separate concern.** Create `src/router.js` that registers a second store namespace (e.g. `iapi-gallery-router`) with a single generator action `*navigate(e)` that finds `e.target.closest('a[href]')`, filters out cross-origin links / modifier-clicks / non-`_self` targets, dynamically imports `@wordpress/interactivity-router`, and yields `routerActions.navigate(link.href)`. Side-effect-import it from `view.js`.
7. **Mark the router region and wire delegated link handling.** Add `data-wp-router-region="iapi-gallery"` to the wrapper, plus `data-wp-on-document--click="iapi-gallery-router::actions.navigate"`. Note the cross-namespace directive value (`namespace::actions.name`) — this is how directives reference actions outside their own `data-wp-interactive` store.
8. **Discuss the trade-offs.** Router-managed regions must match by ID across pages; otherwise the router falls back to a full reload (and client state in the JS store is lost). State in `state` survives client-side navigations because per IAPI docs, "client-side state is never automatically overwritten by the server." Per-instance `context` is replaced when its region is swapped.

## Code reference

End-of-section snapshot will live in `code-reference/section-7/`.

## What's Next

→ End of workshop. Return to [README](../README.md).
