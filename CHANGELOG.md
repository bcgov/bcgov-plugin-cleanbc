## 1.22.2 October 7, 2025
– Modified archive mode to use input + datalist for locations.
– Related change handling and styling updates.

## 1.22.1 October 2, 2025
– Archive mode styling and error handling to add design and realtime feedback + gamification of answering questions.
– Mobile and scroll position handling.
– Augments the scroll positioning to keep previous question in sight.
– iOS select focus fix.

## 1.22.0 October 2, 2025
– Scaffolded aggregation "archive mode" form and structure to match single mode output without edit mode.
– Added modal defintions for popover links on filter form labels.
– Additional form styling.

## 1.21.7 September 29, 2025
– Added heating types to taxonomies for rebates.
– Updated single mode filter to include heating types, reordered and updated logic to accomodate.
– Updated rebates v2 API for heating type incusion in settings.

## 1.21.6 September 26, 2025
– Changed single mode interaction to an edit mode.
– Filter tool styling changes.

## 1.21.5 September 25, 2025
– Minor single mode style adjustments.
– Adjusted template to match in-page wireframe positioning.

## 1.21.4 September 24, 2025
– Better descriptions, ARIA and accessibility updates for single mode settings.
– Minor styling updates.
– Added better labels on settings with show/hide persisent state feature.

## 1.21.3 September 23, 2025
– Added single mode filtering captions.
– Single mode re-renders side scrolling menu if available.

## 1.21.2 September 17, 2025
– Added ajax loading and replacement of in-page server side rendered content.
– Fixed dirty state when messing with URL manually.

## 1.21.1 September 16, 2025
– Update startup logic for single mode to account for page initialisation from localStorage and force reload if persistent state information available.

## 1.21.0 September 16, 2025
– Large update to add Rebates vNext Vue-based filter tool block for querystring-based variability management. Utilises localStorage for persistence and enables filtering of multi-query and query conditional block output.
– v2 rebates API endpoint to work with vNext Rebate Filter Tool.

## 1.20.2 August 8, 2025
– Query Filter Block and Multi Query Content block improvements.

## 1.20.1 August 8, 2025
– Query Filter Block for updating query string parameters. Inital pass for testing purposes.

## 1.20.0 August 5, 2025
– Query Conditional Group custom block added support for conditionally displaying block content based on query string parameters. Rules can be configured with multiple operators (e.g., equals, contains, regex), logic types (AND/OR), and optional case sensitivity. Server-side and client-side evaluation is supported, with secure handling of request data via nonce verification.
- Updated PQEA API filter callback to return data from new post types ('pqeas-renovation' and 'pqeas-construction') using a unified ACF field structure. The response now includes normalized taxonomy data for locations and services, and adds a 'service_organizations' array within 'details' for linked organizations (with IDs, titles, websites, and permalinks). Maintains parity with the previous API structure while extending data coverage.

## 1.19.2 June 10, 2025
– Multi-Query Content block query string parameter passthrough as value options. Augmented preview and help information. Bolstered placeholder and fallback display.

## 1.19.1 June 6, 2025
– Multi-Query Content block styling options added.

## 1.19.0 June 5, 2025
– Added Multi-Query Content block for query string lookup table content insertion.
– Removed v1 block render the Sections for the Rebates pages.

## 1.18.4 June 2, 2025
– Improvements to PDF proxy.
– Added 'hide-from-sr' class to enable aria-hidden=''true' to be added to elements.
– Updated CleanBC drivers query loop category image link handling to point to custom API for Actions.
– Modified breadcrumb navigation to meet AGP pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/.

## 1.18.3 May 22, 2025
– Adding radio group interactions (keyboard support, roles and attributes) per AGP radio group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/ for better accessibility in CleanBC filter mechanism.

## 1.18.2 May 21, 2025
– Adding grid/gridcell interactions (keyboard support, roles and attributes) per AGP layout grid: https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/layout-grids/ for better accessibility in CleanBC filter mechanism.

## 1.18.1 May 20, 2025
– Additional scroll padding check in plugin when DOM loaded.
– More screen reader accessibility updates to Actions filter tool.

## 1.18.0 May 16, 2025
– Modified the CleanBC Actions tool to use a custom API endpoint.
– Improved Actions card layout to accomodate new API structure and augment layout for screen reader readback.
- Minor style adjustments for Actions tag checkboxes.

## 1.17.3 May 15, 2025
– Add a check for PDF label injection inside Vue-based Better Homes/Buildings FAQs and CleanBC Actions.
– Updated styles to remove external icons if injected as well as PDF icon.

