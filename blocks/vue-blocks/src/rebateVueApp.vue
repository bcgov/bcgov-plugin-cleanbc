<template>
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Rebate Listings</h2>
    <!-- Filter Controls -->
    <div class="rebatesFilterControls" id="rebatesFilterControls">
        <!-- Build Type Select -->
        <div class="control">
            <label for="typeSelect" class="">Choose a type of upgrade</label>
            <div class="custom-select">
                <select id="typeSelect"
                    class="select select--type"
                    @change="selectIsActive"
                    @click.prevent="selectIsActive"
                    @touchend="selectIsActive"
                    @keyup.esc="selectIsActive"
                    tabindex="0"
                    v-model="selectedBuildType"
                    required="true">
                    <option value="all">All Project Types</option>
                    <option v-for="(type, index) in types" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
        </div>

        <!-- Location Select -->
        <div class="control">
            <label for="locationSelect" class="">Choose a service region</label>
            <div class="custom-select">
                <select id="locationSelect"
                    class="select select--location"
                    @change="selectIsActive"
                    @click.prevent="selectIsActive"
                    @touchend="selectIsActive"
                    @keyup.esc="selectIsActive"
                    tabindex="0"
                    v-model="selectedLocation"
                    required="true">
                    <option value="all">All Locations</option>
                    <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
                </select>
            </div>
        </div>

        <!-- Primary Heating System Select -->
        <div class="control">
            <label for="systemSelect" class="">Choose your current, primary heating system</label>
            <div class="custom-select">
                <select id="systemSelect" class="select select--system"
                    @change="selectIsActive"
                    @click.prevent="selectIsActive"
                    @touchend="selectIsActive"
                    @keyup.esc="selectIsActive"
                    tabindex="0"
                    v-model="selectedHeatingSystem"
                    required="true">
                    <option value="all">All Heating Systems</option>
                    <option v-if="!isLoading" v-for="(system, index) in systems" :key="system" :style="'Not sure, view all rebates' == system ? 'display: none;' : null" :value="system">{{ system }}</option>
                </select>
            </div>
        </div>

        <!-- Clear Filters Button -->
        <button class="clear-filters" @click.prevent="clearFilters"
            @touchend="clearFilters"
            @keydown.enter.prevent="clearFilters"
            type="button">
            Reset selection
        </button>

        <!-- Pagination Controls (Top) -->
        <div class="rebatesFilterPagination rebates-filter__pagination rebates-filter__pagination--top">
            <!-- Previous Page Button -->
            <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
            <!-- Current Page & Totals -->
            <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            <!-- Next Page Button -->
            <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>

            <!-- Results Information -->
            <span class="totals">
                Showing <span class="results-count"><span class="numValue paginated-rebates">{{paginatedRebates.length }}</span> of <span class="numValue filtered-rebates">{{ filteredRebates.length }}</span></span> Rebates
            </span>

            <span class="sr-status sr-only">
                <span class="results-count" role="status" aria-live="polite">
                    Showing <span class="numValue paginated-rebates">{{paginatedRebates.length }}</span> of <span class="numValue filtered-rebates">{{ filteredRebates.length }}</span> Rebates.  {{ currentTypeFilterMessage }} {{ currentLocationFilterMessage }}
                </span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>
        </div>
    </div>

    <div id="rebatesTool" class="rebatesTool">
        <div class="rebatesSidebar" role="complementary">
            <div v-if="!is_Loading" class="help-text">
                <p>Click to filter (multi-select).  Items that have ANY selected filter value will be displayed.</p>
                <p>If no filters are applied, all results will be shown.</p>
            </div>
            <!-- Upgrade Type Filter -->
            <div v-if="!isLoading && upgrades" class="filter filter--upgrade-types">
                <h2>Upgrade Types</h2>
                <div class="filter-container filter__list">
                    <div :class="`checkbox checkbox--all ${isCheckedClass}`">
                        <input id="upgradeTypeAll"
                            class="sr-only"
                            type="checkbox"
                            name="all"
                            value="all"
                            :aria-checked="selectedUpgradeTypes.length ? false : true"
                            :checked="selectedUpgradeTypes.length ? false : true"
                            @click="handleSelectAllCheckboxFilter"
                        >
                        <label for="upgradeTypeAll">All Upgrade Types</label>
                    </div>
                    <div v-for="(upgrade, index) in upgrades" :key="index" :class="`checkbox checkbox--${upgrade.toLowerCase().replace(/ /g,'_')}`">
                        <input :id="upgrade.toLowerCase().replace(/ /g,'_')"
                            class="sr-only"
                            type="checkbox"
                            v-model="selectedUpgradeTypes"
                            :name="upgrade"
                            :value="upgrade"
                            :aria-checked="selectedUpgradeTypes.includes(upgrade) ? true : false"
                            :checked="selectedUpgradeTypes.includes(upgrade) ? true : false"
                            @click="handleCheckboxFilterStylingClass"
                            @touchend="handleCheckboxFilterStylingClass">
                        <label :for="upgrade.toLowerCase().replace(/ /g,'_')">{{ upgrade }}</label>
                    </div>
                </div>
            </div>
            <!-- Offers Filter -->
            <div v-if="!isLoading && offers" class="filter filter--other-offers">
                <h2>Other Offers</h2>
                <div class="filter-container filter__list">
                    <div :class="`checkbox checkbox--all ${isCheckedClass}`">
                        <input id="offerTypeAll"
                            class="sr-only"
                            type="checkbox"
                            name="all"
                            value="all"
                            :aria-checked="selectedOtherOffers.length ? false : true"
                            :checked="selectedOtherOffers.length ? false : true"
                            @click="handleSelectAllCheckboxFilter"
                            @touchend="handleSelectAllCheckboxFilter">
                        <label for="offerTypeAll">All Offers</label>
                    </div>
                    <div v-for="(offer, index) in offers" :key="index" :class="`checkbox checkbox--${offer.toLowerCase().replace(/ /g,'_')}`">
                        <input :id="offer.toLowerCase().replace(/ /g,'_')"
                            class="sr-only"
                            type="checkbox"
                            v-model="selectedOtherOffers"
                            :name="offer"
                            :value="offer"
                            :aria-checked="selectedOtherOffers.includes(offer) ? true : false"
                            :checked="selectedOtherOffers.includes(offer) ? true : false"
                            @click="handleCheckboxFilterStylingClass"
                            @touchend="handleCheckboxFilterStylingClass">
                        <label :for="offer.toLowerCase().replace(/ /g,'_')">{{ offer }}</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rebates Results Grid -->
        <div id="rebatesResults" class="rebatesResults">
            <div :class="`page page--${currentPage}`">
                <!-- No Results Message -->
                <div v-if="filteredRebates.length === 0 && !isLoading" class="no-results">
                    <div>
                        <p class="no-results" aria-live="polite">Sorry, no results found.</p>
                    </div>
                </div>

                <!-- Loading Message -->
                <p v-if="isLoading" class="no-results loading" aria-live="polite">Retrieving list of Rebates, please wait...</p>

                <!-- Results Loop -->
                <template v-if="rebates.length > 0 && !isLoading" v-for="(rebate, index) in paginatedRebates" :key="index">
                    <article :class="`rebate result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`" tabindex="0">
                        <div class="rebate__title"><h3 v-html="rebate.title"></h3></div>
                        <div :class=rebateAmountClasses(rebate.rebate_amount)><p>{{ rebate.rebate_amount }}</p></div>
                        <div class="rebate__short-description"><p v-html="rebate.short_description"></p></div>
                        <div class="rebate__learn-more">
                            <a :href="rebate.post_url" class="button" :title="rebate.title + ' learn more'">Learn more</a>
                        </div>
                    </article>
                </template>
            </div>
        </div>
    </div>

    <!-- Pagination Controls (Bottom) -->
    <div class="rebatesFilterPagination rebates-filter__pagination rebates-filter__pagination--bottom">
        <!-- Previous Page Button -->
        <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
        <!-- Current Page & Totals -->
        <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
        <!-- Next Page Button -->
        <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>
        <!-- Clear Filters Button -->
        <button class="clear-filters" @click.prevent="clearFilters"
            @touchend="clearFilters"
            @keydown.enter.prevent="clearFilters"
            type="button">
            Reset selection
        </button>

        <!-- Results Information -->
        <div class="totals">
            Showing <span class="results-count"><span class="numValue paginated-rebates">{{paginatedRebates.length }}</span> of <span class="numValue filtered-rebates">{{ filteredRebates.length }}</span></span> Rebates
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
 * Ref for storing an array of Rebates (incentives).
 *
 * @type {Ref<Array>} - A reference to an array containing Rebates.
 */
