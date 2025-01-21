/**
 * Incentives and rebates in-page navigation generator DOM manipulation.
 */
const bcgovBlockThemePluginSideNav = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {
		const detailsContainer = document.querySelector('#incentive-details-container');
		const sideNav = document.querySelector('#incentive-side-nav');

		if (detailsContainer && sideNav) {
			// Clear the existing content of #incentive-side-nav
			sideNav.innerHTML = '';

			// Find all H2 elements inside the #incentive-details-container
			const headings = detailsContainer.querySelectorAll('h2[id]');

			// Create a new list for navigation
			const navListContainer = document.createElement('nav');
			navListContainer.classList.add('side-nav', 'bb-nav', 'wp-block-navigation', 'is-vertical', 'wp-container-core-navigation-layout-2');
			
			const navList = document.createElement('ul');
			navList.classList.add('side-nav', 'bb-nav', 'wp-block-navigation', 'is-vertical', 'wp-block-navigation__container');

			// Loop through the H2 elements to create links
			headings.forEach(heading => {
				const id = heading.id;
				const text = heading.textContent.trim();

				// Create a list item
				const listItem = document.createElement('li');
				listItem.classList.add('wp-block-navigation-item', 'wp-block-navigation-link');

				// Create a link element
				const link = document.createElement('a');
				link.href = `#${id}`;
				link.textContent = text;
				link.classList.add('wp-block-navigation-item__content');

				// Append the link to the list item
				listItem.appendChild(link);

				// Append the list item to the navigation list
				navList.appendChild(listItem);
			});

			// Append the navigation list to the side navigation
			navListContainer.appendChild(navList);
			sideNav.appendChild(navListContainer);
			sideNav.classList.remove('admin-instructions');
		}

	});
}

if ('complete' === document.readyState) {
	bcgovBlockThemePluginSideNav();
} else {
	document.addEventListener('DOMContentLoaded',
		bcgovBlockThemePluginSideNav
	);
}
