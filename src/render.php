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
>
	<div class="slider-container">
		<?php echo wp_kses_post( $content ); ?>
	</div>
	<div class="buttons">
		<button aria-label="go to previous slide">&lt;</button>
		<p>1/3</p>
		<button aria-label="go to next slide">&gt;</button>
	</div>
</div>
