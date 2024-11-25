import { qs, qsa, addSafeEventListenerPlugin } from '../utils';

/**
 * Accessibility DOM manipulation.
 */
const bcgovBlockThemePluginAccessibility = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame( () => {

		const actionsAccordionHeader = document.querySelector( '.actions-accordion-header' );
		if ( null !== actionsAccordionHeader ) {
			const getSiblings = function ( elem ) {
				// Setup siblings array and get the first sibling
				const siblings = [];
				let sibling = elem.parentNode.firstChild;

				// Loop through each sibling and push to the array
				while ( sibling ) {
					if ( sibling.nodeType === 1 && sibling !== elem ) {
						siblings.push( sibling );
					}
					sibling = sibling.nextSibling;
				}
				return siblings;
			};
			/*
			 * Inject ARIA labels into queried content.
			 */
			const labelEls = qsa( '.labelInjector' );
			labelEls.forEach( ( label ) => {
				const siblings = getSiblings( label );
				const ariaLabel = label.getAttribute( 'data-label' );
				siblings.forEach( ( el ) => {
					if ( el.classList.contains( 'wp-block-buttons' ) ) {
						const link = qs( '.wp-block-button__link', el );
						link.setAttribute( 'aria-label', ariaLabel );
					}
				} );
				label.remove();
			} );
		}
	} );
};

if ( 'complete' === document.readyState ) {
	bcgovBlockThemePluginAccessibility();
} else {
	addSafeEventListenerPlugin(
		document,
		'DOMContentLoaded',
		bcgovBlockThemePluginAccessibility()
	);
}
