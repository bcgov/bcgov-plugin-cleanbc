/**
 * General Better Homes DOM manipulation for accessibility.
 */
const betterhomesAccessibilityLoader = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame( () => {

		// Only run if Better Homes site.
		if ('betterhomesbc' === window.site.customBodyClass) {

			// Alt label header logo lockup correctly.
			const headerLogo = document.querySelector('.custom-logo-link img');
			headerLogo.setAttribute('alt', 'BC Government and Clean BC Better Homes logos');
		}
	});
};

if ( 'complete' === document.readyState ) {
	betterhomesAccessibilityLoader();
} else {
	document.addEventListener('DOMContentLoaded',
		betterhomesAccessibilityLoader
	);
}
