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
        add_action( 'init', [ $this, 'register_custom_incentive_page_pattern' ] );
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

    /**
     * Register custom block pattern for Single Recipe page.
     * Recipe page pattern includes the Commodities Recipes List block as well as content for a recipe description, ingredients, preparation/method, and chef details.
     *
     * @since 1.2.1
     */
    public function register_custom_incentive_page_pattern() {

        $asset_path = $plugin_dir . '/bcgov-plugin-cleanbc';
        $asset_url  = plugins_url( '', $asset_path ) . '/blocks/assets/';

        $pattern_content = '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"right":"2rem","left":"2rem"}}},"layout":{"type":"constrained"},"metadata":{"name":"Incentive Pattern Container"}} -->
        <div class="wp-block-group alignfull" style="padding-right:2rem;padding-left:2rem"><!-- wp:group {"align":"wide","layout":{"type":"default"}} -->
        <div class="wp-block-group alignwide"><!-- wp:columns -->
        <div class="wp-block-columns"><!-- wp:column {"width":"25%","style":{"elements":{"link":{"color":{"text":"var:preset|color|primary-brand"}}}},"textColor":"primary-brand","className":"sticky-side-nav"} -->
        <div class="wp-block-column sticky-side-nav has-primary-brand-color has-text-color has-link-color" style="flex-basis:25%"><!-- wp:group {"tagName":"aside","layout":{"type":"constrained"}} -->
        <aside id="side-nav-container" class="wp-block-group"><!-- wp:paragraph {"style":{"spacing":{"padding":{"right":"1.15rem","left":"3.15rem","top":"0.5rem","bottom":"0rem"}},"elements":{"link":{"color":{"text":"var:preset|color|tertiary"}}},"typography":{"fontSize":"1.5rem"}},"textColor":"tertiary"} -->
        <p class="has-tertiary-color has-text-color has-link-color" style="padding-top:0.5rem;padding-right:1.15rem;padding-bottom:0rem;padding-left:3.15rem;font-size:1.5rem"><strong>On this page</strong></p>
        <!-- /wp:paragraph -->

        <!-- wp:group {"style":{"spacing":{"padding":{"left":"2rem","bottom":"1rem","right":"2rem","top":"1rem"}}},"backgroundColor":"custom-info-bg","className":"wp-block-navigation__container is-responsive  is-vertical side-nav wp-block-navigation","layout":{"type":"constrained"}} -->
        <div id="incentive-side-nav" class="wp-block-group wp-block-navigation__container is-responsive is-vertical side-nav wp-block-navigation has-custom-info-bg-background-color has-background" style="padding-top:1rem;padding-right:2rem;padding-bottom:1rem;padding-left:2rem"><!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}},"className":"admin-warning"} -->
        <p class="admin-warning" style="font-size:1rem"><strong>Do not edit this column, the in-page navigation menu is generated here.</strong> </p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}},"className":"admin-warning"} -->
        <p class="admin-warning" style="font-size:1rem"><strong>Instructions:</strong> Adding (or removing) H2 headings to the body of the page will create this menu when the page is viewed. The heading must have a unique <strong>HTML anchor</strong> – found under the <strong>Advanced</strong> section in the Heading\'s Block Inspector.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group --></aside>
        <!-- /wp:group --></div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"75%"} -->
        <div class="wp-block-column" style="flex-basis:75%" id="incentive-details-container"><!-- wp:post-title {"level":1,"align":"wide","style":{"spacing":{"margin":{"bottom":"3rem"}},"elements":{"link":{"color":{"text":"var:preset|color|tertiary"}}}},"textColor":"tertiary"} /-->

        <!-- wp:group {"align":"wide","layout":{"type":"default"}} -->
        <div class="wp-block-group alignwide"><!-- wp:columns -->
        <div class="wp-block-columns"><!-- wp:column -->
        <div class="wp-block-column"><!-- wp:paragraph -->
        <p>TBD</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column"><!-- wp:post-featured-image {"aspectRatio":"4/3","align":"center"} /--></div>
        <!-- /wp:column --></div>
        <!-- /wp:columns -->

        <!-- wp:heading {"className":"is-style-default"} -->
        <h2 class="wp-block-heading is-style-default" id="available">Available Incentives</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem">TBD</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading -->
        <h2 class="wp-block-heading" id="eligibility">Eligibility Requirements</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem">TBD</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading -->
        <h2 class="wp-block-heading" id="upgrade">Upgrade Requirements</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem">TBD</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading -->
        <h2 class="wp-block-heading" id="apply">How to Apply</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem">TBD</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading -->
        <h2 class="wp-block-heading" id="other">Other</h2>
        <!-- /wp:heading -->

        <!-- wp:list {"className":"wp-block-list"} -->
        <ul class="wp-block-list"><!-- wp:list-item -->
        <li>Check out the&nbsp;<a href="https://www.fortisbc.com/rebates/home/free-home-energy-evaluation-and-upgrades">Energy Conservation Assistance Program</a>&nbsp;that can help income-qualified residents save energy with a free home energy evaluation, installation of energy-saving products and advice.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Check out our&nbsp;<a href="https://www.betterbuildingsbc.ca/incentive-search-tool/">incentive search tool</a>&nbsp;for other energy efficiency upgrades incentives.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Did you see a building science or energy efficiency term you did not understand? Check out our&nbsp;<a href="https://www.betterbuildingsbc.ca/glossary/">glossary</a>.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Learn more and apply for incentives by visiting&nbsp;<a href="https://www.fortisbc.com/Rebates/RebatesOffers/Pages/default.aspx?utm_source=offersbrochure&amp;utm_medium=print&amp;utm_campaign=cemcom&amp;utm_content=genrebates">FortisBC</a>.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>By using, visiting, or browsing CleanBC and the Energy Coach service, you accept and agree to these&nbsp;<a href="https://www.betterbuildingsbc.ca/terms-and-conditions/">Terms of Use</a>.</li>
        <!-- /wp:list-item --></ul>
        <!-- /wp:list -->

        <!-- wp:heading -->
        <h2 class="wp-block-heading" id="contact">Program Contact Information</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem">TBD</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group --></div>
        <!-- /wp:column --></div>
        <!-- /wp:columns --></div>
        <!-- /wp:group --></div>
        <!-- /wp:group -->';

        register_block_pattern(
            'buybc-plugin/single-recipe-page',
            [
                'title'      => __( 'Single incentive page', 'bcgov-plugin-cleanbc' ),
                'blockTypes' => [ 'core/post-content' ],
                'content'    => $pattern_content,
                'postTypes'  => [ 'incentives', 'rebates' ],
                'categories' => [ 'featured' ],

            ]
        );
    }
}
