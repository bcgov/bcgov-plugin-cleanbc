<template>
  <div class="inner">
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Energy Advisor Listings</h2>
    <!-- Skip to results link -->
    <a href="#pqeasResults" class="sr-only skip-to-results">Skip to results</a>
    <!-- Filter Controls -->
    <div id="pqeasFilterControls" class="pqeasFilterControls filter-container">
        <!-- Category Select -->
        <div class="control category-select">
          <label for="categorySelect" class="">Choose between home construction and home renovation</label>
          <div class="custom-select">
              <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="categorySelect" class="select select--category" v-model="selectedCategory" :required="true" data-active="false">
                  <option v-if="isLoading" value="Constructing a home">Constructing a home</option>
                  <option v-if="!isLoading" v-for="(category, index) in categories" :key="category" :value="category">{{ category }}</option>
              </select>
          </div>
        </div>

        <!-- Location Select -->
        <div class="control location-select">
          <label for="locationSelect" class="">Choose a service region</label>
          <div class="custom-select">
              <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="locationSelect" class="select select--location" v-model="selectedLocation">
                  <option value="all">All Locations</option>
                  <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
              </select>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="control reset-filters">
          <button class="clear-filters" @click.prevent="clearFilters"
              @touchend="clearFilters"
              @keydown.enter.prevent="clearFilters"
              type="button">
              Reset selection
          </button>
        </div>
        <!-- Pagination Controls -->
        <div class="pqeasFilterPagination control pagination pagination--top">
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
                <span class="results-count" role="status" aria-live="polite">Showing <span class="numValue paginated-pqeas">{{ paginatedPqeas.length }}</span> of <span class="numValue filtered-pqeas">{{ filteredPqeas.length }}</span> Energy Advisors {{ currentTypeFilterMessage }} {{ currentLocationFilterMessage }}</span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>
        </div>
    </div>

    <!-- PQEAs Results Table -->
    <h2 class="results__title">Results (<span class="counter__value">{{ filteredPqeas.length }}</span>)</h2>
    <table id="pqeasResults" class="pqeasResults results table table--striped">
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
                    <p class="no-results" role="status" aria-live="polite">Sorry, no results found.</p>
                </td>
            </tr>

            <!-- Loading Message -->
            <tr v-if="isLoading" class="is-loading">
                <td colspan="100%">
                    <p class="no-results loading" role="status" aria-live="polite">Retrieving a list of Energy Advisors, please wait...</p>
                </td>
            </tr>

            <!-- Results Loop -->
            <template v-if="pqeas.length > 0" v-for="(pqea, index) in paginatedPqeas" :key="index">
                <tr :class="`pqea result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`">
                    <!-- Company Name and Head Office -->
                    <td data-label="Company Name and Head Office" class="pqea__company-and-location">
                        <!-- Company Website Link -->
                        <a v-if="pqea.details.company_website" class="pqea__company external" :href="pqea.details.company_website" target="_blank" :aria-label="pqea.details.company_name + ' website, opens in a new tab/window.'">
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
                                <a v-if="pqea.details.service_organization_website" :href="pqea.details.service_organization_website" class="external-app-link" target="_blank" :aria-label="pqea.details.service_organization_name + ' website, opens in a new tab/window.'">{{ pqea.details.service_organization_name }}</a>
                                <!-- Plain Text if No Website -->
                                <span v-else>{{ pqea.details.service_organization_name }}</span>
                            </li>

                            <!-- Service Organization Name 2 -->
                            <li v-if="pqea.details.service_organization_name_2" class="pqea__service-organization-name--2">
                                <!-- Link if Website Provided -->
                                <a v-if="pqea.details.service_organization_website_2" :href="pqea.details.service_organization_website_2" class="external-app-link" target="_blank" :aria-label="pqea.details.service_organization_name_2 + ' website, opens in a new tab/window.'">{{ pqea.details.service_organization_name_2 }}</a>
                                <!-- Plain Text if No Website -->
                                <span v-else>{{ pqea.details.service_organization_name_2 }}</span>
                            </li>

                            <!-- Additional Service Organizations -->
                            <li v-if="pqea.details.additional_service_organizations" v-for="(org, index) in pqea.details.additional_service_organizations" :key="index">
                                <!-- Link if Website Provided -->
                                <a v-if="org[1]" :href="org[1]" class="external-app-link" target="_blank" :aria-label="org[0] + ' website, opens in a new tab/window.'">{{ org[0] }}</a>
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
  </div>

  <div class="pqeasFilterControls filter-container filter-container--bottom">
    <!-- Lower Pagination Controls -->
    <div class="pqeasFilterPagination control pagination pagination--bottom">
            <!-- Previous Page Button -->
            <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
            <!-- Current Page & Totals -->
            <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            <!-- Next Page Button -->
            <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>
            <button class="go-to-top" tabindex="0" type="button" :disabled="filteredPqeas.length === 0" @click="scrollToElementID('pqeasResults', '11rem')">Go to top of results</button>
        </div>
  </div>
