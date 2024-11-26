/**
 * Decodes HTML character entities in a given string.
 *
 * This function takes a string containing HTML character entities  * (e.g., `&amp;`, `&lt;`, `&#39;`) 
 * and decodes them into their corresponding characters (e.g., `&`, `<`, `'`).
 *
 * @param {string} text - The string containing HTML entities to decode.
 * @returns {string} - The decoded string with entities replaced by their corresponding characters.
 *
 * @example
 * const decoded = decodeHtmlEntities('What is the best way to reduce GHG&#8217;s emitted by my home?');
 * console.log(decoded); // Output: 'What is the best way to reduce GHG’s emitted by my home?'
 */
export function decodeHtmlEntities(text) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, 'text/html');
	return doc.documentElement.textContent;
}

/**
 * Function to shuffle an array.
 *
 * @param {Array} - The array to be randomised.
 * @returns {Array} - The updated array of contractor results.
 */
export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

/**
 * Function to scroll to a target element and set focus on the first tabbable item.
 *
 * @param {string} el - The ID of the target element.
 * @param {string} [scrollMarginTop=0] - The margin from the top of the viewport in pixels (e.g., '50px').
 * @returns {void}
 */
export function scrollToElementID(el, scrollMarginTop = '0px') {
	const target = document.querySelector(`#${el}`);
	if (target) {
		// Temporarily apply scroll-margin-top for the target element
		const originalScrollMarginTop = target.style.scrollMarginTop;
		target.style.scrollMarginTop = scrollMarginTop;

		// Scroll the element into view
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });

		// Restore the original scroll margin after scrolling
		setTimeout(() => {
			target.style.scrollMarginTop = originalScrollMarginTop || '';

			// Move focus to the first tabbable item within the target
			const tabbableItem = target.querySelector('a');
			if (tabbableItem) {
				tabbableItem.focus();
				tabbableItem.blur();
			} else {
				console.warn(`No tabbable items found within #${el}.`);
			}
		}, 500); // Align this duration with your scrolling animation duration
	} else {
		console.warn(`Target element #${el} not found.`);
	}
}

