<?php

namespace Bcgov\Plugin\CleanBC\Hooks;

/**
 * Sets up basic php template blocks for CleanBC
 *
 * @since 1.5.0
 *
 * @package Bcgov\Plugin\BasicBlocks
 */
class BasicBlocks {
	/**
     * Constructor.
     */
    public function __construct() {
        $this->init();
    }

    /**
     * Sets up hooks for Blocks.
     *
     * @return void
     */
    public function init() {
        add_action( 'init', [ $this, 'register_blocks' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ], 10 );
    }


	/**
	 * Register the stylesheets and JavaScript for the admin area.
	 *
	 * @since    1.5.0
	 */
	public function enqueue_admin_scripts() {
		$name       = 'admin';
		$asset_info = \Bcgov\Plugin\CleanBC\Setup::get_asset_information( $name, 'dist-basic' );

		wp_enqueue_script( $asset_info['handle'], $asset_info['dist_url'] . $name . '.js', $asset_info['dependencies'], $asset_info['version'], false );
	}

    /**
     * Helper function to check if the block render call is coming from Gutenburg or the website.
     *
     * @return bool $is_gb_editor
     */
	private function check_is_gb_editor() {
		$is_gb_editor = defined( 'REST_REQUEST' ) && true === REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === filter_input( INPUT_GET, 'context', FILTER_SANITIZE_SPECIAL_CHARS ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		return $is_gb_editor;
	}


	/**
     * Registers blocks and callbacks for dynamic blocks.
     *
     * @return void
     */
    public function register_blocks(): void {
        // rebates page info pieces.
        register_block_type(
            'bcgovcleanbc/rebates-page-info',
            [
                'render_callback' => [ $this, 'render_block_rebates_page_info' ],
				'attributes'      => [
                    'section_options' => [
                        'default' => [
                            [
                                'value' => 'overview',
                                'label' => __( 'Overview' ),
                            ],
                            [
                                'value' => 'rebate_amount',
                                'label' => __( 'Rebate Amount' ),
                            ],
                            [
                                'value' => 'eligibility_requirements',
                                'label' => __( 'Eligibility Requirements' ),
                            ],
                            [
                                'value' => 'deadlines',
                                'label' => __( 'Deadlines' ),
                            ],
                            [
                                'value' => 'how_to_apply',
                                'label' => __( 'How To Apply' ),
                            ],
                            [
                                'value' => 'who_to_contact',
                                'label' => __( 'Who To Contact' ),
                            ],
                            [
                                'value' => 'program_updates',
                                'label' => __( 'Program Updates' ),
                            ],
                            [
                                'value' => 'faq',
                                'label' => __( 'FAQ' ),
                            ],
                        ],
                        'type'    => 'array',
                    ],
                    'section'         => [
                        'type' => 'string',
                    ],

                ],
            ]
        );
	}



	/**
     * Render the Sections for the Rebates pages
     *
     * @param array $attributes  The incoming attributes for the block from WP.
     * @return string $output The rendered html content for the block.
     */
    public function render_block_rebates_page_info( $attributes ) {
        $is_gb_editor = $this::check_is_gb_editor();

		$section_to_load = 'overview'; // Default to the overview section.
        if ( isset( $attributes['section'] ) ) {
        	$section_to_load = $attributes['section'];
        }

        $template_to_load = \Bcgov\Plugin\CleanBC\Setup::$plugin_dir . 'templates/blocks/basic_rebates-' . $section_to_load . '.php';
        if ( file_exists( $template_to_load ) ) {
            ob_start();
            require $template_to_load;
            return ob_get_clean();
        } else {
            return 'Unable to find template (' . $section_to_load . ')';
        }
    }
}
