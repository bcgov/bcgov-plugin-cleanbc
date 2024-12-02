import { addSafeEventListenerPlugin } from '../utils';

/**
 * General CleanBC Definitons dialog generator.
 */
const bcgovBlockThemePluginDefnitions = () => {
    /*
     * SafarIE iOS requires window.requestAnimationFrame update.
     */
    window.requestAnimationFrame(() => {
        const links = document.querySelectorAll('a:not(#postFilterApp a)');

        const definitionLinks = Array.from(links).filter(function (link) {
            return link.href.includes('definitions');
        });

        if (definitionLinks.length > 0) {
            const dialog = document.createElement('dialog');
            dialog.id = 'dialog';
            dialog.className = 'dialog';
            dialog.setAttribute('aria-modal', true);
            dialog.setAttribute('aria-live', 'polite');
            dialog.innerHTML =
                '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
            document.body.appendChild(dialog);

            const closeDialogButton = document.getElementById('close-dialog');

            closeDialogButton.addEventListener('click', function () {
                dialog.close();
            });

            definitionLinks.forEach(function (link) {
                link.classList.add('icon-definition');
                link.setAttribute(
                    'aria-label',
                    'opens definition dialog for: ' + link.text
                );

                // Adding event listeners for both click and keypress events
                addEventListeners(link);
            });

        }
        /**
         *
         * @param element
         */
        function addEventListeners(element) {
            element.addEventListener('click', handleClick);
            element.addEventListener('keypress', handleKeypress);
        }

        /**
         *
         * @param event
         */
        async function handleClick(event) {
            if (
                'click' === event.type ||
                ('keypress' === event.type && 'Enter' === event.key)
            ) {
                event.preventDefault();
                const url = event.currentTarget.getAttribute('href');
                console.log('url', url);
                const cachedData = window.sessionStorage.getItem(url);
                console.log('cachedData', cachedData);
                if (cachedData) {
                    const { title, content } = JSON.parse(cachedData);
                    displayContent(title, content);
                } else {
                    try {
                        const response = await fetch(url);
        
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
        
                        const html = await response.text();
                        const parser = new window.DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
        
                        const titleElement = doc.querySelector('.wp-block-post-title');
                        const contentElement = doc.querySelector('.entry-content');
        
                        if (!titleElement || !contentElement) {
                            throw new Error(
                                'Required content not found in the fetched HTML.'
                            );
                        }
        
                        const title = titleElement.innerText;
                        const content = contentElement.innerHTML;
                        const dataToCache = { title, content };
        
                        window.sessionStorage.setItem(url, JSON.stringify(dataToCache));
                        displayContent(title, content);
                    } catch (error) {
                        console.error('Error fetching content:', error);
                    }
                }
            }
        }
        

        /**
         *
         * @param event
         */
        function handleKeypress(event) {
            if ('Enter' === event.key || 13 === event.keycode) {
                handleClick(event);
            }
        }

        /**
         *
         * @param title
         * @param content
         */
        function displayContent(title, content) {
            const dialogContent = document.querySelector(
                '#dialog .dialog-content'
            );
            dialogContent.innerHTML =
                '<h2 tabindex="0">' + title + '</h2>' + content;
            showDialog();
            dialogContent.querySelector('h2').focus();
        }

        /**
         *
         */
        function showDialog() {
            const dialog = document.getElementById('dialog');
            dialog.showModal();
        }
    });
};

if ('complete' === document.readyState) {
    bcgovBlockThemePluginDefnitions();
} else {
    addSafeEventListenerPlugin(
        document,
        'DOMContentLoaded',
        bcgovBlockThemePluginDefnitions()
    );
}
