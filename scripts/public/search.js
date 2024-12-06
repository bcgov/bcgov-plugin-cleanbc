import { addSafeEventListenerPlugin } from '../utils';
/**
 * General CleanBC DOM manipulation.
 */
const bcgovBlockThemePluginSearch = () => {
    /*
     * SafarIE iOS requires window.requestAnimationFrame update.
     */
    window.requestAnimationFrame(() => {
    //     const toggleSearchBtn = qs('.toggle-search-btn a');
    //     const searchFieldContainer = qs('#search-field-container');

    //     if (toggleSearchBtn) {
    //         if (searchFieldContainer) {
    //             const siblingElement =
    //                 searchFieldContainer.previousElementSibling;

    //             const searchInput = qs('input', searchFieldContainer);
    //             const searchButton = qs('button', searchFieldContainer);

    //             if (searchFieldContainer && siblingElement) {
    //                 siblingElement.parentNode.insertBefore(
    //                     searchFieldContainer,
    //                     siblingElement
    //                 );
    //             }
    //             toggleSearchBtn.addEventListener('click', function (event) {
    //                 event.preventDefault();

    //                 if (searchFieldContainer) {
    //                     if (searchFieldContainer.classList.contains('hidden')) {
    //                         searchFieldContainer.classList.remove('hidden');
    //                         if (searchInput) {
    //                             searchInput.focus();
    //                         }
    //                     } else {
    //                         searchFieldContainer.classList.add('hidden');
    //                     }
    //                 }
    //             });

    //             toggleSearchBtn.addEventListener('keydown', (event) => {
    //                 if ('Space' === event.code || 'Enter' === event.code) {
    //                     event.preventDefault();
    //                     toggleSearchBtn.click();
    //                 }
    //             });

    //             if (searchFieldContainer) {
    //                 searchInput.addEventListener('blur', function (event) {
    //                     event.preventDefault();
    //                     window.requestAnimationFrame(() => {
    //                         if (
    //                             searchButton ===
    //                             event.target.ownerDocument.activeElement
    //                         ) {
    //                             return;
    //                         }
    //                         if (
    //                             toggleSearchBtn ===
    //                             event.target.ownerDocument.activeElement
    //                         ) {
    //                             return;
    //                         }
    //                         toggleSearchBtn.focus();
    //                         toggleSearchBtn.click();
    //                     });
    //                 });

    //                 searchButton.addEventListener('blur', function (event) {
    //                     event.preventDefault();
    //                     window.requestAnimationFrame(() => {
    //                         if (
    //                             searchInput ===
    //                             event.target.ownerDocument.activeElement
    //                         ) {
    //                             return;
    //                         }
    //                         if (
    //                             toggleSearchBtn ===
    //                             event.target.ownerDocument.activeElement
    //                         ) {
    //                             return;
    //                         }
    //                         toggleSearchBtn.focus();
    //                         toggleSearchBtn.click();
    //                     });
    //                 });
    //             }
    //         }
    //     }

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

if ('complete' === document.readyState) {
    bcgovBlockThemePluginSearch();
} else {
    addSafeEventListenerPlugin(
        document,
        'DOMContentLoaded',
        bcgovBlockThemePluginSearch()
    );
}
