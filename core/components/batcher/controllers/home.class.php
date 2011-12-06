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
class BatcherHomeManagerController extends BatcherManagerController {

    public function process(array $scriptProperties = array()) {
        
    }
    public function getPageTitle() { return $this->modx->lexicon('batcher'); }
    public function loadCustomCssJs() {
        $this->addJavascript($this->modx->getOption('manager_url').'assets/modext/util/datetime.js');
        $this->addJavascript($this->batcher->config['jsUrl'].'widgets/template.grid.js');
        $this->addJavascript($this->batcher->config['jsUrl'].'widgets/resource.grid.js');
        $this->addJavascript($this->batcher->config['jsUrl'].'widgets/home.panel.js');
        $this->addLastJavascript($this->batcher->config['jsUrl'].'sections/home.js');
    }
    public function getTemplateFile() { return $this->batcher->config['templatesPath'].'home.tpl'; }
}