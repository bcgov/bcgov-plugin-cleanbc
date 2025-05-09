<template>
    <div v-if="uniqueTags.categories.length > 0" id="tag-filter-container" class="tag-filter-container">
        <div class="taxonomy-common_component_category wp-block-post-terms filter-container">
            <div v-for="(category, index) in uniqueTags.categories" :key="category" class="tag-checkbox">
                <input type="radio" :id="'tag-' + index" :value="category" v-model="selectedTag" class="tag-input" />
                <label :for="'tag-' + index" class="tag-label tag" tabindex="0" @click="checkTag(index)"
                    :data-category-slug="getCategorySlug(category)" :id="getCategorySlug(category)"
                    @keydown.enter.prevent="checkTag(index)" role="button" :aria-label="getTagAriaLabel(category)">
                    <img v-if="getCategoryIconUrl(category)" :src="getCategoryIconUrl(category)" alt=""
                        class="category-icon" />
                    {{ category }} ({{ getTagCount(category) }})
                </label>
            </div>
        </div>
    </div>

    <h3 v-if='filterPosts.length > 0' id='action-title'>
        <span v-if='sortedFilteredPosts.length !== filterPosts.length'>Showing actions: {{ selectedTag ? selectedTag + ' ' :
            '' }} ({{ sortedFilteredPosts.length }}/{{
        filterPosts.length }})</span>
        <span v-else>All actions ({{ sortedFilteredPosts.length }}/{{
            filterPosts.length }})</span>
        <div class="filter-options">
            <button v-if='sortedFilteredPosts.length !== filterPosts.length' class="clear-filters" @click="clearFilters"
                @keydown.enter.prevent="clearFilters">
                Reset selection
            </button>
        </div>
    </h3>

    <div v-if="sortedFilteredPosts.length > 0" class="alignfull wp-block-columns card-container">
        <div class="wp-block-query vue-card-container">
            <ul class="is-flex-container wp-block-post-template" :class="`columns-${columns}`">

                <li v-for="post in sortedFilteredPosts" :key="post.id" class="filter-card common-component">

                    <div
                        class="vue-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background">

                        <div class='category-icon-container'>
                            <template v-for="img, index in post.category_image" :key="img">
                                <span class="category-icon" v-if="img"><img :src="img"
                                        :alt="getPostCategoryAlt(post, index)"
                                        :title="getPostCategoryAlt(post, index)"></span>
                            </template>
                        </div>

                        <a v-if="'true' === headingLinkActive" :href='post.link'>
                            <component :is="headingSize" style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                                class="has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title"
                                v-html='post.title.rendered'></component>
                        </a>
                        <component v-else :is="headingSize"
                            style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                            class="has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title"
                            v-html='post.title.rendered'></component>

                        <div style="font-size:1rem;"><span class="value"
                                v-html='useExcerpt === "excerpt" ? post.excerpt.rendered : post.content.rendered'></span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <p v-else-if="showLoadingMessage" class="no-results loading" v-show="showLoadingMessage" aria-live='polite'>Retrieving
        {{ filterPostTypeName }} results.</p>
    <p v-else class="no-results" aria-live='polite'>Oops, no filterable results for <strong>{{
        filterPostTypeName }}</strong> have been found. <a href="#" @click.prevent="clearFilters"
            @keydown.enter.prevent='clearFilters'>Try
            resetting your filters</a> and
        refining your selections.</p>
</template>

<script setup>
/**
 * Vue component script for the CleanBC Post Filter.
 */
import { ref, onMounted, computed, watch } from 'vue';

const filterPostType = ref('');
const filterPostTypeName = ref('');
const headingLinkActive = ref('false');
const headingSize = ref('h3');
const useExcerpt = ref('excerpt');
const filterPosts = ref([]);
const selectedTags = ref([]);
const selectedTag = ref(null);
const cssClass = ref('');
const columns = ref(3);
const showLoadingMessage = ref(true);
/** Define perPage constant (max 100 due to WordPress API limitations) */
const perPage = 100;
/** Array of excluded tags/categories */
const excludedTags = ['Actions we are taking'];

