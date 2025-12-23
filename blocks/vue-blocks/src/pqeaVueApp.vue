<template>
  <div class="inner">
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Energy Advisor Listings</h2>

    <!-- Skip to results link -->
    <a href="#pqeasResults" class="sr-only skip-to-results">Skip to results</a>

    <!-- Filter Controls -->
    <transition name="fader">
      <div
        v-if="isVisible || (!isVisible && filteredPqeas.length > 0)"
        id="pqeasFilterControls"
        class="pqeasFilterControls filter-container"
      >
        <h2 class="settings-headline">Filter Energy Advisor list</h2>

        <div class="filter-controls-container">
          <!-- Name filter -->
          <div v-if="isVisible" class="control type-input">
            <label for="nameInput">Filter by company name</label>
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

          <!-- Location input (contractor-tool style) -->
          <div v-if="isVisible" class="control type-input location-input-control">
            <label for="pqeaLocation">Filter by service region</label>

            <div class="custom-input">
              <input
                id="pqeaLocation"
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
              <option v-if="locationQueryIsEmpty" value="Please type to find your community"></option>
              <template v-else>
                <option value="All Locations"></option>
                <option v-for="loc in mobileLocationOptions" :key="loc" :value="loc"></option>
              </template>
            </datalist>

            <p v-if="locationTouched && locationError" id="locationError" class="message error-message" role="alert">
              {{ locationError }}
            </p>
          </div>
        </div>

        <!-- Clear Filters -->
        <div v-if="isVisible" class="control reset-filters">
          <p class="totals" aria-live="polite">
            Showing {{ displayedPqeas.length }} of {{ filteredPqeas.length }} energy advisors
          </p>

          <button
            class="clear-filters"
            @click.prevent="clearFilters"
            @touchend="clearFilters"
            @keydown.enter.prevent="clearFilters"
            type="button"
          >
            Reset selection
          </button>
        </div>
      </div>
    </transition>

    <!-- Results -->
    <h2 class="results__title">
      Find an Energy Advisor (<span class="counter__value">{{ filteredPqeas.length }}</span> results)
    </h2>

    <table id="pqeasResults" class="pqeasResults results table table--striped">
      <caption class="sr-only">Program Qualified Energy Advisors</caption>

      <colgroup>
        <col class="col col--1 odd col--pqea__company-and-location" />
        <col class="col col--2 even col--pqea__contact-name" />
        <col class="col col--3 odd col--pqea__email-and-phone" />
      </colgroup>

      <thead>
        <tr>
          <th class="pqea-heading odd pqea-heading--company-and-location">Company name &amp; <br/>Head office location</th>
          <th class="pqea-heading even pqea-heading--contact-name">Energy Advisor</th>
          <th class="pqea-heading odd pqea-heading--email-and-phone">Email &amp; Phone</th>
        </tr>
      </thead>

      <tbody ref="resultsTbody">
        <tr v-if="filteredPqeas.length === 0 && !isLoading" class="no-results">
          <td colspan="100%">
            <p class="no-results" role="status" aria-live="polite">Sorry, no results found.</p>
          </td>
        </tr>

        <tr v-if="isLoading" class="is-loading" role="status" aria-live="polite">
          <td colspan="100%">
            <p class="no-results loading">Retrieving a list of Energy Advisors, please wait...</p>
          </td>
        </tr>

        <template
          v-if="pqeas.length > 0"
          v-for="(pqea, index) in displayedPqeas"
          :key="pqea?.id || pqea?.details?.company_name || index"
        >
          <tr :class="`pqea result result--${index + 1} ${0 === (index + 1) % 2 ? 'even' : 'odd'}`">
            <!-- Company + location -->
            <td data-label="Company name and head office location" class="pqea__company-and-location ">
              <div class='table-link-wrapper'>
                <a v-if="pqea.details.company_website"
                  class="pqea__company contractor__company external external-app-link"
                  :href="pqea.details.company_website"
                  target="_blank"
                  @click="onProviderLinkClick(pqea)"
                  :aria-label="decodeHtmlEntities(pqea.details.company_name) + ' website, opens in a new tab/window.'"
                >
                  {{ pqea.details.company_name ? decodeHtmlEntities(pqea.details.company_name) : 'Website' }}
                </a>

                <p v-else class="pqea__company contractor__company">
                  {{ pqea.details.company_name ? decodeHtmlEntities(pqea.details.company_name) : 'No company name provided' }}
                </p>

                <p class='has-icon location pqea__location'>
                  {{ pqea.details.company_location ? pqea.details.company_location : 'Not provided' }}
                </p>
              </div>
            </td>

            <!-- Contact name -->
            <td data-label="Energy Advisor" class="pqea__contact-name">
              <p>{{ pqea.details.contact_name ? pqea.details.contact_name : 'Not provided' }}</p>
            </td>

            <!-- Email + phone -->
            <td data-label="Email and phone" class="pqea__email-and-phone">
              <div class='table-link-wrapper'>
                <a
                  v-if="pqea.details.email"
                  class="pqea__email ellipsis"
                  :href="'mailto:' + pqea.details.email"
                  @click.prevent="onEmailPhoneClick(pqea, 'email')"
                >
                  <span v-html="insertBreakableChar(pqea.details.email)"></span>
                </a>
                <p class="pqea__email" v-else>No email provided</p>

                <a
                  v-if="pqea.details.phone"
                  class="pqea__telephone"
                  :href="'tel:+1' + pqea.details.phone.replace(/-/g, '')"
                  @click.prevent="onEmailPhoneClick(pqea, 'phone')"
                >
                  {{ pqea.details.phone }}
                </a>
                <p class="pqea__telephone" v-else>No phone number provided</p>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Bottom controls: load more -->
    <div
      v-if="displayedPqeas.length && filteredPqeas.length > displayedPqeas.length"
      class="pqeasFilterControls filter-container filter-container--bottom"
    >
      <div class="control load-more">
        <button type="button" @click="loadMore" ref="loadMoreBtn">
          Load {{ nextLoadCount }} more energy advisor{{ nextLoadCount === 1 ? '' : 's' }}
        </button>

        <p class="totals">
          Showing {{ displayedPqeas.length }} of {{ filteredPqeas.length }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, nextTick, watch, watchEffect } from 'vue'
