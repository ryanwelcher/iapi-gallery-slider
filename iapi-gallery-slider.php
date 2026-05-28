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
 */
function iapi_gallery_slider_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'iapi_gallery_slider_block_init' );

// Section 7 adds a render_block_iapi/gallery-slider filter here
// to count inner slides and seed data-wp-context.
