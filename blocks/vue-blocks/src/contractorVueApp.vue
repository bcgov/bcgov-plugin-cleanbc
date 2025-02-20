<template>
  <div class="inner">
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Contractor Listings</h2>
    <!-- Skip to results link -->
    <a href="#contractorsResults" class="sr-only skip-to-results">Skip to results</a>
    <!-- Filter Controls -->
    <div v-if="isVisible || (1 < totalPages && !isVisible)" id="contractorsFilterControls" class="contractorsFilterControls filter-container">
        <!-- Type Select -->
        <div v-if='isVisible' class="control type-select">
          <label for="typeSelect" class="">Choose a type of upgrade</label>
          <div class="custom-select">
              <select @change="selectIsActive"
                @click.prevent="selectIsActive"
                @touchend="selectIsActive"
                @keyup.esc="selectIsActive"
                tabindex="0"
                id="typeSelect"
                class="select select--type"
                v-model="selectedUpgradeType"
                :required="true"
                data-active="false">
                  <option value="all">All Upgrade Types</option>
                  <option v-for="(type, index) in types" :key="type" :value="type">{{ type }}</option>
              </select>
          </div>
        </div>

        <!-- Program Select -->
        <div v-if='isVisible' class="control program-select">
          <label for="programSelect" class="">Choose a rebate program</label>
          <div class="custom-select">
              <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="programSelect" class="select select--program" v-model="selectedProgram" :required="true" data-active="false">
                  <option value="all">All Programs</option>
                  <option v-for="(program, index) in programs" :key="program" :value="program">{{ program }}</option>
              </select>
          </div>
        </div>

        <!-- Location Select -->
        <div v-if='isVisible' class="control location-select">
          <label for="locationSelect" class="">Choose a service region</label>
          <div class="custom-select">
              <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="locationSelect" class="select select--location" v-model="selectedLocation">
                  <option value="all">All Locations</option>
                  <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
              </select>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div v-if='isVisible' class="control reset-filters">
          <button class="clear-filters" @click.prevent="clearFilters"
            @touchend="clearFilters"
            @keydown.enter.prevent="clearFilters"
            type="button">
            Reset selection
          </button>
        </div>

         <!-- Add Link to Clipboard Button -->
         <div v-if='isVisible' class="control copy-link-btn">
            <button class="copy-link" 
                @click.prevent="addLinkToClipboard"
                @touchend="addLinkToClipboard"
                @keydown.enter.prevent="addLinkToClipboard"
                :disabled="selectedUpgradeType === 'all' && selectedProgram === 'all' && selectedLocation === 'all'"
                type="button">
                Copy link
            </button>
            <span class="copy-message isFadedOut" role="status" aria-live="polite"></span>
        </div>

        <!-- Pagination Controls -->
        <div v-if="(isVisible && 1 !== totalPages) || (1 < totalPages && !isVisible)" class="contractorsFilterPagination control pagination pagination--top">
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

            <!-- ARIA live regions -->
            <span class="sr-status sr-only">
                <span class="results-count" role="status" aria-live="polite">Showing <span class="numValue paginated-contractors">{{ paginatedContractors.length }}</span> of <span class="numValue filtered-contractors">{{ filteredContractors.length }}</span> registered contractors {{ currentTypeFilterMessage }} {{ currentLocationFilterMessage }}.</span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>
        </div>
    </div>

    <!-- Contractors Results Table -->
    <h2 class="results__title">Find a registered contractor (<span class="counter__value">{{ filteredContractors.length }}</span> results)</h2>
    <table id="contractorsResults" class="contractorsResults results table table--striped">
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
                    <p class="no-results" role="status" aria-live="polite">Sorry, no results found.</p>
                </td>
            </tr>

            <!-- Loading Message -->
            <tr v-if="isLoading" class="is-loading" role="status" aria-live="polite">
                <td colspan="100%">
                    <p class="no-results loading">Retrieving a list of registered contractors, please wait...</p>
                </td>
            </tr>

            <!-- Results Loop -->
            <template v-if="contractors.length > 0" v-for="(contractor, index) in paginatedContractors" :key="index">
                <tr :class="`contractor result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`">
                    <!-- Company Name and Head Office -->
                    <td data-label="Company Name and Head Office" class="contractor__company-and-location">
                        <!-- Company Website Link -->
                        <a v-if="contractor.company_website" class="contractor__company external-app-link" :href="contractor.company_website" target="_blank" :aria-label="decodeHtmlEntities(contractor.company_name) + ' website, opens in a new tab/window.'">
                            {{ contractor.company_name ? decodeHtmlEntities(contractor.company_name) : 'Website' }}
                        </a>
                        <!-- Company Name if No Website -->
                        <span v-else class="contractor__company">
                            {{ contractor.company_name ? decodeHtmlEntities(contractor.company_name) : 'No company name provided' }}
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
                            <a v-if="contractor.email" class="contractor__email" :href="'mailto:' + contractor.email"><span v-html="insertBreakableChar(contractor.email)"></span></a>
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
  </div>
  <div  v-if="filteredContractors.length !== 0 && 1 !== totalPages" class="contractorsFilterControls filter-container filter-container--bottom">
    <!-- Lower Pagination Controls -->
    <div class="contractorsFilterPagination control pagination pagination--bottom">
            <!-- Previous Page Button -->
            <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
            <!-- Current Page & Totals -->
            <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            <!-- Next Page Button -->
            <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>
            <button class="go-to-top" tabindex="0" type="button" :disabled="filteredContractors.length === 0" @click="scrollToElementID('contractorsResults', '11rem')">Go to top of results</button>
        </div>
  </div>
