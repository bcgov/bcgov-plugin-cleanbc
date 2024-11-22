<template>
  <div class="inner">
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Frequently Asked Questions Listings</h2>
    <!-- Skip to results link -->
    <a href="#faqsResults" class="sr-only skip-to-results">Skip to results</a>
    <!-- Filter Controls -->
    <div id="faqsFilterControls" class="faqsFilterControls filter-container">
        <!-- Primary Filter: Text Search Input -->
        <div class="control text-search">
          <label for="textSearch" class="">Type to filter results</label>
          <input id="textSearch"
            type="text"
            class="input input--text"
            v-model="textSearch"
            name="textSearch"
            placeholder="Search FAQs..."/>
        </div>

        <!-- Primary Filter: Category Select -->
        <div class="control category-select">
          <label for="categorySelect" class="">Choose a category</label>
          <div class="custom-select">
              <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="categorySelect" class="select select--category" v-model="selectedCategory" :required="true" data-active="false">
                  <option value="all">All Categories</option>
                  <option v-if="!isLoading" v-for="(category, index) in categories" :key="category" :value="category">{{ category }}</option>
              </select>
          </div>
        </div>

        <!-- Secondary Filter: Additional filters accordion for mobile. -->
        <div class="control additional-filters additional-filters--mobile accordion">
          <!-- Filters -->
          <div class="filter filter--types">
            <h2>
              <button id="additionalFiltersAccordionTrigger"
                class="accordion-trigger"
                aria-expanded="false"
                aria-controls="additionalFiltersAccordionPanel"
                type="button">
                <span class="accordion-title">Additional filters</span>
                <span class="accordion-icon"></span>
              </button>
            </h2>
            <div id="additionalFiltersAccordionPanel"
              class="filter filter__list accordion-panel"
              role="region"
              aria-labelledby="additionalFiltersAccordionTrigger"
              hidden>
              <div class="inner">
                <fieldset class="filter__list" v-if="!isLoading && faqs">
                  <div :class="`filter__item radio radio--all all ${ 'all' === selectedAdditionalFilter ? isCheckedClass : '' }`">
                    <input id="typeAll--mobile"
                        data-filter-value="all"
                        class="sr-only"
                        type="radio"
                        name="additionalFiltersMobile"
                        value="all"
                        :aria-checked="'all' === selectedAdditionalFilter ? true : false"
                        aria-disabled="false"
                        :checked="'all' === selectedAdditionalFilter ? true : false"
                        @click="handleSelectAllInputFilter">
                    <label for="typeAll--mobile">Show All <span class="sr-only">Results: </span> ({{ handleFilterPostCount('all') }})</label>
                  </div>
                  <!-- Note regarding .replace() implementations: we run .replace() twice to improve selector name quality.  The first .replace() call can result in multiple -- instances within the class's dynamic name. -->
                  <div v-for="(filter, index) in additional_filters" :key="index" :class="`filter__item radio radio--${filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,'-').replace(/--/g, '-')} ${ filter === selectedAdditionalFilter ? isCheckedClass : '' }`">
                    <input :id="filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,'-').replace(/--/g, '-') + '--mobile'"
                        :data-filter-value="filter.toLowerCase().replace(/ /g, '_')"
                        class="sr-only"
                        type="radio"
                        v-model="selectedAdditionalFilter"
                        name="additionalFiltersMobile"
                        :value="filter"
                        :aria-checked="filter === selectedAdditionalFilter ? true : false"
                        :aria-disabled="0 === handleFilterPostCount(filter) ? true : false"
                        :disabled="0 === handleFilterPostCount(filter) ? true : false"
                        :checked="filter === selectedAdditionalFilter ? true : false">
                    <label :for="filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,'-').replace(/--/g, '-') + '--mobile'">{{ filter }} <span class="sr-only">Number of results: </span>({{ handleFilterPostCount(filter) }})</label>
                  </div>
                </fieldset>
              </div>
            </div>
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
        <div class="faqsFilterPagination control pagination pagination--top">
            <!-- Previous Page Button -->
            <button class="prev-page" @click.prevent="prevPage" :disabled="currentPage === 1" tabindex="0" type="button">Previous Page</button>
            <!-- Current Page & Totals -->
            <span class="pages">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            <!-- Next Page Button -->
            <button class="next-page" @click.prevent="nextPage" :disabled="currentPage === totalPages" tabindex="0" type="button">Next Page</button>

            <!-- Results Information -->
            <span class="totals">
                Showing <span class="results-count"><span class="numValue paginated-faqs">{{paginatedFaqs.length }}</span> of <span class="numValue filtered-faqs">{{ filteredFaqs.length }}</span></span> Frequently Asked Questions
            </span>

            <span class="sr-status sr-only">
                <span class="results-count" role="status" aria-live="polite">Showing <span class="numValue paginated-faqs">{{paginatedFaqs.length }}</span> of <span class="numValue filtered-faqs">{{ filteredFaqs.length }}</span> Frequently Asked Questions {{ currentTypeFilterMessage }}.</span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>
        </div>
    </div>

    <!-- FAQs Tool -->
    <div id="faqsTool" class="faqsTool">
      <!-- FAQs Sidebar -->
      <div id="faqsSidebar" class="faqsSidebar sidebar" role="complementary">
        <!-- Secondary Filter: Additional Filters -->
        <div class="filter filter--types">
          <h2>Additional filters</h2>
          <fieldset class="filter__list" v-if="!isLoading && faqs">
            <legend class="sr-only">Additional Filters:</legend>
            <!-- All Filter -->
            <div :class="`filter__item radio radio--all all ${ 'all' === selectedAdditionalFilter ? isCheckedClass : '' }`">
              <input id="typeAll"
                  data-filter-value="all"
                  class="sr-only"
                  type="radio"
                  name="additionalFilters"
                  value="all"
                  :aria-checked="'all' === selectedAdditionalFilter ? true : false"
                  aria-disabled="false"
                  :checked="'all' === selectedAdditionalFilter ? true : false"
                  @click="handleSelectAllInputFilter"
                  @touchend="handleSelectAllInputFilter">
              <label for="typeAll">Show All <span class="sr-only">Results: </span> ({{ handleFilterPostCount('all') }})</label>
            </div>
            <!-- Filter element loop -->
            <div v-for="(filter, index) in additional_filters" :key="index" :class="`filter__item radio radio--${filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,'-').replace(/--/g, '-') } ${ filter === selectedAdditionalFilter ? isCheckedClass : '' }`">
              <input :id="filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,'-').replace(/--/g, '-')"
                  :data-filter-value="filter.toLowerCase().replace(/ /g, '_')"
                  class="sr-only"
                  type="radio"
                  v-model="selectedAdditionalFilter"
                  name="additionalFilters"
                  :value="filter"
                  :aria-checked="filter === selectedAdditionalFilter ? true : false"
                  :aria-disabled="0 === handleFilterPostCount(filter) ? true : false"
                  :disabled="0 === handleFilterPostCount(filter) ? true : false"
                  :checked="filter === selectedAdditionalFilter ? true : false">
              <label :for="filter.toLowerCase().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,'-').replace(/--/g, '-')">{{ filter }} <span class="sr-only">Number of results: </span>({{ handleFilterPostCount(filter) }})</label>
            </div>
          </fieldset>
        </div>
      </div>
      <!-- FAQs Results -->
      <div id="faqsResults" class="faqsResults results">
        <h2 class="results__title">Results (<span class="counter__value">{{ filteredFaqs.length }}</span>)</h2>

        <div v-if="!isLoading" class="controls controls--accordions">
          <!-- Close All Accordions Button -->
          <div class="control expand-accordions">
            <button class="expand-accordions" @click.prevent="openAllAccordions"
                @touchend="openAllAccordions"
                @keydown.enter.prevent="openAllAccordions"
                type="button">
                Expand all
            </button>
          </div>

          <!-- Close All Accordions Button -->
          <div class="control close-accordions">
            <button class="close-accordions" @click.prevent="closeAllAccordions"
                @touchend="closeAllAccordions"
                @keydown.enter.prevent="closeAllAccordions"
                type="button">
                Collapse all
            </button>
          </div>
        </div>

        <!-- Page of Results -->
        <div :class="`page page--${currentPage}`">
          <!-- Loading Message -->
          <div v-if="isLoading" class="is-loading" role="status" aria-live="polite">
              <div class="inner">
                  <p class="no-results loading">Retrieving a list of FAQs, please wait...</p>
              </div>
          </div>
          <!-- No Results Message -->
          <div v-if="filteredFaqs.length === 0 && !isLoading" class="no-results">
            <div>
              <p class="no-results" role="status" aria-live="polite">Sorry, no results found.</p>
            </div>
          </div>
          <!-- Results Loop -->
          <template v-if="faqs.length > 0 && !isLoading" v-for="(faq, index) in paginatedFaqs" :key="index">
              <article :class="`faq accordion result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`" :data-keywords="faq.keywords">
                  <h3>
                    <button :id="`faqAccordionTrigger--${faq.id}`"
                      class="accordion-trigger"
                      aria-expanded="false"
                      :aria-controls="`faqAccordionPanel--${faq.id}`"
                      type="button">
                      <span class="accordion-title">{{ faq.title }}</span>
                      <span class="accordion-icon"></span>
                    </button>
                  </h3>
                  <div :id="`faqAccordionPanel--${faq.id}`"
                    class="accordion-panel"
                    role="region"
                    :aria-labelledby="`faqAccordionTrigger--${faq.id}`"
                    hidden>
                    <div class="inner">
                      <div v-if="faq.building_types.length || faq.categories.length" class="faq__terms">
                        <div v-if="faq.building_types.length" class="faq__building-types">
                          <p>If you're:</p>
                          <ul>
                            <li v-for="building_type in faq.building_types">{{ building_type.name }}</li>
                          </ul>
                        </div>
                        <div v-if="faq.categories.length" class="faq__faq-types">
                          <p>{{ 1 < faq.categories.length ? 'Categories:' : 'Category:'  }}</p>
                          <ul>
                            <li v-for="faq_category in faq.categories">{{ faq_category.name }}</li>
                          </ul>
                        </div>
                        <div class="faq__permalinks">
                          <div class="inner">
                            <div class="faq__link">
                              <a :href="faq.post_url"
                                class="copy-link"
                                @click.stop.prevent="addFaqLinkToClipboard"
                                @touchend.stop.prevent="addFaqLinkToClipboard">
                                Copy FAQ link
                              </a>
                              <span class="copy-message isFadedOut" role="status" aria-live="polite"></span>
                            </div>
                            <div class="faq__link">
                              <a :href="faq.post_url"
                                class="visible-link"
                                target="_blank">
                                Open this FAQ in a new tab/window.
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="faq__body" v-html="faq.body"></div>
                      <div class="faq__close">
                        <button :id="`faqAccordionTrigger--${faq.id}--close`"
                          class=""
                          @click.stop.prevent="collapseThisFaq"
                          @touchend.stop.prevent="collapseThisFaq"
                          :aria-controls="`faqAccordionPanel--${faq.id}`"
                          type="button">
                          <span class="accordion-title">Collapse this FAQ</span>
                        </button>
                      </div>
                    </div>
                  </div>
              </article>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Vue Composition API imports for reactive data and lifecycle hooks.
 *
 * This section imports necessary functions from the Vue Composition API for managing reactive data and lifecycle hooks.
 *
 * @type {{ ref: Function, onMounted: Function, computed: Function, watch: Function, onUpdated: Function }}
 * @namespace VueCompositionAPI
 */
 import {
    ref,
    onMounted,
    computed,
    watch,
    onUpdated
} from 'vue';


