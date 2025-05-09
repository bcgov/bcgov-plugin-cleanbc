<?php

namespace Bcgov\Plugin\CleanBC\Hooks;

/**
 * The Accessibility class provides methods for modifying accessibility needs in WordPress.
 *
 * @since 1.17.0
 *
 * @package Bcgov\Plugin\CleanBC
 */
class Accessibility {


	/**
	 * Registers a custom rewrite rule for the PDF size proxy endpoint.
	 *
	 * This allows requests to /pdf-size-proxy to be routed through WordPress
	 * and handled by the pdf_proxy() method.
	 *
	 * @since 1.17.0
	 * @return void
	 */
	public function pdf_proxy_rewrite() {
		add_rewrite_rule( '^pdf-size-proxy', 'index.php?pdf_size_proxy=1', 'top' );
	}

	/**
	 * Adds a custom query variable used to detect PDF size proxy requests.
	 *
	 * This ensures WordPress recognizes 'pdf_size_proxy' as a valid query var,
	 * enabling the template_redirect handler to intercept matching requests.
	 *
	 * @since 1.17.0
	 *
	 * @param array $vars The existing public query variables.
	 * @return array Modified query variables including 'pdf_size_proxy'.
	 */
	public function pdf_proxy_size( $vars ) {

		$vars[] = 'pdf_size_proxy';
		return $vars;
	}

	/**
	 * Handles the PDF size proxy request and returns file size in JSON.
	 *
	 * Verifies the request nonce, checks for a valid PDF URL, and either
	 * retrieves a cached file size or performs a HEAD request to fetch it.
	 * Supports caching the size using transients to reduce remote requests.
	 *
	 * Responds with JSON containing the file size in bytes or an error message.
	 *
	 * @since 1.17.0
	 * @return void
	 */
	public function pdf_proxy() {

		if ( ! isset( $_GET['pdf_size_proxy'] ) ) {
			return;
		}

		header( 'Content-Type: application/json' );

		// Nonce check (from header).
		$nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
		if ( ! wp_verify_nonce( $nonce, 'pdf_size_check' ) ) {
			echo wp_json_encode( [ 'error' => 'Invalid or missing nonce' ] );
			exit;
		}

		if ( ! isset( $_GET['url'] ) ) {
			echo wp_json_encode( [ 'error' => 'Missing URL' ] );
			exit;
		}

		$url = esc_url_raw( $_GET['url'] );
		if ( ! filter_var( $url, FILTER_VALIDATE_URL ) || ! preg_match( '/\.pdf(\?.*)?$/i', $url ) ) {
			echo wp_json_encode( [ 'error' => 'Invalid or non-PDF URL' ] );
			exit;
		}

		$cache_key = 'pdf_size_' . md5( $url );
		$cached    = get_transient( $cache_key );
		if ( false !== $cached ) {
			echo wp_json_encode(
				[
					'size'   => $cached,
					'cached' => true,
				]
			);
			exit;
		}

		$response = wp_remote_request(
			$url,
			[
				'method'  => 'HEAD',
				'timeout' => 10,
			]
		);

		if ( is_wp_error( $response ) ) {
			echo wp_json_encode( [ 'error' => 'Request failed' ] );
			exit;
		}

		$headers = wp_remote_retrieve_headers( $response );
		$size    = isset( $headers['content-length'] ) ? (int) $headers['content-length'] : 0;

		if ( $size > 0 ) {
			set_transient( $cache_key, $size, DAY_IN_SECONDS );
			echo wp_json_encode(
				[
					'size'   => $size,
					'cached' => false,
				]
			);
		} else {
			echo wp_json_encode( [ 'error' => 'Could not determine size' ] );
		}

		exit;
	}
}
