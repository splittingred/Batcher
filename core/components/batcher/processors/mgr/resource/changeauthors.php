<?php
/**
 * Batcher
 *
 * Copyright 2010 by Shaun McCormick <shaun@modxcms.com>
 *
 * This file is part of Batcher, a batch resource editing Extra.
 *
 * Batcher is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * Batcher is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Batcher; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package batcher
 */
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
