<template>
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Energy Advisor Listings</h2>
    <!-- Filter Controls -->
    <div class="pqeasFilterControls" id="pqeasFilterControls">
        <!-- Category Select -->
        <label for="categorySelect" class="sr-only">Choose between home construction and home renovation</label>
        <div class="custom-select">
            <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="categorySelect" class="select select--category" v-model="selectedCategory" :required="true" data-active="false">
                <option v-if="isLoading" value="Constructing a home">Constructing a home</option>
                <option v-if="!isLoading" v-for="(category, index) in categories" :key="category" :value="category">{{ category }}</option>
            </select>
        </div>

        <!-- Location Select -->
        <label for="locationSelect" class="sr-only">Choose a service region</label>
        <div class="custom-select">
            <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="locationSelect" class="select select--location" v-model="selectedLocation">
                <option value="all">All Locations</option>
                <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
            </select>
        </div>

        <!-- Clear Filters Button -->
        <button class="clear-filters" @click.prevent="clearFilters"
            @touchend="clearFilters"
            @keydown.enter.prevent="clearFilters"
            type="button">
            Reset selection
        </button>

        <!-- Pagination Controls -->
        <div class="pqeasFilterPagination pqeas-filter__pagination pqeas-filter__pagination--top">
            <!-- Previous Page Button -->
            <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
            <!-- Current Page & Totals -->
            <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            <!-- Next Page Button -->
            <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>

            <!-- Results Information -->
            <span class="totals">
                Showing <span class="results-count"><span class="numValue paginated-pqeas">{{paginatedPqeas.length }}</span> of <span class="numValue filtered-pqeas">{{ filteredPqeas.length }}</span></span> Energy Advisors
            </span>

            <span class="sr-status sr-only">
                <span class="results-count" role="status" aria-live="polite">Showing <span class="numValue paginated-pqeas">{{paginatedPqeas.length }}</span> of <span class="numValue filtered-pqeas">{{ filteredPqeas.length }}</span> Energy Advisors {{ currentTypeFilterMessage }} {{ currentLocationFilterMessage }}</span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>
        </div>
    </div>

    <!-- Loading Message -->
    <p v-if="isLoading" class="no-results loading" aria-live="polite">Retrieving list of Energy Advisors, please wait...</p>

    <!-- PQEAs Results Table -->
    <table id="pqeasResults" class="pqeasResults table table--striped">
        <caption class="sr-only">Program Qualified Energy Advisors</caption>
        <!-- Table Columns -->
        <colgroup>
            <col class="col col--1 odd col--pqea__company-and-location"/>
            <col class="col col--2 even col--pqea__contact-name"/>
            <col class="col col--3 odd col--pqea__email-and-phone"/>
            <col class="col col--4 even col--pqea__service-organizations"/>
            <col class="col col--5 odd col--pqea__services"/>
        </colgroup>
        <!-- Table Header -->
        <thead>
            <tr>
                <th class="pqea-heading odd pqea-heading--company-and-location">Company Name <br>& Head Office</th>
                <th class="pqea-heading even pqea-heading--contact-name">Contact Name</th>
                <th class="pqea-heading odd pqea-heading--email-and-phone">Email & Phone</th>
                <th class="pqea-heading even pqea-heading--service-organizations">Service Organization(s)</th>
                <th class="pqea-heading odd pqea-heading--services">Program Qualified Services</th>
            </tr>
        </thead>

        <!-- Table Body -->
        <tbody :class="`page page--${currentPage}`">
            <!-- No Results Message -->
            <tr v-if="filteredPqeas.length === 0 && !isLoading" class="no-results">
                <td colspan="100%">
                    <p class="no-results" aria-live="polite">Sorry, no results found.</p>
                </td>
            </tr>

            <!-- Loading Message -->
            <tr v-if="isLoading" class="is-loading" aria-live="polite">
                <td colspan="100%">
                    <p class="">Loading...</p>
                </td>
            </tr>

            <!-- Results Loop -->
            <template v-if="pqeas.length > 0" v-for="(pqea, index) in paginatedPqeas" :key="index">
                <tr :class="`pqea result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`" tabindex="0">
                    <!-- Company Name and Head Office -->
                    <td data-label="Company Name and Head Office" class="pqea__company-and-location">
                        <!-- Company Website Link -->
                        <a v-if="pqea.details.company_website" class="pqea__company external" :href="pqea.details.company_website" target="_blank" :title="pqea.details.company_name + ' website, opens in a new tab/window.'">
                            {{ pqea.details.company_name ? pqea.details.company_name : 'Website' }}
                        </a>
                        <!-- Company Name if No Website -->
                        <span v-else class="pqea__company">
                            {{ pqea.details.company_name ? pqea.details.company_name : 'No company name provided' }}
                        </span>
                        <!-- Company Location -->
                        <span class="pqea__location">
                            {{ pqea.details.company_location ? pqea.details.company_location : 'Not provided' }}
                        </span>
                    </td>

                    <!-- Contact Name -->
                    <td data-label="Contact Name" class="pqea__contact-name">
                        <p>{{ pqea.details.contact_name ? pqea.details.contact_name : 'Not provided' }}</p>
                    </td>

                    <!-- Contact Email and Phone -->
                    <td data-label="Contact Email and Phone" class="pqea__email-and-phone">
                        <address>
                            <!-- Email Link -->
                            <a v-if="pqea.details.email" class="pqea__email" :href="'mailto:' + pqea.details.email">{{ pqea.details.email }}</a>
                            <p class="pqea__email" v-else>No email provided</p>

                            <!-- Phone Link -->
                            <a v-if="pqea.details.phone" class="pqea__telephone" :href="'tel:+1' + pqea.details.phone.replace(/-/g, '')">{{ pqea.details.phone }}</a>
                            <p class="pqea__telephone" v-else>No phone number provided</p>
                        </address>
                    </td>

                    <!-- Service Organizations -->
                    <td data-label="Service Organization(s)" class="pqea__service-organizations">
                        <ul v-if="pqea.details.service_organization_name || pqea.details.service_organization_name_2">
                            <!-- Service Organization Name 1 -->
                            <li v-if="pqea.details.service_organization_name" class="pqea__service-organization-name">
                                <!-- Link if Website Provided -->
                                <a v-if="pqea.details.service_organization_website" :href="pqea.details.service_organization_website" class="external" target="_blank" :title="pqea.details.service_organization_name + ' website, opens in a new tab/window.'">{{ pqea.details.service_organization_name }}</a>
                                <!-- Plain Text if No Website -->
                                <span v-else>{{ pqea.details.service_organization_name }}</span>
                            </li>

                            <!-- Service Organization Name 2 -->
                            <li v-if="pqea.details.service_organization_name_2" class="pqea__service-organization-name--2">
                                <!-- Link if Website Provided -->
                                <a v-if="pqea.details.service_organization_website_2" :href="pqea.details.service_organization_website_2" class="external" target="_blank" :title="pqea.details.service_organization_name_2 + ' website, opens in a new tab/window.'">{{ pqea.details.service_organization_name_2 }}</a>
                                <!-- Plain Text if No Website -->
                                <span v-else>{{ pqea.details.service_organization_name_2 }}</span>
                            </li>

                            <!-- Additional Service Organizations -->
                            <li v-if="pqea.details.additional_service_organizations" v-for="(org, index) in pqea.details.additional_service_organizations" :key="index">
                                <!-- Link if Website Provided -->
                                <a v-if="org[1]" :href="org[1]" class="external" target="_blank" :title="org[0] + ' website, opens in a new tab/window.'">{{ org[0] }}</a>
                                <!-- Plain Text if No Website -->
                                <span v-else>{{ org[0] }}</span>
                            </li>
                        </ul>
                    </td>

                    <!-- Program Qualified Services -->
                    <td data-label="Program Qualified Services" class="pqea__services">
                        <p v-if="pqea.services">
                            <!-- Display Program Qualified Services -->
                            <span v-for="(service, services_index) in pqea.services" :class="`pqea__service pqea__service--${service.name.replace(/ /g, '-').toLowerCase()}`">
                                {{ service.name }}<span v-if="services_index != Object.keys(pqea.services).length - 1">,&nbsp;</span>
                            </span>
                        </p>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>

    <!-- Pagination Controls (Bottom) -->
    <div class="pqeasFilterPagination pqeas-filter__pagination pqeas-filter__pagination--bottom">
        <!-- Previous Page Button -->
        <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
        <!-- Current Page & Totals -->
        <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
        <!-- Next Page Button -->
        <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>

        <!-- Results Information -->
        <div class="totals">
            Showing <span class="results-count"><span class="numValue paginated-pqeas">{{paginatedPqeas.length }}</span> of <span class="numValue filtered-pqeas">{{ filteredPqeas.length }}</span></span> Energy Advisors
        </div>
    </div>
