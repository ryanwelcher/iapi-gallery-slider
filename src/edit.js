/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Starter Edit component for the Gallery Slider block.
 *
 * We'll build this out in Section 3 — Editor Controls:
 *   - Add useInnerBlocksProps with allowedBlocks.
 *   - Render the editor preview (inner blocks + prev/next + counter).
 *   - Add InspectorControls for the three attributes.
 */
export default function Edit() {
	const blockProps = useBlockProps();
	return <div { ...blockProps }>Gallery Slider — set up the editor in §3.</div>;
}
