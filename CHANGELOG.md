## 1.2.4 January 8, 2024
- Fixed the "Show External Link Icons" setting inside BCGov Block Theme settings not working with previous plugin update. Updated front end scripts to utilise unique arrow function naming and window.requestAnimationFrame execution – removing previous setTimeout 0 – to modify the DOM and align with the browser's rendering cycle. ([CLEANBC-154](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-154))
- Includes a new addSafeEventListener utility function update and related tests used to fix external links icon issues and fixes outstanding body and navigation padding issues.

## 1.2.3 December 28, 2023
- Added coding standards to the plugin including npm scripts for linting and better build management. Includes fix for Vue initialisation and event listener not a function issue. Uses domain reference for previous fetching of filterable cards. ([DESCW-1862](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1862))

## 1.2.2 December 23, 2023
- Initialises category icons for cards on Drivers pages utilising Query Loops. Adds cached fetch to generate ability to match display of filterable action cards. ([CLEANBC-144](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-144))

## 1.2.1 November 23, 2023
- Add external link icons back to action cards ([CLEANBC-128](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-128))
- Bug fix: category icon referencing in actions filter. Was incorrectly pulling by inferred association. ([CLEANBC-129](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-129))

## 1.2.0 November 23, 2023
- Minor edits and alterations to card visuals. Added scroll to filter buttons when clearing the filter. ([CLEANBC-112](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-112))
- BC Government Actions filtering for CleanBC. Added new icons and layout based on designs, and uses icons instead of tags in cards. Auto fills the number of actions that fall under each action filter. Allow for ability to select filters with a radio select. Enables hash in URL to enable filtered category at page load. ([CLEANBC-112](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-112))

## 1.1.1 September 25, 2023
- General styles and improved vehicle price range filtering. ([DESCW-1479](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1479))

## 1.1.0 September 19, 2023
- Mobile and other various style updates ([DESCW-1479](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1479))
- Custom pattern style updates for Go Electric. ([DESCW-1479](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1479))
- General style updates for Go Electric theming. Bootstrap 4 display properties moved to theme scope. ([DESCW-1479](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1479))
- Refactoring to incorporate the Go Electric styles and Vehicle filtering app. Adjusts the header display in conjunction with FSE updates. Various WordPress hooks to drive custom API and plugin specific blocks. ([DESCW-1477](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1477))
- Modified filtering price range. Fixed Vue 3 handling of no results display. ([DESCW-1477](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1477))
- Added 'cleanbc' custom body class to sites using plugin. Fixed scope issue in search toggle. ([DESCW-1477](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1477))
- Fixed secondary navigation offscreen offset. ([DESCW-1477](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1477))

## 1.0.7 August 23, 2023
- Modification of search results to omit custom post types (actions) and tags the search result with the post type ([DESCW-1391](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1391))
- added style support for notification banners and search bar interactions ([DESCW-1391](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1391))

## 1.0.6 August 22, 2023
- added search toggle icon and search field logic to expose the WordPress search capability ([DESCW-1391](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1391))
- Accessibility update to manage focus state of search field visibility ([DESCW-1391](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1391))

## 1.0.5 August 18, 2023
- fixed the highlighting state of menu items using :has() – fallback for unsupported browsers provided

## 1.0.4 August 17, 2023
- fixed the svg clip path injection to work with refactored output
- sweeping changes to header and menu system ([DESCW-1390](https://apps.itsm.gov.bc.ca/jira/browse/DESCW-1390))

## 1.0.2 July 27, 2023
- refactored plugin to OOP with PHP class loader
- modified the Vue component to check for the site domain exposed by the Block Theme as part of data fetch
- separated Vue and general scripts/styles into their own hook class files 
- minor logging and styles cleanup

## 1.0.1 July 25, 2023
- Large update for "CleanBC Post Filter" block (added to Theme category in block inserter) includes:
- funcitonal post, page or custom post type filtering
- allows editorial selection of display parameters such as number of columns, post type, heading size in results set, enabling a heading link back to content, choosing whether the content is pulled from the rendered content or excerpt.
- block insertion in editor uses a placeholder that updates to show critical information without the need to focus and inspect
- tightly styled filter button and card results
- filters allow multi-select on available categories using AND logic
- works around WordPress v2 hard limits for 100 results by calling fetch recursively with an offset
- and more...

## 1.0.0 July 20, 2023
– Added CleanBC theme.json
– Initial Plugin Structure