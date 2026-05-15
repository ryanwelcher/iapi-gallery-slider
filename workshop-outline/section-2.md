# Section 2 — Anatomy of the Starter

**Type:** tour

## Goal

Orient attendees to the plugin's file layout and the moving parts that make an interactive block work: block metadata, the render callback, the view module, and the server-side render filter.

## Steps

1. Tour `iapi-gallery-slider.php` — `register_block_type_from_metadata` and the `render_block_*` filter.
2. Tour `src/block.json` — `supports.interactivity`, `viewScriptModule`, attributes (`continuous`, `autoplay`, `speed`).
3. Tour `src/render.php` — the server-rendered markup.
4. Tour `src/view.js` — the `store()` shape (state, actions, callbacks).
5. Show the `src/` → `build/` pipeline (`npm run start`).

## What's Next

→ [Section 3 — Interactivity API Primer](./section-3.md)
