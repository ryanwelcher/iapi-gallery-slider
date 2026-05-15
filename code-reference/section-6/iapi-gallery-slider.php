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
 * @package           block-developer-cookbook
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
 */
function iapi_gallery_slider_iapi_gallery_slider_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build' );
}
add_action( 'init', 'iapi_gallery_slider_iapi_gallery_slider_block_init' );

/**
 * Filter the render_block to add the needed directives to the inner cover blocks.
 *
 * @param string $block_content The content being rendered by the block.
 */
function add_directives_to_inner_blocks( $block_content, $block ) {
	$allowed_blocks = array( 'wp-block-cover', 'wp-block-image', 'wp-block-media-text' );
	$slides         = new \WP_HTML_Tag_Processor( $block_content );
	$total_slides   = 0;

	// Get the main element.
	$slides->next_tag( array( 'class_name' => 'wp-block-block-developer-cookbook-iapi-gallery-slider' ) );
	// Set a bookmark so we can go back and update the context after counting the slides.
	$slides->set_bookmark( 'main' );

	while ( $slides->next_tag() ) {
		// Retrieve and iterate over the classes assigned.
		foreach ( $slides->class_list() as $class_name ) {
			if ( in_array( $class_name, $allowed_blocks, true ) ) {
				$slides->set_attribute( 'data-wp-interactive', 'iapi-gallery' );
				$slides->set_attribute( 'data-wp-init', 'callbacks.initSlide' );
				$total_slides++;
				// If we find a class, we can move on - this is still not very performant as the worst case is that we loop all classes against all allowed classes.
				// Not an issue with the tag processor, rather the code I wrote with it.
				continue;
			}
		}
	}

	// Go to the bookmark and release it.
	$slides->seek( 'main' );
	$slides->release_bookmark( 'main' );


	// Generate the context for the slider block.
	$context = array_merge(
		array(
			'autoplay'   => $block['attrs']['autoplay'] ?? false,
			'continuous' => $block['attrs']['continuous'] ?? false,
			'speed'      => $block['attrs']['speed'] ?? '3',
		),
		array(
			'slides'       => array(),
			'currentSlide' => 1,
			'totalSlides'  => $total_slides,
		)
	);

	// Define some global state for all instances based on attributes.
	// These will be updated by the appropriate getters but this will avoid the content flash in the client
	wp_interactivity_state(
		'iapi-gallery',
		array(
			'noPrevSlide' => ! $context['continuous'],
			'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}"
		)
	);

	$slides->set_attribute( 'data-wp-context',  wp_json_encode( $context, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ) );
	// Update the HTML.
	$block_content = $slides->get_updated_html();
	return $block_content;
}
add_filter( 'render_block_block-developer-cookbook/iapi-gallery-slider', 'add_directives_to_inner_blocks', 10, 2 );
