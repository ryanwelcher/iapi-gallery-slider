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
		// Pause autoplay while a keyboard user has focus inside the carousel —
		// APG Carousel: "Automatic slide rotation stops when any element in
		// the carousel receives keyboard focus."
		pauseAutoplay: () => {
			const ctx = getContext();
			if ( ctx.intervalId ) {
				clearInterval( ctx.intervalId );
				ctx.intervalId = null;
			}
		},
		resumeAutoplay: () => {
			const ctx = getContext();
			if ( ! ctx.autoplay || ctx.intervalId ) {
				return;
			}
			ctx.intervalId = setInterval(
				withScope( () => {
					actions.nextImage();
				} ),
				state.transitionsSpeed
			);
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
			// Store the interval id on context so pauseAutoplay /
			// resumeAutoplay can reach it from the focus handlers.
			ctx.intervalId = setInterval(
				withScope( () => {
					actions.nextImage();
				} ),
				state.transitionsSpeed
			);
			return () => {
				if ( ctx.intervalId ) {
					clearInterval( ctx.intervalId );
				}
			};
		},
	},
} );
