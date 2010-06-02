<?php
/**
 * Perform a batch action on multiple resources
 *
 * @package batcher
 * @subpackage processors
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

if (empty($scriptProperties['resources'])) {
    return $modx->error->failure($modx->lexicon('batcher.resources_err_ns'));
}
$batch = $modx->getOption('batch',$scriptProperties,'');
if (empty($batch)) return $modx->error->failure($modx->lexicon('batcher.action_err_ns'));

$resourceIds = explode(',',$scriptProperties['resources']);

foreach ($resourceIds as $resourceId) {
    $resource = $modx->getObject('modResource',$resourceId);
    if ($resource == null) continue;

    switch ($batch) {
        case 'publish':
            if ($resource->get('published') == false) {
                $resource->set('published',true);
                $resource->set('publishedon',strftime('%Y-%m-%d %H:%M:%S'));
                $resource->set('publishedby',$modx->user->get('id'));
            } else {
                continue;
            }
            break;
        case 'unpublish':
            if ($resource->get('published') == true) {
                $resource->set('published',false);
                $resource->set('publishedon',null);
                $resource->set('publishedby',0);
            } else {
                continue;
            }
            break;
        case 'hidemenu':
            if ($resource->get('hidemenu') == false) {
                $resource->set('hidemenu',true);
            } else {
                continue;
            }
            break;
        case 'unhidemenu':
            if ($resource->get('hidemenu') == true) {
                $resource->set('hidemenu',false);
            } else {
                continue;
            }
            break;
        case 'cacheable':
            if ($resource->get('cacheable') == false) {
                $resource->set('cacheable',true);
            } else {
                continue;
            }
            break;
        case 'uncacheable':
            if ($resource->get('cacheable') == true) {
                $resource->set('cacheable',false);
            } else {
                continue;
            }
            break;
        case 'searchable':
            if ($resource->get('searchable') == false) {
                $resource->set('searchable',true);
            } else {
                continue;
            }
            break;
        case 'unsearchable':
            if ($resource->get('searchable') == true) {
                $resource->set('searchable',false);
            } else {
                continue;
            }
            break;
        case 'richtext':
            if ($resource->get('richtext') == false) {
                $resource->set('richtext',true);
            } else {
                continue;
            }
            break;
        case 'unrichtext':
            if ($resource->get('richtext') == true) {
                $resource->set('richtext',false);
            } else {
                continue;
            }
            break;
        case 'delete':
            if ($resource->get('deleted') == false) {
                $resource->set('deleted',true);
                $resource->set('deletedon',strftime('%Y-%m-%d %H:%M:%S'));
                $resource->set('deletedby',$modx->user->get('id'));
            } else {
                continue;
            }
            break;
        case 'undelete':
            if ($resource->get('deleted') == true) {
                $resource->set('deleted',false);
                $resource->set('deletedon',null);
                $resource->set('deletedby',0);
            } else {
                continue;
            }
            break;
    }


    if ($resource->save() === false) {

    }
}

return $modx->error->success();
