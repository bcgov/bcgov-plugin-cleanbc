<template>
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Contractor Listings</h2>
    <!-- Filter Controls -->
    <div class="contractorsFilterControls" id="contractorsFilterControls">
        <!-- Type Select -->
        <label for="typeSelect" class="sr-only">Choose a type of upgrade</label>
        <div class="custom-select">
            <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="typeSelect" class="select select--type" v-model="selectedUpgradeType" :required="true" data-active="false">
                <option value="all">All Upgrade Types</option>
                <option v-for="(type, index) in types" :key="type" :value="type">{{ type }}</option>
            </select>
        </div>

        <!-- Type Select -->
        <label for="programSelect" class="sr-only">Choose a rebate program</label>
        <div class="custom-select">
            <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="programSelect" class="select select--program" v-model="selectedProgram" :required="true" data-active="false">
                <option value="all">All Programs</option>
                <option v-for="(program, index) in programs" :key="program" :value="program">{{ program }}</option>
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
        <div class="contractorsFilterPagination contractors-filter__pagination contractors-filter__pagination--top">
            <!-- Previous Page Button -->
            <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
            <!-- Current Page & Totals -->
            <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            <!-- Next Page Button -->
            <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>

            <!-- Results Information -->
            <div class="totals">
                Showing <span class="results-count"><span class="numValue paginated-contractors">{{paginatedContractors.length }}</span> of <span class="numValue filtered-contractors">{{ filteredContractors.length }}</span></span> registered contractors
            </div>

            <span class="sr-status sr-only">
                <span class="results-count" role="status" aria-live="polite">Showing <span class="numValue paginated-contractors">{{paginatedContractors.length }}</span> of <span class="numValue filtered-contractors">{{ filteredContractors.length }}</span> registered contractors {{ currentTypeFilterMessage }} {{ currentLocationFilterMessage }}</span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>
        </div>
    </div>

    <!-- Contractors Results Table -->
    <table id="contractorsResults" class="contractorsResults table table--striped">
        <caption class="sr-only">Registered Contractors</caption>
        <!-- Table Columns -->
        <colgroup>
            <col class="col col--1 odd col--contractor__company-and-location"/>
            <col class="col col--2 even col--contractor__head-office"/>
            <col class="col col--3 odd col--contractor__email-and-phone"/>
            <col class="col col--4 even col--contractor__upgrade-types"/>
            <col class="col col--5 odd col--contractor__program-designations"/>
        </colgroup>
        <!-- Table Header -->
        <thead>
            <tr>
                <th class="contractor-heading odd contractor-heading--company-and-location">Company Name</th>
                <th class="contractor-heading even contractor-heading--contact-name">Head Office</th>
                <th class="contractor-heading odd contractor-heading--email-and-phone">Email & Phone</th>
                <th class="contractor-heading even contractor-heading--service-organizations">Upgrade Type(s)</th>
                <th class="contractor-heading odd contractor-heading--services">Rebate Program(s)</th>
            </tr>
        </thead>

        <!-- Table Body -->
        <tbody :class="`page page--${currentPage}`">
            <!-- No Results Message -->
            <tr v-if="filteredContractors.length === 0 && !isLoading" class="no-results">
                <td colspan="100%">
                    <p class="no-results" aria-live="polite">Sorry, no results found.</p>
                </td>
            </tr>

            <!-- Loading Message -->
            <tr v-if="isLoading" class="is-loading" aria-live="polite">
                <td colspan="100%">
                    <p class="no-results loading">Retrieving list of registered contractors, please wait...</p>
                </td>
            </tr>

            <!-- Results Loop -->
            <template v-if="contractors.length > 0" v-for="(contractor, index) in paginatedContractors" :key="index">
                <tr :class="`contractor result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`" tabindex="0">
                    <!-- Company Name and Head Office -->
                    <td data-label="Company Name and Head Office" class="contractor__company-and-location">
                        <!-- Company Website Link -->
                        <a v-if="contractor.company_website" class="contractor__company external" :href="contractor.company_website" target="_blank" :title="contractor.company_name + ' website, opens in a new tab/window.'">
                            {{ contractor.company_name ? contractor.company_name : 'Website' }}
                        </a>
                        <!-- Company Name if No Website -->
                        <span v-else class="contractor__company">
                            {{ contractor.company_name ? contractor.company_name : 'No company name provided' }}
                        </span>
                    </td>

                    <!-- Company Location -->
                    <td data-label="Head Office" class="contractor__head-office">
                        <p>{{ contractor.head_office_location ? contractor.head_office_location : 'Not provided' }}</p>
                    </td>

                    <!-- Contact Email and Phone -->
                    <td data-label="Contact Email and Phone" class="contractor__email-and-phone">
                        <address>
                            <!-- Email Link -->
                            <a v-if="contractor.email" class="contractor__email" :href="'mailto:' + contractor.email">{{ contractor.email }}</a>
                            <p class="contractor__email" v-else>No email provided</p>

                            <!-- Phone Link -->
                            <a v-if="contractor.phone" class="contractor__telephone" :href="'tel:+1' + contractor.phone.replace(/-/g, '')">{{ contractor.phone }}</a>
                            <p class="contractor__telephone" v-else>No phone number provided</p>
                        </address>
                    </td>

                    <!-- Business Types -->
                    <td data-label="Business Type(s)" class="contractor__upgrade-types">
                        <ul v-if="contractor.types">
                            <li v-for="(type, index) in contractor.types">{{ type.name }}</li>
                        </ul>
                    </td>

                    <!-- Program Designations -->
                    <td data-label="Program Designations" class="contractor__program-designations">
                        <ul v-if="contractor.program_designations">
                            <li v-for="(designation, index) in contractor.program_designations">{{ designation.name }}</li>
                        </ul>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>

    <!-- Pagination Controls (Bottom) -->
    <div class="contractorsFilterPagination contractors-filter__pagination contractors-filter__pagination--bottom">
        <!-- Previous Page Button -->
        <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
        <!-- Current Page & Totals -->
        <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
        <!-- Next Page Button -->
        <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>

        <!-- Results Information -->
        <div class="totals">
            Showing <span class="results-count"><span class="numValue paginated-contractors">{{paginatedContractors.length }}</span> of <span class="numValue filtered-contractors">{{ filteredContractors.length }}</span></span> Contractors
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
 * Ref for storing an array of Contractors (Program Qualified Contractors).
 *
 * @type {Ref<Array>} - A reference to an array containing Contractors.
 */
