import './assets/shared.css';
import { createApp } from 'vue';
import PostFilterApp from './postFilterApp.vue';
import VehicleFilterApp from './vehicleFilterApp.vue';
import PQEAFilterApp from './pqeaVueApp.vue';
import ContractorFilterApp from './contractorVueApp.vue';
import RebateFilterApp from './rebateVueApp.vue';
import FAQFilterApp from './faqVueApp.vue';

// Common initialization function for creating and mounting a Vue app

/**
 * Initialize a Vue.js application with the given component, selector, and attributes.
 *
 * @function
 * @name initVueApp
 * @param {object} appComponent - The Vue component to be mounted.
 * @param {string} selector - The CSS selector for the HTML element where the Vue app will be mounted.
 * @param {object} attributes - Attributes to be passed to the Vue app (e.g., props).
 * @returns {void}
 */
const bcgovBlockThemePluginMain = () => {

    const postFilterAppElement = document.querySelector('#postFilterApp');
    const VehicleFilterAppElement = document.querySelector('#vehicleFilterApp');
    const PQEAFilterAppElement = document.querySelector('#pqeaFilterApp');
    const ContractorFilterAppElement = document.querySelector('#contractorFilterApp');
    const RebateFilterAppElement = document.querySelector('#rebateFilterApp');
    const FAQFilterAppElement = document.querySelector('#faqFilterApp');

    /**
     * Initialize a Vue.js application with the given component, selector, and attributes.
     *
     * @function
     * @name initVueApp
     * @param {object} appComponent - The Vue component to be mounted.
     * @param {string} selector - The CSS selector for the HTML element where the Vue app will be mounted.
     * @param {object} attributes - Attributes to be passed to the Vue app (e.g., props).
     * @returns {void}
     */
    const initVueApp = (appComponent, selector, attributes) => {

        // Check if there's an existing Vue instance for the same component and destroy it
        if (window.vueInstance && window.vueInstance.component === appComponent) {
            window.vueInstance.unmount();
        }

        // Pass attributes to your Vue app via props or through some other method
        // Depending on your Vue app's structure, you might need to modify this
        appComponent.props = attributes;

        // Create and mount the new Vue instance
        window.vueInstance = createApp(appComponent);
        window.vueInstance.mount(selector);
        window.vueInstance.component = appComponent; // Store the component type
        // console.info(appComponent, `Mounting ${appComponent.__name}...`);
    }

    // Initialize Vue app for the 'PostFilterApp' component if the corresponding element exists
    if (postFilterAppElement) {
        initVueApp(PostFilterApp, postFilterAppElement);
    }

    // Initialize Vue app for the 'VehicleFilterApp' component if the corresponding element exists
    if (VehicleFilterAppElement) {
        initVueApp(VehicleFilterApp, VehicleFilterAppElement);
    }

    // Initialize Vue app for the 'PQEAFilterApp' component if the corresponding element exists
    if (PQEAFilterAppElement) {
        initVueApp(PQEAFilterApp, PQEAFilterAppElement);
    }

    // Initialize Vue app for the 'ContractorFilterApp' component if the corresponding element exists
    if (ContractorFilterAppElement) {
        initVueApp(ContractorFilterApp, ContractorFilterAppElement);
    }

    // Initialize Vue app for the 'RebateFilterApp' component if the corresponding element exists
    if (RebateFilterAppElement) {
        initVueApp(RebateFilterApp, RebateFilterAppElement);
    }

    // Initialize Vue app for the 'FAQFilterApp' component if the corresponding element exists
    if (FAQFilterAppElement) {
        initVueApp(FAQFilterApp, FAQFilterAppElement);
    }
};

/**
 * Safely adds an event listener to an EventTarget if it supports the 'addEventListener' method.
 *
 * @function
 * @name addSafeEventListenerPlugin
 *
 * @param {EventTarget} el - The target element or object to which the event listener is added.
 * @param {string} event - A string representing the event type to listen for (e.g., 'click', 'change').
 * @param {EventListenerOrEventListenerObject} handler - The function that receives the event when triggered.
 * @param {boolean|AddEventListenerOptions} [options] - An options object.
 *
 * @returns {void}
 */
function addSafeEventListenerPlugin(el, event, handler, options) {
    if (el && typeof el.addEventListener === 'function') {
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

if ('complete' === document.readyState) {
    bcgovBlockThemePluginMain();
} else {
    addSafeEventListenerPlugin(
        document,
        'DOMContentLoaded',
        bcgovBlockThemePluginMain()
    );
}