<template>
  <div class="inner">
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Rebate Listings</h2>

    <!-- Skip to results link (only in archive mode) -->
    <a v-if="mode === 'archive'" href="#rebatesResults" class="sr-only skip-to-results">Skip to results</a>

    <!-- Loading / Error -->
    <p v-if="isLoading" role="status" class="loader">Loading rebate settings…</p>
    <p v-else-if="loadError" role="alert">Failed to load rebates: {{ loadError }}</p>

    <template v-else>
      <!-- Filter Controls -->
      <div id="rebatesFilterControls" class="filter-container" :class="{ 'filters-dirty': isDirty, 'labels-hidden': !labelsVisible }">

        <div v-if="mode === 'single'" class="selection-summary" aria-live="polite">
        <button
          class="editBtn toggle-edit-mode readonly-toggle"
          :class="isSavingEditMode ? 'saving' : editModeView ? 'show-edit-mode' : 'show-readonly-mode'"
          @click="toggleEditModeView"
          :aria-label="editModeView ? 'Exit edit mode' : 'Enter edit mode'"
          :title="editModeView ? 'Exit edit mode' : 'Enter edit mode'">
          <span>{{ isSavingEditMode ? 'Saving...' : editModeView ? 'Hide edit mode' : 'View edit mode' }}</span>
        </button>
          <button v-if='false' class='editBtn labels' :class="labelsVisible ? 'show-labels' : 'hide-labels'" @click="toggleLabels" :title="labelsVisible ? 'Hide settings labels' : 'Show settings labels'">Show or hide settings labels</button>
          <h2 class='settings-headline'>Your home's details:</h2>
          <div class='control-container'>
            <template v-for="field in fields" :key="field.key">
              <template v-if="field.condition === undefined || field.condition">
                <!-- If field has a value -->
                <template v-if="field.displayValue && editModeView">
                  <!-- Show button (unless its select is open) -->
                  <div class="control button-group" v-if="activeEdit !== field.key" >
                    <label class='small'>{{ field.shortDesc }}</label>
                    <button class="rebate-setting" :class="{ 'is-external-dirty': isExternalDirty && lastChangedField === field.key }" @click="openEdit(field.key)" :ref="el => (buttonRefs[field.key] = el)">
                    {{ field.displayValue }}
                    </button>
                  </div>
                  <!-- Show select if open -->
                  <div v-else-if="editable && activeEdit === field.key">
                    <figure class="control editable" :aria-label="`${field.shortDesc} setting`">
                      <button :disabled="!field.vModel.value" type="button" class="close-btn" @click="activeEdit = ''" aria-label="Close edit field"></button>
                      <label :for="`${field.key}Select`">{{ field.label }}</label>
                      <select :key="field.key + '-' + (fieldRenderKeys[field.key] ?? 0)" class="select"
                        :id="`${field.key}Select`" v-model="field.vModel.value" :disabled="field.disabled"
                        @change="handleSelectChange(field.key, $event.target.value)"
                        @keydown="handleSelectKeydown($event, field.key, field.vModel.value)"
                        :ref="el => (selectRefs[field.key] = el)">
                        <option disabled :selected="!field.vModel.value" value="">Select an option</option>

                        <!-- Grouped (building) -->
                        <template v-if="field.isGrouped">
                          <optgroup v-for="group in field.groups" :key="group.slug"
                            :label="group.name === 'MURB' ? 'Multi-unit residential buildings' : group.name">
                            <option v-for="child in group.children" :key="child.slug" :value="child.slug">
                              {{ child.name }}
                            </option>
                          </optgroup>
                        </template>

                        <!-- Flat (others) -->
                        <template v-else>
                          <option v-for="opt in field.options" :key="opt.slug" :value="opt.slug">
                            {{ opt.name }}
                          </option>
                        </template>
                      </select>

                      <figcaption v-if="field.description">{{ field.description }}</figcaption>
                    </figure>
                  </div>
                </template>


                <template v-else-if="field.displayValue && !editModeView">
                  <div class="control label-group">
                    <label class='small'>{{ field.shortDesc }}</label>
                    <p class="rebate-detail">
                      {{ field.displayValue }}
                    </p>
                  </div>
                </template>

                <!-- If field is missing → show select immediately -->
                <template v-else>
                  <figure class="control editable" :aria-label="`${field.shortDesc} setting`">
                    <button :disabled="!field.vModel.value" type="button" class="close-btn" @click="activeEdit = ''" aria-label="Close edit field"></button>
                    <label :for="`${field.key}Select`">{{ field.label }}</label>
                    <select :key="field.key + '-' + (fieldRenderKeys[field.key] ?? 0)" class="select"
                      :id="`${field.key}Select`" v-model="field.vModel.value" :disabled="field.disabled"
                      @change="handleSelectChange(field.key, $event.target.value)"
                      @keydown="handleSelectKeydown($event, field.key, field.vModel.value)"
                      :ref="el => (selectRefs[field.key] = el)">
                      <option disabled :selected="!field.vModel.value" value="">Select an option</option>

                      <!-- Grouped (building) -->
                      <template v-if="field.isGrouped">
                        <optgroup v-for="group in field.groups" :key="group.slug"
                          :label="group.name === 'MURB' ? 'Multi-unit residential buildings' : group.name">
                          <option v-for="child in group.children" :key="child.slug" :value="child.slug">
                            {{ child.name }}
                          </option>
                        </optgroup>
                      </template>

                      <!-- Flat (others) -->
                      <template v-else>
                        <option v-for="opt in field.options" :key="opt.slug" :value="opt.slug">
                          {{ opt.name }}
                        </option>
                      </template>
                    </select>

                    <figcaption v-if="field.description">{{ field.description }}</figcaption>
                  </figure>
                </template>
              </template>
            </template>
          </div>

          <p v-if="hasAnySelection && editModeView" class="small-text">
            Changing these settings will cause the page content to change. You may also <a @click="clearSettings">clear your settings</a> and start over.
          </p>
          <p v-else-if="hasAnySelection && !editModeView" class="small-text">
            <a @click="clearSettings">Clear your settings</a> and start over.
          </p>

        </div>

        <p v-if="(!hasAllSelection || isDirty) && mode === 'single'" class='warning-message'>
          You may be looking at default or incomplete information.
          <span v-if='!isDirty'>
            Please update your settings.
          </span>
          <span v-if='isDirty'>
            The page URL does not match your settings. Please update and save your selections.
          </span>
        </p>

        <template v-if="mode === 'archive'">
          <!-- Building Type Select (hierarchical) -->
          <div class="control build-type-select">
            <label for="typeSelect">What kind of home do you live in?</label>
            <select id="typeSelect" class="select" v-model="selectedBuildingTypeSlug" @change="onBuildingTypeChange">
              <option :value="''">Select an option</option>
              <optgroup v-for="group in buildingTypeGroups" :key="group.slug"
                :label="group.name === 'MURB' ? 'Multi-unit residential buildings' : group.name">
                <!-- <option :value="group.slug">All {{ group.name }}</option> -->
                <option v-for="child in group.children" :key="child.slug" :value="child.slug">
                  {{ child.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- MURB Own/Rent Select -->
          <div class="control murb-tenure" v-if="selectedBuildingGroupSlug === 'murb'">
            <label for="murbTenure">Do you own or rent your home?</label>
            <select id="murbTenure" class="select" v-model="murbTenure">
              <option :value="''">Select an option</option>
              <option value="own">Own</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <!-- Home Value Select -->
          <div class="control home-value-select">
            <label for="homeValueSelect">What is the current assessed value of your home?</label>
            <select id="homeValueSelect" class="select" :disabled="!selectedBuildingGroupSlug"
              v-model="selectedHomeValueSlug">
              <option :value="''">Select an option</option>
              <option v-for="hv in homeValueOptions" :key="hv.slug" :value="hv.slug">
                {{ hv.name }}
              </option>
            </select>
          </div>

          <!-- Income Bands Selects -->
          <div class="control income-bands-select">
            <label for="householdPersons">How many people live in your household?</label>
            <select id="householdPersons" class="select" v-model="selectedPersonsSlug" @change="onPersonsChange">
              <option :value="''">Select an option</option>
              <option v-for="p in personCountOptions" :key="p.slug" :value="p.slug">{{ p.name }}</option>
            </select>
          </div>

          <div class="control income-range-select">
            <label for="incomeRange">What is the combined pre-tax income of all adults in your household (excluding
              dependants)?</label>
            <select id="incomeRange" class="select" :disabled="!selectedPersonsSlug" v-model="selectedIncomeRangeSlug">
              <option :value="''">Select an option</option>
              <option v-for="r in incomeRangeOptions" :key="r.slug" :value="r.slug">{{ r.name }}</option>
            </select>
          </div>

          <!-- Location Select -->
          <div class="control location-select">
            <label for="locationSelect">Where is your home located?</label>
            <select id="locationSelect" class="select" v-model="selectedLocationSlug">
              <option :value="''">Select an option</option>
              <option v-for="loc in locationOptions" :key="loc.slug" :value="loc.slug" :class="loc.children?.[0]?.name">
                {{ loc.name }}
              </option>
            </select>
          </div>

          <!-- Utility Select -->
          <div class="control uitility-select">
            <label for="uitilitySelect">Which utility company provides your electrical service?</label>
            <select id="uitilitySelect" class="select" v-model="selectedUtilitySlug">
              <option :value="''">Select an option</option>
              <option v-for="utility in utilityOptions" :key="utility.slug" :value="utility.slug">
                {{ utility.name }}
              </option>
            </select>
          </div>

        </template>
        <!-- Update Page Button (only in single mode) -->
        <!-- <div v-if="mode === 'single'" class="update-page-container" :class='isDirty ? "has-icon warning" : ""'>
          <button v-if="editable || isDirty" type="button" class="update-page-btn" @click="reloadPage"
            :disabled='!isDirty'>
            Save and update
          </button>
        </div> -->

      </div>

      <!-- Results -->
      <section v-if="mode === 'archive' && hasAllSelection" id="rebatesResults" class="results"
        aria-label="Rebate results">
        <article v-for="item in api.results" :key="item.id" class="rebate-card">
          <header>
            <h3 class="rebate-title">
              <a :href="withQueryString(item.post_url ?? item.url ?? '#')">{{ item.title }}</a>
            </h3>
          </header>
          <dl class="rebate-details">
            <div v-if="item.rebate_amount">
              <dt>Rebate amount</dt>
              <dd>{{ item.rebate_amount }}</dd>
            </div>
            <div v-if="item.short_description">
              <dt>Description</dt>
              <dd>{{ item.short_description }}</dd>
            </div>
            <div v-if="item.types?.length">
              <dt>Building types</dt>
              <dd>
                <ul>
                  <li v-for="t in item.types" :key="t.slug">{{ t.name }}</li>
                </ul>
              </dd>
            </div>
            <div v-if="item.locations?.length">
              <dt>Locations</dt>
              <dd>
                <ul>
                  <li v-for="loc in item.locations" :key="loc.slug">{{ loc.name }} ({{ loc.region }})</li>
                </ul>
              </dd>
            </div>
            <div v-if="item.upgrade_types?.length">
              <dt>Upgrade types</dt>
              <dd>
                <ul>
                  <li v-for="u in item.upgrade_types" :key="u.slug">{{ u.name }}</li>
                </ul>
              </dd>
            </div>
            <div v-if="item.primary_heating_sys?.length">
              <dt>Primary heating systems</dt>
              <dd>
                <ul>
                  <li v-for="s in item.primary_heating_sys" :key="s.slug">{{ s.name }}</li>
                </ul>
              </dd>
            </div>
            <div v-if="item.other_offers?.length">
              <dt>Other offers</dt>
              <dd>
                <ul>
                  <li v-for="o in item.other_offers" :key="o.slug">{{ o.name }}</li>
                </ul>
              </dd>
            </div>
          </dl>
        </article>

        <p v-if="!api.results?.length" class="no-results">No results found.</p>
      </section>
      <p v-else-if="mode === 'archive'" class="no-results">Please complete the form above.</p>

      <!-- Selection summary (for quick verification) -->
      <div v-if="debug" class="selection-summary" aria-live="polite">
        <p>
          <strong>Debug information: </strong>
          <span v-if="!hasAnySelection">No selections</span><br />
          <span v-if="espTier"><strong>Derived value (ESP tier):</strong> {{ espTier }}</span>
        </p>

        <!-- Query string + Copy link -->
        <div class="link-tools">
          <code class="assembled-url">{{ assembledQueryString }}</code>
          <button type="button" class="copy-link" @click="addLinkToClipboard">Copy link</button>
          <span class="copy-message" aria-live="polite"></span>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
// See `vNextRebateVueApp.docs.js` for full JSDoc reference.
import { computed, ref, nextTick, onMounted, watch } from 'vue'

/** Public domain fallback */
const publicDomain = ref('https://www.betterhomesbc.ca')
/** API endpoint */
const rebatesAPI = `${window.site?.domain ? window.site.domain : publicDomain.value}/wp-json/custom/v2/rebates`

const debug = false;

// Local state for fetched API payload
const api = ref({
  'settings-selects': {
    'building-types': [],
    'home-value': [],
    'income-bands': [],
    'locations': [],
    'utilities': []
  },
  results: []
})

const isLoading = ref(true)
const loadError = ref('')

// Debounce a function so it runs only after a specified delay.
function debounce(fn, delay = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const debouncedUpdateRebateDetails = debounce(updateRebateDetails, 500)

const isAjaxLoading = ref(false)

// Fetch and replace the rebate details section asynchronously.
async function updateRebateDetails() {
  const targetSelector = '#rebate-details-container'
  const container = document.querySelector(targetSelector)
  if (!container) return

  try {
    isAjaxLoading.value = true
    const res = await fetch(assembledUrl.value, { credentials: 'same-origin' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const newContent = doc.querySelector(targetSelector)

    if (newContent) {
      container.innerHTML = newContent.innerHTML

      container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script')
        if (oldScript.src) newScript.src = oldScript.src
        else newScript.textContent = oldScript.textContent
        document.body.appendChild(newScript)
        document.body.removeChild(newScript)
      })

      window.history.replaceState(null, '', assembledUrl.value)

      // After the DOM has been swapped, only clear external dirty + selection marker.
      isExternalDirty.value = false
      isSavingEditMode.value = false
      lastChangedField.value = ''
      rerenderScrollMenu();
    }
  } catch (err) {
    console.error('Failed to update rebate details via AJAX:', err)
  } finally {
    isAjaxLoading.value = false
  }
}

// Rebuild the scroll menu (`#incentive-side-nav`) from H2 headings inside `#incentive-details-container`.
function rerenderScrollMenu() {
  const detailsContainer = document.querySelector('#incentive-details-container');
  const sideNav = document.querySelector('#incentive-side-nav');

  if (detailsContainer && sideNav) {
    // Clear the existing content of #incentive-side-nav
    sideNav.innerHTML = '';

    // Find all H2 elements inside the #incentive-details-container
    const headings = detailsContainer.querySelectorAll('h2[id]');

    // Create a new list for navigation
    const navListContainer = document.createElement('nav');
    navListContainer.classList.add('side-nav', 'bb-nav', 'wp-block-navigation', 'is-vertical', 'wp-container-core-navigation-layout-2');
    
    const navList = document.createElement('ul');
    navList.classList.add('side-nav', 'bb-nav', 'wp-block-navigation', 'is-vertical', 'wp-block-navigation__container');

    // Loop through the H2 elements to create links
    headings.forEach(heading => {
      const id = heading.id;
      const text = heading.textContent.trim();

      // Create a list item
      const listItem = document.createElement('li');
      listItem.classList.add('wp-block-navigation-item', 'wp-block-navigation-link');

      // Create a link element
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = text;
      link.classList.add('wp-block-navigation-item__content');

      // Append the link to the list item
      listItem.appendChild(link);

      // Append the list item to the navigation list
      navList.appendChild(listItem);
    });

    // Append the navigation list to the side navigation
    navListContainer.appendChild(navList);
    sideNav.appendChild(navListContainer);
    sideNav.classList.remove('admin-instructions');
  }
}

// --- Editable state ---
const editable = ref(false)
const activeEdit = ref('')
const labelsVisible = ref(true)
const showReadOnlyFields = ref(true)
const showEditModeUI = ref(false)
const editModeView = ref(false) 
const isSavingEditMode = ref(false)

// --- Focus map for selects ---
const selectRefs = ref({})
const buttonRefs = ref({})
const lastChangedField = ref('')

// Force full re-render when the options list changes.
const fieldRenderKeys = ref({
  homeValue: 0,
  income: 0
})

function toggleLabels() {
  labelsVisible.value = !labelsVisible.value
  localStorage.setItem('rebateLabelsVisible', JSON.stringify(labelsVisible.value))
}

// Open a specific field for editing.
function openEdit(field) {
  editable.value = true
  activeEdit.value = field
}

function toggleEditModeView() {
  editModeView.value = !editModeView.value
  localStorage.setItem('rebateEditModeView', JSON.stringify(editModeView.value))
}

// Handle when a select input changes. Closes the select, marks state dirty, and re-focuses associated button.
async function handleSelectChange(fieldKey, newValue) {
  if (!newValue) return
  lastChangedField.value = fieldKey
  isSavingEditMode.value = true

  await nextTick()
  activeEdit.value = '' // closes the select and shows the button again.

  await nextTick() // wait for DOM to update.
  isExternalDirty.value = true

  const btn = buttonRefs.value[fieldKey]
  if (btn) btn.focus()
}

// Keyboard navigation: Move focus to the next field missing a selection.
function focusNextMissingField(currentKey) {
  const all = fields.value
  const idx = all.findIndex(f => f.key === currentKey)
  if (idx === -1) return false
  const nextMissing = all.slice(idx + 1).find(f => !f.displayValue)
  if (nextMissing) {
    activeEdit.value = nextMissing.key
    return true
  }
  return false
}

// Move focus to the previous field missing a selection.
function focusPrevMissingField(currentKey) {
  const all = fields.value
  const idx = all.findIndex(f => f.key === currentKey)
  if (idx === -1) return false
  const prevMissing = [...all.slice(0, idx)].reverse().find(f => !f.displayValue)
  if (prevMissing) {
    activeEdit.value = prevMissing.key
    return true
  }
  return false
}

// Handle keyboard interaction for select elements.
function handleSelectKeydown(event, fieldKey, currentValue) {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleSelectChange(fieldKey, currentValue)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    activeEdit.value = ''
  } else if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (focusPrevMissingField(fieldKey)) event.preventDefault()
    } else {
      if (focusNextMissingField(fieldKey)) event.preventDefault()
    }
  }
}

