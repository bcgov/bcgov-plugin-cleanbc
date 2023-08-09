<?php

namespace Bcgov\Plugin\CleanBC\Hooks;

/**
 * Sets up VueJS based applications.
 *
 * @since 1.0.1
 *
 * @package Bcgov\Plugin\CleanBC
 */
class EnableVueApp {

	/**
	 * Register block to load the Vue.js app.
	 */
	public function vuejs_wordpress_block_plugin() {
		wp_enqueue_script(
			'vuejs-wordpress-block',
			plugin_dir_url(__DIR__) . 'blocks/post-filter/post-filter-vue-block.js',
			['wp-blocks', 'wp-element', 'wp-editor']
		);
	}

	/**
	 * Load VueJS app assets onto the client.
	 */
	public function vuejs_app_plugin() {
		// Check if the current page contains the block
		if (has_block('cleanbc-plugin/post-filter-block')) {
			$plugin_dir = plugin_dir_path(__DIR__);
			$assets_dir = $plugin_dir . 'dist/assets/';
			
			$public_css_files = glob($assets_dir . 'vue*.css');
			// $public_js_files = glob( $assets_dir . 'vue*.js' );
			
			if (is_admin()) {
				foreach ($public_css_files as $file) {
					$file_url = plugins_url(str_replace($plugin_dir, '', $file), __DIR__);
					wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
				}
			}
		}
	}

	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_app_dynamic_block_plugin($attributes) {

		$plugin_dir = plugin_dir_path(__DIR__);
		$assets_dir = $plugin_dir . 'dist/assets/';

		$public_css_files = glob($assets_dir . 'vue*.css');
		$public_js_files = glob($assets_dir . 'vue*.js');

		foreach ($public_css_files as $file) {
			$file_url = plugins_url(str_replace($plugin_dir, '', $file), __DIR__);
			wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
		}

		foreach ($public_js_files as $file) {
			$file_url = plugins_url(str_replace($plugin_dir, '', $file), __DIR__);
			wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, ['bcgov-block-theme-public'], false, true); // Sets the dependency to Block Theme to enqueue after
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
	public function vuejs_app_block_init_plugin()
	{
		register_block_type('cleanbc-plugin/post-filter-block', [
			'render_callback' => [$this, 'vuejs_app_dynamic_block_plugin']
		]);
	}
}