/**
 * Ref for storing an array of FAQs.
 *
 * @type {Ref<Array>} - A reference to an array containing FAQs.
 */
const faqs = ref([]);

/**
 * Ref for the current text search input.
 */
const defaultTextSearch = ref('');
const textSearch = ref('');
const defaultSelectedAdditionalFilter = ref('all');

/**
 * Ref for the default selected category.
 *
 * @type {Ref<String>} - A reference to the default selected category.
 */
const defaultSelectedCategory = ref('all');

/**
 * Ref for the currently selected category.
 *
 * @type {Ref<String>} - A reference to the currently selected category.
 */
const selectedCategory = ref('all');

const selectedAdditionalFilter = ref('all');

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
const isCheckedClass = ref('is-checked');

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
  'pqeasData',
	'pqeasTimestamp',
	'rebatesData',
	'rebatesTimestamp',
]);

const oldPaginatedFaqsCount = ref(0);
const oldFilteredFaqsCount = ref(0);

/**
 * Ref for storing the public domain URL.
 *
 * @type {Ref<String>} - A reference to the public domain URL.
 */
const publicDomain = ref('https://betterhomes.gov.bc.ca');

/**
 * Variable for constructing the API URL for fetching FAQs.
 *
 * @type {String} - The constructed API URL for fetching FAQs.
 */
