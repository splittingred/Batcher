<?php
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