## 1.17.2 May 14, 2025
– Added GET check as fallback for PDF check as HEAD can be unreliable. Some servers (like IIS, older .NET apps) serve PDF content at non-.pdf URLs — like .ashx, .php, or extensionless URLs — while returning a valid PDF in the response. This attempts to resolve this issue.
– Fixes PDF tag exclusion by adding typical brackets to the matching for PDF, MB and KB.

## 1.17.1 May 13, 2025
– Augmented PDF link feature to insert PDF specific SVG into links including externally processed.
– Added 'pdf' in title or class name checks on links to pass to proxy to allow redirect checking.
– Added following HTTP 301/302 redirects (up to a limit) for URLs passed into the proxy.

## 1.17.0 May 9, 2025
– Automated PDF link label augmentation with type and size identifiers. 
– PDF link PDF size proxy request to avoid CORS issues with third party PDF linking.

## 1.16.2 May 2, 2025
– Enhanced accessibility and mobile table display, works with styles/public/tables.scss styles. 
– Adds ARIA roles to all table elements. 
– Copies the original cell content ('innerHTML') and 'data-label' into visually hidden cells. 
– Adds 'aria-hidden="true"' to hidden cells to improve screen reader behavior.

## 1.16.1 May 2, 2025
– Added accessibility features for visual rebates content: ARIA labels to inline contact links and stripping legacy links targeting new tab/windows.
- Modified the register_custom_rebates_page_pattern to inlude the latest layout.

## 1.16.0 April 2, 2025
- Registered Better Homes Rebates page default layout pattern option for new Rebates pages.
- Added complex table spanning through class pattern. eg: 'col-1-span-2', 'row-4-col-2-span-3', 'cell-2-3-span-2x3'

## 1.15.5 March 26, 2025
– Updated rebates API to skip published rebates/incentives if they include an exclusion conditional.

## 1.15.4 March 25, 2025
– Accessibility update for back to top. Allows assitive technology to pass the focus to the body when activated.
– Fixed CleanBC accessibility site custom body class check for logo ALT.

## 1.15.3 March 25, 2025
– Site specific accessibility DOM updates scripts – alters header logo ALT attributes.
- Accessibility remediation, includes: breadcrumb navigation pattern improvements, grid pattern setup on "detailsWithNumbersContainers".

## 1.15.2 March 18, 2025
– Removed duplicate for loop in rebates/incentives results table.

## 1.15.1 March 17, 2025
- Fixed undefined filterName issue.

## 1.15.0 March 17, 2025
- Preliminary integration of Snowplow analytics event tracking in Rebates tool.
- Tracks Rebates/Incentives button clicks, filter type/region/system changes and upgrade type selection/deselection.
- Initial pass at FAQ and Providers tracking utilising non-existent schemas.

## 1.14.7 March 5, 2025
- Added null check on search components.
- Removed unnecessary console logging.
- Modified active state on tool selects to adjust font weight.

## 1.14.6 March 2, 2025
- Fixed mouse related loss of focus interaction issue with search bar.

## 1.14.5 February 27, 2025
- Safari quota handling added a fall back to localStorage on quota errors.

## 1.14.4 February 20, 2025
– Revised sessionStorage and fetch of custom API data for Better Homes/Buildings tools.
– Removed additiona filters count from Rebates side menu title to reduce confusion.

## 1.14.3 February 18, 2025
– Modified ARIA roles and settings to facilitate better Screen Reader.

## 1.14.2 February 14, 2025
- Added APG Menubar Pattern support to navigation menu.
– Rmoeved top level 'enter' handling. 

## 1.14.1 February 11, 2025
- Added escape key handling to the navigation control.

## 1.14.0 February 11, 2025
- Added WordPress 6.5+ keyboard navigation overrides for dropdown menus.

## 1.13.1 February 7, 2025
- Fixed PHP notice "Trying to get property 'post_content' of non-object" on search results page.

