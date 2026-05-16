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
	$tags           = new \WP_HTML_Tag_Processor( $block_content );
	$total_slides   = 0;
	$found_container = false;

	// Walk the markup once: bookmark the wrapper, count inner slide blocks,
	// and bookmark the .slider-container for later.
	//
	// Note: we do NOT set data-wp-interactive on the inner blocks. The wrapper
	// already declares the namespace and descendants inherit it, so any
	// data-wp-* directive on (or added to) an inner block would resolve
	// against `iapi-gallery` automatically.
	$tags->next_tag( array( 'class_name' => 'wp-block-block-developer-cookbook-iapi-gallery-slider' ) );
	$tags->set_bookmark( 'main' );

	while ( $tags->next_tag() ) {
		foreach ( $tags->class_list() as $class_name ) {
			if ( 'slider-container' === $class_name && ! $found_container ) {
				$tags->set_bookmark( 'container' );
				$found_container = true;
				continue;
			}
			if ( in_array( $class_name, $allowed_blocks, true ) ) {
				$total_slides++;
				break;
			}
		}
	}

	// Resolve the active slide from the ?slide= query param. Clamped to range.
	$requested_slide = isset( $_GET['slide'] ) ? absint( wp_unslash( $_GET['slide'] ) ) : 1;
	$current_slide   = min( max( 1, $total_slides ), max( 1, $requested_slide ) );

	$context = array(
		'autoplay'     => $block['attrs']['autoplay'] ?? false,
		'continuous'   => $block['attrs']['continuous'] ?? false,
		'speed'        => $block['attrs']['speed'] ?? '3',
		'currentSlide' => $current_slide,
		'totalSlides'  => $total_slides,
	);

	// Seed global state so the very first paint (before JS hydrates) matches
	// what the client-side getters will produce. firstPaint suppresses the
	// CSS transition during hydration; it's flipped to false on first click.
	wp_interactivity_state(
		'iapi-gallery',
		array(
			'noPrevSlide' => ! $context['continuous'],
			'imageIndex'  => "{$context['currentSlide']}/{$context['totalSlides']}",
			'firstPaint'  => true,
		)
	);

	// Attach context to the wrapper. Tag Processor handles attribute escaping.
	$tags->seek( 'main' );
	$tags->set_attribute( 'data-wp-context', wp_json_encode( $context ) );

	// Inline the initial transform on .slider-container so its rendered
	// position matches data-wp-style--transform on hydration.
	if ( $found_container ) {
		$tags->seek( 'container' );
		$offset = ( $current_slide - 1 ) * 100;
		$tags->set_attribute( 'style', "transform: translateX(-{$offset}%)" );
		$tags->add_class( 'no-transition' );
		$tags->release_bookmark( 'container' );
	}
	$tags->release_bookmark( 'main' );

	return $tags->get_updated_html();
}
add_filter( 'render_block_block-developer-cookbook/iapi-gallery-slider', 'add_directives_to_inner_blocks', 10, 2 );
