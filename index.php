<?php
/**
 * Plugin Name: BCGov Block Theme Supplemental: CleanBC
 * Description: A plugin to load custom blocks, scripts, styles and theme settings to augment the default BCGov Block Theme capabilities on the Clean BC and Go Electric BC websites. Also enables Vue-based posts filtering.
 * Version: 1.17.2
 * Author: Nate King
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Repository: https://github.com/codewisenate/BCGov-Block-Theme-Helper-Plugin
 *
 * @package Bcgov\Plugin\CleanBC
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit( 'Direct access denied.' );
}

// Include the Loader and Setup classes.
require_once plugin_dir_path( __FILE__ ) . '/Loader.php';
require_once plugin_dir_path( __FILE__ ) . '/Setup.php';

if ( class_exists( 'Bcgov\\Plugin\\CleanBC\\Loader' ) ) {
    $base_dir = plugin_dir_path( __FILE__ ) . '/';
    $loader   = new Bcgov\Plugin\CleanBC\Loader( [ $base_dir ] ); // Pass the base directory as an array.
    $loader->register();

    $local_composer  = __DIR__ . '/vendor/autoload.php';
    $server_composer = __DIR__ . '/../../../../vendor/autoload.php';
    if ( file_exists( $local_composer ) || file_exists( $server_composer ) ) {
        if ( file_exists( $server_composer ) ) {
            require_once $server_composer;
        }
        if ( file_exists( $local_composer ) ) {
            require_once $local_composer;
        }
    }
}

if ( class_exists( 'Bcgov\\Plugin\\CleanBC\\Setup' ) ) {
    new Bcgov\Plugin\CleanBC\Setup();
}
