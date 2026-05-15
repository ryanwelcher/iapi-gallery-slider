# Section 7 — Picture-in-Picture with the Interactivity Router

**Type:** coding

## Goal

Use `@wordpress/interactivity-router` so the gallery survives client-side navigations. Attendees finish with a "pop out" slider that keeps playing in a floating panel while the rest of the site navigates around it.

## Steps

1. Import `@wordpress/interactivity-router` and call `actions.navigate()` to enable client-side navigation across site links.
2. Identify the navigation region — what gets swapped on route change vs. what persists.
3. Add a `popOut` boolean to context and an `actions.togglePopOut` toggle.
4. Promote the slider's container out of the swapped region (e.g. into a fixed/floating element appended to `<body>` or a persistent layout slot) so it isn't unmounted on route change.
5. Bind position and visibility with `data-wp-class--is-popped-out` (or `data-wp-style`).
6. Discuss the trade-offs: which regions are router-managed, `<head>` updates, focus/scroll restoration, accessibility (announce navigation, keep focus sensible while a floating element keeps playing).

## Code reference

End-of-section snapshot will live in `code-reference/section-7/`.

## What's Next

→ End of workshop. Return to [README](../README.md).
