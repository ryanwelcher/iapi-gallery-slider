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
function add_directives_to_inner_blocks( $block_content ) {
	$allowed_blocks = array( 'wp-block-cover', 'wp-block-image', 'wp-block-media-text' );
	$covers         = new \WP_HTML_Tag_Processor( $block_content );

	while ( $covers->next_tag() ) {
		// Retrieve and iterate over the classes assigned.
		foreach ( $covers->class_list() as $class_name ) {
			if ( in_array( $class_name, $allowed_blocks, true ) ) {
				$covers->set_attribute( 'data-wp-interactive', '{"namespace":"iapi-gallery"}' );
				$covers->set_attribute( 'data-wp-init', 'callbacks.initSlide' );
				// If we find a class, we can move on - this is still not very performant as the worst case is that we loop all classes against all allowed classes. Not an issue with the tag processor, rather the code I wrote with it.
				continue;
			}
		}
	}
	$block_content = $covers->get_updated_html();
	return $block_content;
}
add_filter( 'render_block_block-developer-cookbook/iapi-gallery-slider', 'add_directives_to_inner_blocks' );
