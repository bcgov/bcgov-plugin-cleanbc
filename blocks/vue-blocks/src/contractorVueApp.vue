<template>
  <div class="inner">
    <!-- Skip to results link -->
    <a href="#contractorsResults" class="sr-only skip-to-results">Skip to results</a>
    <!-- Filter Controls -->
    <div v-if="isVisible || (1 < totalPages && !isVisible)" id="contractorsFilterControls" class="contractorsFilterControls filter-container">
      <h2 class='settings-headline'>Filter registered contractor list</h2>
        <div class='filter-controls-container'>
          <!--Name filter -->
          <div v-if='isVisible' class="control type-input">
            <label for="nameInput" class="">Filter by company name</label>
            <div class="custom-input">
              <input
                id="nameInput"
                type="search"
                v-model.trim="nameQuery"
                autocomplete="organization"
                placeholder="Type a company name"
              />
            </div>
          </div>

          <!-- Deprecated Location Select -->
          <div v-if='false && isVisible' class="control location-select">
            <label for="locationSelect" class="">Choose a service region</label>
            <div class="custom-select">
                <select @change="selectIsActive" @click.prevent="selectIsActive" @touchend="selectIsActive" @keyup.esc="selectIsActive" tabindex="0" id="locationSelect" class="select select--location" v-model="selectedLocation">
                    <option value="all">All Locations</option>
                    <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
                </select>
            </div>
          </div>

          <!-- Location input -->
          <div v-if="isVisible" class="control type-input location-input-control">
            <label for="locationInput">Filter by service region</label>

            <div class="custom-input">
              <input
                id="contractorLocation"
                class="location-input"
                type="text"
                inputmode="search"
                autocomplete="off"
                placeholder="The community you live closest to"
                :list="isMobile ? 'locationListMobile' : 'locationList'"
                v-model="locationInputProxy"
                @focus="handleLocationFocus"
                @blur="commitLocation('blur')"
                @change="commitLocation('change')"
                @keydown.enter.prevent="commitLocation('enter')"
                :aria-invalid="locationTouched && locationError ? 'true' : 'false'"
                :aria-describedby="locationTouched && locationError ? 'locationError' : null"
              />

            </div>
            <!-- Desktop: full datalist -->
            <datalist v-if="!isMobile" id="locationList">
              <option value="All Locations"></option>
              <option v-for="loc in locations" :key="loc" :value="loc"></option>
            </datalist>
            <!-- Mobile: proxy datalist (top 10 only) -->
           <datalist v-else id="locationListMobile">
            <!-- Empty: show only a hint -->
            <option v-if="locationQueryIsEmpty" value="Please type to find your community"></option>

            <!-- Not empty: show All Locations + top 10 suggestions -->
            <template v-else>
              <option value="All Locations"></option>
              <option v-for="loc in mobileLocationOptions" :key="loc" :value="loc"></option>
            </template>
          </datalist>

            <!-- Error information -->
            <p v-if="locationTouched && locationError" id="locationError" class="message error-message" role="alert">
              {{ locationError }}
            </p>
          </div>

          
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

        </div>

        <!-- Clear Filters Button -->
        <div v-if='isVisible' class="control reset-filters">
          <p class="totals" aria-live='polite'>
            Showing {{ displayedContractors.length }} of {{ filteredContractors.length }} contractors
          </p>

          <button class="clear-filters" @click.prevent="clearFilters"
            @touchend="clearFilters"
            @keydown.enter.prevent="clearFilters"
            type="button">
            Reset selection
          </button>
        </div>

         <!-- Add Link to Clipboard Button -->
         <div v-if='false && isVisible' class="control copy-link-btn">
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
                Showing <span class="results-count"><span class="numValue paginated-contractors">{{displayedContractors.length }}</span> of <span class="numValue filtered-contractors">{{ filteredContractors.length }}</span></span> registered contractors
            </div>

            <!-- ARIA live regions -->
            <span class="sr-status sr-only">
                <span class="results-count" role="status" aria-live="polite">Showing <span class="numValue paginated-contractors">{{ displayedContractors.length }}</span> of <span class="numValue filtered-contractors">{{ filteredContractors.length }}</span> registered contractors {{ currentTypeFilterMessage }} {{ currentLocationFilterMessage }}.</span>
                <span class="pages" role="status" aria-live="polite">Page <span class="numValue current-page">{{ currentPage }}</span> of <span class="numValue total-pages">{{ totalPages }}</span></span>
            </span>

            <!-- Load vs page mode Button -->
            <div v-if="false" class="control view-mode custom-select">
            <label for="displayMode" class='sr-only'>Choose how results are shown: page by page or continuously as you scroll.</label>
            <select id="displayMode" v-model="displayMode" class="select select--type">
              <option value="paginate">Page by page</option>
              <option value="loadMore">Show more as you scroll (50 at a time)</option>
            </select>
          </div>
        </div>
    </div>

    <!-- Contractors Results Table -->
    <h2 class="results__title">Find a registered contractor (<span class="counter__value">{{ filteredContractors.length }}</span> results)</h2>
    <table id="contractorsResults" class="contractorsResults results table table--striped">
        <caption class="sr-only">Registered Contractors</caption>
        <!-- Table Columns -->
        <colgroup>
            <col class="col col--1 odd col--contractor__company-and-location"/>
            <!-- <col class="col col--2 even col--contractor__head-office"/> -->
            <col class="col col--2 odd col--contractor__email-and-phone"/>
            <col class="col col--3 even col--contractor__upgrade-types"/>
            <col class="col col--4 odd col--contractor__program-designations"/>
        </colgroup>
        <!-- Table Header -->
        <thead>
            <tr>
                <th class="contractor-heading odd contractor-heading--company-and-location">Company name &amp; <br/>Head office location</th>
                <!-- <th class="contractor-heading even contractor-heading--contact-name">Head Office</th> -->
                <th class="contractor-heading odd contractor-heading--email-and-phone">Email & Phone</th>
                <th class="contractor-heading even contractor-heading--service-organizations">Upgrade type(s)</th>
                <th class="contractor-heading odd contractor-heading--services">Qualified program(s)</th>
            </tr>
        </thead>

        <!-- Table Body -->
        <tbody ref="resultsTbody" :class="`page page--${currentPage}`">
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
            <template
              v-if="contractors.length > 0"
              v-for="(contractor, index) in displayedContractors"
              :key="contractor.id || contractor.company_name || index"
            ><tr :class="`contractor result result--${index+1} ${0 === (index+1) % 2 ? `even` : `odd`}`">
                    <!-- Company Name and Head Office -->
                    <td data-label="Company name and head office location" class="contractor__company-and-location">
                        <!-- Company Website Link -->
                        <a v-if="contractor.company_website" class="contractor__company external-app-link" :href="contractor.company_website" target="_blank" @click="onProviderLinkClick(contractor)" :aria-label="decodeHtmlEntities(contractor.company_name) + ' website, opens in a new tab/window.'">
                            {{ contractor.company_name ? decodeHtmlEntities(contractor.company_name) : 'Website' }}
                        </a>
                        <!-- Company Name if No Website -->
                        <span v-else class="contractor__company">
                            {{ contractor.company_name ? decodeHtmlEntities(contractor.company_name) : 'No company name provided' }}
                        </span>
                        <p class='has-icon location' v-if='contractor.head_office_location'>{{ contractor.head_office_location ? contractor.head_office_location : 'Not provided' }}</p>
                    </td>

                    <!-- Company Location -->
                    <!-- <td data-label="Head Office" class="contractor__head-office">
                        <p>{{ contractor.head_office_location ? contractor.head_office_location : 'Not provided' }}</p>
                    </td> -->

                    <!-- Contact Email and Phone -->
                    <td data-label="Company email and phone" class="contractor__email-and-phone">
                        <address class='clip-text'>
                            <!-- Email Link -->
                            <a v-if="contractor.email" class="contractor__email clip-text" :href="'mailto:' + contractor.email" @click.prevent="onEmailPhoneClick(contractor, 'email')"><span v-if="false" v-html="insertBreakableChar(contractor.email)"></span>{{ contractor.email }}</a>
                            <p class="contractor__email" v-else>No email provided</p>

                            <!-- Phone Link -->
                            <a v-if="contractor.phone" class="contractor__telephone" :href="'tel:+1' + contractor.phone.replace(/-/g, '')" @click.prevent="onEmailPhoneClick(contractor, 'phone')">{{ contractor.phone }}</a>
                            <p class="contractor__telephone" v-else>No phone number provided</p>
                        </address>
                    </td>

                    <!-- Business Types -->
                    <td data-label="Upgrade type(s)" class="contractor__upgrade-types">
                        <ul v-if="contractor.types">
                            <li v-for="(type, index) in contractor.types">{{ type.name }}</li>
                        </ul>
                    </td>

                    <!-- Program Designations -->
                    <td data-label="Qualified program(s)" class="contractor__program-designations">
                        <ul v-if="contractor.program_designations?.length">
                          <template v-if="selectedProgram !== 'all'">
                            <li v-for="d in contractor.program_designations.filter(d => d?.name === selectedProgram)"
                                :key="d?.id || d?.name" :class='d.slug' class='has-icon is-uppercase' :aria-label="d.name + ' qualified'">
                              {{ d.slug }}
                            </li>
                          </template>

                          <template v-else>
                            <li v-for="d in contractor.program_designations" :key="d?.id || d?.name" :class='d.slug'  class='has-icon is-uppercase' :aria-label="d.name + ' qualified'">
                              {{ d.slug }}
                            </li>
                          </template>
                        </ul>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
  </div>
  <div  v-if="(displayedContractors.length && filteredContractors.length > displayedContractors.length) || (filteredContractors.length !== 0 && 1 !== totalPages)" class="contractorsFilterControls filter-container filter-container--bottom">
      <!-- Load more Controls -->
      <div v-if="displayMode === 'loadMore' && remainingCount > 0" class="control load-more">
        <button type="button" @click="loadMore" ref="loadMoreBtn">
          Load {{ nextLoadCount }} more contractor{{ nextLoadCount === 1 ? '' : 's' }}
        </button>

        <p class="totals">
          Showing {{ displayedContractors.length }} of {{ filteredContractors.length }}
        </p>
      </div>

    
      <!-- Lower Pagination Controls -->
    <div v-if="false && filteredContractors.length !== 0 && 1 !== totalPages" class="contractorsFilterPagination control pagination pagination--bottom">
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
    onBeforeUnmount,
    onMounted,
    computed,
    nextTick,
    watch,
    watchEffect
} from 'vue';
import { decodeHtmlEntities, shuffleArray } from '../shared-functions.js'
import { trackProviderFilterChange, trackProviderClick } from '../analytics-schemas.js'
import { localAnalyticsReady } from '../standalone-snowplow.js'