// --- Auto-focus when activeEdit changes ---
watch(activeEdit, async (newKey) => {
  if (!newKey) return
  await nextTick()
  const el = selectRefs.value[newKey]
  if (el) el.focus()
})

// Clear all user selections, reset URL, and reopen the first missing field.
function clearSettings(event) {
  event?.preventDefault?.()

  selectedBuildingTypeSlug.value = ''
  murbTenure.value = ''
  selectedHomeValueSlug.value = ''
  selectedPersonsSlug.value = ''
  selectedIncomeRangeSlug.value = ''
  selectedLocationSlug.value = ''
  selectedUtilitySlug.value = ''

  const url = window.location.origin + window.location.pathname
  window.history.replaceState(null, '', url)
  localStorage.removeItem('rebateToolSettings')

  editable.value = true
  const firstMissing = fields.value.find(f => !f.displayValue)
  activeEdit.value = firstMissing ? firstMissing.key : ''

  localStorage.removeItem('rebateEditableState');
}

// --- Unified fields config ---
const fields = computed(() => [
  {
    key: 'building',
    shortDesc: 'Type of home',
    label: 'What kind of home do you live in?',
    vModel: selectedBuildingTypeSlug,
    groups: buildingTypeGroups.value,
    isGrouped: true,
    displayValue: selectedBuildingTypeName.value,
    missingMessage: 'Missing home type',
    description: 'Changing between Ground Oriented / MURB types will require you to update the assessed home value information.'
  },
  {
    key: 'murbTenure',
    shortDesc: 'MURB tenure',
    label: 'Do you own or rent your home?',
    vModel: murbTenure,
    options: [
      { slug: 'own', name: 'Own' },
      { slug: 'rent', name: 'Rent' }
    ],
    displayValue: murbTenureLabel.value,
    missingMessage: 'Missing MURB status',
    condition: selectedBuildingGroupSlug.value === 'murb',
    description: 'This only applies to MURB home types.'
  },
  {
    key: 'homeValue',
    shortDesc: 'Assessed home value',
    label: 'What is the current assessed value of your home?',
    vModel: selectedHomeValueSlug,
    options: homeValueOptions.value,
    displayValue: selectedHomeValueName.value,
    missingMessage: 'Missing home value',
    disabled: !selectedBuildingGroupSlug.value,
    ready: homeValueOptions.value.length > 0,
    description: 'The amount options shown change based on the set type of home.'
  },
  {
    key: 'persons',
    shortDesc: 'People in household',
    label: 'How many people live in your household?',
    vModel: selectedPersonsSlug,
    options: personCountOptions.value,
    displayValue: selectedPersonsCount.value,
    missingMessage: 'Missing household number',
    description: 'Changing this field will require you to update the pre-tax income range information as well.'
  },
  {
    key: 'income',
    shortDesc: 'Household income',
    label: 'What is the combined pre-tax income of all adults in your household (excluding dependants)?',
    vModel: selectedIncomeRangeSlug,
    options: incomeRangeOptions.value,
    displayValue: selectedIncomeRangeName.value,
    missingMessage: 'Missing household income',
    disabled: !selectedPersonsSlug.value,
    ready: incomeRangeOptions.value.length > 0,
    description: 'The amount options shown change based on the set number of people in the household.'
  },
  {
    key: 'location',
    shortDesc: 'Home location',
    label: 'Where is your home located?',
    vModel: selectedLocationSlug,
    options: locationOptions.value,
    displayValue: selectedLocationName.value
      ? `${selectedLocationName.value} (${selectedRegionName.value})`
      : '',
    missingMessage: 'Missing location details'
  },
  {
    key: 'utility',
    shortDesc: 'Electric utility company',
    label: 'Which utility company provides your electrical service?',
    vModel: selectedUtilitySlug,
    options: utilityOptions.value,
    displayValue: selectedUtilityName.value,
    missingMessage: 'Missing service details'
  }
])

