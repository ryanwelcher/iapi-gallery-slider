/**
 * WordPress dependencies
 */
import {
	store,
	getElement,
	getContext,
	withScope,
} from '@wordpress/interactivity';

const { state, actions } = store( 'iapi-gallery', {
	state: {
		get noPrevSlide() {
			const ctx = getContext();
			if ( ctx.continuous ) {
				return false;
			}
			return ctx.currentSlide === 1;
		},
		get noNextSlide() {
			const ctx = getContext();
			if ( ctx.continuous ) {
				return false;
			}
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
			console.log( ctx.currentSlide );
			if ( ctx.continuous && ctx.currentSlide === 1 ) {
				ctx.currentSlide = ctx.totalSlides;
				return;
			}
			ctx.currentSlide--;
		},
		nextImage: () => {
			const ctx = getContext();
			if (
				( ctx.continuous || ctx.autoplay ) &&
				ctx.currentSlide === ctx.totalSlides
			) {
				ctx.currentSlide = 1;
				return;
			}
			ctx.currentSlide++;
		},
		onKeyDown: ( e ) => {
			switch ( e.key ) {
				case 'ArrowLeft': {
					if ( ! state.noPrevSlide ) {
						actions.prevImage();
					}
					break;
				}
				case 'ArrowRight': {
					if ( ! state.noNextSlide ) {
						actions.nextImage();
					}
					break;
				}
			}
		},
		onTouchStart: ( e ) => {
			const ctx = getContext();
			ctx.swipe = e.changedTouches[ 0 ].clientX;
		},
		onTouchEnd: ( e ) => {
			const { swipe } = getContext();
			if ( e.changedTouches[ 0 ].clientX < swipe ) {
				if ( ! state.noNextSlide ) {
					actions.nextImage();
				}
			} else {
				if ( ! state.noPrevSlide ) {
					actions.prevImage();
				}
			}
		},
	},
	callbacks: {
		initSlideShow: () => {
			const ctx = getContext();
			if ( ctx.autoplay ) {
				const int = setInterval(
					withScope( () => {
						actions.nextImage();
					} ),
					state.transitionsSpeed
				);
				// The returned function executes when the element is removed from the DOM.
				return () => clearInterval( int );
			}
		},
		initSlide: () => {
			const ctx = getContext();
			// This is called by the core/cover blocks inside this block.
			// Adds the element reference to the `slides` array.
			const { ref } = getElement();
			ctx.slides.push( ref );
			// The returned function executes when the element is removed from
			// the DOM.
			return () => {
				ctx.slides = ctx.slides.filter( ( s ) => s !== ref );
			};
		},
	},
} );

/**
 * Helper to log the data in a readable format. Useful for debugging parts of the store.
 *
 * Use console.log for non-store values.
 *
 * @param {*} data
 * @returns
 */
const debugLog = ( data ) =>
	console.log( JSON.parse( JSON.stringify( data ) ) );
