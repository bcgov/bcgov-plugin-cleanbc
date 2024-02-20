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
		if ( $query->is_search() && ! is_admin() && $query->is_main_query() ) {
			$query->set( 'post_type', [ 'page', 'post' ] );
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
