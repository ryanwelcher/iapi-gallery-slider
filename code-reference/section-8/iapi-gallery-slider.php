<?php
/**
 * Plugin Name:       IAPI Gallery Slider
 * Description:       An interactive block with the Interactivity API
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      7.0
 * Author:            Ryan Welcher
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       iapi-gallery-slider
 *
 * @package           iapi
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 *
 * Note: WP 6.7+ offers wp_register_block_metadata_collection() for registering
 * many blocks from a single cached manifest. This plugin ships one block, so
 * the per-block read here is fine and the manifest indirection would add noise
 * without a measurable win.
 */
function iapi_gallery_slider_iapi_gallery_slider_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'iapi_gallery_slider_iapi_gallery_slider_block_init' );

/**
 * Filter the rendered block to count inner slide blocks, seed the wrapper's
 * data-wp-context with the real slide total, and seed initial global state so
 * the slider's first paint matches its interactive state (no client-side flash).
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

	// Count the inner slide blocks. We do NOT set data-wp-interactive on them:
	// the wrapper already declares the `iapi-gallery` namespace and descendants
	// inherit it, so any directive on (or added to) an inner block resolves
	// against `iapi-gallery` automatically.
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

	// Merge block attributes the client needs to read at runtime into the
	// per-instance context. Autoplay and speed both drive the new
	// callbacks.initSlideShow lifecycle we're adding this section.
	$context = array_merge(
		array(
			'autoplay' => $block['attrs']['autoplay'] ?? false,
			'speed'    => $block['attrs']['speed'] ?? '3',
		),
		array(
			'currentSlide' => 1,
			'totalSlides'  => $total_slides,
		)
	);

	// Seed initial global state to match what the client getters would compute,
	// so the first paint has the correct disabled button and counter — no flash.
	wp_interactivity_state(
		'iapi-gallery',
		array(
			'noPrevSlide' => true,
			'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}",
		)
	);

	// The Tag Processor handles HTML attribute escaping, so plain JSON is fine.
	$slides->set_attribute( 'data-wp-context', wp_json_encode( $context ) );
	return $slides->get_updated_html();
}
add_filter( 'render_block_iapi/gallery-slider', 'add_directives_to_inner_blocks', 10, 2 );
