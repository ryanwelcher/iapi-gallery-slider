# Section 5 — Server-Side: Injecting Directives onto Inner Blocks

**Type:** coding

## Goal

Use the `render_block_*` filter and `WP_HTML_Tag_Processor` to inject Interactivity API directives onto inner blocks (Cover, Image, Media+Text) so attendees don't have to author them by hand, and seed initial state on the server.

## Steps

1. Hook into `render_block_block-developer-cookbook/iapi-gallery-slider`.
2. Walk the inner blocks with `WP_HTML_Tag_Processor`, matching the allowed inner block classes, and count them.
3. Use `set_bookmark` / `seek` to return to the wrapper and attach `data-wp-context` with `currentSlide` and `totalSlides` (the Tag Processor escapes attribute values for you, so plain `wp_json_encode()` is enough).
4. Seed `wp_interactivity_state()` so initial state (e.g. `noPrevSlide`, `imageIndex`) renders correctly with no client-side flash.

## Key concept: namespace inheritance

Directives inherit the `data-wp-interactive` namespace from the nearest ancestor that declares one. Our wrapper in `render.php` already has `data-wp-interactive='iapi-gallery'`, so every descendant — including the inner Cover/Image/Media+Text blocks and anything we attach directives to inside them — resolves against `iapi-gallery` automatically. We only need to set `data-wp-interactive` again on a descendant when switching to a *different* namespace.

This is why the tag walk in step 2 only *counts* the inner blocks — it does not add `data-wp-interactive` to each one. That would be redundant and obscures how namespace scoping actually works.

## Code reference

End-of-section snapshot will live in `code-reference/section-5/`.

## What's Next

→ [Section 6 — Enhancements: Autoplay, Keyboard, Touch, Continuous](./section-6.md)
