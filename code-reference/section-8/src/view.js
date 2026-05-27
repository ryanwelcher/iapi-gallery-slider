/**
 * WordPress dependencies
 */
import { store, getContext, withScope } from '@wordpress/interactivity';

// Destructure state and actions out of the store return value so the new
// callbacks.initSlideShow lifecycle can call actions.nextImage() directly.
const { state, actions } = store( 'iapi-gallery', {
	state: {
		get noPrevSlide() {
			const ctx = getContext();
			return ctx.currentSlide === 1;
		},
		get noNextSlide() {
			const ctx = getContext();
			return ctx.currentSlide === ctx.totalSlides;
		},
		get currentPos() {
			const ctx = getContext();
			return `translateX(-${ ( ctx.currentSlide - 1 ) * 100 }%)`;
		},
		get imageIndex() {
			const ctx = getContext();
			return `${ ctx.currentSlide }/${ ctx.totalSlides }`;
		},
		get transitionsSpeed() {
			const ctx = getContext();
			return Number( ctx.speed ) * 1000;
		},
	},
	actions: {
		prevImage: () => {
			const ctx = getContext();
			ctx.currentSlide--;
		},
		nextImage: () => {
			const ctx = getContext();
			// When autoplay reaches the end, wrap back to the first slide so
			// the loop keeps running. Manual clicks still stop at the end
			// because state.noNextSlide disables the button.
			if ( ctx.autoplay && ctx.currentSlide === ctx.totalSlides ) {
				ctx.currentSlide = 1;
				return;
			}
			ctx.currentSlide++;
		},
	},
	callbacks: {
		initSlideShow: () => {
			const ctx = getContext();
			if ( ! ctx.autoplay ) {
				return;
			}
			// setInterval fires outside the Interactivity scope, so any code
			// inside that touches state/context/actions needs to be wrapped
			// in withScope() to re-enter the scope of this element.
			const int = setInterval(
				withScope( () => {
					actions.nextImage();
				} ),
				state.transitionsSpeed
			);
			// Returning a function from a callback registers cleanup —
			// Interactivity calls it when the element is removed from the DOM.
			return () => clearInterval( int );
		},
	},
} );
