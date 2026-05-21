<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

// Section 4 hardcodes the slide count and seeds context inline. Section 6
// replaces this with a server-side filter that counts inner blocks
// dynamically and seeds initial state with wp_interactivity_state().
$context = array(
	'currentSlide' => 1,
	'totalSlides'  => 3,
);

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='iapi-gallery'
	<?php echo wp_interactivity_data_wp_context( $context ); ?>
>
	<div class="slider-container">
		<?php echo wp_kses_post( $content ); ?>
	</div>
	<div class="buttons">
		<button aria-label="go to previous slide">&lt;</button>
		<p data-wp-text="context.currentSlide"></p>
		<button data-wp-on--click="actions.nextImage" aria-label="go to next slide">&gt;</button>
	</div>
</div>
