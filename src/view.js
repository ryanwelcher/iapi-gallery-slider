/**
 * WordPress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

const { state, actions } = store( 'iapi-gallery', {
	state: {
		get noPrevSlide() {
			const ctx = getContext();
			if ( ctx.continuous ) {
				return false;
			}
			return ctx.currentSlide === 0;
		},
		get noNextSlide() {
			const ctx = getContext();
			if ( ctx.continuous ) {
				return false;
			}
			return ctx.currentSlide === ctx.totalSlides - 1;
		},
		get currentPos() {
			const ctx = getContext();
			return `translateX(-${ ctx.currentSlide * 100 }%)`;
		},
		get imageIndex() {
			const ctx = getContext();
			return `${ ctx.currentSlide + 1 }/${ ctx.totalSlides }`;
		},
	},
	actions: {
		prevImage: () => {
			const ctx = getContext();
			if ( ctx.continuous && ctx.currentSlide === 0 ) {
				ctx.currentSlide = ctx.totalSlides - 1;
				return;
			}
			ctx.currentSlide--;
		},
		nextImage: () => {
			const ctx = getContext();
			if (
				( ctx.continuous || ctx.autoplay ) &&
				ctx.currentSlide === ctx.totalSlides - 1
			) {
				ctx.currentSlide = 0;
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
				setInterval( () => {
					actions.nextImage();
				}, 3000 );
			}
		},
		initSlide: () => {
			const ctx = getContext();
			// This is called by the core/cover blocks inside this block.
			// Adds the element reference to the `slides` array.
			const { ref } = getElement();
			ctx.slides.push( ref );
			ctx.totalSlides = ctx.slides.length;

			// The returned function executes when the element is removed from
			// the DOM.
			return () => {
				ctx.slides = ctx.slides.filter( ( s ) => s !== ref );
			};
		},
	},
} );

const debugLog = ( data ) =>
	console.log( JSON.parse( JSON.stringify( data ) ) );