</template>

<script setup>
/**
 * Vue Composition API imports for reactive data and lifecycle hooks.
 *
 * @type {{ ref: Function, onMounted: Function, computed: Function, watch: Function }}
 * @namespace VueCompositionAPI
 */
 import { ref, onMounted, computed, watch } from 'vue';


/**
 * Ref for storing an array of PQEAs (Program Qualified Energy Advisors).
 *
 * @type {Ref<Array>} - A reference to an array containing PQEAs.
 */
const pqeas = ref([]);

/**
 * Ref for the default selected category.
 *
 * @type {Ref<String>} - A reference to the default selected category.
 */
const defaultSelectedCategory = ref('Constructing a home');

/**
 * Ref for the currently selected category.
 *
 * @type {Ref<String>} - A reference to the currently selected category.
 */
const selectedCategory = ref('Constructing a home');

/**
 * Ref for the default selected location.
 *
 * @type {Ref<String>} - A reference to the default selected location.
 */
const defaultSelectedLocation = ref('all');

/**
 * Ref for the currently selected location.
 *
 * @type {Ref<String>} - A reference to the currently selected location.
 */
const selectedLocation = ref('all');

/**
 * Ref for controlling the visibility of loading messages.
 *
 * @type {Ref<Boolean>} - A reference to a boolean indicating whether to show loading messages.
 */