const rebates = ref([]);

/**
 * Refs to store the previous paginated/filtered Rebates count for
 * comparison purposes when determining which elements of the controls
 * to animate (have changed).
 *
 * @type {Ref<Number>} - References for storing the paginated/filtered Rebates count (integer).
 */
const oldPaginatedRebatesCount = ref(0);
const oldFilteredRebatesCount = ref(0);

/**
 * Ref for the default selected build type (building-types), heating system (primary-space-heating),
 * and location (regions).
 *
 * @type {Ref<String>} - A reference to the default selected build type (building-types),
 * heating system (primary-space-heating), and location (regions).
 */
const defaultSelectedBuildType = ref('all');
const defaultSelectedHeatingSystem = ref('all');
const defaultSelectedLocation = ref('all');

/**
 * Ref for the currently selected build type (building-types), heating system (primary-space-heating),
 * and location (regions).
 *
 * @type {Ref<String>} - A reference to the currently selected  build type (building-types),
 * heating system (primary-space-heating), and location (regions).
 */
const selectedBuildType = ref('all');
const selectedHeatingSystem = ref('all');
const selectedLocation = ref('all');

/**
 * Refs for the currently selected Offers (other-offer) and Upgrade Types (upgrades) terms.
 *
 * @type {Ref<Array>} - References to arrays for Offers (other-offer) and Upgrade Types (upgrades).
 */
const selectedOtherOffers = ref([]);
const selectedUpgradeTypes = ref([]);

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
 * Refs for storing the CSS class name for active state, updating state, and checked (checkbox) state.
 *
 * @type {Ref<String>} - A reference to the CSS class name for an active state.
 */
const activeClass = ref('is-active');
const updatingClass = ref('is-updating');
const isCheckedClass = ref('is-checked');

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

/**
 * Ref for storing the sessionStorage keys for JSON objects to be
 * purged.  This prevents overrunning the sessionStorage max.
 *
 * @type {Ref<Array>} - A reference to an array of sessionStorage keys to empty.
 */
const itemsToClearFromSessionStorage = ref([
    'contractorsData',
    'contractorsTimestamp',
    'pqeasData',
    'pqeasTimestamp',
]);

/**
 * Ref for storing the public domain URL.
 *
 * @type {Ref<String>} - A reference to the public domain URL.
 */
const publicDomain = ref('https://betterhomes.gov.bc.ca');

/**
 * Variable for constructing the API URL for fetching Rebates.
 *
 * @type {String} - The constructed API URL for fetching Rebates.
 */
const rebatesAPI = `${window.site?.domain ? window.site.domain : publicDomain}/wp-json/custom/v1/rebates`;

