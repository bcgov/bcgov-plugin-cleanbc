document.addEventListener('DOMContentLoaded', () => {
  const params = Object.fromEntries(new URLSearchParams(location.search));

  const replaceSpansWithLabels = () => {
    document.querySelectorAll('.multi-query-content-block').forEach((block) => {
      let i = 1;
      let dataKey;

      while ((dataKey = block.dataset[`key-${i}`]) !== undefined) {
        const paramValue = params[dataKey];
        if (!paramValue) {
          i++;
          continue;
        }

        const select = document.querySelector(`select[name="${dataKey}"]`);
        if (select) {
          const matchingOption = Array.from(select.options).find(
            (opt) => opt.value === paramValue
          );
          if (matchingOption) {
            const label = matchingOption.label || matchingOption.textContent;
            const replaceKey = (1 === i) ? 'value' : `value_${i}`;
            const allowPassthrough = ('true' === block.dataset.useParamDirect);

            if (!allowPassthrough) {
              i++;
              continue;
            }

            const span = block.querySelector(`span[data-replace="${replaceKey}"]`);
            if (span) {
              span.textContent = label;
            }

          }
        }

        i++;
      }
    });
  };

  // Run replacement logic once on DOMContentLoaded (in case selects are already rendered)
  replaceSpansWithLabels();

  // Also listen for custom events from the filter blocks
  document.addEventListener('queryFilterReady', () => {
    replaceSpansWithLabels();
  });
});
