# Section 2 — Anatomy of the Starter

**Type:** tour

## Goal

Get our bearings in the plugin's file layout and the moving parts of an Interactivity API block, so we recognize each piece as we build it up in sections 3 and 5–9. We're touring the *starter* — most of the IAPI pieces aren't here yet. For each file below, open it in your editor and skim along; the note says what the starter ships with and where we'll fill in the rest.

## Steps

1. **Open `iapi-gallery-slider.php`.** The plugin entry file. It registers the block via `register_block_type` and does nothing else. In Section 7 we'll add a `render_block_iapi/gallery-slider` filter to this file that walks the inner blocks at render time and seeds context.
2. **Open `src/block.json`.** Notice `supports.interactivity: true`, `viewScriptModule: "file:./view.js"`, and three attributes (`continuous`, `autoplay`, `speed`) that drive the Inspector controls. We won't edit this file in the workshop — it's already done.

   **`supports.interactivity: true` — the opt-in.** This one line is what tells WordPress this block participates in the Interactivity API. Practically, it does two things: it makes the `viewScriptModule` field above load as an ES module (`<script type="module">`) instead of a classic script, and it makes WordPress automatically enqueue the `@wordpress/interactivity` runtime on any page that renders this block. Without it, our `view.js` would either not load at all or load as a classic script that can't `import` from `@wordpress/interactivity` — and none of the `data-wp-*` directives in our markup would do anything.

   Think of `supports.interactivity: true` and the `data-wp-interactive` attribute we'll see in `render.php` as a *pair*: the block.json flag opts the block into the runtime on the server side; `data-wp-interactive` declares a namespaced region in the markup that the runtime then hydrates on the client. You need both. Miss the flag and the runtime never loads; miss the directive and the runtime loads but has nothing to bind to.

   One detail worth flagging up front: `speed` is declared with `"type": "string"` (default `"3"`). When we reach Section 8 we'll coerce it to a number before multiplying — that's why, not because the value is mysterious.
3. **Open `src/edit.js`.** The block's editor-side component. The starter is a near-empty stub. In Section 3 we'll build it into a full editor preview (inner-block area, prev/next buttons, counter) plus a "Slider Controls" panel in the Inspector sidebar for the three attributes.
4. **Open `src/render.php`.** The server-rendered markup of the block. The starter already includes the outer wrapper, a `.slider-container` for the slides, and prev/next buttons. One IAPI directive is in place from the start — `data-wp-interactive='iapi-gallery'` on the wrapper — and it's worth pausing on, because it's the *other half* of the opt-in we just saw in `block.json`.

   **What `data-wp-interactive` does.** It tells the Interactivity runtime "this element and everything inside it is an interactive region bound to the store named `iapi-gallery`." When the page loads, the runtime walks the DOM looking for elements with this attribute; each one it finds becomes a hydration root. From that root down, every `data-wp-*` directive on a descendant is resolved against the named store — `data-wp-on--click="actions.nextImage"` on a button two levels deep still finds `actions.nextImage` on the `iapi-gallery` store, because the runtime knows which namespace it's inside.

   **Why it goes on the wrapper, once.** The attribute declares a namespace *scope*. Descendants inherit it automatically — we don't (and shouldn't) repeat `data-wp-interactive` on every interactive child. Section 7 leans on this directly when the render filter only counts inner blocks instead of stamping each one with its own namespace.

   **Why the value is a string and not a boolean.** The value is the store namespace — the same string we'll pass as the first argument to `store(…)` in `view.js`. Picking a clear name matters because it scopes everything: if two different plugins both used `data-wp-interactive="slider"`, their directives would collide. We chose `iapi-gallery` to make ours unambiguous.

   Together, `supports.interactivity: true` (in `block.json`) loads the runtime, and `data-wp-interactive='iapi-gallery'` (in `render.php`) gives the runtime something to bind to. Sections 5–9 add directives to children of this wrapper; every one of them works because of the namespace declared here.

   We'll edit this file in Sections 5, 6, 7, 8, and 9.
5. **Open `src/view.js`.** Where the Interactivity store will live. Empty in the starter (just a placeholder comment). Starting in Section 5 we'll fill it with `state`, `actions`, and `callbacks` — the three branches of the store — across the remaining coding sections.
6. **`src/style.scss`** (and `src/editor.scss`) — front-end and editor-only styles. The starter already ships both; the watcher compiles them automatically. We won't touch styles until Section 9a, where we add a focus ring on the prev/next buttons.
7. **`src/` → `build/` pipeline.** `npm run start` watches `src/` and writes the bundled output to `build/`. Two terms worth unpacking:
   - **`viewScript`** is the block.json field for a front-end script that loads in a regular `<script>` tag.
   - **`viewScriptModule`** is the newer field for a front-end *ES module*, loaded via `<script type="module">`. The Interactivity API requires this because `@wordpress/interactivity` ships as ESM.
   - **`--experimental-modules`** is the `@wordpress/scripts` flag that turns on the ESM build pipeline that emits a `viewScriptModule`-compatible artifact. Without it, the watcher would still emit a classic `viewScript` and `block.json`'s `viewScriptModule` reference would resolve to nothing.

## What's Next

→ [Section 3 — Editor Controls](./section-3.md)
