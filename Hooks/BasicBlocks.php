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
        add_action( 'wp_loaded', [ $this, 'register_custom_incentive_page_pattern' ] );
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
     * Register custom block pattern for Single Incentive (akak rebates) page.
     * Incentive page pattern includes general information to facilitate easier inclusion and more consistent editing of Program Contact Information and Other links.
     *
     * @since 1.11.0
     */
    public function register_custom_incentive_page_pattern() {

        $pattern_content = '<!-- wp:group {"metadata":{"name":"Incentive Page Container"},"align":"full","style":{"spacing":{"padding":{"top":"2rem","bottom":"4rem","left":"2rem","right":"2rem"}}},"layout":{"type":"constrained"}} -->
        <div class="wp-block-group alignfull" style="padding-top:2rem;padding-right:2rem;padding-bottom:4rem;padding-left:2rem"><!-- wp:group {"align":"wide","layout":{"type":"default"}} -->
        <div class="wp-block-group alignwide"><!-- wp:columns -->
        <div class="wp-block-columns"><!-- wp:column {"width":"25%","className":"sticky-side-nav","style":{"elements":{"link":{"color":{"text":"var:preset|color|primary-brand"}}}},"textColor":"primary-brand"} -->
        <div class="wp-block-column sticky-side-nav has-primary-brand-color has-text-color has-link-color" style="flex-basis:25%"><!-- wp:group {"tagName":"aside","layout":{"type":"constrained"}} -->
        <aside id="side-nav-container" class="wp-block-group"><!-- wp:paragraph {"style":{"spacing":{"padding":{"right":"1.15rem","left":"1.15rem","top":"0.5rem","bottom":"0rem"}},"elements":{"link":{"color":{"text":"var:preset|color|tertiary"}}},"typography":{"fontSize":"1.5rem"}},"textColor":"tertiary"} -->
        <p class="has-tertiary-color has-text-color has-link-color" style="padding-top:0.5rem;padding-right:1.15rem;padding-bottom:0rem;padding-left:1.15rem;font-size:1.5rem"><strong>On this page</strong></p>
        <!-- /wp:paragraph -->

        <!-- wp:group {"className":"admin-instructions","layout":{"type":"constrained"}} -->
        <div id="incentive-side-nav" class="wp-block-group admin-instructions"><!-- wp:group {"className":"instructions","style":{"border":{"width":"2px"}},"backgroundColor":"custom-info-bg","borderColor":"custom-info-border","layout":{"type":"constrained"}} -->
        <div class="wp-block-group instructions has-border-color has-custom-info-border-border-color has-custom-info-bg-background-color has-background" style="border-width:2px"><!-- wp:paragraph {"className":"admin-warning","style":{"typography":{"fontSize":"1rem"}}} -->
        <p class="admin-warning" style="font-size:1rem"><strong>Do not edit</strong> – <strong>the in-page navigation menu is generated here.</strong> </p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph {"className":"admin-warning","style":{"typography":{"fontSize":"1rem"}}} -->
        <p class="admin-warning" style="font-size:1rem">Adding (or removing) H2 headings to the body of the page will create this menu when the page is viewed. The heading must have a unique <strong>HTML anchor</strong> – found under the <strong>Advanced</strong> section in the Heading Block Inspector.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group --></div>
        <!-- /wp:group --></aside>
        <!-- /wp:group --></div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"75%"} -->
        <div class="wp-block-column" style="flex-basis:75%" id="incentive-details-container"><!-- wp:post-title {"level":1,"align":"wide","style":{"spacing":{"margin":{"bottom":"3rem"}},"elements":{"link":{"color":{"text":"var:preset|color|tertiary"}}}},"textColor":"tertiary"} /-->

        <!-- wp:group {"align":"wide","layout":{"type":"default"}} -->
        <div class="wp-block-group alignwide"><!-- wp:columns -->
        <div class="wp-block-columns"><!-- wp:column -->
        <div class="wp-block-column"><!-- wp:paragraph -->
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column"><!-- wp:post-featured-image {"aspectRatio":"4/3","align":"center"} /--></div>
        <!-- /wp:column --></div>
        <!-- /wp:columns -->

        <!-- wp:group {"style":{"spacing":{"padding":{"right":"2rem","left":"2rem","top":"1rem","bottom":"1rem"}},"border":{"width":"1px","color":"#aca6a2","radius":"1rem"}},"backgroundColor":"transparent","layout":{"type":"default"}} -->
        <div class="wp-block-group has-border-color has-transparent-background-color has-background" style="border-color:#aca6a2;border-width:1px;border-radius:1rem;padding-top:1rem;padding-right:2rem;padding-bottom:1rem;padding-left:2rem"><!-- wp:heading {"align":"wide","className":"is-style-default"} -->
        <h2 class="wp-block-heading alignwide is-style-default" id="available">Available Incentives</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph -->
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
        <!-- /wp:paragraph -->

        <!-- wp:table {"className":"is-style-stripes"} -->
        <figure class="wp-block-table is-style-stripes"><table class="has-fixed-layout"><tbody><tr><td><strong>Incentive type</strong></td><td><strong>Incentive</strong> amount</td></tr><tr><td>Type A</td><td>$1,000 </td></tr><tr><td>Type B</td><td>$2,000 </td></tr></tbody></table></figure>
        <!-- /wp:table -->

        <!-- wp:group {"metadata":{"name":"Warning alert","categories":[],"patternName":"core/block/9387"},"className":"warning has-icon","style":{"border":{"radius":"0.5rem","width":"2px"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"},"margin":{"top":"1rem","bottom":"1rem"}}},"backgroundColor":"custom-warning-bg","borderColor":"custom-warning-border","layout":{"type":"default"}} -->
        <div class="wp-block-group warning has-icon has-border-color has-custom-warning-border-border-color has-custom-warning-bg-background-color has-background" style="border-width:2px;border-radius:0.5rem;margin-top:1rem;margin-bottom:1rem;padding-top:0.5rem;padding-right:1rem;padding-bottom:0.5rem;padding-left:1rem"><!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"0rem","bottom":"0rem"},"margin":{"top":"0.25rem","bottom":"0.25rem"}}}} -->
        <p style="margin-top:0.25rem;margin-bottom:0.25rem;padding-top:0rem;padding-bottom:0rem">This is a warning alert. Modify or delete as needed.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group --></div>
        <!-- /wp:group -->

        <!-- wp:heading {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <h2 class="wp-block-heading" id="eligibility" style="margin-top:2rem">Eligibility Requirements</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph -->
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <h2 class="wp-block-heading" id="upgrade" style="margin-top:2rem">Upgrade Requirements</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph -->
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <h2 class="wp-block-heading" id="apply" style="margin-top:2rem">How to Apply</h2>
        <!-- /wp:heading -->

        <!-- wp:list {"ordered":true} -->
        <ol class="wp-block-list"><!-- wp:list-item -->
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <!-- /wp:list-item --></ol>
        <!-- /wp:list -->

        <!-- wp:heading {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <h2 class="wp-block-heading" id="dealines" style="margin-top:2rem">Deadlines</h2>
        <!-- /wp:heading -->

        <!-- wp:list -->
        <ul class="wp-block-list"><!-- wp:list-item -->
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <!-- /wp:list-item --></ul>
        <!-- /wp:list -->

        <!-- wp:group {"metadata":{"name":"Info alert","categories":[],"patternName":"core/block/9382"},"className":"info has-icon","style":{"border":{"radius":"0.5rem","width":"2px"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"},"margin":{"top":"1rem","bottom":"1rem"}}},"backgroundColor":"custom-info-bg","borderColor":"custom-info-border","layout":{"type":"default"}} -->
        <div class="wp-block-group info has-icon has-border-color has-custom-info-border-border-color has-custom-info-bg-background-color has-background" style="border-width:2px;border-radius:0.5rem;margin-top:1rem;margin-bottom:1rem;padding-top:0.5rem;padding-right:1rem;padding-bottom:0.5rem;padding-left:1rem"><!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"0rem","bottom":"0rem"},"margin":{"top":"0.25rem","bottom":"0.25rem"}}}} -->
        <p style="margin-top:0.25rem;margin-bottom:0.25rem;padding-top:0rem;padding-bottom:0rem">This is an info alert. Modify or delete as needed.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:heading {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <h2 class="wp-block-heading" id="other" style="margin-top:2rem">Other</h2>
        <!-- /wp:heading -->

        <!-- wp:group {"metadata":{"name":"Error alert","categories":[],"patternName":"core/block/9392"},"className":"error has-icon admin-instructions","style":{"border":{"width":"2px","color":"#d23b3740","radius":"0.5rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"},"margin":{"top":"1rem","bottom":"1rem"}}},"backgroundColor":"custom-error-bg","layout":{"type":"default"}} -->
        <div class="wp-block-group error has-icon admin-instructions has-border-color has-custom-error-bg-background-color has-background" style="border-color:#d23b3740;border-width:2px;border-radius:0.5rem;margin-top:1rem;margin-bottom:1rem;padding-top:0.5rem;padding-right:1rem;padding-bottom:0.5rem;padding-left:1rem"><!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"0rem","bottom":"0rem"},"margin":{"top":"0.25rem","bottom":"0.25rem"}}}} -->
        <p style="margin-top:0.25rem;margin-bottom:0.25rem;padding-top:0rem;padding-bottom:0rem"><strong>Instructions</strong>: Delete this instruction and update – and/or remove – the information below as needed</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:list -->
        <ul class="wp-block-list"><!-- wp:list-item -->
        <li>Check out the&nbsp;<a href="https://www.fortisbc.com/rebates/home/free-home-energy-evaluation-and-upgrades" target="_blank" rel="noreferrer noopener">Energy Conservation Assistance Program</a>&nbsp;that can help income-qualified residents save energy with a free home energy evaluation, installation of energy-saving products and advice.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Check out our&nbsp;<a href="https://www.betterbuildingsbc.ca/incentive-search-tool/">incentive search tool</a>&nbsp;for other energy efficiency upgrades incentives.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Did you see a building science or energy efficiency term you did not understand? Check out our&nbsp;<a href="https://www.betterbuildingsbc.ca/glossary/">glossary</a>.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Learn more and apply for incentives by visiting&nbsp;<a href="https://www.fortisbc.com/Rebates/RebatesOffers/Pages/default.aspx?utm_source=offersbrochure&amp;utm_medium=print&amp;utm_campaign=cemcom&amp;utm_content=genrebates" target="_blank" rel="noreferrer noopener">FortisBC</a>.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>By using, visiting, or browsing CleanBC and the Energy Coach service, you accept and agree to these&nbsp;<a href="https://www.betterbuildingsbc.ca/terms-and-conditions/">Terms of Use</a>.</li>
        <!-- /wp:list-item --></ul>
        <!-- /wp:list -->

        <!-- wp:heading {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <h2 class="wp-block-heading" id="contact" style="margin-top:2rem">Program Contact Information</h2>
        <!-- /wp:heading -->

        <!-- wp:group {"metadata":{"name":"Contact options"},"layout":{"type":"default"}} -->
        <div class="wp-block-group"><!-- wp:group {"metadata":{"name":"Error alert","categories":[],"patternName":"core/block/9392"},"className":"error has-icon admin-instructions","style":{"border":{"width":"2px","color":"#d23b3740","radius":"0.5rem"},"spacing":{"padding":{"top":"0.5rem","bottom":"0.5rem","left":"1rem","right":"1rem"},"margin":{"top":"1rem","bottom":"1rem"}}},"backgroundColor":"custom-error-bg","layout":{"type":"default"}} -->
        <div class="wp-block-group error has-icon admin-instructions has-border-color has-custom-error-bg-background-color has-background" style="border-color:#d23b3740;border-width:2px;border-radius:0.5rem;margin-top:1rem;margin-bottom:1rem;padding-top:0.5rem;padding-right:1rem;padding-bottom:0.5rem;padding-left:1rem"><!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"0rem","bottom":"0rem"},"margin":{"top":"0.25rem","bottom":"0.25rem"}}}} -->
        <p style="margin-top:0.25rem;margin-bottom:0.25rem;padding-top:0rem;padding-bottom:0rem"><strong>Instructions</strong>: Delete this instruction and update – and/or remove – the information below as needed</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:group {"metadata":{"name":"CleanBC"},"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"layout":{"type":"default"}} -->
        <div class="wp-block-group" style="margin-top:1rem;margin-bottom:1rem"><!-- wp:paragraph -->
        <p>CleanBC Small Buildings Energy Coach&nbsp;<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=smallbuildings@betterbuildingsbc.ca" target="_blank" rel="noreferrer noopener">smallbuildings@betterbuildingsbc.ca</a>.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:group {"metadata":{"name":"BC Hydro"},"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"layout":{"type":"default"}} -->
        <div class="wp-block-group" style="margin-top:1rem;margin-bottom:1rem"><!-- wp:paragraph -->
        <p>Contact your BC Hydro Key Account Manager or Energy Savings Business Help Desk.</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph -->
        <p>BC Hydro Energy Savings Business Help Desk&nbsp;<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=incentives@bchydro.com" target="_blank" rel="noreferrer noopener">incentives@bchydro.com</a>&nbsp;<a href="tel:+18665224713" title="">1-866-522-4713</a> Lower Mainland&nbsp;<a href="tel:+16045224713" title="">604-522-4713</a>.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:group {"metadata":{"name":"CMHC"},"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"layout":{"type":"default"}} -->
        <div class="wp-block-group" style="margin-top:1rem;margin-bottom:1rem"><!-- wp:paragraph -->
        <p>CMHC Contact Centre&nbsp;<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=contactcentre@cmhc.ca" target="_blank" rel="noreferrer noopener">contactcentre@cmhc.ca</a>&nbsp;<a href="tel:604-737-4035">604-737-4035</a>.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:group {"metadata":{"name":"Fortis"},"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"layout":{"type":"default"}} -->
        <div class="wp-block-group" style="margin-top:1rem;margin-bottom:1rem"><!-- wp:paragraph -->
        <p>For further information, please contact your FortisBC&nbsp;<a href="https://www.fortisbc.com/services/commercial-industrial-services/account-managers-for-commercial-industrial-and-business-customers" target="_blank" rel="noreferrer noopener">electricity technical advisor</a>&nbsp;or via one of the contacts below.</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph -->
        <p>FortisBC&nbsp;<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=businessrebates@fortisbc.com" target="_blank" rel="noreferrer noopener">businessrebates@fortisbc.com</a>&nbsp;<a href="tel:+18558577411" title="">1-866-436-7847</a>.</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph -->
        <p>FortisBC <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=commercialrebates@fortisbc.com" target="_blank" rel="noreferrer noopener">commercialrebates@fortisbc.com</a> &nbsp;<a href="tel:+18558577411" title="">1-866-436-7847</a>.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:group {"metadata":{"name":"Government of Canada"},"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"layout":{"type":"default"}} -->
        <div class="wp-block-group" style="margin-top:1rem;margin-bottom:1rem"><!-- wp:paragraph -->
        <p>Government of Canada&nbsp;<a href="tel:+18009598287" title="">1-800-959-8287</a>.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group -->

        <!-- wp:group {"metadata":{"name":"PNG"},"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"layout":{"type":"default"}} -->
        <div class="wp-block-group" style="margin-top:1rem;margin-bottom:1rem"><!-- wp:paragraph -->
        <p>Pacific Northern Gas&nbsp;<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=savingenergy@png.ca" target="_blank" rel="noreferrer noopener">savingenergy@png.ca</a>&nbsp;<a href="tel:+18006672297" title="">1-800-667-2297</a>.</p>
        <!-- /wp:paragraph --></div>
        <!-- /wp:group --></div>
        <!-- /wp:group --></div>
        <!-- /wp:group --></div>
        <!-- /wp:column --></div>
        <!-- /wp:columns --></div>
        <!-- /wp:group --></div>
        <!-- /wp:group -->';

        if ( post_type_exists( 'incentives' ) ) {
            register_block_pattern(
                'bcgov-plugin-cleanbc/single-incentive-page',
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
}