const contractors = ref([]);

/**
 * Ref for the default selected type.
 *
 * @type {Ref<String>} - A reference to the default selected type.
 */
const defaultSelectedUpgradeType = ref('all');

/**
 * Ref for the currently selected upgrade type.
 *
 * @type {Ref<String>} - A reference to the currently selected upgrade type.
 */
const selectedUpgradeType = ref('all');

/**
 * Ref for the default selected program.
 *
 * @type {Ref<String>} - A reference to the default selected program.
 */
const defaultSelectedProgram = ref('all');

/**
 * Ref for the currently selected program.
 *
 * @type {Ref<String>} - A reference to the currently selected program.
 */
const selectedProgram = ref('all');

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
    'pqeasData',
    'pqeasTimestamp',
    'rebatesData',
    'rebatesTimestamp',
]);

const oldPaginatedContractorsCount = ref(0);
const oldFilteredContractorsCount = ref(0);

/**
 * Ref for storing the public domain URL.
 *
 * @type {Ref<String>} - A reference to the public domain URL.
 */
const publicDomain = ref('https://betterhomes.gov.bc.ca');

/**
 * Variable for constructing the API URL for fetching Contractors.
 *
 * @type {String} - The constructed API URL for fetching Contractors.
 */
const contractorsAPI = `${window.site?.domain ? window.site.domain : publicDomain}/wp-json/custom/v1/contractors`;

/**
 * Computed property to extract unique EA Project Types (ea-project-types) from Contractors.
 * Iterates through the Contractors to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique EA Project Types sorted alphabetically.
 */
