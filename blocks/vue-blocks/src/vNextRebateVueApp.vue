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
      <div id="rebatesFilterControls" class="filter-container" :class="{ 'filters-dirty': isDirty }">

        <p v-if="(!hasAllSelection || isDirty) && mode === 'single'" class='warning-message'>
          You may be looking at default or incomplete information.
          <span v-if='!isDirty'>
            Please update your settings.
          </span>
          <span v-if='isDirty'>
            The page URL does not match your settings. Please update and save your selections.
          </span>
        </p>

        <div v-if="mode === 'single'" class="selection-summary" aria-live="polite">
          <p>
            <strong>Current rebate settings: </strong><br />

            <template v-for="field in fields" :key="field.key">
              <template v-if="field.condition === undefined || field.condition">
                <!-- If field has a value -->
                <template v-if="field.displayValue">
                  <!-- Show button (unless its select is open) -->
                  <button v-if="activeEdit !== field.key" class="rebate-setting" @click="openEdit(field.key)" :ref="el => (buttonRefs[field.key] = el)">
                    {{ field.displayValue }}
                  </button>

                  <!-- Show select if open -->
                  <div v-else-if="editable && activeEdit === field.key">
                    <div class="control editable">
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
                    </div>
                  </div>
                </template>

                <!-- If field is missing → show select immediately -->
                <template v-else>
                  <div class="control editable">
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
                  </div>
                </template>
              </template>
            </template>


          </p>

          <p v-if="hasAnySelection" class="small-text">
            <a @click="clearSettings">Clear your settings</a> and start over.
          </p>
        </div>


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
        <div v-if="mode === 'single'" class="update-page-container" :class='isDirty ? "has-icon warning" : ""'>
          <button v-if="editable || isDirty" type="button" class="update-page-btn" @click="reloadPage"
            :disabled='!isDirty'>
            Save and update
          </button>
        </div>

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
      <p v-else class="no-results">Please complete the form above.</p>

      <!-- Selection summary (for quick verification) -->
      <div class="selection-summary" aria-live="polite">
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
import { computed, ref, nextTick, onMounted, watch } from 'vue'

/** Public domain fallback */
const publicDomain = ref('https://www.betterhomesbc.ca')
/** API endpoint */
const rebatesAPI = `${window.site?.domain ? window.site.domain : publicDomain.value}/wp-json/custom/v2/rebates`

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

function reloadPage() {
  isDirty.value = false
  initialUrl = assembledQueryString.value
  window.location.reload()
}

// --- Editable state ---
const editable = ref(false)
const activeEdit = ref('')

// --- Focus map for selects ---
const selectRefs = ref({})
const buttonRefs = ref({})

// Force full re-render when their options list changes
const fieldRenderKeys = ref({
  homeValue: 0,
  income: 0
})

// --- Toggle editable mode ---
function toggleEditable() {
  editable.value = !editable.value
  if (!editable.value) activeEdit.value = ''
}

// --- Open a specific field ---
function openEdit(field) {
  editable.value = true
  activeEdit.value = field
}

// --- Auto-close on change ---
async function handleSelectChange(fieldKey, newValue) {
  if (!newValue) return
  await nextTick()
  activeEdit.value = ''
  await nextTick()
  const btn = buttonRefs.value[fieldKey]
  if (btn) btn.focus()
}

// --- Keyboard navigation ---
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

// --- Clear all settings + open first missing ---
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
  isDirty.value = false

  editable.value = true
  const firstMissing = fields.value.find(f => !f.displayValue)
  activeEdit.value = firstMissing ? firstMissing.key : ''
}

// --- Unified fields config ---
const fields = computed(() => [
  {
    key: 'building',
    label: 'What kind of home do you live in?',
    vModel: selectedBuildingTypeSlug,
    groups: buildingTypeGroups.value,
    isGrouped: true,
    displayValue: selectedBuildingTypeName.value,
    missingMessage: 'Missing home type'
  },
  {
    key: 'murbTenure',
    label: 'Do you own or rent your home?',
    vModel: murbTenure,
    options: [
      { slug: 'own', name: 'Own' },
      { slug: 'rent', name: 'Rent' }
    ],
    displayValue: murbTenureLabel.value,
    missingMessage: 'Missing MURB status',
    condition: selectedBuildingGroupSlug.value === 'murb'
  },
  {
    key: 'homeValue',
    label: 'What is the current assessed value of your home?',
    vModel: selectedHomeValueSlug,
    options: homeValueOptions.value,
    displayValue: selectedHomeValueName.value,
    missingMessage: 'Missing home value',
    disabled: !selectedBuildingGroupSlug.value,
    ready: homeValueOptions.value.length > 0
  },
  {
    key: 'persons',
    label: 'How many people live in your household?',
    vModel: selectedPersonsSlug,
    options: personCountOptions.value,
    displayValue: selectedPersonsCount.value,
    missingMessage: 'Missing household number'
  },
  {
    key: 'income',
    label: 'What is the combined pre-tax income of all adults in your household (excluding dependants)?',
    vModel: selectedIncomeRangeSlug,
    options: incomeRangeOptions.value,
    displayValue: selectedIncomeRangeName.value,
    missingMessage: 'Missing household income',
    disabled: !selectedPersonsSlug.value,
    ready: incomeRangeOptions.value.length > 0
  },
  {
    key: 'location',
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
    label: 'Which utility company provides your electrical service?',
    vModel: selectedUtilitySlug,
    options: utilityOptions.value,
    displayValue: selectedUtilityName.value,
    missingMessage: 'Missing service details'
  }
])


