/**
 * WordPress dependencies
 */
import { store, getContext, withScope } from '@wordpress/interactivity';

const { state, actions } = store( 'iapi-gallery', {
	state: {
		get noPrevSlide() {
			const ctx = getContext();
			// Continuous mode keeps both ends navigable.
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
			// Continuous mode wraps from the first slide back to the last.
			if ( ctx.continuous && ctx.currentSlide === 1 ) {
				ctx.currentSlide = ctx.totalSlides;
				return;
			}
			ctx.currentSlide--;
		},
		nextImage: () => {
			const ctx = getContext();
			// Both autoplay and continuous wrap from the last slide to the
			// first. Manual clicks in non-continuous mode stop at the end
			// because state.noNextSlide keeps the button disabled.
			if (
				( ctx.continuous || ctx.autoplay ) &&
				ctx.currentSlide === ctx.totalSlides
			) {
				ctx.currentSlide = 1;
				return;
			}
			ctx.currentSlide++;
		},
		// Document-level keydown handler. Gated by state.noPrev/noNextSlide so
		// the arrow keys respect continuous mode and end-of-slider behavior.
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
		// Touch swipe: capture the starting x on touchstart, compare to the
		// ending x on touchend. ctx.swipe is ephemeral per-instance state.
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
			} else if ( ! state.noPrevSlide ) {
				actions.prevImage();
			}
		},
	},
	callbacks: {
		initSlideShow: () => {
			const ctx = getContext();
			if ( ! ctx.autoplay ) {
				return;
			}
			const int = setInterval(
				withScope( () => {
					actions.nextImage();
				} ),
				state.transitionsSpeed
			);
			return () => clearInterval( int );
		},
	},
} );
