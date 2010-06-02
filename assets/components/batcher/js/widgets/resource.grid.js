
Batcher.grid.Resources = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config,{
        url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/resource/getList'
            ,thread: config.thread
        }
        ,fields: ['id','pagetitle','template','templatename','deleted','published','hidemenu','menu']
        ,paging: true
        ,autosave: false
        ,remoteSort: true
        ,autoExpandColumn: 'pagetitle'
        ,cls: 'batcher-grid'
        ,sm: this.sm
        ,columns: [this.sm,{
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 80
        },{
            header: _('pagetitle')
            ,dataIndex: 'pagetitle'
            ,sortable: true
            ,width: 100
        },{
            header: _('template')
            ,dataIndex: 'templatename'
            ,sortable: true
            ,width: 120
        },{
            header: _('published')
            ,dataIndex: 'published'
            ,sortable: true
            ,editor: { xtype: 'combo-boolean' ,renderer: 'boolean' }
            ,width: 80
        },{
            header: _('batcher.hidemenu')
            ,dataIndex: 'hidemenu'
            ,sortable: true
            ,editor: { xtype: 'combo-boolean' ,renderer: 'boolean' }
            ,width: 80
        }]
        ,viewConfig: {
            forceFit:true,
            enableRowBody:true,
            showPreview:true,
            getRowClass : function(rec, ri, p){
                var cls = 'batcher-row';
                if (!rec.data.published) cls += ' batcher-unpublished';
                if (rec.data.deleted) cls += ' batcher-deleted';
                if (rec.data.hidemenu) cls += ' batcher-hidemenu';

                if(this.showPreview){
                    //p.body = '<div class="batcher-resource-body">'+rec.data.content+'</div>';
                    return cls+' batcher-resource-expanded';
                }
                return cls+' batcher-resource-collapsed';
            }
        }
        ,tbar: [{
            text: _('bulk_actions')
            ,menu: this.getBatchMenu()
        },'->',{
            xtype: 'modx-combo-template'
            ,name: 'template'
            ,id: 'batcher-template'
            ,emptyText: _('batcher.filter_by_template')
            ,listeners: {
                'select': {fn:this.filterTemplate,scope:this}
            }
        },{
            xtype: 'textfield'
            ,name: 'search'
            ,id: 'batcher-search'
            ,emptyText: _('search')
            ,listeners: {
                'change': {fn:this.search,scope:this}
                ,'render': {fn:function(tf) {
                    tf.getEl().addKeyListener(Ext.EventObject.ENTER,function() {
                        this.search(tf);
                    },this);
                },scope:this}
            }
        },{
            xtype: 'button'
            ,id: 'batcher-filter-clear'
            ,text: _('filter_clear')
            ,listeners: {
                'click': {fn: this.clearFilter, scope: this}
            }
        }]
    });
    Batcher.grid.Resources.superclass.constructor.call(this,config)
};
Ext.extend(Batcher.grid.Resources,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        this.getStore().setBaseParam('search',tf.getValue());
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,filterTemplate: function(cb,nv,ov) {
        this.getStore().setBaseParam('template',cb.getValue());
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearFilter: function() {
    	this.getStore().baseParams = {
            action: 'mgr/resource/getList'
    	};
        Ext.getCmp('batcher-search').reset();
        Ext.getCmp('batcher-template').reset();
    	this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,_renderUrl: function(v,md,rec) {
        return '<a href="'+rec.data.url+'" target="_blank">'+rec.data.pagetitle+'</a>';
    }
    ,getSelectedAsList: function() {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i=0;i<sels.length;i++) {
            cs += ','+sels[i].data.id;
        }
        cs = Ext.util.Format.substr(cs,1);
        return cs;
    }
    
    ,batchAction: function(act,btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/resource/batch'
                ,resources: cs
                ,batch: act
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                       var t = Ext.getCmp('modx-resource-tree');
                       if (t) { t.refresh(); }
                },scope:this}
            }
        });
        return true;
    }
    ,changeParent: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = {
            resources: cs
        };

        if (!this.changeParentWindow) {
            this.changeParentWindow = MODx.load({
                xtype: 'batcher-window-change-parent'
                ,record: r
                ,listeners: {
                    'success': {fn:function(r) {
                       this.refresh();
                       var t = Ext.getCmp('modx-resource-tree');
                       if (t) { t.refresh(); }
                    },scope:this}
                }
            });
        }
        this.changeParentWindow.setValues(r);
        this.changeParentWindow.show(e.target);
        return true;
    }

    ,getBatchMenu: function() {
        var m = [];
        m.push({
            text: _('batcher.toggle')
            ,menu: [{
                text: _('batcher.published')
                ,handler: function(btn,e) {
                    this.batchAction('publish',btn,e);
                }
                ,scope: this
            },{
                text: _('batcher.unpublished')
                ,handler: function(btn,e) {
                    this.batchAction('unpublish',btn,e);
                }
                ,scope: this
            },'-',{
                text: _('batcher.hidemenu')
                ,handler: function(btn,e) {
                    this.batchAction('hidemenu',btn,e);
                }
                ,scope: this
            },{
                text: _('batcher.unhidemenu')
                ,handler: function(btn,e) {
                    this.batchAction('unhidemenu',btn,e);
                }
                ,scope: this
            },'-',{
                text: _('batcher.cacheable')
                ,handler: function(btn,e) {
                    this.batchAction('cacheable',btn,e);
                }
                ,scope: this
            },{
                text: _('batcher.uncacheable')
                ,handler: function(btn,e) {
                    this.batchAction('cacheable',btn,e);
                }
                ,scope: this
            },'-',{
                text: _('batcher.searchable')
                ,handler: function(btn,e) {
                    this.batchAction('searchable',btn,e);
                }
                ,scope: this
            },{
                text: _('batcher.unsearchable')
                ,handler: function(btn,e) {
                    this.batchAction('unsearchable',btn,e);
                }
                ,scope: this
            },'-',{
                text: _('batcher.richtext')
                ,handler: function(btn,e) {
                    this.batchAction('richtext',btn,e);
                }
                ,scope: this
            },{
                text: _('batcher.unrichtext')
                ,handler: function(btn,e) {
                    this.batchAction('unrichtext',btn,e);
                }
                ,scope: this
            },'-',{
                text: _('batcher.deleted')
                ,handler: function(btn,e) {
                    this.batchAction('delete',btn,e);
                }
                ,scope: this
            },{
                text: _('batcher.undeleted')
                ,handler: function(btn,e) {
                    this.batchAction('undelete',btn,e);
                }
                ,scope: this
            }]
        },{
            text: _('batcher.change_parent')
            ,handler: this.changeParent
            ,scope: this
        });
        return m;
    }
});
Ext.reg('batcher-grid-resource',Batcher.grid.Resources);


Batcher.window.ChangeParent = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('batcher.change_parent')
        ,url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/resource/changeparent'
        }
        ,width: 400
        ,fields: [{
            xtype: 'hidden'
            ,name: 'resources'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('batcher.parent')
            ,name: 'parent'
            ,anchor: '90%'
        }]
        ,keys: []
    });
    Batcher.window.ChangeParent.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.window.ChangeParent,MODx.Window);
Ext.reg('batcher-window-change-parent',Batcher.window.ChangeParent);