const publicDomain = 'https://cleanbc.goc.bc.ca'

/**
 * Checks if the DOM is fully loaded and interactive. See onMounted.
 */
const isDOMReady = () => {
    return document.readyState === 'complete' || document.readyState === 'interactive';
};

/**
 * Watches the `window.site?.domain` variable and invokes `fetchData` when it becomes truthy.
 */
watch(() => window.site?.domain, (newVal, oldVal) => {
    if (newVal) {
        fetchData();
    }
});

/**
 * Fetches post data from the WordPress API.
 *
 * @param {number} [offset=0] - The offset for pagination.
 * @returns {Promise<void>} - A promise that resolves when data is fetched.
 */
const fetchData = async (offset = 0) => {
    try {

        const filterPostUrl = `${window.site?.domain ? window.site.domain : publicDomain}/wp-json/wp/v2/${filterPostType.value}?_embed&per_page=${perPage}&offset=${offset}&_category_image=true`;
        const filterPostResponse = await fetch(filterPostUrl);
        const filterPostsData = await filterPostResponse.json();

        const newFilterPosts = filterPostsData.map((post) => {
            return {
                ...post,
                item_tag: post._embedded?.['wp:term']?.flatMap((term) => term.filter((t) => t.taxonomy === 'category').map((t) => t.name)) || [],
                category_image: post._embedded?.['wp:term']?.flatMap((term) => term.filter((t) => t.taxonomy === 'category').map((t) => t.acf['category_image'])) || [],
                category_slug: post._embedded?.['wp:term']?.flatMap((term) => term.filter((t) => t.taxonomy === 'category').map((t) => t.slug)) || [],
            }
        });

        filterPosts.value = [...filterPosts.value, ...newFilterPosts];

        /** Check if there are more pages to fetch, and recursively call fetchData with the next offset */
        if (filterPostsData.length >= perPage) {
            fetchData(offset + filterPostsData.length);
        }

        showLoadingMessage.value = false;

        setTimeout(() => {
            doExternalLinkCheck();
            checkDefinitions();
        }, 150);

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

};


/**
 * Handles the tag selection/deselection.
 *
 * @param {number} index - The index of the tag in the uniqueTags array.
 */
const checkTag = (index) => {
    const tag = uniqueTags.value.categories[index];

    if (tag === 'Actions we are taking') return;
    selectedTag.value = selectedTag.value === tag ? null : tag;

    const categorySlug = getCategorySlug(tag);
    if (categorySlug) {
        window.location.hash = categorySlug;
    }

    // Scroll to the element with id 'action-title'
    const actionTitleElement = document.getElementById('action-title');
    if (actionTitleElement) {
        actionTitleElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
        doExternalLinkCheck();
        checkDefinitions();
    }, 150);
    
};

/**
 * Gets the ARIA label for a tag based on its selection state.
 *
 * @param {string} tag - The tag name.
 * @returns {string} - The ARIA label.
 */
const getTagAriaLabel = (tag) => {
    return `${tag} filter ${selectedTags.value.includes(tag) ? 'selected' : 'deselected'}`;
};


/**
 * Get the alternative text for a post category image.
 *
 * @param {Object} post - The post object containing category information.
 * @param {number} index - The index of the category image.
 * @returns {string} - The alternative text for the category image, or an empty string if not found.
 */
const getPostCategoryAlt = (post, index) => {
    const category = post.item_tag && post.item_tag[index];
    return category || ''; // Return the category name or an empty string if not found
};

/**
 * Clears all selected tags and resets the filter, removes the hash from the URL, 
 * scrolls smoothly to the categories filter container, and checks for external links.
 *
 * @returns {void}
 */
const clearFilters = () => {
    selectedTag.value = null;
    history.replaceState(null, null, ' ')

    // Scroll to the element with id 'tag-filter-container'
    const tagFilterContainerElement = document.getElementById('tag-filter-container');
    if (tagFilterContainerElement) {
        tagFilterContainerElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
        doExternalLinkCheck();
        checkDefinitions();
    }, 150);
};