</template>

<script setup>
/**
 * Vue Composition API imports for reactive data and lifecycle hooks.
 *
 * @namespace VueCompositionAPI
 * @type {object}
 * @property {Function} ref - Function for creating a reactive reference.
 * @property {Function} onMounted - Lifecycle hook that is called after the component is mounted.
 * @property {Function} computed - Function for creating a computed property that automatically updates based on its dependencies.
 * @property {Function} watch - Function for watching a reactive reference or computed property for changes.
 */
 import {
    ref,
    onMounted,
    computed,
    watch,
    watchEffect
} from 'vue';

import { decodeHtmlEntities, shuffleArray, scrollToElementID } from '../shared-functions.js';

/**
 * Ref for storing an array of Contractors.
 *
 * @type {Ref<Array>} - A reference to an array containing Contractors.
 */
const contractors = ref([]);

/**
 * Ref for storing an array of randomized Contractors.
 *
 * @type {Ref<Array>} - A reference to an array containing randomized Contractors.
 */
const shuffledContractors = ref([]);

/**
 * Ref for for controlling tool visibility.
 *
 * @type {Ref<Bool>} - A reference to the current visibility.
 */
 const isVisible = ref(true);

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

/**
 * Ref array containing keys for session storage items to clear.
 *
 * This ref array contains keys corresponding to session storage items that should be cleared to avoid storage limit issues.
 *
 * @type {Ref<Array<String>>}
 */
 const itemsToClearFromSessionStorage = ref([
    'faqsData',
    'faqsTimestamp',
    'pqeasData',
    'pqeasTimestamp',
    'rebatesData',
    'rebatesTimestamp'
]);

/**
 * Ref for storing the previous number of paginated contractors and filtered contractors.
 *
 * @type {Ref<Number>}
 */
const oldPaginatedContractorsCount = ref(0);

/**
 * Ref for storing the previous number of filtered contractors.
 *
 * @type {Ref<Number>}
 */
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
 * Computed property to handle filtering Contractors by type and/or location.
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
		filteredContractors = filteredContractors.filter(contractor => contractor.locations && contractor.locations.some(location => location.name === selectedLoc));
	}
	// Filter by rebate program if 'all' is not selected.
	if ('all' !== selectedProg) {
		filteredContractors = filteredContractors.filter(contractor => contractor.program_designations && contractor.program_designations.some(program => program.name === selectedProg));
	}

  // return sortArray(filteredContractors, 'company_name', 'asc'); // Todo: Display sorted filtered contractors.
	return shuffleArray(filteredContractors); // Add random display of filtered contractors.
});

