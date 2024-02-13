import { addSafeEventListenerPlugin } from '../utils';

/**
 * General CleanBC Definitons dialog generator.
 */
const bcgovBlockThemePluginDefnitions = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame( () => {
		const links = document.querySelectorAll( 'a' );

		const definitionLinks = Array.from( links ).filter( function ( link ) {
			return link.href.includes( 'definitions' );
		} );

		if ( definitionLinks.length > 0 ) {
			const dialog = document.createElement( 'dialog' );
			dialog.id = 'dialog';
			dialog.className = 'dialog';
			dialog.setAttribute( 'aria-modal', true );
			dialog.setAttribute( 'aria-live', 'polite' );
			dialog.innerHTML =
				'<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
			document.body.appendChild( dialog );

			const closeDialogButton = document.getElementById( 'close-dialog' );

			closeDialogButton.addEventListener( 'click', function () {
				dialog.close();
			} );

			definitionLinks.forEach( function ( link ) {
				link.classList.add( 'icon-definition' );
				link.setAttribute(
					'aria-label',
					'opens definition dialog for: ' + link.text
				);

				link.addEventListener( 'click', function ( event ) {
					event.preventDefault();
					const url = this.getAttribute( 'href' );
					fetch( url )
						.then( function ( response ) {
							return response.text();
						} )
						.then( function ( html ) {
							const parser = new window.DOMParser();
							const doc = parser.parseFromString(
								html,
								'text/html'
							);
							const title = doc.querySelector(
								'h1.wp-block-post-title'
							).innerText;
							const content =
								doc.querySelector( '.entry-content' ).innerHTML; // Adjust this selector based on your WordPress template
							const dialogContent = document.querySelector(
								'#dialog .dialog-content'
							);
							dialogContent.innerHTML =
								'<h2 tabindex="0">' + title + '</h2>' + content;
							showDialog();
							dialogContent.querySelector( 'h2' ).focus();
						} )
						.catch( function ( error ) {
							// eslint-disable-next-line no-console
							console.error( 'Error fetching content:', error );
						} );
				} );
			} );

			function showDialog() {
				dialog.showModal();
			}
		}
	} );
};

if ( 'complete' === document.readyState ) {
	bcgovBlockThemePluginDefnitions();
} else {
	addSafeEventListenerPlugin(
		document,
		'DOMContentLoaded',
		bcgovBlockThemePluginDefnitions()
	);
}