/**
 * Calculates and returns the count of posts containing a specific tag.
 *
 * Iterates through the `filterPosts` array and increments the count for each post that includes the specified tag.
 *
 * @param {string} tag - The tag for which to calculate the count.
 * @returns {number} The count of posts containing the specified tag.
 */
const getTagCount = (tag) => {
    return filterPosts.value.reduce(
        (count, post) => count + (post.item_tag.includes(tag) ? 1 : 0),
        0
    );
};

/**
 * Get the category icon URL for a given tag.
 *
 * @param {string} tag - The tag name.
 * @returns {string|null} - The category icon URL, or null if not found.
 */
const getCategoryIconUrl = (tag) => {
    const index = uniqueTags.value.categories.indexOf(tag);

    if (index !== -1 && index < uniqueTags.value.images.length) {
        return uniqueTags.value.images[index];
    }

    return null; // Return null or a default image URL if the image is not found
};

/**
 * Retrieves the category slug associated with a given tag from the filtered posts.
 * 
 * @function
 * @param {string} tag - The tag for which to retrieve the category slug.
 * @returns {string} The category slug associated with the provided tag, or an empty string if not found.
 */
const getCategorySlug = (tag) => {
    const postWithCategory = filterPosts.value.find((post) => post.item_tag.includes(tag));

    if (postWithCategory) {
        const categoryIndex = postWithCategory.item_tag.indexOf(tag);
        const categorySlug = postWithCategory.category_slug[categoryIndex];
        return categorySlug || '';
    }

    return '';
};

/**
  * Helper function to sort posts by title.
  *
  * @param {Post} a - The first post.
  * @param {Post} b - The second post.
  * @returns {number} - The sorting order.
  */
const sortByTitle = (a, b) => {
    const titleA = a.title.rendered.toUpperCase();
    const titleB = b.title.rendered.toUpperCase();
    return titleA.localeCompare(titleB);
};

/* Helper functions */


/**
 * Performs an external link check and sets up external icons for links if enabled in the
 * Block Theme settings. This function checks each link within the specified container for 
 * being an external link. If a link is determined to be external, it adds the 'external' 
 * class and appends an icon to the link.
 * 
 * @function
 */