const types = computed(() => {
    const uniqueTypes = new Set();

    // Iterate through Contractors to collect distinct project type names.
    contractors.value.forEach(contractor => {
        if (contractor.types) {
            if (typeof contractor.types === 'string') {
                uniqueTypes.add(contractor.types.name);
            } else if (Array.isArray(contractor.types)) {
                contractor.types.forEach(type => {
                    uniqueTypes.add(type.name);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedTypes = Array.from(uniqueTypes).sort((a, b) => a.localeCompare(b));
    return [...sortedTypes];
});

/**
 * Computed property to extract unique EA Rebate Programs (ea-project-types) from Contractors.
 * Iterates through the Contractors to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique EA Project Types sorted alphabetically.
 */
const programs = computed(() => {
    const uniquePrograms = new Set();

    // Iterate through Contractors to collect distinct project type names.
    contractors.value.forEach(contractor => {
        if (contractor.program_designations) {
            if (typeof contractor.program_designations === 'string') {
                uniquePrograms.add(contractor.program_designations.name);
            } else if (Array.isArray(contractor.program_designations)) {
                contractor.program_designations.forEach(program => {
                    uniquePrograms.add(program.name);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedPrograms = Array.from(uniquePrograms).sort((a, b) => a.localeCompare(b));
    return [...sortedPrograms];
});

/**
 * Computed property to extract unique EA Locations (ea-locations) from Contractors.
 * Iterates through the Contractors to collect distinct location names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique EA Locations sorted alphabetically.
 */
const locations = computed(() => {
    const uniqueLocations = new Set();

    // Iterate through Contractors to collect distinct location names.
    contractors.value.forEach(contractor => {
        if (contractor.locations) {
            if (typeof contractor.locations === 'string') {
                uniqueLocations.add(contractor.locations.name);
            } else if (Array.isArray(contractor.locations)) {
                contractor.locations.forEach(location => {
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
 * Computed property to handle filtering Contractors (Program Qualified Contractors) by type and/or location.
 *
 * Uses the selected location to filter Contractors based on location and incorporates the results from type filtering.
 *
 * @type {Array} - An array containing the filtered Contractors based on selected type and/or location.
 */
const filteredContractors = computed(() => {
    const selectedLoc = selectedLocation.value;
    const selectedProg = selectedProgram.value;

    let filteredContractors = [...filteredContractorsByType.value];

    // Filter by location if 'all' is not selected.
    if ('all' !== selectedLoc) {
        filteredContractors = filteredContractors.filter(contractor => contractor.locations && contractor.locations.some(location => location.name === selectedLoc) );
    }
    // Filter by rebate program if 'all' is not selected.
    if ('all' !== selectedProg) {
        filteredContractors = filteredContractors.filter(contractor => contractor.program_designations && contractor.program_designations.some(program => program.name === selectedProg) );
    }

    // handleUpdatingAnimationClass(".contractors-filter__pagination .totals");

    return filteredContractors;
});

// Define a computed property to filter contractors based on the selected type
const filteredContractorsByType = computed(() => {
    const selectedType = selectedUpgradeType.value;

    currentPage.value = 1;

    if (selectedType === 'all') {
        return contractors.value;
    } else {
        return contractors.value.filter(contractor => contractor.types && contractor.types.some(type => type.name === selectedType) );
    }

    return contractors.value;
});

// Define a computed property to filter contractors based on the selected rebate program
const filteredContractorsByProgram = computed(() => {
    const selectedProg = selectedProgram.value;

    currentPage.value = 1;

    if (selectedProg === 'all') {
        return contractors.value;
    } else {
        return contractors.value.filter(contractor => contractor.program_designations && contractor.program_designations.some(type => type.name === selectedProg) );
    }

    return contractors.value;
});

/**
 * Computed property to calculate the total number of pages for paginated Contractors (Program Qualified Contractors).
 *
 * Uses the length of filtered Contractors and the page size to determine the total number of pages.
 *
 * @type {number} - The total number of pages for paginated Contractors.
 */
const totalPages = computed(() => {
    const totalContractors = filteredContractors.value.length;
    return totalContractors > 0 ? Math.ceil(totalContractors / pageSize.value) : 1;
});

/**
 * Computed property to calculate the paginated Contractors (Program Qualified Contractors).
 *
 * Uses the current page and page size to determine the slice of filtered Contractors to display.
 *
 * @type {Array} - An array containing the paginated Contractors for the current page.
 */
const paginatedContractors = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredContractors.value.slice(start, end);
});

/**
 * Function to navigate to the previous page in paginated results.
 *
 * Decrements the current page if it is greater than 1.
 *
 * @returns {number|null} - The updated current page value or null if already on the first page.
 */
const prevPage = () => {
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
    return currentPage.value < totalPages.value ? currentPage.value++ : null;
};

/**
 * Computed property for generating a filter results message based on the selected type.
 * Indicates whether the selected type is the default, and provides a message accordingly.
 *
 * @type {String} - A string indicating the filter results message based on the selected type.
 */
const currentTypeFilterMessage = computed(() => {
    return defaultSelectedUpgradeType.value === selectedUpgradeType.value ? ' no upgrade type selected.' : ' specializing in ' + selectedUpgradeType.value.toLowerCase() + ' upgrades';
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
 * scrolls smoothly to the types filter container, and checks for external links.
 *
 * @returns {void}
 */
const clearFilters = () => {
    resetSelectsActiveState();

    selectedUpgradeType.value = defaultSelectedUpgradeType.value;
    selectedLocation.value = defaultSelectedLocation.value;
    selectedProgram.value = defaultSelectedProgram.value;

    history.replaceState(selectedUpgradeType.value, defaultSelectedUpgradeType.value);
    history.replaceState(selectedLocation.value, defaultSelectedLocation.value);
    history.replaceState(selectedProgram.value, defaultSelectedProgram.value);

    currentPage.value !== 1 ? handleUpdatingAnimationClass(".contractors-filter__pagination .pages") : null;
    currentPage.value = 1;
};

const resetSelectsActiveState = () => {
    let activeSelects = document.querySelectorAll('#contractorFilterApp .custom-select.is-active');

    1 <= activeSelects.length ? activeSelects.forEach((item) => { item.classList.remove('is-active') }) : null;
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
 * Checks if the DOM (Document Object Model) is fully loaded and interactive.
 *
 * @returns {boolean} - True if the DOM is fully loaded or interactive, otherwise false.
 */
const isDOMReady = () => {
    return document.readyState === 'complete' || document.readyState === 'interactive';
};

/**
 * Fetches contractor data either from sessionStorage cache (if available and not expired) or from the WordPress API.
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
        const cachedData = sessionStorage.getItem('contractorsData');
        const cachedTimestamp = sessionStorage.getItem('contractorsTimestamp');
        if (cachedData && cachedTimestamp) {
            const timeElapsed = Date.now() - parseInt(cachedTimestamp);
            const hoursElapsed = timeElapsed / (1000 * 60 * 60);
            if (hoursElapsed < 24) {
                // Data exists in cache and it's not expired.
                contractors.value = JSON.parse(cachedData);
                showLoadingMessage.value = false;
                // Set loading state to false after data is fetched.
                isLoading.value = false;
                return;
            }
        }

        // Fetch data from API
        fetch(contractorsAPI, { cache: 'no-store' })
            .then((r) => r.json())
            .then((json) => {
                // Purge old data from sessionStorage to make sure we don't
                // exceed storage limits.
                setTimeout(itemsToClearFromSessionStorage.value.forEach((item) => {
                    sessionStorage.removeItem(item);
                }), 1000);

                // Store data in sessionStorage.
                sessionStorage.setItem('contractorsData', JSON.stringify(json));
                sessionStorage.setItem('contractorsTimestamp', Date.now());
                contractors.value = json;
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

/**
 * Watchers
 * https://vuejs.org/guide/essentials/watchers.html
 */

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

watch(paginatedContractors, () => {
    // Avoid firing animation when number value is the same.
    if ( oldPaginatedContractorsCount.value !== paginatedContractors.value.length ) {
        oldPaginatedContractorsCount.value = paginatedContractors.value.length;
        handleUpdatingAnimationClass(".contractors-filter__pagination .paginated-contractors");
    }
});
watch(filteredContractors, () => {
        // Avoid firing animation when number value is the same.
    if ( oldFilteredContractorsCount.value !== filteredContractors.value.length ) {
        oldFilteredContractorsCount.value = filteredContractors.value.length;
        handleUpdatingAnimationClass(".contractors-filter__pagination .filtered-contractors");
    }
});

watch(currentPage, () => {
    handleUpdatingAnimationClass(".contractors-filter__pagination .current-page");
});
watch(totalPages, () => {
    handleUpdatingAnimationClass(".contractors-filter__pagination .total-pages");
});
watch(isLoading, (e) => {
    console.log('isLoading');
    console.log(e);
});

/**
 * Watcher for changes in selectedUpgradeType and selectedLocation.
 * Resets the currentPage to 1 whenever either of the watched properties changes.
 *
 * @param {Array} dependencies - An array of reactive properties to watch.
 * @param {Function} callback - The callback function to execute when any of the watched properties change.
 * @returns {void}
 */
watch([selectedUpgradeType, selectedProgram, selectedLocation], () => {
    currentPage.value = 1;
    // console.log(filteredContractors.value);
});

window.addEventListener("click", (event) => {
    !event.target.closest('.custom-select.is-active') ? resetSelectsActiveState() : null;
});

/**
 * Lifecycle Hooks
 * https://vuejs.org/api/composition-api-lifecycle
 */

/**
 * A Vue lifecycle hook that is called after the instance has been mounted.
 * It retrieves various attributes from the 'postFilterApp' element and assigns them to reactive properties.
 * It also shows a loading message, fetches data, and then handles the URL hash.
 *
 * @returns {void}
 */
onMounted(() => {
    fetchData();

    const appElement = document.getElementById('contractorFilterApp');
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

#contractorFilterApp {
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
            // width: auto;
            // margin-right: 1rem;
        }
        @media (min-width: $breakpoint-md) {
            // margin-bottom: 0;
        }

        &::after {
            display: block;
            content: " ";
            position: absolute;
            right: 1rem;
            top: calc(50% - 0.6rem);
            transform: translateY(-50%) rotate(45deg);
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
                transform: translateY(-50%) rotate(225deg);
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

    .contractorsFilterControls {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: flex-start;
        margin-bottom: 1rem;

        @media (min-width: $breakpoint-sm) {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
        }

        .custom-select {
            flex: 0 0 100%;
            width: 100%;

            @media (min-width: $breakpoint-sm) {
                flex: 0 0 calc(50% - 0.25rem);
            }

            select {
                width: 100%;
            }
        }

        .clear-filters {
            @media (min-width: $breakpoint-sm) {
                margin-left: 0.5rem;
                margin-right: auto;
            }
        }
    }

    .contractors-filter {
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
            .filtered-contractors,
            .paginated-contractors {
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
                min-width: 6rem;
                margin: 0.5rem auto 0.5rem 0;

                @media (min-width: $breakpoint-sm) {
                    margin: 0 1rem;
                }
            }

            .totals {
                margin-top: 1rem;
                transform: scale(1.0);
                transition: transform linear $default_transition_duration;
                transform-origin: center;

                &.is-updating {
                    transform: scale(1.125);
                    transition: transform linear $default_transition_duration;
                    transform-origin: center;
                }

                @media (min-width: $breakpoint-sm) {
                    margin-top: 0;
                    margin-left: 1rem;
                }
            }
        }
    }

    .contractorsResults {
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
                font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            }
            ul {
                padding-inline-start: 1rem;
            }
            li {
                // list-style-type: none;
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
            &--contractor {
                &__company-and-location,
                &__email-and-phone {
                    @media (min-width: $breakpoint-md) {
                        width: 25%;
                    }
                }
                &__head-office,
                &__upgrade-types {
                    @media (min-width: $breakpoint-md) {
                        width: 15%;
                    }
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
    .contractor {
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