<template>
  <div class="inner">
    <!-- Heading for screen readers -->
    <h2 class="sr-only">Rebate Listings</h2>

    <!-- Skip to results link (only in archive mode) -->
    <a v-if="mode === 'archive'" href="#rebatesResults" class="sr-only skip-to-results">Skip to results</a>

    <!-- Loading / Error -->
    <p v-if="isLoading" role="status" class="loader">Initializing rebates qualifier questionaire from settings...</p>
    <p v-else-if="loadError" role="alert">Failed to load rebates: {{ loadError }}</p>

    <template v-else>

      <p v-if="(!hasAllSelection || isDirty) && mode === 'single'" class='has-icon warning message tool-message'>
        You may be looking at default or incomplete information.
        <a v-if='!isDirty' @click="toggleCollapseView" @keydown.enter.space.prevent="toggleCollapseView" tabindex='0'>
          Please update your home's details.
        </a>
        <span v-if='isDirty'>
          The page URL does not match your settings. Please update and save your selections.
        </span>
      </p>

      <!-- Filter Controls -->
      <div id="rebatesFilterControls" class="filter-container"
           :class="[
            { 'filters-dirty': isDirty, 'labels-hidden': !labelsVisible },
            { 'collapsed': isCollapseView && mode === 'single' },
            { 'loading': isLoading }
          ]">

        <div v-if="mode === 'single'" class="selection-summary" aria-live="polite">

          <h2 class='settings-headline'>Your home's details</h2>
          <button class="rebate-collapse-setting"
              :class="isCollapseView ? 'collapsed' : ''"
              :aria-pressed="isCollapseView ? false : true"
              @click="toggleCollapseView">
              collapse
          </button>

          <div v-if="false && selectedBuildingGroupSlug !== 'murb' && murbTenure === 'rent'" class='message error-message'>
            <p><span>Rentals of your home type are not eligible</span></p>
            <p>Only rentals in multi-unit residential buildings are currently eligible.</p>
          </div>
          <div class='control-container'>
            <template v-for="field in fields" :key="field.key">
              <template v-if="field.condition === undefined || field.condition">
                <!-- If field has a value -->
                <template v-if="field.displayValue && editModeView">
                  <!-- Show button (unless its select is open) -->
                  <div class="control button-group" v-if="activeEdit !== field.key">
                    <label class='small'>{{ field.shortDesc }}</label>
                    <button class="rebate-setting" :disabled="field.disabled"
                      :class="{ 'is-external-dirty': isExternalDirty && lastChangedField === field.key }"
                      @click="openEdit(field.key)" :ref="el => (buttonRefs[field.key] = el)">
                      {{ field.displayValue }}
                    </button>
                  </div>
                  <!-- Show select if open -->
                  <div v-else-if="editable && activeEdit === field.key">
                    <figure class="control editable" :aria-label="`${field.shortDesc} setting`">
                      <button :disabled="!field.model.value"  type="button" class="close-btn" @click="activeEdit = ''"
                        aria-label="Close edit field"></button>
                      <label :for="`${field.key}Select`">{{ field.label }}</label>
                      <select :key="field.key + '-' + (fieldRenderKeys[field.key] ?? 0)" class="select"
                        :id="`${field.key}Select`" v-model="field.model.value" :disabled="field.disabled"  @change="handleSelectChange(field.key, $event.target.value)" @keydown="handleSelectKeydown($event, field.key, field.model.value)" :ref="el => (selectRefs[field.key] = el)">
                        <option disabled :selected="!field.model.value" data-default='Select an option' value="">Select
                          an option</option>

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
                      <figcaption v-if="field.key === 'heating' && field.disabled">
                        This heating type is preselected for this rebate.
                      </figcaption>
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

                <!-- If field is missing show select immediately -->
                <template v-else>
                  <figure class="control editable" :aria-label="`${field.shortDesc} setting`">
                    <button :disabled="!field.model.value" type="button" class="close-btn" @click="activeEdit = ''"
                      aria-label="Close edit field"></button>
                    <label :for="`${field.key}Select`">{{ field.label }}</label>
                    <select :key="field.key + '-' + (fieldRenderKeys[field.key] ?? 0)" class="select"
                      :id="`${field.key}Select`" v-model="field.model.value" :disabled="field.disabled"
                      @change="handleSelectChange(field.key, $event.target.value)"
                      @keydown="handleSelectKeydown($event, field.key, field.model.value)"
                      :ref="el => (selectRefs[field.key] = el)">
                      <option disabled :selected="!field.model.value" data-default='Select an option' value="">Select an
                        option</option>

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
            <div class="control instruction-group">
              <div>
                <label class='small sr-only' for="instructions">Settings instructions</label>
                <p name="instructions" class="small-text" style="text-align: left; line-height: 1.665;">
                  <a v-if="!editModeView" href="#edit" @click.prevent="toggleEditModeView">Updating home details</a><span
                    v-else>Updating your home's details</span> will refresh the page content. You may also <a href="#clear" :tabindex="isCollapseView ? '-1' : '0'"
                    @click.prevent="clearSettings">clear the settings</a> to start over. To change <strong>heating type</strong>, go back to the <a data-v-9aa24a6c="" href="/find-rebates/" tabindex="0">rebate finder questionnaire.</a>
                </p>
              </div>
              <button class="editBtn toggle-edit-mode readonly-toggle" :tabindex="isCollapseView ? '-1' : '0'"
              :class="isSavingEditMode ? 'saving' : editModeView ? 'show-edit-mode' : 'show-readonly-mode'"
              @click="toggleEditModeView" :aria-label="editModeView ? 'Exit edit mode' : 'Enter edit mode'"
              :title="editModeView ? 'Exit edit mode' : 'Enter edit mode'">
              <span>{{ isSavingEditMode ? 'Saving edit...' : editModeView ? 'Hide edit mode' : 'View edit mode' }}</span>
              </button>
              <button v-if='false' class='editBtn labels' :class="labelsVisible ? 'show-labels' : 'hide-labels'"
                @click="toggleLabels" :title="labelsVisible ? 'Hide settings labels' : 'Show settings labels'">Show or hide settings labels</button>
            </div>
          </div>

        </div>

        <template v-if="mode === 'archive'">

          <div v-if="false && selectedBuildingGroupSlug === 'ground-oriented-dwellings' && murbTenure === 'rent'"
            class='message error-message'>
            <p><span>Rentals of your home type are not eligible</span></p>
            <p>Only rentals in multi-unit residential buildings are currently eligible.</p>
          </div>

          <div aria-live="polite" class="sr-only" role="status">
            {{ ariaStatusMessage }}
          </div>

          <div class='control-container stacked'>
            <template v-for="field in fields" :key="field.key">
              <template v-if="field.condition === undefined || field.condition">

                <div class='question-container'>
                  <div class='num-label'></div>
                  <figure class="control" :aria-label="`${field.shortDesc} setting`">
                    <label :for="`${field.key}Select`">{{ field.label }} <a v-if="field.definition"
                        :href='field.glossary_link'>{{ field.definition }}</a></label>

                    <!-- Location input -->
                    <template v-if="field.key === 'location'">
                      <input :list="`${field.key}List`" :id="`${field.key}Select`" type="text" autocomplete="off"
                        class="location-input" :class="{
                          'is-empty': !locationInputValue,
                          'is-valid': !isLocationFocused && isLocationValid,
                          'is-error': !isLocationFocused  && !isLocationValid && locationInputValue,
                          'is-invalid': isLocationFocused && !isLocationValid && locationInputValue 
                        }" :aria-invalid="locationInputValue && !isLocationValid ? 'true' : 'false'"
                        :aria-describedby="fieldErrors[field.key] ? `${field.key}Error` : null"
                        placeholder="Your community..."
                        v-model="locationInputProxy"
                        :disabled="field.disabled"
                        @focus="handleFocus"
                        @blur="handleLocationInputCommit('blur')"
                        @change="handleLocationInputCommit('change')"
                        @keydown.enter.prevent="handleLocationInputCommit('enter')" />
                      <datalist :id="`${field.key}List`">
                        <option v-for="opt in field.options" :key="opt.slug" :value="opt.name"></option>
                      </datalist>
                      <p v-if="field.error_desc && fieldErrors[field.key]" class="message error-message" v-html="field.error_desc" aria-live='polite'></p>

                      <figcaption v-if="field.filter_desc && !field.disabled">
                        {{ field.filter_desc }}
                      </figcaption>
                      <figcaption v-if="field.disabled_desc && field.disabled">
                        {{ field.disabled_desc }}
                      </figcaption>
                    </template>

                    <!-- All other selects -->
                    <template v-else>

                      <select :key="field.key + '-' + (fieldRenderKeys[field.key] ?? 0)" class="select"
                        :class="fieldErrors[field.key] ? 'error' : ''" :id="`${field.key}Select`"
                        v-model="field.model.value" :disabled="field.disabled"
                        @change="handleSelectChange(field.key, $event.target.value)"
                        @keydown="handleSelectKeydown($event, field.key, field.model.value)"
                        :ref="el => (selectRefs[field.key] = el)">
                        <option disabled :selected="!field.model.value" data-default='Select an option' value="">Select
                          an
                          option</option>

                        <!-- Grouped (building) -->
                        <template v-if="field.isGrouped">
                          <template v-for="group in field.groups" :key="group.slug">
                            <optgroup
                              v-if="group.slug !== 'other'"
                              :label="group.name === 'MURB' ? 'Multi-unit residential buildings' : group.name">
                              <option v-for="child in group.children" :key="child.slug" :value="child.slug">
                                {{ child.name }}
                              </option>
                            </optgroup>

                            <template v-else>
                              <option
                                :key="group.slug"
                                :value="group.slug">
                                {{ group.name }}
                              </option>
                            </template>
                          </template>
                        </template>

                        <!-- Flat (others) -->
                        <template v-else>
                          <option v-for="opt in field.options" :key="opt.slug" :value="opt.slug">
                            {{ opt.name }}
                          </option>
                        </template>
                      </select>

                      <figcaption v-if="field.filter_desc && !field.disabled">{{ field.filter_desc }}</figcaption>
                      <figcaption v-if="field.disabled_desc && field.disabled">{{ field.disabled_desc }}</figcaption>
                      <p v-if="field.error_desc && fieldErrors[field.key]" class="message error-message" aria-live='polite' v-html='field.error_desc'></p>

                      <template v-if="field.key === 'building'">
                        <div class='eligible-homes-insertion'></div>
                      </template>

                    </template>
                  </figure>
                </div>
              </template>
            </template>
          </div>
          <div v-if="hasAnySelection" class='clear-msg'><a href="#clear" @click.prevent="clearSettings">Clear
              settings</a> to
            start over</div>
          <div v-else class='clear-msg'>Please answer the form questions to see possible rebates.</div>
        </template>
      </div>

      <!-- Results -->
      <template v-if="mode === 'archive'">
        <!-- Show results -->
        <section v-if="hasAllSelection && filteredResults.length" id="rebatesResults" aria-label="Rebate results">
          <div class="results-message">
            <div>
              <h2>Congratulations!</h2>
              <p>You might be eligible for these rebate offers:</p>
            </div>
            <div id="grid-or-list-container">
              <input id="grid-or-list" type="checkbox" v-model="displayGridOrList" class="sr-only"
                :aria-label="displayGridOrList ? 'Switch to list view' : 'Switch to grid view'"
                @change="onViewToggleChange" @keydown.enter.prevent="toggleViewWithKeyboard" />
              <label for="grid-or-list" class="toggle-label">
                <span class="sr-only">
                  {{ displayGridOrList ? 'Switch to list view' : 'Switch to grid view' }}
                </span>
              </label>
            </div>
          </div>
          <div class="results" :class="displayGridOrList ? 'grid-view' : 'list-view'">
            <template v-for="(item, index) in filteredResults" :key="item.id">
              <article class="rebate-card" :class="item.rebate_type_class">
                <a :href="withQueryString(item.post_url ?? item.url ?? '#')" style="position: relative;"
                  :aria-label="item.rebate_type_headline_card">
                  <div class='card-meta'>
                    <div v-if="item.rebate_value_card" class="rebate-value" aria-hidden="true">
                      {{ item.rebate_value_card }}
                    </div>

                    <figure v-if="item.rebate_featured_image" class="wp-block-image size-full">
                      <img decoding="async" width="1024" height="515" data-print-width="25"
                        :src="item.rebate_featured_image" alt="" title="" />
                    </figure>

                    <div v-if="item.rebate_description_card" class="rebate-icons" aria-label="Rebate available">
                      <div v-for="(ht, i) in item.heating_types" :key="ht.id || i" :class="['rebate-icon', ht.slug]"
                        :title="`For homes fueled by ${ht.name}`" :aria-label="`For homes fueled by ${ht.name}`"></div>
                    </div>
                  </div>

                  <div class='rebate-details-container'>
                    <header>
                      <h3 class="rebate-title">
                        <div>{{ item.rebate_type_headline_card }}</div>
                        <small>{{ item.title }}</small>
                      </h3>
                    </header>

                    <div class="rebate-details">
                      <div v-if="item.rebate_value_card" class="sr-only">
                        <div>{{ item.rebate_value_card }}</div>
                      </div>

                      <div v-if="item.rebate_description_card" class="rebate-description">
                        <div>{{ item.rebate_description_card }}</div>
                      </div>
                    </div>
                  </div>
                </a>
              </article>

              <!-- Info card appears AFTER the first heat pump rebate -->
              <div v-if="false && showHeatPumpInfo &&
                (item.rebate_type_class === 'heat-pump-rebates' ||
                  item.rebate_type_class === 'heat-pump-water-heater-rebates') &&
                index === firstHeatPumpIndex" class="info-card">
                <div class="info-card-content">
                  <h3>What is a heat pump?</h3>
                  <p>A heat pump is an efficient heating and cooling system that uses electricity to move heat from one
                    place to another. In the winter, a heat pump transfers heat from the outside air to the indoors
                    through a cycle of compression and expansion of a refrigerant. In the summer, it operates in reverse
                    and heat from inside your home to the outdoors, like an air conditioner.</p>
                </div>
                <figure class="wp-block-image size-full">
                  <img decoding="async" width="1889" height="1259" data-print-width="25"
                    src="https://www.betterhomesbc.ca/app/uploads/sites/956/2025/10/heat-pump-info-card.jpg" alt=""
                    title="" />
                </figure>
              </div>
            </template>
          </div>
          <p v-if="!filteredResults.length" class="no-results">
            No rebates match your current selections ({{ espTier }}).
          </p>
        </section>

        <!-- No results -->
        <section v-if="hasAllSelection && !filteredResults.length" class="not-eligible">
          <div class='not-eligible-insertion'></div>
        </section>

        <!-- Complete for for results -->
        <p v-if="!hasAllSelection" class="no-results loader">Please complete the questionnaire form to see your rebate options.</p>
      </template>

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
// See vNextRebateVueApp.docs.js for full JSDoc reference.
import { computed, ref, nextTick, onMounted, watch } from 'vue'

/** Public domain fallback */
const publicDomain = ref('https://www.betterhomesbc.ca')

/** API endpoint */
const rebatesAPI = `${window.site?.domain ? window.site.domain : publicDomain.value}/wp-json/custom/v2/rebates`

const debug = false

// Local state for fetched API payload.
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

/**
 * Set the state of the results. Allow for retrieval from localStorage.
 * true = grid view, false = list view.
 */

const displayGridOrList = ref(true)
const STORAGE_KEY = 'displayGridOrList'
const PREFERRED_SETTINGS_KEY = 'preferredSettings'
const REBATE_TOOL_SETTINGS_KEY = 'rebateToolSettings'

function onViewToggleChange() {
  localStorage.setItem(STORAGE_KEY, String(displayGridOrList.value))
}

function toggleViewWithKeyboard() {
  displayGridOrList.value = !displayGridOrList.value
  localStorage.setItem(STORAGE_KEY, String(displayGridOrList.value))
}