const doExternalLinkCheck = () => {
    /**
     * Set up external icons for links.
     */

    if ('1' === window.site.externalLinkIcons) {
        const links = document.querySelectorAll('.vue-card-content a');

        if (links) {
            links.forEach((link) => {

                link.classList.remove('has-text-align-left');

                const hasExternalClass = link.classList.contains('external');

                if (hasExternalClass) return;

                const href = link.getAttribute('href');

                if (null !== href) {
                    // Check if the link is an anchor link or a relative link
                    if (
                        href.startsWith('#') ||
                        href.startsWith('/') ||
                        href.startsWith('./') ||
                        href.startsWith('../') ||
                        href.startsWith('?')
                    ) {
                        return;
                    }

                    // Get the current domain
                    const currentDomain = window.location.hostname;

                    // Extract the domain from the link's href
                    const linkDomain = href.match(
                        /^(?:https?:)?(?:\/\/)?([^\/\?]+)/i
                    )[1];

                    // Check if the domains don't match
                    if (linkDomain !== currentDomain) {

                        link.classList.add('external');

                        const span = document.createElement('span');
                        const svg = document.createElementNS(
                            'http://www.w3.org/2000/svg',
                            'svg'
                        );
                        svg.setAttribute('class', 'external-link-icon');
                        svg.setAttribute('version', '1.1');
                        svg.setAttribute('id', 'Layer_1');
                        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                        svg.setAttribute(
                            'xmlns:xlink',
                            'http://www.w3.org/1999/xlink'
                        );
                        svg.setAttribute('x', '0px');
                        svg.setAttribute('y', '0px');
                        svg.setAttribute('viewBox', '0 0 18 18');
                        svg.setAttribute(
                            'style',
                            'enable-background:new 0 0 18 18;'
                        );
                        svg.setAttribute('xml:space', 'preserve');
                        svg.innerHTML =
                            '<path class="st0" d="M9.7,3.9c0-0.1-0.1-0.3-0.2-0.4C9.4,3.4,9.3,3.4,9.2,3.4H1.7c-0.4,0-0.9,0.2-1.2,0.5C0.2,4.2,0,4.6,0,5.1v11.2c0,0.4,0.2,0.9,0.5,1.2C0.8,17.8,1.2,18,1.7,18h11.2c0.4,0,0.9-0.2,1.2-0.5c0.3-0.3,0.5-0.7,0.5-1.2V8.8c0-0.1-0.1-0.3-0.2-0.4 c-0.1-0.1-0.2-0.2-0.4-0.2c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4v7.5c0,0.1-0.1,0.3-0.2,0.4c-0.1,0.1-0.2,0.2-0.4,0.2 H1.7c-0.1,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.2-0.2-0.4V5.1c0-0.1,0.1-0.3,0.2-0.4c0.1-0.1,0.2-0.2,0.4-0.2h7.5 c0.1,0,0.3-0.1,0.4-0.2C9.7,4.2,9.7,4.1,9.7,3.9z"/><path class="st0" d="M18,0.6c0-0.1-0.1-0.3-0.2-0.4C17.7,0.1,17.6,0,17.4,0h-5.6c-0.1,0-0.3,0.1-0.4,0.2c-0.1,0.1-0.2,0.2-0.2,0.4 s0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2h4.3l-9.2,9.2c-0.1,0.1-0.1,0.1-0.1,0.2c0,0.1,0,0.1,0,0.2s0,0.1,0,0.2c0,0.1,0.1,0.1,0.1,0.2C7,11.1,7,11.2,7.1,11.2c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0s0.1-0.1,0.2-0.1l9.2-9.2v4.3c0,0.1,0.1,0.3,0.2,0.4c0.1,0.1,0.2,0.2,0.4,0.2c0.1,0,0.3-0.1,0.4-0.2C17.9,6.5,18,6.3,18,6.2V0.6z"/>';

                        const fontSize = '1.25rem';

                        svg.style.maxWidth = fontSize;
                        svg.style.height = fontSize;
                        svg.style.width = '100%';

                        span.innerText = link.innerText;
                        span.appendChild(svg);

                        link.innerHTML = '';
                        link.appendChild(span);
                    }
                }
            });
        }
    }
};


/**
 * Computed property that extracts unique tags from the fetched posts.
 *
 * Iterates through the `filterPosts` array, collecting unique tags from the `item_tag` property of each post.
 * Excludes the tag 'Actions we are taking' from the result.
 *
 * @returns {string[]} An array of unique tags sorted alphabetically.
 */
const uniqueTags = computed(() => {
    const tagObjects = new Set();

    filterPosts.value.forEach((post) => {
        const itemTags = post.item_tag || [];
        const itemTagImages = post.category_image || [];

        itemTags.forEach((tag, index) => {
            if (tag !== 'Actions we are taking' && itemTagImages[index] !== '') {
                tagObjects.add({
                    category: tag,
                    image: itemTagImages[index],
                });
            }
        });
    });

    // Convert Set to array
    const sortedTagObjects = Array.from(tagObjects);

    // Sort tagObjects based on the 'category' property
    sortedTagObjects.sort((a, b) => a.category.localeCompare(b.category));

    // Extract sorted categories and images separately
    const sortedCategories = [...new Set(sortedTagObjects.map((tagObject) => tagObject.category))];
    const sortedImages = [...new Set(sortedTagObjects.map((tagObject) => tagObject.image))];

    return {
        categories: sortedCategories,
        images: sortedImages,
    };
});


/**
 * Computed property to get filtered and sorted posts based on the selected tags.
 * If no tag is selected, the function returns a sorted copy of all posts. If a tag is selected, it filters
 * the posts to include only those with the selected tag and then sorts the resulting array.
 *
 * @type {Post[]} An array of post objects that meet the filter criteria.
 */
