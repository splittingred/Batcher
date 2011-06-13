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
 * @package batcher
 * @subpackage controllers
 */
require_once dirname(__FILE__) . '/model/batcher/batcher.class.php';
class IndexManagerController extends modExtraManagerController {
    public static function getDefaultController() { return 'home'; }
}

abstract class BatcherManagerController extends modManagerController {
    public function initialize() {
        $this->batcher = new Batcher($this->modx);

        $this->addCss($this->batcher->config['cssUrl'].'mgr.css');
        $this->addJavascript($this->batcher->config['jsUrl'].'batcher.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            Batcher.config = '.$this->modx->toJSON($this->batcher->config).';
            Batcher.config.connector_url = "'.$this->batcher->config['connectorUrl'].'";
        });
        </script>');
    }
    public function getLanguageTopics() {
        return array('batcher:default');
    }
    public function checkPermissions() { return true;}
}