<?php
/**
 * Batcher Connector
 *
 * @package batcher
 */
require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';

$batcherCorePath = $modx->getOption('batcher.core_path',null,$modx->getOption('core_path').'components/batcher/');
require_once $batcherCorePath.'model/batcher/batcher.class.php';
$modx->batcher = new Batcher($modx);

$modx->lexicon->load('batcher:default');

/* handle request */
$path = $modx->getOption('processorsPath',$modx->batcher->config,$batcherCorePath.'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));