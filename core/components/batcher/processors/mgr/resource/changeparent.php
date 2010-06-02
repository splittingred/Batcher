<?php
/**
 * Publish multiple resources
 *
 * @package batcher
 * @subpackage processors
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

if (empty($scriptProperties['resources'])) {
    return $modx->error->failure($modx->lexicon('batcher.resources_err_ns'));
}
/* get parent */
if (empty($scriptProperties['parent'])) {
    return $modx->error->failure($modx->lexicon('batcher.parent_err_ns'));
}
$parentResource = $modx->getObject('modResource',$scriptProperties['parent']);
if (empty($parentResource)) return $modx->error->failure($modx->lexicon('batcher.parent_err_nf'));

/* iterate over resources */
$resourceIds = explode(',',$scriptProperties['resources']);
foreach ($resourceIds as $resourceId) {
    $resource = $modx->getObject('modResource',$resourceId);
    if ($resource == null) continue;

    $resource->set('parent',$scriptProperties['parent']);

    if ($resource->save() === false) {
        
    }
}

return $modx->error->success();