function readPreferredSettings() {
  try {
    const raw = localStorage.getItem(PREFERRED_SETTINGS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch (e) {
    return {}
  }
}

function writePreferredSettings(partial) {
  try {
    const prev = readPreferredSettings()
    const next = {
      ...prev,
      ...partial,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem(PREFERRED_SETTINGS_KEY, JSON.stringify(next))
  } catch (e) {
    // no-op
  }
}

function readRebateToolSettings() {
  try {
    const raw = localStorage.getItem(REBATE_TOOL_SETTINGS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (e) {
    return null
  }
}

/**
 * Hydrate preferredSettings from:
 * - current reactive state (selectedLocationSlug / selectedLocationName / espTier)
 * - and/or stored rebateToolSettings (location can be slug or name)
 *
 * This is safe to call repeatedly; it only writes when it can resolve a valid value.
 */
function hydratePreferredSettingsFromRebateToolSettings() {
  const saved = readRebateToolSettings()
  const preferred = readPreferredSettings()

  // --- LOCATION ---
  // Best source: current state if valid
  let locMatch =
    (selectedLocationSlug.value && locationOptions.value.find(l => l.slug === selectedLocationSlug.value)) ||
    (selectedLocationName.value && locationOptions.value.find(l => l.name === selectedLocationName.value)) ||
    null

  // Fallback: rebateToolSettings (can be slug OR name in your implementation)
  if (!locMatch && saved?.location) {
    locMatch =
      locationOptions.value.find(l => l.slug === saved.location) ||
      locationOptions.value.find(l => l.name === saved.location) ||
      null
  }

  // Only write location if we resolved a real option
  // (and optionally avoid rewriting if it’s unchanged)
  if (locMatch) {
    const nextSlug = locMatch.slug
    const currentSlug = preferred?.location?.slug || ''
    if (nextSlug && nextSlug !== currentSlug) {
      writePreferredSettings({
        location: {
          slug: locMatch.slug,
          name: locMatch.name,
          region: locMatch.children?.[0]?.name || '',
          region_slug: locMatch.children?.[0]?.slug || ''
        }
      })
    }
  }

  // --- ESP TIER ---
  // If espTier is currently valid, store it.
  // This will become valid after initFromLocalStorage/query string restores enough fields.
  const tier = espTier.value
  if (tier) {
    if (preferred?.esp_tier !== tier) {
      writePreferredSettings({ esp_tier: tier })
    }
  }
}



/**
 * Debounce a function so it runs only after a specified delay.
 */
function debounce(fn, delay = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const debouncedUpdateRebateDetails = debounce(updateRebateDetails, 500)
const isAjaxLoading = ref(false)

/**
 * Fetch and replace the rebate details section asynchronously.
 */
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
        if (oldScript.src) {
          newScript.src = oldScript.src
        } else {
          newScript.textContent = oldScript.textContent
        }
        document.body.appendChild(newScript)
        document.body.removeChild(newScript)
      })

      window.history.replaceState(null, '', assembledUrl.value)

      // After DOM swap, clear external dirty + selection markers.
      isExternalDirty.value = false
      isSavingEditMode.value = false
      lastChangedField.value = ''
      rerenderScrollMenu()
      nextTick(() => bcgovBlockThemePluginTablesPattern())
      nextTick(() => bcgovBlockThemePluginDefnitions())
      nextTick(() => betterhomesRebatesArchiveLoader())
      nextTick(() => betterhomesRebatesExternalLinkCheck())
      nextTick(() => bcgovBlockThemePluginAccessibility())
    }
  } catch (err) {
    console.error('Failed to update rebate details via AJAX:', err)
  } finally {
    isAjaxLoading.value = false
  }
}

/**
 * Reset the external links icons.
 */
const betterhomesRebatesExternalLinkCheck = () => {
    /**
     * Set up external icons for links.
     */

    if ( '1' === window.site.externalLinkIcons ) {
        const links = document.querySelectorAll( '.post-content a' );

        if ( links ) {
            links.forEach( ( link ) => {
                const href = link.getAttribute( 'href' );

                if ( null !== href ) {
                    // Check if the link is an anchor link or a relative link
                    if (
                        href.startsWith( '#' ) ||
                        href.startsWith( '/' ) ||
                        href.startsWith( './' ) ||
                        href.startsWith( '../' ) ||
                        href.startsWith( '?' )
                    ) {
                        return;
                    }

                    // Get the current domain
                    const currentDomain = window.location.hostname;

                    // Extract the domain from the link's href
                    const linkDomain = href.match(
                        /^(?:https?:)?(?:\/\/)?([^\/\?]+)/i
                    )[ 1 ];

                    // Check if the domains don't match
                    if ( linkDomain !== currentDomain ) {
                        link.classList.add( 'external' );

                        const svg = document.createElementNS(
                            'http://www.w3.org/2000/svg',
                            'svg'
                        );
                        svg.setAttribute( 'class', 'external-link-icon' );
                        svg.setAttribute( 'version', '1.1' );
                        svg.setAttribute( 'id', 'Layer_1' );
                        svg.setAttribute(
                            'xmlns',
                            'http://www.w3.org/2000/svg'
                        );
                        svg.setAttribute(
                            'xmlns:xlink',
                            'http://www.w3.org/1999/xlink'
                        );
                        svg.setAttribute( 'x', '0px' );
                        svg.setAttribute( 'y', '0px' );
                        svg.setAttribute( 'viewBox', '0 0 18 18' );
                        svg.setAttribute(
                            'style',
                            'enable-background:new 0 0 18 18;'
                        );
                        svg.setAttribute( 'xml:space', 'preserve' );
                        svg.innerHTML =
                            '<path class="st0" d="M9.7,3.9c0-0.1-0.1-0.3-0.2-0.4C9.4,3.4,9.3,3.4,9.2,3.4H1.7c-0.4,0-0.9,0.2-1.2,0.5C0.2,4.2,0,4.6,0,5.1v11.2c0,0.4,0.2,0.9,0.5,1.2C0.8,17.8,1.2,18,1.7,18h11.2c0.4,0,0.9-0.2,1.2-0.5c0.3-0.3,0.5-0.7,0.5-1.2V8.8c0-0.1-0.1-0.3-0.2-0.4 c-0.1-0.1-0.2-0.2-0.4-0.2c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4v7.5c0,0.1-0.1,0.3-0.2,0.4c-0.1,0.1-0.2,0.2-0.4,0.2 H1.7c-0.1,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.2-0.2-0.4V5.1c0-0.1,0.1-0.3,0.2-0.4c0.1-0.1,0.2-0.2,0.4-0.2h7.5 c0.1,0,0.3-0.1,0.4-0.2C9.7,4.2,9.7,4.1,9.7,3.9z"/><path class="st0" d="M18,0.6c0-0.1-0.1-0.3-0.2-0.4C17.7,0.1,17.6,0,17.4,0h-5.6c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4 s0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2h4.3l-9.2,9.2c-0.1,0.1-0.1,0.1-0.1,0.2c0,0.1,0,0.1,0,0.2s0,0.1,0,0.2c0,0.1,0.1,0.1,0.1,0.2C7,11.1,7,11.2,7.1,11.2c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0s0.1-0.1,0.2-0.1l9.2-9.2v4.3c0,0.1,0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2c0.1,0,0.3-0.1,0.4-0.2C17.9,6.5,18,6.3,18,6.2V0.6z"/>';

                        const computedStyle = window.getComputedStyle( link );
                        const fontSize = computedStyle.fontSize;

                        // Set the font size for the SVG
                        svg.style.width = fontSize;
                        svg.style.height = fontSize;

                        link.appendChild( svg );
                    }
                }
            } );
        }
    }
};

/**
 * Rebuild the scroll menu (#incentive-side-nav) from H2 headings inside #incentive-details-container.
 */
function rerenderScrollMenu() {
  const detailsContainer = document.querySelector('#incentive-details-container')
  const sideNav = document.querySelector('#incentive-side-nav')
  if (!detailsContainer || !sideNav) return

  // Clear the existing content of #incentive-side-nav.
  sideNav.innerHTML = ''

  // Find all H2 elements inside the #incentive-details-container.
  const headings = detailsContainer.querySelectorAll('h2[id]')

  // Create a new list for navigation.
  const navListContainer = document.createElement('nav')
  navListContainer.classList.add(
    'side-nav',
    'bb-nav',
    'wp-block-navigation',
    'is-vertical',
    'wp-container-core-navigation-layout-2'
  )

  const navList = document.createElement('ul')
  navList.classList.add(
    'side-nav',
    'bb-nav',
    'wp-block-navigation',
    'is-vertical',
    'wp-block-navigation__container'
  )

  // Loop through the H2 elements to create links.
  headings.forEach(heading => {
    const id = heading.id
    const text = heading.textContent.trim()

    // Create a list item.
    const listItem = document.createElement('li')
    listItem.classList.add('wp-block-navigation-item', 'wp-block-navigation-link')

    // Create a link element.
    const link = document.createElement('a')
    link.href = `#${id}`
    link.textContent = text
    link.classList.add('wp-block-navigation-item__content')

    // Append the link to the list item.
    listItem.appendChild(link)

    // Append the list item to the navigation list.
    navList.appendChild(listItem)
  })

  // Append the navigation list to the side navigation.
  navListContainer.appendChild(navList)
  sideNav.appendChild(navListContainer)
  sideNav.classList.remove('admin-instructions')
}

// Editable state 
const editable = ref(false)
const activeEdit = ref('')
const labelsVisible = ref(true)
const showReadOnlyFields = ref(true)
const showEditModeUI = ref(false)
const editModeView = ref(false)
const isCollapseView = ref(true)
const isSavingEditMode = ref(false)
const hasError = ref(false)
const ariaStatusMessage = ref('')
const pageHeatingType = ref('')
const pageWaterHeatingType = ref('')

// Focus map for selects 
const selectRefs = ref({})
const buttonRefs = ref({})
const lastChangedField = ref('')

// Force full re-render when the options list changes.
const fieldRenderKeys = ref({
  homeValue: 0,
  income: 0
})

const fieldErrors = computed(() => {
  return {
    location: !isLocationFocused.value && !isLocationValid.value && !!locationInputValue.value,
    // murbTenure:
    //   false && 
    //   selectedBuildingGroupSlug.value === 'ground-oriented-dwellings' &&
    //   murbTenure.value === 'rent',
    building: selectedBuildingTypeSlug.value === 'other',
    heating: selectedHeatingSlug.value === 'other',
    water: selectedWaterHeatingSlug.value === 'other',
    utility: selectedUtilitySlug.value === 'other'
    // gas: selectedGasSlug.value === 'other'
  }
})

const hasAnyError = computed(() =>
  Object.values(fieldErrors.value).some(Boolean)
)

/**
 * Toggle visibility of field labels.
 */
function toggleLabels() {
  labelsVisible.value = !labelsVisible.value
  localStorage.setItem(
    'rebateLabelsVisible',
    JSON.stringify(labelsVisible.value)
  )
}

/**
 * Open a specific field for editing.
 */
function openEdit(field) {
  editable.value = true
  activeEdit.value = field
}

/**
 * Toggle the edit mode view on/off.
 */
function toggleEditModeView() {
  editModeView.value = !editModeView.value
  localStorage.setItem('rebateEditModeView', JSON.stringify(editModeView.value))
}

/**
 * Toggle the collapse mode view on/off.
 */
function toggleCollapseView() {
  isCollapseView.value = !isCollapseView.value
  localStorage.setItem('rebateCollapseView', JSON.stringify(isCollapseView.value))
}

function handleFocus() {
  isLocationFocused.value = true
  if (isMobile.value) {
    setTimeout(() => {
      const inputEl = document.querySelector('input.location-input')
      inputEl?.focus()
    }, 300)
  }
}

/**
 * Commit location input on change or blur.
 */
const handleLocationInputCommit = debounce(async (trigger = 'change') => {
  await new Promise(resolve => setTimeout(resolve, 150))

  let raw

  // On mobile blur, re-read the DOM value to capture datalist suggestion.
  if (isMobile.value && trigger === 'blur') {
    const inputEl = document.querySelector('input.location-input')
    if (inputEl) {
      raw = inputEl.value
      locationInputDisplay.value = raw
    } else {
      raw = locationInputDisplay.value
    }
  } else {
    raw = isMobile.value ? locationInputDisplay.value : locationInputValue.value
  }

  const trimmed = raw.trim().toLowerCase()

  // 1. Try exact match first.
  let match = locationOptions.value.find(
    opt => opt.name.toLowerCase() === trimmed
  )

  // 2. Try best fuzzy match on blur.
  if (!match && trigger === 'blur' && raw !== '') {
    const possible = locationOptions.value.filter(opt =>
      opt.name.toLowerCase().includes(trimmed)
    )

    if (possible.length > 0) {
      possible.sort((a, b) => {
        const aIndex = a.name.toLowerCase().indexOf(trimmed)
        const bIndex = b.name.toLowerCase().indexOf(trimmed)
        const aLengthDiff = Math.abs(a.name.length - raw.length)
        const bLengthDiff = Math.abs(b.name.length - raw.length)

        if (aIndex !== bIndex) return aIndex - bIndex
        return aLengthDiff - bLengthDiff
      })

      match = possible[0]
    }
  }

  // 3. Apply the match if found.
  if (match) {
    selectedLocationSlug.value = match.slug
    locationInputValue.value = match.name
    if (isMobile.value) {
      locationInputDisplay.value = match.name
    }
    lastChangedField.value = 'location'
    isExternalDirty.value = true
    updateAddressBar()
    debouncedUpdateRebateDetails()
    ariaStatusMessage.value = `${match.name} selected. Moving to next field.`

    // Save preferredSettings whenever a valid location is chosen by the user
    writePreferredSettings({
      location: {
        slug: match.slug,
        name: match.name,
        region: match.children?.[0]?.name || '',
        region_slug: match.children?.[0]?.slug || ''
      }
    })

    // NEW: mirror select behaviour in archive mode
    await runArchiveFlowForField('location')
  } else {
    selectedLocationSlug.value = ''
  }
  isLocationFocused.value = false
}, 50)

const isLocationFocused = ref(false)

const isLocationValid = computed(() =>
  locationOptions.value.some(
    opt =>
      opt.name.toLowerCase() === locationInputValue.value.trim().toLowerCase()
  )
)

/**
 * Handle when a select input changes.
 * - Closes edit bubble (single mode)
 * - Marks state dirty
 * - In archive mode:
 *   • if there are errors – go to first invalid question
 *   • else if all valid   – go to results
 *   • else                – move focus to next question, keeping previous visible
 */
async function handleSelectChange(fieldKey, newValue) {
  if (newValue === undefined || newValue === null) return

  lastChangedField.value = fieldKey
  isSavingEditMode.value = true

  // Close edit "bubble" in single-mode summary UI
  await nextTick()
  activeEdit.value = ''
  await nextTick()

  // Mark Vue + external blocks as dirty
  isExternalDirty.value = true

  if (mode.value !== 'archive') {
    isSavingEditMode.value = false
    return
  }

  // Reuse the shared archive behaviour
  await runArchiveFlowForField(fieldKey)

  isSavingEditMode.value = false
}


/**
 * After a field is successfully committed in archive mode, decide
 * where to scroll next or whether to go to results.
 */
async function runArchiveFlowForField(fieldKey) {
  if (mode.value !== 'archive') return

  // Wait for all reactive updates to propagate.
  await nextTick()
  await nextTick()

  const allFields = fields.value

  const isAnsweredAndValid = field => {
    const value = field.model?.value ?? null
    const hasError = field.isInvalid?.() || false
    return !!value && !hasError
  }

  const anyError      = hasAnyError.value
  const currentIndex  = allFields.findIndex(f => f.key === fieldKey)
  const firstInvalid  = allFields.find(field => field.isInvalid?.())
  const unansweredAbove =
    currentIndex > 0
      ? allFields
          .slice(0, currentIndex)
          .find(field => !isAnsweredAndValid(field))
      : null

  const unansweredBelow =
    currentIndex !== -1 && currentIndex < allFields.length - 1
      ? allFields
          .slice(currentIndex + 1)
          .find(field => !isAnsweredAndValid(field))
      : null

  const allValid = allFields.every(field => isAnsweredAndValid(field))

  // 1) If any error exists, go to the first invalid
  if (anyError && firstInvalid) {
    await scrollToQuestion(firstInvalid, {
      keepPreviousVisible: false
    })

    // Optionally ensure the error message itself is announced
    await nextTick()
    const errorEl = document.querySelector('.message.error-message')
    if (errorEl) {
      errorEl.setAttribute('tabindex', '-1')
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      errorEl.focus({ preventScroll: true })
    }
    return
  }

  // 2) If there is an unanswered field above, go back up to that
  if (unansweredAbove) {
    await scrollToQuestion(unansweredAbove, {
      keepPreviousVisible: false
    })
    return
  }

  // 3) Otherwise, if there is an unanswered field below, move down, keeping the previous question visible on screen
  if (unansweredBelow) {
    await scrollToQuestion(unansweredBelow, {
      keepPreviousVisible: true
    })
    return
  }

  // 4) If everything is answered and valid, go to results
  if (allValid) {
    const resultsSection = document.getElementById('rebatesResults')
    if (resultsSection) {
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        resultsSection.setAttribute('tabindex', '-1')
        resultsSection.focus({ preventScroll: true })
      }, 100)
    }
  }
}


/**
 * Scroll to a specific question and focus its control.
 *
 * keepPreviousVisible: when true and we’re moving forward, we offset so
 * the previous question remains visible above.
 */
async function scrollToQuestion(targetField, { keepPreviousVisible = false } = {}) {
  await nextTick()
  await new Promise(r => requestAnimationFrame(r))

  const allFields = fields.value
  const idx = allFields.findIndex(f => f.key === targetField.key)

  const controlEl =
    document.getElementById(`${targetField.key}Select`) ||
    document.getElementById(`${targetField.key}Input`)

  const container = controlEl?.closest('.question-container')
  if (!container) {
    console.warn(`Could not find question container for field: ${targetField.key}`)
    return
  }

  const targetRect = container.getBoundingClientRect()
  let offsetTop

  if (keepPreviousVisible && idx > 0) {
    // Use the height of the previous question to keep it on screen
    const prevField = allFields[idx - 1]
    const prevEl =
      document.getElementById(`${prevField.key}Select`)?.closest('.question-container') ||
      document.getElementById(`${prevField.key}Input`)?.closest('.question-container')

    let visibleOffset = 150
    if (prevEl) {
      visibleOffset = prevEl.offsetHeight + 150
    }

    offsetTop = window.scrollY + targetRect.top - visibleOffset
  } else {
    // Simple "put it near the top"
    offsetTop = window.scrollY + targetRect.top - 150
  }

  window.scrollTo({
    top: Math.max(0, offsetTop),
    behavior: 'smooth'
  })

  // Focus the control in the target question
  if (controlEl && typeof controlEl.focus === 'function') {
    setTimeout(() => {
      controlEl.focus({ preventScroll: true })
    }, 200)
  }
}

/**
 * Handle keyboard interaction for select elements.
 */
function handleSelectKeydown(event, fieldKey, currentValue) {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (mode.value === 'archive') {
      runArchiveFlowForField(fieldKey)
    }

    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    activeEdit.value = ''
    return
  }

  if (event.key === 'Tab') {
    const direction = event.shiftKey ? 'up' : 'down'
    nextTick(() => scrollToNextVisibleField(fieldKey, direction))
  }
}

/**
 * Scroll to next visible field (direction-aware).
 */
async function scrollToNextVisibleField(currentKey, direction = 'down') {
  await nextTick()
  const all = fields.value
  const idx = all.findIndex(f => f.key === currentKey)
  if (idx === -1) return

  const nextField =
    direction === 'up'
      ? all
        .slice(0, idx)
        .reverse()
        .find(f => f)
      : all.slice(idx + 1).find(f => f)

  if (!nextField) return

  const nextEl =
    document.getElementById(`${nextField.key}Select`) ||
    document.getElementById(`${nextField.key}Input`)

  if (nextEl) {
    const rect = nextEl.getBoundingClientRect()
    const offsetTop = window.scrollY + rect.top - 150 // adjust padding.
    window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' })
  }
}

/**
 * Auto-focus when activeEdit changes.
 */
watch(activeEdit, async newKey => {
  if (!newKey) return
  await nextTick()
  const el = selectRefs.value[newKey]
  if (el) el.focus()
})

/**
 * Clear all user selections, reset URL, and reopen the first missing field.
 */
function clearSettings(event) {
  event?.preventDefault?.()

  // Determine whether heating is locked
  const isLockedHeating =
    mode.value === 'single' && !!pageHeatingType.value

   const isLockedWaterHeating =
    mode.value === 'single' && !!pageWaterHeatingType.value

  selectedBuildingTypeSlug.value = ''
  murbTenure.value = ''
  selectedHomeValueSlug.value = ''
  selectedPersonsSlug.value = ''
  selectedIncomeRangeSlug.value = ''
  selectedLocationSlug.value = ''

  // Only clear heating type if it's not locked (archive mode or no SSR value)
  if (!isLockedHeating) {
    selectedHeatingSlug.value = ''
  }
  if (!isLockedWaterHeating) {
    selectedWaterHeatingSlug.value = ''
  }

  selectedUtilitySlug.value = ''
  selectedGasSlug.value = ''

  const url = window.location.origin + window.location.pathname
  window.history.replaceState(null, '', url)

  localStorage.removeItem('rebateToolSettings')
  editable.value = true

  const firstMissing = fields.value.find(f => !f.displayValue)
  activeEdit.value = firstMissing ? firstMissing.key : ''

  localStorage.removeItem('rebateEditableState')
}


const sortOtherLast = (items = []) => {
  if (!Array.isArray(items)) return items

  const rest   = items.filter(i => i?.slug !== 'other')
  const others = items.filter(i => i?.slug === 'other')

  return [...rest, ...others]
}


/**
 * Unified fields config.
 */
