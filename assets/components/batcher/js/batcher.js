var Batcher = function(config) {
    config = config || {};
    Batcher.superclass.constructor.call(this,config);
};
Ext.extend(Batcher,Ext.Component,{
    page:{},window:{},grid:{},tree:{},panel:{},combo:{},config: {}
});
Ext.reg('batcher',Batcher);

var Batcher = new Batcher();