import './public/accessibility';
import './public/dom-loader';
import './public/landing-banners';
import './public/search';

/**
 * All pages DOM manipulation.
 * This script also imports all others for build step.
 * 
 * Note: as this runs on all pages be sure to null check all elements before use.
 * 
 * @return {void}
 */
const bcgovBlockThemePlugin = {
    initFrontend: function () {
		/*
		* SafarIE iOS requires requestAnimationFrame update.
		*/
		requestAnimationFrame(() => {

			const body = document.querySelector('body');

		});
    }
};

if ('complete' === document.readyState) {
	bcgovBlockThemePlugin.initFrontend();
} else {
	document.addEventListener('DOMContentLoaded', bcgovBlockThemePlugin.initFrontend());
}
