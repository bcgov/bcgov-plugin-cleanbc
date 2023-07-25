<?php

/**
 * Plugin Name: CleanBC BCGov Block Theme Frontend Enhancements
 * Description: A plugin to load custom blocks, scripts, styles and theme settings to augment the default BCGov Block Theme capabilities. Also enables VueJS Actions filtering.
 * Version: 1.0.1
 * Author: Nate King
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Repository: https://github.com/codewisenate/BCGov-Block-Theme-Helper-Plugin
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit('Direct access denied.');
}

/**
 * Load public and admin assets.
 * 
 * @return void
 */
function custom_assets_loader_plugin() {

    $plugin_dir = plugin_dir_path(__FILE__);
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob($assets_dir . 'public*.css');
    $public_js_files = glob($assets_dir . 'public*.js');

    $admin_css_files = glob($assets_dir . 'admin*.css');
    $admin_js_files = glob($assets_dir . 'admin*.js');

    // Load public CSS and JS files
    if (!is_admin()) {
        
        $javascript_variables = set_javascript_variables();
        wp_localize_script( 'custom-public-plugin-js', 'plugin', $javascript_variables );
        
        foreach ($public_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('custom-public-' . basename($file, '.css'), $file_url);
        }

        foreach ($public_js_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_script('custom-public-' . basename($file, '.js'), $file_url, [], false, true);
        }

    } else {
        // Load admin CSS and JS files
        foreach ($admin_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('custom-admin-' . basename($file, '.css'), $file_url);
        }

        foreach ($admin_js_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_script('custom-admin-' . basename($file, '.js'), $file_url, [], false, true);
        }
    }
}

add_action('wp_enqueue_scripts', 'custom_assets_loader_plugin');
add_action('admin_enqueue_scripts', 'custom_assets_loader_plugin');

/**
 * Additional JS variables.
 *
 * @example Sets array values for use in globally scoped JS.
 * @return array
 */
function set_javascript_variables() {

    $javascript_variables = [
        'domain'=> home_url(),
    ];

    return $javascript_variables;
}

/**
 * Load the Override theme.json and update the provided theme.json object.
 * 
 * Retrieves the contents of the 'theme.json' file contains configuration settings for the current theme.
 * 
 * @return object The updated theme.json object.
 */
function filter_theme_json_theme_plugin($theme_json) {

    $plugin_theme_json_path = trailingslashit(plugin_dir_path(__FILE__)) . 'theme/theme.json';
    $plugin_theme_json = json_decode(file_get_contents($plugin_theme_json_path), true);

    return $theme_json->update_with($plugin_theme_json);
}

add_filter('wp_theme_json_data_theme', 'filter_theme_json_theme_plugin');


// VUE APP

/**
 * Register block to load the Vue.js app.
 */
function vuejs_wordpress_block_plugin() {
    wp_enqueue_script(
        'vuejs-wordpress-block',
        plugin_dir_url(__FILE__) . 'blocks/post-filter/post-filter-vue-block.js',
        array('wp-blocks', 'wp-element', 'wp-editor')
    );
}

add_action('enqueue_block_editor_assets', 'vuejs_wordpress_block_plugin');

/**
 * Load VueJS app assets onto the client.
 */
function vuejs_app_plugin() {
    // Check if the current page contains the block
    if (has_block('cleanbc-bcgov-block-theme-plugin/post-filter-block')) {
        $plugin_dir = plugin_dir_path(__FILE__);
        $assets_dir = $plugin_dir . 'dist/assets/';

        $public_css_files = glob($assets_dir . 'vue*.css');
        // $public_js_files = glob( $assets_dir . 'vue*.js' );

        if (is_admin()) {
            foreach ($public_css_files as $file) {
                $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
                wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
            }
        }
    }
}

add_action('enqueue_block_editor_assets', 'vuejs_app_plugin');

/**
 * Load VueJS app assets when the block is on the page.
 *
 * @param array $attributes The block attributes.
 * @return string The HTML output for the block.
 */
function vuejs_app_dynamic_block_plugin($attributes) {
   
    $plugin_dir = plugin_dir_path(__FILE__);
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob($assets_dir . 'vue*.css');
    $public_js_files = glob($assets_dir . 'vue*.js');

    foreach ($public_css_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
    }

    foreach ($public_js_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, [], false, true);
    }

    // Set up the attributes passed to the Vue frontend, with defaults
    $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;  // Fallback to '3' if not set
    $className = isset($attributes['className']) ? $attributes['className'] : '';
    $postType = isset($attributes['postType']) ? $attributes['postType'] : 'posts';
    $postTypeLabel = isset($attributes['postTypeLabel']) ? $attributes['postTypeLabel'] : 'Posts';
    $headingSize = isset($attributes['headingSize']) ? $attributes['headingSize'] : 'h3';
    $headingLinkActive = isset($attributes['headingLinkActive']) ? $attributes['headingLinkActive'] : 'false';
    $useExcerpt = isset($attributes['useExcerpt']) ? $attributes['useExcerpt'] : 'excerpt';

    // Add the 'data-columns' attribute to the output div
    return '<div id="app" class="' . esc_attr($className) . '" data-columns="' . esc_attr($columns) . '" data-post-type="' . esc_attr($postType) . '"  data-heading-size="' . esc_attr($headingSize) . '" data-heading-link-active="' . esc_attr($headingLinkActive) . '" data-use-excerpt="' . esc_attr($useExcerpt) . '" data-post-type-label="' . esc_attr($postTypeLabel) . '">Loading...</div>';
}

/**
 * Initialize the VueJS app block.
 */
function vuejs_app_block_init_plugin() {
    register_block_type('cleanbc-bcgov-block-theme-plugin/post-filter-block', [
        'render_callback' => 'vuejs_app_dynamic_block_plugin',
    ]);
}

add_action('init', 'vuejs_app_block_init_plugin');
