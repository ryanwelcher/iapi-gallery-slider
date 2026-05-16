/**
 * WordPress dependencies
 */
import {
	store,
	getContext,
	withScope,
} from '@wordpress/interactivity';

// Register the router store (separate namespace, separate concern).
import './router';

const slideHref = ( slide ) => {
	const url = new URL( window.location.href );
	url.searchParams.set( 'slide', String( slide ) );
	return url.toString();
};

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
		shareCopied: false,
	},
	actions: {
		prevImage: () => {
			const ctx = getContext();
			let next = ctx.currentSlide - 1;
			if ( ctx.continuous && next < 1 ) {
				next = ctx.totalSlides;
			}
			if ( next < 1 ) {
				return;
			}
			state.firstPaint = false;
			ctx.currentSlide = next;
			window.history.pushState( {}, '', slideHref( next ) );
		},
		nextImage: () => {
			const ctx = getContext();
			let next = ctx.currentSlide + 1;
			if (
				( ctx.continuous || ctx.autoplay ) &&
				next > ctx.totalSlides
			) {
				next = 1;
			}
			if ( next > ctx.totalSlides ) {
				return;
			}
			state.firstPaint = false;
			ctx.currentSlide = next;
			window.history.pushState( {}, '', slideHref( next ) );
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
		*shareSlide() {
			try {
				yield navigator.clipboard.writeText( window.location.href );
				state.shareCopied = true;
				setTimeout(
					withScope( () => {
						state.shareCopied = false;
					} ),
					1500
				);
			} catch {}
		},
	},
	callbacks: {
		initSlideShow: () => {
			const ctx = getContext();

			// Sync slide to URL on browser back/forward.
			const onPop = withScope( () => {
				const url = new URL( window.location.href );
				const requested = Number( url.searchParams.get( 'slide' ) ) || 1;
				ctx.currentSlide = Math.max(
					1,
					Math.min( ctx.totalSlides, requested )
				);
			} );
			window.addEventListener( 'popstate', onPop );

			let int;
			if ( ctx.autoplay ) {
				int = setInterval(
					withScope( () => {
						actions.nextImage();
					} ),
					state.transitionsSpeed
				);
			}

			return () => {
				window.removeEventListener( 'popstate', onPop );
				if ( int ) {
					clearInterval( int );
				}
			};
		},
	},
} );