const showLoadingMessage = ref(true);

/**
 * Ref for controlling the loading state.
 *
 * @type {Ref<Boolean>} - A reference to a boolean indicating whether data is currently being loaded.
 */
const isLoading = ref(false);

/**
 * Ref for storing the CSS class name for an active state.
 *
 * @type {Ref<String>} - A reference to the CSS class name for an active state.
 */
const activeClass = ref('is-active');

const updatingClass = ref('is-updating');

// Pagination related data

/**
 * Ref for storing the default page size for paginated results.
 *
 * @type {Ref<Number>} - A reference to the default page size.
 */
const pageSize = ref(30); // Default page size

/**
 * Ref for storing the current page number for paginated results.
 *
 * @type {Ref<Number>} - A reference to the current page number.
 */
const currentPage = ref(1);

const itemsToClearFromSessionStorage = ref([
    'contractorsData',
    'contractorsTimestamp',
    'rebatesData',
    'rebatesTimestamp',
]);

const oldPaginatedPqeasCount = ref(0);
const oldFilteredPqeasCount = ref(0);

/**
 * Ref for storing the public domain URL.
 *
 * @type {Ref<String>} - A reference to the public domain URL.
 */
const publicDomain = ref('https://betterhomes.gov.bc.ca');

/**
 * Variable for constructing the API URL for fetching PQEAs.
 *
 * @type {String} - The constructed API URL for fetching PQEAs.
 */
const pqeasAPI = `${window.site?.domain ? window.site.domain : publicDomain}/wp-json/custom/v1/pqeas`;


/**
 * Computed property to handle filtering PQEAs (Program Qualified Energy Advisors) by category and/or location.
 *
 * Uses the selected location to filter PQEAs based on location and incorporates the results from category filtering.
 *
 * @type {Array} - An array containing the filtered PQEAs based on selected category and/or location.
 */
const filteredPqeas = computed(() => {
    const selectedLoc = selectedLocation.value;
    let filteredPqeas = [...filteredPqeasByCategory.value];

    // Filter by location if 'all' is not selected.
    if ('all' !== selectedLoc) {
        filteredPqeas = filteredPqeas.filter(pqea => pqea.locations && pqea.locations.some(location => location.name === selectedLoc) );
    }

    // handleUpdatingAnimationClass(".pqeas-filter__pagination .pages");
    // handleUpdatingAnimationClass(".pqeas-filter__pagination .totals");
    resetSelectsActiveState();

    return filteredPqeas;
});

