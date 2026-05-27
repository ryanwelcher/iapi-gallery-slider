# Section 6 — Server-Side Directive Injection

**Type:** coding

## Goal

Stop hardcoding `totalSlides`. Use a `render_block_*` filter with `WP_HTML_Tag_Processor` to count the inner blocks at render time and seed the wrapper's `data-wp-context` with the real number. Then use `wp_interactivity_state()` to seed initial global state so the first paint matches the interactive state with no client-side flash.

This is the section where the slider becomes adaptive to whatever inner blocks the editor placed in it.

## Concepts introduced

- `render_block_<block-name>` filter — hooking after the block renders to mutate its HTML.
- `WP_HTML_Tag_Processor` — `next_tag`, `class_list`, `set_attribute`.
- `set_bookmark` / `seek` / `release_bookmark` — single-pass walk that returns to the wrapper after counting.
- **Namespace inheritance.** `data-wp-interactive` is declared once on the wrapper; every descendant resolves directives against that namespace. We do *not* call `set_attribute( 'data-wp-interactive', … )` on inner blocks. Setting it again would be redundant and would suggest (incorrectly) that every interactive element needs its own namespace declaration.
- `wp_interactivity_state()` — seeding global state to avoid client-side flash. Different from `wp_interactivity_data_wp_context()`: state is shared across instances; context is per-instance.

## Steps

1. In `src/render.php`, remove the hardcoded `$context` block and the `wp_interactivity_data_wp_context()` call. The wrapper still has `data-wp-interactive='iapi-gallery'`. Context will arrive via the filter.
2. In `iapi-gallery-slider.php`, add the `add_directives_to_inner_blocks( $block_content, $block )` function:
   - Construct a `WP_HTML_Tag_Processor` from `$block_content`.
   - `next_tag( array( 'class_name' => 'wp-block-iapi-gallery-slider' ) )` to land on the wrapper.
   - `set_bookmark( 'main' )`.
   - Loop `while ( $slides->next_tag() )` and check `class_list()` against `array( 'wp-block-cover', 'wp-block-image', 'wp-block-media-text' )`; increment `$total_slides` on a match.
   - `seek( 'main' )` then `release_bookmark( 'main' )`.
   - `set_attribute( 'data-wp-context', wp_json_encode( array( 'currentSlide' => 1, 'totalSlides' => $total_slides ) ) )`.
   - `return $slides->get_updated_html()`.
3. Register: `add_filter( 'render_block_iapi/gallery-slider', 'add_directives_to_inner_blocks', 10, 2 );`.
4. Reload. The slider now counts inner blocks correctly. But: do a hard reload and watch carefully. The counter briefly shows "1/3" (the static markup from `render.php`) before snapping to the right value. *That's the flash we're about to fix.*
5. Add `wp_interactivity_state( 'iapi-gallery', array( 'noPrevSlide' => true, 'imageIndex' => "1/{$total_slides}" ) )` before the `set_attribute` call. Reload. Flash gone.

## Verification

- Add/remove inner blocks in the editor → save → reload front end. Counter and disable behavior follow the new total automatically.
- Hard-reload several times. No counter flash on first paint.
- Inspect the DOM: no inner block has `data-wp-interactive` — only the wrapper does. Namespace inheritance is doing the work.

## Code reference

End-of-section snapshot lives in `code-reference/section-6/`.

## What's Next

→ [Section 7 — Autoplay](./section-7.md)
