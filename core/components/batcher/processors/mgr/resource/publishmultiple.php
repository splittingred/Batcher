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

$resourceIds = explode(',',$scriptProperties['resources']);

foreach ($resourceIds as $resourceId) {
    $resource = $modx->getObject('modResource',$resourceId);
    if ($resource == null) continue;

    if ($resource->get('published') == false) {
        $resource->set('published',true);
        $resource->set('publishedon',strftime('%Y-%m-%d %H:%M:%S'));
        $resource->set('publishedby',$modx->user->get('id'));
    } else {
        continue;
    }

    if ($resource->save() === false) {
        
    }
}

return $modx->error->success();
