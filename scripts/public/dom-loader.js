import { addEventListener } from '../utils';

/**
 * General CleanBC DOM manipulation.
 */
const bcgovBlockThemePluginDomLoader = {
	initFrontend() {
		/*
		 * SafarIE iOS requires window.requestAnimationFrame update.
		 */
		window.requestAnimationFrame( () => {
			const body = document.querySelector( 'body' );
			body.classList.add( 'cleanbc-plugin' );
			// CleanBC Icon Buttons
			const iconButtons = document.querySelectorAll( 'a.icon' );
			if ( iconButtons.length ) {
				iconButtons.forEach( ( button ) => {
					if ( null === button.getAttribute( 'href' ) ) {
						button.setAttribute( 'tabindex', '-1' );
						button.style.pointerEvents = 'none';
					}
				} );
			}

			// This should be CSS...
			const iconButtonContainers = document.querySelectorAll(
				'.wp-block-button.is-style-icon'
			);
			if ( iconButtonContainers.length ) {
				iconButtonContainers.forEach( ( container ) => {
					const containerLink = container.querySelector( 'a' );
					if (
						null !== containerLink &&
						! container.classList.contains( 'has-size-large' )
					) {
						containerLink.style.outlineOffset = '1rem';
					}
				} );
			}
		} );
	},
};

if ( 'complete' === document.readyState ) {
	bcgovBlockThemePluginDomLoader.initFrontend();
} else {
	addEventListener(
		'DOMContentLoaded',
		bcgovBlockThemePluginDomLoader.initFrontend()
	);
}