## 1.13.0 February 6, 2025
- Added search excerpt filtering to remove incentive side menu navigation based on class names.
- Fixed screen reader output for vehicle rebates total to account for active/inactive Federal rebates.
- Removed external link icon from vehicle results in screen reader rotor/link lists.
- Added corrected ARIA live announcements to the "Find a vehicle (showing x of y)" details that are updated with activation of filter options.
– Modified slider controls to better announce live region changes politely, with vehicle count being more assertive.
– Vehicle items now behave as layout grid elements for screen readers per the APG (https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

## 1.12.9 January 21, 2025
- Modified vehicle sorting algorithm to use direct subtraction rather than ternary operations. 
- Check the selection exists in sortFunctions before attempting to sort to avoid invalid selection.

## 1.12.8 January 20, 2025
- QA testing: disabled GoEV sort filtering buttons when selected (removed for time being).
- Disabled span wrapping of SVG on vue-card-content.

## 1.12.7 January 17, 2025
- Contractor/PQEA table style updates to add sticky thead row.

## 1.12.6 January 17, 2025
- Go Electric vehicle filter option settings to remove federal rebate information from output.
- The vehicle type key dynamically reflects the available results hiding EV Types not in the current list.
- New classes and data attributes are implemented without breaking existing styles.
- Minor style updates for improved responsive output.

## 1.12.5 January 15, 2025
- Improved FAQ pagination display to hide controls when pagination is not needed.

## 1.12.4 January 10, 2025
- Font size adjustments to better work with site settings.
- Minor adjustment to incentives template pattern.

## 1.12.3 January 9, 2025
- Added Search escape suppression for keyboard accessibility.
- Added a mutation observer to handle link wrapping of external icons injected by the Block Theme. 
- Modified styles to accomodate nowrap/no-wrap classing outside of the definitions links 'last-word' span.
- Incentives layout adjuments for BetterBuildings.
- Removed external link icons from mailto and tel links. Excluded last-word span maipulation from such links.

## 1.12.2 January 8, 2025
- Revising link styles across the sites.
- Added element wrappers to keep definitions links from wrapping end-of-line icons to next line on their own.
- Removed currentColor variable where the color value is not excepted.

## 1.12.1 January 7, 2025
- Added invisible html entity as breakpoints for email address as labels when output in filtering tables for PQEAs and Contractors.
- Tweaked focus and hover style for links in filtered tables.
- Modified base WP font sizing options.

## 1.12.0 December 20, 2024
- Modified Contractor and PQEA tool to allow for hiding controls in WordPress admin settings.
- Improved pagination display to work with controls when hidden or when pagination is not needed.

## 1.11.1 December 18, 2024
- Side navigation scroll generator scrupts and styles updated to work with Better Buildings/Homes functional styling conflict.
- Updated Single Incentive page pattern.
- Added admin and visitor facing patterns.scss for admin editor pattern styling.
- Disabled sourcemap generation in Vite config.
- Refactored styles structure to merge Better Homes and Better Building SCSS into BHBB combination.

## 1.11.0 December 13, 2024
- Incentives/rebates new page "choose a pattern" option for multi-column Single incentives page starter layout. Pattern template included in 'register_custom_incentive_page_pattern' function in Hooks/BasicBlocks.php.
- Added in-page side scrolling menu generation for incentives layout pattern based on headlines used in content.
- Cleaned up unscoped or undefined body styles and resolved sticky side menu bug.

## 1.10.0 December 11, 2024
- Fixed search results marking header link href and ARIA labels bug.
- Refactored various javascript to use es6 arrow functions and expand on JSDoc comments.

## 1.9.3 December 10, 2024
- Modified default PQEA choice to "Renovating a home".

## 1.9.2 December 6, 2024
- Removed custom qs (querySelector) /qsa (querySelectorAll) / addSafeEventListenerPlugin (addEventListener) wrapper methods.
- Passes the function reference for all DOMContentLoaded event listeners rather than invoking.
- Scoped Go Electric styles to body.custom-goelectricbc.

## 1.9.1 December 6, 2024
- Refined CSS by site. Cleaned up SCSS variables and removed mixins.
- Additional style updates.

## 1.9.0 December 6, 2024
- Added definitions post glossary query loop (.glossary-results) aggregation processing to add separation headlines by letter of the alphabet.
- Updated site styles to accomodate general styling for Better Homes and Better Buildings.
- Modified search highlighting.

## 1.8.2 December 5, 2024
- Add custom post types to search context based on site domain.
- Highlight search result page matches with mark tags.

## 1.8.1 December 2, 2024
- Re-initialize the definitions links after using the Category filtering on CleanBC Actons Vue tool.

## 1.8.0 December 1, 2024
- Added isolation of Vue component initialization.

## 1.7.2 November 28, 2024
- Added Rebates query string ability to instantiate the tool based on preset values with copy link. 
- Update includes all relevant features from other tools eg: hide/show lower pagination, assemble URLs, clipboard copy, etc.
- Added Rebates pagination to bottom of results table with scroll to top of results button.
- Auto-expand Filter by upgrade accordion is any options are pre-selected.
- Added HTML decoding guard to rebate title display.
- Fixed comma bug in link Upgrade filters list options by parsing quoted values.

## 1.7.1 November 27, 2024
- Added text filtering to FAQ link generation and if a single result is show, auto expands the FAQ result.
- Suppress the lower pagination on single page results for FAQs.
- Disabled Copy Link on PQEAs until lregion/location is selected.
- Added user feedback interaction to Copy Link buttons.

## 1.7.0 November 26, 2024
- Added watchEffect in Contractors, PQEAs and FAQs tools to look for query string values able to instantiate the tools based on preset values. 
- Also includes the ability to hide tools based on the '&show=off' query string addition.
- Added the ability to assemble and copy a link to the clipboard with the specific filter values.
- Added scaffolding to sort an array of objects asc or desc based on a specified property.
- Style updates: added light site link icon variant and general copy-link style for buttons.

## 1.6.3 November 25, 2024
- Removed redundant functions in Contractor and PQEA SFC causing an error on CleanBC.
- Fixed a scoping issue with FireFox causing a definitions error on CleanBC when using the keyboard to open the modal.
- Added HTML decoding to FAQ titles, Contractor and PQEA names with a shared decodeHtmlEntities function.
- Fixed an ARIA label issue on Contractors company name.

## 1.6.2 November 24, 2024
- Added FAQ, Contractor and PQEA pagination to bottom of results table with scroll to top of results button.
- Created a 'shared functions' import script to add DRY functionality across Vue-based apps.

## 1.6.1 November 23, 2024
- Modified Contractor and PQEA output to randomise results when applications are refiltered or reloaded (but not paginated).
- Added BH additional styles wrapping with body.betterhomesbc.

## 1.6.0 November 21, 2024
- Added GitHub Actions linting and testing workflows. 
- Added and removed composer dependencies to fscilitate github.com deployment.
- Added various node dependencies and support packages
- Moved Vite based script test to "Vite-test", added jest config to exclude Vite specific tests.

## 1.5.1 November 13, 2024
- Modified Vehicle filter app to include year mechanism and bolstered ARIA for accessibility including live readback and sort button state.

## 1.5.0 May 13, 2024
- Rebates and FAQs app bugfixing.
- Improved keyboard nav for PQEA/Contractor/Rebates/FAQ Vue apps.
- FAQs app functionality.
- Refactored styles to /styles/betterhomes/_vue-apps.scss.
- Code clean up and improved documentation.
- Rebates block partials.
- Accessibility improvements for Rebates app filters.
- PQEAs, Rebates, and Contractors Vue apps, fixed sessionStorage purge, style clean-up and reorg.
- Rebates app: updated filtering logic and display for Offers and Types.
- Rebates app: improved UX, term counts, updated filtering logic.
- Rebates: added Vue app for Rebate Search Tool.
- Contractors filter block: API endpoint and VueJS block.
- Rebates page block to show the content sections.
- PQEA filter block CSS animations for pagination & results.
- PQEA filter block accessibility feature refinement.
- PQEA filter block and output ready for inclusion on beta site. Added script module fix for Vite/Vue. ([CLEANBC-189](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-189))
- Added scaffolding for PQEA filter block.

## 1.4.0 February 16, 2024
- Vite builder and composer/wp-scripts living in harmony – codebase now lints using the code standards eg: 'composer production' now works as required. ([CLEANBC-189](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-189))

## 1.3.1 February 15, 2024
- Updated definition link to enable session caching of content. ([CLEANBC-173](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-173))

## 1.3.0 February 12, 2024
- Auto-generated dialog for definitions custom post type allows for links that include the path 'definitions' to generate an accessible dialog with the content of the CPT. Modifies the display of the link to include icon. Also added link/dialog handling to the Vue posts filter mechanism. ([CLEANBC-173](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-173))

## 1.2.5 January 23, 2024
- Fixed rebate output to align with API output. ([CLEANBC-153](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-153))

## 1.2.4 January 15, 2024
- Migrated patched css from customizer to plugin ([CLEANBC-153](https://apps.nrs.gov.bc.ca/int/jira/browse/CLEANBC-153))
- Added design related update to Go Electric vehicle filter output. Fixed undefined value on plugin directory variable coming from WordPress using computed property. 
- Fixed php notice for uninitialized string offset in vehicles custom API
- Added Federal rebate pending option to vehicle fields and API output. Modified the Vue interface to show alternative rebate pending option and combined rebate calculation. 
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