const faqsAPI = `${window.site?.domain ? window.site.domain : publicDomain}/wp-json/custom/v1/faqs`;


/**
 * Computed property to handle filtering FAQs by category and/or location.
 *
 * Uses the selected location to filter FAQs based on location and incorporates the results from category filtering.
 *
 * @type {Array} - An array containing the filtered FAQs based on selected category and/or location.
 */
const filteredFaqs = computed(() => {
	let filteredFaqs = [...filteredFaqsByCategory.value];
	const selectedAdditional = selectedAdditionalFilter.value;
	const searchValue = textSearch.value.toLowerCase().trim();

	if (searchValue) {
		const searchWords = searchValue.split(/\s+/);
		filteredFaqs = filteredFaqs.filter(faq => {
			const titleWords = faq.title.toLowerCase().split(/\s+/);
			const keywordWords = faq.keywords.toLowerCase().split(/\s+/);
			const uniqueWords = [...new Set([...titleWords, ...keywordWords])];
			const combinedText = uniqueWords.join(' ');
			return searchWords.every(word => combinedText.includes(word));
		});
	}

	if ('all' !== selectedAdditional) {
		filteredFaqs = filteredFaqs.filter(faq => faq.additional_filters && faq.additional_filters.some(filter => filter.name === selectedAdditional));
	}

	resetSelectsActiveState();

  setTimeout(() => {
    null
  }, 1000);

	return filteredFaqs;
});