</template>

<script setup>
/**
 * Imports Vue Composition API functions for reactive data and lifecycle hooks.
 *
 * @namespace VueCompositionAPI
 * @type {Object}
 * @property {Function} ref - Creates a reactive reference for data.
 * @property {Function} onMounted - Lifecycle hook called after component is mounted.
 * @property {Function} computed - Creates a computed property based on reactive dependencies.
 * @property {Function} watch - Watches for changes on reactive data and executes a callback.
 */
 import {
	ref,
	onMounted,
	computed,
	watch
} from 'vue';

import { shuffleArray, scrollToElementID } from '../shared-functions.js';

/**
 * Ref for storing an array of Program Qualified Energy Advisors (PQEAs).
 *
 * @type {Ref<Array>} - Reference to an array containing PQEAs.
 */
const pqeas = ref([]);

/**
 * Ref for the default and currently selected category.
 *
 * @type {Ref<String>} - Reference to the selected category.
 */
const defaultSelectedCategory = ref('Constructing a home');
const selectedCategory = ref('Constructing a home');

/**
 * Ref for controlling the visibility of loading messages.
 *
 * @type {Ref<Boolean>} - Reference to a boolean indicating loading state.
 */
const defaultSelectedLocation = ref('all');
const selectedLocation = ref('all');

/**
 * Ref for controlling the visibility of loading messages.
 * Default: true.
 *
 * @type {Ref<Boolean>} - A reference to a boolean indicating whether to show loading messages.
 */
const showLoadingMessage = ref(true);

/**
 * Ref for controlling the loading state.
 *
 * @type {Ref<Boolean>} - Reference to a boolean indicating if data is being loaded.
 */
const isLoading = ref(false);

/**
 * Ref for storing CSS class names for active and updating states.
 *
 * @type {Ref<String>} - Reference to CSS class names.
 */
const activeClass = ref('is-active');
const updatingClass = ref('is-updating');

// Pagination related data

/**
 * Ref for the default page size and current page number.
 *
 * @type {Ref<Number>} - Reference to default page size and current page number.
 */
const pageSize = ref(30); // Default page size
const currentPage = ref(1);

/**
 * Ref array of sessionStorage keys to clear.
 *
 * @type {Ref<Array<String>>} - Reference to sessionStorage keys to clear.
 */
const itemsToClearFromSessionStorage = ref([
	'contractorsData',
	'contractorsTimestamp',
    'faqsData',
	'faqsTimestamp',
	'rebatesData',
	'rebatesTimestamp',
]);

/**
 * Ref for storing the previous number of pages of results.
 *
 * @type {Ref<Number>} - A reference to the current page number.
 */
const oldPaginatedPqeasCount = ref(0);
const oldFilteredPqeasCount = ref(0);

/**
 * Ref for storing the public domain URL.
 *
 * @type {Ref<String>} - Reference to the public domain URL.
 */
const publicDomain = ref('https://betterhomes.gov.bc.ca');

/**
 * API URL for fetching Program Qualified Energy Advisors (PQEAs).
 *
 * @type {String} - The constructed API URL for fetching PQEAs.
 */
const pqeasAPI = `${window.site?.domain ? window.site.domain : publicDomain}/wp-json/custom/v1/pqeas`;

/**
 * Computed property to filter Program Qualified Energy Advisors (PQEAs) by category and/or location.
 *
 * @type {Computed<Array>} - Filtered array of PQEAs based on selected category and/or location.
 */
const filteredPqeas = computed(() => {
	const selectedLoc = selectedLocation.value;
	let filteredPqeas = [...filteredPqeasByCategory.value];

	// Filter by location if 'all' is not selected.
	if ('all' !== selectedLoc) {
		filteredPqeas = filteredPqeas.filter(pqea => pqea.locations && pqea.locations.some(location => location.name === selectedLoc));
	}

	resetSelectsActiveState();

    return shuffleArray(filteredPqeas); // Add random display of filtered energy advisors.
});

/**
 * Computed property to filter Program Qualified Energy Advisors (PQEAs) by category.
 *
 * This computed property filters the list of PQEAs based on the selected category (`selectedCategory`).
 * If the selected category is 'all', it returns all PQEAs (`pqeas.value`).
 * Otherwise, it filters PQEAs that belong to the selected category.
 * The resulting array contains PQEAs that match the selected category criteria.
 *
 * @type {Array} - An array containing the filtered PQEAs based on selected category.
 */
const filteredPqeasByCategory = computed(() => {
	const selectedCat = selectedCategory.value;
	currentPage.value = 1;

	if (selectedCat === 'all') {
		return pqeas.value;
	} else {
		return pqeas.value.filter(pqea => pqea.categories && pqea.categories.includes(selectedCat));
	}
});