const sortedFilteredPosts = computed(() => {

    if (!selectedTag.value) {
        return [...filterPosts.value].sort(sortByTitle);
    } else {
        const filteredPostArray = filterPosts.value.filter((post) =>
            post.item_tag && post.item_tag.length && post.item_tag.includes(selectedTag.value)
        );
        return filteredPostArray.sort(sortByTitle);
    }
});

/**
 * Filters out excluded tags from the provided tags array.
 *
 * @param {string[]} tags - The array of tags to filter.
 * @param {string[]} excludedTags - The array of excluded tags.
 * @returns {string[]} - The filtered tags.
 */
const filteredTags = (tags, excludedTags) => {
    return tags.filter(tag => !excludedTags.includes(tag));
};

/**
 * Handles the hash change in the URL.
 * If there's a button with a data-category-slug attribute matching the hash, simulates a click on it.
 *
 * @returns {void}
 */
const handleHash = () => {
    const hash = window.location.hash.substr(1); // Remove the '#' character
    if (hash) {
        // Check if there is a button with data-category-slug matching the hash
        const matchingButton = document.querySelector(`[data-category-slug="${hash}"]`);
        if (matchingButton) {
            // Simulate a click on the matching button
            matchingButton.click();
        }
    }
};

const checkDefinitions = () => {

    const links = document.querySelectorAll('#postFilterApp a');

    const definitionLinks = Array.from(links).filter(function (link) {
        return link.href.includes('definitions');
    });

    if (definitionLinks.length > 0) {

        const hasDialog = document.querySelector('#dialog');

        if (!hasDialog) {
            const dialog = document.createElement('dialog');
            dialog.id = 'dialog';
            dialog.className = 'dialog';
            dialog.setAttribute('aria-modal', true);
            dialog.setAttribute('aria-live', 'polite');
            dialog.innerHTML = '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
            document.body.appendChild(dialog);

            const closeDialogButton = document.querySelector('#dialog #close-dialog');

            closeDialogButton.addEventListener('click', function () {
                dialog.close();
            });
        }

        definitionLinks.forEach(function (link) {
            if (!link.classList.contains('icon-definition')) {
                link.classList.add('icon-definition');
                link.setAttribute('aria-label', 'opens definition dialog for this concept');

                const linkText = link.textContent;

                if (linkText && linkText.trim().length > 0) {

                    const words = linkText.trim().split(' ');
                    const lastWord = words.pop(); 
                    const restOfText = words.join(' '); 

                    // Create a span element for the last word
                    const span = document.createElement('span');
                    span.classList.add('last-word');
                    span.textContent = lastWord;

                    link.innerHTML = `${restOfText} `;
                    link.appendChild(span);
                }
    
                // Adding event listeners for both click and keypress events
                addEventListeners(link);
            }
        });

        function addEventListeners(element) {
            element.addEventListener('click', handleClick);
            element.addEventListener('keypress', handleKeypress);
        }

        async function handleClick(event) {
            if (event.type === 'click' || (event.type === 'keypress' && event.key === 'Enter')) {
                event.preventDefault();
                const url = this.getAttribute('href');
                const cachedData = window.sessionStorage.getItem(url);

                if (cachedData) {
                    const { title, content } = JSON.parse(cachedData);
                    displayContent(title, content);
                } else {
                    try {
                        const response = await fetch(url + '#vue');
                        const html = await response.text();
                        const parser = new window.DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const title = doc.querySelector('h1.wp-block-post-title').innerText;
                        const content = doc.querySelector('.entry-content').innerHTML;
                        const dataToCache = { title, content };

                        window.sessionStorage.setItem(url, JSON.stringify(dataToCache));
                        displayContent(title, content);
                    } catch (error) {
                        console.error('Error fetching content:', error);
                    }
                }
            }
        }

        function handleKeypress(event) {
            if (event.key === 'Enter' || event.keycode === 13) {
                handleClick(event);
            }
        }

        function displayContent(title, content) {
            const dialogContent = document.querySelector('#dialog .dialog-content');
            dialogContent.innerHTML = '<h2 tabindex="0">' + title + '</h2>' + content;
            showDialog();
            dialogContent.querySelector('h2').focus();
        }

        function showDialog() {
            dialog.showModal();
        }
    }
}

