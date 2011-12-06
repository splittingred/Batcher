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
class BatcherTemplateGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'modTemplate';
    public $objectType = 'template';
    public $defaultSortField = 'templatename';
    public $defaultSortDirection = 'ASC';
    public $checkListPermission = true;

    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $c->leftJoin('modCategory','Category');
        $search = $this->getProperty('search');
        if (!empty($search)) {
            $c->where(array(
                'templatename:LIKE' => '%'.$search.'%',
                'OR:description:LIKE' => '%'.$search.'%',
            ));
        }
        return $c;
    }
    public function prepareQueryAfterCount(xPDOQuery $c) {
        $c->select(array(
            'modTemplate.id',
            'modTemplate.templatename',
            'modTemplate.description',
            'category_name' => 'Category.category',
        ));
        return $c;
    }

    public function prepareRow(xPDOObject $object) {
        $objectArray = $object->toArray();
        $objectArray['category'] = $object->get('category_name');
        return $objectArray;
    }
}
return 'BatcherTemplateGetListProcessor';