const fields = computed(() => [
  {
    key: 'location',
    shortDesc: 'Home location',
    label: 'What community do you live in or are closest to?',
    model: selectedLocationSlug,
    options: locationOptions.value,
    displayValue: selectedLocationName.value
      ? `${selectedLocationName.value} (${selectedRegionName.value})`
      : '',
    missingMessage: 'Missing location details',
    isInvalid: () => !selectedLocationSlug.value,
    filter_desc: 'Start typing to narrow down your choice of options. Select the icon to see available choices.',
    error_desc: 'Please choose a community from the list of supported locations.'
  },
  {
    key: 'murbTenure',
    shortDesc: 'Rent or own',
    label: 'Do you rent or own your home?',
    model: murbTenure,
    options: [
      { slug: 'own', name: 'Own' },
      { slug: 'rent', name: 'Rent' }
    ],
    displayValue: murbTenureLabel.value,
    missingMessage: 'Missing ownership status'
    // description:
    // 'Only rentals in multi-unit residential buildings are currently eligible.',
    // error_desc:
    // 'Rentals of your home type are not eligible. Only rentals in multi-unit residential buildings are currently eligible.',
    // isInvalid: () =>
    // selectedBuildingGroupSlug.value === 'ground-oriented-dwellings' &&
    // murbTenure.value === 'rent'
  },
  {
    key: 'building',
    shortDesc: 'Type of home',
    label: 'What kind of home do you live in?',
    model: selectedBuildingTypeSlug,
    groups: buildingTypeGroups.value,
    isGrouped: true,
    displayValue: selectedBuildingTypeName.value,
    missingMessage: 'Missing home type',
    description:
      'Changing between Ground Oriented / MURB types will require you to update the assessed home value information.',
    filter_desc:
      'Each unit must have its own electricity meter and the utility account must be in the name of a resident in the household that is applying to the rebate.',
    error_desc:
      'Only the listed home types are currently eligible for Better Homes rebates. Contact an Energy Coach to find out if your home type fits into one of these categories.',
    isInvalid: () => selectedBuildingTypeSlug.value === 'other'
  },
  {
    key: 'homeValue',
    shortDesc: 'Assessed home value',
    label: 'What is the current assessed value of your property?',
    model: selectedHomeValueSlug,
    options: homeValueOptions.value,
    displayValue: selectedHomeValueName.value,
    missingMessage: 'Missing home value',
    disabled: !selectedBuildingGroupSlug.value || selectedBuildingTypeSlug.value === 'other',
    ready: homeValueOptions.value.length > 0,
    description:
      'The amount options shown change based on the set type of home.',
    disabled_desc:
      'Please answer the "type of home you live in" question to enable this selection.',
    definition: 'How to find the assessed value of your home',
    glossary_link: '/definitions/assessed-home-value/',
    isInvalid: () =>
      !selectedHomeValueSlug.value && !!selectedBuildingGroupSlug.value || selectedBuildingTypeSlug.value === 'other'
  },
  {
    key: 'persons',
    shortDesc: 'People in household',
    label:
      'How many people live in your home (including adults and children)?',
    model: selectedPersonsSlug,
    options: personCountOptions.value,
    displayValue: selectedPersonsCount.value,
    missingMessage: 'Missing household number',
    description:
      'Changing this field will require you to update the pre-tax income range information as well.',
    isInvalid: () => !selectedPersonsSlug.value
  },
  {
    key: 'income',
    shortDesc: 'Household income',
    label:
      'What is the combined pre-tax income of all adults in your household (excluding dependants)?',
    model: selectedIncomeRangeSlug,
    options: incomeRangeOptions.value,
    displayValue: selectedIncomeRangeName.value,
    missingMessage: 'Missing household income',
    disabled: !selectedPersonsSlug.value,
    ready: incomeRangeOptions.value.length > 0,
    description:
      'The amount options shown change based on the set number of people in the household.',
    disabled_desc:
      'Please answer the "number of people in your home" question to enable this selection.',
    definition: 'Why we ask for annual household income',
    glossary_link: '/definitions/household-income/',
    isInvalid: () => !!selectedPersonsSlug.value && !selectedIncomeRangeSlug.value
  },
  {
    key: 'heating',
    shortDesc: 'Heating type',
    label: 'How do you heat the rooms in your home?',
    disabled: mode.value === 'single' && !!pageHeatingType.value,
    description:
      'If you have multiple heat sources, choose the option that applies to most of your home. If your home is heated with both a wood stove and another source, choose the other source as your primary heating type.',
    model: selectedHeatingSlug,
    options: heatingOptions.value,
    displayValue: selectedHeatingName.value,
    missingMessage: 'Missing room heating details',
    error_desc:
      'Only the listed heating types are currently eligible for Better Homes rebates. Contact an Energy Coach to find out if your heating type fits into one of these categories.',
    isInvalid: () => !selectedHeatingSlug.value || selectedHeatingSlug.value === 'other',
  },
  {
    key: 'water',
    shortDesc: 'Hot water heating',
    label: 'How do you heat your water?',
    disabled: mode.value === 'single' && !!pageWaterHeatingType.value,
    description:
      'If you have more than one system, choose the one that heats most of your water.',
    model: selectedWaterHeatingSlug,
    options: waterHeatingOptions.value,
    displayValue: selectedWaterHeatingName.value,
    missingMessage: 'Missing water heating details',
    error_desc:
      'Only the listed heating types are eligible for Better Homes <strong>heat pump water heater</strong> rebates.  Contact an Energy Coach to find out if your heating type fits into one of these categories. ',
    isInvalid: () => !selectedWaterHeatingSlug.value || selectedWaterHeatingSlug.value === 'other'
  },
  {
    key: 'utility',
    shortDesc: 'Electric utility company',
    label: 'Who is your electricity provider?',
    model: selectedUtilitySlug,
    options: utilityOptions.value,
    displayValue: selectedUtilityName.value,
    missingMessage: 'Missing service details',
    error_desc:
      'Your electricity must be from one of the listed providers. Contact an Energy Coach if you have questions or need help figuring out who your provider is. ',
    isInvalid: () => !selectedUtilitySlug.value || selectedUtilitySlug.value === 'other'
  },
  {
    key: 'gas',
    shortDesc: 'Natural gas or propane',
    label: 'Who is your gas or propane provider?',
    model: selectedGasSlug,
    options: gasOptions.value,
    displayValue: selectedGasName.value,
    missingMessage: 'Missing service details',
    isInvalid: () => !selectedGasSlug.value
  }
])

const isExternalDirty = ref(false) // for outside Vue elements + button spin.

// Bootstrap guard.
const bootstrapped = ref(false)

onMounted(() => {
  // Save compact state to localStorage — but only after bootstrapping is complete.
  watch(
    urlStateDeps,
    (newDeps) => {
      if (!bootstrapped.value) return
      const compact = Object.fromEntries(
        Object.entries(newDeps).filter(([, v]) => v !== '' && v != null)
      )
      localStorage.setItem('rebateToolSettings', JSON.stringify(compact))
    },
    { deep: true } // no immediate:true — avoids clobbering saved settings.
  )
})

watch(isExternalDirty, newVal => {
  const blocks = document.querySelectorAll(
    '.multi-query-content-block, .query-conditional-group-block'
  )
  blocks.forEach(el => el.classList.toggle('is-dirty-variable', newVal))
})

/**
 * Toggle classes based on isDirty state.
 */
function applyDirtyClasses(val) {
  document
    .querySelectorAll('.multi-query-content-block > span[data-replace="value"]')
    .forEach(el => el.classList.toggle('is-dirty', val))
}

// -- Mode (archive|single) --
const mode = ref('archive')

// Show the info card only if any heat pump rebate exists
const showHeatPumpInfo = computed(() =>
  filteredResults.value.some(item =>
    ['heat-pump-rebates', 'heat-pump-water-heater-rebates'].includes(item.rebate_type_class)
  )
)

// Find the index of the first qualifying heat pump rebate
const firstHeatPumpIndex = computed(() =>
  filteredResults.value.findIndex(item =>
    ['heat-pump-rebates', 'heat-pump-water-heater-rebates'].includes(item.rebate_type_class)
  )
)


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
      // From localStorage apply, then reload with full query string.
      initFromLocalStorage(JSON.parse(saved))
      if (mode.value === 'archive') {
        updateAddressBar()
      } else {
        // This is needed on single mode pages so the page receives the SSR details aligned with localStorage when accessed without the query string.
        window.location.href = assembledUrl.value
        return  // stop further initialization until page reloads.
      }
    } else {
      // First visit — nothing special.
      console.log('No saved settings — starting fresh')
    }

    // Bootstrap completes here.
    bootstrapped.value = true

    // Hydrate preferredSettings from restored rebateToolSettings/state
    hydratePreferredSettingsFromRebateToolSettings()

    watch(
      urlStateDeps,
      () => {
        isExternalDirty.value = true // external goes dirty immediately.
        updateAddressBar()
        debouncedUpdateRebateDetails()
      },
      { deep: true }
    )

    watch(homeValueOptions, async newVal => {
      if (!selectedHomeValueSlug.value && newVal.length > 0) {
        // force remount and focus.
        fieldRenderKeys.value.homeValue++
        await nextTick()
        activeEdit.value = 'homeValue'
      } else if (
        selectedHomeValueSlug.value &&
        !newVal.find(o => o.slug === selectedHomeValueSlug.value)
      ) {
        selectedHomeValueSlug.value = ''
        fieldRenderKeys.value.homeValue++
        await nextTick()
        activeEdit.value = 'homeValue'
      }
    })

    watch(incomeRangeOptions, async newVal => {
      if (!selectedIncomeRangeSlug.value && newVal.length > 0) {
        fieldRenderKeys.value.income++
        await nextTick()
        activeEdit.value = 'income'
      } else if (
        selectedIncomeRangeSlug.value &&
        !newVal.find(o => o.slug === selectedIncomeRangeSlug.value)
      ) {
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

  // load the definitions links nextTick.
  nextTick(() => bcgovBlockThemePluginDefnitions())
  nextTick(() => betterhomesRebatesArchiveLoader())
})

/**
 * Initialize form state from stored localStorage object.
 */
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

  if (data.tenure && (data.tenure === 'own' || data.tenure === 'rent'))
    murbTenure.value = data.tenure

  if (
    data.home_value &&
    homeValueOptions.value.find(h => h.slug === data.home_value)
  ) {
    selectedHomeValueSlug.value = data.home_value
  }

  if (data.persons && personCountOptions.value.some(p => p.slug === data.persons)) {
    selectedPersonsSlug.value = data.persons
  }

  if (data.income && incomeRangeOptions.value.some(r => r.slug === data.income)) {
    selectedIncomeRangeSlug.value = data.income
  }

  if (data.location) {
    const loc =
      locationOptions.value.find(l => l.slug === data.location) ||
      locationOptions.value.find(l => l.name === data.location)
    if (loc) selectedLocationSlug.value = loc.slug
  }

  if (data.heating) {
    const heating =
      heatingOptions.value.find(w => w.slug === data.heating) ||
      heatingOptions.value.find(w => w.name === data.heating)
    if (heating) selectedHeatingSlug.value = heating.slug
  }

  if (data.water_heating) {
    const waterHeating =
      waterHeatingOptions.value.find(w => w.slug === data.water_heating) ||
      waterHeatingOptions.value.find(w => w.name === data.water_heating)
    if (waterHeating) selectedWaterHeatingSlug.value = waterHeating.slug
  }

  if (data.utility) {
    const utility =
      utilityOptions.value.find(u => u.slug === data.utility) ||
      utilityOptions.value.find(u => u.name === data.utility)
    if (utility) selectedUtilitySlug.value = utility.slug
  }

  if (data.gas) {
    const gas =
      gasOptions.value.find(g => g.slug === data.gas) ||
      gasOptions.value.find(g => g.name === data.gas)
    if (gas) selectedGasSlug.value = gas.slug
  }

  // After restoring state, update the URL and initialUrl.
  updateAddressBar()
}

// -- Building Types (hierarchical) --
const buildingTypeGroups = computed(() => {
  const raw = api.value?.['settings-selects']?.['building-types'] ?? []

  // Sort children inside each group, then move any `other` group to the end
  const withChildrenSorted = raw.map(group => ({
    ...group,
    children: sortOtherLast(group.children ?? [])
  }))

  const sorted = sortOtherLast(withChildrenSorted)

  // Single mode: do NOT include the "other" group at all
  if (mode.value === 'single') {
    return sorted.filter(g => g?.slug !== 'other')
  }

  return sorted
})

watch(
  () => mode.value,
  () => {
    if (mode.value === 'single' && selectedBuildingTypeSlug.value === 'other') {
      selectedBuildingTypeSlug.value = ''
    }
  },
  { immediate: true }
)

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
  if (
    buildingTypeGroups.value.some(
      g => g.slug === selectedBuildingTypeSlug.value
    )
  )
    return selectedBuildingTypeSlug.value
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

/**
 * Handle building type change by resetting home value and focusing next.
 */
async function onBuildingTypeChange() {
  selectedHomeValueSlug.value = ''
  await nextTick()
  if (!selectedHomeValueSlug.value) selectedHomeValueSlug.value = ''
  activeEdit.value = 'homeValue'
}

// -- MURB tenure --
const murbTenure = ref('')
const murbTenureLabel = computed(() =>
  murbTenure.value === 'own'
    ? 'Own'
    : murbTenure.value === 'rent'
      ? 'Rent'
      : ''
)

// -- Home Value --
const homeValueOptions = computed(() => {
  const hvGroups = api.value?.['settings-selects']?.['home-value'] ?? []
  const groupSlug = selectedBuildingGroupSlug.value
  if (!groupSlug) return []

  const groupObj = (
    api.value?.['settings-selects']?.['building-types'] ?? []
  ).find(g => g.slug === groupSlug)
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
  const match = homeValueOptions.value.find(
    v => v.slug === selectedHomeValueSlug.value
  )
  return match ? match.name : ''
})

// -- Income Bands --
const personCountOptions = computed(() =>
  (api.value?.['settings-selects']?.['income-bands'] ?? []).map(p => ({
    name: p.name,
    slug: p.slug,
    id: p.id
  }))
)

const selectedPersonsSlug = ref('')

const selectedPersonsGroup = computed(
  () =>
    (api.value?.['settings-selects']?.['income-bands'] ?? []).find(
      p => p.slug === selectedPersonsSlug.value
    ) || null
)

const selectedPersonsCount = computed(
  () => selectedPersonsGroup.value?.name || ''
)

const incomeRangeOptions = computed(() => {
  const children = selectedPersonsGroup.value?.children ?? []
  return children
    .map(r => ({
      ...r,
      name: r.name.replace(/^Range:\s*/, '')
    }))
    .sort((a, b) => {
      const order = { t1: 1, t2: 2, t3: 3, t0: 4 }
      const aCode = a.slug.split('-').pop()
      const bCode = b.slug.split('-').pop()
      return (order[aCode] || 99) - (order[bCode] || 99)
    })
})

const selectedIncomeRangeSlug = ref('')

const selectedIncomeRangeName = computed(() => {
  const match = incomeRangeOptions.value.find(
    r => r.slug === selectedIncomeRangeSlug.value
  )
  return match ? match.name : ''
})

/**
 * Handle household size change by resetting income range and focusing next.
 */
async function onPersonsChange() {
  selectedIncomeRangeSlug.value = ''
  await nextTick()
  if (!selectedIncomeRangeSlug.value) selectedIncomeRangeSlug.value = ''
  activeEdit.value = 'income'
}

// -- Location --
const locationOptions = computed(
  () => api.value?.['settings-selects']?.['locations'] ?? []
)

const selectedLocationSlug = ref('')

const selectedLocation = computed(
  () =>
    locationOptions.value.find(l => l.slug === selectedLocationSlug.value) ||
    null
)

const locationInputValue = ref('')

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

const locationInputDisplay = ref('')

// Keep the display synced with the real model when that changes
watch(locationInputValue, newVal => {
  if (isMobile.value) {
    locationInputDisplay.value = newVal
  }
})

// Unified proxy for v-model (this is now a valid member expression)
const setLocationDisplayDebounced = debounce((v) => {
  locationInputDisplay.value = v
}, 300)

const locationInputProxy = computed({
  get() {
    return isMobile.value ? locationInputDisplay.value : locationInputValue.value
  }
  ,
  set(val) {
    if (isMobile.value) {
      setLocationDisplayDebounced(val)   // <-- invoke the debounced setter
    } else {
      locationInputValue.value = val
    }
  }
})

const selectedRegion = computed(
  () => selectedLocation.value?.children?.[0]?.slug || ''
)
const selectedLocationName = computed(
  () => selectedLocation.value?.name || ''
)
const selectedRegionName = computed(
  () => selectedLocation.value?.children?.[0]?.name || ''
)

// -- Heating --
const heatingOptions = computed(
  () => sortOtherLast(api.value?.['settings-selects']?.['heating-types'] ?? [])
)
const selectedHeatingSlug = ref('')
const selectedHeating = computed(
  () =>
    heatingOptions.value.find(l => l.slug === selectedHeatingSlug.value) || null
)
const selectedHeatingName = computed(
  () => selectedHeating.value?.name || ''
)

// -- Water Heating --
const waterHeatingOptions = computed(
  () => sortOtherLast(api.value?.['settings-selects']?.['heating-types'] ?? [])
)
const selectedWaterHeatingSlug = ref('')
const selectedWaterHeating = computed(
  () =>
    waterHeatingOptions.value.find(l => l.slug === selectedWaterHeatingSlug.value) || null
)
const selectedWaterHeatingName = computed(
  () => selectedWaterHeating.value?.name || ''
)

// -- Utility --
const utilityOptions = computed(
  () => sortOtherLast(api.value?.['settings-selects']?.['utilities'] ?? [])
)
const selectedUtilitySlug = ref('')
const selectedUtility = computed(
  () =>
    utilityOptions.value.find(l => l.slug === selectedUtilitySlug.value) || null
)
const selectedUtilityName = computed(
  () => selectedUtility.value?.name || ''
)

// -- Gas --
const gasOptions = computed(
  () => sortOtherLast(api.value?.['settings-selects']?.['gas'] ?? [])
)
const selectedGasSlug = ref('')
const selectedGas = computed(
  () =>
    gasOptions.value.find(g => g.slug === selectedGasSlug.value) || null
)
const selectedGasName = computed(
  () => selectedGas.value?.name || ''
)

// -- Selections summary --
const hasAnySelection = computed(
  () =>
    !!(
      selectedBuildingTypeName.value ||
      murbTenure.value ||
      selectedHomeValueName.value ||
      selectedPersonsCount.value ||
      selectedIncomeRangeName.value ||
      selectedLocationName.value ||
      selectedHeatingName.value ||
      selectedWaterHeatingName.value ||
      selectedUtilityName.value||
      selectedGasName.value
    )
)

const hasAllSelection = computed(() => {
  const hasBuilding = !!selectedBuildingTypeName.value
  const hasMurbTenure =
    selectedBuildingGroupSlug.value === 'murb' ? !!murbTenure.value : true
  const hasHomeValue = !!selectedHomeValueName.value
  const hasPersons = !!selectedPersonsCount.value
  const hasIncome = !!selectedIncomeRangeName.value
  const hasLocation = !!selectedLocationName.value
  const hasHeating = !!selectedHeatingName.value
  const hasWaterHeating = !!selectedWaterHeatingName.value
  const hasUtility = !!selectedUtilityName.value
  const hasGas = !!selectedGasName.value

  return (
    hasBuilding &&
    hasMurbTenure &&
    hasHomeValue &&
    hasPersons &&
    hasIncome &&
    hasLocation &&
    hasHeating &&
    hasWaterHeating &&
    hasUtility&&
    hasGas
  )
})

