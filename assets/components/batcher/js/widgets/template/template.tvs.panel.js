Batcher.panel.TemplateTVs = function(config) {
    config = config || {};
    Ext.apply(config,{
        id: 'modx-panel-resource'
        ,url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/template/'+config.processor
        }
        ,fileUpload: true
        ,border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container form-with-labels'
        ,items: [{
            html: '<h2>'+_('template')+': '+Batcher.template.templatename+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
            ,id: 'batcher-panel-header'
        },{
            xtype: 'modx-tabs'
            ,bodyStyle: 'padding: 10px'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,stateful: true
            ,stateId: 'batcher-template-tvs-tabpanel'
            ,stateEvents: ['tabchange']
            ,getState:function() {
                return {activeTab:this.items.indexOf(this.getActiveTab())};
            }
            ,items: [{
                title: _('batcher.tvs')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_(config.intromsg)+'</p>'
                    ,border: false
                    ,bodyStyle: 'padding: 10px'
                    ,height: 10
                    ,maxHeight: 10
                    ,autoScroll: true
                },{
                    xtype: 'hidden'
                    ,name: 'template'
                    ,value: Batcher.template.id
                },{
                    html: ''
                    ,xtype: 'panel'
                    ,border: false
                    ,width: '97%'
                    ,anchor: '100%'
                    ,bodyStyle: 'padding: 15px;'
                    ,autoHeight: true
                    ,autoLoad: {
                        url: Batcher.config.connectorUrl
                        ,method: 'GET'
                        ,params: {
                           action: 'mgr/loadtvs'
                           ,class_key: 'modResource'
                           ,template: Batcher.template.id
                           ,resource: 0
                           ,showCheckbox: 1
                        }
                        ,scripts: true
                        ,callback: function() {
                            MODx.fireEvent('ready');
                            
                        }
                        ,scope: this
                    }
                },{
                    html: (Batcher.resources ? '<hr />'+Batcher.resources : '')
                    ,border: false
                    ,bodyStyle: 'padding: 15px'
                }]
            }]
        }]
    });
    Batcher.panel.TemplateTVs.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.panel.TemplateTVs,MODx.FormPanel);
Ext.reg('batcher-panel-template-tvs',Batcher.panel.TemplateTVs);


MODx.triggerRTEOnChange = function() {
};
MODx.fireResourceFormChange = function(f,nv,ov) {
    Ext.getCmp('modx-panel-resource').fireEvent('fieldChange');
};