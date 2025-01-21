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


		// Handle pressing escape when search input field is in use.
        const searchFieldContainer = document.querySelector('#search-field-container');
		const toggleSearchBtn = document.querySelector( '.toggle-search-btn a' );

		if (searchFieldContainer && toggleSearchBtn) {
			searchFieldContainer.addEventListener('keydown', (event) => {
				if ( 'Escape' === event.code ) {
					searchFieldContainer.blur();
					toggleSearchBtn.focus();
				    searchFieldContainer.classList.add( 'hidden' );
				}
            });
		}

		// Re-process external links added by the Block Theme.
		const processExternalLinks = () => {
			const observer = new MutationObserver((mutationsList, observer) => {
				// Check if any links have been given the 'external' class.
				const externalLinks = document.querySelectorAll('a.external:not(#postFilterApp a, #pqeasResults a, #contractorFilterApp a, .vue-card-content a)');
				if (externalLinks.length > 0) {
					// Externally updated classes identified. Processing links.
					observer.disconnect(); // Stop observing once links are found.
					externalLinks.forEach((link) => {
						// Skip links with mailto: or tel:
						if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
							// Special handling for mailto links: replace @ and . with &#8203;
							if (link.href.startsWith('mailto:')) {
								const email = link.href.slice(7); // Remove "mailto:" part
								link.innerHTML = link.innerHTML.replace(email, email.replace(/@/g, '&#8203;@').replace(/\./g, '&#8203;.'));
							}
							return; // Skip further processing for mailto or tel links
						}
		
						const svg = link.querySelector('svg');
						if (svg) {
							const linkText = link.textContent;
		
							if (linkText && linkText.trim().length > 0) {
								const words = linkText.trim().split(' ');
								const lastWord = words.pop();
								const restOfText = words.join(' ');
		
								const span = document.createElement('span');
								span.classList.add('last-word', 'no-wrap');
								span.textContent = lastWord;
		
								span.appendChild(svg);
								link.innerHTML = `${restOfText} `;
								link.appendChild(span);
							}
						}
					});
				}
			});
		
			// Start observing the document for changes.
			observer.observe(document.body, {
				childList: true, // Watch for added/removed child nodes.
				subtree: true,   // Watch all descendants.
				attributes: true // Watch for attribute changes.
			});
		
			// Fallback: Stop observing after a timeout to avoid endless observation.
			setTimeout(() => observer.disconnect(), 10000); 
		};		
		
		// Start watching for external links.
		processExternalLinks();
		
	});
};

if ( 'complete' === document.readyState ) {
	bcgovBlockThemePluginDomLoader();
} else {
	document.addEventListener('DOMContentLoaded',
		bcgovBlockThemePluginDomLoader
	);
}