// -- URL assembly --
const assembledUrl = computed(() => assembleUrl())

const assembledQueryString = computed(() => {
  const q = assembledUrl.value.split('?')[1]
  return q ? `?${q}` : ''
})

// Dirty states 
// URL does not match the settings currently showing.
const urlOutOfSync = computed(() => assembledQueryString.value !== window.location.search)

// Use this everywhere inside Vue for warnings/outline.
const isDirty = urlOutOfSync

const isUrlHeatingMismatch = computed(() => {
  // Only relevant in single mode where SSR heating type is defined
  if (mode.value !== 'single' || !pageHeatingType.value) return false

  const params = new URLSearchParams(window.location.search)
  const heatingParam = params.get('heating')

  // Mismatch occurs if the URL has a heating param that differs from SSR value
  return heatingParam && heatingParam !== pageHeatingType.value
})

const isUrlWaterHeatingMismatch = computed(() => {
  // Only relevant in single mode where SSR heating type is defined
  if (mode.value !== 'single' || !pageWaterHeatingType.value) return false

  const params = new URLSearchParams(window.location.search)
  const waterHeatingParam = params.get('water_heating')

  // Mismatch occurs if the URL has a heating param that differs from SSR value
  return waterHeatingParam && waterHeatingParam !== pageWaterHeatingType.value
})


// Keep external spans in sync with URL mismatch.
watch(urlOutOfSync, val => applyDirtyClasses(val), { immediate: true })

// Keep input value in sync when a location is selected externally (e.g. from URL or localStorage).
watch(selectedLocationName, newName => {
  locationInputValue.value = newName || ''
})

onMounted(() => {
  const el = document.getElementById('rebateFilterApp')
  if (el?.dataset?.mode) mode.value = el.dataset.mode
  if (el?.dataset?.pageHeatingType) {
    pageHeatingType.value = el.dataset.pageHeatingType
  }
  if (el?.dataset?.pageWaterHeatingType) {
    pageWaterHeatingType.value = el.dataset.pageWaterHeatingType
  }

  // If SSR heating type exists, set the model directly
  if (mode.value === 'single' && pageHeatingType.value) {
    // find a matching option from heatingOptions by slug
    watch(
      heatingOptions,
      (opts) => {
        const match = opts.find(o => o.slug === pageHeatingType.value)
        if (match) {
          selectedHeatingSlug.value = match.slug
        }
      },
      { immediate: true }
    )
  }

  // Auto-correct URL heating param if it doesn't match SSR heating type
  if (mode.value === 'single' && pageHeatingType.value) {
    const params = new URLSearchParams(window.location.search)
    const currentHeating = params.get('heating')
    if (currentHeating && currentHeating !== pageHeatingType.value) {
      params.set('heating', pageHeatingType.value)
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState(null, '', newUrl)
    }
  }

   // If SSR waterHeating type exists, set the model directly
  if (mode.value === 'single' && pageWaterHeatingType.value) {
    // find a matching option from waterHeatingOptions by slug
    watch(
      waterHeatingOptions,
      (opts) => {
        const match = opts.find(o => o.slug === pageWaterHeatingType.value)
        if (match) {
          selectedWaterHeatingSlug.value = match.slug
        }
      },
      { immediate: true }
    )
  }

   // Auto-correct URL waterHeating param if it doesn't match SSR heating type
  if (mode.value === 'single' && pageWaterHeatingType.value) {
    const params = new URLSearchParams(window.location.search)
    const currentWaterHeating = params.get('water_heating')
    if (currentWaterHeating && currentWaterHeating !== pageWaterHeatingType.value) {
      params.set('water_heating', pageWaterHeatingType.value)
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState(null, '', newUrl)
    }
  }


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

  const savedCollapseView = localStorage.getItem('rebateCollapseView')
  if (savedCollapseView !== null) {
    isCollapseView.value = JSON.parse(savedCollapseView)
  }

  const observer = new MutationObserver(() => {
    applyDirtyClasses(urlOutOfSync.value)
  })
  observer.observe(document.body, { childList: true, subtree: true })

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    displayGridOrList.value = (saved === 'true')
  }
})

/**
 * Rebuild the current rebate tool URL including all selected params.
 */
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
    urlParams.set('rebate_tier', espTier.value)
  } else {
    urlParams.delete('rebate_tier')
  }

  if (selectedLocationSlug.value) {
    urlParams.set('location', selectedLocationName.value)
    if (selectedRegionName.value) urlParams.set('region', selectedRegionName.value)
  }

  if (selectedHeatingSlug.value) urlParams.set('heating', selectedHeatingName.value)
  if (selectedWaterHeatingSlug.value) urlParams.set('water_heating', selectedWaterHeatingName.value)
  if (selectedUtilitySlug.value) urlParams.set('utility', selectedUtilityName.value)
  if (selectedGasSlug.value) urlParams.set('gas', selectedGasName.value)

  return `${baseUrl}?${urlParams.toString()}`
}

/**
 * Copy the assembled URL to clipboard and show a feedback message.
 */
function addLinkToClipboard(event) {
  const url = assembledUrl.value
  navigator.clipboard
    ?.writeText(url)
    .then(() =>
      handleLinkCopiedMessageContent(
        event,
        '.selection-summary',
        'Link copied to clipboard'
      )
    )
    .catch(err => {
      console.error('Failed to copy URL:', err)
      handleLinkCopiedMessageContent(event, '.selection-summary', 'Copy failed')
    })
}

/**
 * Show a temporary feedback message in the UI when link copied.
 */
function handleLinkCopiedMessageContent(event, targetSelector, msg) {
  const root = document.querySelector(targetSelector) || document.body
  const el = root.querySelector('.copy-message')
  if (!el) return

  el.textContent = msg
  el.classList.remove('isFadedOut')

  setTimeout(() => el.classList.add('isFadedOut'), 1200)
  setTimeout(() => {
    el.textContent = ''
  }, 1800)
}

/**
 * Initialize form state from current query string params.
 */
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
  const heating = urlParams.get('heating')
  const waterHeating = urlParams.get('water_heating')
  const utility = urlParams.get('utility')
  const gas = urlParams.get('gas')

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

  if (heating) {
    const foundHeat = heatingOptions.value.find(l => l.name === heating)
    if (foundHeat) selectedHeatingSlug.value = foundHeat.slug
  }

  if (waterHeating) {
    const foundWaterHeat = waterHeatingOptions.value.find(l => l.name === waterHeating)
    if (foundWaterHeat) selectedWaterHeatingSlug.value = foundWaterHeat.slug
  }

  if (utility) {
    const foundUtil = utilityOptions.value.find(l => l.name === utility)
    if (foundUtil) selectedUtilitySlug.value = foundUtil.slug
  }

  if (gas) {
    const foundGas = gasOptions.value.find(g => g.name === gas)
    if (foundGas) selectedGasSlug.value = foundGas.slug
  }
}

// -- URL state deps --
const urlStateDeps = computed(() => ({
  type: selectedBuildingTypeSlug.value,
  group: selectedBuildingGroupSlug.value,
  tenure: murbTenure.value,
  home_value: selectedHomeValueSlug.value,
  persons: selectedPersonsSlug.value,
  income: selectedIncomeRangeSlug.value,
  location: selectedLocationSlug.value,
  heating: selectedHeatingSlug.value,
  water_heating: selectedWaterHeatingSlug.value,
  utility: selectedUtilitySlug.value,
  gas: selectedGasSlug.value,
  region: selectedRegion.value
}))

/**
 * Update the browser address bar to match assembled state.
 */
function updateAddressBar() {
  const url = assembledUrl.value
  try {
    window.history.replaceState(null, '', url)
  } catch (e) {
    // no-op.
  }
}

// -- ESP Tier derivation --
const espTier = computed(() => {
  const incomeSlug = selectedIncomeRangeSlug.value
  if (!incomeSlug) return ''

  const hasAllSelectionAvailable = hasAllSelection.value
  if (!hasAllSelectionAvailable) return ''

  const selectedHV = homeValueOptions.value.find(
    v => v.slug === selectedHomeValueSlug.value
  )
  const hvSlug = selectedHV?.slug || ''
  const isMurb = selectedBuildingGroupSlug.value === 'murb'

  // FIX LABELS HERE
  const homeOverLimit =
    (isMurb && hvSlug === 'over-772000') ||
    (!isMurb && hvSlug === 'over-1230000')

  if (/-t1$/.test(incomeSlug)) return homeOverLimit ? (isMurb ? 'HRR' : 'ESP-3') : 'ESP-1' // god: ESP-3
  if (/-t2$/.test(incomeSlug)) return homeOverLimit ? (isMurb ? 'HRR' : 'ESP-3') : 'ESP-2' // god: ESP-3
  if (/-t3$/.test(incomeSlug)) return isMurb ? 'HRR' : 'ESP-3'  // god: ESP-3
  if (/-t0$/.test(incomeSlug)) return 'HRR'
  return ''
})


// Hydrate preferredSettings whenever location becomes valid
watch(
  [selectedLocationSlug, selectedLocationName, locationOptions],
  () => {
    if (!bootstrapped.value) return
    hydratePreferredSettingsFromRebateToolSettings()
  },
  { deep: false, immediate: true }
)

// Save preferredSettings whenever a valid program tier is available
watch(
  espTier,
  (newTier) => {
    if (!bootstrapped.value) return
    if (!newTier) return
    writePreferredSettings({ esp_tier: newTier })
  },
  { immediate: true }
)

const normalizeHeatingSlug = (val) => {
  if (!val) return ''
  const v = val.toLowerCase().trim()
  if (v.includes('gas')) return 'gas'
  if (v.includes('oil')) return 'oil'
  if (v.includes('wood')) return 'wood'
  if (v.includes('electric')) return 'electricity'
  return v.replace(/\s+/g, '-') // fallback.
}

const normalizeUtilitySlug = (val) => {
  if (!val) return ''
  const v = val.toLowerCase().trim()
  if (v.includes('bc hydro')) return 'bc-hydro'
  if (v.includes('fortis')) return 'fortisbc'
  if (v.includes('grand forks')) return 'grand-forks'
  if (v.includes('nelson')) return 'nelson'
  if (v.includes('new west')) return 'new-westminster'
  if (v.includes('penticton')) return 'penticton'
  if (v.includes('summerland')) return 'summerland'
  return v.replace(/\s+/g, '-') // fallback slugify.
}

const normalizeGasSlug = (val) => {
  if (!val) return ''
  const v = val.toLowerCase().trim()
  if (v.includes('fortis')) return 'fortisbc-gas'
  if (v.includes('no gas')) return 'no-gas'
  if (v.includes('pacific')) return 'png-gas'
  if (v.includes('tank propane')) return 'tank-gas'
  return v.replace(/\s+/g, '-') // fallback slugify.
}

// Normalize region ("North" to "north").
const normalizeRegionSlug = (val) => {
  if (!val) return ''
  return val.toLowerCase().trim()
}

// Normalize location ("100 Mile House" to "100-mile-house").
const normalizeLocationSlug = (val) => {
  if (!val) return ''
  return val.toLowerCase().trim().replace(/\s+/g, '-')
}