// Define a computed property to filter pqeas based on the selected category
const filteredPqeasByCategory = computed(() => {
    const selectedCat = selectedCategory.value;
    currentPage.value = 1;

    if (selectedCat === 'all') {
        return pqeas.value;
    } else {
        return pqeas.value.filter(pqea => pqea.categories && pqea.categories.includes(selectedCat));
    }
});

const handleUpdatingAnimationClass = (elementCssPath) => {
    const elements = document.querySelectorAll(elementCssPath);

    if ( 0 < elements.length ) {
        elements.forEach((element) => {
            element.classList.add(updatingClass.value);
            setTimeout(() => { element.classList.remove(updatingClass.value); }, 125);
        })
    }
}

/**
 * Computed property to calculate the total number of pages for paginated PQEAs (Program Qualified Energy Advisors).
 *
 * Uses the length of filtered PQEAs and the page size to determine the total number of pages.
 *
 * @type {number} - The total number of pages for paginated PQEAs.
 */
const totalPages = computed(() => {
    const totalPqeas = filteredPqeas.value.length;
    return totalPqeas > 0 ? Math.ceil(totalPqeas / pageSize.value) : 1;
});


/**
 * Computed property to calculate the paginated PQEAs (Program Qualified Energy Advisors).
 *
 * Uses the current page and page size to determine the slice of filtered PQEAs to display.
 *
 * @type {Array} - An array containing the paginated PQEAs for the current page.
 */
const paginatedPqeas = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredPqeas.value.slice(start, end);
});

/**
 * Function to navigate to the previous page in paginated results.
 *
 * Decrements the current page if it is greater than 1.
 *
 * @returns {number|null} - The updated current page value or null if already on the first page.
 */
const prevPage = () => {
    // handleUpdatingAnimationClass(".pqeas-filter__pagination .pages");
    return currentPage.value > 1 ? currentPage.value-- : null;
};


/**
 * Function to navigate to the next page in paginated results.
 *
 * Increments the current page if it is less than the total number of pages.
 *
 * @returns {number|null} - The updated current page value or null if already on the last page.
 */
const nextPage = () => {
    // handleUpdatingAnimationClass(".pqeas-filter__pagination .pages");
    return currentPage.value < totalPages.value ? currentPage.value++ : null;
};


/**
 * Checks if the DOM (Document Object Model) is fully loaded and interactive.
 *
 * @returns {boolean} - True if the DOM is fully loaded or interactive, otherwise false.
 */
const isDOMReady = () => {
    return document.readyState === 'complete' || document.readyState === 'interactive';
};


/**
 * Computed property to extract unique EA Project Types (ea-project-types) from PQEAs.
 * Iterates through the PQEAs to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique EA Project Types sorted alphabetically.
 */
