# Section 3 — Interactivity API Primer

**Type:** reading

## Goal

Build up the mental model we'll need before writing code: how directives, context, state, actions, and callbacks fit together, and how the server seeds initial state.

## Concepts

1. **Directives at a glance** — `data-wp-interactive`, `data-wp-context`, `data-wp-bind`, `data-wp-on`, `data-wp-class`, `data-wp-style`, `data-wp-init`.
2. **The `store()` shape** — `state` (getters), `actions` (event handlers), `callbacks` (lifecycle).
3. **Local context vs global state** — when to reach for which.
4. **Server-side state seeding** with `wp_interactivity_state()` to avoid content flash on first paint.

We'll see each of these show up in the coding sections that follow — this is just the map before we start moving.

## What's Next

→ [Section 4 — Hello, Store](./section-4.md)
