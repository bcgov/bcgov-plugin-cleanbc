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
    
            let content = resultDetails.innerHTML;
    
            const escapedTerms = filteredTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    
            content = content.replace(regex, '<mark>$1</mark>');
            content = content.replace(/<\/mark>\s*<mark>/g, ' '); // Remove unnecessary closing and opening tags.
            resultDetails.innerHTML = content;
        }
    
        if ( null !== searchInput && null !== resultDetails ) {
           highlightMatches();
        }
});
}

if (document.readyState === 'complete') {
    bcgovBlockThemePluginSearch();
} else {
    document.addEventListener('DOMContentLoaded',
        bcgovBlockThemePluginSearch
    );
}