const isDirty = ref(false) // whether filters differ from initial state
let initialUrl = ''

onMounted(() => {
  initialUrl = window.location.search // record the initial query string

  // Watch for changes in URL state deps
  watch(urlStateDeps, () => {
    const currentQs = assembledQueryString.value
    isDirty.value = currentQs !== initialUrl
  }, { deep: true })

  watch(urlStateDeps, (newDeps) => {
    if (hasAllSelection.value) {
      localStorage.setItem('rebateToolSettings', JSON.stringify(newDeps))
    }
  }, { deep: true })

})

watch(isDirty, (newVal) => {
  const targetVariableContent = document.querySelectorAll('.multi-query-content-block')
  const targetVariableGroups = document.querySelectorAll('.query-conditional-group-block')
  targetVariableContent.forEach(el => {
    el.classList.toggle('is-dirty-variable', newVal)
  })
  targetVariableGroups.forEach(el => {
    el.classList.toggle('is-dirty-variable', newVal)
  })
})

// --- Watcher: Toggle classes based on isDirty ---
function applyDirtyClasses() {
  const targets = document.querySelectorAll('.multi-query-content-block > span[data-replace="value"]')
  targets.forEach(el => {
    el.classList.toggle('is-dirty', isDirty.value)
  })
}

// Watch the isDirty state and update existing elements
watch(isDirty, () => {
  applyDirtyClasses()
})