const filteredResults = computed(() => {
  const normalizedHeating       = normalizeHeatingSlug(selectedHeatingName.value)
  const normalizedWaterHeating  = normalizeHeatingSlug(selectedWaterHeatingName.value)
  const normalizedUtility       = normalizeUtilitySlug(selectedUtilityName.value)
  const normalizedGas           = normalizeGasSlug(selectedGasName.value)
  const normalizedRegion        = normalizeRegionSlug(selectedRegionName.value)
  const normalizedLocation      = normalizeLocationSlug(selectedLocationName.value)
  const normalizedEspTier       = espTier.value?.toLowerCase?.()
  const normalizedBuildingGroup = selectedBuildingGroupSlug.value?.toLowerCase?.()

  const results = api.value.results.filter(item => {
    // Applicable rebates 
    const applicable = Array.isArray(item.applicable_rebates)
      ? item.applicable_rebates
          .map(r => r?.slug?.toLowerCase?.())
          .filter(Boolean)
      : []
    const applicableSet = new Set(applicable)

    // Respect "no-show" unconditionally 
    const showInResults = !applicableSet.has('no-show')
    if (!showInResults) return false

    // ESP tier eligibility 
    const hasApplicableRebates = applicable.length > 0
    const rebateTierEligible = hasApplicableRebates
      ? (normalizedEspTier ? applicableSet.has(normalizedEspTier) : true)
      : (!normalizedEspTier || ['esp-1', 'esp-2', 'esp-3'].includes(normalizedEspTier))

    // HRR fallback rule 
    const hasHRR     = applicableSet.has('hrr')
    const isHrrTier  = normalizedEspTier === 'hrr'
    const hasESP3    = applicableSet.has('esp-3')
    const isHighTier = ['esp-3', 'hrr'].includes(normalizedEspTier)
    const hrrEligible = hasHRR && !hasESP3 && isHighTier

    const tierEligible = rebateTierEligible || hrrEligible

    // Building type eligibility 
    const hasTypeInfo = Array.isArray(item.types) && item.types.length > 0
    const buildingTypeEligible = hasTypeInfo
      ? item.types.some(t => t?.slug?.toLowerCase?.() === normalizedBuildingGroup)
      : true

    const rebateClass = (item.rebate_type_class || '').toLowerCase()

    // Heating types present on the rebate
    const heatingTypeSlugs = Array.isArray(item.heating_types)
      ? item.heating_types.map(sys => sys?.slug?.toLowerCase?.()).filter(Boolean)
      : []

    // Eligibility against "How do you heat the rooms in your home?"
    const roomHeatingEligible =
      !normalizedHeating ||
      heatingTypeSlugs.length === 0 ||
      heatingTypeSlugs.includes(normalizedHeating)

    // Eligibility against "How do you heat your water?"
    const waterHeatingEligible =
      !normalizedWaterHeating ||
      heatingTypeSlugs.length === 0 ||
      heatingTypeSlugs.includes(normalizedWaterHeating)

    // Decide which heating question to use based on rebate type
    let heatingEligible

    if (rebateClass === 'heat-pump-water-heater-rebates') {
      // Tie to "How do you heat your water?"
      heatingEligible = waterHeatingEligible
    } else if (rebateClass === 'heat-pump-rebates') {
      // Tie to "How do you heat the rooms in your home?"
      heatingEligible = roomHeatingEligible
    } else {
      // Default: space heating
      heatingEligible = roomHeatingEligible
    }

    // STRICT GUARD : Heating must match (after we've chosen which one matters)
    if (!heatingEligible) {
      if (debug) {
        console.group('GUARD 1: ', item.rebate_type_headline_card, item.title.toLowerCase())
        console.log('Not in rebate list:', false, '(blocked by heating)')
        console.log('rebateClass:', rebateClass)
        console.log('normalizedHeating (rooms):', normalizedHeating)
        console.log('normalizedWaterHeating (water):', normalizedWaterHeating)
        console.log('heatingTypeSlugs:', heatingTypeSlugs)
        console.groupEnd()
      }
      return false
    }

    // BEGIN EDGE CASE GUARDS

    // Additional guard helpers
    const isMurbBuilding = normalizedBuildingGroup === 'murb'
    const isGodBuilding = normalizedBuildingGroup === 'ground-oriented-dwellings'
    const isHP = rebateClass === 'heat-pump-rebates'
    const isHPWH = rebateClass === 'heat-pump-water-heater-rebates'
    const isWindowsDoors = rebateClass === 'windows-doors-rebates'
    const isInsulation = rebateClass === 'insulation-rebates'
    const utilityIsBCHydro = normalizedUtility === 'bc-hydro'
    const utilityIsBCHydroOrNW = normalizedUtility === 'bc-hydro' || normalizedUtility === 'new-westminster'
    const roomIsElectric = normalizedHeating === 'electricity'
    const roomIsWood = normalizedHeating === 'wood'
    const waterIsElectric = normalizedWaterHeating === 'electricity'
    const waterIsWood = normalizedWaterHeating === 'wood'
    const northernRequired = applicableSet.has('hrr') && applicableSet.has('north')
    const userRegionNorth = normalizedRegion === 'north'
    const currentUtility = normalizedUtility // slug ('bc-hydro', 'fortisbc', etc.)
    const locationIsVancouver = normalizedLocation === 'vancouver'


     // Guard : Ground-oriented heat pump/hp water heaters rules for ESP-3 + HRR wood
    const godHPIneligible =
      isGodBuilding &&
      isHighTier &&
      (isHP || isHPWH) &&
      roomIsWood
    
    if (godHPIneligible) {
      return false
    }

    // Guard : Ground-oriented windows and doors rules for ESP-3 + HRR wood/Vancouver 
    const godWindowsWoodVanIneligible =
    ( isGodBuilding && isHighTier && isWindowsDoors ) && (
      roomIsWood // room cannot be wood
    ) || ( locationIsVancouver && isWindowsDoors )

    if (godWindowsWoodVanIneligible) {
      return false
    }

    // Guard : Ground-oriented insulation rules for ESP-3 + HRR wood
    const godInsulationWoodIneligible =
    ( isGodBuilding && isHighTier && isInsulation ) && (
      roomIsWood // room cannot be wood
    )

    if (godInsulationWoodIneligible) {
      return false
    }

    // GUARD : Heat pump water heater business rules for MURB
    const hpwhIneligible =
      ( isHPWH && isMurbBuilding ) && (
        !roomIsElectric    ||   // room heating must be electricity
        !waterIsElectric       // water heating must be electricity
      ) || ( isHPWH && isMurbBuilding && isHighTier ) && (
        !utilityIsBCHydroOrNW // utility must be BC Hydro or New Westminster
      )

    if (hpwhIneligible) {
      if (debug) {
        console.group('GUARD 0 (HPWH MURB):', item.rebate_type_headline_card, item.title?.toLowerCase?.())
        console.log('Not in rebate list:', false, '(HPWH MURB rules: utility BC Hydro/New West, room+water electric)')
        console.log('normalizedBuildingGroup:', normalizedBuildingGroup)
        console.log('normalizedUtility:', normalizedUtility)
        console.log('normalizedHeating (rooms):', normalizedHeating)
        console.log('normalizedWaterHeating (water):', normalizedWaterHeating)
        console.groupEnd()
      }
      return false
    }

    // GUARD : MURB utility rules
    // Disallow ANY non-BC Hydro utility when MURB + HRR is selected
    // New Westminster utilities here too
    const murbUtilityBlocked =
      isMurbBuilding &&
      isHrrTier &&
      currentUtility &&
      (!currentUtility.includes('bc-hydro') && !currentUtility.includes('new-westminster'))

    if (murbUtilityBlocked) {
      if (debug) {
        console.group('GUARD 2: ', item.rebate_type_headline_card, item.title.toLowerCase())
        console.log(
          'Not in rebate list:',
          false,
          '(blocked by MURB+HRR: utility must be BC Hydro or New Westminster)'
        )
        console.log('isMurbBuilding',isMurbBuilding)
        console.log('isHrrTier',isHrrTier)
        console.log('currentUtility',currentUtility)
        console.groupEnd()
      }
      return false
    }

    // GUARD : Ground utility rules
    // Disallow ANY non-BC Hydro utility for HRR + North restricted offers.
    const regionAndHRRBCHydro = (() => {

      // Rebate is explicitly marked as HRR + North in applicableSet.
      const rebateHRRNorthRestricted =
        isHrrTier && applicableSet.has('north')

      // If the rebate is NOT explicitly HRR+North restricted, this guard does nothing.
      if (!rebateHRRNorthRestricted) {
        return true
      }

      const tierIsConstrained = isHrrTier

      if (!(isGodBuilding && tierIsConstrained)) {
        return true
      }
      // Only blocked case:
      const blocked =  (!userRegionNorth) ||   // HRR user must be in North
        (userRegionNorth && !utilityIsBCHydro) // and if North, must be BC Hydro

      if (blocked) {
        if (debug) {
          console.group('GUARD 3: ', item.rebate_type_headline_card, item.title.toLowerCase())
          console.log('Not in rebate list:', false, '(blocked: HRR user must be in North for HRR+North/BC Hydro-restricted rebate)')
          console.log('normalizedEspTier:', normalizedEspTier)
          console.log('normalizedRegion:', normalizedRegion)
          console.log('rebateHRRNorthRestricted:', rebateHRRNorthRestricted)
          console.log('applicableSet:', applicableSet)
          console.groupEnd()
        }
        return false
      }

      // All other combinations are OK.
      return true
    })()

    if (!regionAndHRRBCHydro) return false

    // END OF EDGE CASE GUARDS

    // Region slugs + eligibility 
    const regionSlugs = Array.isArray(item.regions)
      ? item.regions.map(r => r?.toLowerCase?.()).filter(Boolean)
      : []

    const regionEligible =
      !normalizedRegion ||
      regionSlugs.length === 0 ||
      regionSlugs.includes(normalizedRegion)

    // Utility slugs + eligibility 
    const utilitySlugs = Array.isArray(item.utilities)
      ? item.utilities.map(u => u?.slug?.toLowerCase?.()).filter(Boolean)
      : []

    const utilityEligible =
      !normalizedUtility ||
      utilitySlugs.length === 0 ||
      utilitySlugs.includes(normalizedUtility)

    // Gas slugs + eligibility 
    const gasSlugs = Array.isArray(item.gas)
      ? item.gas.map(g => g?.slug?.toLowerCase?.()).filter(Boolean)
      : []

    const gasEligible =
      !normalizedGas ||
      gasSlugs.length === 0 ||
      gasSlugs.includes(normalizedGas)

    // Location eligibility 
    const locationEligible =
      !normalizedLocation ||
      !Array.isArray(item.locations) || item.locations.length === 0 ||
      item.locations.some(l => l?.slug?.toLowerCase?.() === normalizedLocation)

    // cross-field slug matches (OR logic)
    // If any applicable slug matches a region/utility/gas slug,
    // treat that as eligible even if tier wouldn't otherwise match.
    const geoOrServiceSlugMatch =
      regionSlugs.some(slug => applicableSet.has(slug)) ||
      utilitySlugs.some(slug => applicableSet.has(slug)) ||
      gasSlugs.some(slug => applicableSet.has(slug))

    // tier OR cross-field slug match
    const tierOrSlugEligible = tierEligible || geoOrServiceSlugMatch
    
    // Standard strict checks (old behaviour).
    const strictEligibility =
      tierOrSlugEligible &&
      buildingTypeEligible

    // "Others" that can fail before additive kicks in.
    const baseEligibility =
      tierOrSlugEligible &&
      regionEligible && 
      utilityEligible &&
      buildingTypeEligible

    // Additive eligibility: any match allows inclusion.
    const additiveEligibility =
      utilitySlugs.some(slug => applicableSet.has(slug)) || gasEligible || regionEligible

    // Final rule:
    // 1) Keep strict mode passing in all cases
    // 2) If strict mode fails:
    //    include item if heating passed (above)
    //    AND baseEligibility failed
    //    AND ANY additive field is true
    const shouldInclude =
      strictEligibility ||
      (!baseEligibility && (buildingTypeEligible && additiveEligibility))
    
    if (debug) {    
      console.group('PASSED: ', item.rebate_type_headline_card, item.title.toLowerCase())
      console.log('tierOrSlugEligible:', tierOrSlugEligible,'| tier:', normalizedEspTier, '| geoOrServiceSlugMatch:', geoOrServiceSlugMatch)
      console.log('buildingTypeEligible:',buildingTypeEligible, '| normalizedBuildingGroup:',normalizedBuildingGroup.split(' '))
      console.log('heatingEligible:',heatingEligible, '| normalizedHeating:',normalizedHeating.split(' '), '| normalizedWaterHeating:', normalizedWaterHeating.split(' '))
      console.log('locationEligible:',locationEligible, '| normalizedLocation:',normalizedLocation.split(' '))
      console.log('regionEligible:',regionEligible, '| regionSlugs:',regionSlugs, '| normalizedRegion:',normalizedRegion.split(' '))
      console.log('utilityEligible:',utilityEligible, '| utilitySlugsHasApplicable:',utilitySlugs.some(slug => applicableSet.has(slug)), '| normalizedUtility:',normalizedUtility.split(' '))
      console.log('gasEligible:',gasEligible, '| gasSlugs:',gasSlugs, '| normalizedGas:',normalizedGas.split(' '))
      console.log('applicableSet:',applicableSet)
      console.log('geoOrServiceSlugMatch:', geoOrServiceSlugMatch)
      console.log('strictEligibility:',strictEligibility)
      console.log('baseEligibility:',baseEligibility)
      console.log('additiveEligibility:',additiveEligibility)
      console.log('returns in rebate list:',shouldInclude)
      console.groupEnd()
    }
    
    return shouldInclude
  })

  nextTick(() => betterhomesRebatesArchiveLoader())

  return results.sort((a, b) => {
    const nameA = (a.rebate_type_headline_card || '').toLowerCase()
    const nameB = (b.rebate_type_headline_card || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })
})

/**
 * Return a URL with the current query string appended.
 */
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
    overflow: clip;
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
    padding: 0;
    grid-template-columns: 1fr;
  }

  .settings-headline {
    font-size: 0.75rem;
    margin-block-end: 0;
    margin-block-start: 0.25rem;
    padding: 1rem;

    @media (width > 550px) {
      margin-block-start: 0;
      font-size: 1.15rem;
    }

    &::before {
      display: inline-block;
      /* house icon */
      content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxOCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3Ljk2ODggOEMxNy45Njg4IDguNTYyNSAxNy41IDkgMTYuOTY4OCA5SDE1Ljk2ODhMMTYgMTRDMTYgMTQuMDkzOCAxNiAxNC4xODc1IDE2IDE0LjI1VjE0Ljc1QzE2IDE1LjQ2ODggMTUuNDM3NSAxNiAxNC43NSAxNkgxNC4yNUMxNC4xODc1IDE2IDE0LjE1NjIgMTYgMTQuMTI1IDE2QzE0LjA5MzggMTYgMTQuMDMxMiAxNiAxNCAxNkgxM0gxMi4yNUMxMS41MzEyIDE2IDExIDE1LjQ2ODggMTEgMTQuNzVWMTRWMTJDMTEgMTEuNDY4OCAxMC41MzEyIDExIDEwIDExSDhDNy40Mzc1IDExIDcgMTEuNDY4OCA3IDEyVjE0VjE0Ljc1QzcgMTUuNDY4OCA2LjQzNzUgMTYgNS43NSAxNkg1SDRDMy45Mzc1IDE2IDMuOTA2MjUgMTYgMy44NDM3NSAxNkMzLjgxMjUgMTYgMy43ODEyNSAxNiAzLjc1IDE2SDMuMjVDMi41MzEyNSAxNiAyIDE1LjQ2ODggMiAxNC43NVYxMS4yNUMyIDExLjI1IDIgMTEuMjE4OCAyIDExLjE4NzVWOUgxQzAuNDM3NSA5IDAgOC41NjI1IDAgOEMwIDcuNzE4NzUgMC4wOTM3NSA3LjQ2ODc1IDAuMzEyNSA3LjI1TDguMzEyNSAwLjI1QzguNTMxMjUgMC4wMzEyNSA4Ljc4MTI1IDAgOSAwQzkuMjE4NzUgMCA5LjQ2ODc1IDAuMDYyNSA5LjY1NjI1IDAuMjE4NzVMMTcuNjI1IDcuMjVDMTcuODc1IDcuNDY4NzUgMTggNy43MTg3NSAxNy45Njg4IDhaIiBmaWxsPSIjMzY5Ii8+Cjwvc3ZnPg==);
      margin-right: 0.5rem;
    }
  }

  #rebatesFilterControls {
    container-type: inline-size;
    container-name: filter;

    &.collapsed {
      height: 3.75rem;
      overflow: clip;
    }

     &.collapsed:has(button:focus-visible) {
      overflow: visible clip;
    }

    :is(button).rebate-collapse-setting {
      all: unset;
      height: calc(1.25rem + 2px);
      width: calc(100% - 2rem);
      border-radius: 0.5rem;
      font-size: 0;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0.25rem;
      padding: 1rem;
      /* down arrow */
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBkPSJNMjM5IDQ5OC43bDE2MC0xMjggMTguNy0xNS0zMC0zNy41LTE4LjcgMTUtMTQ1IDExNkw3OSAzMzMuM2wtMTguNy0xNS0zMCAzNy41IDE4LjcgMTUgMTYwIDEyOCAxNSAxMiAxNS0xMnptMC00ODUuNWwtMTUtMTItMTUgMTJMNDkgMTQxLjNsLTE4LjcgMTUgMzAgMzcuNSAxOC43LTE1IDE0NS0xMTYgMTQ1IDExNiAxOC43IDE1IDMwLTM3LjUtMTguNy0xNUwyMzkgMTMuM3oiLz48L3N2Zz4=);
        background-repeat: no-repeat;
        background-position: center right 1rem;
        background-size: 1rem;

        &:is(:focus-visible) {
          outline: 2px solid #369;
          outline-offset: 0 -4px;
        }
    }

    &:has(.stacked) {
      box-shadow: none;
      padding: 0;
    }
  }

  .control-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    gap: 1rem;
    grid-column: 1 / -1;
    padding: 0 1rem 1rem;

    &.stacked {

      counter-reset: question;

      .question-container {
        display: grid;
        grid-template-columns: 0 2.5rem 1fr; /* was: 3px 8rem 1fr */
        position: relative;

        &::before {
          /* border-left: 3px solid #369; */
          content: "";
          height: 100%;
          width: 3px;
          position: relative;
          /* left: calc(3rem + 2px); */
          z-index: 0;
        }

        /* &:last-of-type::before {
          border-bottom: 3px solid #369;
          width: 1rem;
          margin-inline-start: 0.25rem;
        } */

      }

      .num-label {
        display: grid;
        justify-content: center;
        align-content: center;
        /* border: 3px solid #369;
        border-radius: 100vw; */
        background-color: white;
        width: 1.5rem;
        height: 1.5rem;
        z-index: 1;
        position: relative;

        /* &::before {
          counter-increment: question;
          content: counter(question);

          color: #369;
          font-size: 2rem;
          font-family: Verdana, Arial, sans-serif;
        } */

        &::after {
          border: 3px solid darkgreen;
          border-radius: 100vw;
          background-color: white;
          content: "";
          /* Check mark – success */
          background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJsaW1lZ3JlZW4iICBvcGFjaXR5PSIuMyIgZD0iTTAgMjU2YTI1NiAyNTYgMCAxIDAgNTEyIDBBMjU2IDI1NiAwIDEgMCAwIDI1NnptMTI2LjEgMEwxNjAgMjIyLjFjLjMgLjMgLjYgLjYgMSAxYzUuMyA1LjMgMTAuNyAxMC43IDE2IDE2YzE1LjcgMTUuNyAzMS40IDMxLjQgNDcgNDdjMzctMzcgNzQtNzQgMTExLTExMWM1LjMtNS4zIDEwLjctMTAuNyAxNi0xNmMuMy0uMyAuNi0uNiAxLTFMMzg1LjkgMTkyYy0uMyAuMy0uNiAuNi0xIDFsLTE2IDE2TDI0MSAzMzdsLTE3IDE3LTE3LTE3LTY0LTY0Yy01LjMtNS4zLTEwLjctMTAuNy0xNi0xNmwtMS0xeiIvPjxwYXRoIGZpbGw9ImRhcmtncmVlbiIgZD0iTTM4NSAxOTNMMjQxIDMzN2wtMTcgMTctMTctMTctODAtODBMMTYxIDIyM2w2MyA2M0wzNTEgMTU5IDM4NSAxOTN6Ii8+PC9zdmc+);
          background-size: contain;
          height: 1.5rem;
          width: 1.5rem;
          position: absolute;
          right: -2px;
          top: -2px;
          z-index: 1;
        }
      }

      /* Question mark */
      .question-container:has(.location-input.is-empty) .num-label:after,
      :has(.select option[data-default="Select an option"]:checked) .num-label::after {
        /* Pending */
        border: 3px solid #bfdfe7;
        background-image: none;
        /* background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJ3aGl0ZSIgIGQ9Ik0wIDI1NmEyNTYgMjU2IDAgMSAwIDUxMiAwQTI1NiAyNTYgMCAxIDAgMCAyNTZ6bTE2OC03MmMwLS41IDAtMSAwIDB6bTY0IDE1Mmw0OCAwYzAgMTYgMCAzMiAwIDQ4bC00OCAwYzAtMTYgMC0zMiAwLTQ4eiIvPjxwYXRoIGZpbGw9IiMzNjkiIG9wYWNpdHk9IjAuNzUiIGQ9Ik0yMjQgMTI4Yy0zMC45IDAtNTYgMjUuMS01NiA1NmwwIDYuNSA0OCAwIDAtNi41YzAtNC40IDMuNi04IDgtOGw1Ni45IDBjOC40IDAgMTUuMSA2LjggMTUuMSAxNS4xYzAgNS40LTIuOSAxMC40LTcuNiAxMy4xbC00NC4zIDI1LjRMMjMyIDIzNi42bDAgMTMuOSAwIDIxLjUgMCAyNCA0OCAwIDAtMjQgMC03LjYgMzIuMy0xOC41YzE5LjYtMTEuMyAzMS43LTMyLjIgMzEuNy01NC44YzAtMzQuOS0yOC4zLTYzLjEtNjMuMS02My4xTDIyNCAxMjh6bTU2IDIwOGwtNDggMCAwIDQ4IDQ4IDAgMC00OHoiLz48L3N2Zz4=); */
      }

      /* Exclamation mark */
      .question-container:has(.location-input.is-invalid) .num-label:after,
      :has(.select:disabled:not(.transition)) .num-label::after {
        border: 3px solid lightgray !important;
        /* Invalid */
        background-color: rgb(243, 243, 243);
        background-image: none !important;
        /* background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJkYXJrZ3JheSIgb3BhY2l0eT0iLjMiIGQ9Ik0wIDI1NmEyNTYgMjU2IDAgMSAwIDUxMiAwQTI1NiAyNTYgMCAxIDAgMCAyNTZ6TTIzMiAxMjhsNDggMCAwIDI0IDAgMTEyIDAgMjQtNDggMCAwLTI0IDAtMTEyIDAtMjR6bTAgMTkybDQ4IDAgMCA0OC00OCAwIDAtNDh6Ii8+PHBhdGggZmlsbD0iZGFya2dyYXkiIGQ9Ik0yODAgMTUybDAtMjQtNDggMCAwIDI0IDAgMTEyIDAgMjQgNDggMCAwLTI0IDAtMTEyem0wIDE2OGwtNDggMCAwIDQ4IDQ4IDAgMC00OHoiLz48L3N2Zz4=) !important; */
      }

      /* X mark */
      .question-container:has(.location-input.is-error) .num-label:after,
      :has(.select.error) .num-label::after {
        border: 3px solid darkred !important;
        /* Error */
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJyZWQiIG9wYWNpdHk9Ii40IiBkPSJNMCAyNTZhMjU2IDI1NiAwIDEgMCA1MTIgMEEyNTYgMjU2IDAgMSAwIDAgMjU2em0xNTguMS02NGMxMS4zLTExLjMgMjIuNi0yMi42IDMzLjktMzMuOWM1LjcgNS43IDExLjMgMTEuMyAxNyAxN2MxNS43IDE1LjcgMzEuMyAzMS4zIDQ3IDQ3YzE1LjctMTUuNyAzMS4zLTMxLjMgNDctNDdjNS43LTUuNyAxMS4zLTExLjMgMTctMTdjMTEuMyAxMS4zIDIyLjYgMjIuNiAzMy45IDMzLjljLTUuNyA1LjctMTEuMyAxMS4zLTE3IDE3Yy0xNS43IDE1LjctMzEuMyAzMS4zLTQ3IDQ3YzE1LjcgMTUuNyAzMS40IDMxLjQgNDcgNDdjNS43IDUuNyAxMS4zIDExLjMgMTcgMTdMMzIwIDM1My45bC0xNy0xNy00Ny00N2MtMTUuNyAxNS43LTMxLjMgMzEuMy00NyA0N2MtNS43IDUuNy0xMS4zIDExLjMtMTcgMTdjLTExLjMtMTEuMy0yMi42LTIyLjYtMzMuOS0zMy45YzUuNy01LjcgMTEuMy0xMS4zIDE3LTE3YzE1LjctMTUuNyAzMS40LTMxLjQgNDctNDdjLTE1LjctMTUuNy0zMS4zLTMxLjMtNDctNDdjLTUuNy01LjctMTEuMy0xMS4zLTE3LTE3eiIvPjxwYXRoIGZpbGw9ImRhcmtyZWQiIGQ9Ik0zMzcgMjA5bDE3LTE3TDMyMCAxNTguMWwtMTcgMTctNDcgNDctNDctNDctMTctMTdMMTU4LjEgMTkybDE3IDE3IDQ3IDQ3LTQ3IDQ3LTE3IDE3TDE5MiAzNTMuOWwxNy0xNyA0Ny00NyA0NyA0NyAxNyAxN0wzNTMuOSAzMjBsLTE3LTE3LTQ3LTQ3IDQ3LTQ3eiIvPjwvc3ZnPg==) !important;
      }

      gap: 0;
      grid-template-columns: 1fr;

      @container filter (width < 680px) {
        grid-template-columns: 1fr;
      }

      :is(a).icon-definition.icon-definition,
      :is(a).icon-definition.icon-definition * {
        color: var(--wp--preset--color--primary-brand);
        text-decoration-style: dashed;
        text-decoration-color: var(--wp--preset--color--primary-brand);
        display: inline;
        font-size: 0.85rem;
      }

      .control {
        justify-content: start;
        margin-block: 0;
        gap: .5rem;
        padding-block-end: 3rem;


        :is(label) {
          text-wrap: wrap;

          @supports (text-wrap: pretty) {
            text-wrap: pretty;
          }

          &::before {
            counter-increment: question;
            content: counter(question) '.';
            display: inline-block;
            margin-right: 0.5rem;
          }
        }

        .select {
          max-width: fit-content;
          font-weight: normal;

          background-color: #fff;
          border: 2px solid transparent;

          &.error {
            /* background-color: #ffe5e5; */
            color: darkred;
            outline-color: darkred !important;
          }

          &:disabled {
            color: rgb(243, 243, 243) !important;
            background-color: rgb(243, 243, 243);
          }

          &:is(:focus-visible, :focus) {
            border: 2px solid #369 !important;
            outline: 2px solid darkred !important;
          }
        }

        :is(figcaption) {
          padding: 0;
        }

        .location-input {
          border: 0;
          border-radius: .4375rem;
          color: #369;
          font-size: 1rem;
          margin-block: .25rem;
          padding: .5rem;
          outline-offset: 2px;
          outline: 2px solid var(--wp--preset--color--custom-info-border)
        }

        .location-input:invalid {
          outline-color: #8b0000;
          background-color: #ffe5e5
        }

        .location-input:is(:focus-visible) {
          outline-color: var(--wp--preset--color--primary-brand)
        }

        .location-input {
          border: 2px solid transparent;
          border-radius: .4375rem;
          color: #369;
          font-size: 1rem;
          margin-block: .25rem;
          padding: .5rem;
          outline-offset: 2px;
          outline: 2px solid var(--wp--preset--color--custom-info-border);
          background-color: #fff;
          max-width: 320px;
        }

        .location-input::-webkit-list-button,
        .location-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          filter: size(0);
        }

        .location-input:is(:focus, :focus-visible) {
          border: 2px solid #369 !important;
        }

        .location-input.is-empty {
          outline-color: var(--wp--preset--color--custom-info-border, #bfdfe7);
          background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBvcGFjaXR5PSIxIiBkPSJNMCAyNTZhMjU2IDI1NiAwIDEgMCA1MTIgMEEyNTYgMjU2IDAgMSAwIDAgMjU2em0xNjgtNzJjMC0uNSAwLTEgMCAwem02NCAxNTJsNDggMGMwIDE2IDAgMzIgMCA0OGwtNDggMGMwLTE2IDAtMzIgMC00OHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjI0IDEyOGMtMzAuOSAwLTU2IDI1LjEtNTYgNTZsMCA2LjUgNDggMCAwLTYuNWMwLTQuNCAzLjYtOCA4LThsNTYuOSAwYzguNCAwIDE1LjEgNi44IDE1LjEgMTUuMWMwIDUuNC0yLjkgMTAuNC03LjYgMTMuMWwtNDQuMyAyNS40TDIzMiAyMzYuNmwwIDEzLjkgMCAyMS41IDAgMjQgNDggMCAwLTI0IDAtNy42IDMyLjMtMTguNWMxOS42LTExLjMgMzEuNy0zMi4yIDMxLjctNTQuOGMwLTM0LjktMjguMy02My4xLTYzLjEtNjMuMUwyMjQgMTI4em01NiAyMDhsLTQ4IDAgMCA0OCA0OCAwIDAtNDh6Ii8+PC9zdmc+);
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.25rem
        }

        .location-input.is-valid {
          outline-color: var(--wp--preset--color--custom-success-border, green);
          background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJsaW1lZ3JlZW4iICBvcGFjaXR5PSIuMyIgZD0iTTAgMjU2YTI1NiAyNTYgMCAxIDAgNTEyIDBBMjU2IDI1NiAwIDEgMCAwIDI1NnptMTI2LjEgMEwxNjAgMjIyLjFjLjMgLjMgLjYgLjYgMSAxYzUuMyA1LjMgMTAuNyAxMC43IDE2IDE2YzE1LjcgMTUuNyAzMS40IDMxLjQgNDcgNDdjMzctMzcgNzQtNzQgMTExLTExMWM1LjMtNS4zIDEwLjctMTAuNyAxNi0xNmMuMy0uMyAuNi0uNiAxLTFMMzg1LjkgMTkyYy0uMyAuMy0uNiAuNi0xIDFsLTE2IDE2TDI0MSAzMzdsLTE3IDE3LTE3LTE3LTY0LTY0Yy01LjMtNS4zLTEwLjctMTAuNy0xNi0xNmwtMS0xeiIvPjxwYXRoIGZpbGw9ImRhcmtncmVlbiIgZD0iTTM4NSAxOTNMMjQxIDMzN2wtMTcgMTctMTctMTctODAtODBMMTYxIDIyM2w2MyA2M0wzNTEgMTU5IDM4NSAxOTN6Ii8+PC9zdmc+);
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.25rem
        }

        .location-input.is-invalid {
          outline-color: darkgray;
          background-color: #fafafa;
          background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJkYXJrZ3JheSIgb3BhY2l0eT0iLjMiIGQ9Ik0wIDI1NmEyNTYgMjU2IDAgMSAwIDUxMiAwQTI1NiAyNTYgMCAxIDAgMCAyNTZ6TTIzMiAxMjhsNDggMCAwIDI0IDAgMTEyIDAgMjQtNDggMCAwLTI0IDAtMTEyIDAtMjR6bTAgMTkybDQ4IDAgMCA0OC00OCAwIDAtNDh6Ii8+PHBhdGggZmlsbD0iZGFya2dyYXkiIGQ9Ik0yODAgMTUybDAtMjQtNDggMCAwIDI0IDAgMTEyIDAgMjQgNDggMCAwLTI0IDAtMTEyem0wIDE2OGwtNDggMCAwIDQ4IDQ4IDAgMC00OHoiLz48L3N2Zz4=);
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.25rem
        }

        .location-input.is-error {
          outline-color: #8b0000;
          background-color: #ffe5e5;
          background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJyZWQiIG9wYWNpdHk9Ii40IiBkPSJNMCAyNTZhMjU2IDI1NiAwIDEgMCA1MTIgMEEyNTYgMjU2IDAgMSAwIDAgMjU2em0xNTguMS02NGMxMS4zLTExLjMgMjIuNi0yMi42IDMzLjktMzMuOWM1LjcgNS43IDExLjMgMTEuMyAxNyAxN2MxNS43IDE1LjcgMzEuMyAzMS4zIDQ3IDQ3YzE1LjctMTUuNyAzMS4zLTMxLjMgNDctNDdjNS43LTUuNyAxMS4zLTExLjMgMTctMTdjMTEuMyAxMS4zIDIyLjYgMjIuNiAzMy45IDMzLjljLTUuNyA1LjctMTEuMyAxMS4zLTE3IDE3Yy0xNS43IDE1LjctMzEuMyAzMS4zLTQ3IDQ3YzE1LjcgMTUuNyAzMS40IDMxLjQgNDcgNDdjNS43IDUuNyAxMS4zIDExLjMgMTcgMTdMMzIwIDM1My45bC0xNy0xNy00Ny00N2MtMTUuNyAxNS43LTMxLjMgMzEuMy00NyA0N2MtNS43IDUuNy0xMS4zIDExLjMtMTcgMTdjLTExLjMtMTEuMy0yMi42LTIyLjYtMzMuOS0zMy45YzUuNy01LjcgMTEuMy0xMS4zIDE3LTE3YzE1LjctMTUuNyAzMS40LTMxLjQgNDctNDdjLTE1LjctMTUuNy0zMS4zLTMxLjMtNDctNDdjLTUuNy01LjctMTEuMy0xMS4zLTE3LTE3eiIvPjxwYXRoIGZpbGw9ImRhcmtyZWQiIGQ9Ik0zMzcgMjA5bDE3LTE3TDMyMCAxNTguMWwtMTcgMTctNDcgNDctNDctNDctMTctMTdMMTU4LjEgMTkybDE3IDE3IDQ3IDQ3LTQ3IDQ3LTE3IDE3TDE5MiAzNTMuOWwxNy0xNyA0Ny00NyA0NyA0NyAxNyAxN0wzNTMuOSAzMjBsLTE3LTE3LTQ3LTQ3IDQ3LTQ3eiIvPjwvc3ZnPg==);
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.25rem
        }

      }
    }

    @container filter (width < 400px) {
      grid-template-columns: 1fr;
    }

    .control {
      display: grid;
      justify-content: stretch;
      gap: 0.5rem;
      margin-bottom: 0;
      

      &.instruction-group {
        margin-block-start: 1rem;
        height: fit-content;
        align-self: end;
        text-align: center;
        grid-column: 1 / -1;
        grid-template-columns: 1fr 11rem;
        gap: 1rem;

        :is(label) {
          margin-block-start: 0;
        }

        > div {
          /* border: 1px solid rgba(33, 66, 99, 0.15);
          border-radius: 0.25rem;
          background-color: rgba(71, 141, 211, 0.05); */
          padding: 0.25rem 0;
          display: grid;
          justify-content: start;
          align-content: center;
        }
      }

      &.editable {
        color: #369;
        background-color: var(--wp--preset--color--white);
        outline: 2px solid var(--wp--preset--color--primary-brand);
        outline-offset: 2px;
        padding: 0.5rem;
        border-radius: 0.5rem;
        position: relative;

        & label {
          color: #369;
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
          filter: var(--blue-filter);

          &[disabled] {
            opacity: 0.25;
          }
        }

        & .close-btn::before {
          /* X icon */
          content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjU2IDQ4YTIwOCAyMDggMCAxIDEgMCA0MTYgMjA4IDIwOCAwIDEgMSAwLTQxNnptMCA0NjRBMjU2IDI1NiAwIDEgMCAyNTYgMGEyNTYgMjU2IDAgMSAwIDAgNTEyek0xNzUgMTc1Yy05LjQgOS40LTkuNCAyNC42IDAgMzMuOWw0NyA0Ny00NyA0N2MtOS40IDkuNC05LjQgMjQuNiAwIDMzLjlzMjQuNiA5LjQgMzMuOSAwbDQ3LTQ3IDQ3IDQ3YzkuNCA5LjQgMjQuNiA5LjQgMzMuOSAwczkuNC0yNC42IDAtMzMuOWwtNDctNDcgNDctNDdjOS40LTkuNCA5LjQtMjQuNiAwLTMzLjlzLTI0LjYtOS40LTMzLjkgMGwtNDcgNDctNDctNDdjLTkuNC05LjQtMjQuNi05LjQtMzMuOSAweiIvPjwvc3ZnPg==);
          width: 1.25rem;
          height: 1.25rem;
          display: inline-block;
          position: absolute;
          right: 0.15rem;
          top: 3px;
        }

        &:has(select:disabled) .close-btn::before {
          /* X + lock icons */
          content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjU2IDQ4YTIwOCAyMDggMCAxIDEgMCA0MTYgMjA4IDIwOCAwIDEgMSAwLTQxNnptMCA0NjRBMjU2IDI1NiAwIDEgMCAyNTYgMGEyNTYgMjU2IDAgMSAwIDAgNTEyek0xNzUgMTc1Yy05LjQgOS40LTkuNCAyNC42IDAgMzMuOWw0NyA0Ny00NyA0N2MtOS40IDkuNC05LjQgMjQuNiAwIDMzLjlzMjQuNiA5LjQgMzMuOSAwbDQ3LTQ3IDQ3IDQ3YzkuNCA5LjQgMjQuNiA5LjQgMzMuOSAwczkuNC0yNC42IDAtMzMuOWwtNDctNDcgNDctNDdjOS40LTkuNCA5LjQtMjQuNiAwLTMzLjlzLTI0LjYtOS40LTMzLjkgMGwtNDcgNDctNDctNDdjLTkuNC05LjQtMjQuNi05LjQtMzMuOSAweiIvPjwvc3ZnPg==) url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuNCIgZD0iTTMyIDI3MmMwLTI2LjUgMjEuNS00OCA0OC00OGwyODggMGMyNi41IDAgNDggMjEuNSA0OCA0OGwwIDE2MGMwIDI2LjUtMjEuNSA0OC00OCA0OEw4MCA0ODBjLTI2LjUgMC00OC0yMS41LTQ4LTQ4bDAtMTYweiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMjggMTI4bDAgNjQgMTkyIDAgMC02NGMwLTUzLTQzLTk2LTk2LTk2cy05NiA0My05NiA5NnpNOTYgMTkybDAtNjRDOTYgNTcuMyAxNTMuMyAwIDIyNCAwczEyOCA1Ny4zIDEyOCAxMjhsMCA2NCAxNiAwYzQ0LjIgMCA4MCAzNS44IDgwIDgwbDAgMTYwYzAgNDQuMi0zNS44IDgwLTgwIDgwTDgwIDUxMmMtNDQuMiAwLTgwLTM1LjgtODAtODBMMCAyNzJjMC00NC4yIDM1LjgtODAgODAtODBsMTYgMHpNMzIgMjcybDAgMTYwYzAgMjYuNSAyMS41IDQ4IDQ4IDQ4bDI4OCAwYzI2LjUgMCA0OC0yMS41IDQ4LTQ4bDAtMTYwYzAtMjYuNS0yMS41LTQ4LTQ4LTQ4TDgwIDIyNGMtMjYuNSAwLTQ4IDIxLjUtNDggNDh6Ii8+PC9zdmc+);
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

      :is(select) {
        -webkit-appearance: unset;
        appearance: unset;
      }

      .select {
        color: #369;
        font-size: 1rem;
        margin-block: 0.25rem;
        padding: .5rem 2.5rem .5rem .5rem;
        outline-offset: 2px;
        /* outline: 2px solid var(--wp--preset--color--custom-info-border); */
        outline: 1px solid #369;
        /* down arrow */
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBkPSJNMjM5IDQ5OC43bDE2MC0xMjggMTguNy0xNS0zMC0zNy41LTE4LjcgMTUtMTQ1IDExNkw3OSAzMzMuM2wtMTguNy0xNS0zMCAzNy41IDE4LjcgMTUgMTYwIDEyOCAxNSAxMiAxNS0xMnptMC00ODUuNWwtMTUtMTItMTUgMTJMNDkgMTQxLjNsLTE4LjcgMTUgMzAgMzcuNSAxOC43LTE1IDE0NS0xMTYgMTQ1IDExNiAxOC43IDE1IDMwLTM3LjUtMTguNy0xNUwyMzkgMTMuM3oiLz48L3N2Zz4=);
        background-repeat: no-repeat;
        background-position: right .65rem center;
        background-size: 0.85rem;

        &:is(:focus-visible, :focus) {
          outline: 3px solid #369 !important;
        }

        &:has(option[data-default="Select an option"]:checked) {
          outline: 2px solid #bfdfe7;
        }

        &:disabled:not(.transition) {
          color: #fff;
          outline: 2px solid lightgray !important;
          background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSJsaWdodGdyYXkiIGQ9Ik0yMzkgNDk4LjdsMTYwLTEyOCAxOC43LTE1LTMwLTM3LjUtMTguNyAxNS0xNDUgMTE2TDc5IDMzMy4zbC0xOC43LTE1LTMwIDM3LjUgMTguNyAxNSAxNjAgMTI4IDE1IDEyIDE1LTEyem0wLTQ4NS41bC0xNS0xMi0xNSAxMkw0OSAxNDEuM2wtMTguNyAxNSAzMCAzNy41IDE4LjctMTUgMTQ1LTExNiAxNDUgMTE2IDE4LjcgMTUgMzAtMzcuNS0xOC43LTE1TDIzOSAxMy4zeiIvPjwvc3ZnPg==) !important;
        }
      }
    }
  }

  .clear-msg {
    margin-inline-start: 2.5rem;
    margin-block-start: -2.75rem;
    font-size: 0.85rem;

    :is(a) {
      font-size: 0.85rem;
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
    padding: 0;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: 4fr 1fr;
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

  #rebatesResults {
    container-type: inline-size;
    container-name: results;

    :is(a) {
      height: 100%;
    }
  }

  .info-card {
    /* box-shadow: 0 0 .5rem rgb(0 0 0 / 0.3); */
    border-radius: 0.5rem;
    padding: 0;

    .info-card-content {
      padding: 1rem 1rem 0;
    }

    .wp-block-image {
      padding: 0;
      margin: 0;

      :is(img) {
        aspect-ratio: 3/2;
        object-fit: cover;
        margin-block: 0.5rem;
      }
    }

    :is(h3) {
      font-size: 1.25rem;
    }

    :is(p) {
      font-size: 0.9rem;
    }
  }

  .results-message {
    margin-block-end: 2rem;
    display: flex;
    align-items: flex-end;

    :is(div):first-child {
      flex: 1;
    }

    :is(h2) {
      &::before {
        content: "";
        display: block;
        background-color: var(--wp--preset--color--heading-line);
        border-top-width: 3rem;
        margin-block-end: 1rem;
        height: 3px;
        width: 3rem;
      }

      margin-block-end: 0;
    }
  }

  .results {

    display: grid;
    gap: 2rem;
    margin-top: 0.5rem;

    grid-template-columns: 1fr;

    &.no-results {
      grid-template-columns: repeat(3, 1fr);

      .rebate-card {
        grid-column: 2;
      }
    }

    @container (width > 601px) {
      grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    }

    &.list-view {
      grid-template-columns: 1fr;
    }
  }

  .rebate-card {
    isolation: isolate;
    background-color: #fff;
    box-shadow: 0 0 3px rgb(0 0 0 / 0.2), 0 0 6px rgb(0 0 0 / 0.1);
    border-radius: 0.5rem;
    padding: 0;
    overflow: clip;

    *,
    *:is(:hover, :focus-visible) {
      text-decoration: none;
    }

    .wp-block-image img {
      border-bottom: 3px solid #fff;
      aspect-ratio: 3/2;
      object-fit: cover;
    }

    &:has(a:is(:hover, :focus-visible)) {
      outline: 3px solid #369;
      outline-offset: 2px;
      box-shadow: inset 0 0 3px rgb(0 0 0 / 0.2), 0 0 6px rgb(0 0 0 / 0.1);
    }
  }

  .results.list-view {

    @container (width > 500px) {
      .rebate-card :is(a) {
        min-height: 200px;
        width: 100%;
        display: grid;
        gap: 1rem;

        .rebate-details-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .rebate-value {
          position: absolute;
          left: auto;
          right: -1rem;
          top: 0;
          z-index: 1;
          outline: none;
          border-radius: 0 0 0 0.5rem;
          padding-block: 0.25rem;
        }

        .wp-block-image {
          margin: -4px;
          max-width: 20%;
          min-width: 230px;
          order: -1;
          z-index: 0;

          :is(img) {
            max-width: 100%;
            height: 100%;
            aspect-ratio: 0.66;
          }
        }

        .rebate-icons {
          position: absolute;
          bottom: 5rem;
          top: auto;
          z-index: 1;
        }

        grid-template-columns: minmax(230px, 20%) 1fr;
      }

      .info-card {
        .wp-block-image {
          max-width: 30%;
        }
      }
    }

    @container (width > 700px) {
      .rebate-card :is(a) {
        .wp-block-image :is(img) {
          aspect-ratio: 1;
        }
      }
    }

  }

  .rebate-title {
    font-size: 1.35rem;
    padding: 0 1rem;
    margin: 1.5rem 0 0.5rem;

    :is(small) {
      display: inline-block;
      font-size: 1rem;
      line-height: 1.5;
      margin-block-start: 0.5rem;
    }
  }

  .rebate-details {
    padding: 0 1rem 1rem;
  }

  a:is(:hover) .rebate-details.rebate-details .rebate-description.rebate-description * {
    text-decoration: none !important;
  }

  .rebate-icons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-block-start: 0rem;
    position: relative;
    z-index: 1;
    gap: 0.15rem;
    margin-inline-start: 1rem;
    top: -3.25rem;
    bottom: auto;
    z-index: 9;
    width: 100%;
    max-width: 130px;
    margin-bottom: -4rem;
  }

  .rebate-icon {
    width: 3rem;
    height: 3rem;
    position: relative;
    margin-block-start: auto;

    &::after {
      content: "";
      background-color: #fff;
      background-size: 65%;
      background-repeat: no-repeat;
      background-position: center;
      box-shadow: 0 0 3px rgb(0 0 0 / 0.2), 0 0 6px rgb(0 0 0 / 0.1), 0 0 9px rgb(0 0 0 / 0.05);
      border-radius: 50%;
      /* electric */
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tZWxlY3RyaWMtLT48cGF0aCBmaWxsPSIjMzY5IiAgZD0iTTI1NiA1MTJjNzMuNyAwIDE0MC4xLTMxLjEgMTg2LjgtODFsNy41LTE1TDQzMiA0MTZjLTIwLjQgMC0zOC41LTEyLjktNDUuMy0zMi4xcy0uNi00MC42IDE1LjMtNTMuNGwxMDkuNi04Ny43QzUwNC44IDEwNy41IDM5MyAwIDI1NiAwQzExNC42IDAgMCAxMTQuNiAwIDI1NlMxMTQuNiA1MTIgMjU2IDUxMnpNMTkyIDE2MGwwIDMyYzAgMTcuNy0xNC4zIDMyLTMyIDMycy0zMi0xNC4zLTMyLTMybDAtMzJjMC0xNy43IDE0LjMtMzIgMzItMzJzMzIgMTQuMyAzMiAzMnptOTYgMGwwIDMyYzAgMTcuNy0xNC4zIDMyLTMyIDMycy0zMi0xNC4zLTMyLTMybDAtMzJjMC0xNy43IDE0LjMtMzIgMzItMzJzMzIgMTQuMyAzMiAzMnptOTYgMGwwIDMyYzAgMTcuNy0xNC4zIDMyLTMyIDMycy0zMi0xNC4zLTMyLTMybDAtMzJjMC0xNy43IDE0LjMtMzIgMzItMzJzMzIgMTQuMyAzMiAzMnptMjE4LjEgNjcuNmMtNS44LTQuNy0xNC4yLTQuNy0yMC4xLS4xbC0xNjAgMTI4Yy01LjMgNC4yLTcuNCAxMS40LTUuMSAxNy44czguMyAxMC43IDE1LjEgMTAuN2w3MC4xIDBMNDQ5LjcgNDg4LjhjLTMuNCA2LjctMS42IDE0LjkgNC4zIDE5LjZzMTQuMiA0LjcgMjAuMSAuMWwxNjAtMTI4YzUuMy00LjIgNy40LTExLjQgNS4xLTE3LjhzLTguMy0xMC43LTE1LjEtMTAuN2wtNzAuMSAwIDUyLjQtMTA0LjhjMy40LTYuNyAxLjYtMTQuOS00LjItMTkuNnoiLz48L3N2Zz4=);
      width: 3rem;
      height: 3rem;
      max-width: 90%;
      max-height: 90%;
      display: inline-block;
      position: absolute;
      top: 0.65rem;
    }

    &.gas::after {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tZ2FzIGZpcmUtLT48cGF0aCBmaWxsPSIjMzY5IiBkPSJNMzQ1LjcgNDguM0wzNTggMzQuNWM1LjQtNi4xIDEzLjMtOC44IDIwLjktOC45YzcuMiAwIDE0LjMgMi42IDE5LjkgNy44YzE5LjcgMTguMyAzOS44IDQzLjIgNTUgNzAuNkM0NjkgMTMxLjIgNDgwIDE2Mi4yIDQ4MCAxOTIuMkM0ODAgMjgwLjggNDA4LjcgMzUyIDMyMCAzNTJjLTg5LjYgMC0xNjAtNzEuMy0xNjAtMTU5LjhjMC0zNy4zIDE2LTczLjQgMzYuOC0xMDQuNWMyMC45LTMxLjMgNDcuNS01OSA3MC45LTgwLjJDMjczLjQgMi4zIDI4MC43LS4yIDI4OCAwYzE0LjEgLjMgMjMuOCAxMS40IDMyLjcgMjEuNmMwIDAgMCAwIDAgMGMyIDIuMyA0IDQuNiA2IDYuN2wxOSAxOS45ek0zODQgMjQwLjJjMC0zNi41LTM3LTczLTU0LjgtODguNGMtNS40LTQuNy0xMy4xLTQuNy0xOC41IDBDMjkzIDE2Ny4xIDI1NiAyMDMuNiAyNTYgMjQwLjJjMCAzNS4zIDI4LjcgNjQgNjQgNjRzNjQtMjguNyA2NC02NHpNMzIgMjg4YzAtMTcuNyAxNC4zLTMyIDMyLTMybDMyIDBjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjMgMzItMzIgMzJsMCA2NCA0NDggMCAwLTY0Yy0xNy43IDAtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMybDMyIDBjMTcuNyAwIDMyIDE0LjMgMzIgMzJsMCA5NmMxNy43IDAgMzIgMTQuMyAzMiAzMmwwIDY0YzAgMTcuNy0xNC4zIDMyLTMyIDMyTDMyIDUxMmMtMTcuNyAwLTMyLTE0LjMtMzItMzJsMC02NGMwLTE3LjcgMTQuMy0zMiAzMi0zMmwwLTk2ek0zMjAgNDgwYTMyIDMyIDAgMSAwIDAtNjQgMzIgMzIgMCAxIDAgMCA2NHptMTYwLTMyYTMyIDMyIDAgMSAwIC02NCAwIDMyIDMyIDAgMSAwIDY0IDB6TTE5MiA0ODBhMzIgMzIgMCAxIDAgMC02NCAzMiAzMiAwIDEgMCAwIDY0eiIvPjwvc3ZnPg==);
    }

    &.oil::after {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tb2lsIGZpcmUtLT48cGF0aCBmaWxsPSIjMzY5IiAgZD0iTTM3Mi41IDI1Ni41bC0uNy0xLjlDMzM3LjggMTYwLjggMjgyIDc2LjUgMjA5LjEgOC41bC0zLjMtM0MyMDIuMSAyIDE5Ny4xIDAgMTkyIDBzLTEwLjEgMi0xMy44IDUuNWwtMy4zIDNDMTAyIDc2LjUgNDYuMiAxNjAuOCAxMi4yIDI1NC42bC0uNyAxLjlDMy45IDI3Ny4zIDAgMjk5LjQgMCAzMjEuNkMwIDQyNi43IDg2LjggNTEyIDE5MiA1MTJzMTkyLTg1LjMgMTkyLTE5MC40YzAtMjIuMi0zLjktNDQuMi0xMS41LTY1LjF6TTE4OC44IDE0OC4zYzItMi43IDUuMi00LjMgOC41LTQuM2M1LjkgMCAxMC43IDQuOCAxMC43IDEwLjdsMCAxMS40YzAgOC45IDMuNiAxNy40IDkuOSAyMy42bDUxLjUgNTAuN0MyOTEuNSAyNjIuMiAzMDQgMjkyIDMwNCAzMjNjMCA2MC4yLTQ4LjggMTA5LTEwOSAxMDlsLTMgMGMtNjEuOSAwLTExMi01MC4xLTExMi0xMTJsMC04LjJjMC0yMS4yIDcuOC00MS42IDIxLjgtNTcuNGw2LjktNy44YzIuMS0yLjQgNS4xLTMuNyA4LjMtMy43YzYuMSAwIDExIDQuOSAxMSAxMWwwIDQ0YzAgMjQuMyAxOS44IDQ0IDQ0LjEgNDRjMjQuMiAwIDQzLjktMTkuNiA0My45LTQzLjhjMC0xMS42LTQuNi0yMi44LTEyLjgtMzFsLTEzLjItMTMuMmMtMTQtMTQtMjEuOS0zMy4xLTIxLjktNTNjMC0xNi4yIDUuMy0zMiAxNS00NC45bDUuOC03Ljh6Ii8+PC9zdmc+);
      background-size: 50%;
    }

    &.wood::after {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0td29vZCBmaXJlLS0+PHBhdGggZmlsbD0iIzM2OSIgZD0iTTI3OS4xIDQzLjlMMjYyLjEgMjUuOGMtMS44LTEuOS0zLjYtNC01LjQtNi4xYzAgMCAwIDAgMCAwQzI0OC42IDEwLjQgMjM5LjkgLjMgMjI3LjIgMGMtNi41LS4yLTEzLjEgMi4xLTE4LjMgNi44Yy0yMS4xIDE5LjItNDUgNDQuNC02My44IDcyLjljLTE4LjcgMjguMy0zMy4xIDYxLTMzLjEgOTVDMTEyIDI1NS4yIDE3NS40IDMyMCAyNTYgMzIwYzc5LjggMCAxNDQtNjQuNyAxNDQtMTQ1LjNjMC0yNy4zLTkuOS01NS40LTIzLjYtODAuMUMzNjIuNyA2OS43IDM0NC43IDQ3IDMyNi45IDMwLjRjLTUtNC43LTExLjUtNy4xLTE3LjktNy4xYy02LjggMC0xNCAyLjUtMTguOCA4LjFsLTExIDEyLjV6bTM2LjUgMTc0LjRjMCAzMi4xLTI2IDU4LjItNTguMiA1OC4ycy01OC4yLTI2LTU4LjItNTguMmMwLTMzLjIgMzMuNy02Ni40IDQ5LjgtODAuNGM0LjktNC4yIDExLjktNC4yIDE2LjggMGMxNi4xIDE0IDQ5LjggNDcuMiA0OS44IDgwLjR6TTQyLjggMjg5LjljLTE2LjYtNS45LTM1IDIuNy00MC45IDE5LjRzMi43IDM1IDE5LjQgNDAuOUwxNjAuOSA0MDAgMjEuMiA0NDkuOUM0LjYgNDU1LjgtNC4xIDQ3NC4xIDEuOSA0OTAuOHMyNC4zIDI1LjMgNDAuOSAxOS40TDI1NiA0MzRsMjEzLjIgNzYuMmMxNi42IDUuOSAzNS0yLjcgNDAuOS0xOS40cy0yLjctMzUtMTkuNC00MC45TDM1MS4xIDQwMGwxMzkuNi00OS45YzE2LjYtNS45IDI1LjMtMjQuMyAxOS40LTQwLjlzLTI0LjMtMjUuMy00MC45LTE5LjRMMjU2IDM2NiA0Mi44IDI4OS45eiIvPjwvc3ZnPg==);
    }
  }

  .rebate-value {
    background-color: #369;
    border-radius: 100vw;
    color: #fff;
    outline: 3px solid #fff;
    font-size: 1.1rem;
    font-weight: 600;
    position: relative;
    top: 1rem;
    margin-inline-start: auto;
    margin-inline-end: 1rem;
    margin-block-start: 0;
    margin-block-end: -2rem;
    padding: 0 1rem;
    width: fit-content;
    z-index: 1;
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

  .small-text {
    margin-block: 0.5rem .1rem;
  }

  .small-text,
  .small-text * {
    margin: 0;
    font-size: 0.85rem;
    color: #5a5a5a;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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

    &:disabled {
      pointer-events: none;

      &::after {
        /* lock icon */
        content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBvcGFjaXR5PSIuNCIgZD0iTTMyIDI3MmMwLTI2LjUgMjEuNS00OCA0OC00OGwyODggMGMyNi41IDAgNDggMjEuNSA0OCA0OGwwIDE2MGMwIDI2LjUtMjEuNSA0OC00OCA0OEw4MCA0ODBjLTI2LjUgMC00OC0yMS41LTQ4LTQ4bDAtMTYweiIvPjxwYXRoIGZpbGw9IiMzNjkiIGQ9Ik0xMjggMTI4bDAgNjQgMTkyIDAgMC02NGMwLTUzLTQzLTk2LTk2LTk2cy05NiA0My05NiA5NnpNOTYgMTkybDAtNjRDOTYgNTcuMyAxNTMuMyAwIDIyNCAwczEyOCA1Ny4zIDEyOCAxMjhsMCA2NCAxNiAwYzQ0LjIgMCA4MCAzNS44IDgwIDgwbDAgMTYwYzAgNDQuMi0zNS44IDgwLTgwIDgwTDgwIDUxMmMtNDQuMiAwLTgwLTM1LjgtODAtODBMMCAyNzJjMC00NC4yIDM1LjgtODAgODAtODBsMTYgMHpNMzIgMjcybDAgMTYwYzAgMjYuNSAyMS41IDQ4IDQ4IDQ4bDI4OCAwYzI2LjUgMCA0OC0yMS41IDQ4LTQ4bDAtMTYwYzAtMjYuNS0yMS41LTQ4LTQ4LTQ4TDgwIDIyNGMtMjYuNSAwLTQ4IDIxLjUtNDggNDh6Ii8+PC9zdmc+);
      }
    }

    &:is(:hover, :focus, :focus-visible)::after {
      content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNOTQgMTg3LjFDMTIwLjggMTI0LjEgMTgzLjMgODAgMjU2IDgwYzM5LjcgMCA3Ny44IDE1LjggMTA1LjkgNDMuOUw0MTQuMSAxNzYgMzYwIDE3NmMtMTMuMyAwLTI0IDEwLjctMjQgMjRzMTAuNyAyNCAyNCAyNGwxMTIgMGMxMy4zIDAgMjQtMTAuNyAyNC0yNGwwLTExMmMwLTEzLjMtMTAuNy0yNC0yNC0yNHMtMjQgMTAuNy0yNCAyNGwwIDU0LjFMMzk1LjkgODkuOUMzNTguOCA1Mi44IDMwOC41IDMyIDI1NiAzMkMxNjMuNCAzMiA4My45IDg4LjIgNDkuOCAxNjguM2MtNS4yIDEyLjIgLjUgMjYuMyAxMi43IDMxLjVzMjYuMy0uNSAzMS41LTEyLjd6bTM2OCAxNTdjNS4yLTEyLjItLjQtMjYuMy0xMi42LTMxLjVzLTI2LjMgLjQtMzEuNSAxMi42QzM5MSAzODguMSAzMjguNiA0MzIgMjU2IDQzMmMtMzkuNyAwLTc3LjgtMTUuOC0xMDUuOS00My45TDk3LjkgMzM2bDU0LjEgMGMxMy4zIDAgMjQtMTAuNyAyNC0yNHMtMTAuNy0yNC0yNC0yNEw0MCAyODhjLTEzLjMgMC0yNCAxMC43LTI0IDI0bDAgMTEyYzAgMTMuMyAxMC43IDI0IDI0IDI0czI0LTEwLjcgMjQtMjRsMC01NC4xIDUyLjEgNTIuMUMxNTMuMiA0NTkuMiAyMDMuNSA0ODAgMjU2IDQ4MGM5Mi41IDAgMTcxLjgtNTYgMjA2LTEzNS45eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=);
    }
  }
}

