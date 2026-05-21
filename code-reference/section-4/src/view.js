/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

store( 'iapi-gallery', {
	state: {},
	actions: {
		nextImage: () => {
			const ctx = getContext();
			ctx.currentSlide++;
		},
	},
} );
