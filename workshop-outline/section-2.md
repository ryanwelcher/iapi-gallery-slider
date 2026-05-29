# Section 2 — Anatomy of the Starter

**Type:** tour

## Goal

Get our bearings in the plugin's file layout and the moving parts of an Interactivity API block, so we recognize each piece as we build it up in sections 3 and 5–9. We're touring the *starter* — most of the IAPI pieces aren't here yet. For each file below, open it in your editor and skim along; the note says what the starter ships with and where we'll fill in the rest.

## Steps

1. **Open `iapi-gallery-slider.php`.** The plugin entry file. It registers the block via `register_block_type` and does nothing else. In Section 7 we'll add a `render_block_iapi/gallery-slider` filter to this file that walks the inner blocks at render time and seeds context.
2. **Open `src/block.json`.** Notice `supports.interactivity: true`, `viewScriptModule: "file:./view.js"`, and three attributes (`continuous`, `autoplay`, `speed`) that drive the Inspector controls. We won't edit this file in the workshop — it's already done.

   One detail worth flagging up front: `speed` is declared with `"type": "string"` (default `"3"`). When we reach Section 8 we'll coerce it to a number before multiplying — that's why, not because the value is mysterious.
3. **Open `src/edit.js`.** The block's editor-side component. The starter is a near-empty stub. In Section 3 we'll build it into a full editor preview (inner-block area, prev/next buttons, counter) plus a "Slider Controls" panel in the Inspector sidebar for the three attributes.
4. **Open `src/render.php`.** The server-rendered markup of the block. The starter already includes the outer wrapper, a `.slider-container` for the slides, and prev/next buttons. One IAPI directive is in place from the start: `data-wp-interactive='iapi-gallery'` on the wrapper, which scopes every directive we add later to the same store. We'll edit this file in Sections 5, 6, 7, 8, and 9.
5. **Open `src/view.js`.** Where the Interactivity store will live. Empty in the starter (just a placeholder comment). Starting in Section 5 we'll fill it with `state`, `actions`, and `callbacks` — the three branches of the store — across the remaining coding sections.
6. **`src/style.scss`** (and `src/editor.scss`) — front-end and editor-only styles. The starter already ships both; the watcher compiles them automatically. We won't touch styles until Section 9a, where we add a focus ring on the prev/next buttons.
7. **`src/` → `build/` pipeline.** `npm run start` watches `src/` and writes the bundled output to `build/`. Two terms worth unpacking:
   - **`viewScript`** is the block.json field for a front-end script that loads in a regular `<script>` tag.
   - **`viewScriptModule`** is the newer field for a front-end *ES module*, loaded via `<script type="module">`. The Interactivity API requires this because `@wordpress/interactivity` ships as ESM.
   - **`--experimental-modules`** is the `@wordpress/scripts` flag that turns on the ESM build pipeline that emits a `viewScriptModule`-compatible artifact. Without it, the watcher would still emit a classic `viewScript` and `block.json`'s `viewScriptModule` reference would resolve to nothing.

## What's Next

→ [Section 3 — Editor Controls](./section-3.md)
