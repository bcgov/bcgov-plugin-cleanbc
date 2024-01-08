import './assets/shared.css';
import { createApp } from 'vue';
import PostFilterApp from './postFilterApp.vue';
import VehicleFilterApp from './vehicleFilterApp.vue';

// Common initialization function for creating and mounting a Vue app

const bcgovBlockThemePluginMain = () => {

    const postFilterAppElement = document.querySelector('#postFilterApp');
    const VehicleFilterAppElement = document.querySelector('#vehicleFilterApp');
    
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


    if (postFilterAppElement) {
        initVueApp(PostFilterApp, postFilterAppElement);
    }
    
    if (VehicleFilterAppElement) {
        initVueApp(VehicleFilterApp, VehicleFilterAppElement);
    }

};

function addSafeEventListenerPlugin( el, event, handler, options ) {
    if ( el && typeof el.addEventListener === 'function' ) {
        // Call the original function
        el.addEventListener( event, handler, options );
    } else {
        /* eslint-disable no-console */
        console.warn(
            'el is not a valid EventTarget or does not support addEventListener'
        );
        /* eslint-enable no-console */
    }
}

if ( 'complete' === document.readyState ) {
	bcgovBlockThemePluginMain();
} else {
	addSafeEventListenerPlugin(
        document,
		'DOMContentLoaded',
		bcgovBlockThemePluginMain()
	);
}