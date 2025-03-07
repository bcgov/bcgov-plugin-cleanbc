import { debug } from './shared-functions.js';

/**
 * Fires a Snowplow event for a user clicking on a rebate item.
 *
 * @param {Object} params
 * @param {string} params.projectType
 * @param {string} params.location
 * @param {string} params.heatingType
 * @param {Array<string>} params.filterValues
 * @param {string} params.label - e.g. the rebate title
 * @param {string} [params.rebateText]
 * @param {string} [params.destination] - a URL
 */
export function trackRebateClick({
	projectType,
	location,
	heatingType,
	filterValues,
	label,
	rebateText,
	destination
}) {
	if (window.snowplow) {
		window.snowplow('trackSelfDescribingEvent', {
			schema: 'iglu:ca.bc.gov.cleanbc/rst/jsonschema/1-0-0',
			data: {
				action: 'click',
				element_type: 'rebate',
				project_type: projectType,
				location,
				heating_type: heatingType,
				filter_values: filterValues,
				label,        // the rebate title
				rebate: rebateText,
				destination   // a link URL
			}
		});
	} else {
		debug('Snowplow analytics not loaded.', error)
	}
}

// For filter changes (buildType, location, etc.)
export const trackFilterChange = ({
	projectType,
	location,
	heatingType,
	filterValues,
	label
}) => {
	if (window.snowplow) {
		window.snowplow('trackSelfDescribingEvent', {
			schema: 'iglu:ca.bc.gov.cleanbc/rst/jsonschema/1-0-0',
			data: {
				action: 'change',
				element_type: 'filter',
				project_type: projectType,
				location,
				heating_type: heatingType,
				filter_values: filterValues,
				label
			}
		});
		debug(`Snowplow filter changed: ${filterValues} => ${location}`);
		debug('trackFilterChange data: {\n  action: change, \n  element_type: filter, \n  project_type: ' + projectType + ', \n  location: ' + location + ', \n  heating_type: ' + heatingType + ', \n  filter_values: ' + filterValues + ', \n  label: ' + label + ' \n}');
	} else {
		debug('Snowplow analytics not loaded.', error)
	}
}

/**
 * Fires a Snowplow event whenever an upgrade type is selected or deselected.
 *
 * @param {Object} params - The parameters for the analytics event.
 * @param {string} params.action - Either 'select' or 'deselect'.
 * @param {string} params.projectType - Current selected build type (e.g., 'Renovation', 'New Build', etc.).
 * @param {string} params.location - The user’s selected location (e.g., 'Vancouver', 'Kelowna', ...).
 * @param {string} params.heatingType - The user’s selected heating system (e.g., 'Heat Pump').
 * @param {Array<string>} params.filterValues - An array of all selected upgrade types.
 * @param {string} params.label - The specific upgrade type just selected or deselected.
 */
export const trackUpgradeTypeChange = ({
	action,         // 'select' or 'deselect'
	projectType,
	location,
	heatingType,
	filterValues,
	label
}) => {
	if (window.snowplow) {
		window.snowplow('trackSelfDescribingEvent', {
			schema: 'iglu:ca.bc.gov.cleanbc/rst/jsonschema/1-0-0',
			data: {
				action,                // 'select' or 'deselect'
				element_type: 'filter',
				project_type: projectType,
				location,
				heating_type: heatingType,
				filter_values: filterValues, // array of all selected upgrade types
				label                  // which upgrade type was just selected/deselected
			}
		});
		debug(`Snowplow upgrade type ${action}: ${label}`);
	} else {
		debug('Snowplow analytics not loaded.', error)
	}
}
