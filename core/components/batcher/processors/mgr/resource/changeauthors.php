<?php
/**
 * Change authors for multiple resources
 *
 * @package batcher
 * @subpackage processors
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

if (empty($scriptProperties['resources'])) {
    return $modx->error->failure($modx->lexicon('batcher.resources_err_ns'));
}

/* validated createdby */
if (!empty($scriptProperties['createdby'])) {
    $createdby = $modx->getObject('modUser',$scriptProperties['createdby']);
    if (empty($createdby)) return $modx->error->failure($modx->lexicon('batcher.user_err_nf'));
}
if (!empty($scriptProperties['editedby'])) {
    $editedby = $modx->getObject('modUser',$scriptProperties['createdby']);
    if (empty($editedby)) return $modx->error->failure($modx->lexicon('batcher.user_err_nf'));
}
if (!empty($scriptProperties['publishedby'])) {
    $publishedby= $modx->getObject('modUser',$scriptProperties['publishedby']);
    if (empty($publishedby)) return $modx->error->failure($modx->lexicon('batcher.user_err_nf'));
}

/* iterate over resources */
$resourceIds = explode(',',$scriptProperties['resources']);
foreach ($resourceIds as $resourceId) {
    $resource = $modx->getObject('modResource',$resourceId);
    if ($resource == null) continue;

    if (!empty($scriptProperties['createdby'])) $resource->set('createdby',$scriptProperties['createdby']);
    if (!empty($scriptProperties['editedby'])) $resource->set('editedby',$scriptProperties['editedby']);
    if (!empty($scriptProperties['publishedby'])) $resource->set('publishedby',$scriptProperties['publishedby']);
    
    if ($resource->save() === false) {
        
    }
}

return $modx->error->success();
