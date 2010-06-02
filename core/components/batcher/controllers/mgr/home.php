<?php
/**
 * Loads the home page.
 *
 * @package batcher
 * @subpackage controllers
 */
$modx->regClientStartupScript($batcher->config['jsUrl'].'widgets/resource.grid.js');
$modx->regClientStartupScript($batcher->config['jsUrl'].'widgets/home.panel.js');
$modx->regClientStartupScript($batcher->config['jsUrl'].'sections/home.js');
$output = '<div id="batcher-panel-home-div"></div>';

return $output;
