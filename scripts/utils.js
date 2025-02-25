/**
 * Utility functions for cleaner JavaScript.
 *
 * Unit tests for functional data manipulations and logical operations found in `Tests`.
 */

/**
 * addGlobalEventListenerPlugin is a utility function that attaches an event listener to the given parent element and triggers the callback function only if the event target matches the given selector.
 *
 * @param {string}         type              - The type of event to listen for (e.g. 'click', 'pointerevent')
 * @param {string|Element} selector          - The selector to match against the event. Can be a CSS selector string or an Element.
 * @param {Function}       callback          - The function to be called when the event is triggered
 * @param {Element}        [parent=document] - The parent element to attach the event listener to (defaults to document)
 */
export const addGlobalEventListenerPlugin = (
    type,
    selector,
    callback,
    parent = document
) => {
    // check if the selector is valid
    if (!selector || typeof selector !== 'string') {
        throw new Error('Invalid selector: must be CSS selector or an element');
    }

    // check if the callback is a valid function
    if (typeof callback !== 'function') {
        throw new Error('Invalid callback provided');
    }

    parent.addEventListener(type, (event) => {
        // use qsa to get all elements that match the selector
        const elements = document.querySelectorAll(selector);

        // check if the event target is one of the matching elements
        const target = event.target;
        if (
            elements.includes(target) ||
            elements.some((element) => element.contains(target))
        ) {
            callback(event);
        }
    });
}

/**
 * createElement - creates an HTML element with the given type and options
 *
 * @param {string} type            - the type of element to create (e.g. 'div', 'p', 'h1')
 * @param {Object} [options={}]    - an object containing key-value pairs of attributes and values to set on the element
 * @param {string} options.class   - the class(es) to add to the element – a single space-separated string
 * @param {Object} options.dataset - an object containing key-value pairs of data attributes and values to set on the element
 * @param {string} options.text    - the text content to set on the element
 * @returns {HTMLElement} the created element
 */
export const createElement = (type, options = {}) => {
    const element = document.createElement(type);
    Object.entries(options).forEach(([key, value]) => {
        if ('class' === key) {
            value.split(' ').forEach((className) => {
                if ('' !== className) {
                    element.classList.add(className);
                }
            });
            return;
        }

        if ('dataset' === key) {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
            return;
        }

        if ('text' === key) {
            element.textContent = value;
            return;
        }

        if ('html' === key) {
            element.innerHTML = value;
            return;
        }

        element.setAttribute(key, value);
    });
    return element;
}

/**
 * qs is a utility function that returns the first element matching the given CSS selector within the given parent element.
 *
 * @param {string}  selector          - The CSS selector to search for
 * @param {Element} [parent=document] - The parent element to search within (defaults to document)
 * @returns {Element} - The first element matching the selector, or null if no match is found
 * @throws {Error} If `selector` argument is missing
 */
export const qs = (selector, parent = document) => {
    if (!selector) {
        throw new Error('A selector argument is required for the qs function');
    }
    return parent.querySelector(selector);
}

/**
 * qsa is a utility function that returns an array of all elements matching the given CSS selector within the given parent element.
 *
 * @param {string}  selector          - The CSS selector to search for
 * @param {Element} [parent=document] - The parent element to search within (defaults to document)
 * @returns {Element[]} - An array of all elements matching the selector, or an empty array if no matches are found
 * @throws {Error} If `selector` argument is missing
 */
export const qsa = (selector, parent = document) => {
    if (!selector) {
        throw new Error('A selector argument is required for the qsa function');
    }
    return [...parent.querySelectorAll(selector)];
}

/**
 * unEscapeCSS - replaces escape characters in a CSS string with their unescaped equivalents
 *
 * @param {string} cssStr – the CSS string to unescape containing CSS selectors and attributes
 * @returns {string} - An escaped CSS string
 */
