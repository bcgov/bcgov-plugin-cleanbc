<template>
  <div v-if="uniqueTags.length > 1" class='tag-filter-container'>
    <div class="taxonomy-common_component_category wp-block-post-terms" style="float:left;">
      <div v-for="tag, index in uniqueTags" :key="tag" class="tag-checkbox">
        <input type="checkbox" :id="'tag-' + index" :value="tag" v-model="selectedTags" class="tag-input" />
        <label :for="tag" class="tag-label tag" tabindex="0" @click="checkTag(index)"
          @keydown.enter.prevent="checkTag(index)" role="button" :aria-label="getTagAriaLabel(tag)">
          {{ tag }}
        </label>

      </div>
    </div>
    <button class="clear-filters" @click="clearFilters" @keydown.enter.prevent='clearFilters'>Reset filters</button>
    <span class='num-available'>{{ filteredPosts.length }} of {{ posts.length }} showing</span>
  </div>

  <div v-if="filteredPosts.length > 0" class="alignfull wp-block-columns card-container">
    <div class="wp-block-query vue-card-container">
      <ul class="is-flex-container wp-block-post-template" :class="`columns-${columns}`">

        <li v-for="post in filteredPosts" :key="post.id" class="filter-card common-component">

          <a :href="post.link" class="card-title-link">
            <div
              class="vue-card-content is-layout-constrained wp-block-group common-component-group flex-card has-white-background-color has-background">

              <h3 style="margin-bottom:0;margin-top:var(--wp--preset--spacing--20);"
                class="has-text-color has-secondary-brand-color is-style-default wp-block-post-title card-title">
                {{ post.title.rendered }}</h3>

              <p style="font-size:1rem;"><span class="value" v-html='post.excerpt.rendered'>

                </span></p>

              <div v-if="post.item_tag" class="taxonomy-common_component_category wp-block-post-terms vue-card-tags">
                <span v-for="tag in post.item_tag" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <p v-else-if="showMessage" class="no-results" v-show="showMessage" aria-live='polite'>Oops, no WCAG results found. <a
      href="#" @click.prevent="clearFilters" @keydown.enter.prevent='clearFilters'>Try resetting your filters</a> and
    refining your selections.</p>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const postType = 'posts';
// const postType = 'wcag-card';
const posts = ref([]);
const selectedTags = ref([]);
const cssClass = ref('');
const columns = ref(3);
const showMessage = ref(false);

const fetchData = async () => {
  const url = `/wp-json/wp/v2/${postType}?_embed&per_page=100`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('An error has occurred: ' + response.status);
    }
    const postsData = await response.json();
    console.log(postsData)
    posts.value = postsData.map((post) => ({
      ...post,
      item_tag: post._embedded?.['wp:term']?.flatMap((term) => term.map((t) => t.name)) || [],
    }));
  } catch (error) {
    console.error(error);
  }
};

const checkTag = (index) => {
  const tag = uniqueTags.value[index];
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const getTagAriaLabel = (tag) => {
  return `${tag} filter ${selectedTags.value.includes(tag) ? 'selected' : 'deselected'}`;
};

const clearFilters = () => {
  selectedTags.value = [];
};

const uniqueTags = computed(() => [...new Set(posts.value.flatMap((post) => post.item_tag || []))]);
const filteredPosts = computed(() => {
  console.log(posts.value)
  if (!selectedTags.value.length) {
    return posts.value;
  } else {
    return posts.value.filter((post) =>
      post.item_tag && post.item_tag.length && selectedTags.value.every((tag) => post.item_tag.includes(tag))
    );
  }
});

onMounted(() => {
  fetchData();

  const appElement = document.getElementById('app');
  cssClass.value = appElement.getAttribute('class');
  columns.value = parseInt(appElement.getAttribute('data-columns'));

  setTimeout(() => {
    showMessage.value = true;
  }, 3000);
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

  .card-title-link:hover {
    outline: 0 ;
    border-radius: 1rem ;

    .vue-card-content {
      outline: 2px solid var(--wp--preset--color--primary-brand);
    }
  }

  .filter-card {
    list-style-type: none !important;
    box-shadow: rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px;
    border-radius: 1rem;
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
  border-radius: 1rem;
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

.no-results {
  color: var(--wp--preset--color--primary-brand);
  padding: 0.66rem;

  a {
    color: #8b0000;
  }
}

.num-available {
  color: #666;
  font-size: 0.9rem;
}

.tag {
  background-color: var(--wp--preset--color--background);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  height: 25px;
  padding: 3px 8px 0;
  text-align: center;
  white-space: nowrap;
}

.tag-checkbox {
  label {
    background: var(--wp--preset--color--secondary-brand);
    color: white;
    padding-bottom: 4px;

    &:hover {
      background-color: var(--wp--preset--color--background);
      color: #313132;
    }
  }

  .tag {
    font-size: 1rem;

    &.tag-label {
      padding: 0.33rem 0.66rem;

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
  margin: 2rem 0.33rem 2rem 0;
}

.tag-input:checked+.tag {
  background-color: #dfe7ed;
  color: #000;
  outline: 2px solid var(--wp--preset--color--primary-brand);
  outline-offset: -1px;
}


.tag-input {
  display: none !important;

  &:checked+.tag {
    background-color: var(--wp--preset--color--background);
    color: #313132;
  }
}

.taxonomy-common_component_category {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: flex-start;
}

.vue-card-container {
  width: 100%;

  .vue-card-content {
    border-radius: 1rem !important;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;

    >* {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }

  .vue-card-tags {
    margin-top: auto;

    .tag {
      border: none !important;
    }
  }

  .vue-reset-button {
    font-size: 1rem;
    padding: 11px;
    margin-top: -7px;
    margin-left: 9px;
  }
}

/* Begin wp-block-post-template-inline-css */
.wp-block-post-template {
  margin-top: 0;
  margin-bottom: 0;
  max-width: 100%;
  list-style: none;
  padding: 0
}

.wp-block-post-template.wp-block-post-template {
  background: none
}

.wp-block-post-template.is-flex-container {
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25em
}

.wp-block-post-template.is-flex-container li {
  margin: 0;
  width: 100%
}

@media (min-width: 600px) {
  .wp-block-post-template.is-flex-container.is-flex-container.columns-2>li {
    width: calc(50% - .625em)
  }

  .wp-block-post-template.is-flex-container.is-flex-container.columns-3>li {
    width: calc(33.33333% - .83333em)
  }

  .wp-block-post-template.is-flex-container.is-flex-container.columns-4>li {
    width: calc(25% - .9375em)
  }

  .wp-block-post-template.is-flex-container.is-flex-container.columns-5>li {
    width: calc(20% - 1em)
  }

  .wp-block-post-template.is-flex-container.is-flex-container.columns-6>li {
    width: calc(16.66667% - 1.04167em)
  }
}

/* End wp-block-post-template-inline-css */
</style>