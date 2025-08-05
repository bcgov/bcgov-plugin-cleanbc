document.addEventListener('DOMContentLoaded', () => {
  const qs = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(qs.entries());

  document.querySelectorAll('.query-conditional-group-block').forEach(block => {
    const rules = JSON.parse(block.getAttribute('data-rules') || '[]');
    const logic = block.getAttribute('data-logic') || 'AND';
    const invert =  'true' === block.getAttribute('data-invert');
    const caseSensitive = 'true' === block.getAttribute('data-case');

	const hasParam = (key) => Object.prototype.hasOwnProperty.call(params, key);

    const evaluateRule = (rule) => {
      const key = (rule.key || '').trim();
      const value = (rule.value || '').trim();
      const operator = rule.operator || 'equals';
      const ruleCase = rule.caseSensitive ?? caseSensitive;

      let paramVal = params[key];
      if (!ruleCase && 'string' === typeof paramVal) {
        paramVal = paramVal.toLowerCase();
      }
      const compareVal = !ruleCase && 'string' === typeof value ? value.toLowerCase() : value;

      switch (operator) {
        case 'equals': return paramVal === compareVal;
        case 'notEquals': return paramVal !== compareVal;
        case 'contains': return paramVal?.includes(compareVal);
        case 'startsWith': return paramVal?.startsWith(compareVal);
        case 'endsWith': return paramVal?.endsWith(compareVal);
        case 'regex': return paramVal && new RegExp(compareVal).test(paramVal);
        case 'exists': return hasParam(key);
        case 'notExists': return !hasParam(key);
        default: return false;
      }
    };

    let matches = rules.length > 0 && (
       'OR' === logic
        ? rules.some(evaluateRule)
        : rules.every(evaluateRule)
    );

    if (invert) matches = !matches;

    block.style.display = matches ? '' : 'none';
    block.setAttribute('aria-hidden', matches ? 'false' : 'true');
  });
});