// --- MutationObserver: Track future DOM changes ---
onMounted(() => {
  const observer = new MutationObserver(() => {
    applyDirtyClasses()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})

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
      return // stop further initialization until page reloads
    } else {
      // First visit → nothing special.
      console.log('No saved settings — starting fresh')
    }

    watch(urlStateDeps, updateAddressBar, { deep: true })

    watch(homeValueOptions, async (newVal) => {
      if (!selectedHomeValueSlug.value && newVal.length > 0) {
        // force remount and focus
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

  // After restoring state, update the URL and initialUrl
  updateAddressBar()
  initialUrl = assembledQueryString.value
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

// ----- Copy link -----
function addLinkToClipboard(event) {
  const url = assembledUrl.value
  navigator.clipboard?.writeText(url)
    .then(() => handleLinkCopiedMessageContent(event, '.selection-summary', 'Link copied to clipboard'))
    .catch((err) => {
      console.error('Failed to copy URL:', err)
      handleLinkCopiedMessageContent(event, '.selection-summary', 'Copy failed')
    })
}
function handleLinkCopiedMessageContent(event, targetSelector, msg) {
  const root = document.querySelector(targetSelector) || document.body
  const el = root.querySelector('.copy-message')
  if (!el) return
  el.textContent = msg
  el.classList.remove('isFadedOut')
  setTimeout(() => el.classList.add('isFadedOut'), 1200)
  setTimeout(() => { el.textContent = '' }, 1800)
}

// ----- Query string -> state -----
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

// ----- Helper to append current query string -----
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
    grid-template-columns: 1fr;
  }

  .control {
    display: grid;
    gap: 0.25rem;
    margin-bottom: 0.5rem;

    &.editable {
      color: white;
      background-color: var(--wp--preset--color--primary-brand);
      outline: 2px solid var(--wp--preset--color--primary-brand);
      outline-offset: 2px;
      padding: 0.5rem;
      border-radius: 0.5rem;
      margin-block: 0.5rem;
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
        top: 1px;
      }
    }
  }

  .control label {
    margin-bottom: 0;
  }

  .select {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .selection-summary {
    background: #f7f7f8;
    padding: 0.75rem;
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
    font-size: 0.85rem
  }

  .rebate-setting {
    background: #fff;
    color: #369;
    border: 1px solid #369;
    padding-inline: 0.5rem 0.25rem;
    border-radius: 0.25rem;
    box-decoration-break: clone;
    padding-right: 2rem;
    margin-block: 0.25rem;
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
  height: 428px;
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
  max-width: 280px;
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

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls.filters-dirty {
  background: var(--wp--preset--color--custom-warning-bg);
  outline: 3px solid var(--wp--preset--color--custom-warning-border, rgba(255, 192, 23, .25));
}

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls.filters-dirty::after {
  content: "If your URL has been modified manually, you may need to edit your settings — or clear them completely and start over — to fix.";
  background-color: #ffc01757;
  color: var(--wp--preset--color--custom-secondary-brand);
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

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls .editBtn {
  font-size: 0;
  position: absolute;
  right: -0.25rem;
  top: -0.25rem;
  width: 2.25rem;
  max-width: 2.25rem;
  min-width: 2.25rem;
  padding: 0.25rem;
  height: 0.85rem;
  background-color: white;
  border: 1px solid lightgray !important;

  &::after {
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMzk1LjggMzkuNmM5LjQtOS40IDI0LjYtOS40IDMzLjkgMGw0Mi42IDQyLjZjOS40IDkuNCA5LjQgMjQuNiAwIDMzLjlMNDE3LjYgMTcxIDM0MSA5NC40bDU0LjgtNTQuOHpNMzE4LjQgMTE3TDM5NSAxOTMuNmwtMjE5IDIxOSAwLTEyLjZjMC04LjgtNy4yLTE2LTE2LTE2bC0zMiAwIDAtMzJjMC04LjgtNy4yLTE2LTE2LTE2bC0xMi42IDAgMjE5LTIxOXpNNjYuOSAzNzkuNWMxLjItNCAyLjctNy45IDQuNy0xMS41TDk2IDM2OGwwIDMyYzAgOC44IDcuMiAxNiAxNiAxNmwzMiAwIDAgMjQuNGMtMy43IDEuOS03LjUgMy41LTExLjYgNC43TDM5LjYgNDcyLjRsMjcuMy05Mi44ek00NTIuNCAxN2MtMjEuOS0yMS45LTU3LjMtMjEuOS03OS4yIDBMNjAuNCAzMjkuN2MtMTEuNCAxMS40LTE5LjcgMjUuNC0yNC4yIDQwLjhMLjcgNDkxLjVjLTEuNyA1LjYtLjEgMTEuNyA0IDE1LjhzMTAuMiA1LjcgMTUuOCA0bDEyMS0zNS42YzE1LjQtNC41IDI5LjQtMTIuOSA0MC44LTI0LjJMNDk1IDEzOC44YzIxLjktMjEuOSAyMS45LTU3LjMgMC03OS4yTDQ1Mi40IDE3ek0zMzEuMyAyMDIuN2M2LjItNi4yIDYuMi0xNi40IDAtMjIuNnMtMTYuNC02LjItMjIuNiAwbC0xMjggMTI4Yy02LjIgNi4yLTYuMiAxNi40IDAgMjIuNnMxNi40IDYuMiAyMi42IDBsMTI4LTEyOHoiLz48L3N2Zz4=);
    display: inline-block;
    color: red;
    width: 1rem;
    max-width: 1rem !important;
  }

  &.close::after {
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBkPSJNMjUuOSAzLjRDMTktMiA4LjktLjggMy40IDYuMVMtLjggMjMuMSA2LjEgMjguNmw2MDggNDgwYzYuOSA1LjUgMTcgNC4zIDIyLjUtMi42czQuMy0xNy0yLjYtMjIuNUwyNS45IDMuNHpNNTU5IDEzOC44YzIxLjktMjEuOSAyMS45LTU3LjMgMC03OS4yTDUxNi40IDE3Yy0yMS45LTIxLjktNTcuMy0yMS45LTc5LjIgMEwyOTcuNSAxNTYuN2wyNS4zIDIwTDM4Mi40IDExNyA0NTkgMTkzLjZsLTUwLjYgNTAuNiAyNS4zIDIwTDU1OSAxMzguOHpNMzE3LjIgMzM1LjNMMjQwIDQxMi42bDAtMTIuNmMwLTguOC03LjItMTYtMTYtMTZsLTMyIDAgMC0zMmMwLTguOC03LjItMTYtMTYtMTZsLTEyLjYgMCA2OC4yLTY4LjItMjUuMy0yMC04MS45IDgxLjljLTExLjQgMTEuNC0xOS43IDI1LjQtMjQuMiA0MC44bC0zNS42IDEyMWMtMS43IDUuNi0uMSAxMS43IDQgMTUuOHMxMC4yIDUuNyAxNS44IDRsMTIxLTM1LjZjMTUuNC00LjUgMjkuNC0xMi45IDQwLjgtMjQuMmw5Ni4yLTk2LjItMjUuMy0yMHpNNDkzLjggMzkuNmw0Mi42IDQyLjZjOS40IDkuNCA5LjQgMjQuNiAwIDMzLjlMNDgxLjYgMTcxIDQwNSA5NC40bDU0LjgtNTQuOGM5LjQtOS40IDI0LjYtOS40IDMzLjkgMHpNMTM1LjYgMzY4bDI0LjQgMCAwIDMyYzAgOC44IDcuMiAxNiAxNiAxNmwzMiAwIDAgMjQuNGMtMy43IDEuOS03LjUgMy41LTExLjYgNC43bC05Mi44IDI3LjMgMjcuMy05Mi44YzEuMi00IDIuNy03LjkgNC43LTExLjZ6Ii8+PC9zdmc+);
    width: 1.3rem;
    max-width: 1.3rem !important;
    top: -1px;
    position: relative;
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
  content: "settings update required";
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
</style>