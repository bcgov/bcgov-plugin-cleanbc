/**
 * Table DOM manipulation.
 */
const bcgovBlockThemePluginTables = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {

		/**
		 * Complex table spanning. 
		 * 
		 * Process is substractive. Always start spans from the top-left origin. 
		 * Once processed spanning over already hidden cells will cause display errors.
		 * 
		 * Dynamically applies rowspan or colspan attributes to table cells based on multiple class patterns.
		 * Class patterns supported:
		 *   - 'col-{index}-span-{count}' (starts from first cell in column)
		 *   - 'row-{index}-span-{count}' (starts from first cell in row)
		 *   - 'col-{col}-row-{row}-span-{count}' (starts rowspan at specific cell)
		 *   - 'row-{row}-col-{col}-span-{count}' (starts colspan at specific cell)
		 *   - 'cell-{col}-{row}-span-{rowCount}x{colCount}' (starts combined span from a specific cell grid)
		 *
		 * Adds 'hidden' class only to cells that are visually merged.
		 * Always starts from the specified cell. 
		 * Starting with 'col-' spans rows and starting with 'row-' spans columns.
		 *
		 * Example classes: 'col-1-span-2', 'row-3-span-2', 'col-2-row-4-span-3', 'row-4-col-2-span-3', 'cell-2-3-span-2x3'
		 *
		 * Usage: Apply the appropriate classes to a table's block inspector > Advanced classes field.
		 *
		 * @example
		 * <figure class="wp-block-table col-1-span-2 row-3-span-2 cell-2-1-span-2x2">
		 *   <table>...</table>
		 * </figure>
		 */
		document.querySelectorAll('figure.wp-block-table[class*="-span-"]').forEach(figure => {
			const table = figure.querySelector('table');
			if (!table) return;
		
			const tbody = table.querySelector('tbody');
			if (!tbody) return;
		
			const classList = figure.className.split(' ');
			const spanClasses = classList.filter(cls =>
				/(col-\d+-span-\d+|row-\d+-span-\d+|col-\d+-row-\d+-span-\d+|row-\d+-col-\d+-span-\d+|cell-\d+-\d+-span-\d+x\d+)/.test(cls)
			);
		
			const rows = Array.from(tbody.querySelectorAll('tr'));
		
			spanClasses.forEach(spanClass => {
				let match;
		
				// Combined rowspan and colspan.
				if ((match = spanClass.match(/cell-(\d+)-(\d+)-span-(\d+)x(\d+)/))) {
					const [, col, row, rowspan, colspan] = match.map(Number);
				
					// Build a cell grid so we can safely access by row/col.
					const grid = rows.map(r => Array.from(r.children));
					const maxRowSpan = Math.min(rowspan, rows.length - row + 1);
				
					const baseRow = grid[row - 1];
					if (!baseRow) return;
				
					const baseCell = baseRow[col - 1];
					if (!baseCell || baseCell.hasAttribute('rowspan') || baseCell.hasAttribute('colspan')) return;
				
					// Limit colSpan to avoid overflow.
					const maxColSpan = Math.min(colspan, baseRow.length - col + 1);
				
					baseCell.setAttribute('rowspan', maxRowSpan);
					baseCell.setAttribute('colspan', maxColSpan);
				
					for (let r = 0; r < maxRowSpan; r++) {
						const currentRow = grid[row - 1 + r];
						if (!currentRow) continue;
				
						for (let c = 0; c < maxColSpan; c++) {
							// Skip the base cell.
							if (0 === r && 0 === c) continue;
				
							const targetCell = currentRow[col - 1 + c];
							if (targetCell) targetCell.classList.add('hidden');
						}
					}
				}
				
		
				// Specific cell rowspan.
				else if ((match = spanClass.match(/col-(\d+)-row-(\d+)-span-(\d+)/))) {
					const [, col, row, span] = match.map(Number);
					const startRow = rows[row - 1];
					if (!startRow) return;
		
					const cell = startRow.children[col - 1];
					if (cell && !cell.hasAttribute('rowspan')) {
						const maxSpan = Math.min(span, rows.length - row + 1);
						cell.setAttribute('rowspan', maxSpan);
		
						for (let i = 1; i < maxSpan; i++) {
							const targetRow = rows[row - 1 + i];
							if (targetRow) {
								const targetCell = targetRow.children[col - 1];
								if (targetCell) targetCell.classList.add('hidden');
							}
						}
					}
				}
		
				// Specific cell colspan.
				else if ((match = spanClass.match(/row-(\d+)-col-(\d+)-span-(\d+)/))) {
					const [, row, col, span] = match.map(Number);
					const targetRow = rows[row - 1];
					if (!targetRow) return;
		
					const cell = targetRow.children[col - 1];
					if (cell && !cell.hasAttribute('colspan')) {
						const maxSpan = Math.min(span, targetRow.children.length - col + 1);
						cell.setAttribute('colspan', maxSpan);
		
						for (let i = 1; i < maxSpan; i++) {
							const targetCell = targetRow.children[col - 1 + i];
							if (targetCell) targetCell.classList.add('hidden');
						}
					}
				}
		
				// Column span from top.
				else if ((match = spanClass.match(/col-(\d+)-span-(\d+)/))) {
					const [, col, span] = match.map(Number);
					if (!rows[0]) return;
		
					const maxSpan = Math.min(span, rows.length);
					const cell = rows[0].children[col - 1];
					if (cell && !cell.hasAttribute('rowspan')) {
						cell.setAttribute('rowspan', maxSpan);
		
						for (let i = 1; i < maxSpan; i++) {
							const row = rows[i];
							if (row) {
								const targetCell = row.children[col - 1];
								if (targetCell) targetCell.classList.add('hidden');
							}
						}
					}
				}
		
				// Row span from left.
				else if ((match = spanClass.match(/row-(\d+)-span-(\d+)/))) {
					const [, row, span] = match.map(Number);
					const targetRow = rows[row - 1];
					if (!targetRow) return;
		
					const cells = Array.from(targetRow.children);
					const maxSpan = Math.min(span, cells.length);
					if (!cells[0].hasAttribute('colspan')) {
						cells[0].setAttribute('colspan', maxSpan);
						cells.slice(1, maxSpan).forEach(cell => cell.classList.add('hidden'));
					}
				}
			});
		});
		


	});
}

if ('complete' === document.readyState) {
	bcgovBlockThemePluginTables();
} else {
	document.addEventListener('DOMContentLoaded',
		bcgovBlockThemePluginTables
	);
}