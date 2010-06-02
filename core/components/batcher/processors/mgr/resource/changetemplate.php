<?php
/**
 * Change template for multiple resources
 *
 * @package batcher
 * @subpackage processors
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

if (empty($scriptProperties['resources'])) {
    return $modx->error->failure($modx->lexicon('batcher.resources_err_ns'));
}
/* get parent */
if (empty($scriptProperties['template'])) {
    return $modx->error->failure($modx->lexicon('batcher.template_err_ns'));
}
$template = $modx->getObject('modTemplate',$scriptProperties['template']);
if (empty($template)) return $modx->error->failure($modx->lexicon('batcher.template_err_nf'));

/* iterate over resources */
$resourceIds = explode(',',$scriptProperties['resources']);
foreach ($resourceIds as $resourceId) {
    $resource = $modx->getObject('modResource',$resourceId);
    if ($resource == null) continue;

    $resource->set('template',$scriptProperties['template']);

    if ($resource->save() === false) {
        
    }
}

return $modx->error->success();
