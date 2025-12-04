/**
 * General Better Homes DOM manipulation for rebates archive page.
 */
const betterhomesRebatesArchiveLoader = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {

	const source = document.querySelector('details.eligible-home-types');
	const target = document.querySelector('div.eligible-homes-insertion');
	if (!source || !target) return;

	target.replaceChildren(source.cloneNode(true));
	target.firstElementChild.classList.remove('template');

	});
};

if ('complete' === document.readyState) {
	betterhomesRebatesArchiveLoader();
} else {
	document.addEventListener('DOMContentLoaded',
		betterhomesRebatesArchiveLoader
	);
}
