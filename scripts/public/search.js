import { qs, qsa, addSafeEventListener } from '../utils';

/**
 * General CleanBC DOM manipulation.
 */
const bcgovBlockThemePlugin = {
	initFrontendSearch: function () {

		/*
		* SafarIE iOS requires requestAnimationFrame update.
		*/
		requestAnimationFrame(() => {

			const toggleSearchBtn = document.querySelector('.toggle-search-btn a');
			const searchFieldContainer = document.querySelector('#search-field-container');
			const siblingElement = searchFieldContainer.previousElementSibling;
			
			if (searchFieldContainer && siblingElement) {
				siblingElement.parentNode.insertBefore(searchFieldContainer, siblingElement);
			}
			
			if (toggleSearchBtn) {

				
				toggleSearchBtn.addEventListener('click', function (event) {

					event.preventDefault();
					
					const searchInput = searchFieldContainer.querySelector('input');

					if (searchFieldContainer) {
						searchFieldContainer.classList.toggle('hidden');

						if (!searchFieldContainer.classList.contains('hidden') && searchInput) {
							searchInput.focus();
						}
					}
				});

				toggleSearchBtn.addEventListener('keydown', (event) => {
				  if (event.code === 'Space' || event.code === 'Enter') {
					event.preventDefault();
					toggleSearchBtn.click();
				  }
				});
				
			}

		});
	}
}

if ('complete' === document.readyState) {
	bcgovBlockThemePlugin.initFrontendSearch();
} else {
	document.addEventListener('DOMContentLoaded', bcgovBlockThemePlugin.initFrontendSearch());
}