// Define a computed property to filter contractors based on the selected type
const filteredContractorsByType = computed(() => {
	const selectedType = selectedUpgradeType.value;

	currentPage.value = 1;

	if (selectedType === 'all') {
		return contractors.value;
	} else {
		return contractors.value.filter(contractor => contractor.types && contractor.types.some(type => type.name === selectedType));
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
		return contractors.value.filter(contractor => contractor.program_designations && contractor.program_designations.some(type => type.name === selectedProg));
	}

	return contractors.value;
});

/**
 * Computed property to calculate the total number of pages for paginated Contractors.
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
 * Computed property to calculate the paginated Contractors.
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
 * Function assembles a URL with query string parameters for the selected type, program, and location.
 *
 * @returns {string} - The assembled URL with query string parameters.
 */
const assembleUrl = () => {
  const baseUrl = window.location.origin + window.location.pathname;

  const urlParams = new URLSearchParams();

  // Add tool identifier
  urlParams.set('tool', 'contractors');

  // Add type filter if not default
  if (selectedUpgradeType.value && selectedUpgradeType.value !== 'all') {
    urlParams.set('type', encodeURIComponent(selectedUpgradeType.value));
  }

  // Add program filter if not default
  if (selectedProgram.value && selectedProgram.value !== 'all') {
    urlParams.set('program', encodeURIComponent(selectedProgram.value));
  }

  // Add location filter if not default
  if (selectedLocation.value && selectedLocation.value !== 'all') {
    urlParams.set('region', encodeURIComponent(selectedLocation.value));
  }

  // Combine base URL with query string
  return `${baseUrl}?${urlParams.toString()}`;
};

/**
 * Copies the dynamically assembled URL with filters to the clipboard.
 *
 * This function generates a URL containing query string parameters based on
 * the selected type, program, and location, and copies it to the clipboard.
 * It provides feedback via a success or error message.
 *
 * @function
 * @returns {void}
 *
 * @example
 * // Example usage:
 * addLinkToClipboard();
 * // Copies a URL like:
 * // https://betterhomesbc.ca?tool=contractors&type=Heat%20Pump&program=Energy%20Savings&region=Vancouver
 */
 const addLinkToClipboard = (event) => {
  
  const url = assembleUrl();

  navigator.clipboard
    .writeText(url)
    .then(() => {
      handleLinkCopiedMessageContent(event, '.filter-container', 'Settings link to copied to clipboard!');
    })
    .catch((err) => {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy the link. Please try again.');
    });
};


/**
 * Injects messageToUser into ARIA live region node.
 *
 * @param {Event} event - The event object triggered by the click action.
 */
 function handleLinkCopiedMessageContent(event, target = '.filter-container', msg) {
  const item = event.target.closest(target);
  const messageToUser = ref(msg);
  const messageArea = item ? item.querySelector('.copy-message') : null;

  if (messageArea && messageArea.classList.contains('isFadedOut')) {
    // Inject message to user, triggering ARIA live region.
    messageArea.innerText = messageToUser.value;

    // Show copy message and fade out after a delay.
    messageArea.classList.remove('isFadedOut');
    // Wait before re-adding the opacity class.
    setTimeout(() => { messageArea.classList.add('isFadedOut'); }, 1000);
    // Check again, in case of double-click.
    setTimeout(() => {
      if (messageArea.classList.contains('isFadedOut')) {
        messageArea.innerText = '';
      }
    }, 1600);

  }
}

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
	return defaultSelectedUpgradeType.value === selectedUpgradeType.value ? ' no upgrade type selected ' : ' specializing in ' + selectedUpgradeType.value.toLowerCase() + ' upgrades ';
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

	currentPage.value !== 1 ? handleUpdatingAnimationClass('.control.pagination .pages') : null;
	currentPage.value = 1;
};

/**
 * Function to add invisible html entity as breakpoints for email address as label.
 *
 * @returns {string} - The updated current page value or null if already on the first page.
 */
 const insertBreakableChar = (email) => {
    return email.replace(/@/g, '&#8203;@').replace(/\./g, '&#8203;.');
};

