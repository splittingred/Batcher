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
$version = $modx->getVersionData();
if (version_compare($version['full_version'],'2.2.0-dev','>=')) {
    /** @var modSmarty $smarty  */
    $smarty = $modx->getService('smarty', 'smarty.modSmarty', '', array(
        'template_dir' => $modx->getOption('manager_path') . 'templates/default/',
    ));
    $smarty->setTemplatePath($modx->getOption('manager_path') . 'templates/default/');

    require_once $modx->getOption('core_path',null,MODX_CORE_PATH).'model/modx/modmanagercontroller.class.php';
    require_once $modx->getOption('manager_path',null,MODX_MANAGER_PATH).'controllers/default/resource/resource.class.php';
    class BatcherTVLoader extends ResourceManagerController {
        public function process(array $scriptProperties = array()) {}
        public function getPageTitle() { return ''; }
        public function loadCustomCssJs() {}
        public function getTemplateFile() { return ''; }
        public function checkPermissions() { return true;}
    }
    $resource = $modx->newObject('modResource');
    $resource->set('template',$_REQUEST['template']);

    $tvLoader = new BatcherTVLoader($modx);
    $modx->controller =& $tvLoader;
    $tvLoader->resource =& $resource;
    $o = $tvLoader->loadTVs();
} else {
    $resource = $modx->newObject('modResource');
    $resource->set('template',$_REQUEST['template']);

    $tvFile = $modx->getOption('manager_path').'controllers/'.$modx->getOption('manager_theme',null,'default').'/resource/tvs.php';
    if (!file_exists($tvFile)) {
        $tvFile = $modx->getOption('manager_path').'controllers/default/resource/tvs.php';
    }

    $o = include $tvFile;
}
@session_write_close();
//echo '<pre>';echo htmlentities($o);
echo $o;
die();