#rebateFilterApp[data-mode="archive"] {

  .control-container {
    padding: 0 0 1rem;
  }

  .loader {
    display: grid;
    height: 75px;
    place-items: center;
    background-color: #727272;
    box-shadow: 0 0 3px rgb(0 0 0 / 0.2), 0 0 6px rgb(0 0 0 / 0.1);
    border: 1px solid #666;
    border-radius: .66rem;
    font-size: 1.125rem;
    color: #fff;
  }
}

#rebateFilterApp[data-mode="single"] .loader {
  height: 3.75rem;
  display: grid;
  place-items: center;
  background-color: #fff;
  box-shadow: 0 0 3px rgb(0 0 0 / 0.2), 0 0 6px rgb(0 0 0 / 0.1);
  border: 0;
  border-radius: .66rem;
  font-size: 0.85rem;
  color: #fff;
}

#rebateFilterApp[data-mode="single"] select,
#rebateFilterApp[data-mode="single"] .select {
  overflow: clip;
}

#rebateFilterApp[data-mode="single"] #rebatesFilterControls .selection-summary {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.rebate-setting.is-external-dirty::after {
  animation: spin1440 4s linear;
}

@keyframes spin1440 {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(4turn);
  }
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
  /* background-color: hsl(210, 100%, 96%);
  transition: all ease-in-out .3s; */
}