const isExternalDirty = ref(false)   // for outside Vue elements + button spin.

onMounted(() => {

  watch(urlStateDeps, (newDeps) => {
    if (hasAllSelection.value) {
      localStorage.setItem('rebateToolSettings', JSON.stringify(newDeps))
    }
  }, { deep: true })

})

watch(isExternalDirty, (newVal) => {
  const blocks = document.querySelectorAll('.multi-query-content-block, .query-conditional-group-block')
  blocks.forEach(el => el.classList.toggle('is-dirty-variable', newVal))
})

// --- Watcher: Toggle classes based on isDirty ---
function applyDirtyClasses(val) {
  document
    .querySelectorAll('.multi-query-content-block > span[data-replace="value"]')
    .forEach(el => el.classList.toggle('is-dirty', val))
}

// ----- Mode (archive|single) -----
const mode = ref('archive')
onMounted(() => {
  const el = document.getElementById('rebateFilterApp')
  if (el?.dataset?.mode) {
    mode.value = el.dataset.mode
  }
})

onMounted(async () => {
  try {
    const res = await fetch(rebatesAPI, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    api.value = await res.json()

    const params = new URLSearchParams(window.location.search)
    const hasTool = params.get('tool') === 'rebates'
    const saved = localStorage.getItem('rebateToolSettings')

    if (hasTool) {
      // From URL.
      initFromQueryString()
    } else if (saved) {
      // From localStorage → apply, then reload with full query string.
      initFromLocalStorage(JSON.parse(saved))
      window.location.href = assembledUrl.value
      return // stop further initialization until page reloads.
    } else {
      // First visit — nothing special.
      console.log('No saved settings — starting fresh')
    }

    watch(urlStateDeps, () => {
      isExternalDirty.value = true // external goes dirty immediately.
      updateAddressBar()
      debouncedUpdateRebateDetails()
    }, { deep: true })


    watch(homeValueOptions, async (newVal) => {
      if (!selectedHomeValueSlug.value && newVal.length > 0) {
        // force remount and focus.
        fieldRenderKeys.value.homeValue++
        await nextTick()
        activeEdit.value = 'homeValue'
      } else if (selectedHomeValueSlug.value && !newVal.find(o => o.slug === selectedHomeValueSlug.value)) {
        selectedHomeValueSlug.value = ''
        fieldRenderKeys.value.homeValue++
        await nextTick()
        activeEdit.value = 'homeValue'
      }
    })

    watch(incomeRangeOptions, async (newVal) => {
      if (!selectedIncomeRangeSlug.value && newVal.length > 0) {
        fieldRenderKeys.value.income++
        await nextTick()
        activeEdit.value = 'income'
      } else if (selectedIncomeRangeSlug.value && !newVal.find(o => o.slug === selectedIncomeRangeSlug.value)) {
        selectedIncomeRangeSlug.value = ''
        fieldRenderKeys.value.income++
        await nextTick()
        activeEdit.value = 'income'
      }
    })

  } catch (e) {
    loadError.value = String(e)
    console.error('Failed to fetch rebates:', e)
  } finally {
    isLoading.value = false
  }
})

// Initialize form state from stored localStorage object.
function initFromLocalStorage(data) {
  if (!data || typeof data !== 'object') return

  if (data.group && buildingTypeGroups.value.some(g => g.slug === data.group)) {
    selectedBuildingTypeSlug.value = data.group
  }
  if (data.type) {
    const isParent = buildingTypeGroups.value.some(g => g.slug === data.type)
    const isChild = Array.from(childToGroupSlug.value.keys()).includes(data.type)
    if (isParent || isChild) selectedBuildingTypeSlug.value = data.type
  }
  if (data.tenure && (data.tenure === 'own' || data.tenure === 'rent')) murbTenure.value = data.tenure
  if (data.home_value && homeValueOptions.value.find(h => h.slug === data.home_value)) {
    selectedHomeValueSlug.value = data.home_value
  }
  if (data.persons && personCountOptions.value.some(p => p.slug === data.persons)) {
    selectedPersonsSlug.value = data.persons
  }
  if (data.income && incomeRangeOptions.value.some(r => r.slug === data.income)) {
    selectedIncomeRangeSlug.value = data.income
  }
  if (data.location) {
    const loc = locationOptions.value.find(l => l.slug === data.location)
      || locationOptions.value.find(l => l.name === data.location)
    if (loc) selectedLocationSlug.value = loc.slug
  }
  if (data.utility) {
    const utility = utilityOptions.value.find(u => u.slug === data.utility)
      || utilityOptions.value.find(u => u.name === data.utility)
    if (utility) selectedUtilitySlug.value = utility.slug
  }

  // After restoring state, update the URL and initialUrl.
  updateAddressBar()
}

// ----- Building Types (hierarchical) -----
const buildingTypeGroups = computed(() => api.value?.['settings-selects']?.['building-types'] ?? [])
const childToGroupSlug = computed(() => {
  const map = new Map()
  for (const g of buildingTypeGroups.value) {
    for (const c of g.children ?? []) map.set(c.slug, g.slug)
  }
  return map
})
const selectedBuildingTypeSlug = ref('')
const selectedBuildingGroupSlug = computed(() => {
  if (!selectedBuildingTypeSlug.value) return ''
  if (buildingTypeGroups.value.some(g => g.slug === selectedBuildingTypeSlug.value)) return selectedBuildingTypeSlug.value
  return childToGroupSlug.value.get(selectedBuildingTypeSlug.value) || ''
})
const selectedBuildingTypeName = computed(() => {
  const sel = selectedBuildingTypeSlug.value
  if (!sel) return ''
  const group = buildingTypeGroups.value.find(g => g.slug === sel)
  if (group) return group.name
  for (const g of buildingTypeGroups.value) {
    const child = (g.children ?? []).find(c => c.slug === sel)
    if (child) return child.name
  }
  return ''
})

// Handle building type change by resetting home value and focusing next.
async function onBuildingTypeChange() {
  selectedHomeValueSlug.value = ''
  await nextTick()
  if (!selectedHomeValueSlug.value) selectedHomeValueSlug.value = ''
  activeEdit.value = 'homeValue'
}

// ----- MURB tenure -----
const murbTenure = ref('')
const murbTenureLabel = computed(() => (murbTenure.value === 'own' ? 'Own' : murbTenure.value === 'rent' ? 'Rent' : ''))

// ----- Home Value -----
const homeValueOptions = computed(() => {
  const hvGroups = api.value?.['settings-selects']?.['home-value'] ?? []
  const groupSlug = selectedBuildingGroupSlug.value
  if (!groupSlug) return []
  const groupObj = (api.value?.['settings-selects']?.['building-types'] ?? []).find(g => g.slug === groupSlug)
  const groupName = groupObj?.name || ''
  const singularish = groupSlug.replace(/s$/, '')
  const hvGroup =
    hvGroups.find(g => g.slug === `${groupSlug}-value`) ||
    hvGroups.find(g => g.name === groupName) ||
    hvGroups.find(g => g.slug === `${singularish}-value`) ||
    hvGroups.find(g => g.slug.startsWith(singularish)) ||
    null
  return hvGroup?.children ?? []
})
const selectedHomeValueSlug = ref('')
const selectedHomeValueName = computed(() => {
  const match = homeValueOptions.value.find(v => v.slug === selectedHomeValueSlug.value)
  return match ? match.name : ''
})

// ----- Income Bands -----
const personCountOptions = computed(() => (api.value?.['settings-selects']?.['income-bands'] ?? []).map(p => ({ name: p.name, slug: p.slug, id: p.id })))
const selectedPersonsSlug = ref('')
const selectedPersonsGroup = computed(() => (api.value?.['settings-selects']?.['income-bands'] ?? []).find(p => p.slug === selectedPersonsSlug.value) || null)
const selectedPersonsCount = computed(() => selectedPersonsGroup.value?.name || '')
const incomeRangeOptions = computed(() => {
  const children = selectedPersonsGroup.value?.children ?? []
  return children
    .map(r => ({ ...r, name: r.name.replace(/^Range:\s*/, '') }))
    .sort((a, b) => {
      const order = { 't1': 1, 't2': 2, 't3': 3, 't0': 4 }
      const aCode = a.slug.split('-').pop()
      const bCode = b.slug.split('-').pop()
      return (order[aCode] || 99) - (order[bCode] || 99)
    })
})
const selectedIncomeRangeSlug = ref('')
const selectedIncomeRangeName = computed(() => {
  const match = incomeRangeOptions.value.find(r => r.slug === selectedIncomeRangeSlug.value)
  return match ? match.name : ''
})

// Handle household size change by resetting income range and focusing next.
async function onPersonsChange() {
  selectedIncomeRangeSlug.value = ''
  await nextTick()
  if (!selectedIncomeRangeSlug.value) selectedIncomeRangeSlug.value = ''
  activeEdit.value = 'income'
}

// ----- Location -----
const locationOptions = computed(() => api.value?.['settings-selects']?.['locations'] ?? [])
const selectedLocationSlug = ref('')
const selectedLocation = computed(() => locationOptions.value.find(l => l.slug === selectedLocationSlug.value) || null)
const selectedRegion = computed(() => selectedLocation.value?.children?.[0]?.slug || '')
const selectedLocationName = computed(() => selectedLocation.value?.name || '')
const selectedRegionName = computed(() => selectedLocation.value?.children?.[0]?.name || '')


// ----- Utility -----
const utilityOptions = computed(() => api.value?.['settings-selects']?.['utilities'] ?? [])
const selectedUtilitySlug = ref('')
const selectedUtility = computed(() => utilityOptions.value.find(l => l.slug === selectedUtilitySlug.value) || null)
const selectedUtilityName = computed(() => selectedUtility.value?.name || '')

// ----- Selections summary -----
const hasAnySelection = computed(() => !!(selectedBuildingTypeName.value || murbTenure.value || selectedHomeValueName.value || selectedPersonsCount.value || selectedIncomeRangeName.value || selectedLocationName.value || selectedUtilityName.value))

const hasAllSelection = computed(() => {
  const hasBuilding = !!selectedBuildingTypeName.value
  const hasMurbTenure = selectedBuildingGroupSlug.value === 'murb' ? !!murbTenure.value : true
  const hasHomeValue = !!selectedHomeValueName.value
  const hasPersons = !!selectedPersonsCount.value
  const hasIncome = !!selectedIncomeRangeName.value
  const hasLocation = !!selectedLocationName.value
  const hasUtility = !!selectedUtilityName.value

  return hasBuilding && hasMurbTenure && hasHomeValue && hasPersons && hasIncome && hasLocation && hasUtility
})


// ----- URL assembly -----
const assembledUrl = computed(() => assembleUrl())
const assembledQueryString = computed(() => {
  const q = assembledUrl.value.split('?')[1]
  return q ? `?${q}` : ''
})

// --- Dirty states ---
// URL does not match the settings currently showing.
const urlOutOfSync = computed(() => assembledQueryString.value !== window.location.search)

// Use this everywhere inside Vue for warnings/outline:
const isDirty = urlOutOfSync

// Keep external spans in sync with URL mismatch.
watch(urlOutOfSync, (val) => applyDirtyClasses(val), { immediate: true })

onMounted(() => {
  const savedLabelsVisible = localStorage.getItem('rebateLabelsVisible')
  if (savedLabelsVisible !== null) {
    labelsVisible.value = JSON.parse(savedLabelsVisible)
  }

  const savedReadOnly = localStorage.getItem('rebateShowReadOnlyFields')
  if (savedReadOnly !== null) {
    showReadOnlyFields.value = JSON.parse(savedReadOnly)
  }

  const savedEditUI = localStorage.getItem('rebateShowEditModeUI')
  if (savedEditUI !== null) {
    showEditModeUI.value = JSON.parse(savedEditUI)
  }

  const savedEditModeView = localStorage.getItem('rebateEditModeView')
  if (savedEditModeView !== null) {
    editModeView.value = JSON.parse(savedEditModeView)
  }

  const observer = new MutationObserver(() => {
    applyDirtyClasses(urlOutOfSync.value)
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

// Rebuild the current rebate tool URL including all selected params.
function assembleUrl() {
  const baseUrl = window.location.origin + window.location.pathname
  const urlParams = new URLSearchParams()
  urlParams.set('tool', 'rebates')
  if (selectedBuildingTypeSlug.value) urlParams.set('type', selectedBuildingTypeSlug.value)
  if (selectedBuildingGroupSlug.value) urlParams.set('group', selectedBuildingGroupSlug.value)
  if (murbTenure.value) urlParams.set('tenure', murbTenure.value)
  if (selectedHomeValueSlug.value) urlParams.set('home_value', selectedHomeValueSlug.value)
  if (selectedPersonsSlug.value) urlParams.set('persons', selectedPersonsSlug.value)
  if (selectedIncomeRangeSlug.value) urlParams.set('income', selectedIncomeRangeSlug.value)
  if (hasAllSelection.value && espTier.value) {
    urlParams.set('esp_tier', espTier.value)
  } else {
    urlParams.delete('esp_tier')
  }
  if (selectedLocationSlug.value) {
    urlParams.set('location', selectedLocationName.value)
    if (selectedRegionName.value) urlParams.set('region', selectedRegionName.value)
  }
  if (selectedUtilitySlug.value) urlParams.set('utility', selectedUtilityName.value)
  return `${baseUrl}?${urlParams.toString()}`
}

// Copy the assembled URL to clipboard and show a feedback message.
function addLinkToClipboard(event) {
  const url = assembledUrl.value
  navigator.clipboard?.writeText(url)
    .then(() => handleLinkCopiedMessageContent(event, '.selection-summary', 'Link copied to clipboard'))
    .catch((err) => {
      console.error('Failed to copy URL:', err)
      handleLinkCopiedMessageContent(event, '.selection-summary', 'Copy failed')
    })
}

// Show a temporary feedback message in the UI when link copied.
function handleLinkCopiedMessageContent(event, targetSelector, msg) {
  const root = document.querySelector(targetSelector) || document.body
  const el = root.querySelector('.copy-message')
  if (!el) return
  el.textContent = msg
  el.classList.remove('isFadedOut')
  setTimeout(() => el.classList.add('isFadedOut'), 1200)
  setTimeout(() => { el.textContent = '' }, 1800)
}

// Initialize form state from current query string params.
function initFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search)
  const tool = urlParams.get('tool')
  if (tool && tool !== 'rebates') return
  const type = urlParams.get('type')
  const group = urlParams.get('group')
  const tenure = urlParams.get('tenure')
  const homeValue = urlParams.get('home_value')
  const persons = urlParams.get('persons')
  const income = urlParams.get('income')
  const location = urlParams.get('location')
  const utility = urlParams.get('utility')

  if (group && buildingTypeGroups.value.some(g => g.slug === group)) {
    selectedBuildingTypeSlug.value = group
  }
  if (type) {
    const isParent = buildingTypeGroups.value.some(g => g.slug === type)
    const isChild = Array.from(childToGroupSlug.value.keys()).includes(type)
    if (isParent || isChild) selectedBuildingTypeSlug.value = type
  }

  if (tenure && (tenure === 'own' || tenure === 'rent')) murbTenure.value = tenure

  if (homeValue) {
    const foundHV = homeValueOptions.value.find(h => h.slug === homeValue)
    if (foundHV) selectedHomeValueSlug.value = homeValue
  }

  if (persons) {
    const personsOk = personCountOptions.value.some(p => p.slug === persons)
    if (personsOk) selectedPersonsSlug.value = persons
  }

  if (income) {
    const incomeOk = incomeRangeOptions.value.some(r => r.slug === income)
    if (incomeOk) selectedIncomeRangeSlug.value = income
  }

  if (location) {
    const foundLoc = locationOptions.value.find(l => l.name === location)
    if (foundLoc) selectedLocationSlug.value = foundLoc.slug
  }

  if (utility) {
    const foundUtil = utilityOptions.value.find(l => l.name === utility)
    if (foundUtil) selectedUtilitySlug.value = foundUtil.slug
  }
}

// ----- URL state deps -----
const urlStateDeps = computed(() => ({
  type: selectedBuildingTypeSlug.value,
  group: selectedBuildingGroupSlug.value,
  tenure: murbTenure.value,
  home_value: selectedHomeValueSlug.value,
  persons: selectedPersonsSlug.value,
  income: selectedIncomeRangeSlug.value,
  location: selectedLocationSlug.value,
  utility: selectedUtilitySlug.value,
  region: selectedRegion.value
}))

// Update the browser address bar to match assembled state.
function updateAddressBar() {
  const url = assembledUrl.value
  try {
    window.history.replaceState(null, '', url)
  } catch (e) {
    // no-op
  }
}

// ----- ESP Tier derivation -----
const espTier = computed(() => {
  const incomeSlug = selectedIncomeRangeSlug.value;
  if (!incomeSlug) return '';
  const hasAllSelectionAvailable = hasAllSelection.value;
  if (!hasAllSelectionAvailable) return '';
  const selectedHV = homeValueOptions.value.find(v => v.slug === selectedHomeValueSlug.value);
  const hvSlug = selectedHV?.slug || '';
  const isMurb = selectedBuildingGroupSlug.value === 'murb';
  const overLimit = (
    (isMurb && murbTenure.value !== 'rent' && hvSlug === '772000-or-over') ||
    (!isMurb && hvSlug === '1230000-or-over')
  );
  if (/-t1$/.test(incomeSlug)) return overLimit ? 'Not Qualified' : 'ESP-1';
  if (/-t2$/.test(incomeSlug)) return overLimit ? 'Not Qualified' : 'ESP-2';
  if (/-t3$/.test(incomeSlug)) return 'ESP-3';
  if (/-t0$/.test(incomeSlug)) return 'Not Qualified';
  return '';
});

// Return a URL with the current query string appended.
function withQueryString(baseUrl) {
  if (!baseUrl) return '#'
  const qs = assembledQueryString.value
  if (!qs) return baseUrl
  try {
    const urlObj = new URL(baseUrl, window.location.origin)
    return urlObj.origin + urlObj.pathname + qs
  } catch (e) {
    return baseUrl + qs
  }
}
</script>

<style scoped>
#rebateFilterApp {

  /* Minimal utility styles to make the component usable without external scripts. */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .inner {
    display: grid !important;
    gap: 1rem;
  }

  .filter-container {
    display: grid !important;
    gap: 1rem;
    padding: 1rem;
    grid-template-columns: 1fr;
  }

  .settings-headline {
    font-size: 1.33rem;
    margin-block-end: 0;
    margin-block-start: 1.25rem;

    @media (width > 550px) {
      margin-block-start: 0;
    }
  }

  #rebatesFilterControls {
    container-type: inline-size;
    container-name: filter;
  }

  .control-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;

    @container filter (width < 680px) {
      grid-template-columns: 1fr 1fr;
    }
    
    @container filter (width < 400px) {
      grid-template-columns: 1fr;
    }
    
      .control {
        display: grid;
        justify-content: stretch;
        gap: 0.5rem;
        margin-bottom: 0;
    
        &.editable {
          color: white;
          background-color: var(--wp--preset--color--primary-brand);
          outline: 2px solid var(--wp--preset--color--primary-brand);
          outline-offset: 2px;
          padding: 0.5rem;
          border-radius: 0.5rem;
          position: relative;
    
          & label {
            color: white;
            padding-inline-end: 1.25rem;
          }
    
          & .close-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.25rem;
            width: 1.5rem;
            height: 1.5rem;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            appearance: none;
            min-width: unset;
    
            &[disabled] {
              opacity: 0.25;
            }
          }
    
          & .close-btn::before {
            content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjU2IDQ4YTIwOCAyMDggMCAxIDEgMCA0MTYgMjA4IDIwOCAwIDEgMSAwLTQxNnptMCA0NjRBMjU2IDI1NiAwIDEgMCAyNTYgMGEyNTYgMjU2IDAgMSAwIDAgNTEyek0xNzUgMTc1Yy05LjQgOS40LTkuNCAyNC42IDAgMzMuOWw0NyA0Ny00NyA0N2MtOS40IDkuNC05LjQgMjQuNiAwIDMzLjlzMjQuNiA5LjQgMzMuOSAwbDQ3LTQ3IDQ3IDQ3YzkuNCA5LjQgMjQuNiA5LjQgMzMuOSAwczkuNC0yNC42IDAtMzMuOWwtNDctNDcgNDctNDdjOS40LTkuNCA5LjQtMjQuNiAwLTMzLjlzLTI0LjYtOS40LTMzLjkgMGwtNDcgNDctNDctNDdjLTkuNC05LjQtMjQuNi05LjQtMzMuOSAweiIvPjwvc3ZnPg==);
            width: 1.25rem;
            height: 1.25rem;
            display: inline-block;
            position: absolute;
            right: 0.15rem;
            top: 3px;
          }
        }
        
        :is(label) {
          margin-bottom: 0;
          font-weight: 400;
          line-height: 1.5;
          text-wrap: balance;
          text-align: left;
        }
      
        :is(figcaption) {
          border-radius: 0.5rem;
          background-color: #fff;
          color: var(--wp--preset--color--primary-brand);
          text-align: left;
          font-size: 0.85rem;
          padding: 0.5rem;
          opacity: 0.9;
        }
        
        .select {
          font-size: 1rem;
          margin-block: 0.25rem;
          padding: .5rem;
          outline: 2px solid var(--wp--preset--color--vivid-green-cyan);
          outline-offset: 2px;

          &:disabled {
            outline: 2px solid gray;
          }
        }
      }
  }

  :is(label).small {
    font-size: 0.85rem;
    margin-block-end: 0;
    margin-block-start: .5rem;
  }


  .selection-summary {
    /* background: #f7f7f8; */
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
  }

  .link-tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .assembled-url {
    background: #111827;
    color: #e5e7eb;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .copy-link {
    padding: 0.4rem 0.7rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    cursor: pointer;
  }

  .copy-message {
    font-size: 0.9rem;
    color: #4b5563;
    display: none;
  }

  .results {
    display: grid;
    gap: 1rem;
    margin-top: 0.5rem;
    grid-template-columns: repeat(3, 1fr);
  }

  .rebate-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .rebate-title {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
  }

  .rebate-details {
    display: grid;
    gap: 0.25rem;
  }

  .rebate-details dt {
    font-weight: 600;
  }

  .rebate-details dd {
    margin: 0 0 0.5rem;
  }

  .no-results {
    color: #6b7280;
  }

  .isFadedOut {
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .selection-summary:has(p + .small-text) p {
    margin-bottom: 0;
  }

  .small-text,
  .small-text * {
    margin: 0;
    font-size: 0.85rem;
    color: #5a5a5a;
    margin-block: 0.5rem .1rem;
    text-align: right;
  }

   .small-text a {
    color: #369;
  }

  .rebate-setting {
    background: #fff;
    color: #369;
    border: 1px solid #369;
    padding-inline: 0.5rem 0.25rem;
    border-radius: 0.25rem;
    box-decoration-break: clone;
    padding-right: 2rem;
    display: block;
    text-align: left;
    text-wrap: inherit;
    width: 100%;
    position: relative;

    &:is(:hover, :focus, :focus-visible) {
      color: #fff;
    }

    &::after {
      content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNOTQgMTg3LjFDMTIwLjggMTI0LjEgMTgzLjMgODAgMjU2IDgwYzM5LjcgMCA3Ny44IDE1LjggMTA1LjkgNDMuOUw0MTQuMSAxNzYgMzYwIDE3NmMtMTMuMyAwLTI0IDEwLjctMjQgMjRzMTAuNyAyNCAyNCAyNGwxMTIgMGMxMy4zIDAgMjQtMTAuNyAyNC0yNGwwLTExMmMwLTEzLjMtMTAuNy0yNC0yNC0yNHMtMjQgMTAuNy0yNCAyNGwwIDU0LjFMMzk1LjkgODkuOUMzNTguOCA1Mi44IDMwOC41IDMyIDI1NiAzMkMxNjMuNCAzMiA4My45IDg4LjIgNDkuOCAxNjguM2MtNS4yIDEyLjIgLjUgMjYuMyAxMi43IDMxLjVzMjYuMy0uNSAzMS41LTEyLjd6bTM2OCAxNTdjNS4yLTEyLjItLjQtMjYuMy0xMi42LTMxLjVzLTI2LjMgLjQtMzEuNSAxMi42QzM5MSAzODguMSAzMjguNiA0MzIgMjU2IDQzMmMtMzkuNyAwLTc3LjgtMTUuOC0xMDUuOS00My45TDk3LjkgMzM2bDU0LjEgMGMxMy4zIDAgMjQtMTAuNyAyNC0yNHMtMTAuNy0yNC0yNC0yNEw0MCAyODhjLTEzLjMgMC0yNCAxMC43LTI0IDI0bDAgMTEyYzAgMTMuMyAxMC43IDI0IDI0IDI0czI0LTEwLjcgMjQtMjRsMC01NC4xIDUyLjEgNTIuMUMxNTMuMiA0NTkuMiAyMDMuNSA0ODAgMjU2IDQ4MGM5Mi41IDAgMTcxLjgtNTYgMjA2LTEzNS45eiIgZmlsbD0iIzM2OSIgLz48L3N2Zz4=);
      transform-origin: 50% 62%;
      width: 1rem;
      height: 1rem;
      display: inline-block;
      margin-left: 0.5rem;
      position: absolute;
      right: 0.5rem;
      top: 0.65rem;
    }

    &:is(:hover, :focus, :focus-visible)::after {
      content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNOTQgMTg3LjFDMTIwLjggMTI0LjEgMTgzLjMgODAgMjU2IDgwYzM5LjcgMCA3Ny44IDE1LjggMTA1LjkgNDMuOUw0MTQuMSAxNzYgMzYwIDE3NmMtMTMuMyAwLTI0IDEwLjctMjQgMjRzMTAuNyAyNCAyNCAyNGwxMTIgMGMxMy4zIDAgMjQtMTAuNyAyNC0yNGwwLTExMmMwLTEzLjMtMTAuNy0yNC0yNC0yNHMtMjQgMTAuNy0yNCAyNGwwIDU0LjFMMzk1LjkgODkuOUMzNTguOCA1Mi44IDMwOC41IDMyIDI1NiAzMkMxNjMuNCAzMiA4My45IDg4LjIgNDkuOCAxNjguM2MtNS4yIDEyLjIgLjUgMjYuMyAxMi43IDMxLjVzMjYuMy0uNSAzMS41LTEyLjd6bTM2OCAxNTdjNS4yLTEyLjItLjQtMjYuMy0xMi42LTMxLjVzLTI2LjMgLjQtMzEuNSAxMi42QzM5MSAzODguMSAzMjguNiA0MzIgMjU2IDQzMmMtMzkuNyAwLTc3LjgtMTUuOC0xMDUuOS00My45TDk3LjkgMzM2bDU0LjEgMGMxMy4zIDAgMjQtMTAuNyAyNC0yNHMtMTAuNy0yNC0yNC0yNEw0MCAyODhjLTEzLjMgMC0yNCAxMC43LTI0IDI0bDAgMTEyYzAgMTMuMyAxMC43IDI0IDI0IDI0czI0LTEwLjcgMjQtMjRsMC01NC4xIDUyLjEgNTIuMUMxNTMuMiA0NTkuMiAyMDMuNSA0ODAgMjU2IDQ4MGM5Mi41IDAgMTcxLjgtNTYgMjA2LTEzNS45eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=);
    }
  }
}