// Define a computed property to filter faqs based on the selected category
const filteredFaqsByCategory = computed(() => {
	const selectedCat = selectedCategory.value;
	currentPage.value = 1;

	history.replaceState(selectedAdditionalFilter.value, defaultSelectedAdditionalFilter.value);

	if (selectedCat === 'all') {
		return faqs.value;
	} else {
		return faqs.value.filter(faq => faq.categories && faq.categories.some(category => category.name === selectedCat));
	}
});

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
 * Computed property to calculate the total number of pages for paginated FAQs.
 *
 * Uses the length of filtered FAQs and the page size to determine the total number of pages.
 *
 * @type {number} - The total number of pages for paginated FAQs.
 */
const totalPages = computed(() => {
	const totalFaqs = filteredFaqs.value.length;
	return totalFaqs > 0 ? Math.ceil(totalFaqs / pageSize.value) : 1;
});


/**
 * Computed property to calculate the paginated FAQs.
 *
 * Uses the current page and page size to determine the slice of filtered FAQs to display.
 *
 * @type {Array} - An array containing the paginated FAQs for the current page.
 */
const paginatedFaqs = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return filteredFaqs.value.slice(start, end);
});

/**
 * Function to navigate to the previous page in paginated results.
 *
 * Decrements the current page if it is greater than 1.
 *
 * @returns {number|null} - The updated current page value or null if already on the first page.
 */
const prevPage = () => {
  closeAllAccordions();

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
  closeAllAccordions();

	return currentPage.value < totalPages.value ? currentPage.value++ : null;
};

/**
 * Computed property to extract unique EA Project Types (ea-project-types) from FAQs.
 * Iterates through the FAQs to collect distinct project type names and sorts them alphabetically.
 *
 * @type {Array} - An array containing unique EA Project Types sorted alphabetically.
 */
const categories = computed(() => {
	const uniqueCategories = new Set();

	// Iterate through FAQs to collect distinct project type names.
	faqs.value.forEach(faq => {
		if (faq.categories) {
			if (typeof faq.categories === 'string') {
				uniqueCategories.add(faq.categories);
			} else if (Array.isArray(faq.categories)) {
				faq.categories.forEach(category => {
					uniqueCategories.add(category.name);
				});
			}
		}
    if (faq.product_categories) {
      if (typeof faq.product_categories === 'string') {
				uniqueCategories.add(faq.product_categories);
			} else if (Array.isArray(faq.product_categories)) {
				faq.product_categories.forEach(category => {
					uniqueCategories.add(category.name);
				});
			}
    }
	});

	// Convert Set to array and sort alphabetically.
	const sortedCategories = Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
	// const sortedCategories = Array.from(uniqueCategories);
	return [...sortedCategories];
});

/**
 * Computed property to extract unique additional filters from FAQs.
 *
 * This computed property iterates through the FAQs data to collect distinct additional filter types and returns them as an array.
 * It handles both string and array formats of additional_filters within the FAQs data.
 *
 * @type {Array} - An array containing unique additional filter types extracted from FAQs.
 */
 const additional_filters = computed(() => {
    const uniqueTypes = new Set();

    // Iterate through FAQs to collect distinct additional filter types.
    faqs.value.forEach(faq => {
        if (faq.additional_filters) {
            if (typeof faq.additional_filters === 'string') {
                uniqueTypes.add(faq.additional_filters);
            } else if (Array.isArray(faq.additional_filters)) {
                faq.additional_filters.forEach(filter => {
                    if (filter && filter.name) {
                        uniqueTypes.add(filter.name);
                    }
                });
            }
        }
    });

    // Convert Set to array and return unique additional filter types.
    return [...uniqueTypes];
});

