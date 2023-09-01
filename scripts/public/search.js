import { qs } from '../utils';

/**
 * General CleanBC DOM manipulation.
 */
const bcgovBlockThemePlugin = {
	initFrontendSearch: function () {

		/*
		* SafarIE iOS requires requestAnimationFrame update.
		*/
		requestAnimationFrame(() => {

			const toggleSearchBtn = qs('.toggle-search-btn a');
			const searchFieldContainer = qs('#search-field-container');

			if (toggleSearchBtn) {
	
				if (searchFieldContainer) {
					const siblingElement = searchFieldContainer.previousElementSibling;

					const searchInput = qs('input', searchFieldContainer);
					const searchButton = qs('button', searchFieldContainer);
				}

				if (searchFieldContainer && siblingElement) {
					siblingElement.parentNode.insertBefore(searchFieldContainer, siblingElement);
				}

				toggleSearchBtn.addEventListener('click', function (event) {

					event.preventDefault();

					if (searchFieldContainer) {

						if (searchFieldContainer.classList.contains('hidden')) {
							searchFieldContainer.classList.remove('hidden');
							if (searchInput) {
								searchInput.focus();
							}
						} else {
							searchFieldContainer.classList.add('hidden');
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

			if (searchFieldContainer) {

				searchInput.addEventListener('blur', function (event) {
					event.preventDefault();
					requestAnimationFrame(() => {
						if (searchButton === document.activeElement) return;
						if (toggleSearchBtn === document.activeElement) return;
						toggleSearchBtn.focus();
						toggleSearchBtn.click();
					});
				});

				searchButton.addEventListener('blur', function (event) {
					event.preventDefault();
					requestAnimationFrame(() => {
						if (searchInput === document.activeElement) return;
						if (toggleSearchBtn === document.activeElement) return;
						toggleSearchBtn.focus();
						toggleSearchBtn.click();
					});
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