#rebateFilterApp[data-mode="single"] .loader {
  height: 270px;
  display: grid;
  place-items: center;
  background-color: #fff;
  box-shadow: 0 .25rem .7rem #31313240;
  border: 0;
  border-radius: .66rem;
  font-size: 0.85rem;
  color: #fff;
}

#rebateFilterApp[data-mode="single"] select,
#rebateFilterApp[data-mode="single"] .select {
  overflow: clip;
}

#rebateFilterApp[data-mode="single"] #rebatesFilterControls .selection-summary{
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.rebate-setting.is-external-dirty::after {
  animation: spin1440 4s linear;
}

@keyframes spin1440 {
  from { transform: rotate(0turn); }
  to   { transform: rotate(4turn); }
}

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls.filters-dirty {
  background: var(--wp--preset--color--custom-warning-bg);
  outline: 3px solid var(--wp--preset--color--custom-warning-border, rgba(255, 192, 23, .25));
}

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls.filters-dirty::after {
  content: "If your URL has been modified manually, you may need to edit your settings — or clear them completely and start over — to fix.";
  background-color: #ffc01757;
  display: block;
  border: 2px dashed #ffc017;
  border-radius: 0.66rem;
  padding: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
}

.update-page-container {
  border: none !important;
}

p.rebate-detail.rebate-detail.rebate-detail {
  color: #369;
  font-weight: 600;
  margin-bottom: 0;
}

