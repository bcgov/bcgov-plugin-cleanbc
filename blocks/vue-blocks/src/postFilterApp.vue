<template>
    <div v-if="uniqueTags.length > 1" id="tag-filter-container" class="tag-filter-container">
        <div class="taxonomy-common_component_category wp-block-post-terms filter-container">
            <div v-for="tag, index in uniqueTags" :key="tag" class="tag-checkbox">
                <input type="radio" :id="'tag-' + index" :value="tag" v-model="selectedTag" class="tag-input" />
                <label :for="'tag-' + index" class="tag-label tag" tabindex="0" @click="checkTag(index)"
                    :data-category-slug="getCategorySlug(tag)" :id="getCategorySlug(tag)"
                    @keydown.enter.prevent="checkTag(index)" role="button" :aria-label="getTagAriaLabel(tag)">
                    <img v-if="getCategoryIconUrl(tag)" :src="getCategoryIconUrl(tag)" alt="" class="category-icon" />
                    {{ tag }} ({{ getTagCount(tag) }})
                    <!-- Assuming you have a method getTagIconUrl that provides the URL for the category icon -->
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

        const filterPostUrl = `${window.site?.domain ? window.site.domain : ''}/wp-json/wp/v2/${filterPostType.value}?_embed&per_page=${perPage}&offset=${offset}&_category_image=true`;
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
            fetchData(offset + perPage);
        }

        showLoadingMessage.value = false;
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
    const tag = uniqueTags.value[index];
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
 * Clears all selected tags and resets the filter.
 */
const clearFilters = () => {
    selectedTag.value = null;
    
    // Scroll to the element with id 'tag-filter-container'
    const tagFilterContainerElement = document.getElementById('tag-filter-container');
    if (tagFilterContainerElement) {
        tagFilterContainerElement.scrollIntoView({ behavior: 'smooth' });
    }
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
    const postWithCategory = filterPosts.value.find((post) => post.item_tag.includes(tag));

    if (postWithCategory && postWithCategory.category_image) {
        const categoryImage = postWithCategory.category_image.find((image) => image);
        return categoryImage || null;
    }

    return null;
};

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


/**
 * Computed property that extracts unique tags from the fetched posts.
 *
 * Iterates through the `filterPosts` array, collecting unique tags from the `item_tag` property of each post.
 * Excludes the tag 'Actions we are taking' from the result.
 *
 * @returns {string[]} An array of unique tags sorted alphabetically.
 */
const uniqueTags = computed(() => {
    const categories = new Set();
    filterPosts.value.forEach((post) => {
        const itemTags = post.item_tag || [];
        itemTags.forEach((tag) => {
            if ('Actions we are taking' !== tag) {
                categories.add(tag);
            }
        });
    });
    return [...categories].sort(); // Sort the categories alphabetically
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
 * Executes the provided callback function when the component is mounted and the DOM is is fully loaded/inserted
 * into the DOM. If the DOM is already ready when the component is mounted, it immediately fetches data 
 * if `window.site?.domain` is truthy. Otherwise, it waits for the DOM to be fully loaded before fetching data 
 * if `window.site?.domain` is truthy.
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

    // Fetch data and handle the hash after fetching
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

    if (isDOMReady() && window.site?.domain) {
        fetchData().then(() => {
            handleHash();
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.site?.domain) {
                fetchData().then(() => {
                    handleHash();
                });
            }
        });
    }

    showLoadingMessage.value = true;
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
            outline: 2px solid currentColor !important;
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
                .wp-block-button__link {
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
                display: flex;
                justify-content: center;
                align-items: center;

                &:hover,
                &:focus-visible {
                    outline: 2px solid var(--wp--preset--color--secondary-brand) !important;
                    outline-offset: 2px;
                    display: flex !important;
                }
            }
        }
    }
}
</style>