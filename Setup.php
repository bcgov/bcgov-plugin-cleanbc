<?php

namespace Bcgov\Plugin\CleanBC;

use Bcgov\Plugin\CleanBC\Hooks\{
    EnqueueAndInject,
    EnableVueApp,
    SearchContext,
};

/**
 * Initialization and setup of theme utilising an auto-loader.
 *
 * @since 1.0.1
 *
 * @package Bcgov/Theme/Block
 */
class Setup
{
    /**
     * Constructor.
     */
    public function __construct()
    {

        $plugin_enqueue_and_inject = new EnqueueAndInject();
        $plugin_enable_vue_app = new EnableVueApp();
        $plugin_search = new SearchContext();

        // Filters.
        add_filter('wp_theme_json_data_theme', [$plugin_enqueue_and_inject, 'filter_theme_json_theme_plugin']);
        add_filter('get_the_date', [$plugin_search, 'bcgov_modify_search_result_date'], 10, 2);

        // Actions.
        add_action('pre_get_posts', [$plugin_search, 'bcgov_included_post_types_in_search']);
        add_action('wp_enqueue_scripts', [$plugin_enqueue_and_inject, 'bcgov_plugin_enqueue_scripts']);
        add_action('admin_enqueue_scripts', [$plugin_enqueue_and_inject, 'bcgov_plugin_enqueue_admin_scripts']);
        add_action('enqueue_block_editor_assets', [$plugin_enable_vue_app, 'vuejs_wordpress_block_plugin']);
        add_action('wp_enqueue_scripts', [$plugin_enable_vue_app, 'vuejs_app_plugin']);
        add_action('admin_enqueue_scripts', [$plugin_enable_vue_app, 'vuejs_app_plugin']);
        add_action('init', [$plugin_enable_vue_app, 'vuejs_app_block_init_plugin']);
    }
}