.filter-container.labels-hidden p.rebate-detail.rebate-detail.rebate-detail {
  font-weight: 400;
}

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls:has(.editBtn:is(:focus-visible, :focus, :hover)) {
  background-color: hsl(210, 100%, 96%);
  transition: all ease-in-out .3s;
}

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls .editBtn {
  position: absolute;
  right: -1rem;
  top: -1rem;
  min-width: 10rem;
  padding: 0 1rem 0 0;
  height: 1rem;
  background-color: #fff;
  border: 0 !important;
  outline: 0 !important;
  color: #369;
  display: flex;
  justify-content: end;
  align-items: center;
  border-radius: 0 0.66rem 0 0.66rem;
  transition: all ease-in-out .3s;

  :is(span) {
    font-size: 0.85rem;
    display: inline-block;
    text-align: center;
    width: 100%;
  }

  &:is(:focus-visible, :focus, :hover) {
    outline: 0;
    background-color: rgb(235, 245, 255);

    & :is(span) {
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 1px;
    }
  }

  &.saving {
    min-width: 6.75rem;
    background-color: var(--wp--preset--color--primary-brand);
  }
  &.saving :is(span) {
    color: var(--wp--preset--color--white);
    text-align: right;
    padding-inline-end: 1rem;
  }

  &::after {
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSIjOWY5ZDljIiBkPSJNMzguOCA1LjFDMjguNC0zLjEgMTMuMy0xLjIgNS4xIDkuMlMtMS4yIDM0LjcgOS4yIDQyLjlsNTkyIDQ2NGMxMC40IDguMiAyNS41IDYuMyAzMy43LTQuMXM2LjMtMjUuNS00LjEtMzMuN0w1MjUuNiAzODYuN2MzOS42LTQwLjYgNjYuNC04Ni4xIDc5LjktMTE4LjRjMy4zLTcuOSAzLjMtMTYuNyAwLTI0LjZjLTE0LjktMzUuNy00Ni4yLTg3LjctOTMtMTMxLjFDNDY1LjUgNjguOCA0MDAuOCAzMiAzMjAgMzJjLTY4LjIgMC0xMjUgMjYuMy0xNjkuMyA2MC44TDM4LjggNS4xem0xNTEgMTE4LjNDMjI2IDk3LjcgMjY5LjUgODAgMzIwIDgwYzY1LjIgMCAxMTguOCAyOS42IDE1OS45IDY3LjdDNTE4LjQgMTgzLjUgNTQ1IDIyNiA1NTguNiAyNTZjLTEyLjYgMjgtMzYuNiA2Ni44LTcwLjkgMTAwLjlsLTUzLjgtNDIuMmM5LjEtMTcuNiAxNC4yLTM3LjUgMTQuMi01OC43YzAtNzAuNy01Ny4zLTEyOC0xMjgtMTI4Yy0zMi4yIDAtNjEuNyAxMS45LTg0LjIgMzEuNWwtNDYuMS0zNi4xek0zOTQuOSAyODQuMmwtODEuNS02My45YzQuMi04LjUgNi42LTE4LjIgNi42LTI4LjNjMC01LjUtLjctMTAuOS0yLTE2Yy43IDAgMS4zIDAgMiAwYzQ0LjIgMCA4MCAzNS44IDgwIDgwYzAgOS45LTEuOCAxOS40LTUuMSAyOC4yem05LjQgMTMwLjNDMzc4LjggNDI1LjQgMzUwLjcgNDMyIDMyMCA0MzJjLTY1LjIgMC0xMTguOC0yOS42LTE1OS45LTY3LjdDMTIxLjYgMzI4LjUgOTUgMjg2IDgxLjQgMjU2YzguMy0xOC40IDIxLjUtNDEuNSAzOS40LTY0LjhMODMuMSAxNjEuNUM2MC4zIDE5MS4yIDQ0IDIyMC44IDM0LjUgMjQzLjdjLTMuMyA3LjktMy4zIDE2LjcgMCAyNC42YzE0LjkgMzUuNyA0Ni4yIDg3LjcgOTMgMTMxLjFDMTc0LjUgNDQzLjIgMjM5LjIgNDgwIDMyMCA0ODBjNDcuOCAwIDg5LjktMTIuOSAxMjYuMi0zMi41bC00MS45LTMzek0xOTIgMjU2YzAgNzAuNyA1Ny4zIDEyOCAxMjggMTI4YzEzLjMgMCAyNi4xLTIgMzguMi01LjhMMzAyIDMzNGMtMjMuNS01LjQtNDMuMS0yMS4yLTUzLjctNDIuM2wtNTYuMS00NC4yYy0uMiAyLjgtLjMgNS42LS4zIDguNXoiLz48L3N2Zz4=);
    display: inline-block;
    position: absolute;
    right: 0.5rem;
  }

    &:is(:hover, :focus-visible)::after {
     content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSIjMDM2IiBkPSJNMzguOCA1LjFDMjguNC0zLjEgMTMuMy0xLjIgNS4xIDkuMlMtMS4yIDM0LjcgOS4yIDQyLjlsNTkyIDQ2NGMxMC40IDguMiAyNS41IDYuMyAzMy43LTQuMXM2LjMtMjUuNS00LjEtMzMuN0w1MjUuNiAzODYuN2MzOS42LTQwLjYgNjYuNC04Ni4xIDc5LjktMTE4LjRjMy4zLTcuOSAzLjMtMTYuNyAwLTI0LjZjLTE0LjktMzUuNy00Ni4yLTg3LjctOTMtMTMxLjFDNDY1LjUgNjguOCA0MDAuOCAzMiAzMjAgMzJjLTY4LjIgMC0xMjUgMjYuMy0xNjkuMyA2MC44TDM4LjggNS4xem0xNTEgMTE4LjNDMjI2IDk3LjcgMjY5LjUgODAgMzIwIDgwYzY1LjIgMCAxMTguOCAyOS42IDE1OS45IDY3LjdDNTE4LjQgMTgzLjUgNTQ1IDIyNiA1NTguNiAyNTZjLTEyLjYgMjgtMzYuNiA2Ni44LTcwLjkgMTAwLjlsLTUzLjgtNDIuMmM5LjEtMTcuNiAxNC4yLTM3LjUgMTQuMi01OC43YzAtNzAuNy01Ny4zLTEyOC0xMjgtMTI4Yy0zMi4yIDAtNjEuNyAxMS45LTg0LjIgMzEuNWwtNDYuMS0zNi4xek0zOTQuOSAyODQuMmwtODEuNS02My45YzQuMi04LjUgNi42LTE4LjIgNi42LTI4LjNjMC01LjUtLjctMTAuOS0yLTE2Yy43IDAgMS4zIDAgMiAwYzQ0LjIgMCA4MCAzNS44IDgwIDgwYzAgOS45LTEuOCAxOS40LTUuMSAyOC4yem05LjQgMTMwLjNDMzc4LjggNDI1LjQgMzUwLjcgNDMyIDMyMCA0MzJjLTY1LjIgMC0xMTguOC0yOS42LTE1OS45LTY3LjdDMTIxLjYgMzI4LjUgOTUgMjg2IDgxLjQgMjU2YzguMy0xOC40IDIxLjUtNDEuNSAzOS40LTY0LjhMODMuMSAxNjEuNUM2MC4zIDE5MS4yIDQ0IDIyMC44IDM0LjUgMjQzLjdjLTMuMyA3LjktMy4zIDE2LjcgMCAyNC42YzE0LjkgMzUuNyA0Ni4yIDg3LjcgOTMgMTMxLjFDMTc0LjUgNDQzLjIgMjM5LjIgNDgwIDMyMCA0ODBjNDcuOCAwIDg5LjktMTIuOSAxMjYuMi0zMi41bC00MS45LTMzek0xOTIgMjU2YzAgNzAuNyA1Ny4zIDEyOCAxMjggMTI4YzEzLjMgMCAyNi4xLTIgMzguMi01LjhMMzAyIDMzNGMtMjMuNS01LjQtNDMuMS0yMS4yLTUzLjctNDIuM2wtNTYuMS00NC4yYy0uMiAyLjgtLjMgNS42LS4zIDguNXoiLz48L3N2Zz4=);
    }


  &.hide-labels::after {
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjOWY5ZDljIiBkPSJNMjg4IDgwYy02NS4yIDAtMTE4LjggMjkuNi0xNTkuOSA2Ny43Qzg5LjYgMTgzLjUgNjMgMjI2IDQ5LjQgMjU2YzEzLjYgMzAgNDAuMiA3Mi41IDc4LjYgMTA4LjNDMTY5LjIgNDAyLjQgMjIyLjggNDMyIDI4OCA0MzJzMTE4LjgtMjkuNiAxNTkuOS02Ny43QzQ4Ni40IDMyOC41IDUxMyAyODYgNTI2LjYgMjU2Yy0xMy42LTMwLTQwLjItNzIuNS03OC42LTEwOC4zQzQwNi44IDEwOS42IDM1My4yIDgwIDI4OCA4MHpNOTUuNCAxMTIuNkMxNDIuNSA2OC44IDIwNy4yIDMyIDI4OCAzMnMxNDUuNSAzNi44IDE5Mi42IDgwLjZjNDYuOCA0My41IDc4LjEgOTUuNCA5MyAxMzEuMWMzLjMgNy45IDMuMyAxNi43IDAgMjQuNmMtMTQuOSAzNS43LTQ2LjIgODcuNy05MyAxMzEuMUM0MzMuNSA0NDMuMiAzNjguOCA0ODAgMjg4IDQ4MHMtMTQ1LjUtMzYuOC0xOTIuNi04MC42QzQ4LjYgMzU2IDE3LjMgMzA0IDIuNSAyNjguM2MtMy4zLTcuOS0zLjMtMTYuNyAwLTI0LjZDMTcuMyAyMDggNDguNiAxNTYgOTUuNCAxMTIuNnpNMjg4IDMzNmM0NC4yIDAgODAtMzUuOCA4MC04MHMtMzUuOC04MC04MC04MGMtLjcgMC0xLjMgMC0yIDBjMS4zIDUuMSAyIDEwLjUgMiAxNmMwIDM1LjMtMjguNyA2NC02NCA2NGMtNS41IDAtMTAuOS0uNy0xNi0yYzAgLjcgMCAxLjMgMCAyYzAgNDQuMiAzNS44IDgwIDgwIDgwem0wLTIwOGExMjggMTI4IDAgMSAxIDAgMjU2IDEyOCAxMjggMCAxIDEgMC0yNTZ6Ii8+PC9zdmc+);
    width: 1.1rem;
    max-width: 1.1rem !important;
    top: 0;
    position: relative;
  }
  &.hide-labels:is(:hover, :focus-visible)::after {
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjMDM2IiBkPSJNMjg4IDgwYy02NS4yIDAtMTE4LjggMjkuNi0xNTkuOSA2Ny43Qzg5LjYgMTgzLjUgNjMgMjI2IDQ5LjQgMjU2YzEzLjYgMzAgNDAuMiA3Mi41IDc4LjYgMTA4LjNDMTY5LjIgNDAyLjQgMjIyLjggNDMyIDI4OCA0MzJzMTE4LjgtMjkuNiAxNTkuOS02Ny43QzQ4Ni40IDMyOC41IDUxMyAyODYgNTI2LjYgMjU2Yy0xMy42LTMwLTQwLjItNzIuNS03OC42LTEwOC4zQzQwNi44IDEwOS42IDM1My4yIDgwIDI4OCA4MHpNOTUuNCAxMTIuNkMxNDIuNSA2OC44IDIwNy4yIDMyIDI4OCAzMnMxNDUuNSAzNi44IDE5Mi42IDgwLjZjNDYuOCA0My41IDc4LjEgOTUuNCA5MyAxMzEuMWMzLjMgNy45IDMuMyAxNi43IDAgMjQuNmMtMTQuOSAzNS43LTQ2LjIgODcuNy05MyAxMzEuMUM0MzMuNSA0NDMuMiAzNjguOCA0ODAgMjg4IDQ4MHMtMTQ1LjUtMzYuOC0xOTIuNi04MC42QzQ4LjYgMzU2IDE3LjMgMzA0IDIuNSAyNjguM2MtMy4zLTcuOS0zLjMtMTYuNyAwLTI0LjZDMTcuMyAyMDggNDguNiAxNTYgOTUuNCAxMTIuNnpNMjg4IDMzNmM0NC4yIDAgODAtMzUuOCA4MC04MHMtMzUuOC04MC04MC04MGMtLjcgMC0xLjMgMC0yIDBjMS4zIDUuMSAyIDEwLjUgMiAxNmMwIDM1LjMtMjguNyA2NC02NCA2NGMtNS41IDAtMTAuOS0uNy0xNi0yYzAgLjcgMCAxLjMgMCAyYzAgNDQuMiAzNS44IDgwIDgwIDgwem0wLTIwOGExMjggMTI4IDAgMSAxIDAgMjU2IDEyOCAxMjggMCAxIDEgMC0yNTZ6Ii8+PC9zdmc+);
  }
  &.readonly-toggle {
    right: -1rem;

    &.saving::after {
      content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzIgOTZjMC0xNy43IDE0LjMtMzIgMzItMzJsMCA5NmMwIDE3LjcgMTQuMyAzMiAzMiAzMmwxOTIgMGMxNy43IDAgMzItMTQuMyAzMi0zMmwwLTk0LjJjNC41IDEuNiA4LjcgNC4yIDEyLjEgNy42bDc0LjUgNzQuNWM2IDYgOS40IDE0LjEgOS40IDIyLjZMNDE2IDQxNmMwIDE3LjctMTQuMyAzMi0zMiAzMkw2NCA0NDhjLTE3LjcgMC0zMi0xNC4zLTMyLTMyTDMyIDk2ek05NiA2NGwxOTIgMCAwIDk2TDk2IDE2MGwwLTk2ek0wIDk2TDAgNDE2YzAgMzUuMyAyOC43IDY0IDY0IDY0bDMyMCAwYzM1LjMgMCA2NC0yOC43IDY0LTY0bDAtMjQ1LjVjMC0xNy02LjctMzMuMy0xOC43LTQ1LjNMMzU0LjcgNTAuN2MtMTItMTItMjguMy0xOC43LTQ1LjMtMTguN0w2NCAzMkMyOC43IDMyIDAgNjAuNyAwIDk2ek0yNzIgMzIwYTQ4IDQ4IDAgMSAxIC05NiAwIDQ4IDQ4IDAgMSAxIDk2IDB6bS00OC04MGE4MCA4MCAwIDEgMCAwIDE2MCA4MCA4MCAwIDEgMCAwLTE2MHoiLz48L3N2Zz4=);
      width: 1.1rem;
      max-width: 1.1rem !important;
    }
  }
  &.readonly-toggle.show-readonly-mode::after {
    /* pencil */
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBkPSJNMzk1LjggMzkuNmM5LjQtOS40IDI0LjYtOS40IDMzLjkgMGw0Mi42IDQyLjZjOS40IDkuNCA5LjQgMjQuNiAwIDMzLjlMNDE3LjYgMTcxIDM0MSA5NC40bDU0LjgtNTQuOHpNMzE4LjQgMTE3TDM5NSAxOTMuNmwtMjE5IDIxOSAwLTEyLjZjMC04LjgtNy4yLTE2LTE2LTE2bC0zMiAwIDAtMzJjMC04LjgtNy4yLTE2LTE2LTE2bC0xMi42IDAgMjE5LTIxOXpNNjYuOSAzNzkuNWMxLjItNCAyLjctNy45IDQuNy0xMS41TDk2IDM2OGwwIDMyYzAgOC44IDcuMiAxNiAxNiAxNmwzMiAwIDAgMjQuNGMtMy43IDEuOS03LjUgMy41LTExLjYgNC43TDM5LjYgNDcyLjRsMjcuMy05Mi44ek00NTIuNCAxN2MtMjEuOS0yMS45LTU3LjMtMjEuOS03OS4yIDBMNjAuNCAzMjkuN2MtMTEuNCAxMS40LTE5LjcgMjUuNC0yNC4yIDQwLjhMLjcgNDkxLjVjLTEuNyA1LjYtLjEgMTEuNyA0IDE1LjhzMTAuMiA1LjcgMTUuOCA0bDEyMS0zNS42YzE1LjQtNC41IDI5LjQtMTIuOSA0MC44LTI0LjJMNDk1IDEzOC44YzIxLjktMjEuOSAyMS45LTU3LjMgMC03OS4yTDQ1Mi40IDE3ek0zMzEuMyAyMDIuN2M2LjItNi4yIDYuMi0xNi40IDAtMjIuNnMtMTYuNC02LjItMjIuNiAwbC0xMjggMTI4Yy02LjIgNi4yLTYuMiAxNi40IDAgMjIuNnMxNi40IDYuMiAyMi42IDBsMTI4LTEyOHoiLz48L3N2Zz4=);
    width: 1.05rem;
    max-width: 1.05rem !important;
    right: 10px;
  }
  &.readonly-toggle::after {
    /* pencil slash */
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBkPSJNMjUuOSAzLjRDMTktMiA4LjktLjggMy40IDYuMVMtLjggMjMuMSA2LjEgMjguNmw2MDggNDgwYzYuOSA1LjUgMTcgNC4zIDIyLjUtMi42czQuMy0xNy0yLjYtMjIuNUwyNS45IDMuNHpNNTU5IDEzOC44YzIxLjktMjEuOSAyMS45LTU3LjMgMC03OS4yTDUxNi40IDE3Yy0yMS45LTIxLjktNTcuMy0yMS45LTc5LjIgMEwyOTcuNSAxNTYuN2wyNS4zIDIwTDM4Mi40IDExNyA0NTkgMTkzLjZsLTUwLjYgNTAuNiAyNS4zIDIwTDU1OSAxMzguOHpNMzE3LjIgMzM1LjNMMjQwIDQxMi42bDAtMTIuNmMwLTguOC03LjItMTYtMTYtMTZsLTMyIDAgMC0zMmMwLTguOC03LjItMTYtMTYtMTZsLTEyLjYgMCA2OC4yLTY4LjItMjUuMy0yMC04MS45IDgxLjljLTExLjQgMTEuNC0xOS43IDI1LjQtMjQuMiA0MC44bC0zNS42IDEyMWMtMS43IDUuNi0uMSAxMS43IDQgMTUuOHMxMC4yIDUuNyAxNS44IDRsMTIxLTM1LjZjMTUuNC00LjUgMjkuNC0xMi45IDQwLjgtMjQuMmw5Ni4yLTk2LjItMjUuMy0yMHpNNDkzLjggMzkuNmw0Mi42IDQyLjZjOS40IDkuNCA5LjQgMjQuNiAwIDMzLjlMNDgxLjYgMTcxIDQwNSA5NC40bDU0LjgtNTQuOGM5LjQtOS40IDI0LjYtOS40IDMzLjkgMHpNMTM1LjYgMzY4bDI0LjQgMCAwIDMyYzAgOC44IDcuMiAxNiAxNiAxNmwzMiAwIDAgMjQuNGMtMy43IDEuOS03LjUgMy41LTExLjYgNC43bC05Mi44IDI3LjMgMjcuMy05Mi44YzEuMi00IDIuNy03LjkgNC43LTExLjZ6Ii8+PC9zdmc+);
    width: 1.3rem;
    max-width: 1.3rem !important;
  }

}
</style>
<style>
.error-message {
  color: var(--wp--preset--color--vivid-red);
}

