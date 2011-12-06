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
class BatcherTemplateTvsManagerController extends BatcherManagerController {
    /** @var modTemplate $template */
    public $template;
    public $resourcesOutput = array();
    
    public function process(array $scriptProperties = array()) {
        $placeholders = array();
        if (empty($scriptProperties['template'])) return $this->failure($this->modx->lexicon('batcher.template_err_ns'));
        $this->template = $this->modx->getObject('modTemplate',$scriptProperties['template']);
        if (empty($this->template)) return $this->failure($this->modx->lexicon('batcher.template_err_nf'));

        /* get all resources for template */
        $c = $this->modx->newQuery('modResource');
        $c->where(array(
            'template' => $this->template->get('id'),
        ));
        $c->sortby('pagetitle','ASC');
        $resources = $this->template->getMany('Resources',$c);
        $this->resourcesOutput[] = '<p>'.$this->modx->lexicon('batcher.resources_affect').'</p><ol>';
        $i = 1;
        foreach ($resources as $resource) {
            if ($i > 50) {
                $this->resourcesOutput[] = '<li>- '.$this->modx->lexicon('batcher.and_others',array('count' => (count($resources) - $i - 1))).'</li>';
                break;
            }
            $this->resourcesOutput[] = '<li>- '.$resource->get('pagetitle').' ('.$resource->get('id').')</li>';
            $i++;
        }
        $this->resourcesOutput[] = '</ol>';

        return $placeholders;
    }
    public function getPageTitle() { return $this->modx->lexicon('batcher'); }
    public function loadCustomCssJs() {
        $managerUrl = $this->modx->getOption('manager_url');

        $tj = $this->template->get(array('id','templatename','description'));
        $tj = $this->modx->toJSON($tj);
        $this->addHtml('<script type="text/javascript">Ext.onReady(function() {
Batcher.template = '.$tj.';
Batcher.resources = "'.implode('',$this->resourcesOutput).'";
});</script>');
        $this->addJavascript($managerUrl.'assets/modext/util/datetime.js');
        $this->addJavascript($managerUrl.'assets/modext/widgets/element/modx.panel.tv.renders.js');
        $this->addJavascript($this->batcher->config['jsUrl'].'widgets/template/template.tvs.panel.js');
        $this->addLastJavascript($this->batcher->config['jsUrl'].'sections/template/tvs.js');
    }
    public function getTemplateFile() { return $this->batcher->config['templatesPath'].'template/tvs.tpl'; }
}