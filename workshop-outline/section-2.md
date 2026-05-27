# Section 2 — Anatomy of the Starter

**Type:** tour

## Goal

Orient attendees to the plugin's file layout and the moving parts of an Interactivity API block so they recognize each piece as it gets built up in sections 4–8. We're touring the *finished* slider here — the file you'll write to in each coding section is called out so attendees know where they're headed.

## Steps

1. **`iapi-gallery-slider.php`** — `register_block_type`. The `render_block_*` filter that walks inner blocks lives here too in the finished slider; we'll write it in §6.
2. **`src/block.json`** — `supports.interactivity: true`, `viewScriptModule: "file:./view.js"`, and three attributes (`continuous`, `autoplay`, `speed`) that drive the Inspector controls. Attendees won't touch this file in the workshop — it's already done.
3. **`src/edit.js`** — Inspector controls for the three attributes. Also already done; we won't touch it.
4. **`src/render.php`** — the server-rendered markup of the block. This is the file directives live on; we'll edit it in §4, §5, §6, §7, and §8.
5. **`src/view.js`** — the Interactivity store (`state`, `actions`, `callbacks`). This is the other file we'll edit in every coding section.
6. **`src/` → `build/` pipeline** — `npm run start` watches for changes. The bundler emits `viewScript`-flavored modules; the `--experimental-modules` flag in `@wordpress/scripts` is what enables `viewScriptModule` support.

## What's Next

→ [Section 3 — Interactivity API Primer](./section-3.md)