const categories = computed(() => {
    const uniqueCategories = new Set();

    // Iterate through PQEAs to collect distinct project type names.
    pqeas.value.forEach(pqea => {
        if (pqea.categories) {
            if (typeof pqea.categories === 'string') {
                uniqueCategories.add(pqea.categories);
            } else if (Array.isArray(pqea.categories)) {
                pqea.categories.forEach(category => {
                    uniqueCategories.add(category);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedCategories = Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
    return [...sortedCategories];
});


/**
 * Computed property to extract unique EA Locations (ea-locations) from PQEAs.
 * Iterates through the PQEAs to collect distinct location names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique EA Locations sorted alphabetically.
 */
const locations = computed(() => {
    const uniqueLocations = new Set();

    // Iterate through PQEAs to collect distinct location names.
    pqeas.value.forEach(pqea => {
        if (pqea.locations) {
            if (typeof pqea.locations === 'string') {
                uniqueLocations.add(pqea.locations.name);
            } else if (Array.isArray(pqea.locations)) {
                pqea.locations.forEach(location => {
                    uniqueLocations.add(location.name);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedLocations = Array.from(uniqueLocations).sort((a, b) => a.localeCompare(b));
    return [...sortedLocations];
});

/**
 * Computed property for generating a filter results message based on the selected category.
 * Indicates whether the selected category is the default, and provides a message accordingly.
 *
 * @type {String} - A string indicating the filter results message based on the selected category.
 */
const currentTypeFilterMessage = computed(() => {
    return defaultSelectedCategory.value === selectedCategory.value ? 'specializing in home construction' : 'specializing in home renovation';
});

/**
 * Computed property for generating a filter results message based on the selected location.
 * If the selected location is not 'all', the message indicates servicing the selected location.
 *
 * @type {String|null} - A string indicating the filter results message or null if 'all' is selected.
 */
const currentLocationFilterMessage = computed(() => {
    return 'all' !== selectedLocation.value ? 'servicing ' + selectedLocation.value : null;
});

/**
 * Clears all selected locations and types and resets the filter, removes the hash from the URL,
 * scrolls smoothly to the categories filter container, and checks for external links.
 *
 * @returns {void}
 */
const clearFilters = () => {
    resetSelectsActiveState();

    selectedCategory.value = defaultSelectedCategory.value;
    selectedLocation.value = defaultSelectedLocation.value;

    history.replaceState(selectedCategory.value, defaultSelectedCategory.value);
    history.replaceState(selectedLocation.value, defaultSelectedLocation.value);

    currentPage.value !== 1 ? handleUpdatingAnimationClass(".pqeas-filter__pagination .pages") : null;
    currentPage.value = 1;
};

const resetSelectsActiveState = () => {
    let activeSelects = document.querySelectorAll('#pqeaFilterApp .custom-select.is-active');

    0 < activeSelects.length ? activeSelects.forEach((item) => { item.classList.remove('is-active') }) : null;
}

/**
 * Event listener bound to @click and @keyup.esc
 * Toggle active class for presentation on <select> element wrapper .custom-select.
 *
 * @param {Event} event - The click or keyup event.
 * @returns {void}
 */
const selectIsActive = (event) => {
    return 'click' !== event.type ? event.target.parentNode.classList.remove(activeClass.value) : event.target.parentNode.classList.toggle(activeClass.value);
}

/**
 * Fetches pqea data either from sessionStorage cache (if available and not expired) or from the WordPress API.
 * If data is fetched from the API, it is stored in sessionStorage for caching purposes.
 *
 * @param {number} [offset=0] - The offset for paginating results (default is 0).
 * @returns {Promise<void>} - A promise that resolves when the data is fetched and updated.
 * @throws {Error} - If there is an error fetching the data from the API.
 */
const fetchData = async (offset = 0) => {
    try {
        // Set loading state to true.
        isLoading.value = true;

        // Check if data exists in sessionStorage and if it's not expired.
        const cachedData = sessionStorage.getItem('pqeasData');
        const cachedTimestamp = sessionStorage.getItem('pqeasTimestamp');
        if (cachedData && cachedTimestamp) {
            const timeElapsed = Date.now() - parseInt(cachedTimestamp);
            const hoursElapsed = timeElapsed / (1000 * 60 * 60);
            if (hoursElapsed < 24) {
                // Data exists in cache and it's not expired.
                pqeas.value = JSON.parse(cachedData);
                showLoadingMessage.value = false;
                // Set loading state to false after data is fetched.
                isLoading.value = false;
                return;
            }
        }

        // Fetch data from API
        fetch(pqeasAPI, { cache: 'no-store' })
            .then((r) => r.json())
            .then((json) => {
                // Purge old data from sessionStorage to make sure we don't
                // exceed storage limits.
                setTimeout(itemsToClearFromSessionStorage.value.forEach((item) => {
                    sessionStorage.removeItem(item);
                }), 1000);

                // Store data in sessionStorage.
                sessionStorage.setItem('pqeasData', JSON.stringify(json));
                sessionStorage.setItem('pqeasTimestamp', Date.now());
                pqeas.value = json;
                showLoadingMessage.value = false;
                // Set loading state to false after data is fetched.
                isLoading.value = false;
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                throw error;
            });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const purgeOldLocalData = (items) => {
    items.forEach((item) => {
        sessionStorage.removeItem(item);
    });

    return;
}

/**
 * Watcher for changes in the window.site?.domain variable.
 * Invokes the fetchData() function when the window.site?.domain becomes truthy.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
watch(() => window.site?.domain, (newVal) => {
    if (newVal) {
        fetchData();
    }
});

watch(paginatedPqeas, () => {
    // Avoid firing animation when number value is the same.
    if ( oldPaginatedPqeasCount.value !== paginatedPqeas.value.length ) {
        oldPaginatedPqeasCount.value = paginatedPqeas.value.length;
        handleUpdatingAnimationClass(".pqeas-filter__pagination .paginated-pqeas");
    }
});
watch(filteredPqeas, () => {
        // Avoid firing animation when number value is the same.
    if ( oldFilteredPqeasCount.value !== filteredPqeas.value.length ) {
        oldFilteredPqeasCount.value = filteredPqeas.value.length;
        handleUpdatingAnimationClass(".pqeas-filter__pagination .filtered-pqeas");
    }
});

watch(currentPage, () => {
    handleUpdatingAnimationClass(".pqeas-filter__pagination .current-page");
});

watch(totalPages, () => {
    handleUpdatingAnimationClass(".pqeas-filter__pagination .total-pages");
});

/**
 * Watcher for changes in selectedCategory and selectedLocation.
 * Resets the currentPage to 1 whenever either of the watched properties changes.
 *
 * @param {Array} dependencies - An array of reactive properties to watch.
 * @param {Function} callback - The callback function to execute when any of the watched properties change.
 * @returns {void}
 */
watch([selectedCategory, selectedLocation], () => {
    currentPage.value = 1;
});

window.addEventListener("click", (event) => {
    if ( !event.target.closest('.custom-select.is-active' || document.querySelectorAll('#pqeaFilterApp .custom-select.is-active').length ) ) {
        resetSelectsActiveState();
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
    fetchData();

    const appElement = document.getElementById('pqeaFilterApp');
    showLoadingMessage.value = true;

    if (window.site?.domain) {
    }
});
</script>

<style lang='scss' scoped>
// Breakpoints
$breakpoint-xxs: 0;
$breakpoint-xs: 479px;
$breakpoint-sm: 767px;
$breakpoint-md: 991px;
$breakpoint-md-lg: 1024px;
$breakpoint-lg: 1199px;
// Colours
$mineshaft: #333;
$scorpiongrey: #484747;
$dovegrey: #656565;
$gallerygray: #edebeb;
$vehiclegrey: #ccc;
$prussianblue: #002a4e;
$bahamablue: #005d99;
$bondiblue: #007e9e;
$eucalyptus: #1d8045;
$porcelain: #dcdcdc;
$white: #fff;
$snow: $white;
// Other style defaults.
$default_transition_timing_fn: ease-in-out;
$default_transition_duration: 0.125s;
$default_outline_width: 0.125rem;
$default_outline_offset: 0.125rem;
$default_interactable_min_height: 2.5rem;
$default_button_min_width: 9.75rem;
$default_button_padding_vert: 0.5rem;
$default_button_padding_horz: 1rem;
$default_table_cell_padding_mobile_vert: 1rem;
$default_table_cell_padding_mobile_horz: 1rem;
$default_table_cell_padding_desktop_vert: 0.5rem;
$default_table_cell_padding_desktop_horz: 1rem;
// Icons
$external-link-icon-dark: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxOCAxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTggMTg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMDAyQTRFO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTkuNywzLjljMC0wLjEtMC4xLTAuMy0wLjItMC40QzkuNCwzLjQsOS4zLDMuNCw5LjIsMy40SDEuN2MtMC40LDAtMC45LDAuMi0xLjIsMC41QzAuMiw0LjIsMCw0LjYsMCw1LjF2MTEuMgoJYzAsMC40LDAuMiwwLjksMC41LDEuMkMwLjgsMTcuOCwxLjIsMTgsMS43LDE4aDExLjJjMC40LDAsMC45LTAuMiwxLjItMC41YzAuMy0wLjMsMC41LTAuNywwLjUtMS4yVjguOGMwLTAuMS0wLjEtMC4zLTAuMi0wLjQKCWMtMC4xLTAuMS0wLjItMC4yLTAuNC0wLjJjLTAuMSwwLTAuMywwLjEtMC40LDAuMmMtMC4xLDAuMS0wLjIsMC4yLTAuMiwwLjR2Ny41YzAsMC4xLTAuMSwwLjMtMC4yLDAuNGMtMC4xLDAuMS0wLjIsMC4yLTAuNCwwLjIKCUgxLjdjLTAuMSwwLTAuMy0wLjEtMC40LTAuMmMtMC4xLTAuMS0wLjItMC4yLTAuMi0wLjRWNS4xYzAtMC4xLDAuMS0wLjMsMC4yLTAuNGMwLjEtMC4xLDAuMi0wLjIsMC40LTAuMmg3LjUKCWMwLjEsMCwwLjMtMC4xLDAuNC0wLjJDOS43LDQuMiw5LjcsNC4xLDkuNywzLjl6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCwwLjZjMC0wLjEtMC4xLTAuMy0wLjItMC40QzE3LjcsMC4xLDE3LjYsMCwxNy40LDBoLTUuNmMtMC4xLDAtMC4zLDAuMS0wLjQsMC4yYy0wLjEsMC4xLTAuMiwwLjItMC4yLDAuNAoJczAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMiwwLjIsMC40LDAuMmg0LjNsLTkuMiw5LjJjLTAuMSwwLjEtMC4xLDAuMS0wLjEsMC4yYzAsMC4xLDAsMC4xLDAsMC4yczAsMC4xLDAsMC4yCgljMCwwLjEsMC4xLDAuMSwwLjEsMC4yQzcsMTEuMSw3LDExLjIsNy4xLDExLjJjMC4xLDAsMC4xLDAsMC4yLDBjMC4xLDAsMC4xLDAsMC4yLDBzMC4xLTAuMSwwLjItMC4xbDkuMi05LjJ2NC4zCgljMCwwLjEsMC4xLDAuMywwLjIsMC40YzAuMSwwLjEsMC4yLDAuMiwwLjQsMC4yYzAuMSwwLDAuMy0wLjEsMC40LTAuMkMxNy45LDYuNSwxOCw2LjMsMTgsNi4yVjAuNnoiLz4KPC9zdmc+Cg==);

#pqeaFilterApp {
    h2 {
        margin-top: 0;
    }

    a,
    button,
    .button,
    select,
    .select,
    label,
    input,
    span,
    p {
        font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
    }

    button,
    select {
        min-width: $default_button_min_width;
        min-height: $default_interactable_min_height;
        padding: $default_button_padding_vert $default_button_padding_horz;
        font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
        font-weight: bold;
        border: none;
        box-shadow: none;
    }

    button {
        color: $scorpiongrey;
        background-color: $vehiclegrey;
        transition: all $default_transition_timing_fn $default_transition_duration;

        &:not([disabled]) {
            background-color: $bahamablue;
            color: $white;
            outline: $default_outline_offset solid transparent;
            outline-offset: $default_outline_offset;
            cursor: pointer;

            &:hover,
            &:focus {
                background-color: darken($bahamablue, 7.5%);
                transition: all $default_transition_timing_fn $default_transition_duration;
                outline: $default_outline_offset solid darken($bondiblue, 7.5%);
            }
        }

        &.clear-filters {
            margin-bottom: 1rem;

            @media (min-width: $breakpoint-md) {
                margin-bottom: 0;
            }
        }
    }

    p {
        display: block;
        width: 100%;
        &.no-results {
            text-align: center;
        }
    }

    .custom-select {
        display: inline-block;
        position: relative;
        width: 100%;
        max-width: 100%;
        // margin-bottom: 1rem;
        margin-bottom: 0;

        @media (min-width: $breakpoint-sm) {
            width: auto;
            margin-right: 0.5rem;
        }
        @media (min-width: $breakpoint-md) {
            // margin-bottom: 0;
        }

        &::after {
            display: block;
            content: " ";
            position: absolute;
            right: 1rem;
            top: 25%;
            transform: rotateZ(45deg);
            transform-origin: center;
            border-color: rgba(var(--secondary-brand-rgb), 1);
            border-bottom-style: solid;
            border-bottom-width: #{calc(3/16)}rem;
            border-right-style: solid;
            border-right-width: #{calc(3/16)}rem;
            height: #{calc(7/16)}rem;
            width: #{calc(7/16)}rem;
            pointer-events: none;
        }

        &.is-active {
            &::after {
                transform: rotate(225deg);
            }
        }

        .select {
            display: block;
            height: 100%;
            width: 100%;
            position: relative;
            margin-bottom: 0.5rem;
            padding: $default_button_padding_vert 3rem $default_button_padding_vert $default_button_padding_horz;
            width: 100%;
            max-width: 100%;
            text-align: left;
            font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            line-height: 1.2;
            background-color: #eceef0;
            color: $bahamablue;
            -moz-appearance:none;
            -webkit-appearance:none;
            appearance:none;
            cursor: pointer;

            @media (min-width: $breakpoint-sm) {
                width: auto;
            }
            @media (prefers-color-scheme: dark) {
                background-color: #eceef0;
                color: $bahamablue;
            }
        }
    }

    .external {
        &::after {
            content: $external-link-icon-dark !important;
            display: inline-block;
            width: 1rem;
            margin-left: 0.5rem;
        }
    }

    .pqeasFilterControls {
        margin-bottom: 1rem;
    }

    .pqeas-filter {
        &__pagination {
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            align-items: flex-start;
            justify-content: flex-start;
            margin: 0 0 1rem;
            padding: 0;

            @media (min-width: $breakpoint-sm) {
                flex-direction: row;
                align-items: center;
            }

            &--top {
                margin-bottom: 1rem;
            }

            &--bottom {
                margin-top: 1rem;
            }

            .current-page,
            .total-pages,
            .filtered-pqeas,
            .paginated-pqeas {
                display: inline-block;
                transform: scale(1.0);
                transition: transform linear $default_transition_duration;
                transform-origin: center;
                &.is-updating {
                    transform: scale(1.35);
                    transition: transform linear $default_transition_duration;
                    transform-origin: center;
                }
            }

            .pages,
            .totals {
                padding: $default_button_padding_vert 0;
            }

            .pages {
                margin: 0.5rem 0;

                @media (min-width: $breakpoint-sm) {
                    margin: 0 1rem;
                }
            }

            .totals {
                margin-top: 1rem;

                @media (min-width: $breakpoint-sm) {
                    margin-top: 0;
                    margin-left: 1rem;
                }
            }
        }
    }

    .pqeasResults {
        width: 100%;
        table-layout: fixed;
        border-spacing: 0;

        address {
            font-style: normal;
        }

        thead,
        tbody {
            width: 100%;
        }

        th,
        td {
            vertical-align: top;
            padding: $default_table_cell_padding_mobile_vert $default_table_cell_padding_mobile_horz;
            width: 100%;

            @media (min-width: $breakpoint-sm) {
                padding: $default_table_cell_padding_desktop_vert $default_table_cell_padding_desktop_horz;
                width: auto;
            }
        }

        th {
            font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            text-align: left;
            background-color: $bahamablue;
            color: white;

            @media (max-width: $breakpoint-sm) {
                border: none;
                clip: rect(0 0 0 0);
                height: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                position: absolute;
                width: 1px;
            }

            &.odd,
            &.even {
                background-color: $bahamablue;
            }
        }

        td,
        tr {
            @media (max-width: $breakpoint-sm) {
                display: block;
            }
        }

        tr {
            width: 100%;
        }

        td {
            font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            word-wrap: break-word;

            &::before {
                content: attr(data-label);
                font-size: 1.125rem;
                font-weight: bold;
                color: $bahamablue;

                @media (min-width: $breakpoint-sm) {
                    content: none;
                }
            }

            a,
            p,
            ul {
                display: block;
                margin-top: 0;
                padding-inline-start: 0;
                font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);

            }
            li {
                list-style-type: none;
                font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            }
        }
        .col {
            width: 100%;
            column-span: all;

            @media (max-width: $breakpoint-sm) {
                display: block;
            }
            @media (min-width: $breakpoint-sm) {
                width: 20%;
                column-span: 1;
            }
            &--pqea__company-and-location {
                @media (min-width: $breakpoint-md) {
                    width: 25%;
                }
            }
            &--pqea__contact-name {
                @media (min-width: $breakpoint-md) {
                    width: 15%;
                }
            }
            &--pqea__service-organizations {
                @media (min-width: $breakpoint-md) {
                    width: 25%;
                }
            }
            &--pqea__services {
                @media (min-width: $breakpoint-md) {
                    width: 15%;
                }
            }
        }
        .even { background-color: $white; }
        .odd { background-color: $gallerygray; }
        .no-results {
            width: 100%;
            text-align: center;
        }
    }
    .pqea {
        &__company-and-location,
        &__email-and-phone,
        &__service-organizations {
            > * {
                display: block;
            }
        }

        &__service {
            display: inline-block;
        }
        &__service-areas,
        &__service-organizations {
            ul {
                margin-top: 0;
                margin-bottom: 0;
            }
        }

        td {
            p {
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }

    .is-loading {
        text-align: center;

        p {
            margin-bottom: 0;
        }
    }
}
</style>