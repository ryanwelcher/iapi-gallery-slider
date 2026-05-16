/**
 * Interactivity API router wiring.
 *
 * This store has nothing to do with the gallery — it provides a generic
 * delegated link-click handler that routes same-origin link clicks through
 * @wordpress/interactivity-router so client-side store state survives page
 * navigations. Kept in its own file/namespace to highlight the separation
 * from the gallery's own interactivity.
 */

import { store } from '@wordpress/interactivity';

const isPlainLeftClick = ( e ) =>
	e.button === 0 &&
	! e.ctrlKey &&
	! e.metaKey &&
	! e.shiftKey &&
	! e.altKey;

store( 'iapi-gallery-router', {
	actions: {
		*navigate( e ) {
			const link = e.target.closest?.( 'a[href]' );
			if (
				! link ||
				link.origin !== window.location.origin ||
				( link.target && link.target !== '_self' ) ||
				! isPlainLeftClick( e )
			) {
				return;
			}
			e.preventDefault();
			const { actions: routerActions } = yield import(
				'@wordpress/interactivity-router'
			);
			yield routerActions.navigate( link.href );
		},
	},
} );