/**
 * Computed property to handle filtering Rebates (Rebates) by category and/or location.
 *
 * Uses the selected location to filter Rebates based on location and incorporates the results from category filtering.
 *
 * @type {Array} - An array containing the filtered Rebates based on selected taxonomy terms.
 */
const filteredRebates = computed(() => {
    const selectedLoc = selectedLocation.value;
    const selectedUpgrades = selectedUpgradeTypes.value;
    const selectedBuild = selectedBuildType.value;
    const selectedSystem = selectedHeatingSystem.value;
    const selectedOffers = selectedOtherOffers.value;

    // let filteredRebates = [...filteredRebatesByUpgradeType.value];
    let filteredRebates = [...rebates.value];

    // Filter by location if 'all' is not selected.
    if ('all' !== selectedLoc) {
        filteredRebates = filteredRebates.filter( rebate => rebate.locations && rebate.locations.some(location => location.name === selectedLoc) );
    }
    if ('all' !== selectedBuild) {
        filteredRebates = filteredRebates.filter( rebate => rebate.types && rebate.types.some(type => type.name === selectedBuild) );
    }
    if ( selectedUpgrades.length ) {
        filteredRebates = [...filteredRebatesByUpgradeType.value]
    }
    if ('all' !== selectedSystem) {
        filteredRebates = filteredRebates.filter( rebate => rebate.primary_heating_sys && rebate.primary_heating_sys.some(sys => sys.name === selectedSystem) );
    }
    if ( selectedOffers.length ) {
        // filteredRebates = filteredRebates.filter( rebate => rebate.other_offers && rebate.other_offers.some(offer => offer.name === selectedOffer) );
        filteredRebates = [...filteredRebatesByOtherOffers.value];
    }

    resetSelectsActiveState();

    return filteredRebates;
});

// Define a computed property to filter rebates based on the selected category
const filteredRebatesByUpgradeType = computed(() => {
    const selectedType = selectedUpgradeTypes.value;
    currentPage.value = 1;

    if (!selectedType.length) {
        return rebates.value;
    } else {
        return rebates.value.filter(rebate => rebate.upgrade_types && rebate.upgrade_types.some(type => selectedType.includes(type.name)));
    }
});

// Define a computed property to filter rebates based on the selected category
const filteredRebatesByOtherOffers = computed(() => {
    const selectedOffers = selectedOtherOffers.value;
    currentPage.value = 1;

    if (!selectedOffers.length) {
        return rebates.value;
    } else {
        return rebates.value.filter(rebate => rebate.other_offers && rebate.other_offers.some(offer => selectedOffers.includes(offer.name)));
    }
});