/**
 * Computed property for generating a filter results message based on the selected category.
 * Indicates whether the selected category is the default, and provides a message accordingly.
 *
 * @type {String} - A string indicating the filter results message based on the selected category.
 */
const currentTypeFilterMessage = computed(() => {
  let messageText = ref('');

  if ( defaultSelectedCategory.value === selectedCategory.value ) {
    messageText.value += "in all categories ";
  } else {
    messageText.value += "in the category: " + selectedCategory.value + " ";
  }

  if ( "" !== textSearch.value ) {
    messageText.value += "filtered by the text search: " + textSearch.value + " ";
  }

  return messageText.value;
});

/**
 * Clears all selected locations and types and resets the filter, removes the hash from the URL,
 * scrolls smoothly to the categories filter container, and checks for external links.
 *
 * @returns {void}
 */
const clearFilters = () => {
	const allActiveFilters = document.querySelectorAll(`.${isCheckedClass.value}`);
	const filterAll = document.querySelectorAll('.all');

	resetSelectsActiveState();

	selectedCategory.value = defaultSelectedCategory.value;
	textSearch.value = defaultTextSearch.value;
	selectedAdditionalFilter.value = defaultSelectedAdditionalFilter.value;

	allActiveFilters.length ? allActiveFilters.forEach((activeFilter) => {
		activeFilter.classList.remove(isCheckedClass.value)
	}) : null;
	filterAll.checked = true;
	filterAll.forEach((checkbox) => {
		checkbox.classList.add(isCheckedClass.value)
	});

	handleResetAppState();
  closeAllAccordions();

	currentPage.value !== 1 ? handleUpdatingAnimationClass('.control.pagination .pages') : null;
	currentPage.value = 1;
};

/**
 * Function to reset the application state using browser history.
 *
 * This function resets specific reactive data values to their default states by updating the browser history state.
 * It utilizes the browser's history API to replace current state values with default values.
 *
 * @returns {void}
 */
 const handleResetAppState = () => {
    // Reset selectedCategory value to defaultSelectedCategory value in browser history.
    history.replaceState(selectedCategory.value, defaultSelectedCategory.value);

    // Reset textSearch value to defaultTextSearch value in browser history.
    history.replaceState(textSearch.value, defaultTextSearch.value);

    // Reset selectedAdditionalFilter value to defaultSelectedAdditionalFilter value in browser history.
    history.replaceState(selectedAdditionalFilter.value, defaultSelectedAdditionalFilter.value);
};

/**
 * Handler function to select all input filters and update the state accordingly.
 *
 * This function is triggered when an input filter labeled as "All" is selected.
 * It updates the selectedAdditionalFilter value to 'all' based on the event target ID.
 * Additionally, it clears all active filter classes except for the "All" filter.
 * It updates the pagination current page value to 1 and triggers a UI animation if necessary.
 *
 * @param {Event} event - The event triggered by selecting the input filter.
 * @returns {void}
 */
 const handleSelectAllInputFilter = (event) => {
    // Find the container element containing the filter list.
    const container = event.target.closest('.filter__list');

    // Find the "All" filter element within the container.
    const filterAll = container.querySelector('.all');

    // Find all active filters with the isCheckedClass value within the container.
    const allActiveFilters = container ? container.querySelectorAll(`.${isCheckedClass.value}`) : null;

    // Update selectedAdditionalFilter value to 'all' if the event target ID matches.
    if ( event.target.id === "typeAll" || event.target.id === "typeAll--mobile" ) {
        selectedAdditionalFilter.value = 'all';
    }

    // Remove isCheckedClass from all active filters except for the "All" filter.
    allActiveFilters.forEach((activeFilter) => {
        if (activeFilter !== filterAll) {
            activeFilter.classList.remove(isCheckedClass.value);
        }
    });

    // Add isCheckedClass to the parent node of the event target if it's not already added.
    if (!event.target.parentNode.classList.contains(isCheckedClass.value)) {
        event.target.parentNode.classList.add(isCheckedClass.value);
    }

    // Check the "All" filter checkbox to select it.
    filterAll.checked = true;

    // Reset the current pagination page to 1 and trigger a UI animation if necessary.
    if (currentPage.value !== 1) {
        handleUpdatingAnimationClass('.control.pagination .pages');
    }
    currentPage.value = 1;
};

