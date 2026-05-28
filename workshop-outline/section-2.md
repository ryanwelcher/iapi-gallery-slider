# Section 2 — Anatomy of the Starter

**Type:** tour

## Goal

Get our bearings in the plugin's file layout and the moving parts of an Interactivity API block, so we recognize each piece as we build it up in sections 3 and 5–9. We're touring the *starter* — most of the IAPI pieces aren't here yet. Each file note below says what the starter ships with and where we'll fill in the rest.

## Steps

1. **`iapi-gallery-slider.php`** — registers the block via `register_block_type`. That's all the starter does. In Section 7 we'll add a `render_block_iapi/gallery-slider` filter to this file that walks the inner blocks at render time and seeds context.
2. **`src/block.json`** — `supports.interactivity: true`, `viewScriptModule: "file:./view.js"`, and three attributes (`continuous`, `autoplay`, `speed`) that drive the Inspector controls. We won't touch this file in the workshop — it's already done.
3. **`src/edit.js`** — the block's editor-side component. The starter is a near-empty stub. In Section 3 we'll build it into a full editor preview (inner-block area, prev/next buttons, counter) plus a "Slider Controls" panel in the Inspector sidebar for the three attributes.
4. **`src/render.php`** — the server-rendered markup of the block. The starter already includes the outer wrapper, a `.slider-container` for the slides, and prev/next buttons. One IAPI directive is in place from the start: `data-wp-interactive='iapi-gallery'` on the wrapper, which scopes every directive we add later to the same store. We'll edit this file in Sections 5, 6, 7, 8, and 9.
5. **`src/view.js`** — where the Interactivity store will live. Empty in the starter (just a placeholder comment). Starting in Section 5 we'll fill it with `state`, `actions`, and `callbacks` — the three branches of the store — across the remaining coding sections.
6. **`src/style.scss`** (and `src/editor.scss`) — front-end and editor-only styles. The starter already ships both; the watcher compiles them automatically. We won't touch styles until Section 9a, where we add a focus ring on the prev/next buttons.
7. **`src/` → `build/` pipeline** — `npm run start` watches for changes. The bundler emits `viewScript`-flavored modules; the `--experimental-modules` flag in `@wordpress/scripts` is what enables `viewScriptModule` support.

## What's Next

→ [Section 3 — Editor Controls](./section-3.md)