/**
 * Debounce a function so it runs only after a delay.
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} [wait=200]
 * @returns {(...args: Parameters<T>) => void}
 */
function debounce(fn, delay = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Normalize a string for case-insensitive comparisons.
 * @param {string} [s]
 * @returns {string}
 */
const normalize = (s = '') => decodeHtmlEntities(String(s)).trim().toLowerCase()

/**
 * Lightweight fuzzy include (HTML-decoded, case-insensitive).
 * @param {string} [haystack]
 * @param {string} [needle]
 * @returns {boolean}
 */
const includesFuzzy = (haystack = '', needle = '') => {
  const h = normalize(haystack)
  const n = String(needle).trim().toLowerCase()
  if (!n) return true
  return h.includes(n)
}

/**
 * Finds the closest matching location name from the set of known locations.
 * Returns at most 10 candidates when ambiguous.
 * Mirrors the "rebate tool" matching approach (exact, startsWith, includes).
 *
 * @param {string} raw
 * @param {string[]} locationList
 * @returns {{ match: string|null, reason: string, candidates?: string[] }}
 */
function findClosestLocation(raw, locationList) {
  const q = normalize(raw)

  // Ignore hint options if they ever get selected/copied into the input
  if (q === normalize(MOBILE_HINT_EMPTY) || q === normalize(MOBILE_HINT_MORE)) {
    return { match: 'all', reason: 'empty' }
  }

  if (!q) return { match: 'all', reason: 'empty' }
  if (q === 'all' || q === 'all locations') return { match: 'all', reason: 'all' }

  const list = (locationList || []).filter(Boolean)

  // 1) exact
  const exact = list.find(loc => normalize(loc) === q)
  if (exact) return { match: exact, reason: 'exact' }

  // 2) startsWith
  const starts = list
    .filter(loc => normalize(loc).startsWith(q))
    .slice(0, 10)

  if (starts.length === 1) return { match: starts[0], reason: 'startsWith' }
  if (starts.length > 1) return { match: null, reason: 'ambiguous_starts', candidates: starts }

  // 3) includes (rank "closer" by earlier match position, then shorter string)
  const includes = list
    .map(loc => ({ loc, idx: normalize(loc).indexOf(q) }))
    .filter(x => x.idx >= 0)
    .sort((a, b) => (a.idx - b.idx) || (a.loc.length - b.loc.length) || a.loc.localeCompare(b.loc))
    .map(x => x.loc)
    .slice(0, 10)

  if (includes.length === 1) return { match: includes[0], reason: 'includes' }
  if (includes.length > 1) return { match: null, reason: 'ambiguous_includes', candidates: includes }

  return { match: null, reason: 'none' }
}

/* -----------------------------------------------------------------------------
 * Core state
 * -------------------------------------------------------------------------- */

const loadMoreBtn = ref(null)

const resultsTbody = ref(null)

const contractors = ref([])
const shuffledContractors = ref([])

const isVisible = ref(true)
const showLoadingMessage = ref(true)
const isLoading = ref(false)

const nameQuery = ref('')

const defaultSelectedUpgradeType = ref('all')
const selectedUpgradeType = ref('all')

const defaultSelectedProgram = ref('all')
const selectedProgram = ref('all')

const defaultSelectedLocation = ref('all')
const selectedLocation = ref('all')

const activeClass = ref('is-active')
const updatingClass = ref('is-updating')

/** Results display mode. */
const displayMode = ref('loadMore') // 'paginate' | 'loadMore'
const pageSize = ref(30)
const visibleCount = ref(pageSize.value)
const currentPage = ref(1)

const oldPaginatedContractorsCount = ref(0)
const oldFilteredContractorsCount = ref(0)

/* -----------------------------------------------------------------------------
 * Mobile-optimized location input (rebate-tool style)
 * -------------------------------------------------------------------------- */

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

/**
 * Canonical committed value (desktop typing) and mobile typing buffer.
 * - Desktop: writes directly to locationInputValue while typing
 * - Mobile: writes to locationInputDisplay while typing, commit happens on blur/change/enter
 */
const locationInputValue = ref('')     // committed display value
const locationInputDisplay = ref('')   // mobile typing buffer

const isLocationFocused = ref(false)
const locationTouched = ref(false)
const locationError = ref('')

watch(locationInputValue, v => {
  if (isMobile.value) locationInputDisplay.value = v || ''
})

/**
 * v-model proxy matching the rebate tool.
 * @type {import('vue').ComputedRef<string>}
 */
const locationInputProxy = computed({
  get() {
    return isMobile.value ? locationInputDisplay.value : locationInputValue.value
  },
  set(val) {
    if (isMobile.value) {
      locationInputDisplay.value = val
    } else {
      locationInputValue.value = val
    }
  }
})


/**
 * Handle focus on the contractor location input.
 * Includes a small "refocus" trick that improves iOS keyboard behaviour.
 */
function handleLocationFocus() {
  isLocationFocused.value = true

  if (isMobile.value) {
    setTimeout(() => {
      document.querySelector('#contractorLocation')?.focus()
    }, 300)
  }
}

/**
 * Commit location selection only when the user is "done" (blur/change/enter).
 * Never commit/filter on every keystroke on mobile.
 *
 * @param {'blur'|'change'|'enter'} [trigger='blur']
 */
const commitLocation = (trigger = 'change') => {

  const el = document.querySelector('#contractorLocation')

  if (!isMobile && (trigger === 'enter' || trigger === 'change')) {
    if (el) el.focus()
  }

  // mark touched only when user completes interaction
  locationTouched.value = true

  // mobile: re-read DOM value to capture datalist selection reliably
  if (isMobile.value && trigger === 'blur') {
    if (el) locationInputDisplay.value = el.value
  }

  const raw = (isMobile.value ? locationInputDisplay.value : locationInputValue.value) || ''
  const list = locations.value || []
  const { match, reason, candidates = [] } = findClosestLocation(raw, list)

  // empty => reset
  if (!raw.trim()) {
    selectedLocation.value = 'all'
    locationInputValue.value = ''
    locationInputDisplay.value = ''
    locationError.value = ''
    isLocationFocused.value = false
    return
  }

  if (match) {
    selectedLocation.value = match
    locationError.value = ''
    locationInputValue.value = match === 'all' ? '' : match
    locationInputDisplay.value = match === 'all' ? '' : match
  } else {
    // invalid => don’t filter on garbage; show helpful message
    selectedLocation.value = 'all'
    const example = candidates.slice(0, 3).join(', ')
    locationError.value =
      reason.startsWith('ambiguous')
        ? `That matches multiple service regions. Please choose one from the list (e.g., ${example}${candidates.length > 3 ? '…' : ''}).`
        : 'That service region was not recognized. Please the community you live in or are closest to from the available options.'
  }

  isLocationFocused.value = false
}

const MOBILE_HINT_EMPTY = 'Please type to find your community'
const MOBILE_HINT_MORE  = 'Continue typing to see more results'

// Use whatever the user is currently typing (mobile uses display buffer)
const locationQuery = computed(() => {
  const raw = isMobile.value ? locationInputDisplay.value : locationInputValue.value
  return normalize(raw || '')
})

const locationQueryIsEmpty = computed(() => !locationQuery.value)

/**
 * Mobile-only proxy list for the datalist.
 * - starts with first 10 options when empty
 * - filters to top 10 as user types
 * - uses startsWith first, then includes as fallback
 */
const mobileLocationOptions = computed(() => {
  const list = locations.value || []
  const q = locationQuery.value
  if (!q) return []

  const starts = []
  const includes = []

  for (const loc of list) {
    const n = normalize(loc)
    if (n.startsWith(q)) starts.push(loc)
    else if (n.includes(q)) includes.push(loc)
    if (starts.length >= 10) break
  }

  if (starts.length < 10) {
    for (const loc of includes) {
      starts.push(loc)
      if (starts.length >= 10) break
    }
  }

  return starts.slice(0, 10)
})



/* -----------------------------------------------------------------------------
 * API + caching
 * -------------------------------------------------------------------------- */

const publicDomain = ref('https://betterhomes.gov.bc.ca')
const contractorsAPI = `${window.site?.domain ? window.site.domain : publicDomain.value}/wp-json/custom/v1/contractors`

const itemsToClearFromSessionStorage = ref([
  'faqsData',
  'faqsTimestamp',
  'pqeasData',
  'pqeasTimestamp',
  'rebatesData',
  'rebatesTimestamp'
])

/**
 * @param {any} error
 * @returns {boolean}
 */
const isQuotaExceededError = (error) => {
  if (!error) return false
  return (
    error.code === 22 ||
    error.code === 1014 ||
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  )
}

/**
 * Check whether a timestamp is within the last 24 hours.
 * @param {string|number} timestamp
 * @returns {boolean}
 */
const isDataValid = (timestamp) => {
  const timeElapsed = Date.now() - parseInt(String(timestamp), 10)
  const hoursElapsed = timeElapsed / (1000 * 60 * 60)
  return hoursElapsed < 24
}

/**
 * Fetch contractors from cache (session/local) or API.
 * Populates 'contractors' and 'shuffledContractors'.
 * @returns {Promise<void>}
 */
const fetchData = async () => {
  try {
    isLoading.value = true
    showLoadingMessage.value = true

    // sessionStorage
    let data = sessionStorage.getItem('contractorsData')
    let timestamp = sessionStorage.getItem('contractorsTimestamp')
    let cachedData = null

    if (data && timestamp && isDataValid(timestamp)) {
      cachedData = JSON.parse(data)
    } else {
      // localStorage
      data = localStorage.getItem('contractorsData')
      timestamp = localStorage.getItem('contractorsTimestamp')
      if (data && timestamp && isDataValid(timestamp)) {
        cachedData = JSON.parse(data)
      }
    }

    if (cachedData) {
      contractors.value = cachedData
      shuffledContractors.value = shuffleArray([...cachedData])
      showLoadingMessage.value = false
      isLoading.value = false
      return
    }

    const response = await fetch(contractorsAPI, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const json = await response.json()

    // reduce storage pressure
    try {
      itemsToClearFromSessionStorage.value.forEach((item) => sessionStorage.removeItem(item))
      sessionStorage.clear()
    } catch (clearError) {
      console.warn('Error clearing sessionStorage:', clearError)
    }

    try {
      sessionStorage.setItem('contractorsData', JSON.stringify(json))
      sessionStorage.setItem('contractorsTimestamp', Date.now().toString())
    } catch (storageError) {
      if (isQuotaExceededError(storageError)) {
        console.warn('SessionStorage quota exceeded. Falling back to localStorage.')
        try {
          localStorage.setItem('contractorsData', JSON.stringify(json))
          localStorage.setItem('contractorsTimestamp', Date.now().toString())
        } catch (lsError) {
          console.error('Error setting data in localStorage:', lsError)
        }
      } else {
        console.error('Error setting data in sessionStorage:', storageError)
        throw storageError
      }
    }

    contractors.value = json
    shuffledContractors.value = shuffleArray([...json])
    showLoadingMessage.value = false
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching contractors data:', error)
    throw error
  }
}

/* -----------------------------------------------------------------------------
 * Derived filter option lists
 * -------------------------------------------------------------------------- */

const types = computed(() => {
  const unique = new Set()
  contractors.value.forEach(contractor => {
    if (!contractor?.types) return
    if (typeof contractor.types === 'string') unique.add(contractor.types?.name)
    else if (Array.isArray(contractor.types)) contractor.types.forEach(t => unique.add(t?.name))
  })
  return Array.from(unique).filter(Boolean).sort((a, b) => a.localeCompare(b))
})

const programs = computed(() => {
  const unique = new Set()
  contractors.value.forEach(contractor => {
    if (!contractor?.program_designations) return
    if (typeof contractor.program_designations === 'string') unique.add(contractor.program_designations?.name)
    else if (Array.isArray(contractor.program_designations)) contractor.program_designations.forEach(p => unique.add(p?.name))
  })
  return Array.from(unique).filter(Boolean).sort((a, b) => a.localeCompare(b))
})

const locations = computed(() => {
  const unique = new Set()
  contractors.value.forEach(contractor => {
    if (!contractor?.locations) return
    if (typeof contractor.locations === 'string') unique.add(contractor.locations?.name)
    else if (Array.isArray(contractor.locations)) contractor.locations.forEach(l => unique.add(l?.name))
  })
  return Array.from(unique).filter(Boolean).sort((a, b) => a.localeCompare(b))
})

/* -----------------------------------------------------------------------------
 * Filtering + pagination/load more
 * -------------------------------------------------------------------------- */

const filteredContractorsByType = computed(() => {
  const selectedType = selectedUpgradeType.value
  if (selectedType === 'all') return shuffledContractors.value

  return shuffledContractors.value.filter(contractor =>
    contractor.types && contractor.types.some(type => type.name === selectedType)
  )
})

const filteredContractors = computed(() => {
  const selectedLoc = selectedLocation.value
  const selectedProg = selectedProgram.value

  let results = [...filteredContractorsByType.value]

  if (nameQuery.value) {
    results = results.filter(c => includesFuzzy(c.company_name, nameQuery.value))
  }

  // Location filter (NOTE: selectedLocation is a NAME string or 'all')
  if (selectedLoc !== 'all') {
    results = results.filter(c =>
      c.locations && c.locations.some(l => l.name === selectedLoc)
    )
  }

  // Program filter
  if (selectedProg !== 'all') {
    results = results.filter(c =>
      c.program_designations && c.program_designations.some(p => p.name === selectedProg)
    )
  }

  return results
})

const totalPages = computed(() => {
  if (displayMode.value !== 'paginate') return 1
  const total = filteredContractors.value.length
  return total > 0 ? Math.ceil(total / pageSize.value) : 1
})

const displayedContractors = computed(() => {
  if (displayMode.value === 'loadMore') {
    return filteredContractors.value.slice(0, visibleCount.value)
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredContractors.value.slice(start, end)
})

const remainingCount = computed(() =>
  Math.max(0, filteredContractors.value.length - displayedContractors.value.length)
)

const nextLoadCount = computed(() =>
  Math.min(pageSize.value, remainingCount.value)
)

/**
 * Focus the first link available in newly shown rows after "Load more".
 * @param {number} startIndex - index where new results begin
 */
const focusFirstNewLink = async (startIndex) => {
  await nextTick()
  const tbody = resultsTbody.value
  if (!tbody) return

  const rows = tbody.querySelectorAll('tr.contractor')
  for (let i = startIndex; i < rows.length; i++) {
    const link = rows[i].querySelector('a[href]:not([tabindex="-1"])')
    if (link) {
      link.focus({ preventScroll: true })
      link.scrollIntoView({ block: 'center' })
      return
    }
  }

  loadMoreBtn.value?.focus?.()
}

/**
 * Load more results (loadMore mode) then move focus to the first link in the new chunk.
 * @returns {Promise<void>}
 */
const loadMore = async () => {
  const startIndex = displayedContractors.value.length
  visibleCount.value = Math.min(
    visibleCount.value + pageSize.value,
    filteredContractors.value.length
  )
  await focusFirstNewLink(startIndex)
}

/** Go to previous page (paginate mode). */
const prevPage = () => (currentPage.value > 1 ? currentPage.value-- : null)
/** Go to next page (paginate mode). */
const nextPage = () => (currentPage.value < totalPages.value ? currentPage.value++ : null)

/* -----------------------------------------------------------------------------
 * URL assembly + copy link
 * -------------------------------------------------------------------------- */

/**
 * Assemble a sharable URL from current filter state.
 * @returns {string}
 */
const assembleUrl = () => {
  const baseUrl = window.location.origin + window.location.pathname
  const urlParams = new URLSearchParams()
  urlParams.set('tool', 'contractors')

  if (selectedUpgradeType.value && selectedUpgradeType.value !== 'all') {
    urlParams.set('type', encodeURIComponent(selectedUpgradeType.value))
  }
  if (selectedProgram.value && selectedProgram.value !== 'all') {
    urlParams.set('program', encodeURIComponent(selectedProgram.value))
  }
  if (selectedLocation.value && selectedLocation.value !== 'all') {
    urlParams.set('region', encodeURIComponent(selectedLocation.value))
  }

  return `${baseUrl}?${urlParams.toString()}`
}

/**
 * Show a temporary feedback message in the UI when link copied.
 * @param {Event} event
 * @param {string} [target='.filter-container']
 * @param {string} msg
 */
function handleLinkCopiedMessageContent(event, target = '.filter-container', msg) {
  const root = event?.target?.closest?.(target) || document.querySelector(target) || document.body
  const el = root?.querySelector?.('.copy-message')
  if (!el) return

  el.textContent = msg
  el.classList.remove('isFadedOut')

  setTimeout(() => el.classList.add('isFadedOut'), 1000)
  setTimeout(() => {
    if (el.classList.contains('isFadedOut')) el.textContent = ''
  }, 1600)
}

/**
 * Copy assembled URL to clipboard.
 * @param {Event} event
 */
const addLinkToClipboard = (event) => {
  const url = assembleUrl()
  navigator.clipboard
    ?.writeText(url)
    .then(() => handleLinkCopiedMessageContent(event, '.filter-container', 'Link copied to clipboard successfully!'))
    .catch((err) => {
      console.error('Failed to copy URL:', err)
      handleLinkCopiedMessageContent(event, '.filter-container', 'Copy failed')
    })
}

/* -----------------------------------------------------------------------------
 * UI helpers (existing behaviour)
 * -------------------------------------------------------------------------- */

/**
 * Insert breakpoints into an email string for nicer wrapping.
 * @param {string} email
 * @returns {string}
 */
const insertBreakableChar = (email) => String(email || '').replace(/@/g, '&#8203;@').replace(/\./g, '&#8203;.')

const resetSelectsActiveState = () => {
  const activeSelects = document.querySelectorAll('#contractorFilterApp .custom-select.is-active')
  activeSelects.forEach((item) => item.classList.remove('is-active'))
}

/**
 * Toggle active state on a custom select wrapper.
 * @param {Event} event
 */
const selectIsActive = (event) => {
  if (event.type !== 'click') event.target.parentNode.classList.remove(activeClass.value)
  else event.target.parentNode.classList.toggle(activeClass.value)
}

/**
 * Apply a brief "updating" animation class to DOM nodes matching selector.
 * @param {string} elementCssPath
 */
const handleUpdatingAnimationClass = (elementCssPath) => {
  const elements = document.querySelectorAll(elementCssPath)
  elements.forEach((element) => {
    element.classList.add(updatingClass.value)
    setTimeout(() => element.classList.remove(updatingClass.value), 125)
  })
}

/* -----------------------------------------------------------------------------
 * Analytics hooks
 * -------------------------------------------------------------------------- */

const onProviderLinkClick = (contractor) => {
  trackProviderClick({
    filterName: 'contractor',
    upgradeType: selectedUpgradeType.value,
    program: selectedProgram.value,
    location: selectedLocation.value,
    companyName: contractor.company_name || '',
    destination: contractor.company_website || ''
  })
}

const onEmailPhoneClick = (contractor, linkType) => {
  let label = ''
  let destination = ''

  if (linkType === 'email') {
    label = contractor.email ? `Email: ${contractor.email}` : 'Email link'
    destination = `mailto:${contractor.email}`
  } else {
    label = contractor.phone ? `Phone: ${contractor.phone}` : 'Phone link'
    destination = `tel:+1${contractor.phone?.replace(/-/g, '')}`
  }

  trackProviderClick({
    filterName: 'contractor',
    upgradeType: selectedUpgradeType.value,
    program: selectedProgram.value,
    location: selectedLocation.value,
    companyName: contractor.company_name || '',
    destination,
    label
  })
}

/* -----------------------------------------------------------------------------
 * Clear filters
 * -------------------------------------------------------------------------- */

const clearFilters = () => {
  resetSelectsActiveState()

  nameQuery.value = ''
  selectedUpgradeType.value = defaultSelectedUpgradeType.value
  selectedProgram.value = defaultSelectedProgram.value

  // location reset + input reset
  selectedLocation.value = 'all'
  locationInputValue.value = ''
  locationInputDisplay.value = ''
  locationTouched.value = false
  locationError.value = ''
  isLocationFocused.value = false

  displayMode.value = 'loadMore'
  currentPage.value = 1
  visibleCount.value = pageSize.value

  history.replaceState(selectedUpgradeType.value, defaultSelectedUpgradeType.value)
  history.replaceState(selectedLocation.value, defaultSelectedLocation.value)
  history.replaceState(selectedProgram.value, defaultSelectedProgram.value)

  if (currentPage.value !== 1) handleUpdatingAnimationClass('.control.pagination .pages')
  currentPage.value = 1
}

/* -----------------------------------------------------------------------------
 * Watchers (paging resets + analytics + UI animation)
 * -------------------------------------------------------------------------- */

watch(selectedUpgradeType, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    trackProviderFilterChange({
      filterName: 'contractor',
      upgradeType: newVal,
      program: selectedProgram.value,
      location: selectedLocation.value,
      label: `Upgrade Type changed to: ${newVal}`
    })
  }
})

watch(selectedProgram, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    trackProviderFilterChange({
      filterName: 'contractor',
      upgradeType: selectedUpgradeType.value,
      program: newVal,
      location: selectedLocation.value,
      label: `Program changed to: ${newVal}`
    })
  }
})

