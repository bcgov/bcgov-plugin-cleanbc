/**
 * Navigation DOM manipulation.
 *
 * Note: as this runs on all pages be sure to null check all elements before use.
 *
 * @return {void}
 */
const domNavReady = () => {
	/*
     * SafarIE iOS requires window.requestAnimationFrame update.
     */
    window.requestAnimationFrame(() => {

		/**
		 * Interrupt the default submenu close behaviour for keyboard navigation.
		 */
		const submenuContainers = document.querySelectorAll('.wp-block-navigation-submenu');
		submenuContainers.forEach((submenu) => {
			submenu.addEventListener('focusout', (event) => {
				/**
				 * Close all submenus when focus leaves the entire nav container.
				 * relatedTarget is the element receiving focus after the current one loses it.
				 */
				const navContainer = document.querySelector('header nav');
				if (navContainer && !navContainer.contains(event.relatedTarget)) {
					// Focus has gone outside the nav, so close all toggles:
					topLevelToggles.forEach((toggle) => {
						toggle.setAttribute('aria-expanded', 'false');
					});
					nestedToggles.forEach((toggle) => {
						toggle.setAttribute('aria-expanded', 'false');
					});

				}
				event.stopImmediatePropagation();
			}, true); // capture phase.
		});

		const nestedToggles = document.querySelectorAll('ul ul .wp-block-navigation-submenu__toggle');

		nestedToggles.forEach((toggle) => {

			// Click => close all others, then open this one (if it was closed).
			toggle.addEventListener('click', (event) => {
				event.stopImmediatePropagation(); // block WP click handler.
				event.preventDefault();           // block default link/button behavior.

				const wasOpen = ('true' === toggle.getAttribute('aria-expanded'));

				// Close all nested toggles.
				nestedToggles.forEach((other) => {
					other.setAttribute('aria-expanded', 'false');
				});

				if (!wasOpen) {
					toggle.setAttribute('aria-expanded', 'true');
				}
			}, true);

			toggle.addEventListener('focus', () => {
				nestedToggles.forEach((other) => {
					other.setAttribute('aria-expanded', 'false');
				});
			}, true);
		});


		const topLevelToggles = document.querySelectorAll(
			'.wp-block-navigation__container > .wp-block-navigation-submenu > .wp-block-navigation-submenu__toggle'
		);

		topLevelToggles.forEach((toggle) => {

			toggle.addEventListener('click', (event) => {
				event.stopImmediatePropagation(); // block WP click handler.
				event.preventDefault();           // block default link/button behavior.

				const wasOpen = ( 'true' === toggle.getAttribute('aria-expanded') );

				if (!wasOpen) {
					toggle.setAttribute('aria-expanded', 'true');
				} else {
					toggle.setAttribute('aria-expanded', 'false');
				}
			}, true);

			toggle.addEventListener('focus', (event) => {

				// Close all toggles.
				topLevelToggles.forEach((other) => {
					if (other.getAttribute('aria-expanded')) {
						other.setAttribute('aria-expanded', 'false');
					}
					nestedToggles.forEach((other) => {
						other.setAttribute('aria-expanded', 'false');
					});
				});

				event.stopImmediatePropagation(); // block WP focus logic.
			}, true);
		});



	});
};

if ('complete' === document.readyState) {
	domNavReady();
} else {
	document.addEventListener('DOMContentLoaded', domNavReady);
}