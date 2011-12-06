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
 * Get a list of resources
 *
 * @package batcher
 * @subpackage processors
 */
/* setup default properties */
class BatcherResourceGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'modResource';
    public $objectType = 'resource';
    public $defaultSortField = 'pagetitle';
    public $defaultSortDirection = 'ASC';
    public $checkListPermission = true;

    public function prepareQueryBeforeCount(xPDOQuery $c) {

        $c->leftJoin('modTemplate','Template');
        $search = $this->getProperty('search');
        if (!empty($search)) {
            $c->where(array(
                'pagetitle:LIKE' => '%'.$search.'%',
                'OR:description:LIKE' => '%'.$search.'%',
                'OR:content:LIKE' => '%'.$search.'%',
                'OR:id:LIKE' => '%'.$search.'%',
            ));
        }
        $template = $this->getProperty('template');
        if (!empty($template)) {
            $c->where(array(
                'template' => $template,
            ));
        }
        return $c;
    }

    public function prepareQueryAfterCount(xPDOQuery $c) {
        $c->select(array('modResource.*','Template.templatename'));
        return $c;
    }

    public function prepareRow(xPDOObject $object) {
        $objectArray = $object->toArray();
        $objectArray['hidemenu'] = (boolean)$objectArray['hidemenu'];
        unset($objectArray['content']);
        return $objectArray;
    }
}
return 'BatcherResourceGetListProcessor';