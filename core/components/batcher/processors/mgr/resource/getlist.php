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
 * Get a list of threads
 *
 * @package batcher
 * @subpackage processors
 */
/* setup default properties */
$isLimit = !empty($scriptProperties['limit']);
$isCombo = !empty($scriptProperties['combo']);
$start = $modx->getOption('start',$scriptProperties,0);
$limit = $modx->getOption('limit',$scriptProperties,10);
$sort = $modx->getOption('sort',$scriptProperties,'pagetitle');
$dir = $modx->getOption('dir',$scriptProperties,'ASC');

$c = $modx->newQuery('modResource');
$c->leftJoin('modTemplate','Template');
if (!empty($scriptProperties['search'])) {
    $c->where(array(
        'pagetitle:LIKE' => '%'.$scriptProperties['search'].'%',
        'OR:description:LIKE' => '%'.$scriptProperties['search'].'%',
        'OR:content:LIKE' => '%'.$scriptProperties['search'].'%',
        'OR:id:LIKE' => '%'.$scriptProperties['search'].'%',
    ));
}
if (!empty($scriptProperties['template'])) {
    $c->where(array(
        'template' => $scriptProperties['template'],
    ));
}
$count = $modx->getCount('modResource',$c);

$c->select(array('modResource.*','Template.templatename'));
$c->sortby($sort,$dir);
if ($isLimit) {
    $c->limit($limit,$start);
}
$resources = $modx->getCollection('modResource',$c);


$list = array();
foreach ($resources as $resource) {
    if (!$resource->checkPolicy('list')) continue;
    $resourceArray = $resource->toArray();
    $resourceArray['hidemenu'] = (boolean)$resourceArray['hidemenu'];
    unset($resourceArray['content']);
    //$resourceArray['content'] = strip_tags(substr($resourceArray['content'],0,300));

    //$resourceArray['url'] = $resource->makeUrl();
    $list[]= $resourceArray;
}
return $this->outputArray($list,$count);