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
	 * Order search results by optional ACF search priority, then relevance/date.
	 *
	 * @since 1.26.0
	 *
	 * @param \WP_Query $query The current query.
	 * @return void
	 */
	public function bcgov_order_search_by_priority( $query ) {
		if ( is_admin() || ! $query->is_main_query() || ! $query->is_search() ) {
			return;
		}

		if ( ! function_exists( 'acf_get_field' ) ) {
			return;
		}

		$field = acf_get_field( 'search_priority' );
		if ( empty( $field ) ) {
			return;
		}

		$meta_query                            = (array) $query->get( 'meta_query' );
		$meta_query['relation']                = 'OR';
		$meta_query['search_priority_value']   = [
			'key'     => 'search_priority',
			'compare' => 'EXISTS',
			'type'    => 'NUMERIC',
		];
		$meta_query['search_priority_missing'] = [
			'key'     => 'search_priority',
			'compare' => 'NOT EXISTS',
		];
		$query->set( 'meta_query', $meta_query );

		$query->set(
			'orderby',
			[
				'search_priority_value' => 'DESC',
				'relevance'             => 'DESC',
				'date'                  => 'DESC',
			]
		);
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
	 * @since 1.13.0
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
	 * @since 1.13.0
	 *
	 * @param string  $excerpt The post excerpt.
	 * @param WP_Post $post The post object.
	 * @return string The cleaned excerpt.
	 */
	public function bcgov_filter_excerpt_for_search( $excerpt, $post ) {

		$post = get_post( $post );

		if ( ! is_search() || ! $post ) {
			return $excerpt;
		}

		// If a manual excerpt exists, always use it (any post type).
		if ( has_excerpt( $post ) ) {
			// Optionally trim to match your current length.
			return wp_trim_words(
				wp_strip_all_tags( $post->post_excerpt ),
				40,
				'...'
			);
		}

		// Otherwise, generate from filtered content (your existing behavior).
		if ( isset( $post->post_content ) ) {
			$cleaned_content = apply_filters( 'the_content', $post->post_content );

			return wp_trim_words( $cleaned_content, 40, '...' );
		}

		return $excerpt;
	}

	/**
	 * Prepend rebates_type term to incentives titles in search results.
	 *
	 * Example:
	 *   Term: "Heat pump rebates"
	 *   Title: "For all fuel types"
	 *   Output: "Heat pump rebates for all fuel types"
	 *
	 * @since 1.25.13
	 *
	 * @param string $title   The original post title.
	 * @param int    $post_id The post ID.
	 * @return string         The modified title.
	 */
	public function bcgov_prepend_rebates_type_to_search_title( $title, $post_id ) {

		// Only touch front-end main query search results.
		if ( ! is_search() || ! in_the_loop() || ! is_main_query() ) {
			return $title;
		}

		// Limit to the "incentives" post type.
		if ( 'incentives' !== get_post_type( $post_id ) ) {
			return $title;
		}

		if ( ! function_exists( 'get_field' ) ) {
			return $title;
		}

		$rebate_types = get_field( 'rebate_types', $post_id );

		if ( empty( $rebate_types ) ) {
			return $title;
		}

		$rebate_type_name = '';

		// ACF taxonomy field can return: array of terms, IDs, or strings.
		if ( is_array( $rebate_types ) ) {
			$first = reset( $rebate_types );

			if ( $first instanceof \WP_Term ) {
				$rebate_type_name = $first->name;
			} elseif ( is_numeric( $first ) ) {
				$term = get_term( (int) $first );
				if ( $term && ! is_wp_error( $term ) ) {
					$rebate_type_name = $term->name;
				}
			} else {
				// Assume it's a label string.
				$rebate_type_name = (string) $first;
			}
		} elseif ( $rebate_types instanceof \WP_Term ) {
			$rebate_type_name = $rebate_types->name;
		} elseif ( is_string( $rebate_types ) ) {
			// If field is configured as "Return: Label".
			$rebate_type_name = $rebate_types;
		}

		if ( '' === trim( $rebate_type_name ) ) {
			return $title;
		}

		// Build "Term + original title".
		$combined = trim( $rebate_type_name . ' ' . ltrim( $title ) );

		// Convert to sentence case:
		// lower-case everything, then uppercase first character.
		$combined_lower = mb_strtolower( $combined, 'UTF-8' );
		$first_char     = mb_substr( $combined_lower, 0, 1, 'UTF-8' );
		$rest           = mb_substr( $combined_lower, 1, null, 'UTF-8' );

		return mb_strtoupper( $first_char, 'UTF-8' ) . $rest;
	}
}
