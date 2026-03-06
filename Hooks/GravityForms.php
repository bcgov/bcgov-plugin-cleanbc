<?php

namespace Bcgov\Plugin\CleanBC\Hooks;

/**
 * Gravity Forms hooks.
 *
 * @package Bcgov\Plugin\CleanBC
 */
class GravityForms {
	/**
	 * Delete a Gravity Forms entry immediately after submission.
	 *
	 * @param array $entry Gravity Forms entry object as an array.
	 * @return void
	 */
	public function remove_form_entry( $entry ) {
		if ( ! class_exists( 'GFAPI' ) ) {
			return;
		}

		$entry_id = isset( $entry['id'] ) ? (int) $entry['id'] : 0;
		if ( $entry_id <= 0 ) {
			return;
		}

		\GFAPI::delete_entry( $entry_id );
	}
}
