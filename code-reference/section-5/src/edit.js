/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(
		{ className: 'slider-container' },
		{ allowedBlocks: [ 'core/cover', 'core/image', 'core/media-text' ] }
	);
	return (
		<div { ...blockProps }>
			<div { ...innerBlockProps }></div>
			<div className="buttons">
				<button aria-label="go to previous slide">&lt;</button>
				<p>1/10</p>
				<button aria-label="go to next slide">&gt;</button>
			</div>
		</div>
	);
}