function showVueDialog() {
    dialog.showModal();
}

/**
 * A Vue lifecycle hook that is called after the instance has been mounted.
 * It retrieves various attributes from the 'postFilterApp' element and assigns them to reactive properties.
 * It also shows a loading message, fetches data, and then handles the URL hash.
 *
 * @returns {void}
 */
onMounted(() => {

    const appElement = document.getElementById('postFilterApp');
    cssClass.value = appElement.getAttribute('class');
    columns.value = parseInt(appElement.getAttribute('data-columns'));
    filterPostType.value = appElement.getAttribute('data-post-type');
    filterPostTypeName.value = appElement.getAttribute('data-post-type-label');
    headingSize.value = appElement.getAttribute('data-heading-size');
    headingLinkActive.value = appElement.getAttribute('data-heading-link-active');
    useExcerpt.value = appElement.getAttribute('data-use-excerpt');

    if (window.site?.domain) {
        showLoadingMessage.value = true;
        fetchData().then(() => {
            handleHash();
        });
    }

});
</script>

<style lang="scss" scoped>
.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .card {
        border: 1px solid #ccc;
        padding: 20px;
        margin: 20px;
        width: 200px;
    }

    .filter-card {
        list-style-type: none !important;
        box-shadow: rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px;
        border-radius: 1rem;
    }
}

.category-icon-container {
    display: flex;

    .category-icon {
        max-width: 3rem;

        img {
            max-width: 3rem;
            padding: 0.25rem;
            margin-right: 0.66rem;
        }
    }
}

.tag-label {
    display: flex;
    justify-content: start;
    align-items: center;

    img.category-icon {
        width: 3rem;
        padding: 0.25rem;
        margin-right: 0.66rem;
    }
}


.clearFilters {
    text-decoration: underline;

    &:hover {
        text-decoration: none;
    }
}

.clear-filters {
    background: unset;
    border: unset;
    color: var(--wp--preset--color--secondary-brand);
    cursor: pointer;
    padding: 0.33rem 0.66rem;
    margin: 0 0.33rem;
    overflow: hidden;
    font-size: 1rem;

    &:hover,
    &:focus-visible {
        outline: 2px solid var(--wp--preset--color--gray-80);
        outline-offset: 0px;
        background-color: #fcfcfc;
    }

    .filter-card {
        border-radius: 1rem;
    }
}

.filter-options {
    display: inline-table;
    margin-left: 1rem;
}

.no-results {
    color: var(--wp--preset--color--primary-brand);
    padding: 0.66rem;
    text-align: center;

    &.loading {
        border: 1px solid gray;
        border-radius: 1rem;
        background-color: lightgray;
        padding: 2rem;
    }

    a {
        color: #8b0000;
    }
}

.num-available {
    color: #666;
    font-size: 0.9rem;
}

.tag {
    border: none;
    cursor: pointer;
    font-size: 0.667rem;
    padding: 0.5rem 1rem;
    text-align: center;
    margin: 0.25rem 0;
    width: fit-content;
}

.tag-checkbox {

    padding: 2px 0;

    label {
        color: var(--wp--preset--color--primary-brand);
        padding-bottom: 4px;

        &:focus-visible,
        &:hover {
            background-color: lightgray;
            border-color: var(--wp--preset--color--primary-brand);
            color: #313132;
        }

        &:focus-visible {
            outline-width: 2px !important;
            outline-style: solid !important;
            outline-offset: 4px !important;
        }
    }

    .tag {
        font-size: 1rem;
        padding: 0 1rem;
        text-align: left;

        &.tag-label {

            &:focus-visible,
            &:hover {
                background-color: #fcfcfc;
                color: var(--wp--preset--color--primary-brand);
                outline: 2px solid var(--wp--preset--color--primary-brand);
                outline-offset: 0px;
            }
        }
    }
}

.tag-filter-container {
    margin: 2rem 0 4rem;
}

