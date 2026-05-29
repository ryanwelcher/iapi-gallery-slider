<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

// Still hardcoded from Section 5. Section 7 replaces this with a server-side
// filter that walks the inner blocks and counts them dynamically.
$context = array(
	'currentSlide' => 1,
	'totalSlides'  => 3,
);

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='iapi-gallery'
	<?php echo wp_interactivity_data_wp_context( $context ); ?>
>
	<div
		class="slider-container"
		data-wp-style--transform="state.currentPos"
	>
		<?php echo wp_kses_post( $content ); ?>
	</div>
	<div class="buttons">
		<button data-wp-on--click="actions.prevImage" data-wp-bind--disabled="state.noPrevSlide" aria-label="go to previous slide">&lt;</button>
		<p data-wp-text="state.imageIndex"></p>
		<button data-wp-on--click="actions.nextImage" data-wp-bind--disabled="state.noNextSlide" aria-label="go to next slide">&gt;</button>
	</div>
</div>
