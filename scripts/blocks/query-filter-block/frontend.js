document.addEventListener('DOMContentLoaded', async () => {
	const blocks = document.querySelectorAll('.query-filter-block');
	if (!blocks.length) return;

	const API_URL = '/wp-json/custom/v1/meta-categories';
	const taxonomies = await fetch(API_URL).then((res) => res.json());

	blocks.forEach((block) => {
		const taxonomy = block.dataset.taxonomy;
		const label = block.dataset.label || '';
		const selected = JSON.parse(block.dataset.query || '{}');

		if (!taxonomy || !taxonomies[taxonomy]) return;

		const group = document.createElement('div');
		group.className = 'query-filter-group';

		if (label) {
			const labelEl = document.createElement('label');
			labelEl.textContent = label;
			labelEl.setAttribute('for', `select-${taxonomy}`);
			group.appendChild(labelEl);
		}

		const select = document.createElement('select');
		select.id = `select-${taxonomy}`;
		select.name = taxonomy;
		select.className = 'query-filter-select';

		const defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.textContent = '-- Select --';
		select.appendChild(defaultOption);

		taxonomies[taxonomy].forEach(({ slug, name }) => {
			const option = document.createElement('option');
			option.value = slug;
			option.textContent = name;
			if (selected[taxonomy]?.includes(slug)) {
				option.selected = true;
			}
			select.appendChild(option);
		});

		select.addEventListener('change', () => {
			const newParams = new URLSearchParams(window.location.search);
			if (select.value) {
				newParams.set(taxonomy, select.value);
			} else {
				newParams.delete(taxonomy);
			}

			block.classList.add('fade-out');
			setTimeout(() => {
				window.location.href = `${window.location.pathname}?${newParams.toString()}`;
			}, 200);
		});

		group.appendChild(select);
		block.innerHTML = '';
		block.appendChild(group);

		requestAnimationFrame(() => {
			block.setAttribute('data-initialized', 'true');
		});
	});
});
