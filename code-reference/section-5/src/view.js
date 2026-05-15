/**
 * WordPress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

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
	},
	actions: {
		prevImage: () => {
			const ctx = getContext();
			ctx.currentSlide--;
		},
		nextImage: () => {
			const ctx = getContext();
			ctx.currentSlide++;
		},
	},
	callbacks: {
		initSlide: () => {
			const ctx = getContext();
			const { ref } = getElement();
			ctx.slides.push( ref );
			return () => {
				ctx.slides = ctx.slides.filter( ( s ) => s !== ref );
			};
		},
	},
} );