export const unEscapeCSS = (cssStr) => {
    cssStr = cssStr.replace(/&gt;/g, '>');
    cssStr = cssStr.replace(/&quot;/g, '"');
    cssStr = cssStr.replace(/&#39;/g, "'");
    cssStr = cssStr.replace(/&amp;/g, '&');
    return cssStr;
}

/**
 * Finds the closest ancestor element with the specified class name from the given element.
 *
 * @param {HTMLElement} element   - The element to start searching from.
 * @param {string}      className - The class name to search for.
 * @returns {HTMLElement|null} - The closest ancestor element with the specified class name, or null if not found.
 */
export const findParentElementByClass = (element, className) => {
    let current = element.parentNode;
    while (
        current !== null &&
        current.nodeType === window.Node.ELEMENT_NODE &&
        !current.classList.contains(className)
    ) {
        current = current.parentNode;
    }
    return current;
}

/**
 * Creates a breadcrumb separator element and returns it.
 *
 * @function
 * @returns {HTMLElement} The breadcrumb separator element.
 */
const createBreadcrumbSeparator = () => {
    const separator = document.createElement('span');
    separator.classList.add('aioseo-breadcrumb-separator');
    separator.textContent = '›';
    return separator;
}

/**
 * Creates a breadcrumb navigation element.
 *
 * @param {string}  text   - The text for the breadcrumb.
 * @param {string}  href   - The href for the breadcrumb link. If not provided, the breadcrumb will be a span element with the provided text.
 * @param {boolean} isLast - A flag indicating whether this breadcrumb is the last one. If not, a separator will be added after the breadcrumb.
 * @returns {HTMLElement} - The breadcrumb navigation element, represented as an HTML span element with class 'aioseo-breadcrumb'.
 */
const createBreadcrumb = (text, href, isLast) => {
    const breadcrumb = document.createElement('span');
    breadcrumb.classList.add('aioseo-breadcrumb');

    if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.title = text;
        link.dataset.text = text;
        link.textContent = text;
        breadcrumb.appendChild(link);
    } else {
        breadcrumb.textContent = text;
    }

    if (!isLast) {
        const separator = createBreadcrumbSeparator();
        if (breadcrumb.parentNode) {
            breadcrumb.parentNode.insertBefore(
                separator,
                breadcrumb.nextSibling
            );
        }
    }

    return breadcrumb;
}

/**
 * Creates a breadcrumb container element based on an array of breadcrumb paths. Leverages the AIOSEO format provided by that plugin.
 *
 * @module createBreadcrumbs
 * @param {Array} paths - An array of objects representing the breadcrumb paths, with each object containing the name and URL of a breadcrumb path.
 * @returns {HTMLElement} The breadcrumb container element containing all of the breadcrumbs.
 */
export const createBreadcrumbs = (paths) => {
    const breadcrumbsContainer = document.createElement('div');
    breadcrumbsContainer.classList.add('aioseo-breadcrumbs');

    const homeBreadcrumb = createBreadcrumb('Home', '/');
    breadcrumbsContainer.appendChild(homeBreadcrumb);

    const separator = createBreadcrumbSeparator();

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const breadcrumb = createBreadcrumb(
            path.name,
            path.url,
            i === paths.length - 1
        );
        breadcrumbsContainer.appendChild(separator.cloneNode(true));
        breadcrumbsContainer.appendChild(breadcrumb);
    }

    return breadcrumbsContainer;
}

/**
 * Safely adds an event listener to a target element.
 *
 * @param {EventTarget | object} el        - The target element to which the event listener will be added.
 * @param {string}               event     - A string representing the event type to listen for (e.g., 'click', 'resize').
 * @param {Function | object}    handler   - The event listener function or object.
 * @param {boolean | object}     [options] - An optional object specifying options for the event listener.
 * @throws {Error} Throws an error if the target is not a valid element or if it doesn't support addEventListener.
 */
export const addSafeEventListenerPlugin = (el, event, handler, options) => {
    if (el && 'function' === typeof el.addEventListener) {
        // Call the original function
        el.addEventListener(event, handler, options);
    } else {
        /* eslint-disable no-console */
        console.warn(
            'el is not a valid EventTarget or does not support addEventListener'
        );
        /* eslint-enable no-console */
    }
}