.warning-message {
  background: #fff7e5;
  border: 1px solid #facc15;
  color: #92400e;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.query-conditional-group-block.is-dirty-variable::before,
.multi-query-content-block.is-dirty-variable::after {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyNCAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1LjcxOTYgMi4zNTY4N0MxNC45MzU3IDEuMDQyOSAxMy41NDU3IDAuMjM0Mzc1IDEyLjAwNDggMC4yMzQzNzVDMTAuNDYyNyAwLjIzNDM3NSA5LjA3MjY0IDEuMDE4MjMgOC4yODk5NSAyLjM1Njg3TDAuNjMyMDkgMTUuMTk1NkMtMC4yMDIxMDkgMTYuNTU5OSAtMC4yMDIxMDkgMTguMTc3IDAuNTgxNzQxIDE5LjU2N0MxLjM2NTYgMjAuOTMxMyAyLjc4MDI2IDIxLjc2NTUgNC4zNDY4NiAyMS43NjU1SDE5LjY2MjZDMjEuMjU1IDIxLjc2NTUgMjIuNjQ1IDIwLjk1NyAyMy40Mjc3IDE5LjU2N0MyNC4yMTE1IDE4LjIwMjcgMjQuMTg1OSAxNi41NjAxIDIzLjM3NzMgMTUuMTk0NkwxNS43MTk2IDIuMzU2ODdaTTEyLjAwNDggMTguNDA1QzExLjA0NDIgMTguNDA1IDEwLjI2MTQgMTcuNjIxMSAxMC4yNjE0IDE2LjY2MTZDMTAuMjYxNCAxNS43MDEgMTEuMDQ1MiAxNC45MTgyIDEyLjAwNDggMTQuOTE4MkMxMi45NjUzIDE0LjkxODIgMTMuNzQ4MiAxNS43MDIgMTMuNzQ4MiAxNi42NjE2QzEzLjc0ODIgMTcuNjIxMSAxMi45NjUzIDE4LjQwNSAxMi4wMDQ4IDE4LjQwNVpNMTMuODI0MiA2LjU3NzE1TDEzLjMxODcgMTIuMzM5NkMxMy4yOTMxIDEyLjY5MyAxMy4xMTY0IDEzLjAyMTcgMTIuODM5IDEzLjI0OThDMTIuNjExOSAxMy40NTIyIDEyLjMwNzggMTMuNTUyOCAxMS45ODAxIDEzLjU1MjhIMTEuODUzN0MxMS4yMjE5IDEzLjUwMjUgMTAuNjkwOCAxMi45OTcxIDEwLjY0MDUgMTIuMzM5NkwxMC4xMzUgNi41NzcxNUMxMC4wODQ3IDYuMDk3MzcgMTAuMjM1NyA1LjYxNjU5IDEwLjU2NDQgNS4yMzc1QzEwLjg5MzIgNC44NTg0MSAxMS4zMjI2IDQuNjMxMzYgMTEuODAyNCA0LjU4QzEyLjMwNzggNC41Mjk2NiAxMi43NjMgNC42ODA3IDEzLjE0MiA1LjAwOTQ0QzEzLjUyMTEgNS4zMTI1MSAxMy43NDgyIDUuNzY3NjEgMTMuNzk5NSA2LjI0NzM5QzEzLjg0OTkgNi4zNzQ3NCAxMy44NDk5IDYuNDc2NDIgMTMuODI0MiA2LjU3NzEyTDEzLjgyNDIgNi41NzcxNVoiIGZpbGw9IiNGRkMwMTciLz4KPC9zdmc+);
  background-size: 15px;
  content: "Reloading settings update";
  display: inline-block;
  height: var(--wp--preset--font-size--small);
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  position: relative;
  top: -1px;
  margin-left: 4px;
  font-size: .85rem;
  background-position: left 4px;
  padding-left: 1.15rem;
  color: #92400e;
}

.query-conditional-group-block.is-dirty-variable:not(.query-conditional-group-block .query-conditional-group-block) {
  outline: 2px dashed #ffc017;
  outline-offset: 0.66rem;
  border-radius: 1px;
}

#rebatesFilterControls.labels-hidden label.small {
  display: none !important;
}
</style>