Ext.onReady(function() {
    MODx.load({ xtype: 'batcher-page-template-tv-defaults'});
});

Batcher.page.TemplateTVDefaults = function(config) {
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
            ,processor: 'changeDefaultTVs'
            ,intromsg: 'batcher.template.tvdefaults.intro_msg'
        }]
        ,buttons: [{
            process: 'mgr/template/changedefaulttvs'
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
    Batcher.page.TemplateTVDefaults.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.page.TemplateTVDefaults,MODx.Component);
Ext.reg('batcher-page-template-tv-defaults',Batcher.page.TemplateTVDefaults);