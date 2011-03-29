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
 * Get a list of templates
 *
 * @package batcher
 * @subpackage processors
 */
/* setup default properties */
$isLimit = !empty($scriptProperties['limit']);
$isCombo = !empty($scriptProperties['combo']);
$start = $modx->getOption('start',$scriptProperties,0);
$limit = $modx->getOption('limit',$scriptProperties,10);
$sort = $modx->getOption('sort',$scriptProperties,'templatename');
$dir = $modx->getOption('dir',$scriptProperties,'ASC');

$c = $modx->newQuery('modTemplate');
$c->leftJoin('modCategory','Category');
if (!empty($scriptProperties['search'])) {
    $c->where(array(
        'templatename:LIKE' => '%'.$scriptProperties['search'].'%',
        'OR:description:LIKE' => '%'.$scriptProperties['search'].'%',
    ));
}
$count = $modx->getCount('modTemplate',$c);
$c->select(array(
    'modTemplate.id',
    'modTemplate.templatename',
    'modTemplate.description',
));
$c->select(array(
    'category_name' => 'Category.category',
));
$c->sortby($sort,$dir);
if ($isLimit) {
    $c->limit($limit,$start);
}
$templates = $modx->getCollection('modTemplate',$c);
//echo $c->toSql();

$list = array();
foreach ($templates as $template) {
    $templateArray = $template->toArray();
    $templateArray['category'] = $template->get('category_name');
    $list[]= $templateArray;
}
return $this->outputArray($list,$count);