// Define a computed property to filter rebates based on the selected category
const filteredRebatesByHeatingSystem = computed(() => {
    const selectedSystem = selectedHeatingSystem.value;
    currentPage.value = 1;

    if (selectedSystem === 'all') {
        return rebates.value;
    } else {
        return rebates.value.filter(rebate => rebate.primary_heating_sys && rebate.primary_heating_sys.some(sys => sys.name === selectedSystem));
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
 * Computed property to calculate the total number of pages for paginated Rebates (Rebates).
 *
 * Uses the length of filtered Rebates and the page size to determine the total number of pages.
 *
 * @type {number} - The total number of pages for paginated Rebates.
 */
const totalPages = computed(() => {
    const totalRebates = filteredRebates.value.length;
    return totalRebates > 0 ? Math.ceil(totalRebates / pageSize.value) : 1;
});

/**
 * Computed property to calculate the paginated Rebates (Rebates).
 *
 * Uses the current page and page size to determine the slice of filtered Rebates to display.
 *
 * @type {Array} - An array containing the paginated Rebates for the current page.
 */
const paginatedRebates = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredRebates.value.slice(start, end);
});

/**
 * Function to navigate to the previous page in paginated results.
 *
 * Decrements the current page if it is greater than 1.
 *
 * @returns {number|null} - The updated current page value or null if already on the first page.
 */
const prevPage = () => {
    // handleUpdatingAnimationClass(".rebates-filter__pagination .pages");
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
    // handleUpdatingAnimationClass(".rebates-filter__pagination .pages");
    return currentPage.value < totalPages.value ? currentPage.value++ : null;
};

/**
 * Computed property to extract unique Project Types (project-types) from Contractors.
 * Iterates through the Contractors to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique Project Types sorted alphabetically.
 */
const types = computed(() => {
    const uniqueTypes = new Set();

    // Iterate through Contractors to collect distinct project type names.
    rebates.value.forEach(rebate => {
        if (rebate.types) {
            if (typeof rebate.types === 'string') {
                uniqueTypes.add(rebate.types.name);
            } else if (Array.isArray(rebate.types)) {
                rebate.types.forEach(type => {
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
 * Computed property to extract unique Project Types (project-types) from Rebates.
 * Iterates through the Rebates to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique Project Types sorted alphabetically.
 */
const upgrades = computed(() => {
    const uniqueUpgrades = new Set();

    // Iterate through Rebates to collect distinct project type names.
    rebates.value.forEach(rebate => {
        if (rebate.upgrade_types) {
            if (typeof rebate.upgrade_types === 'string') {
                uniqueUpgrades.add(rebate.upgrade_types);
            } else if (Array.isArray(rebate.upgrade_types)) {
                rebate.upgrade_types.forEach(upgrade => {
                    uniqueUpgrades.add(upgrade.name);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedUpgrades = Array.from(uniqueUpgrades).sort((a, b) => a.localeCompare(b));

    return [...sortedUpgrades];
});

/**
 * Computed property to extract unique Project Types (project-types) from Rebates.
 * Iterates through the Rebates to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique Project Types sorted alphabetically.
 */
const offers = computed(() => {
    const uniqueOffers = new Set();

    // Iterate through Rebates to collect distinct project type names.
    rebates.value.forEach(rebate => {
        if (rebate.other_offers) {
            if (typeof rebate.other_offers === 'string') {
                uniqueOffers.add(rebate.other_offers);
            } else if (Array.isArray(rebate.other_offers)) {
                rebate.other_offers.forEach(offer => {
                    uniqueOffers.add(offer.name);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedOffers = Array.from(uniqueOffers).sort((a, b) => a.localeCompare(b));

    return [...sortedOffers];
});

/**
 * Computed property to extract unique Project Types (project-types) from Rebates.
 * Iterates through the Rebates to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique Project Types sorted alphabetically.
 */
const systems = computed(() => {
    const uniqueSystems = new Set();

    // Iterate through Rebates to collect distinct project type names.
    rebates.value.forEach(rebate => {
        if (rebate.primary_heating_sys) {
            if (typeof rebate.primary_heating_sys === 'string') {
                uniqueSystems.add(rebate.primary_heating_sys);
            } else if (Array.isArray(rebate.primary_heating_sys)) {
                rebate.primary_heating_sys.forEach(upgrade => {
                    uniqueSystems.add(upgrade.name);
                });
            }
        }
    });

    // Convert Set to array and sort alphabetically.
    const sortedSystems = Array.from(uniqueSystems).sort((a, b) => a.localeCompare(b));

    return [...sortedSystems];
});

/**
 * Computed property to extract unique Locations (locations) from Rebates.
 * Iterates through the Rebates to collect distinct location names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique Locations sorted alphabetically.
 */
const locations = computed(() => {
    const uniqueLocations = new Set();

    // Iterate through Rebates to collect distinct location names.
    rebates.value.forEach(rebate => {
        if (rebate.locations) {
            if (typeof rebate.locations === 'string') {
                uniqueLocations.add(rebate.locations.name);
            } else if (Array.isArray(rebate.locations)) {
                rebate.locations.forEach(location => {
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
    const message = ref('');

    if ( selectedUpgradeTypes.value.length ) {
        message.value = 'Active upgrade type filters: ';

        selectedUpgradeTypes.value.forEach((type, index) => {
            message.value += ' ' + type;
            index < selectedUpgradeTypes.value.length-1 ? message.value += ', and' : null;
        });
    }

    return message.value;
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


const rebateAmountClasses = (rebate_amount) => {
    const default_class = ref('rebate__amount');
    const contextual_classes = ref('');

    switch (rebate_amount.toLowerCase()) {
        case 'fully subscribed':
            contextual_classes.value = 'fully-subscribed';
            break;
        case 'free':
            contextual_classes.value = 'free';
            break;
        case 'nearly subscribed':
            contextual_classes.value = 'nearly-subscribed';
            break;
        default:
            contextual_classes.value = '';
    }

    return default_class.value + ' ' + contextual_classes.value;
};

/**
 * Clears all selected locations and types and resets the filter, removes the hash from the URL,
 * scrolls smoothly to the categories filter container, and checks for external links.
 *
 * @returns {void}
 */
const clearFilters = () => {
    const allActiveFilters = document.querySelectorAll(`.checkbox.${isCheckedClass.value}`);
    const checkboxFilterAll = document.querySelectorAll(".checkbox--all");

    resetSelectsActiveState();

    selectedBuildType.value = defaultSelectedBuildType.value;
    selectedHeatingSystem.value = defaultSelectedHeatingSystem.value;
    selectedLocation.value = defaultSelectedLocation.value;
    selectedOtherOffers.value = [];
    selectedUpgradeTypes.value = [];

    history.replaceState(selectedBuildType.value, defaultSelectedBuildType.value);
    history.replaceState(selectedHeatingSystem.value, defaultSelectedHeatingSystem.value);
    history.replaceState(selectedLocation.value, defaultSelectedLocation.value);

    allActiveFilters.length ? allActiveFilters.forEach((activeFilter) => { activeFilter.classList.remove(isCheckedClass.value) }) : null;
    checkboxFilterAll.length ? checkboxFilterAll.forEach((checkbox) => { checkbox.classList.add(isCheckedClass.value) }) : null;

    currentPage.value !== 1 ? handleUpdatingAnimationClass(".rebates-filter__pagination .pages") : null;
    currentPage.value = 1;
};

const handleSelectAllCheckboxFilter = (event) => {
    const container = event.target.closest(".filter-container");
    const checkboxFilterAll = container.querySelector(".checkbox--all");
    const allActiveFilters = container.querySelectorAll(`.${isCheckedClass.value}`);

    event.target.id === "offerTypeAll" ? selectedOtherOffers.value = [] : null;
    event.target.id === "upgradeTypeAll" ? selectedUpgradeTypes.value = [] : null;

    allActiveFilters.length ? allActiveFilters.forEach((activeFilter) => { activeFilter.classList.remove(isCheckedClass.value) }) : null;

    !event.target.parentNode.classList.contains(isCheckedClass.value) ? event.target.parentNode.classList.add(isCheckedClass.value) : null;
    checkboxFilterAll.checked = true;

    currentPage.value !== 1 ? handleUpdatingAnimationClass(".rebates-filter__pagination .pages") : null;
    currentPage.value = 1;
}

const handleCheckboxFilterStylingClass = (event) => {
    const container = event.target.closest(".filter-container");
    const allFiltersInput = container.querySelector(".checkbox--all");

    !event.target.parentNode.classList.contains(isCheckedClass.value) ? event.target.parentNode.classList.add(isCheckedClass.value) : event.target.parentNode.classList.remove(isCheckedClass.value);
    allFiltersInput.classList.contains(isCheckedClass.value) ? allFiltersInput.classList.remove(isCheckedClass.value) : null;
}

const resetSelectsActiveState = () => {
    let activeSelects = document.querySelectorAll('#rebateFilterApp .custom-select.is-active');

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
 * Fetches rebate data either from sessionStorage cache (if available and not expired) or from the WordPress API.
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
        const cachedData = sessionStorage.getItem('rebatesData');
        const cachedTimestamp = sessionStorage.getItem('rebatesTimestamp');
        if (cachedData && cachedTimestamp) {
            const timeElapsed = Date.now() - parseInt(cachedTimestamp);
            const hoursElapsed = timeElapsed / (1000 * 60 * 60);
            if (hoursElapsed < 24) {
                // Data exists in cache and it's not expired.
                rebates.value = JSON.parse(cachedData);
                showLoadingMessage.value = false;
                // Set loading state to false after data is fetched.
                isLoading.value = false;
                return;
            }
        }

        // Fetch data from API
        fetch(rebatesAPI, { cache: 'no-store' })
            .then((r) => r.json())
            .then((json) => {
                // Purge old data from sessionStorage to make sure we don't
                // exceed storage limits.
                setTimeout(itemsToClearFromSessionStorage.value.forEach((item) => {
                    sessionStorage.removeItem(item);
                }), 1000);

                // Store data in sessionStorage.
                sessionStorage.setItem('rebatesData', JSON.stringify(json));
                sessionStorage.setItem('rebatesTimestamp', Date.now());
                rebates.value = json;
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

watch(paginatedRebates, () => {
    // Avoid firing animation when number value is the same.
    if ( oldPaginatedRebatesCount.value !== paginatedRebates.value.length ) {
        oldPaginatedRebatesCount.value = paginatedRebates.value.length;
        handleUpdatingAnimationClass(".rebates-filter__pagination .paginated-rebates");
    }
});
watch(filteredRebates, () => {
        // Avoid firing animation when number value is the same.
    if ( oldFilteredRebatesCount.value !== filteredRebates.value.length ) {
        oldFilteredRebatesCount.value = filteredRebates.value.length;
        handleUpdatingAnimationClass(".rebates-filter__pagination .filtered-rebates");
    }
});

watch(currentPage, () => {
    handleUpdatingAnimationClass(".rebates-filter__pagination .current-page");
});
watch(totalPages, () => {
    handleUpdatingAnimationClass(".rebates-filter__pagination .total-pages");
});

/**
 * Watcher for changes in selectedUpgradeTypes and selectedLocation.
 * Resets the currentPage to 1 whenever either of the watched properties changes.
 *
 * @param {Array} dependencies - An array of reactive properties to watch.
 * @param {Function} callback - The callback function to execute when any of the watched properties change.
 * @returns {void}
 */
watch([selectedBuildType, selectedLocation, selectedUpgradeTypes, selectedHeatingSystem], () => {
    currentPage.value = 1;
});

window.addEventListener("click", (event) => {
    if ( !event.target.closest('.custom-select.is-active' || document.querySelectorAll('#rebateFilterApp .custom-select.is-active').length ) ) {
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

    const appElement = document.getElementById('rebateFilterApp');
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

// Icons
$external-link-icon-dark: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxOCAxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTggMTg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMDAyQTRFO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTkuNywzLjljMC0wLjEtMC4xLTAuMy0wLjItMC40QzkuNCwzLjQsOS4zLDMuNCw5LjIsMy40SDEuN2MtMC40LDAtMC45LDAuMi0xLjIsMC41QzAuMiw0LjIsMCw0LjYsMCw1LjF2MTEuMgoJYzAsMC40LDAuMiwwLjksMC41LDEuMkMwLjgsMTcuOCwxLjIsMTgsMS43LDE4aDExLjJjMC40LDAsMC45LTAuMiwxLjItMC41YzAuMy0wLjMsMC41LTAuNywwLjUtMS4yVjguOGMwLTAuMS0wLjEtMC4zLTAuMi0wLjQKCWMtMC4xLTAuMS0wLjItMC4yLTAuNC0wLjJjLTAuMSwwLTAuMywwLjEtMC40LDAuMmMtMC4xLDAuMS0wLjIsMC4yLTAuMiwwLjR2Ny41YzAsMC4xLTAuMSwwLjMtMC4yLDAuNGMtMC4xLDAuMS0wLjIsMC4yLTAuNCwwLjIKCUgxLjdjLTAuMSwwLTAuMy0wLjEtMC40LTAuMmMtMC4xLTAuMS0wLjItMC4yLTAuMi0wLjRWNS4xYzAtMC4xLDAuMS0wLjMsMC4yLTAuNGMwLjEtMC4xLDAuMi0wLjIsMC40LTAuMmg3LjUKCWMwLjEsMCwwLjMtMC4xLDAuNC0wLjJDOS43LDQuMiw5LjcsNC4xLDkuNywzLjl6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCwwLjZjMC0wLjEtMC4xLTAuMy0wLjItMC40QzE3LjcsMC4xLDE3LjYsMCwxNy40LDBoLTUuNmMtMC4xLDAtMC4zLDAuMS0wLjQsMC4yYy0wLjEsMC4xLTAuMiwwLjItMC4yLDAuNAoJczAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMiwwLjIsMC40LDAuMmg0LjNsLTkuMiw5LjJjLTAuMSwwLjEtMC4xLDAuMS0wLjEsMC4yYzAsMC4xLDAsMC4xLDAsMC4yczAsMC4xLDAsMC4yCgljMCwwLjEsMC4xLDAuMSwwLjEsMC4yQzcsMTEuMSw3LDExLjIsNy4xLDExLjJjMC4xLDAsMC4xLDAsMC4yLDBjMC4xLDAsMC4xLDAsMC4yLDBzMC4xLTAuMSwwLjItMC4xbDkuMi05LjJ2NC4zCgljMCwwLjEsMC4xLDAuMywwLjIsMC40YzAuMSwwLjEsMC4yLDAuMiwwLjQsMC4yYzAuMSwwLDAuMy0wLjEsMC40LTAuMkMxNy45LDYuNSwxOCw2LjMsMTgsNi4yVjAuNnoiLz4KPC9zdmc+Cg==);
$amount-icon-dark: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDAuNzVDOS4wMTU4NCAwLjc1IDYuMTU0OCAxLjkzNSA0LjA0NTIgNC4wNDUyQzEuOTM0ODggNi4xNTQ1OCAwLjc1IDkuMDE1ODQgMC43NSAxMkMwLjc1IDE0Ljk4NDIgMS45MzUgMTcuODQ1MiA0LjA0NTIgMTkuOTU0OEM2LjE1NDU4IDIyLjA2NTEgOS4wMTU4NCAyMy4yNSAxMiAyMy4yNUMxNC45ODQyIDIzLjI1IDE3Ljg0NTIgMjIuMDY1IDE5Ljk1NDggMTkuOTU0OEMyMi4wNjUxIDE3Ljg0NTQgMjMuMjUgMTQuOTg0MiAyMy4yNSAxMkMyMy4yNSA5LjAxNTg0IDIyLjA2NSA2LjE1NDggMTkuOTU0OCA0LjA0NTJDMTcuODQ1NCAxLjkzNDg4IDE0Ljk4NDIgMC43NSAxMiAwLjc1Wk0xMiAyMS43NUM5LjQxNDQ4IDIxLjc1IDYuOTMzODQgMjAuNzIyNSA1LjEwNTUyIDE4Ljg5NDVDMy4yNzczOSAxNy4wNjY0IDIuMjUgMTQuNTg1OCAyLjI1IDEyQzIuMjUgOS40MTQyNCAzLjI3NzQ5IDYuOTMzODQgNS4xMDU1MiA1LjEwNTUyQzYuOTMzNjUgMy4yNzczOSA5LjQxNDI0IDIuMjUgMTIgMi4yNUMxNC41ODU4IDIuMjUgMTcuMDY2MiAzLjI3NzQ5IDE4Ljg5NDUgNS4xMDU1MkMyMC43MjI2IDYuOTMzNjUgMjEuNzUgOS40MTQyNCAyMS43NSAxMkMyMS43NSAxNC41ODU4IDIwLjcyMjUgMTcuMDY2MiAxOC44OTQ1IDE4Ljg5NDVDMTcuMDY2NCAyMC43MjI2IDE0LjU4NTggMjEuNzUgMTIgMjEuNzVaTTkuNzUgOS40Mjc0NEM5Ljc1IDEwLjU4MjQgMTAuMTE3NSAxMS4yNSAxMiAxMS4yNUMxNC40OSAxMS4yNSAxNS43NSAxMi4zNjc0IDE1Ljc1IDE0LjU3MjVDMTUuNzA5NyAxNS4zODA2IDE1LjM4NzIgMTYuMTQ4NCAxNC44Mzg3IDE2Ljc0MjhDMTQuMjkxMyAxNy4zMzgyIDEzLjU1MTYgMTcuNzIxNiAxMi43NSAxNy44Mjc1VjE4Ljc1QzEyLjc1IDE5LjE2NDQgMTIuNDE0NCAxOS41IDEyIDE5LjVDMTEuNTg1NiAxOS41IDExLjI1IDE5LjE2NDQgMTEuMjUgMTguNzVWMTcuODI3NUMxMC40NDg0IDE3LjcyMTYgOS43MDg3NSAxNy4zMzgxIDkuMTYxMjYgMTYuNzQyOEM4LjYxMjgxIDE2LjE0ODQgOC4yOTAzMiAxNS4zODA2IDguMjUgMTQuNTcyNUM4LjI1IDE0LjE1ODEgOC41ODU2MiAxMy44MjI1IDkgMTMuODIyNUM5LjQxNDM4IDEzLjgyMjUgOS43NSAxNC4xNTgxIDkuNzUgMTQuNTcyNUM5Ljg4MzEzIDE1LjY4OTEgMTAuODgwNiAxNi40OTYzIDEyIDE2LjM5NUMxMy4xMTk0IDE2LjQ5NjMgMTQuMTE2OSAxNS42ODkxIDE0LjI1IDE0LjU3MjVDMTQuMjUgMTMuNDE3NSAxMy44ODI1IDEyLjc1IDEyIDEyLjc1QzkuNTEgMTIuNzUgOC4yNSAxMS42MzI1IDguMjUgOS40Mjc0NEM4LjI5MDMxIDguNjE5MzEgOC42MTI4MSA3Ljg1MTUgOS4xNjEyNiA3LjI1NzEyQzkuNzA4NzUgNi42NjE4IDEwLjQ0ODQgNi4yNzgzOCAxMS4yNSA2LjE3MjQ0VjUuMjQ5OTNDMTEuMjUgNC44MzU1NCAxMS41ODU2IDQuNDk5OTMgMTIgNC40OTk5M0MxMi40MTQ0IDQuNDk5OTMgMTIuNzUgNC44MzU1NCAxMi43NSA1LjI0OTkzVjYuMTcyNDRDMTMuNTUxNiA2LjI3ODM4IDE0LjI5MTMgNi42NjE4MiAxNC44Mzg3IDcuMjU3MTJDMTUuMzg3MiA3Ljg1MTUgMTUuNzA5NyA4LjYxOTMxIDE1Ljc1IDkuNDI3NDRDMTUuNzUgOS44NDE4MiAxNS40MTQ0IDEwLjE3NzQgMTUgMTAuMTc3NEMxNC41ODU2IDEwLjE3NzQgMTQuMjUgOS44NDE4MiAxNC4yNSA5LjQyNzQ0QzE0LjExNjkgOC4zMTA4OSAxMy4xMTk0IDcuNTAzNyAxMiA3LjYwNDkzQzEwLjg4MDYgNy41MDM2OCA5Ljg4MzEzIDguMzEwODYgOS43NSA5LjQyNzQ0WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+);
$house-icon-dark: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjQ1MzYgMTEuODA0NVYyMC40Mjc3SDMuNTQ1NTRWMTEuODQyMkwzLjU0NzQ2IDExLjgzN1YxMS44MDQ1QzMuNTQ3NDYgMTEuNTA2MyAzLjMwNTYyIDExLjI2NDUgMy4wMDc0NiAxMS4yNjQ1QzIuNzA5MyAxMS4yNjQ1IDIuNDY3NDYgMTEuNTA2MyAyLjQ2NzQ2IDExLjgwNDVWMjAuOTY3N0MyLjQ2NzQ2IDIxLjI2NzEgMi43MDk2MSAyMS41MDc3IDMuMDA3NDYgMjEuNTA3N0gxOC45OTM2QzE5LjI5MTUgMjEuNTA3NyAxOS41MzM2IDIxLjI2NzEgMTkuNTMzNiAyMC45Njc3VjExLjgwNDVDMTkuNTMzNiAxMS41MDYzIDE5LjI5MTggMTEuMjY0NSAxOC45OTM2IDExLjI2NDVDMTguNjk1NSAxMS4yNjQ1IDE4LjQ1MzYgMTEuNTA2MyAxOC40NTM2IDExLjgwNDVaIiBmaWxsPSJibGFjayIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjM2Ii8+CjxwYXRoIGQ9Ik0xLjE2OTczIDEyLjE5OTdDMS4xNzg2OCAxMi4xOTA2IDEuMTg3MzQgMTIuMTgxMiAxLjE5NTY4IDEyLjE3MTRMMS4xOTcxIDEyLjE2OTlMMTAuODgzMyAxLjYzMDUzTDEwLjg4MzMgMS42MzA1OEwxMC44ODY1IDEuNjI2ODlDMTAuOTE0MiAxLjU5NTA0IDEwLjk1NTEgMS41NzYyMyAxMS4wMDAxIDEuNTc2MjNDMTEuMDQ1MSAxLjU3NjIzIDExLjA4NiAxLjU5NTAzIDExLjExMzcgMS42MjY5TDExLjExMzcgMS42MjY5NEwxMS4xMTcgMS42MzA1M0wyMC43OTk5IDEyLjE2NjRDMjAuODkzOSAxMi4yNzkgMjEuMDI5NyAxMi4zNDg3IDIxLjE3NjIgMTIuMzU5OEwyMS4xNzc5IDEyLjM1OTlDMjEuMzI1NiAxMi4zNjk2IDIxLjQ3MTcgMTIuMzE5NSAyMS41ODE4IDEyLjIxNzlDMjEuNjkyMSAxMi4xMTYxIDIxLjc1MzYgMTEuOTczOSAyMS43NTUgMTEuODI1N0MyMS43NTY0IDExLjY3ODkgMjEuNjk3OCAxMS41Mzc2IDIxLjU5MzUgMTEuNDM1MUwxMS45MTQxIDAuOTAxMjIzQzExLjkxMzggMC45MDA5MTEgMTEuOTEzNSAwLjkwMDU5OSAxMS45MTMyIDAuOTAwMjg3QzExLjY4MDQgMC42NDA0ODkgMTEuMzQ4OCAwLjQ5MjQ4NSAxMC45OTk5IDAuNDkyNDg1QzEwLjY1MSAwLjQ5MjQ4NSAxMC4zMTk1IDAuNjQwNDk3IDEwLjA4NjYgMC45MDAyOTRMMC40MDYzMjUgMTEuNDM1MUMwLjMwMjA1NyAxMS41Mzc2IDAuMjQzNDQ1IDExLjY3ODkgMC4yNDQ4MjkgMTEuODI1N0wwLjQyNDgyMSAxMS44MjRMMC4yNDQ4MjkgMTEuODI1N0MwLjI0NjIyNiAxMS45NzM5IDAuMzA3Nzk2IDEyLjExNjEgMC40MTgwNTQgMTIuMjE3OU0xLjE2OTczIDEyLjE5OTdMMC40MTgwNTQgMTIuMjE3OU0xLjE2OTczIDEyLjE5OTdMMS4xNDM2MSAxMi4yMjgxSDEuMTM5NDVMMS4xNjk3MyAxMi4xOTk3Wk0wLjQxODA1NCAxMi4yMTc5QzAuNDE4MDUgMTIuMjE3OSAwLjQxODA0NyAxMi4yMTc5IDAuNDE4MDQzIDEyLjIxNzlMMC41NDAxMyAxMi4wODU2TDAuNDE4MDU0IDEyLjIxNzlaIiBmaWxsPSJibGFjayIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjM2Ii8+Cjwvc3ZnPg==);

#rebateFilterApp {
    a {
        display: inline-block;
        outline: 2px solid transparent;
        border-radius: 0;
        outline-offset: 2px;

        &:hover,
        &:focus {
            border-radius: 0;
            outline-color: $bahamablue;
        }
    }

    h2 {
        margin-top: 0;
    }

    h3 {
        margin-bottom: 0;
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

    p {
        display: block;
        width: 100%;

        &.no-results {
            grid-column: span 3;
            text-align: center;
        }
    }

    button,
    .button,
    select,
    .select {
        min-width: $default_button_min_width;
        min-height: $default_interactable_min_height;
        padding: $default_button_padding_vert $default_button_padding_horz;
        font-weight: bold;
        border: none;
        box-shadow: none;
    }

    .button,
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

        // &.next-page {}
        // &.prev-page {}
    }

    .button {
        padding: 0.5rem 1rem;
        font-weight: bold;
        text-decoration: none;
    }

    .rebatesFilterControls {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: stretch;

        @media (min-width: $breakpoint-sm) {
            flex-direction: row;
            // align-items: flex-start;
            justify-content: space-between;
        }

        .clear-filters {
            margin-top: calc(1rem/3);
        }
    }

    .control {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: stretch;
        width: 100%;

        @media (min-width: $breakpoint-sm) {
            flex-basis: calc((100%/3) - (1rem/3));
            width: auto;
            justify-content: space-between;
            // margin-right: 0.5rem;
        }
    }

    .custom-select {
        display: inline-block;
        position: relative;
        width: 100%;
        max-width: 100%;
        // margin-bottom: 1rem;
        margin-bottom: 0;

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
            // font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            line-height: 1.2;
            background-color: #eceef0;
            color: $bahamablue;
            -moz-appearance:none;
            -webkit-appearance:none;
            appearance:none;
            cursor: pointer;

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

    .rebates-filter {
        &__pagination {
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            align-items: flex-start;
            justify-content: flex-start;
            margin: 0 0 1rem;
            padding: 0;

            @media (min-width: $breakpoint-sm) {
                flex-basis: 100%;
                flex-direction: row;
                align-items: center;
            }

            &--top,
            &--bottom {
                margin-top: 1rem;
            }

            &--top {
                margin-bottom: 0;
            }

            &--bottom {
                .clear-filters {
                    margin-top:  calc(1rem/3);

                    @media (min-width: $breakpoint-sm) {
                        margin-top: 0;
                        margin-left: 0.5rem;
                    }
                }
            }
        }
    }

    .rebatesTool {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: stretch;

        @media (min-width: $breakpoint-sm) {
            flex-direction: row;
            align-items: flex-start;
        }
    }

    .rebatesResults {
        width: 100%;

        .no-results {
            width: 100%;
            text-align: center;
        }

        .page {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            flex-basis: 100%;

            @media (min-width: $breakpoint-sm) {
                flex-basis: calc(75% - 0.5rem);
                grid-template-columns: repeat(2, 1fr);
            }

            @media (min-width: $breakpoint-md) {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    }

    .rebate {
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        align-items: stretch;
        justify-content: flex-start;
        padding: 1rem;
        box-shadow: rgba(0, 0, 0, 0.1019607843) 0 20px 25px -5px, rgba(0, 0, 0, 0.0392156863) 0 10px 10px -5px;
        border-radius: 0;
        background-color: $white;

        @media (min-width: $breakpoint-sm) {
            padding: 2rem;
        }

        a,
        p {
            margin: 0;
        }

        img {
            display: block;
            width: 1.875rem;
            height: auto;
            margin-right: 1rem;
        }

        &__amount,
        &__short-description {
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-content: flex-start;
            align-items: flex-start;

            &::before {
                display: inline-block;
                line-height: 1;
                margin-right: 0.5rem;
            }

            p {
                // font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);
            }
        }

        &__amount {
            margin-bottom: 0.5rem;

            &::before {
                content: $amount-icon-dark!important;

            }
        }

        &__short-description {
            margin-bottom: 1rem;

            &::before {
                content: $house-icon-dark!important;
            }
        }

        &__learn-more {
            margin-top: auto;
            text-align: center;
        }

        &__title {
            margin-bottom: 1rem;

            h3 {
                font-size: clamp(var(--wp--preset--font-size--normal), 1.25rem + ((1vw - 0.48rem) * 0.481), 1.5rem);
                margin-top: 0;
                color: $bahamablue;
            }

            a {
                // color: $bahamablue!important;
                text-decoration-color: $bahamablue;
                text-decoration: none;
            }
        }
    }

    .rebatesSidebar {
        flex: 0 0 100%;
        width: 100%;
        padding: 0 1rem 0 0;

        @media (min-width: $breakpoint-sm) {
            flex-basis: calc(25% - 0.5rem);
        }

        h2 {
            margin-bottom: 1rem;
        }

        .filter {
            margin-bottom: 1rem;

            @media (min-width: $breakpoint-sm) {
                margin-bottom: 2rem;
            }
        }
    }

    .current-page,
    .total-pages,
    .filtered-rebates,
    .paginated-rebates {
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

    .help-text {
        margin-bottom: 1rem;
        padding: 1rem;
        background-color: #ecf1f4;

        p {
            margin-top: 0;
            // font-size: clamp(var(--wp--preset--font-size--normal), 1rem + ((1vw - 0.48rem) * 0.481), 1.25rem);

            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    .checkbox {
        // padding: 0 0.5rem;

        &.is-checked {
            label {
                font-weight: bold;
                background-color: rgba($prussianblue, 0.15);
            }
        }

        input {
            margin: 0;
            appearance: none;
        }

        label {
            display: block;
            width: 100%;
            height: 100%;
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            cursor: pointer;
            background-color: rgba($prussianblue, 0);
            transition: background-color $default_transition_timing_fn $default_transition_duration;

            &:hover,
            &:focus {
                background-color: rgba($prussianblue, 0.15);
                transition: background-color $default_transition_timing_fn $default_transition_duration;
            }
        }
    }

    .is-loading {
        text-align: center;

        p { margin-bottom: 0; }
    }
}
</style>