watch(selectedLocation, (newVal, oldVal) => {
  if (newVal === oldVal) return

  // If user is typing, don't clobber their input mid-edit.
  if (isLocationFocused.value) return

  // Keep the input aligned with applied filter.
  locationInputValue.value = newVal === 'all' ? '' : newVal

  // Clear error for valid states.
  if (newVal === 'all' || locations.value.includes(newVal)) {
    locationError.value = ''
    locationTouched.value = false
  }

  trackProviderFilterChange({
    filterName: 'contractor',
    upgradeType: selectedUpgradeType.value,
    program: selectedProgram.value,
    location: newVal,
    label: `Location changed to: ${newVal}`
  })
})

// Reset paging on any filter change.
watch([selectedUpgradeType, selectedProgram, selectedLocation, nameQuery], () => {
  currentPage.value = 1
  visibleCount.value = pageSize.value
})

watch(displayMode, () => {
  currentPage.value = 1
  visibleCount.value = pageSize.value
})

// UI animations (existing behaviour)
watch(() => displayedContractors.value.length, () => {
  // If you want to re-enable auto-load observer later, this is where you'd hook it.
})

watch(totalPages, () => handleUpdatingAnimationClass('.control.pagination .total-pages'))

watch(currentPage, () => handleUpdatingAnimationClass('.control.pagination .current-page'))

