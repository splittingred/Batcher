Batcher.panel.Home = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,items: [{
            html: '<h2>'+_('batcher')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,bodyStyle: 'padding: 10px'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,stateful: true
            ,stateId: 'batcher-home-tabpanel'
            ,stateEvents: ['tabchange']
            ,getState:function() {
                return {activeTab:this.items.indexOf(this.getActiveTab())};
            }
            ,items: [{
                title: _('batcher')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('batcher.intro_msg')+'</p>'
                    ,border: false
                    ,bodyStyle: 'padding: 10px'
                },{
                    xtype: 'batcher-grid-resource'
                    ,preventRender: true
                }]
            }]
        }]
    });
    Batcher.panel.Home.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.panel.Home,MODx.Panel);
Ext.reg('batcher-panel-home',Batcher.panel.Home);
