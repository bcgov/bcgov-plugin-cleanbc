<template>
    <p style='color: red;'>PQEA filter block goes here...</p>
</template>

<script setup>
/**
 * Vue component script for the Better Homes PQEA Filter.
 */
import { ref, onMounted, computed, watch } from 'vue';

const publicDomain = ref('https://betterhomes.gov.bc.ca');

/**
 * Checks if the DOM is fully loaded and interactive. See onMounted.
 */
const isDOMReady = () => {
    return document.readyState === 'complete' || document.readyState === 'interactive';
};

/**
 * Watches the `window.site?.domain` variable and invokes `fetchData` when it becomes truthy.
 */
watch(() => window.site?.domain, (newVal, oldVal) => {
    if (newVal) {
        publicDomain.value = newVal;
    }
});


/**
 * A Vue lifecycle hook that is called after the instance has been mounted.
 * It retrieves various attributes from the 'postFilterApp' element and assigns them to reactive properties.
 * It also shows a loading message, fetches data, and then handles the URL hash.
 *
 * @returns {void}
 */
onMounted(() => {
    const appElement = document.getElementById('pqeaFilterApp');
});
</script>

<style lang='scss'>

</style>