watch(displayedContractors, () => {
  if (oldPaginatedContractorsCount.value !== displayedContractors.value.length) {
    oldPaginatedContractorsCount.value = displayedContractors.value.length
    handleUpdatingAnimationClass('.control.pagination .paginated-contractors')
  }
})

watch(filteredContractors, () => {
  if (oldFilteredContractorsCount.value !== filteredContractors.value.length) {
    oldFilteredContractorsCount.value = filteredContractors.value.length
    handleUpdatingAnimationClass('.control.pagination .filtered-contractors')
    handleUpdatingAnimationClass('.counter__value')
  }
})

/* -----------------------------------------------------------------------------
 * Initialization: fetch + query-string hydration
 * -------------------------------------------------------------------------- */

watch(() => window.site?.domain, (newVal) => {
  if (newVal) fetchData()
})

onMounted(() => {
  localAnalyticsReady()

  const appElement = document.getElementById('contractorFilterApp')
  const showControls = appElement?.getAttribute('data-show-controls') === 'false'
  isVisible.value = showControls

  fetchData()
  showLoadingMessage.value = true

  const urlParams = new URLSearchParams(window.location.search)
  const showParam = urlParams.get('show')
  if (showParam === 'off') isVisible.value = true
})

watchEffect(() => {
  if (!types.value.length || !programs.value.length || !locations.value.length) return

  const urlParams = new URLSearchParams(window.location.search)
  const showParam = urlParams.get('show')

  // Tool guard
  if (urlParams.get('tool') !== null && urlParams.get('tool') !== 'contractors') {
    console.warn('Tool parameter does not match "contractors". Initialization skipped.')
    return
  }

  if (showParam === 'off') isVisible.value = false

  const upgradeType = urlParams.get('type')
  const rebateProgram = urlParams.get('program')
  const serviceRegion = urlParams.get('region')

  if (upgradeType) {
    const decoded = decodeURIComponent(upgradeType)
    if (types.value.includes(decoded)) selectedUpgradeType.value = decoded
    else console.warn(`Invalid upgrade type: ${decoded}`)
  }

  if (rebateProgram) {
    const decoded = decodeURIComponent(rebateProgram)
    if (programs.value.includes(decoded)) selectedProgram.value = decoded
    else console.warn(`Invalid rebate program: ${decoded}`)
  }

  if (serviceRegion) {
    const decoded = decodeURIComponent(serviceRegion)
    if (locations.value.includes(decoded)) {
      selectedLocation.value = decoded
      locationInputValue.value = decoded
      locationError.value = ''
      locationTouched.value = false
    } else {
      selectedLocation.value = 'all'
      locationInputValue.value = decoded // show what was provided
      locationError.value = 'That service region was not recognized. Please choose one from the list of available options.'
      locationTouched.value = true
    }
  }

  showLoadingMessage.value = false
})

/* -----------------------------------------------------------------------------
 * Global click handlers — keep ONE, not two duplicates.
 * -------------------------------------------------------------------------- */
onMounted(() => {
  const onWindowClick = (event) => {
    if (!event.target.closest('.custom-select.is-active')) resetSelectsActiveState()
  }
  window.addEventListener('click', onWindowClick)
  onBeforeUnmount(() => window.removeEventListener('click', onWindowClick))
})
</script>


<style lang='scss' scoped>
// See bcgov-plugin-cleanbc/styles/public/betterhomes/_vue-apps.scss
#contractorFilterApp {}
</style>
