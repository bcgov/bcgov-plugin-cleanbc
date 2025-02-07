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
		$post_types = [ 'page', 'post', 'definitions', 'incentives' ];

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

	/**
     * Removes content inside elements with specific classes from search results excerpts.
     *
     * This function ensures that search results do not include text inside elements with
     * the specified classes, while still providing a valid excerpt from the rest of the content.
     *
     * @param string $content The post content.
     * @return string The filtered content with hidden elements removed.
     */
	public function bcgov_filter_content_for_search( $content ) {
		if ( is_search() && ! empty( $content ) ) {
			// List of classes to exclude from the excerpt.
			$excluded_classes = [ 'hide-from-search', 'sticky-side-nav' ];

			$class_pattern   = implode( '|', array_map( 'preg_quote', $excluded_classes ) );
			$pattern_hidden  = '/<([a-z0-9\-]+)(?=[^>]*\bclass=["\'][^"\']*(' . $class_pattern . ')[^"\']*["\'])[^>]*>.*?<\/\1>/is';
			$cleaned_content = preg_replace( [ $pattern_hidden ], '', $content );

			// Ensure there's still valid excerpt content.
			if ( empty( trim( wp_strip_all_tags( $cleaned_content ) ) ) ) {
				return wp_trim_words( $content, 40, '...' );
			}

			return $cleaned_content;
		}

		return $content;
	}

	/**
	 * Ensures the search excerpt is generated from filtered content.
	 *
	 * This function intercepts the excerpt before it is displayed in search results,
	 * ensuring it comes from cleaned content with hidden elements removed.
	 *
	 * @param string  $excerpt The post excerpt.
	 * @param WP_Post $post The post object.
	 * @return string The cleaned excerpt.
	 */
	public function bcgov_filter_excerpt_for_search( $excerpt, $post ) {
		if ( is_search() && $post->post_content ) {
			$cleaned_content = apply_filters( 'the_content', $post->post_content );

			return wp_trim_words( $cleaned_content, 40, '...' );
		}

		return $excerpt;
	}
}
