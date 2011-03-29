<?php
/**
 * Loads TVs for editing
 * 
 * @package batcher
 */
$theme = $modx->getOption('manager_theme',null,'default');
$templatePath = $modx->getOption('manager_path') . 'templates/' . $theme . '/';
if (!file_exists($templatePath)) { /* fallback to default */
    $templatePath = $modx->getOption('manager_path') . 'templates/default/';
}
$modx->getService('smarty', 'smarty.modSmarty', '', array(
    'template_dir' => $templatePath,
));

$resource = $modx->newObject('modResource');
$resource->set('template',$_REQUEST['template']);

$tvFile = $modx->getOption('manager_path').'controllers/'.$modx->getOption('manager_theme',null,'default').'/resource/tvs.php';

$o = include $tvFile;
session_write_close();
//echo '<pre>';echo htmlentities($o);
echo $o;
die();
//echo '<script type="text/javascript">Ext.EventManager.fireDocReady();</script>';
die();