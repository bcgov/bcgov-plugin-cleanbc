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
			'cleanbc-plugin/post-filter-block',
			plugin_dir_url(__DIR__) . 'blocks/vue-blocks/post-filter-vue-block.js',
			['wp-blocks', 'wp-element', 'wp-editor']
		);

		wp_enqueue_script(
			'cleanbc-plugin/vehicle-filter-block',
			plugin_dir_url(__DIR__) . 'blocks/vue-blocks/vehicle-filter-vue-block.js',
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
	public function vuejs_post_filter_app_dynamic_block_plugin($attributes) {

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
		return '<div id="postFilterApp" class="' . esc_attr($className) . '" data-columns="' . esc_attr($columns) . '" data-post-type="' . esc_attr($postType) . '"  data-heading-size="' . esc_attr($headingSize) . '" data-heading-link-active="' . esc_attr($headingLinkActive) . '" data-use-excerpt="' . esc_attr($useExcerpt) . '" data-post-type-label="' . esc_attr($postTypeLabel) . '">Loading...</div>';
	}

	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_vehicle_filter_app_dynamic_block_plugin($attributes) {

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
		$className = isset($attributes['className']) ? $attributes['className'] : '';

		// Add the 'data-columns' attribute to the output div
		return '<div id="vehicleFilterApp" class="' . esc_attr($className) . '">Loading...</div>';
	}

	/**
	 * Initialize the VueJS app blocks.
	 */
	public function vuejs_app_block_init_plugin()
	{
		register_block_type('cleanbc-plugin/post-filter-block', [
			'render_callback' => [$this, 'vuejs_post_filter_app_dynamic_block_plugin']
		]);

		register_block_type('cleanbc-plugin/vehicle-filter-block', [
			'render_callback' => [$this, 'vuejs_vehicle_filter_app_dynamic_block_plugin']
		]);
	}

	/**
     * Return ACF fields for vehiclepost content type.
     *
     * @return array
     */
	public function custom_api_post_filter_callback() {
		$args = array(
			'post_type'      => 'project',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);
	
		$projects = new \WP_Query($args);
	
		$posts_data = [];
	
		foreach ($projects->posts as $post) {
			$categories = wp_get_post_categories($post->ID, array('fields' => 'all'));
	
			$categories_data = array();
			foreach ($categories as $category) {
				$categories_data[] = array(
					'id'   => $category->term_id,
					'name' => $category->name,
					'slug' => $category->slug,
				);
			}

			$content = apply_filters('the_content', $post->post_content);

			if (!empty($post->post_excerpt)) {
				$excerpt = apply_filters('the_excerpt', $post->post_excerpt);
			} else {
				$excerpt = wp_trim_words($content, 30, '...'); // Generate excerpt with 20 words
			}
	
			$posts_data[] = (object) array(
				'id'         => $post->ID,
				'title'      => $post->post_title, 
				'link'       => get_permalink($post->ID),
				'content'    => $content, 
				'excerpt'    => $excerpt, 
				'categories' => $categories_data,
			);
		}
	
		return $posts_data;
	}
	

	/**
     * Return ACF fields for vehiclepost content type.
     *
     * @return array
     */
	public function custom_api_vehicle_filter_callback() {
        $args = array(
			'post_type'      => 'vehiclepost',
            'posts_per_page' => -1,
			'post_status'    => 'publish',
        );

        $vehicles = new \WP_Query( $args );

        foreach ( $vehicles->posts as $vehicle ) {

            $posts_data[] = (object) array(
                'id'                => $vehicle->ID,
                'make'              => $vehicle->make,
                'model'             => $vehicle->model,
                'vehicle_class'     => $vehicle->vehicle_class,
                'minMsrp'           => (int) $vehicle->minMsrp,
                'maxMsrp'           => (int) $vehicle->maxMsrp,
                'rebate_provincial' => (int) $vehicle->rebate_provincial,
                'rebate_federal'    => (int) $vehicle->rebate_federal,
                'rangeElectricKm'   => (int) $vehicle->rangeElectricKm,
                'rangeFullKm'       => (int) $vehicle->rangeFullKm,
                'type'              => $vehicle->vehicle_type,
                'url'               => $vehicle->url,
                'image'             => get_field( 'vehicle_image', $vehicle->ID ),
                'post_url'          => get_permalink( $vehicle->ID ),
            );
        }
        return $posts_data;
	}

	/**
     * Sets up route and callback for custom endpoint.
     *
     * @return void
     */
	public function custom_api_posts_routes() {
		register_rest_route(
            'custom/v1',
            '/actions',
            array(
                'methods'             => 'GET',
                'callback'            => [ $this, 'custom_api_post_filter_callback' ],
                'permission_callback' => '__return_true',
            )
        );

        register_rest_route(
            'custom/v1',
            '/vehicles',
            array(
                'methods'             => 'GET',
                'callback'            => [ $this, 'custom_api_vehicle_filter_callback' ],
                'permission_callback' => '__return_true',
            )
        );
    }

	/**
	 * Appends a custom block category "CleanBC Plugin.".
	 *
	 * @param array $block_categories An array of block categories.
	 * @param object $editor_context The editor context, which may include a post object.
	 * @return array The modified array of block categories.
	 */
	public function custom_block_categories( $block_categories, $editor_context ) {
		if ( ! empty( $editor_context->post ) ) {
			array_push(
				$block_categories,
				array(
					'slug'  => 'plugin',
					'title' => __( 'CleanBC Plugin', 'plugin' ),
					'icon'  => null,
				)
			);
		}
		return $block_categories;
	}

	
}
