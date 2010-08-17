
Batcher.grid.Resources = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config,{
        url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/resource/getList'
            ,thread: config.thread
        }
        ,fields: ['id','pagetitle','template','templatename','alias','deleted','published','createdon','editedon','hidemenu']
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
            ,width: 60
        },{
            header: _('pagetitle')
            ,dataIndex: 'pagetitle'
            ,sortable: true
            ,width: 100
        },{
            header: _('alias')
            ,dataIndex: 'alias'
            ,sortable: true
            ,width: 100
        },{
            header: _('batcher.template')
            ,dataIndex: 'templatename'
            ,sortable: true
            ,width: 120
        },{
            header: _('batcher.published')
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
            text: _('batcher.bulk_actions')
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
        cs = cs.substr(1);
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

        var r = {resources: cs};
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
    ,changeTemplate: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = {resources: cs};
        if (!this.changeTemplateWindow) {
            this.changeTemplateWindow = MODx.load({
                xtype: 'batcher-window-change-template'
                ,record: r
                ,listeners: {
                    'success': {fn:function(r) {
                       this.refresh();
                    },scope:this}
                }
            });
        }
        this.changeTemplateWindow.setValues(r);
        this.changeTemplateWindow.show(e.target);
        return true;
    }
    ,changeAuthors: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = {resources: cs};
        if (!this.changeAuthorsWindow) {
            this.changeAuthorsWindow = MODx.load({
                xtype: 'batcher-window-change-authors'
                ,record: r
                ,listeners: {
                    'success': {fn:function(r) {
                       this.refresh();
                    },scope:this}
                }
            });
        }
        this.changeAuthorsWindow.setValues(r);
        this.changeAuthorsWindow.show(e.target);
        return true;
    }
    ,changeDates: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = {resources: cs};
        if (!this.changeDatesWindow) {
            this.changeDatesWindow = MODx.load({
                xtype: 'batcher-window-change-dates'
                ,record: r
                ,listeners: {
                    'success': {fn:function(r) {
                       this.refresh();
                    },scope:this}
                }
            });
        }
        this.changeDatesWindow.setValues(r);
        this.changeDatesWindow.show(e.target);
        return true;
    }

    ,getBatchMenu: function() {
        var bm = [];
        bm.push({
            text: _('batcher.toggle')
            ,menu: {
                items: [{
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
            }
        },{
            text: _('batcher.change_parent')
            ,handler: this.changeParent
            ,scope: this
        },{
            text: _('batcher.change_template')
            ,handler: this.changeTemplate
            ,scope: this
        },{
            text: _('batcher.change_dates')
            ,handler: this.changeDates
            ,scope: this
        },{
            text: _('batcher.change_authors')
            ,handler: this.changeAuthors
            ,scope: this
        });
        return bm;
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
    });
    Batcher.window.ChangeParent.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.window.ChangeParent,MODx.Window);
Ext.reg('batcher-window-change-parent',Batcher.window.ChangeParent);

Batcher.window.ChangeTemplate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('batcher.change_template')
        ,url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/resource/changetemplate'
        }
        ,width: 400
        ,fields: [{
            xtype: 'hidden'
            ,name: 'resources'
        },{
            xtype: 'modx-combo-template'
            ,fieldLabel: _('batcher.template')
            ,name: 'template'
            ,hiddenName: 'template'
            ,anchor: '90%'
        }]
    });
    Batcher.window.ChangeTemplate.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.window.ChangeTemplate,MODx.Window);
Ext.reg('batcher-window-change-template',Batcher.window.ChangeTemplate);


Batcher.window.ChangeAuthors = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('batcher.change_authors')
        ,url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/resource/changeauthors'
        }
        ,width: 400
        ,fields: [{
            xtype: 'hidden'
            ,name: 'resources'
        },{
            xtype: 'modx-combo-user'
            ,fieldLabel: _('batcher.createdby')
            ,name: 'createdby'
            ,hiddenName: 'createdby'
            ,anchor: '90%'
        },{
            xtype: 'modx-combo-user'
            ,fieldLabel: _('batcher.editedby')
            ,name: 'editedby'
            ,hiddenName: 'editedby'
            ,anchor: '90%'
        },{
            xtype: 'modx-combo-user'
            ,fieldLabel: _('batcher.publishedby')
            ,name: 'publishedby'
            ,hiddenName: 'publishedby'
            ,anchor: '90%'
        }]
    });
    Batcher.window.ChangeAuthors.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.window.ChangeAuthors,MODx.Window);
Ext.reg('batcher-window-change-authors',Batcher.window.ChangeAuthors);


Batcher.window.ChangeDates = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('batcher.change_dates')
        ,url: Batcher.config.connector_url
        ,baseParams: {
            action: 'mgr/resource/changedates'
        }
        ,width: 500
        ,fields: [{
            xtype: 'hidden'
            ,name: 'resources'
        },{
            xtype: 'xdatetime'
            ,fieldLabel: _('batcher.createdon')
            ,name: 'createdon'
            ,hiddenName: 'createdon'
            ,anchor: '90%'
            ,allowBlank: true
            ,dateFormat: MODx.config.manager_date_format
            ,timeFormat: MODx.config.manager_time_format
            ,dateWidth: 120
            ,timeWidth: 120
        },{
            xtype: 'xdatetime'
            ,fieldLabel: _('batcher.editedon')
            ,name: 'editedon'
            ,hiddenName: 'editedon'
            ,anchor: '90%'
            ,allowBlank: true
            ,dateFormat: MODx.config.manager_date_format
            ,timeFormat: MODx.config.manager_time_format
            ,dateWidth: 120
            ,timeWidth: 120
        },{
            xtype: 'xdatetime'
            ,fieldLabel: _('batcher.pub_date')
            ,name: 'pub_date'
            ,hiddenName: 'pub_date'
            ,anchor: '90%'
            ,allowBlank: true
            ,dateFormat: MODx.config.manager_date_format
            ,timeFormat: MODx.config.manager_time_format
            ,dateWidth: 120
            ,timeWidth: 120
        },{
            xtype: 'xdatetime'
            ,fieldLabel: _('batcher.unpub_date')
            ,name: 'unpub_date'
            ,hiddenName: 'unpub_date'
            ,anchor: '90%'
            ,allowBlank: true
            ,dateFormat: MODx.config.manager_date_format
            ,dateWidth: 120
            ,timeWidth: 120
        }]
    });
    Batcher.window.ChangeDates.superclass.constructor.call(this,config);
};
Ext.extend(Batcher.window.ChangeDates,MODx.Window);
Ext.reg('batcher-window-change-dates',Batcher.window.ChangeDates);