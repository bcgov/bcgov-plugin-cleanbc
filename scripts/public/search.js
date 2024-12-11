/**
 * General CleanBC DOM manipulation.
 */
const bcgovBlockThemePluginSearch = () => {
    /*
     * SafarIE iOS requires window.requestAnimationFrame update.
     */
    window.requestAnimationFrame(() => {
        const searchInput = document.querySelector('.wp-block-search__input');
        const resultDetails = document.querySelector('.result-details');
    
        const extractWordsAndPhrases = (input) => {
            // Match quoted phrases or standalone words
            const regex = /"([^"]+)"|\b(\w+)\b/g;
            const matches = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                matches.push(match[1] || match[2]); // Add quoted phrases or single words
            }
            return matches;
        }

        const highlightMatches = () => {
            const inputValue = searchInput.value.trim();
            const searchTerms = extractWordsAndPhrases(inputValue);
            const filteredTerms = searchTerms.filter(term => term.length >= 3);
        
            const escapedTerms = filteredTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
        
            const walkNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (regex.test(node.nodeValue)) {
                        const parent = node.parentNode;
        
                        // Apply highlights only to the visible text (not attributes)
                        const fragments = node.nodeValue.split(regex);
                        const fragmentContainer = document.createDocumentFragment();
        
                        fragments.forEach((fragment) => {
                            if (regex.test(fragment)) {
                                const mark = document.createElement('mark');
                                mark.textContent = fragment;
                                fragmentContainer.appendChild(mark);
                            } else {
                                fragmentContainer.appendChild(document.createTextNode(fragment));
                            }
                        });
        
                        parent.replaceChild(fragmentContainer, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Recurse into child nodes
                    node.childNodes.forEach(walkNodes);
                }
            };
        
            // Start walking through the children of resultDetails
            resultDetails.childNodes.forEach(walkNodes);
        };
        
        if ( null !== searchInput && null !== resultDetails ) {
            highlightMatches();
        }
});
}

if ('complete' === document.readyState) {
    bcgovBlockThemePluginSearch();
} else {
    document.addEventListener('DOMContentLoaded',
        bcgovBlockThemePluginSearch
    );
}
