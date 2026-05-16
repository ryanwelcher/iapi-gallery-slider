<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='iapi-gallery'
	data-wp-on-document--keydown="actions.onKeyDown"
	data-wp-on-document--click="iapi-gallery-router::actions.navigate"
	data-wp-init="callbacks.initSlideShow"
	data-wp-router-region="iapi-gallery"
>
	<div
		class="slider-container"
		data-wp-style--transform="state.currentPos"
		data-wp-class--no-transition="state.firstPaint"
		data-wp-on--touchstart="actions.onTouchStart"
		data-wp-on--touchend="actions.onTouchEnd"
	>
		<?php echo wp_kses_post( $content ); ?>
	</div>
	<div class="buttons">
		<button data-wp-on-async--click="actions.prevImage" data-wp-bind--disabled="state.noPrevSlide" aria-label="go to previous slide">&lt;</button>
		<p data-wp-text="state.imageIndex"></p>
		<button data-wp-on-async--click="actions.nextImage" data-wp-bind--disabled="state.noNextSlide" aria-label="go to next slide">&gt;</button>
		<button data-wp-on-async--click="actions.shareSlide" aria-label="copy link to this slide">🔗</button>
	</div>
	<div
		class="iapi-gallery-toast"
		data-wp-class--is-visible="state.shareCopied"
		role="status"
		aria-live="polite"
	>Link copied</div>
</div>
