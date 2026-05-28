# Section 7 — Server-Side Directive Injection

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

1. In `src/render.php`, remove the hardcoded `$context` block and the `wp_interactivity_data_wp_context()` call. The wrapper still has `data-wp-interactive='iapi-gallery'`. Context will arrive via the filter. (Don't reload between this step and step 3 — until the filter is registered, the wrapper has no context at all and clicking the buttons will throw "currentSlide is not defined" in the console.)
2. In `iapi-gallery-slider.php`, add the filter callback below the existing `register_block_type` registration. We walk the rendered HTML with `WP_HTML_Tag_Processor`: land on the wrapper, bookmark it, scan forward counting inner slides, then jump back to write the final `data-wp-context` value.

   ```php
   /**
    * Filter the rendered block to count inner slides and seed
    * the wrapper's data-wp-context with the real slide total.
    *
    * @param string $block_content The rendered block markup.
    * @param array  $block         The parsed block, including attributes.
    * @return string Modified markup with data-wp-context injected on the wrapper.
    */
   function add_directives_to_inner_blocks( $block_content, $block ) {
       $allowed_blocks = array( 'wp-block-cover', 'wp-block-image', 'wp-block-media-text' );
       $slides         = new \WP_HTML_Tag_Processor( $block_content );
       $total_slides   = 0;

       // Land on the slider wrapper and bookmark it so we can return after counting.
       $slides->next_tag( array( 'class_name' => 'wp-block-iapi-gallery-slider' ) );
       $slides->set_bookmark( 'main' );

       // Count inner slide blocks. The wrapper already declares the
       // iapi-gallery namespace, so we deliberately do NOT call
       // set_attribute( 'data-wp-interactive', ... ) on each inner block.
       while ( $slides->next_tag() ) {
           foreach ( $slides->class_list() as $class_name ) {
               if ( in_array( $class_name, $allowed_blocks, true ) ) {
                   $total_slides++;
                   break;
               }
           }
       }

       // Jump back to the wrapper to write data-wp-context on it.
       $slides->seek( 'main' );
       $slides->release_bookmark( 'main' );

       $context = array(
           'currentSlide' => 1,
           'totalSlides'  => $total_slides,
       );

       // The Tag Processor handles attribute escaping, so plain JSON is fine.
       $slides->set_attribute( 'data-wp-context', wp_json_encode( $context ) );
       return $slides->get_updated_html();
   }
   ```
3. Register: `add_filter( 'render_block_iapi/gallery-slider', 'add_directives_to_inner_blocks', 10, 2 );`.
4. Reload. The slider now counts inner blocks correctly. But there's a subtler bug. Open DevTools, throttle CPU to 6× and Network to Slow 4G, then hard-reload. The counter `<p>` is briefly empty before the IAPI runtime hydrates and fills in "1/N". On a fast local machine this gap is sub-frame and you may not see it without throttling, but on real-world devices and connections it's exactly the pre-hydration content flash users do notice. *That's what we're about to fix.*
5. Add `wp_interactivity_state( 'iapi-gallery', array( 'noPrevSlide' => true, 'imageIndex' => "1/{$total_slides}" ) )` before the `set_attribute` call. Reload. Flash gone.

## Verification

- Add/remove inner blocks in the editor → save → reload front end. Counter and disable behavior follow the new total automatically.
- Hard-reload several times. No counter flash on first paint.
- Inspect the DOM: no inner block has `data-wp-interactive` — only the wrapper does. Namespace inheritance is doing the work.

## Code reference

End-of-section snapshot lives in `code-reference/section-7/`.

## What's Next

→ [Section 8 — Autoplay](./section-8.md)
