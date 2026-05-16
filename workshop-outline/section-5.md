# Section 5 — Server-Side: Injecting Directives onto Inner Blocks

**Type:** coding

## Goal

Use the `render_block_*` filter and `WP_HTML_Tag_Processor` to inject Interactivity API directives onto inner blocks (Cover, Image, Media+Text) so attendees don't have to author them by hand, and seed initial state on the server.

## Steps

1. Hook into `render_block_block-developer-cookbook/iapi-gallery-slider`.
2. Walk the inner blocks with `WP_HTML_Tag_Processor`, matching the allowed inner block classes.
3. Set `data-wp-interactive` on each match, counting slides as you go.
4. Use `set_bookmark` / `seek` to return to the wrapper and attach `data-wp-context` with `currentSlide` and `totalSlides` (the Tag Processor escapes attribute values for you, so plain `wp_json_encode()` is enough).
5. Seed `wp_interactivity_state()` so initial state (e.g. `noPrevSlide`, `imageIndex`) renders correctly with no client-side flash.

## Code reference

End-of-section snapshot will live in `code-reference/section-5/`.

## What's Next

→ [Section 6 — Enhancements: Autoplay, Keyboard, Touch, Continuous](./section-6.md)