/**
 * Function to add and remove CSS class for updating animation on specified elements.
 *
 * This function adds an updating animation class (`updatingClass.value`) to the elements
 * matched by the given CSS selector (`elementCssPath`). After a short delay (125ms),
 * the updating animation class is removed from the elements.
 *
 * @param {string} elementCssPath - The CSS selector string to query elements.
 * @returns {void}
 */
const handleUpdatingAnimationClass = (elementCssPath) => {
	const elements = document.querySelectorAll(elementCssPath);

	if (0 < elements.length) {
		elements.forEach((element) => {
			element.classList.add(updatingClass.value);
			setTimeout(() => {
				element.classList.remove(updatingClass.value);
			}, 125);
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
 * Function to shuffle the array of pqea results.
 *
 * @returns {Array} - The updated array of pqea results.
 */
 const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

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

	currentPage.value !== 1 ? handleUpdatingAnimationClass('.control.pagination .pages') : null;
	currentPage.value = 1;
};

/**
 * Function to reset the active state of custom-select elements within the #pqeaFilterApp container.
 *
 * This function removes the 'is-active' class from all custom-select elements that have the 'is-active' class
 * within the #pqeaFilterApp container. This is typically used to deactivate select dropdowns after an action.
 *
 * @returns {void}
 */
const resetSelectsActiveState = () => {
	let activeSelects = document.querySelectorAll('#pqeaFilterApp .custom-select.is-active');

	0 < activeSelects.length ? activeSelects.forEach((item) => {
		item.classList.remove('is-active')
	}) : null;
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
		fetch(pqeasAPI, {
				cache: 'no-store'
			})
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

/**
 * Watcher to trigger an animation when the length of paginatedPqeas changes.
 *
 * This watcher monitors changes in the length of the paginatedPqeas array (`paginatedPqeas.value.length`).
 * When the length changes (indicating a change in paginated data), it triggers an animation by adding and removing
 * a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
watch(paginatedPqeas, () => {
	// Avoid firing animation when number value is the same.
	if (oldPaginatedPqeasCount.value !== paginatedPqeas.value.length) {
		oldPaginatedPqeasCount.value = paginatedPqeas.value.length;
		handleUpdatingAnimationClass('.control.pagination .paginated-pqeas');
	}
});

/**
 * Watcher to trigger an animation when the length of filteredPqeas changes.
 *
 * This watcher monitors changes in the length of the filteredPqeas array (`filteredPqeas.value.length`).
 * When the length changes (indicating a change in filtered data), it triggers an animation by adding and removing
 * a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
watch(filteredPqeas, () => {
	// Avoid firing animation when number value is the same.
	if (oldFilteredPqeasCount.value !== filteredPqeas.value.length) {
		oldFilteredPqeasCount.value = filteredPqeas.value.length;
		handleUpdatingAnimationClass('.control.pagination .filtered-pqeas');
        handleUpdatingAnimationClass('.counter__value');
	}
});

/**
 * Watcher to trigger an animation when the currentPage value changes.
 *
 * This watcher monitors changes in the `currentPage` value (`currentPage.value`).
 * When the `currentPage` value changes (indicating a page navigation), it triggers an animation
 * by adding and removing a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
 watch(currentPage, () => {
    // Trigger an animation by applying the updating animation class to specified elements.
    handleUpdatingAnimationClass('.control.pagination .current-page');
});

/**
 * Watcher to trigger an animation when the totalPages value changes.
 *
 * This watcher monitors changes in the `totalPages` value (`totalPages.value`).
 * When the `totalPages` value changes (indicating a change in total pagination pages), it triggers an animation
 * by adding and removing a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
 watch(totalPages, () => {
    // Trigger an animation by applying the updating animation class to specified elements.
    handleUpdatingAnimationClass('.control.pagination .total-pages');
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

/**
 * Event listener to handle clicks outside active custom-select dropdowns.
 *
 * This event listener is attached to the window object to detect click events.
 * When a click event occurs anywhere on the page, it checks if the clicked element
 * is not inside an active custom-select dropdown (`'.custom-select.is-active'`).
 * If the click is outside any active custom-select dropdown, it deactivates all
 * active custom-select dropdowns by calling the `resetSelectsActiveState` function.
 *
 * @param {Event} event - The click event object triggered by the user.
 * @returns {void}
 */
 window.addEventListener('click', (event) => {
    // Check if the clicked element is not inside an active custom-select dropdown.
    if (!event.target.closest('.custom-select.is-active')) {
        // Check if there are any other active custom-select dropdowns inside #pqeaFilterApp.
        if (document.querySelectorAll('#pqeaFilterApp .custom-select.is-active').length === 0) {
            // Deactivate all active custom-select dropdowns.
            resetSelectsActiveState();
        }
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

	if (window.site?.domain) {}
});
</script>

<style lang='scss' scoped>
// See bcgov-plugin-cleanbc/styles/public/betterhomes/_vue-apps.scss
#pqeaFilterApp {}
</style>