/**
 * Reset the active state of custom select elements.
 *
 * This function removes the 'is-active' class from all custom select elements
 * within the '#faqFilterApp' container, ensuring that no custom select element
 * remains in an active state.
 *
 * @returns {void}
 */
 const resetSelectsActiveState = () => {
    // Select all custom select elements that are currently active within the specified container.
    let activeSelects = document.querySelectorAll('#faqFilterApp .custom-select.is-active');

    // Check if there are any active custom select elements.
    if (activeSelects.length > 0) {
        // Iterate over each active custom select element and remove the 'is-active' class.
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
 * Calculate the count of FAQ posts based on the specified filter and search criteria.
 *
 * This function filters FAQ posts based on a specific filter (`thisFilter`) and search criteria (`textSearch.value`).
 * It counts the number of FAQ posts that match the filter and search conditions and updates the DOM accordingly.
 * If no FAQ posts match the criteria, it disables the corresponding radio input in the FAQ sidebar.
 *
 * @param {string} thisFilter - The filter used to narrow down FAQ posts.
 * @returns {number} The count of FAQ posts that match the filter and search criteria.
 */
 const handleFilterPostCount = (thisFilter) => {
    const app = document.querySelector('#faqFilterApp');
    // Get the lowercase trimmed search value.
    const searchValue = textSearch.value.toLowerCase().trim();
    const filterContainers = app ? app.querySelectorAll('.filter--types') : null;

    // Create a copy of filtered FAQs by category to perform additional filtering.
    let altFilteredFaqs = [...filteredFaqsByCategory.value];
    // Initialize the count based on the current number of filtered FAQs.
    let count = altFilteredFaqs.length;

    // Perform search filtering if search value is provided.
    if (searchValue) {
        const searchWords = searchValue.split(/\s+/);
        altFilteredFaqs = altFilteredFaqs.filter(faq => {
            const titleWords = faq.title.toLowerCase().split(/\s+/);
            const keywordWords = faq.keywords.toLowerCase().split(/\s+/);
            const uniqueWords = [...new Set([...titleWords, ...keywordWords])];
            const combinedText = uniqueWords.join(' ');
            return searchWords.every(word => combinedText.includes(word));
        });
    }

    // Apply additional filter if it's not set to 'all'.
    if ('all' !== thisFilter) {
        altFilteredFaqs = altFilteredFaqs.filter(faq => faq.additional_filters && faq.additional_filters.some(filter => filter.name === thisFilter));
    }

    // Update the count based on the filtered FAQs.
    count = altFilteredFaqs.length;

    if ( filterContainers.length ) {
      filterContainers.forEach((filterContainer) => {
        // Find the radio input element corresponding to the specified filter.
        const radioInput = filterContainer ? filterContainer.querySelector('.radio input[value=\"' + thisFilter + '\"]') : null;

        // Disable the radio input and update DOM if no FAQ posts match the criteria.
        if ( radioInput ) {
          if ( 0 === count ) {
            // Manage helper CSS classes.
            radioInput.parentNode.classList.remove(isCheckedClass.value);
            radioInput.parentNode.classList.add('is-disabled');

            // If this item is currently selected, reset the additional filters.
            if ( selectedAdditionalFilter.value === radioInput.name ) {
              // Single-select input, so just reset filter configuration.
              selectedAdditionalFilter.value = defaultSelectedAdditionalFilter.value;
            }
          } else {
            // Remove CSS helper class.
            radioInput.parentNode.classList.remove('is-disabled');
          }
        }
      });
    }

    // Return the count of FAQ posts that match the filter and search criteria.
    return count;
};


/**
 * Fetches faq data either from sessionStorage cache (if available and not expired) or from the WordPress API.
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
		const cachedData = sessionStorage.getItem('faqsData');
		const cachedTimestamp = sessionStorage.getItem('faqsTimestamp');
		if (cachedData && cachedTimestamp) {
			const timeElapsed = Date.now() - parseInt(cachedTimestamp);
			const hoursElapsed = timeElapsed / (1000 * 60 * 60);
			if (hoursElapsed < 24) {
				// Data exists in cache and it's not expired.
				faqs.value = JSON.parse(cachedData);
				showLoadingMessage.value = false;
				// Set loading state to false after data is fetched.
				isLoading.value = false;
				return;
			}
		}

		// Fetch data from API
		fetch(faqsAPI, {
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
				sessionStorage.setItem('faqsData', JSON.stringify(json));
				sessionStorage.setItem('faqsTimestamp', Date.now());
				faqs.value = json;
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
 * Watches changes in the 'paginatedFaqs' reactive variable and triggers animations when the number of items changes.
 * This function watches the 'paginatedFaqs' variable and calls 'handleUpdatingAnimationClass' to animate changes in the UI.
 */
 watch(paginatedFaqs, () => {
    // Check if the number of paginated FAQs has changed.
    if (oldPaginatedFaqsCount.value !== paginatedFaqs.value.length) {
        // Update the 'oldPaginatedFaqsCount' with the new length of 'paginatedFaqs'.
        oldPaginatedFaqsCount.value = paginatedFaqs.value.length;
        // Trigger animation by adding/removing CSS classes to elements matching the specified CSS selector.
        handleUpdatingAnimationClass('.control.pagination .paginated-faqs');
    }
});

/**
 * Watches changes in the 'filteredFaqs' reactive variable and triggers animations when the number of items changes.
 * This function watches the 'filteredFaqs' variable and calls 'handleUpdatingAnimationClass' to animate changes in the UI.
 */
watch(filteredFaqs, () => {
    // Check if the number of filtered FAQs has changed.
    if (oldFilteredFaqsCount.value !== filteredFaqs.value.length) {
        // Update the 'oldFilteredFaqsCount' with the new length of 'filteredFaqs'.
        oldFilteredFaqsCount.value = filteredFaqs.value.length;
        // Trigger animation by adding/removing CSS classes to elements matching the specified CSS selector.
        handleUpdatingAnimationClass('.control.pagination .filtered-faqs');
        handleUpdatingAnimationClass('.counter__value');
    }

  closeAllAccordions();
});

/**
 * Watches changes in the 'currentPage' reactive variable and triggers animations on the current page UI element.
 * This function watches the 'currentPage' variable and calls 'handleUpdatingAnimationClass' to animate changes in the UI.
 */
 watch(currentPage, () => {
    // Trigger animation for the 'current-page' element when 'currentPage' changes.
    handleUpdatingAnimationClass('.control.pagination .current-page');
});

/**
 * Watches changes in the 'totalPages' reactive variable and triggers animations on the total pages UI element.
 * This function watches the 'totalPages' variable and calls 'handleUpdatingAnimationClass' to animate changes in the UI.
 */
watch(totalPages, () => {
    // Trigger animation for the 'total-pages' element when 'totalPages' changes.
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
watch([selectedCategory, textSearch], () => {
	currentPage.value = 1;
});

/**
 * Window event listener for handling custom-select active state.
 * This event listener listens for click events on the window and checks if the clicked element is not within an active custom-select dropdown.
 * If no custom-select dropdown within the 'faqFilterApp' context is active, it resets all active custom-select elements.
 * @param {Event} event - The click event triggered on the window.
 */
 window.addEventListener('click', (event) => {
    // Check if the clicked element is not within an active custom-select dropdown in the 'faqFilterApp' context.
    if (!event.target.closest('.custom-select.is-active' || document.querySelectorAll('#faqFilterApp .custom-select.is-active').length)) {
        // Reset all active custom-select elements.
        resetSelectsActiveState();
    }
});

/**
 * Initializes accordion components for a list of DOM elements.
 *
 * @param {Array<Element>} accordions - An array of DOM elements representing accordions.
 */
 function initAccordions(accordions) {
    accordions.forEach((accordionEl) => {
        new Accordion(accordionEl);
    });
}

/**
 * Copies FAQ link to clipboard using the Navigator API.
 *
 * @param {Event} event - The event object triggered by the click action.
 */
 function addFaqLinkToClipboard(event) {
    handleLinkCopiedMessageContent(event);

    // Add to clipboard via Navigator API.
    if (navigator.clipboard) {
        // Copy FAQ link to clipboard
        navigator.clipboard.writeText(event.target.href);
    }
}

/**
 * Injects messageToUser into ARIA live region node.
 *
 * @param {Event} event - The event object triggered by the click action.
 */
function handleLinkCopiedMessageContent(event) {
  const item = event.target.closest('.faq');
  const messageToUser = ref('Link to FAQ copied to clipboard!');
  const messageArea = item ? item.querySelector('.copy-message') : null;

  if ( messageArea && messageArea.classList.contains('isFadedOut') ) {
    // Inject message to user, triggering ARIA live region.
    messageArea.innerText = messageToUser.value;

    // Show copy message and fade out after a delay.
    messageArea.classList.remove('isFadedOut');
    // Wait before re-adding the opacity class.
    setTimeout(() => { messageArea.classList.add('isFadedOut'); }, 1000);
    // Check again, in case of double-click.
    setTimeout(() => { if ( messageArea.classList.contains('isFadedOut') ) {
      messageArea.innerText = '';
    } }, 1600);

  }
}

/**
 * A Vue lifecycle hook that is called after the instance has been mounted.
 * It retrieves various attributes from the 'postFilterApp' element and assigns them to reactive properties.
 * It also shows a loading message, fetches data, and then handles the URL hash.
 *
 * @returns {void}
 */
onMounted(() => {
	fetchData();

	const appElement = document.getElementById('faqFilterApp');
	showLoadingMessage.value = true;

	if (window.site?.domain) {}

	if (undefined === navigator) {
		appElement.classList.add('noNavigator');
	}
});

/**
 * Watches for updates and initializes accordions for FAQ elements after updates.
 */
 onUpdated(() => {
    // Select all FAQ accordions
    const accordions = document.querySelectorAll('.faq.accordion h3');
    const mobileAccordions = document.querySelectorAll('.additional-filters--mobile h2');

    // Initialize accordions if found
    accordions.length ? initAccordions(accordions) : null;
    mobileAccordions.length ? initAccordions(mobileAccordions) : null;
});

/**
 * Represents an accordion component that manages the opening and closing of content sections.
 */
 class Accordion {
    /**
     * Creates an instance of Accordion.
     *
     * @param {HTMLElement} domNode - The root element of the accordion.
     */
    constructor(domNode) {
        this.rootEl = domNode;
        this.buttonEl = this.rootEl.querySelector('button[aria-expanded]');

        if (this.rootEl && this.buttonEl) {
            const controlsId = this.buttonEl.getAttribute('aria-controls');
            this.contentEl = document.getElementById(controlsId);

            this.open = this.buttonEl.getAttribute('aria-expanded') === 'true';

            // Add event listener to handle button click
            this.buttonEl.addEventListener('click', this.onButtonClick.bind(this));
        }
    }

    /**
     * Toggles the state of the accordion (open or closed) based on the specified 'open' parameter.
     *
     * @param {boolean} open - The desired open state of the accordion.
     */
    toggle(open) {
        // Don't do anything if the open state doesn't change
        if (open === this.open) {
            return;
        }

        // Update the internal state
        this.open = open;

        // Handle DOM updates
        this.buttonEl.setAttribute('aria-expanded', `${open}`);
        if (open) {
            this.contentEl.removeAttribute('hidden');
        } else {
            this.contentEl.setAttribute('hidden', '');
        }
    }

    /**
     * Event handler for the button click event.
     * Toggles the open state of the accordion and updates the corresponding CSS class.
     */
    onButtonClick() {
        this.toggle(!this.open);
        this.open ? this.rootEl.closest('.accordion').classList.add('isOpen') : this.rootEl.closest('.accordion').classList.remove('isOpen');
    }

    /**
     * Opens the accordion.
     */
    open() {
        this.toggle(true);
    }

    /**
     * Closes the accordion.
     */
    close() {
        this.toggle(false);
    }
}

function openAllAccordions() {
  const closedAccordions = document.querySelectorAll('.accordion:not(.isOpen)');

  closedAccordions.forEach((closedAccordion) => {
    let accordion = new Accordion(closedAccordion);
    accordion.toggle(false);
    accordion.toggle(true);
    accordion.rootEl.classList.add('isOpen');
  });
}

function closeAllAccordions() {
  const openAccordions = document.querySelectorAll('.faq.accordion.isOpen');

  openAccordions.forEach((openAccordion) => {
    let accordion = new Accordion(openAccordion);
    accordion.rootEl.classList.remove('isOpen');
    accordion.toggle(false);
  });
}

function collapseThisFaq(event) {
  const faq = event.target.closest('.accordion');
  const accordion = new Accordion(faq);

  accordion.rootEl.classList.remove('isOpen');
  accordion.toggle(false);
  accordion.rootEl.focus();
}
</script>

<style lang='scss' scoped>
// See bcgov-plugin-cleanbc/styles/public/betterhomes/_vue-apps.scss
#faqFilterApp {}
</style>