/**
 * Function to reset the active state of custom-select dropdowns.
 *
 * This function queries and resets the active state (`is-active` class) of custom-select dropdowns within the `#contractorFilterApp` container.
 * If there are active custom-select dropdowns found, it removes the `is-active` class from each of them to deactivate them.
 *
 * @returns {void}
 */
 const resetSelectsActiveState = () => {
    // Query all active custom-select dropdowns within the #contractorFilterApp container.
    let activeSelects = document.querySelectorAll('#contractorFilterApp .custom-select.is-active');

    // Check if there are active custom-select dropdowns found.
    if (activeSelects.length >= 1) {
        // Iterate over each active custom-select dropdown and remove the is-active class to deactivate them.
        activeSelects.forEach((item) => {
            item.classList.remove('is-active');
        });
    }
};

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
 * Function to handle updating animation class on specified elements.
 *
 * This function applies an updating animation class to elements selected by the given CSS path (`elementCssPath`).
 * It adds the animation class (`updatingClass.value`) to each element and removes it after a short delay (125ms),
 * simulating an update animation effect.
 *
 * @param {string} elementCssPath - The CSS path selector to target elements for animation.
 * @returns {void}
 */
 const handleUpdatingAnimationClass = (elementCssPath) => {
    // Query all elements matching the provided CSS path.
    const elements = document.querySelectorAll(elementCssPath);

    // Check if there are elements found.
    if (elements.length > 0) {
        // Iterate over each element and apply the updating animation class.
        elements.forEach((element) => {
            // Add the updating animation class to the element.
            element.classList.add(updatingClass.value);

            // Remove the updating animation class after a short delay (125ms).
            setTimeout(() => {
                element.classList.remove(updatingClass.value);
            }, 125);
        });
    }
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
 * Fetches contractor data either from sessionStorage cache (if available and not expired) or from the WordPress API.
 * If data is fetched from the API, it is stored in sessionStorage for caching purposes.
 *
 * @async
 * @function fetchData
 * @param {number} [offset=0] - Offset parameter (currently unused, but reserved for future pagination).
 * @throws {Error} Throws an error if the API request fails.
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
        // Loaded contractorsData from cache.
				return;
			}
		}

		// Fetch data from API using async/await
		const response = await fetch(contractorsAPI, { cache: 'no-store' });
		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

		const json = await response.json();

    // Purge old data from sessionStorage to make sure we don't exceed storage quota.
    // setTimeout(itemsToClearFromSessionStorage.value.forEach((item) => {
    //     sessionStorage.removeItem(item);
    // }), 1000);
    sessionStorage.clear();

		// Store new data in sessionStorage
		sessionStorage.setItem('contractorsData', JSON.stringify(json));
		sessionStorage.setItem('contractorsTimestamp', Date.now());

		// Update state
		contractors.value = json;
		showLoadingMessage.value = false;
		isLoading.value = false;

	} catch (error) {
		console.error('Error fetching contractors data:', error);
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

/**
 * Watcher to trigger an animation when paginated contractors change.
 *
 * This watcher monitors changes in the `paginatedContractors` array's length (`paginatedContractors.value.length`).
 * When the length of `paginatedContractors` changes (indicating a change in paginated contractors),
 * it triggers an animation by adding and removing a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
 watch(paginatedContractors, () => {
    // Check if the length of paginatedContractors array has changed.
    if (oldPaginatedContractorsCount.value !== paginatedContractors.value.length) {
        // Update the oldPaginatedContractorsCount to match the current length.
        oldPaginatedContractorsCount.value = paginatedContractors.value.length;

        // Trigger an animation by applying the updating animation class to specified elements.
        handleUpdatingAnimationClass('.control.pagination .paginated-contractors');
    }
});

/**
 * Watcher to trigger an animation when filtered contractors change.
 *
 * This watcher monitors changes in the `filteredContractors` array's length (`filteredContractors.value.length`).
 * When the length of `filteredContractors` changes (indicating a change in filtered contractors),
 * it triggers an animation by adding and removing a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
 watch(filteredContractors, () => {
    // Check if the length of filteredContractors array has changed.
    if (oldFilteredContractorsCount.value !== filteredContractors.value.length) {
        // Update the oldFilteredContractorsCount to match the current length.
        oldFilteredContractorsCount.value = filteredContractors.value.length;

        // Trigger an animation by applying the updating animation class to specified elements.
        handleUpdatingAnimationClass('.control.pagination .filtered-contractors');
        handleUpdatingAnimationClass('.counter__value');
    }
});

/**
 * Watcher to trigger an animation when the current page changes.
 *
 * This watcher monitors changes in the `currentPage` reactive reference.
 * When the `currentPage` value changes (indicating a change in the current page),
 * it triggers an animation by adding and removing a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
 watch(currentPage, () => {
    // Trigger an animation by applying the updating animation class to specified elements.
    handleUpdatingAnimationClass('.control.pagination .current-page');
});

/**
 * Watcher to trigger an animation when the total pages change.
 *
 * This watcher monitors changes in the `totalPages` computed property.
 * When the `totalPages` value changes (indicating a change in the total number of pages),
 * it triggers an animation by adding and removing a CSS class to the specified elements using the `handleUpdatingAnimationClass` function.
 *
 * @param {Function} callback - The callback function to execute when the watched property changes.
 * @returns {void}
 */
 watch(totalPages, () => {
    // Trigger an animation by applying the updating animation class to specified elements.
    handleUpdatingAnimationClass('.control.pagination .total-pages');
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
});

/**
 * Event listener for handling custom-select deactivation on click outside.
 *
 * This event listener is triggered on a click event anywhere in the window (`window.addEventListener('click')`).
 * It checks if the click target is not within an active custom-select dropdown (`!event.target.closest('.custom-select.is-active')`).
 * If the click is outside of any active custom-select dropdown, it calls the `resetSelectsActiveState()` function to deactivate them.
 *
 * @param {Event} event - The click event object.
 * @returns {void}
 */
 window.addEventListener('click', (event) => {
    // Check if the click target is not within an active custom-select dropdown.
    if (!event.target.closest('.custom-select.is-active')) {
        // Call the resetSelectsActiveState function to deactivate active custom-select dropdowns.
        resetSelectsActiveState();
    }
});

window.addEventListener('click', (event) => {
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
  const appElement = document.getElementById('contractorFilterApp');
  const showControls = appElement.getAttribute('data-show-controls') === 'false';
  isVisible.value = showControls;

  fetchData(); // Start fetching data
  showLoadingMessage.value = true;

  const urlParams = new URLSearchParams(window.location.search);
  const showParam = urlParams.get('show');

  if (showParam === 'off') {
      isVisible.value = true;
  }
});

watchEffect(() => {
  // Ensure types, programs, and locations are populated before proceeding
  if (types.value.length && programs.value.length && locations.value.length) {
    // Get query string parameters
    const urlParams = new URLSearchParams(window.location.search);

    const showParam = urlParams.get('show');

    // Ensure the tool matches "contractors" before processing
    if (null !== urlParams.get('tool') && urlParams.get('tool') !== 'contractors') {
      console.warn('Tool parameter does not match "contractors". Initialization skipped.');
      return;
    }

    // Hide tools if `show=off` is in the query string
    if (showParam === 'off') {
        isVisible.value = false;
    }

    // Initialize selected filters from query string
    const upgradeType = urlParams.get('type');
    const rebateProgram = urlParams.get('program');
    const serviceRegion = urlParams.get('region');

    // Update the corresponding reactive properties with URI-decoded values
    if (upgradeType) {
      const decodedUpgradeType = decodeURIComponent(upgradeType);
      if (types.value.includes(decodedUpgradeType)) {
        selectedUpgradeType.value = decodedUpgradeType;
      } else {
        console.warn(`Invalid upgrade type: ${decodedUpgradeType}`);
      }
    }

    if (rebateProgram) {
      const decodedRebateProgram = decodeURIComponent(rebateProgram);
      if (programs.value.includes(decodedRebateProgram)) {
        selectedProgram.value = decodedRebateProgram;
      } else {
        console.warn(`Invalid rebate program: ${decodedRebateProgram}`);
      }
    }

    if (serviceRegion) {
      const decodedServiceRegion = decodeURIComponent(serviceRegion);
      if (locations.value.includes(decodedServiceRegion)) {
        selectedLocation.value = decodedServiceRegion;
      } else {
        console.warn(`Invalid service region: ${decodedServiceRegion}`);
      }
    }

    // Stop showing the loading message once data is initialized
    showLoadingMessage.value = false;
  }
});



</script>

<style lang='scss' scoped>
// See bcgov-plugin-cleanbc/styles/public/betterhomes/_vue-apps.scss
#contractorFilterApp {}
</style>