#rebateFilterApp:not([data-mode="archive"]) #rebatesFilterControls .editBtn {
  width: 100%;
  min-width: 10rem;
  padding: 0 0.66rem 0 0;
  height: 1rem;
  background-color: #fff;
  outline: 0 !important;
  color: #369;
  display: flex;
  justify-content: end;
  align-items: center;
  border-radius: 0.25rem;
  transition: all ease-in-out .3s;
  border: 1px solid hsl(210, 94%, 86%) !important;

  :is(span) {
    font-size: 0.85rem;
    display: inline-block;
    text-align: right;
    padding-inline-end: 1rem;
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
    width: 100%;
    background-color: var(--wp--preset--color--primary-brand);
    text-align: center;
  }

  &.saving :is(span) {
    color: var(--wp--preset--color--white);
    text-align: right;
    text-align: center;
  }

  &::after {
    content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSIjOWY5ZDljIiBkPSJNMzguOCA1LjFDMjguNC0zLjEgMTMuMy0xLjIgNS4xIDkuMlMtMS4yIDM0LjcgOS4yIDQyLjlsNTkyIDQ2NGMxMC40IDguMiAyNS41IDYuMyAzMy43LTQuMXM2LjMtMjUuNS00LjEtMzMuN0w1MjUuNiAzODYuN2MzOS42LTQwLjYgNjYuNC04Ni4xIDc5LjktMTE4LjRjMy4zLTcuOSAzLjMtMTYuNyAwLTI0LjZjLTE0LjktMzUuNy00Ni4yLTg3LjctOTMtMTMxLjFDNDY1LjUgNjguOCA0MDAuOCAzMiAzMjAgMzJjLTY4LjIgMC0xMjUgMjYuMy0xNjkuMyA2MC44TDM4LjggNS4xem0xNTEgMTE4LjNDMjI2IDk3LjcgMjY5LjUgODAgMzIwIDgwYzY1LjIgMCAxMTguOCAyOS42IDE1OS45IDY3LjdDNTE4LjQgMTgzLjUgNTQ1IDIyNiA1NTguNiAyNTZjLTEyLjYgMjgtMzYuNiA2Ni44LTcwLjkgMTAwLjlsLTUzLjgtNDIuMmM5LjEtMTcuNiAxNC4yLTM3LjUgMTQuMi01OC43YzAtNzAuNy01Ny4zLTEyOC0xMjgtMTI4Yy0zMi4yIDAtNjEuNyAxMS45LTg0LjIgMzEuNWwtNDYuMS0zNi4xek0zOTQuOSAyODQuMmwtODEuNS02My45YzQuMi04LjUgNi42LTE4LjIgNi42LTI4LjNjMC01LjUtLjctMTAuOS0yLTE2Yy43IDAgMS4zIDAgMiAwYzQ0LjIgMCA4MCAzNS44IDgwIDgwYzAgOS45LTEuOCAxOS40LTUuMSAyOC4yem05LjQgMTMwLjNDMzc4LjggNDI1LjQgMzUwLjcgNDMyIDMyMCA0MzJjLTY1LjIgMC0xMTguOC0yOS42LTE1OS45LTY3LjdDMTIxLjYgMzI4LjUgOTUgMjg2IDgxLjQgMjU2YzguMy0xOC40IDIxLjUtNDEuNSAzOS40LTY0LjhMODMuMSAxNjEuNUM2MC4zIDE5MS4yIDQ0IDIyMC44IDM0LjUgMjQzLjdjLTMuMyA3LjktMy4zIDE2LjcgMCAyNC42YzE0LjkgMzUuNyA0Ni4yIDg3LjcgOTMgMTMxLjFDMTc0LjUgNDQzLjIgMjM5LjIgNDgwIDMyMCA0ODBjNDcuOCAwIDg5LjktMTIuOSAxMjYuMi0zMi41bC00MS45LTMzek0xOTIgMjU2YzAgNzAuNyA1Ny4zIDEyOCAxMjggMTI4YzEzLjMgMCAyNi4xLTIgMzguMi01LjhMMzAyIDMzNGMtMjMuNS01LjQtNDMuMS0yMS4yLTUzLjctNDIuM2wtNTYuMS00NC4yYy0uMiAyLjgtLjMgNS42LS4zIDguNXoiLz48L3N2Zz4=);
    display: inline-block;
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
.error-message:before {
  content:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMSIgZD0iTTQ4IDI1NmEyMDggMjA4IDAgMSAwIDQxNiAwQTIwOCAyMDggMCAxIDAgNDggMjU2em0xMTAuMS02NEwxOTIgMTU4LjFsMTcgMTcgNDcgNDcgNDctNDcgMTctMTdMMzUzLjkgMTkybC0xNyAxNy00NyA0NyA0NyA0NyAxNyAxN0wzMjAgMzUzLjlsLTE3LTE3LTQ3LTQ3LTQ3IDQ3LTE3IDE3TDE1OC4xIDMyMGwxNy0xNyA0Ny00Ny00Ny00Ny0xNy0xN3oiLz48cGF0aCBmaWxsPSJkYXJrcmVkIiBkPSJNMjU2IDQ4YTIwOCAyMDggMCAxIDEgMCA0MTYgMjA4IDIwOCAwIDEgMSAwLTQxNnptMCA0NjRBMjU2IDI1NiAwIDEgMCAyNTYgMGEyNTYgMjU2IDAgMSAwIDAgNTEyem05Ny45LTMyMEwzMjAgMTU4LjFsLTE3IDE3LTQ3IDQ3LTQ3LTQ3LTE3LTE3TDE1OC4xIDE5MmwxNyAxNyA0NyA0Ny00NyA0Ny0xNyAxN0wxOTIgMzUzLjlsMTctMTcgNDctNDcgNDcgNDcgMTcgMTdMMzUzLjkgMzIwbC0xNy0xNy00Ny00NyA0Ny00NyAxNy0xN3oiLz48L3N2Zz4=);
  display:inline-block;
  height:1rem;
  width:1rem;
  position:absolute;
  top:0.66rem;
  left:0.5rem;
  pointer-events:none
}
.message {
  background:#fff7e5;
  border:1px solid transparent;
  color:#8b0000;
  padding:0.5rem 0;
  border-radius:.5rem;
  font-weight:500;
  font-size:1rem!important
}
.error-message {
  background:#ffe5e5;
  outline:2px solid darkred;
  outline-offset: 2px;
  padding-inline:2rem 1rem;
  position:relative;
}
</style>
<style>
body.betterhomesbc #dialog .dialog-content h2 {
  border-bottom: 3px solid var(--wp--preset--color--primary-brand);
  color: var(--wp--preset--color--primary-brand);
  margin-bottom: 1rem;
}

