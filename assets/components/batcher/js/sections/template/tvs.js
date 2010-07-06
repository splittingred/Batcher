Ext.onReady(function() {
    MODx.load({ xtype: 'batcher-page-template-tvs'});
});

Batcher.page.TemplateTVs = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        formpanel: 'modx-panel-resource'
        ,actions: {
            'new': MODx.request.a
            ,edit: MODx.request.a
            ,cancel: MODx.request.a
        }
        ,components: [{
            xtype: 'batcher-panel-template-tvs'
            ,renderTo: 'batcher-panel-template-tvs-div'
            ,processor: 'changeTVs'
            ,intromsg: 'batcher.template.tvs.intro_msg'
        }]
        ,buttons: [{
            process: 'mgr/template/changetvs'
            ,text: _('save')
            ,method: 'remote'
            ,keys: [{
                key: 's'
                ,alt: true
                ,ctrl: true
            }]
        },'-',{
            process: 'cancel'
            ,text: _('cancel')
            ,params: {a:MODx.request.a}
        }]
    });
    Batcher.page.TemplateTVs.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.page.TemplateTVs,MODx.Component);
Ext.reg('batcher-page-template-tvs',Batcher.page.TemplateTVs);