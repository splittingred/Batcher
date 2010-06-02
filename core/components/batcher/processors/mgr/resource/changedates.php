<?php
/**
 * Change dates for multiple resources
 *
 * @package batcher
 * @subpackage processors
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

if (empty($scriptProperties['resources'])) {
    return $modx->error->failure($modx->lexicon('batcher.resources_err_ns'));
}

/* iterate over resources */
$resourceIds = explode(',',$scriptProperties['resources']);
foreach ($resourceIds as $resourceId) {
    $resource = $modx->getObject('modResource',$resourceId);
    if ($resource == null) continue;

    if (!empty($scriptProperties['createdon'])) $resource->set('createdon',$scriptProperties['createdon']);
    if (!empty($scriptProperties['editedon'])) $resource->set('editedon',$scriptProperties['editedon']);
    if (!empty($scriptProperties['pub_date'])) $resource->set('pub_date',$scriptProperties['pub_date']);
    if (!empty($scriptProperties['unpub_date'])) $resource->set('unpub_date',$scriptProperties['unpub_date']);

    if ($resource->save() === false) {
        
    }
}

return $modx->error->success();
