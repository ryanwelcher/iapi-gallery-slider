/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes: { continuous, autoplay } } ) {
	// const context = {
	// 	...attributes,
	// 	slides: [],
	// 	currentSlide: 0,
	// 	totalSlides: 0,
	// 	s,
	// };
	const blockProps = useBlockProps.save( {
		'data-wp-interactive': '{ "namespace": "iapi-gallery" }',
		'data-wp-on-document--keydown': 'actions.onKeyDown',
		'data-wp-context': `{"continuous":${ continuous },"autoplay":${ autoplay },"slides":[],"currentSlide":0,"totalSlides":0,"swipe":0}`,
		'data-wp-init': 'callbacks.initSlideShow',
	} );

	return (
		<div { ...blockProps }>
			<div
				className="slider-container"
				data-wp-style--transform="state.currentPos"
				data-wp-on--touchstart="actions.onTouchStart"
				data-wp-on--touchend="actions.onTouchEnd"
			>
				<InnerBlocks.Content />
			</div>
			<div class="buttons">
				<button
					data-wp-on--click="actions.prevImage"
					data-wp-bind--disabled="state.noPrevSlide"
					aria-label="go to previous slide"
				>
					&lt;
				</button>
				<p data-wp-text="state.imageIndex"></p>
				<button
					data-wp-on--click="actions.nextImage"
					data-wp-bind--disabled="state.noNextSlide"
					aria-label="go to next slide"
				>
					&gt;
				</button>
			</div>
		</div>
	);
}
