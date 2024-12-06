import { addSafeEventListenerPlugin } from '../utils';

/**
 * General CleanBC DOM manipulation.
 */
const bcgovBlockThemePluginDomLoader = () => {
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

		// Glossary query loop processing to add separation headlines by letter of the alphabet.
		const glossaryList = document.querySelector('.glossary-results ul');
		if (glossaryList) {
			const items = Array.from(glossaryList.querySelectorAll('li'));
			let currentLetter = '';
		
			items.forEach(item => {
				const titleElement = item.querySelector('h3');
				if (titleElement) {
					const titleText = titleElement.textContent.trim();
					const firstLetter = titleText.charAt(0).toUpperCase();
		
					if (firstLetter !== currentLetter) {
						currentLetter = firstLetter;
		
						// Create and wrap the <h2>
						const h2 = document.createElement('h2');
						h2.textContent = currentLetter;
		
						const h2Wrapper = document.createElement('li');
						h2Wrapper.classList.add('glossary-letter-headline');
						h2Wrapper.appendChild(h2);
		
						// Insert the new <li> with <h2> before the current item
						glossaryList.insertBefore(h2Wrapper, item);
					}
				}
			});
		}
	});
};

if ( 'complete' === document.readyState ) {
	bcgovBlockThemePluginDomLoader();
} else {
	addSafeEventListenerPlugin(
		document,
		'DOMContentLoaded',
		bcgovBlockThemePluginDomLoader()
	);
}
