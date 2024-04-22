<?php
/**
 * The Rebates Page Block - How To Apply content
 *
 * @param boolean $is_gb_editor Is this being rendered in the Gutenberg editor. The post wont be available in the editor, so make sure to set some defaults if in editor.
 *
 * @package Bcgov\Plugin\BasicBlocks
 */

require WP_PLUGIN_DIR . '/bcgov-plugin-cleanbc/templates/config/template-vars.php';

/**
 * ACF Fields
 */
$howtoapply_section = get_field( 'how_to_apply_section' );
$content_blocks     = $howtoapply_section['content_blocks'];

if ( $is_gb_editor ) : ?>
	<h2>How to Apply</h2>
	<p><b>Note to editors:</b> This content can be found in the <b>How to Apply</b> tab of the <b>Template Rebate</b> section in the post itself.</p>
<?php elseif ( $content_blocks ) : ?>
	<section id="how-to-apply" class="block block--howtoapply howtoapply-block">
		<div class="inner">
			<h2>How to Apply</h2>
			<div class="content-blocks">
				<div class="inner">
					<?php
                    foreach ( $content_blocks as $key => $content_block ) :
						$content_block_classes   = [
							'content-block ',
						];
						$content_block_layout    = $content_block['acf_fc_layout'];
						$content_block_classes[] = $content_block_layout . ' ';

						include WP_PLUGIN_DIR . '/bcgov-plugin-cleanbc/templates/blocks/partials/content-blocks.php';
					endforeach;
                    ?>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>
