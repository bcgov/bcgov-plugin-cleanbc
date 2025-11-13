document.addEventListener('DOMContentLoaded', () => {
  const qs = new URLSearchParams(window.location.search);

  // Map key -> array of values (handles ?k=a&k=b)
  const params = {};
  for (const [k, v] of qs.entries()) {
    (params[k] ||= []).push(v);
  }
  const hasParam = (key) => Object.prototype.hasOwnProperty.call(params, key);

  const toArray = (v) => Array.isArray(v) ? v : (undefined === v || null === v || '' === v ? [] : [v]);
  const splitCsv = (s) =>
    ('string' === typeof s ? s.split(',').map(t => t.trim()).filter(Boolean) : []);
  const normalizeArrayCase = (arr, caseSensitive) =>
    caseSensitive ? arr : arr.map(v => ('string' === typeof v ? v.toLowerCase() : v));

  document.querySelectorAll('.query-conditional-group-block').forEach(block => {
    const rules = JSON.parse(block.getAttribute('data-rules') || '[]');
    const logic = block.getAttribute('data-logic') || 'AND';
    const invert = 'true' === block.getAttribute('data-invert');
    const caseSensitiveDefault = 'true' === block.getAttribute('data-case');

    const evaluateRule = (rule) => {
      const key = (rule.key || '').trim();
      // Accept aliases to be resilient
      let operator = (rule.operator || 'equals');
      if ('oneOf' === operator) operator = 'in';
      if ('noneOf' === operator) operator = 'notIn';

      const ruleCase = rule.caseSensitive ?? caseSensitiveDefault;

      // Param values (array)
      const paramVals = normalizeArrayCase(toArray(params[key]), ruleCase);

      // Single compare value
      const rawVal = rule.value ?? '';
      const compareVal = !ruleCase && 'string' === typeof rawVal ? rawVal.toLowerCase() : rawVal;

      // Multi compare values: prefer rule.values; otherwise split CSV from value/valueCSV
      let multiVals = rule.values && Array.isArray(rule.values) ? rule.values : [];
      if (!multiVals.length) {
        multiVals = splitCsv(rule.valueCSV ?? rule.value ?? '');
      }
      multiVals = normalizeArrayCase(multiVals, ruleCase);

      switch (operator) {
        case 'equals':
          return paramVals.some(p => p === compareVal);

        case 'notEquals':
          return 0 === paramVals.length || paramVals.every(p => p !== compareVal);

        case 'contains':
          return paramVals.some(p => 'string' === typeof p && 'string' === typeof compareVal && p.includes(compareVal));

        case 'startsWith':
          return paramVals.some(p => 'string' === typeof p && 'string' === typeof compareVal && p.startsWith(compareVal));

        case 'endsWith':
          return paramVals.some(p => 'string' === typeof p && 'string' === typeof compareVal && p.endsWith(compareVal));

        case 'regex':
          if (!paramVals.length || 'string' !== typeof compareVal) return false;
          try {
            const re = new RegExp(compareVal);
            return paramVals.some(p => 'string' === typeof p && re.test(p));
          } catch { return false; }

        case 'exists':
          return hasParam(key);

        case 'notExists':
          return !hasParam(key);

        // --- Multi-value (One of / None of) + contains variants
        case 'in': // equals any of
          if (!multiVals.length) return false;
          return paramVals.some(p => multiVals.includes(p));

        case 'notIn': // not equal to any of
          if (!multiVals.length) return true;
          return 0 === paramVals.length || paramVals.every(p => !multiVals.includes(p));

        case 'containsAny':
          if (!multiVals.length) return false;
          return paramVals.some(p =>
            multiVals.some(v => 'string' === typeof p && 'string' === typeof v && p.includes(v))
          );

        case 'containsAll':
          if (!multiVals.length) return false;
          return multiVals.every(v =>
            paramVals.some(p => 'string' === typeof p && 'string' === typeof v && p.includes(v))
          );

        default:
          return false;
      }
    };

    let matches = rules.length > 0 && ('OR' === logic ? rules.some(evaluateRule) : rules.every(evaluateRule));
    if (invert) matches = !matches;

    block.style.display = matches ? '' : 'none';
    block.setAttribute('aria-hidden', matches ? 'false' : 'true');
  });
});
