# Section 2 — Anatomy of the Starter

**Type:** tour

## Goal

Get our bearings in the plugin's file layout and the moving parts of an Interactivity API block, so we recognize each piece as we build it up in sections 3 and 5–9. We're touring the *finished* slider here — the file we'll write to in each coding section is called out so we know where we're headed.

## Steps

1. **`iapi-gallery-slider.php`** — `register_block_type`. The `render_block_*` filter that walks inner blocks lives here too in the finished slider; we'll write it in Section 7.
2. **`src/block.json`** — `supports.interactivity: true`, `viewScriptModule: "file:./view.js"`, and three attributes (`continuous`, `autoplay`, `speed`) that drive the Inspector controls. We won't touch this file in the workshop — it's already done.
3. **`src/edit.js`** — the block's editor-side component. Renders the slider preview and the Inspector controls for the three attributes. We'll build this from scratch in Section 3.
4. **`src/render.php`** — the server-rendered markup of the block. The starter already includes the outer wrapper, a `.slider-container` for the slides, and prev/next buttons. One IAPI directive is in place from the start: `data-wp-interactive='iapi-gallery'` on the wrapper, which scopes every directive we add later to the same store. We'll edit this file in Sections 5, 6, 7, 8, and 9.
5. **`src/view.js`** — the Interactivity store (`state`, `actions`, `callbacks`). This is the other file we'll edit in every coding section.
6. **`src/style.scss`** (and `src/editor.scss`) — front-end and editor-only styles. The starter already ships both; the watcher compiles them automatically. We won't touch styles until Section 9a, where we add a focus ring on the prev/next buttons.
7. **`src/` → `build/` pipeline** — `npm run start` watches for changes. The bundler emits `viewScript`-flavored modules; the `--experimental-modules` flag in `@wordpress/scripts` is what enables `viewScriptModule` support.

## What's Next

→ [Section 3 — Editor Controls](./section-3.md)
