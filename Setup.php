<?php

namespace Bcgov\Plugin\CleanBC;

use Bcgov\Plugin\CleanBC\Hooks\{
    EnqueueAndInject,
    EnableVueApp,
    SearchContext,
    BasicBlocks
};

/**
 * Initialization and setup of theme utilising an auto-loader.
 *
 * @since 1.0.1
 *
 * @package Bcgov/Theme/Block
 */
class Setup {
	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	public static $plugin_name = 'cleanbc';

	/**
	 * Human-readable title of this plugin.
	 *
	 * @var string $plugin_title The string containing the human-readable title of this plugin.
	 */
	public static $plugin_title = 'BCGov CleanBC';

    /**
     * The plugin root directory.
     *
     * @var string $plugin_dir The path to this plugin's root directory.
     */
    public static $plugin_dir = WP_PLUGIN_DIR . '/bcgov-plugin-cleanbc/';

    /**
     * Constructor.
     */
    public function __construct() {

        $plugin_enqueue_and_inject = new EnqueueAndInject();
        $plugin_enable_vue_app     = new EnableVueApp();
        $plugin_search             = new SearchContext();
        $basic_blocks              = new BasicBlocks();

        // Filters.
        add_filter( 'wp_theme_json_data_theme', [ $plugin_enqueue_and_inject, 'filter_theme_json_theme_plugin' ] );
        add_filter( 'get_the_date', [ $plugin_search, 'bcgov_modify_search_result_date' ], 10, 2 );
        add_filter( 'block_categories_all', [ $plugin_enable_vue_app, 'custom_block_categories' ], 10, 2 );
        add_filter( 'body_class', [ $plugin_enqueue_and_inject, 'add_cleanbc_class_to_body' ] );
        add_filter( 'wp_script_attributes', [ $plugin_enable_vue_app, 'add_script_type_attribute' ], 10, 2 );

	    add_filter( 'the_content', [ $plugin_search, 'bcgov_filter_content_for_search' ], 1 );
        add_filter( 'get_the_excerpt', [ $plugin_search, 'bcgov_filter_excerpt_for_search' ], 10, 2 );
        add_filter( 'wp_trim_excerpt', [ $plugin_search, 'bcgov_filter_excerpt_for_search' ], 10, 2 );

        // Actions.
        add_action( 'pre_get_posts', [ $plugin_search, 'bcgov_included_post_types_in_search' ] );
        add_action( 'wp_enqueue_scripts', [ $plugin_enqueue_and_inject, 'bcgov_plugin_enqueue_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $plugin_enqueue_and_inject, 'bcgov_plugin_enqueue_admin_scripts' ] );
        add_action( 'enqueue_block_editor_assets', [ $plugin_enable_vue_app, 'vuejs_wordpress_block_plugin' ] );
        add_action( 'wp_enqueue_scripts', [ $plugin_enable_vue_app, 'vuejs_app_plugin' ] );
        add_action( 'admin_enqueue_scripts', [ $plugin_enable_vue_app, 'vuejs_app_plugin' ] );
        add_action( 'init', [ $plugin_enable_vue_app, 'vuejs_app_block_init_plugin' ] );
        add_action( 'rest_api_init', [ $plugin_enable_vue_app, 'custom_api_posts_routes' ] );
    }

    /**
	 * Get asset information including path to dist folder, asset dependencies and version.
	 *
	 * @since   1.0.0
	 * @param   string $name Name of the asset (usually 'admin' or 'public').
     * @param   string $folder The name of the folder with the asset. Normally 'dist'.
	 * @return  array
	 */
	public static function get_asset_information( string $name, string $folder = 'dist' ): array {
		$dist_path       = self::$plugin_dir . $folder . '/';
        $dist_url        = plugins_url( '', $dist_path ) . '/' . $folder . '/';
        $asset_file_path = $dist_path . $name . '.asset.php';
        $dependencies    = [];
        $version         = false;

        if ( file_exists( $asset_file_path ) ) {
			$asset        = require $asset_file_path;
            $dependencies = $asset['dependencies'];
            $version      = $asset['version'];
        }

        return [
            'handle'       => self::$plugin_name . '-' . $name,
            'dist_url'     => $dist_url,
            'dependencies' => $dependencies,
            'version'      => $version,
        ];
	}
}
