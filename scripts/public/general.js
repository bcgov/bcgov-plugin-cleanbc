const bcgovBlockThemePlugin = {
    initFrontendGeneral: function () {
		/*
		* SafarIE iOS requires requestAnimationFrame update.
		*/
		requestAnimationFrame(() => {

			// console.log('General script loaded');

		});
    }
};

if ('complete' === document.readyState) {
	bcgovBlockThemePlugin.initFrontendGeneral();
} else {
	document.addEventListener('DOMContentLoaded', bcgovBlockThemePlugin.initFrontendGeneral());
}