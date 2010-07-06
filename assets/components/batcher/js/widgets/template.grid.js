
Batcher.grid.Templates = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config,{
        url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/template/getList'
            ,thread: config.thread
        }
        ,fields: ['id','templatename','description','category','tvs']
        ,paging: true
        ,autosave: false
        ,remoteSort: true
        ,autoExpandColumn: 'templatename'
        ,cls: 'batcher-grid'
        ,sm: this.sm
        ,columns: [this.sm,{
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 60
        },{
            header: _('name')
            ,dataIndex: 'templatename'
            ,sortable: true
            ,width: 300
        },{
            header: _('category')
            ,dataIndex: 'category'
            ,sortable: true
            ,width: 120
        },{
            header: _('batcher.tvs')
            ,dataIndex: 'tvs'
            ,sortable: false
            ,width: 100
        }]
        ,viewConfig: {
            forceFit:true,
            enableRowBody:true,
            showPreview:true,
            getRowClass : function(rec, ri, p){
                var cls = 'batcher-row';

                if(this.showPreview){
                    //p.body = '<div class="batcher-resource-body">'+rec.data.content+'</div>';
                    return cls+' batcher-resource-expanded';
                }
                return cls+' batcher-resource-collapsed';
            }
        }
        ,tbar: [{
            text: _('batcher.bulk_actions')
            ,menu: this.getBatchMenu()
        },'->',{
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
    Batcher.grid.Templates.superclass.constructor.call(this,config)
};
Ext.extend(Batcher.grid.Templates,MODx.grid.Grid,{
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
            action: 'mgr/template/getList'
    	};
        Ext.getCmp('batcher-search').reset();
    	this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,_renderUrl: function(v,md,rec) {
        return '<a href="'+rec.data.url+'" target="_blank">'+rec.data.templatename+'</a>';
    }
    ,_showMenu: function(g,ri,e) {
        e.stopEvent();
        e.preventDefault();
        this.menu.record = this.getStore().getAt(ri).data;
        if (!this.getSelectionModel().isSelected(ri)) {
            this.getSelectionModel().selectRow(ri);
        }
        this.menu.removeAll();

        var m = [];
        if (this.menu.record.menu) {
            m = this.menu.record.menu;
            if (m.length > 0) {
                this.addContextMenuItem(m);
                this.menu.show(e.target);
            }
        } else {
            var z = this.getBatchMenu();

            for (var zz=0;zz < z.length;zz++) {
                this.menu.add(z[zz]);
            }
            this.menu.show(e.target);
        }
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
    ,changeTVValues: function(btn,e) {
        var sm = this.getSelectionModel();
        var cs = sm.getSelected();
        if (cs === false) return false;

        location.href = MODx.config.manager_url+'?a='+MODx.request.a+'&action=template/tvs&template='+cs.data.id;
    }
    ,changeDefaultTVValues: function(btn,e) {
        var sm = this.getSelectionModel();
        var cs = sm.getSelected();
        if (cs === false) return false;

        location.href = MODx.config.manager_url+'?a='+MODx.request.a+'&action=template/tvdefaults&template='+cs.data.id;
    }
    ,changeCategory: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = {templates: cs};
        if (!this.changeCategoryWindow) {
            this.changeCategoryWindow = MODx.load({
                xtype: 'batcher-window-change-category'
                ,record: r
                ,listeners: {
                    'success': {fn:function(r) {
                       this.refresh();
                    },scope:this}
                }
            });
        }
        this.changeCategoryWindow.setValues(r);
        this.changeCategoryWindow.show(e.target);
        return true;
    }
    ,getBatchMenu: function() {
        var bm = [];
        bm.push({
            text: _('batcher.change_category')
            ,handler: this.changeCategory
            ,scope: this
        },'-',{
            text: _('batcher.change_tv_values')
            ,handler: this.changeTVValues
            ,scope: this
        },{
            text: _('batcher.change_default_tv_values')
            ,handler: this.changeDefaultTVValues
            ,scope: this
        });
        return bm;
    }
});
Ext.reg('batcher-grid-template',Batcher.grid.Templates);


Batcher.window.ChangeCategory = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('batcher.change_category')
        ,url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/template/changecategory'
        }
        ,width: 400
        ,fields: [{
            xtype: 'hidden'
            ,name: 'templates'
        },{
            xtype: 'modx-combo-category'
            ,fieldLabel: _('batcher.category')
            ,name: 'category'
            ,hiddenName: 'category'
            ,anchor: '90%'
        }]
    });
    Batcher.window.ChangeCategory.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.window.ChangeCategory,MODx.Window);
Ext.reg('batcher-window-change-category',Batcher.window.ChangeCategory);
