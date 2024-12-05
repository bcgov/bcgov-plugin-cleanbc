<?php

namespace Bcgov\Plugin\CleanBC\Hooks;

/**
 * The SearchContext class provides methods for modifying the search query context in WordPress.
 *
 * @since 1.0.7
 *
 * @package Bcgov\Plugin\CleanBC
 */
class SearchContext {

	/**
	 * Include which post types are included in search results.
	 *
	 * @since 1.0.7
	 *
	 * @param param $query – object representing the current query.
	 * @return void
	 */
	public function bcgov_included_post_types_in_search( $query ) {
		// Default post types.
		$post_types = [ 'page', 'post' ];

		$site_url = home_url(); // Base URL (e.g., https://test.vanity.blog.gov.bc.ca).
        $path     = untrailingslashit( $_SERVER['REQUEST_URI'] ); // Path (e.g., /betterbuildingsbc).

		if ( strpos( $site_url, 'betterhomesbc.ca' ) !== false || strpos( $path, 'betterhomesbc' ) !== false ) {
		    $post_types = array_merge( $post_types, [ 'faqs', 'incentives', 'project', 'products' ] );
		}

		if ( strpos( $site_url, 'betterbuildingsbc.ca' ) !== false || strpos( $path, 'betterbuildingsbc' ) !== false ) {
		    $post_types = array_merge( $post_types, [ 'definitions', 'faqs', 'incentives', 'project', 'products' ] );
		}

		if ( $query->is_search() && ! is_admin() && $query->is_main_query() ) {
			$query->set( 'post_type', $post_types );
		}
	}

	/**
	 * Modify search results post date to include the post type.
	 *
	 * @since 1.0.7
	 *
	 * @param string  $date The original post date of the search result.
	 * @param WP_Post $post The post object.
	 * @return string Modified post date.
	 */
	public function bcgov_modify_search_result_date( $date, $post ) {
		if ( is_search() ) {
			$post_type = get_post_type( $post );
			if ( $post_type ) {
				$date = "$date | $post_type";
			}
		}
		return $date;
	}
}
