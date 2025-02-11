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

		/*
		 * Check for menu items being out of viewport and class is needed.
		 */
		const doBoundsCheck = (targetEl) => {

			const container = targetEl;
			const childContainer = container.querySelector('ul');
			const subChildContainer = container.querySelector(
				'.wp-block-navigation__submenu-container .wp-block-navigation__submenu-container'
			);

			/* Reserve for possible future Polylang additions. */
			// const languageChildContainer = container.querySelector(
			// 	'.language_switcher_options'
			// );

			let bounding = null;

			if (null !== childContainer) {
				bounding = childContainer.getBoundingClientRect();
				childContainer.style.top = '0.85rem';
			}

			const windowWidth =
				window.innerWidth ||
				document.documentElement.clientWidth;

			if (null !== bounding) {
				if (null !== subChildContainer) {
					subChildContainer.style.top = '0.85rem';
				}

				if (bounding.right > windowWidth && childContainer) {
					childContainer.classList.add('is-offscreen');
					childContainer.style.left = `calc(4px - ${childContainer.parentNode.parentNode.offsetWidth}px)`;
					childContainer.style.right = 'auto';
					/* Reserve for possible future Polylang additions. */
					// if (null !== languageChildContainer) {
					// 	languageChildContainer.style.top = '100%';
					// }
					childContainer.style.position = 'absolute';
				}
			}
		}

		/**
		 * Interrupt the default submenu close behaviour for keyboard navigation.
		 */
		const topLevelToggles = document.querySelectorAll(
			'.wp-block-navigation__container > .wp-block-navigation-submenu > .wp-block-navigation-submenu__toggle'
		);
		const submenuContainers = document.querySelectorAll('.wp-block-navigation-submenu');
		const nestedToggles = document.querySelectorAll('ul ul .wp-block-navigation-submenu__toggle');

		if (topLevelToggles) {
			topLevelToggles.forEach((toggle) => {

				toggle.addEventListener('click', (event) => {
					event.stopImmediatePropagation(); // block WP click handler.
					event.preventDefault();           // block default link/button behavior.

					const wasOpen = ('true' === toggle.getAttribute('aria-expanded'));

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
		}

		if (submenuContainers) {
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
		}

		if (nestedToggles) {
			nestedToggles.forEach((toggle) => {

				// Click => close all others, then open this one (if it was closed).
				toggle.addEventListener('click', (event) => {

					/* Reposition submenus if too close to edge of window. */
					let target = event.target;
					if (target.tagName !== 'LI') {
						target = target.closest('li');
					}
					doBoundsCheck(target);

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
		}
	});
};

if ('complete' === document.readyState) {
	domNavReady();
} else {
	document.addEventListener('DOMContentLoaded', domNavReady);
}