.tag-input:checked+.tag {
    background-color: #dfe7ed;
    color: #000;
    outline: 2px solid var(--wp--preset--color--primary-brand);
}


.tag-input {
    display: none !important;

    &:checked+.tag {
        background-color: var(--wp--preset--color--background);
        color: #313132;
    }
}

.taxonomy-common_component_category {
    display: block;

    @media (min-width: 782px) {
        column-count: 2;
        column-gap: 2rem;
        column-width: auto;
        height: max-content;
    }
}

.vue-card-container {
    width: 100%;

    .vue-card-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 2rem;

        >* {
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        >div:not(.vue-card-tags):not(.category-icon-container) {
            height: inherit;

            >.value {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                height: 100%;
            }
        }

        .wp-block-buttons {
            .wp-block-button {
                .wp-block-button__link.wp-block-button__link {
                    font-size: 1rem !important;
                }
            }
        }
    }

    .vue-card-tags {
        margin-top: auto;

        .tag {
            cursor: default;
            border: 1px solid lightgray;
            border-radius: 999px;
            color: var(--wp--preset--color--gray-80);
            background-color: #efefef;
            font-weight: 700;
        }
    }

    .vue-reset-button {
        font-size: 1rem;
        padding: 11px;
        margin-top: -7px;
        margin-left: 9px;
    }
}

/* End wp-block-post-template-inline-css */
</style>
<style lang='scss'>
:root {
    --scroll-padding: 4rem !important;
}

@media (min-width: 782px) {
    :root {
        --scroll-padding: 6.5rem !important;
    }
}

.vue-card-container {

    .vue-card-content {


        >div:not(.vue-card-tags) {

            >.value {

                div.wp-block-buttons {
                    margin-top: auto !important;
                    margin-bottom: 0 !important;
                }
            }
        }
    }

    /* Begin wp-block-post-template-inline-css */
    .wp-block-post-template {
        margin-top: 0;
        margin-bottom: 0;
        max-width: 100%;
        list-style: none;
        padding-left: 0;
        padding-right: 0;
    }

    .wp-block-post-template.wp-block-post-template {
        background: none
    }

    .wp-block-post-template.is-flex-container {
        flex-direction: row;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        @media (width: 1024px) {
            gap: 1.2rem;
        }
    }

    .wp-block-post-template.is-flex-container li {
        margin: 0;
        width: 100% !important;
    }

    @media (min-width: 782px) {

        margin: auto;

        .wp-block-post-template {

            padding-left: 0;
            padding-right: 0;

            &.is-flex-container.columns-2>li {
                width: calc(50% - .625em) !important;
            }

            &.is-flex-container.columns-3>li {
                width: calc(33.33333% - .83333em) !important;
            }

            &.is-flex-container.columns-4>li {
                width: calc(25% - .9375em) !important;
            }

            &.is-flex-container.columns-5>li {
                width: calc(20% - 1em) !important;
            }

            &.is-flex-container.columns-6>li {
                width: calc(16.66667% - 1.04167em) !important;
            }
        }
    }


    .vue-card-content {

        .wp-block-button {

            margin: 1rem auto 2rem;
            width: 100%;

            .wp-block-button__link {
                font-size: clamp(0.875rem, 0.875rem + ((1vw - 0.48rem) * 0.24), 1rem);
                border: 2px solid;
                background-color: var(--wp--preset--color--secondary-brand) !important;
                color: #fff !important;
                border-radius: .33rem !important;
                padding: .667rem 1.333rem;
                width: 100%;
                min-height: 80px;
                display: inline-flex;
                text-align: center;
                justify-content: center;
                align-items: center;

                &:hover,
                &:focus-visible {
                    outline: 2px solid var(--wp--preset--color--secondary-brand) !important;
                    outline-offset: 2px;
                    display: inline-flex !important;
                }

                span {
                    display: inline-block;
                }
            }
        }
    }
}

#post-content .vue-card-content a:is(:hover, :focus-visible),
.post-content .vue-card-content a:is(:hover, :focus-visible) {
    display: inline;
}
</style>