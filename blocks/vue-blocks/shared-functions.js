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
  
