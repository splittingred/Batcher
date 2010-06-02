<?php
/**
 * Loads the header for mgr pages.
 *
 * @package batcher
 * @subpackage controllers
 */
$modx->regClientCSS($batcher->config['cssUrl'].'mgr.css');
$modx->regClientStartupScript($batcher->config['jsUrl'].'batcher.js');
$modx->regClientStartupHTMLBlock('<script type="text/javascript">
Ext.onReady(function() {
    Batcher.config = '.$modx->toJSON($batcher->config).';
    Batcher.config.connector_url = "'.$batcher->config['connectorUrl'].'";
    Batcher.request = '.$modx->toJSON($_GET).';
});
</script>');

return '';