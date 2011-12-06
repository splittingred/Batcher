Batcher.panel.Home = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container form-with-labels'
        ,items: [{
            html: '<h2>'+_('batcher')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,stateful: true
            ,stateId: 'batcher-home-tabpanel'
            ,stateEvents: ['tabchange']
            ,getState:function() {
                return {activeTab:this.items.indexOf(this.getActiveTab())};
            }
            ,items: [{
                title: _('batcher.resources')
                ,tabTip: 'Batcher Batcher Batcher (mushroom mushroom!)'
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('batcher.intro_msg')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'batcher-grid-resource'
                    ,preventRender: true
                    ,cls: 'main-wrapper'
                }]
            },{
                title: _('batcher.templates')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('batcher.templates.intro_msg')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'batcher-grid-template'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            }]
        }]
    });
    Batcher.panel.Home.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.panel.Home,MODx.Panel);
Ext.reg('batcher-panel-home',Batcher.panel.Home);
