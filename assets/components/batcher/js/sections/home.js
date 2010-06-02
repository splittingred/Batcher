Ext.onReady(function() {
    MODx.load({ xtype: 'batcher-page-home'});
});

Batcher.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'batcher-panel-home'
            ,renderTo: 'batcher-panel-home-div'
        }]
    }); 
    Batcher.page.Home.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.page.Home,MODx.Component);
Ext.reg('batcher-page-home',Batcher.page.Home);