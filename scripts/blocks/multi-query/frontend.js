document.addEventListener('DOMContentLoaded', () => {
  const params = Object.fromEntries(new URLSearchParams(location.search));

  document.querySelectorAll('.multi-query-content-block').forEach((block) => {
    const keys = JSON.parse(block.dataset.keys || '[]');
    const combos = JSON.parse(block.dataset.combos || '[]');
    const fallback = block.dataset.fallback || '';
    const useOr = 'true' === block.dataset.or;
    let output = block.innerHTML;

    const match = combos.find((combo) =>
      useOr
        ? keys.some(key => combo[key] === params[key])
        : keys.every(key => combo[key] === params[key])
    );

    const value = match?.value || fallback;
    output = output.replace(/{{\s*value\s*}}/g, value);
    block.innerHTML = output;
  });
});