/**
 * Accessibility DOM manipulation.
 */
const bcgovBlockThemePluginAccessibility = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {

		const actionsAccordionHeader = document.querySelector('.actions-accordion-header');
		if (null !== actionsAccordionHeader) {
			const getSiblings = (elem) => {
				// Setup siblings array and get the first sibling
				const siblings = [];
				let sibling = elem.parentNode.firstChild;

				// Loop through each sibling and push to the array
				while (sibling) {
					if (1 === sibling.nodeType && sibling !== elem) {
						siblings.push(sibling);
					}
					if (null !== sibling.nextSibling) {
						sibling = sibling.nextSibling;
					}
				}
				return siblings;
			};
			/*
			 * Inject ARIA labels into queried content.
			 */
			const labelEls = document.querySelectorAll('.labelInjector');
			labelEls.forEach((label) => {
				const siblings = getSiblings(label);
				const ariaLabel = label.getAttribute('data-label');
				siblings.forEach((el) => {
					if (el.classList.contains('wp-block-buttons')) {
						const link = el.querySelector('.wp-block-button__link');
						link.setAttribute('aria-label', ariaLabel);
					}
				});
				label.remove();
			});
		}


		// Define breadcrumb nav pattern
		const breadcrumbNav = document.querySelector('#breadcrumb-nav');

		if (null !== breadcrumbNav) {

			breadcrumbNav.setAttribute('role', 'navigation');
			breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');

			const aioseoBreadcrumb = breadcrumbNav.querySelector('.aioseo-breadcrumbs');
			const aioseoBreadcrumbItems = aioseoBreadcrumb.querySelectorAll('.aioseo-breadcrumb');
			const aioseoBreadcrumbSeparators = aioseoBreadcrumb.querySelectorAll('.aioseo-breadcrumb-separator');

			if (null !== aioseoBreadcrumb && null !== aioseoBreadcrumbItems) {

				aioseoBreadcrumb.setAttribute('role', 'list');

				aioseoBreadcrumbItems.forEach((item, index) => {
					item.setAttribute('role', 'listitem');

					// Add aria-current to the last breadcrumb item
					if (index === aioseoBreadcrumbItems.length - 1) {
						item.setAttribute('role', 'link');
						item.setAttribute('aria-current', 'page');
					}
				})
			}

			if (null !== aioseoBreadcrumbSeparators) {
				aioseoBreadcrumbSeparators.forEach(separator => {
					separator.setAttribute('aria-hidden', 'true');
				})
			}
		}


		/**
		 * Setup for detail-with-number-container grid layout modifications for screen reader.
		 * See: https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/layout-grids/
		 */
		const detailsWithNumbersContainers = document.querySelectorAll('.detail-with-number-container');

		if (detailsWithNumbersContainers.length > 0) {
			// Create and insert grid container
			const gridGroupDiv = document.createElement('div');
			gridGroupDiv.setAttribute('role', 'grid');
			gridGroupDiv.setAttribute('data-wrap-cols', true);
			gridGroupDiv.setAttribute('data-wrap-rows', true);

			const firstDetailContainer = detailsWithNumbersContainers[0];
			firstDetailContainer.parentNode.insertBefore(gridGroupDiv, firstDetailContainer);

			// Move detail containers inside the new grid
			detailsWithNumbersContainers.forEach((detailContainer) => {
				gridGroupDiv.appendChild(detailContainer);
			});

			let determinedHeadingLevel = null; // for potential future use

			detailsWithNumbersContainers.forEach((detailContainer, index) => {
				detailContainer.setAttribute('role', 'row');

				const headlineCell = detailContainer.querySelector('.wp-block-column:nth-of-type(1)');
				const detailCell = detailContainer.querySelector('.wp-block-column:nth-of-type(2)');

				const headlines = headlineCell ? headlineCell.querySelectorAll('.wp-block-heading') : [];

				// Fallback: if no second cell exists, use headlineCell as detailCell
				const finalDetailCell = (headlines.length > 0 && detailCell) ? detailCell : headlineCell;

				if (finalDetailCell) {
					finalDetailCell.setAttribute('role', 'gridcell');
					finalDetailCell.setAttribute('tabindex', '0');

					if (headlineCell) {
						const headlines = headlineCell.querySelectorAll('.wp-block-heading');

						// Concatenate all headlines' text into a single string
						let concatenatedHeadlineText = '';
						headlines.forEach((headline) => {
							concatenatedHeadlineText += headline.innerText + ' ';
							headline.setAttribute('aria-hidden', true); // Hide original headlines from screen readers
						});

						if (concatenatedHeadlineText.trim()) {
							if (0 === index) {
								// Determine heading level on the first row
								let nearestHeading = null;
								let currentElement = detailContainer.previousElementSibling;

								// Traverse previous siblings to find the nearest wp-block-heading
								while (currentElement && !nearestHeading) {
									if (currentElement.classList.contains('wp-block-heading')) {
										nearestHeading = currentElement;
										break;
									}

									const headings = currentElement.querySelectorAll('.wp-block-heading');
									if (headings.length > 0) {
										nearestHeading = headings[headings.length - 1]; // Select the last one found inside the sibling
										break;
									}

									currentElement = currentElement.previousElementSibling;
								}

								let parentElement = detailContainer.parentElement;
								while (!nearestHeading && parentElement) {
									currentElement = parentElement.previousElementSibling;

									while (currentElement) {
										if (currentElement.classList.contains('wp-block-heading')) {
											nearestHeading = currentElement;
											break;
										}

										const headings = currentElement.querySelectorAll('.wp-block-heading');
										if (headings.length > 0) {
											nearestHeading = headings[headings.length - 1];
											break;
										}

										currentElement = currentElement.previousElementSibling;
									}

									parentElement = parentElement.parentElement;
								}

								if (nearestHeading) {
									const nearestHeadingTagName = nearestHeading.tagName.toLowerCase();
									determinedHeadingLevel = parseInt(nearestHeadingTagName.replace('h', '')) + 1;
									if (determinedHeadingLevel > 6) determinedHeadingLevel = 6; // <h6> is the lowest level
								} else {
									determinedHeadingLevel = 2; // Default to <h2> if no heading is found
								}
							}

							// Create the new heading element using the determined heading level
							const newHeading = document.createElement(`h${determinedHeadingLevel}`);
							newHeading.innerText = concatenatedHeadlineText.trim();
							newHeading.classList.add('sr-only');

							// Insert the new heading at the start of detailCell
							finalDetailCell.insertBefore(newHeading, finalDetailCell.firstChild);
						}
					}
				}

				if (0 === index) {
					let nearestHeading = null;
					let currentElement = detailContainer.previousElementSibling;

					while (currentElement && !nearestHeading) {
						if (currentElement.classList.contains('wp-block-heading')) {
							nearestHeading = currentElement;
							break;
						}

						const headings = currentElement.querySelectorAll('.wp-block-heading');
						if (headings.length > 0) {
							nearestHeading = headings[headings.length - 1];
							break;
						}

						currentElement = currentElement.previousElementSibling;
					}

					let parentElement = detailContainer.parentElement;
					while (!nearestHeading && parentElement) {
						currentElement = parentElement.previousElementSibling;

						while (currentElement) {
							if (currentElement.classList.contains('wp-block-heading')) {
								nearestHeading = currentElement;
								break;
							}

							const headings = currentElement.querySelectorAll('.wp-block-heading');
							if (headings.length > 0) {
								nearestHeading = headings[headings.length - 1];
								break;
							}

							currentElement = currentElement.previousElementSibling;
						}

						parentElement = parentElement.parentElement;
					}

					if (nearestHeading) {
						let headingId = nearestHeading.getAttribute('id');
						if (!headingId) {
							headingId = `grid-${Date.now()}`;
							nearestHeading.setAttribute('id', headingId);
						}
						gridGroupDiv.setAttribute('aria-labelledby', headingId);
					}
				}
			});

			// Add keyboard navigation
			gridGroupDiv.addEventListener('keydown', (event) => {
				const activeElement = document.activeElement;
				if ('gridcell' === activeElement.getAttribute('role')) {
					const row = activeElement.parentElement;
					const rows = Array.from(gridGroupDiv.querySelectorAll('[role="row"]'));
					const cells = Array.from(row.querySelectorAll('[role="gridcell"]'));
					const rowIndex = rows.indexOf(row);
					const cellIndex = cells.indexOf(activeElement);

					switch (event.key) {
						case 'ArrowRight':
						case 'ArrowDown':
							if (rowIndex < rows.length - 1) {
								const nextRowCells = rows[rowIndex + 1].querySelectorAll('[role="gridcell"]');
								nextRowCells[cellIndex].focus();
							}
							break;
						case 'ArrowLeft':
						case 'ArrowUp':
							if (rowIndex > 0) {
								const prevRowCells = rows[rowIndex - 1].querySelectorAll('[role="gridcell"]');
								prevRowCells[cellIndex].focus();
							}
							break;
						case 'PageDown':
							if (rowIndex < rows.length - 1) {
								const nextRowIndex = Math.min(rowIndex + 3, rows.length - 1); // Adjust 3 as the number of rows to scroll
								const nextRowCells = rows[nextRowIndex].querySelectorAll('[role="gridcell"]');
								nextRowCells[cellIndex].focus();
							}
							event.preventDefault();
							break;
						case 'PageUp':
							if (rowIndex > 0) {
								const prevRowIndex = Math.max(rowIndex - 3, 0); // Adjust 3 as the number of rows to scroll
								const prevRowCells = rows[prevRowIndex].querySelectorAll('[role="gridcell"]');
								prevRowCells[cellIndex].focus();
							}
							event.preventDefault();
							break;
						case 'Home':
							// Move focus to the first cell in the first row
							rows[0].querySelector('[role="gridcell"]').focus();
							event.preventDefault();
							break;

						case 'End': {
							// Move focus to the last cell in the last row
							const lastRow = rows[rows.length - 1];
							lastRow.querySelector('[role="gridcell"]:last-child').focus();
							event.preventDefault();
							break;
						}
					}
				}
			});
		}

		/**
		 * Allow assitive technologies to move focus to the body after using the back to top link.
		 */
		const backToTop = document.querySelector('.back-to-top');

		backToTop.addEventListener('click', (event) => {
			event.preventDefault();

			window.scrollTo({ top: 0, behavior: 'smooth' });

			const checkIfScrolledToTop = setInterval(() => {
				if (0 === window.scrollY) {
					clearInterval(checkIfScrolledToTop);
					document.body.setAttribute('tabindex', '-1');
					document.body.focus({ preventScroll: true });
				}
			}, 50);
		});
		
	});
};

if ('complete' === document.readyState) {
	bcgovBlockThemePluginAccessibility();
} else {
	document.addEventListener('DOMContentLoaded',
		bcgovBlockThemePluginAccessibility
	);
}
