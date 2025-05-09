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

		$plugin_dir     = plugin_dir_path( __DIR__ );
		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		wp_enqueue_script(
			'cleanbc-plugin/post-filter-block',
			plugin_dir_url( __DIR__ ) . 'blocks/vue-blocks/post-filter-vue-block.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$latest_version,
			true
		);

		wp_enqueue_script(
			'cleanbc-plugin/vehicle-filter-block',
			plugin_dir_url( __DIR__ ) . 'blocks/vue-blocks/vehicle-filter-vue-block.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$latest_version,
			true
		);

		wp_enqueue_script(
			'cleanbc-plugin/betterhomes-pqea-filter-block',
			plugin_dir_url( __DIR__ ) . 'blocks/vue-blocks/betterhomes-pqea-vue-block.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$latest_version,
			true
		);

		wp_enqueue_script(
			'cleanbc-plugin/betterhomes-contractor-filter-block',
			plugin_dir_url( __DIR__ ) . 'blocks/vue-blocks/betterhomes-contractor-vue-block.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$latest_version,
			true
		);

		wp_enqueue_script(
			'cleanbc-plugin/betterhomes-rebate-filter-block',
			plugin_dir_url( __DIR__ ) . 'blocks/vue-blocks/betterhomes-rebate-vue-block.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$latest_version,
			true
		);

		wp_enqueue_script(
			'cleanbc-plugin/betterhomes-faqs-filter-block',
			plugin_dir_url( __DIR__ ) . 'blocks/vue-blocks/betterhomes-faqs-vue-block.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor' ],
			$latest_version,
			true
		);
	}



	/**
	 * Add/modify the enqueued scripts attributes. From https://stackoverflow.com/a/77863823
	 *   Specifically change the type to 'module' for the Vue includes. Used for Vue/Vite to be loaded as a module and not override the global namespace.
	 *
	 * @param array $attributes The attributes already set when the hook is called.
	 * @return array $attributes The modified attributes
	 */
	public function add_script_type_attribute( $attributes ) {
		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$public_js_files = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_js_files as $file ) {
			if ( isset( $attributes['id'] ) && 'vue-app-' . basename( $file, '.js' ) . '-js' === $attributes['id'] ) {
				$attributes['type'] = 'module';
			}
		}

		return $attributes;
	}

	/**
	 * Load VueJS app assets onto the client.
	 */
	public function vuejs_app_plugin() {
		// Check if the current page contains the block.
		if ( has_block( 'cleanbc-plugin/post-filter-block' ) ) {
			$plugin_dir = plugin_dir_path( __DIR__ );
			$assets_dir = $plugin_dir . 'dist/assets/';

			$public_css_files = glob( $assets_dir . 'vue*.css' );

			if ( is_admin() ) {
				foreach ( $public_css_files as $file ) {
					$version  = filemtime( $file );
					$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
					wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $version );
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
	public function vuejs_post_filter_app_dynamic_block_plugin( $attributes ) {

		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		$public_css_files = glob( $assets_dir . 'vue*.css' );
		$public_js_files  = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_css_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $latest_version );
		}

		foreach ( $public_js_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], $latest_version, true ); // Sets the dependency to Block Theme to enqueue after.
		}

		// Set up the attributes passed to the Vue frontend, with defaults.
		$columns             = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
		$class_name          = isset( $attributes['className'] ) ? $attributes['className'] : '';
		$post_type           = isset( $attributes['postType'] ) ? $attributes['postType'] : 'posts';
		$post_type_label     = isset( $attributes['postTypeLabel'] ) ? $attributes['postTypeLabel'] : 'Posts';
		$heading_size        = isset( $attributes['headingSize'] ) ? $attributes['headingSize'] : 'h3';
		$heading_link_active = isset( $attributes['headingLinkActive'] ) ? $attributes['headingLinkActive'] : 'false';
		$use_excerpt         = isset( $attributes['useExcerpt'] ) ? $attributes['useExcerpt'] : 'excerpt';

		// Return the Post Filter App's container with appropriate class names and data-columns.
		return '<div id="postFilterApp" class="' . esc_attr( $class_name ) . '" data-columns="' . esc_attr( $columns ) . '" data-post-type="' . esc_attr( $post_type ) . '"  data-heading-size="' . esc_attr( $heading_size ) . '" data-heading-link-active="' . esc_attr( $heading_link_active ) . '" data-use-excerpt="' . esc_attr( $use_excerpt ) . '" data-post-type-label="' . esc_attr( $post_type_label ) . '">Loading...</div>';
	}

	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_vehicle_filter_app_dynamic_block_plugin( $attributes ) {

		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		$public_css_files = glob( $assets_dir . 'vue*.css' );
		$public_js_files  = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_css_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $latest_version );
		}

		foreach ( $public_js_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], $latest_version, true ); // Sets the dependency to Block Theme to enqueue after.
		}

		// Set up the attributes passed to the Vue frontend, with defaults.
		$class_name           = isset( $attributes['className'] ) ? $attributes['className'] : '';
		$hide_federal_rebates = isset( $attributes['hideFederalRebate'] ) && $attributes['hideFederalRebate'] ? 'true' : 'false';

		// Return the Vehicle Filter App's container with appropriate class names.
		return '<div id="vehicleFilterApp" class="' . esc_attr( $class_name ) . '" data-show-federal-rebates="' . esc_attr( $hide_federal_rebates ) . '">Loading...</div>';
	}


	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_betterhomes_pqea_filter_app_dynamic_block_plugin( $attributes ) {

		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		$public_css_files = glob( $assets_dir . 'vue*.css' );
		$public_js_files  = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_css_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $latest_version );
		}

		foreach ( $public_js_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], $latest_version, true ); // Sets the dependency to Block Theme to enqueue after.
		}

		// Set up the attributes passed to the Vue frontend, with defaults.
		$class_name    = isset( $attributes['className'] ) ? $attributes['className'] : '';
		$hide_controls = isset( $attributes['hideControls'] ) && $attributes['hideControls'] ? 'true' : 'false';

		// Return the PQEA Filter App's container with appropriate class names.
		return '<div id="pqeaFilterApp" class="' . esc_attr( $class_name ) . '" data-show-controls="' . esc_attr( $hide_controls ) . '">Loading...</div>';
	}

	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_betterhomes_contractor_filter_app_dynamic_block_plugin( $attributes ) {

		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		$public_css_files = glob( $assets_dir . 'vue*.css' );
		$public_js_files  = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_css_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $latest_version );
		}

		foreach ( $public_js_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], $latest_version, true ); // Sets the dependency to Block Theme to enqueue after.
		}

		// Set up the attributes passed to the Vue frontend, with defaults.
		$class_name    = isset( $attributes['className'] ) ? $attributes['className'] : '';
		$hide_controls = isset( $attributes['hideControls'] ) && $attributes['hideControls'] ? 'true' : 'false';

		// Return the Contractor Filter App's container with appropriate class names.
		return '<div id="contractorFilterApp" class="' . esc_attr( $class_name ) . '" data-show-controls="' . esc_attr( $hide_controls ) . '">Loading...</div>';
	}

	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_betterhomes_rebate_filter_app_dynamic_block_plugin( $attributes ) {

		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		$public_css_files = glob( $assets_dir . 'vue*.css' );
		$public_js_files  = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_css_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $latest_version );
		}

		foreach ( $public_js_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], $latest_version, true ); // Sets the dependency to Block Theme to enqueue after.
		}

		// Set up the attributes passed to the Vue frontend, with defaults.
		$class_name = isset( $attributes['className'] ) ? $attributes['className'] : '';

		// Return the Rebate Filter App's container with appropriate class names.
		return '<div id="rebateFilterApp" class="' . esc_attr( $class_name ) . '">Loading...</div>';
	}

	/**
	 * Load VueJS app assets when the block is on the page.
	 *
	 * @param array $attributes The block attributes.
	 * @return string The HTML output for the block.
	 */
	public function vuejs_betterhomes_faq_filter_app_dynamic_block_plugin( $attributes ) {

		$plugin_dir = plugin_dir_path( __DIR__ );
		$assets_dir = $plugin_dir . 'dist/assets/';

		$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
		$plugin_version = $plugin_data['Version'];
		$latest_version = $plugin_version; // Fallback to the installed version.

		$public_css_files = glob( $assets_dir . 'vue*.css' );
		$public_js_files  = glob( $assets_dir . 'vue*.js' );

		foreach ( $public_css_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $latest_version );
		}

		foreach ( $public_js_files as $file ) {
			$file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __DIR__ );
			wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], $latest_version, true ); // Sets the dependency to Block Theme to enqueue after.
		}

		// Set up the attributes passed to the Vue frontend, with defaults.
		$class_name = isset( $attributes['className'] ) ? $attributes['className'] : '';

		// Return the FAQ Filter App's container with appropriate class names.
		return '<div id="faqFilterApp" class="' . esc_attr( $class_name ) . '">Loading...</div>';
	}

	/**
	 * Initialize the VueJS app blocks.
	 */
	public function vuejs_app_block_init_plugin() {
		register_block_type(
			'cleanbc-plugin/post-filter-block',
			[
				'render_callback' => [ $this, 'vuejs_post_filter_app_dynamic_block_plugin' ],
			]
		);

		register_block_type(
			'cleanbc-plugin/vehicle-filter-block',
			[
				'render_callback' => [ $this, 'vuejs_vehicle_filter_app_dynamic_block_plugin' ],
			]
		);

		register_block_type(
			'cleanbc-plugin/betterhomes-pqea-filter-block',
			[
				'render_callback' => [ $this, 'vuejs_betterhomes_pqea_filter_app_dynamic_block_plugin' ],
			]
		);

		register_block_type(
			'cleanbc-plugin/betterhomes-contractor-filter-block',
			[
				'render_callback' => [ $this, 'vuejs_betterhomes_contractor_filter_app_dynamic_block_plugin' ],
			]
		);

		register_block_type(
			'cleanbc-plugin/betterhomes-rebate-filter-block',
			[
				'render_callback' => [ $this, 'vuejs_betterhomes_rebate_filter_app_dynamic_block_plugin' ],
			]
		);

		register_block_type(
			'cleanbc-plugin/betterhomes-faqs-filter-block',
			[
				'render_callback' => [ $this, 'vuejs_betterhomes_faq_filter_app_dynamic_block_plugin' ],
			]
		);
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

		$projects = new \WP_Query( $args );

		$posts_data = [];

		foreach ( $projects->posts as $post ) {
			$categories = wp_get_post_categories( $post->ID, array( 'fields' => 'all' ) );

			$categories_data = array();
			foreach ( $categories as $category ) {
				$categories_data[] = array(
					'id'   => $category->term_id,
					'name' => $category->name,
					'slug' => $category->slug,
				);
			}

			$content = apply_filters( 'the_content', $post->post_content );

			if ( ! empty( $post->post_excerpt ) ) {
				$excerpt = apply_filters( 'the_excerpt', $post->post_excerpt );
			} else {
				$excerpt = wp_trim_words( $content, 30, '...' ); // Generate excerpt with 30 words.
			}

			$posts_data[] = (object) array(
				'id'         => $post->ID,
				'title'      => $post->post_title,
				'link'       => get_permalink( $post->ID ),
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

			$model_year_terms = get_the_terms( $vehicle->ID, 'model_year' );

			$years = [];
			if ( ! is_wp_error( $model_year_terms ) && ! empty( $model_year_terms ) ) {
				foreach ( $model_year_terms as $term ) {
					$years[] = $term->name;
				}
			}

			$posts_data[] = (object) array(
				'id'                    => $vehicle->ID,
				'make'                  => $vehicle->make,
				'model'                 => $vehicle->model,
				'vehicle_class'         => $vehicle->vehicle_class,
				'minMsrp'               => (int) $vehicle->minMsrp,
				'maxMsrp'               => (int) $vehicle->maxMsrp,
				'rebate_provincial'     => (int) $vehicle->rebate_provincial,
				'rebate_federal'        => (int) $vehicle->rebate_federal,
				'rebate_federal_status' => ! empty( $vehicle->federal_rebate_status ) ? $vehicle->federal_rebate_status[0] : 'processed',
				'rangeElectricKm'       => (int) $vehicle->rangeElectricKm,
				'rangeFullKm'           => (int) $vehicle->rangeFullKm,
				'type'                  => $vehicle->vehicle_type,
				'url'                   => $vehicle->url,
				'image'                 => get_field( 'vehicle_image', $vehicle->ID ),
				'post_url'              => get_permalink( $vehicle->ID ),
				'year'                  => $years,
			);
		}
		return $posts_data;
	}

	/**
	 * Custom callback function for the PQEA filter in the API.
	 *
	 * This function fetches and formats data for PQEAs (Program Qualified Energy Advisors)
	 * to be used in a custom API endpoint.
	 *
	 * @return array An array of formatted data for PQEAs.
	 */
	public function custom_api_pqea_filter_callback() {
		// Set up the arguments for WP_Query.
		$args = array(
			'post_type'      => 'pqeas',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);

		// Set array of field names to be fetched.
		$renovation_details_field_names = [
			'program_qualified',
			'company_name',
			'company_website',
			'company_location',
			'contact_name',
			'email',
			'phone',
			'service_organization_name',
			'service_organization_website',
			'service_organization_name_2',
			'service_organization_website_2',
			'additional_service_organizations',
		];

		// Query PQEAs using WP_Query.
		$pqeas = new \WP_Query( $args );

		// Fetch associated meta and ACF fields on a per-post basis.
		foreach ( $pqeas->posts as $pqea ) {
			// Array for PQEA contact details.
			$details = [];

			// Get taxonomy terms.
			$pqea_project_types = get_the_terms( $pqea->ID, 'ea-project-types' );
			$pqea_locations     = get_the_terms( $pqea->ID, 'ea-locations' );
			$pqea_services      = get_the_terms( $pqea->ID, 'ea-services' );

			// Fetch ACF fields based on PQEA Project Type.
			foreach ( $renovation_details_field_names as $field_name ) {
				if ( 'renovating-a-home' === $pqea_project_types[0]->slug ) {
					$details[ $field_name ] = get_field( $field_name, $pqea->ID );
				} else {
					$details[ $field_name ] = get_field( 'res_new_' . $field_name, $pqea->ID );
				}
			}

			// Format Additional Service Organizations repeater, if any.
			if ( have_rows( 'res_new_additional_service_organizations', $pqea->ID ) ) {
				// Empty ACF's default response.
				$details['additional_service_organizations'] = [];

				// Iterate over ACF repeater subfields and add them to $details.
				while ( have_rows( 'res_new_additional_service_organizations', $pqea->ID ) ) {
					the_row();

					$details['additional_service_organizations'][] = [
						get_sub_field( 'name' ),
						get_sub_field( 'website' ),
					];
				}
			}

			// Setup post data for return at the endpoint.
			$posts_data[] = (object) array(
				'id'         => $pqea->ID,
				'title'      => get_the_title( $pqea->ID ),
				'url'        => $pqea->url,
				'post_url'   => get_permalink( $pqea->ID ),
				'categories' => $pqea_project_types[0]->name,
				'locations'  => $pqea_locations,
				'services'   => $pqea_services,
				'details'    => $details,
			);
		}

		// Return the formatted data.
		return $posts_data;
	}

	/**
	 * Custom callback function for the Contractor filter in the API.
	 *
	 * This function fetches and formats data for Contractors
	 * to be used in a custom API endpoint.
	 *
	 * @return array An array of formatted data for Contractors.
	 */
	public function custom_api_contractor_filter_callback() {
		// Set up the arguments for WP_Query.
		$args = array(
			'post_type'      => 'contractors',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);

		// Query Contractors using WP_Query.
		$contractors = new \WP_Query( $args );

		// Fetch associated meta and ACF fields on a per-post basis.
		foreach ( $contractors->posts as $contractor ) {
			// Setup post data for return at the endpoint.
			$posts_data[] = (object) array(
				'id'                   => $contractor->ID,
				'title'                => get_the_title( $contractor->ID ),
				'url'                  => $contractor->url,
				'post_url'             => get_permalink( $contractor->ID ),
				'company_name'         => get_field( 'prc_company_name', $contractor->ID ),
				'company_website'      => get_field( 'prc_company_website', $contractor->ID ),
				'head_office_location' => get_field( 'prc_head_office_location', $contractor->ID ),
				'email'                => get_field( 'prc_email', $contractor->ID ),
				'phone'                => get_field( 'prc_phone', $contractor->ID ),
				'program_designations' => get_the_terms( $contractor->ID, 'prc-program-designation' ),
				'types'                => get_the_terms( $contractor->ID, 'prc-types' ),
				'locations'            => get_the_terms( $contractor->ID, 'prc-locations' ),
			);
		}

		// Return the formatted data.
		return $posts_data;
	}

	/**
	 * Custom callback function for the Rebate filter in the API.
	 *
	 * This function fetches and formats data for Rebates
	 * to be used in a custom API endpoint.
	 *
	 * @return array An array of formatted data for Rebates.
	 */
	public function custom_api_rebate_filter_callback() {
		// Set up the arguments for WP_Query.
		$args = array(
			'post_type'      => 'incentives',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);

		// Query Rebates using WP_Query.
		$rebates = new \WP_Query( $args );

		// Fetch associated meta and ACF fields on a per-post basis.
		foreach ( $rebates->posts as $rebate ) {

			// Retrieve exclude_from_tool field (may be `null`, `true`, or `false`).
			$exclude = get_field( 'exclude_from_tool', $rebate->ID );

			if ( $exclude ) {
				continue;
			}

			// Setup post data for return at the endpoint.
			$posts_data[] = (object) array(
				'id'                  => $rebate->ID,
				'title'               => get_the_title( $rebate->ID ),
				'url'                 => $rebate->url,
				'post_url'            => get_permalink( $rebate->ID ),
				'rebate_amount'       => get_field( 'rebate', $rebate->ID ),
				'short_description'   => get_field( 'short_description', $rebate->ID ),
				'types'               => get_the_terms( $rebate->ID, 'building-types' ),
				'locations'           => get_the_terms( $rebate->ID, 'regions' ),
				'upgrade_types'       => get_the_terms( $rebate->ID, 'upgrades' ),
				'primary_heating_sys' => get_the_terms( $rebate->ID, 'primary-space-heating' ),
				'other_offers'        => get_the_terms( $rebate->ID, 'other-offers' ),
			);
		}

		// Return the formatted data.
		return $posts_data;
	}

	/**
	 * Custom callback function for the FAQ filter in the API.
	 *
	 * This function fetches and formats data for FAQs
	 * to be used in a custom API endpoint.
	 *
	 * @return array An array of formatted data for FAQs.
	 */
	public function custom_api_faq_filter_callback() {
		// Set up the arguments for WP_Query.
		$args = array(
			'post_type'      => [ 'faqs', 'products' ],
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);

		// Query FAQs using WP_Query.
		$faqs = new \WP_Query( $args );

		// Fetch associated meta and ACF fields on a per-post basis.
		foreach ( $faqs->posts as $faq ) {
			// Get taxonomy terms.
			$faq_building_types           = get_the_terms( $faq->ID, 'building-types' );
			$faq_categories               = get_the_terms( $faq->ID, 'faqs_categories' );
			$product_categories           = get_the_terms( $faq->ID, 'product_categories' );
			$faq_types                    = get_the_terms( $faq->ID, 'faq_type' );
			$additional_filter_taxonomies = [];

			$faq_content = $faq->post_content;
			$faq_content = wp_strip_all_tags( $faq_content );
			$faq_content = html_entity_decode( strtolower( $faq_content ) );
			$faq_content = str_replace( [ "\n", "\r", "\t" ], ' ', $faq_content );
			$faq_content = preg_replace( '/[^\p{L}\s]+/u', '', $faq_content );
			$faq_content = preg_replace( '/[\d\x{00BC}-\x{00BE}\x{2150}-\x{215E}]+/u', '', $faq_content );
			$faq_content = preg_replace( '/\s+/', ' ', $faq_content );

			$noise_words = [ ':', 'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves', 'description', 'serving', 'suggestions', 'instructions', 'cups', 'cup', 'tsp', 'tbsp', 'let', 'add', 'lbs' ];

			$words          = explode( ' ', $faq_content );
			$filtered_words = array_filter(
				$words,
				function ( $word ) use ( $noise_words ) {
					return ! in_array( strtolower( $word ), $noise_words, true );
				}
			);

			$faq_content_cleaned = implode( ' ', $filtered_words );
			$faq_content_cleaned = preg_replace( '/\b\w{1,2}\b/u', '', $faq_content_cleaned );
			$faq_content_cleaned = trim( preg_replace( '/\s+/u', ' ', $faq_content_cleaned ) );

			$faq_content_keywords_unique = implode( ' ', array_unique( explode( ' ', $faq_content_cleaned ) ) );

			is_array( $faq_building_types ) ? $additional_filter_taxonomies = array_merge( $additional_filter_taxonomies, $faq_building_types ) : null;
			is_array( $faq_types ) ? $additional_filter_taxonomies          = array_merge( $additional_filter_taxonomies, $faq_types ) : null;

			$all_categories                                   = [];
			is_array( $faq_categories ) ? $all_categories     = array_merge( $all_categories, $faq_categories ) : null;
			is_array( $product_categories ) ? $all_categories = array_merge( $all_categories, $product_categories ) : null;

			// Setup post data for return at the endpoint.
			$posts_data[] = (object) array(
				'id'                 => $faq->ID,
				'title'              => get_the_title( $faq->ID ),
				'url'                => $faq->url,
				'post_url'           => get_permalink( $faq->ID ),
				'building_types'     => $faq_building_types,
				'faq_types'          => $faq_types,
				'additional_filters' => $additional_filter_taxonomies,
				'categories'         => $all_categories,
				'body'               => $faq->post_content,
				'keywords'           => $faq_content_keywords_unique,
			);
		}

		// Return the formatted data.
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

		register_rest_route(
			'custom/v1',
			'/pqeas',
			array(
				'methods'             => 'GET',
				'callback'            => [ $this, 'custom_api_pqea_filter_callback' ],
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'custom/v1',
			'/contractors',
			array(
				'methods'             => 'GET',
				'callback'            => [ $this, 'custom_api_contractor_filter_callback' ],
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'custom/v1',
			'/rebates',
			array(
				'methods'             => 'GET',
				'callback'            => [ $this, 'custom_api_rebate_filter_callback' ],
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'custom/v1',
			'/faqs',
			array(
				'methods'             => 'GET',
				'callback'            => [ $this, 'custom_api_faq_filter_callback' ],
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Appends a custom block category "CleanBC Plugin.".
	 *
	 * @param array  $block_categories An array of block categories.
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
