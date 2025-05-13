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
	 * Handles the PDF size proxy request and returns the file size as JSON.
	 *
	 * Validates the request nonce and inspects the provided URL. If the URL does not
	 * end in .pdf, the method follows HTTP 301/302 redirects (up to a limit) to determine
	 * whether the final destination is a PDF file. If a valid PDF is found, it attempts
	 * to retrieve the file size via a HEAD request. Results are cached using transients
	 * to minimize repeated external calls.
	 *
	 * Responds with a JSON object that includes the file size (in bytes), final URL,
	 * and HTTP status code—or an error message if the request fails or is invalid.
	 *
	 * @since 1.17.0
	 * @return void
	 */
	public function pdf_proxy() {
		if ( ! isset( $_GET['pdf_size_proxy'] ) ) {
			return;
		}

		header( 'Content-Type: application/json' );

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
		if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
			echo wp_json_encode( [ 'error' => 'Invalid URL' ] );
			exit;
		}

		// Follow redirects manually to check if final destination is a PDF.
		$redirect_limit = 5;
		$redirect_count = 0;
		$final_url      = $url;
		$status_code    = null;

		do {
			$response = wp_remote_request(
                $final_url,
                [
					'method'      => 'HEAD',
					'timeout'     => 10,
					'headers'     => [ 'User-Agent' => 'WordPress PDF Proxy' ],
					'redirection' => 0,
				]
            );

			if ( is_wp_error( $response ) ) {
				echo wp_json_encode( [ 'error' => 'Request failed' ] );
				exit;
			}

			$status_code = wp_remote_retrieve_response_code( $response );

			if ( in_array( $status_code, [ 301, 302 ], true ) ) {
				$headers  = wp_remote_retrieve_headers( $response );
				$location = $headers['location'] ?? '';
				if ( empty( $location ) ) {
					echo wp_json_encode( [ 'error' => 'Redirect without Location header' ] );
					exit;
				}
				$final_url = esc_url_raw( $location );
				++$redirect_count;
			} else {
				break;
			}
		} while ( $redirect_count < $redirect_limit );

		if ( $redirect_count === $redirect_limit ) {
			echo wp_json_encode( [ 'error' => 'Too many redirects' ] );
			exit;
		}

		// Confirm final URL is a PDF.
		if ( ! preg_match( '/\.pdf(\?.*)?$/i', $final_url ) ) {
			echo wp_json_encode( [ 'error' => 'Final URL is not a PDF' ] );
			exit;
		}

		$cache_key = 'pdf_size_' . md5( $final_url );
		$cached    = get_transient( $cache_key );
		if ( false !== $cached ) {
			echo wp_json_encode(
                [
					'size'   => $cached,
					'cached' => true,
					'url'    => $final_url,
					'status' => $status_code,
				]
            );
			exit;
		}

		$response = wp_remote_request(
            $final_url,
            [
				'method'  => 'HEAD',
				'timeout' => 10,
			]
        );

		if ( is_wp_error( $response ) ) {
			echo wp_json_encode( [ 'error' => 'Final HEAD request failed' ] );
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
					'url'    => $final_url,
					'status' => $status_code,
				]
            );
		} else {
			echo wp_json_encode( [ 'error' => 'Could not determine size' ] );
		}

		exit;
	}
}