.template {
  display: none;
}

.message {
  background: #fff7e5;
  border: 1px solid #facc15;
  color: darkred;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 1rem !important;

  &.tool-message {
    padding: 0.5rem 1rem 1rem;

    &::before {
      top: 0.8rem;
      margin-right: 0.5rem;
    }
  }

  :is(p) {
    margin: 0;
  }

  :is(span) {
    color: #440000 !important;
    font-weight: 700;
  }
}

.error-message {
  background: #ffe5e5;
  border: 2px solid darkred;
  padding-inline: 0.5rem !important;
  position: relative;

  &::before {
    content: "" !important;
    display: none !important;
  }
}

.p-2 {
  padding: 2rem;
}

.not-eligible .warning-message {
  padding: 2rem;
}

.warning-message {
  background: #fff7e5;
  border: 1px solid #facc15;
}

.warning-message .has-icon::before {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyNCAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1LjcxOTYgMi4zNTY4N0MxNC45MzU3IDEuMDQyOSAxMy41NDU3IDAuMjM0Mzc1IDEyLjAwNDggMC4yMzQzNzVDMTAuNDYyNyAwLjIzNDM3NSA5LjA3MjY0IDEuMDE4MjMgOC4yODk5NSAyLjM1Njg3TDAuNjMyMDkgMTUuMTk1NkMtMC4yMDIxMDkgMTYuNTU5OSAtMC4yMDIxMDkgMTguMTc3IDAuNTgxNzQxIDE5LjU2N0MxLjM2NTYgMjAuOTMxMyAyLjc4MDI2IDIxLjc2NTUgNC4zNDY4NiAyMS43NjU1SDE5LjY2MjZDMjEuMjU1IDIxLjc2NTUgMjIuNjQ1IDIwLjk1NyAyMy40Mjc3IDE5LjU2N0MyNC4yMTE1IDE4LjIwMjcgMjQuMTg1OSAxNi41NjAxIDIzLjM3NzMgMTUuMTk0NkwxNS43MTk2IDIuMzU2ODdaTTEyLjAwNDggMTguNDA1QzExLjA0NDIgMTguNDA1IDEwLjI2MTQgMTcuNjIxMSAxMC4yNjE0IDE2LjY2MTZDMTAuMjYxNCAxNS43MDEgMTEuMDQ1MiAxNC45MTgyIDEyLjAwNDggMTQuOTE4MkMxMi45NjUzIDE0LjkxODIgMTMuNzQ4MiAxNS43MDIgMTMuNzQ4MiAxNi42NjE2QzEzLjc0ODIgMTcuNjIxMSAxMi45NjUzIDE4LjQwNSAxMi4wMDQ4IDE4LjQwNVpNMTMuODI0MiA2LjU3NzE1TDEzLjMxODcgMTIuMzM5NkMxMy4yOTMxIDEyLjY5MyAxMy4xMTY0IDEzLjAyMTcgMTIuODM5IDEzLjI0OThDMTIuNjExOSAxMy40NTIyIDEyLjMwNzggMTMuNTUyOCAxMS45ODAxIDEzLjU1MjhIMTEuODUzN0MxMS4yMjE5IDEzLjUwMjUgMTAuNjkwOCAxMi45OTcxIDEwLjY0MDUgMTIuMzM5NkwxMC4xMzUgNi41NzcxNUMxMC4wODQ3IDYuMDk3MzcgMTAuMjM1NyA1LjYxNjU5IDEwLjU2NDQgNS4yMzc1QzEwLjg5MzIgNC44NTg0MSAxMS4zMjI2IDQuNjMxMzYgMTEuODAyNCA0LjU4QzEyLjMwNzggNC41Mjk2NiAxMi43NjMgNC42ODA3IDEzLjE0MiA1LjAwOTQ0QzEzLjUyMTEgNS4zMTI1MSAxMy43NDgyIDUuNzY3NjEgMTMuNzk5NSA2LjI0NzM5QzEzLjg0OTkgNi4zNzQ3NCAxMy44NDk5IDYuNDc2NDIgMTMuODI0MiA2LjU3NzEyTDEzLjgyNDIgNi41NzcxNVoiIGZpbGw9IiNGRkMwMTciLz4KPC9zdmc+);
  background-size: contain;
  content: "";
  display: inline-block;
  height: 1.5rem;
  min-width: 1.5rem;
  width: 1.5rem;
  margin-bottom: .5rem;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  position: relative;
  top: .35rem;
}

.query-conditional-group-block.is-dirty-variable::before,
.multi-query-content-block.is-dirty-variable::after {
  /* background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyNCAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1LjcxOTYgMi4zNTY4N0MxNC45MzU3IDEuMDQyOSAxMy41NDU3IDAuMjM0Mzc1IDEyLjAwNDggMC4yMzQzNzVDMTAuNDYyNyAwLjIzNDM3NSA5LjA3MjY0IDEuMDE4MjMgOC4yODk5NSAyLjM1Njg3TDAuNjMyMDkgMTUuMTk1NkMtMC4yMDIxMDkgMTYuNTU5OSAtMC4yMDIxMDkgMTguMTc3IDAuNTgxNzQxIDE5LjU2N0MxLjM2NTYgMjAuOTMxMyAyLjc4MDI2IDIxLjc2NTUgNC4zNDY4NiAyMS43NjU1SDE5LjY2MjZDMjEuMjU1IDIxLjc2NTUgMjIuNjQ1IDIwLjk1NyAyMy40Mjc3IDE5LjU2N0MyNC4yMTE1IDE4LjIwMjcgMjQuMTg1OSAxNi41NjAxIDIzLjM3NzMgMTUuMTk0NkwxNS43MTk2IDIuMzU2ODdaTTEyLjAwNDggMTguNDA1QzExLjA0NDIgMTguNDA1IDEwLjI2MTQgMTcuNjIxMSAxMC4yNjE0IDE2LjY2MTZDMTAuMjYxNCAxNS43MDEgMTEuMDQ1MiAxNC45MTgyIDEyLjAwNDggMTQuOTE4MkMxMi45NjUzIDE0LjkxODIgMTMuNzQ4MiAxNS43MDIgMTMuNzQ4MiAxNi42NjE2QzEzLjc0ODIgMTcuNjIxMSAxMi45NjUzIDE4LjQwNSAxMi4wMDQ4IDE4LjQwNVpNMTMuODI0MiA2LjU3NzE1TDEzLjMxODcgMTIuMzM5NkMxMy4yOTMxIDEyLjY5MyAxMy4xMTY0IDEzLjAyMTcgMTIuODM5IDEzLjI0OThDMTIuNjExOSAxMy40NTIyIDEyLjMwNzggMTMuNTUyOCAxMS45ODAxIDEzLjU1MjhIMTEuODUzN0MxMS4yMjE5IDEzLjUwMjUgMTAuNjkwOCAxMi45OTcxIDEwLjY0MDUgMTIuMzM5NkwxMC4xMzUgNi41NzcxNUMxMC4wODQ3IDYuMDk3MzcgMTAuMjM1NyA1LjYxNjU5IDEwLjU2NDQgNS4yMzc1QzEwLjg5MzIgNC44NTg0MSAxMS4zMjI2IDQuNjMxMzYgMTEuODAyNCA0LjU4QzEyLjMwNzggNC41Mjk2NiAxMi43NjMgNC42ODA3IDEzLjE0MiA1LjAwOTQ0QzEzLjUyMTEgNS4zMTI1MSAxMy43NDgyIDUuNzY3NjEgMTMuNzk5NSA2LjI0NzM5QzEzLjg0OTkgNi4zNzQ3NCAxMy44NDk5IDYuNDc2NDIgMTMuODI0MiA2LjU3NzEyTDEzLjgyNDIgNi41NzcxNVoiIGZpbGw9IiNGRkMwMTciLz4KPC9zdmc+);
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
  color: #92400e; */
}

.query-conditional-group-block.is-dirty-variable:not(.query-conditional-group-block .query-conditional-group-block) {
  filter: blur(2px);
  transition: all 0.2s ease;
}

#post-content:has(#rebateFilterApp[data-mode="single"]):has(.is-dirty-variable) {
  --icon-gear: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMzY5IiBkPSJNNDk1LjkgMTY2LjZjMy4yIDguNyAuNSAxOC40LTYuNCAyNC42bC00My4zIDM5LjRjMS4xIDguMyAxLjcgMTYuOCAxLjcgMjUuNHMtLjYgMTcuMS0xLjcgMjUuNGw0My4zIDM5LjRjNi45IDYuMiA5LjYgMTUuOSA2LjQgMjQuNmMtNC40IDExLjktOS43IDIzLjMtMTUuOCAzNC4zbC00LjcgOC4xYy02LjYgMTEtMTQgMjEuNC0yMi4xIDMxLjJjLTUuOSA3LjItMTUuNyA5LjYtMjQuNSA2LjhsLTU1LjctMTcuN2MtMTMuNCAxMC4zLTI4LjIgMTguOS00NCAyNS40bC0xMi41IDU3LjFjLTIgOS4xLTkgMTYuMy0xOC4yIDE3LjhjLTEzLjggMi4zLTI4IDMuNS00Mi41IDMuNXMtMjguNy0xLjItNDIuNS0zLjVjLTkuMi0xLjUtMTYuMi04LjctMTguMi0xNy44bC0xMi41LTU3LjFjLTE1LjgtNi41LTMwLjYtMTUuMS00NC0yNS40TDgzLjEgNDI1LjljLTguOCAyLjgtMTguNiAuMy0yNC41LTYuOGMtOC4xLTkuOC0xNS41LTIwLjItMjIuMS0zMS4ybC00LjctOC4xYy02LjEtMTEtMTEuNC0yMi40LTE1LjgtMzQuM2MtMy4yLTguNy0uNS0xOC40IDYuNC0yNC42bDQzLjMtMzkuNEM2NC42IDI3My4xIDY0IDI2NC42IDY0IDI1NnMuNi0xNy4xIDEuNy0yNS40TDIyLjQgMTkxLjJjLTYuOS02LjItOS42LTE1LjktNi40LTI0LjZjNC40LTExLjkgOS43LTIzLjMgMTUuOC0zNC4zbDQuNy04LjFjNi42LTExIDE0LTIxLjQgMjIuMS0zMS4yYzUuOS03LjIgMTUuNy05LjYgMjQuNS02LjhsNTUuNyAxNy43YzEzLjQtMTAuMyAyOC4yLTE4LjkgNDQtMjUuNGwxMi41LTU3LjFjMi05LjEgOS0xNi4zIDE4LjItMTcuOEMyMjcuMyAxLjIgMjQxLjUgMCAyNTYgMHMyOC43IDEuMiA0Mi41IDMuNWM5LjIgMS41IDE2LjIgOC43IDE4LjIgMTcuOGwxMi41IDU3LjFjMTUuOCA2LjUgMzAuNiAxNS4xIDQ0IDI1LjRsNTUuNy0xNy43YzguOC0yLjggMTguNi0uMyAyNC41IDYuOGM4LjEgOS44IDE1LjUgMjAuMiAyMi4xIDMxLjJsNC43IDguMWM2LjEgMTEgMTEuNCAyMi40IDE1LjggMzQuM3pNMjU2IDMzNmE4MCA4MCAwIDEgMCAwLTE2MCA4MCA4MCAwIDEgMCAwIDE2MHoiLz48L3N2Zz4=);
  &::before{
    background-image: var(--icon-gear);
    background-size: 2rem;
    background-position: 1rem center;
    background-repeat: no-repeat;
    box-shadow: 0 .25rem .7rem #31313240;
    content: "Updating page information";
    background-color: #fff;
    border: 2px solid #369;
    border-radius: 1rem;
    color: #369;
    padding: 1rem 2rem 1rem 3.5rem;
    position: fixed;
    margin: auto;
    left: 0%;
    right: 0%;
    top: 10rem;
    width: fit-content;
    white-space: nowrap;
    z-index: 9;
  }
}

#post-content:has(#rebateFilterApp[data-mode="archive"]) {
  background-color: #f0f0f0;

  #rebatesFilterControls:has(.stacked) {
   padding: 2rem;
   box-shadow: 0 0 3px rgb(0 0 0 / 0.2), 0 0 6px rgb(0 0 0 / 0.1)
  }

  .not-eligible a, .not-eligible a > * {
    font-size: inherit !important;
  }
}

#rebatesFilterControls.labels-hidden label.small {
  display: none !important;
}


#grid-or-list-container {
  display: none;

  @media (width > 564px) {
    display: block;
  }

  border: 2px solid #fff;
  border-radius: 100vw;
  max-height: 2.5rem;

  &:focus-within {
    outline: 2px solid #369;
  }
}

#grid-or-list {

  +label {
    display: inline-block;
  }

  +label::before,
  +label::after {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 2px solid #369;
    padding-inline: 0.25rem;
    background: #369;
    cursor: pointer;
  }

  +label::before {
    /* grid icon blue */
    content: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMzIgMzInIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZmlsbD0nIzM2OScgZD0nTTcgN3Y3aDd2LTd6IE0xNyA3djdoN3YtN3pNNyAxN3Y3aDd2LTd6TTE3IDE3djdoN3YtN3onLz48L3N2Zz4=);
    border-radius: 100vw 0 0 100vw;
    padding-inline: .5rem .25rem;
    border-right: 0;
  }

  &:checked+label::before {
    /* grid icon white */
    content: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMzIgMzInIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTcgN3Y3aDd2LTd6IE0xNyA3djdoN3YtN3pNNyAxN3Y3aDd2LTd6TTE3IDE3djdoN3YtN3onLz48L3N2Zz4=);
  }

  +label::after {
    /* list icon blue */
    content: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMzIgMzInIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZmlsbD0nIzM2OScgZD0nTTcgOXYyaDJ2LTJ6TTcgMTV2Mmgydi0yek03IDIxdjJoMnYtMnpNMTIgOXYyaDEydi0yek0xMiAxNXYyaDEydi0yek0xMiAyMXYyaDEydi0yeicvPjwvc3ZnPg==);
    border-radius: 0 100vw 100vw 0;
    padding-inline: .25rem .5rem;
    border-left: 0;
  }

  &:not(:checked)+label::after {
    /* list icon white */
    content: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMzIgMzInIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTcgOXYyaDJ2LTJ6TTcgMTV2Mmgydi0yek03IDIxdjJoMnYtMnpNMTIgOXYyaDEydi0yek0xMiAxNXYyaDEydi0yek0xMiAyMXYyaDEydi0yeicvPjwvc3ZnPg==);
  }

  &:not(:checked)+label::before,
  &:checked+label::after {
    background: #ddd;
  }

  :is(ul) {
    padding: 0;
    display: flex;
  }

  :is(li) {
    list-style: none;
  }

  &:not(:checked)~ul {
    flex-flow: column;
  }

  &:not(:checked)~ul li {
    padding: 0.5em 0;
    border-top: 1px solid #369;
    width: 100%;
  }

  &:not(:checked)~ul li:last-child {
    border-bottom: 1px solid #369;
  }

  &:not(:checked)~ul h2,
  &:not(:checked)~ul p {
    display: inline-block;
    font-size: 1em;
    margin: 0 1em 0 0;
  }

  &:not(:checked)~ul p:last-child {
    float: right;
  }

  &:checked~ul {
    flex-flow: row wrap;
    gap: 1em;
  }

  &:checked~ul li {
    flex: 0 0 16em;
    padding: 1em;
    box-shadow: 0.5em 0.5em 0.5em #bbb;
  }

  &:checked~ul p {
    margin: 0;
  }
}
</style>