import { decodeHtmlEntities, shuffleArray } from '../shared-functions.js'
import { trackProviderFilterChange, trackProviderClick } from '../analytics-schemas.js'
import { localAnalyticsReady } from '../standalone-snowplow.js'

/* -----------------------------------------------------------------------------
 * Helpers (mirrors contractor tool)
 * -------------------------------------------------------------------------- */

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

const MOBILE_HINT_EMPTY = 'Please type to find your community'
const MOBILE_HINT_MORE = 'Continue typing to see more results'

/**
 * Finds the closest matching location name from the set of known locations.
 * Returns at most 10 candidates when ambiguous.
 * Mirrors the contractor tool matching approach (exact, startsWith, includes).
 *
 * @param {string} raw
 * @param {string[]} locationList
 * @returns {{ match: string|null, reason: string, candidates?: string[] }}
 */
function findClosestLocation(raw, locationList) {
  const q = normalize(raw)

  if (q === normalize(MOBILE_HINT_EMPTY) || q === normalize(MOBILE_HINT_MORE)) {
    return { match: 'all', reason: 'empty' }
  }

  if (!q) return { match: 'all', reason: 'empty' }
  if (q === 'all' || q === 'all locations') return { match: 'all', reason: 'all' }

  const list = (locationList || []).filter(Boolean)

  // 1) exact
  const exact = list.find((loc) => normalize(loc) === q)
  if (exact) return { match: exact, reason: 'exact' }

  // 2) startsWith
  const starts = list
    .filter((loc) => normalize(loc).startsWith(q))
    .slice(0, 10)

  if (starts.length === 1) return { match: starts[0], reason: 'startsWith' }
  if (starts.length > 1) return { match: null, reason: 'ambiguous_starts', candidates: starts }

  // 3) includes (rank by earlier match position, then shorter string)
  const includes = list
    .map((loc) => ({ loc, idx: normalize(loc).indexOf(q) }))
    .filter((x) => x.idx >= 0)
    .sort((a, b) => a.idx - b.idx || a.loc.length - b.loc.length || a.loc.localeCompare(b.loc))
    .map((x) => x.loc)
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

const pqeas = ref([])
const shuffledPqeas = ref([])

const isVisible = ref(true)
const showLoadingMessage = ref(true)
const isLoading = ref(false)

const nameQuery = ref('')

const defaultSelectedLocation = ref('all')
const selectedLocation = ref('all')

// Load-more state (pagination removed)
const pageSize = ref(30)
const visibleCount = ref(pageSize.value)

/* -----------------------------------------------------------------------------
 * Mobile location input (contractor-tool style)
 * -------------------------------------------------------------------------- */

const isMobile = ref(false)
const isLocationFocused = ref(false)

const locationInputValue = ref('') // committed display value
const locationInputDisplay = ref('') // mobile typing buffer

const locationTouched = ref(false)
const locationError = ref('')

onMounted(() => {
  isMobile.value = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

watch(locationInputValue, (v) => {
  if (isMobile.value) locationInputDisplay.value = v || ''
})

const locationInputProxy = computed({
  get() {
    return isMobile.value ? locationInputDisplay.value : locationInputValue.value
  },
  set(val) {
    if (isMobile.value) locationInputDisplay.value = val
    else locationInputValue.value = val
  }
})

function handleLocationFocus() {
  isLocationFocused.value = true
  if (isMobile.value) {
    setTimeout(() => {
      document.querySelector('#pqeaLocation')?.focus()
    }, 300)
  }
}

const commitLocation = (trigger = 'change') => {
  const el = document.querySelector('#pqeaLocation')

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
    selectedLocation.value = 'all'
    const example = candidates.slice(0, 3).join(', ')
    locationError.value =
      reason.startsWith('ambiguous')
        ? `That matches multiple service regions. Please choose one from the list (e.g., ${example}${candidates.length > 3 ? '…' : ''}).`
        : 'That service region was not recognized. Please choose one from the list of available options.'
  }

  isLocationFocused.value = false
}

const locationQuery = computed(() => {
  const raw = isMobile.value ? locationInputDisplay.value : locationInputValue.value
  return normalize(raw || '')
})

const locationQueryIsEmpty = computed(() => !locationQuery.value)

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
 * API + caching (mirrors contractor approach)
 * -------------------------------------------------------------------------- */

const publicDomain = ref('https://betterhomes.gov.bc.ca')
const pqeasAPI = `${window.site?.domain ? window.site.domain : publicDomain.value}/wp-json/custom/v1/pqeas`

const itemsToClearFromSessionStorage = ref([
  'contractorsData',
  'contractorsTimestamp',
  'faqsData',
  'faqsTimestamp',
  'rebatesData',
  'rebatesTimestamp'
])

const isQuotaExceededError = (error) => {
  if (!error) return false
  return (
    error.code === 22 ||
    error.code === 1014 ||
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  )
}

const isDataValid = (timestamp) => {
  const timeElapsed = Date.now() - parseInt(String(timestamp), 10)
  const hoursElapsed = timeElapsed / (1000 * 60 * 60)
  return hoursElapsed < 24
}

const fetchData = async () => {
  try {
    isLoading.value = true
    showLoadingMessage.value = true

    let data = sessionStorage.getItem('pqeasData')
    let timestamp = sessionStorage.getItem('pqeasTimestamp')
    let cachedData = null

    if (data && timestamp && isDataValid(timestamp)) {
      cachedData = JSON.parse(data)
    } else {
      data = localStorage.getItem('pqeasData')
      timestamp = localStorage.getItem('pqeasTimestamp')
      if (data && timestamp && isDataValid(timestamp)) {
        cachedData = JSON.parse(data)
      }
    }

    if (cachedData) {
      pqeas.value = cachedData
      shuffledPqeas.value = shuffleArray([...cachedData])
      showLoadingMessage.value = false
      isLoading.value = false
      return
    }

    const response = await fetch(pqeasAPI, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const json = await response.json()

    try {
      itemsToClearFromSessionStorage.value.forEach((item) => sessionStorage.removeItem(item))
      sessionStorage.clear()
    } catch (clearError) {
      console.warn('Error clearing sessionStorage:', clearError)
    }

    try {
      sessionStorage.setItem('pqeasData', JSON.stringify(json))
      sessionStorage.setItem('pqeasTimestamp', Date.now().toString())
    } catch (storageError) {
      if (isQuotaExceededError(storageError)) {
        console.warn('SessionStorage quota exceeded. Falling back to localStorage.')
        try {
          localStorage.setItem('pqeasData', JSON.stringify(json))
          localStorage.setItem('pqeasTimestamp', Date.now().toString())
        } catch (lsError) {
          console.error('Error setting data in localStorage:', lsError)
        }
      } else {
        console.error('Error setting data in sessionStorage:', storageError)
        throw storageError
      }
    }

    pqeas.value = json
    shuffledPqeas.value = shuffleArray([...json])
    showLoadingMessage.value = false
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching pqeas data:', error)
    throw error
  }
}

/* -----------------------------------------------------------------------------
 * Derived lists
 * -------------------------------------------------------------------------- */

const locations = computed(() => {
  const unique = new Set()
  pqeas.value.forEach((pqea) => {
    const locs = pqea?.locations
    if (!locs) return
    if (typeof locs === 'string') unique.add(locs?.name)
    else if (Array.isArray(locs)) locs.forEach((l) => unique.add(l?.name))
  })
  return Array.from(unique).filter(Boolean).sort((a, b) => a.localeCompare(b))
})

/* -----------------------------------------------------------------------------
 * Filtering + load more (pagination removed)
 * -------------------------------------------------------------------------- */

const RENOVATIONS_CATEGORY_LABEL = 'Renovating a home' // API category label

const renovationsOnlyPqeas = computed(() => {
  return (shuffledPqeas.value || []).filter(p => {
    const cats = p?.categories

    // categories may be: string, array of strings, or array of objects
    if (!cats) return false

    if (typeof cats === 'string') {
      return cats === RENOVATIONS_CATEGORY_LABEL
    }

    if (Array.isArray(cats)) {
      return cats.some(c => {
        if (!c) return false
        if (typeof c === 'string') return c === RENOVATIONS_CATEGORY_LABEL
        // object form: { name: 'Renovating a home', ... }
        return c?.name === RENOVATIONS_CATEGORY_LABEL
      })
    }

    return false
  })
})

const filteredPqeas = computed(() => {
  let results = [...renovationsOnlyPqeas.value]

  // name filter
  if (nameQuery.value) {
    results = results.filter(p => includesFuzzy(p?.details?.company_name, nameQuery.value))
  }

  // location filter
  if (selectedLocation.value !== 'all') {
    results = results.filter(
      p => Array.isArray(p.locations) && p.locations.some(l => l?.name === selectedLocation.value)
    )
  }

  return results
})


const displayedPqeas = computed(() => filteredPqeas.value.slice(0, visibleCount.value))

const remainingCount = computed(() => Math.max(0, filteredPqeas.value.length - displayedPqeas.value.length))

const nextLoadCount = computed(() => Math.min(pageSize.value, remainingCount.value))

/**
 * Focus the first link available in newly shown rows after "Load more".
 * @param {number} startIndex
 */
const focusFirstNewLink = async (startIndex) => {
  await nextTick()
  const tbody = resultsTbody.value
  if (!tbody) return

  const rows = tbody.querySelectorAll('tr.pqea')
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

const loadMore = async () => {
  const startIndex = displayedPqeas.value.length
  visibleCount.value = Math.min(visibleCount.value + pageSize.value, filteredPqeas.value.length)
  await focusFirstNewLink(startIndex)
}

/* -----------------------------------------------------------------------------
 * UI helpers
 * -------------------------------------------------------------------------- */

const insertBreakableChar = (email) =>
  String(email || '').replace(/@/g, '&#8203;@').replace(/\./g, '&#8203;.')

/* -----------------------------------------------------------------------------
 * Analytics
 * -------------------------------------------------------------------------- */

const onProviderLinkClick = (pqea) => {
  trackProviderClick({
    filterName: 'pqea',
    upgradeType: '', // retained schema field, not used here
    location: selectedLocation.value,
    companyName: pqea?.details?.company_name || '',
    destination: pqea?.details?.company_website || ''
  })
}

const onEmailPhoneClick = (pqea, linkType) => {
  let label = ''
  let destination = ''

  if (linkType === 'email') {
    label = pqea?.details?.email ? `Email: ${pqea.details.email}` : 'Email link'
    destination = `mailto:${pqea?.details?.email || ''}`
  } else {
    label = pqea?.details?.phone ? `Phone: ${pqea.details.phone}` : 'Phone link'
    destination = `tel:+1${pqea?.details?.phone?.replace(/-/g, '') || ''}`
  }

  trackProviderClick({
    filterName: 'pqea',
    upgradeType: '',
    location: selectedLocation.value,
    companyName: pqea?.details?.company_name || '',
    destination,
    label
  })
}

/* -----------------------------------------------------------------------------
 * Clear filters
 * -------------------------------------------------------------------------- */

const clearFilters = () => {
  nameQuery.value = ''

  selectedLocation.value = defaultSelectedLocation.value
  locationInputValue.value = ''
  locationInputDisplay.value = ''
  locationTouched.value = false
  locationError.value = ''
  isLocationFocused.value = false

  visibleCount.value = pageSize.value
}

/* -----------------------------------------------------------------------------
 * Watchers (match contractor behaviour)
 * -------------------------------------------------------------------------- */

watch(selectedLocation, (newVal, oldVal) => {
  if (newVal === oldVal) return
  if (isLocationFocused.value) return

  locationInputValue.value = newVal === 'all' ? '' : newVal

  if (newVal === 'all' || locations.value.includes(newVal)) {
    locationError.value = ''
    locationTouched.value = false
  }

  trackProviderFilterChange({
    filterName: 'pqea',
    upgradeType: '',
    location: newVal,
    label: `Location changed to: ${newVal}`
  })
})

watch(nameQuery, (newVal, oldVal) => {
  if (newVal === oldVal) return
  trackProviderFilterChange({
    filterName: 'pqea',
    upgradeType: '',
    location: selectedLocation.value,
    label: `Name changed to: ${newVal || '(blank)'}`
  })
})

// Reset load-more on any filter change
watch([selectedLocation, nameQuery], () => {
  visibleCount.value = pageSize.value
})

/* -----------------------------------------------------------------------------
 * Initialization
 * -------------------------------------------------------------------------- */

watch(() => window.site?.domain, (newVal) => {
  if (newVal) fetchData()
})

onMounted(() => {
  localAnalyticsReady()

  const appElement = document.getElementById('pqeaFilterApp')
  const showControls = appElement?.getAttribute('data-show-controls') === 'false'
  isVisible.value = showControls

  fetchData()
  showLoadingMessage.value = true

  const urlParams = new URLSearchParams(window.location.search)
  const showParam = urlParams.get('show')
  if (showParam === 'off') isVisible.value = true
})

watchEffect(() => {
  if (!locations.value.length) return

  const urlParams = new URLSearchParams(window.location.search)
  const showParam = urlParams.get('show')

  // Tool guard
  if (urlParams.get('tool') !== null && urlParams.get('tool') !== 'pqeas') {
    console.warn('Tool parameter does not match "pqeas". Initialization skipped.')
    return
  }

  if (showParam === 'off') isVisible.value = false

  const serviceRegion = urlParams.get('region')

  if (serviceRegion) {
    const decoded = decodeURIComponent(serviceRegion)
    if (locations.value.includes(decoded)) {
      selectedLocation.value = decoded
      locationInputValue.value = decoded
      locationError.value = ''
      locationTouched.value = false
    } else {
      selectedLocation.value = 'all'
      locationInputValue.value = decoded
      locationError.value = 'That service region was not recognized. Please choose one from the list of available options.'
      locationTouched.value = true
    }
  }

  showLoadingMessage.value = false
})

/* -----------------------------------------------------------------------------
 * Global click handler (keep one, like contractor tool)
 * -------------------------------------------------------------------------- */

onMounted(() => {
  const onWindowClick = (event) => {
    // (kept for parity; PQEA currently has no custom selects but this keeps behaviour consistent)
    if (!event.target.closest('.custom-select.is-active')) {
      // no-op (or add resetSelectsActiveState if we later re-enable selects)
    }
  }
  window.addEventListener('click', onWindowClick)
  onBeforeUnmount(() => window.removeEventListener('click', onWindowClick))
})
</script>


<style lang='scss' scoped>
// See bcgov-plugin-cleanbc/styles/public/betterhomes/_vue-apps.scss
#pqeaFilterApp {}
</style>