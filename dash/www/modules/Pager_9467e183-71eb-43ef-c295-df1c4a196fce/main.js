define(["backbone","Forms","Handlebars","QuickBase","css!./css/main.css"],function(t,e,i,s){"use strict";var n,a,o=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(e,t)},function(e,t){function i(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}),r=function(e){return{id:1005,componentName:"Pager",componentDescription:"Page through a data source's results",appKey:"Pager",appArgs:{quickStart:[{path:"Basics.Data"}],json:{version:"4.0.0",Basics:{Data:"",PagingType:"NONE",PagingNum:0,PageSize:2e3},Style:{Theme:"Dark",advanced:""}},schema:{type:"object",title:"Properties",properties:{Basics:{type:"object",title:"Basics",properties:{Data:{type:"data",title:"Data Source",default:""},PagingType:{type:"string",title:"Paging Type",default:"NONE",enum:["NONE","OFFSET","PAGENO"],options:{enum_titles:["None","Offset","Page Number"]}},PagingNum:{type:"integer",title:"Offset/Page Number",default:1},PageSize:{type:"integer",title:"Page Size",default:2e3}}},Style:{type:"object",title:"Style",options:{collapsed:!0},properties:{Theme:{type:"string",title:"Theme",options:{hidden:!0},enum:["Light","Dark"]},DashboardTheme:{options:{hidden:!0}},advanced:{type:"css",title:"Advanced CSS",default:""}}}}}}}},S=(l.pager=i.template({compiler:[7,">= 4.0.0"],main:function(e,t,i,s,n){return'<div class="slick-pager">\r\n    <span class="slick-pager-nav">\r\n        <span class="ui-state-default ui-corner-all ui-icon-container">\r\n            <span class="ui-icon ui-icon-seek-first ui-state-disabled"></span>\r\n        </span>\r\n        <span class="ui-state-default ui-corner-all ui-icon-container">\r\n            <span class="ui-icon ui-icon-seek-prev ui-state-disabled"></span>\r\n        </span>\r\n        <span class="bbf-editor page-num-input-container"></span>\r\n        <span class="ui-state-default ui-corner-all ui-icon-container">\r\n            <span class="ui-icon ui-icon-seek-next ui-state-disabled"></span>\r\n        </span>\r\n        <span class="ui-state-default ui-corner-all ui-icon-container">\r\n            <span class="ui-icon ui-icon-seek-end ui-state-disabled"></span>\r\n        </span>\r\n    </span>\r\n\r\n    <span class="slick-pager-settings">\r\n        <span class="slick-pager-settings-expanded" style="display:none;">\r\n            Show: <a data="-1">All</a>\r\n            <a data="25">25</a>\r\n            <a data="50">50</a>\r\n            <a data="100">100</a>\r\n        </span>\r\n        <span class="ui-state-default ui-corner-all ui-icon-container">\r\n            <span class="ui-icon ui-icon-lightbulb"></span>\r\n        </span>\r\n    </span>\r\n\r\n    <div class="slick-pager-status">\r\n        Showing all rows\r\n    </div>\r\n</div>'},useData:!0}),l);function l(){}function g(e){var n=a.call(this,e)||this;return n.VALIDATORS={PAGING_NUM:function(e,t){var i=t[g.KEYS.SETTINGS.PAGING_TYPE],s=t[g.KEYS.SETTINGS.PAGE_SIZE],t=t[g.KEYS.SETTINGS.TOTAL_ROWS];if(-1===s&&(s=t),i===n.PAGING_TYPE_OFFSET){if(t<e+s)return"Value exceeds total rows";if(e<0)return"Value must be at least 0"}else{if(e>Math.ceil(t/s))return"Value exceeds total pages";if(e<1)return"Value must be at least 1"}return!1}},n.PAGING_TYPE_OFFSET="OFFSET",n.hasInit=!1,n.ignorePagingSettingsChange=!1,n.pagingSettingsChanged=!1,n.skipSubscribe=!1,n.options=e,n.api=e.api,n.skipSubscribe=e.skipDataSourceSubscription,n.viewModel=new t.DeepModel,n.$el.html(S.pager()),n.$el.addClass("pager"),n.$btnFirst=n.$el.find(".ui-icon-seek-first"),n.$btnLast=n.$el.find(".ui-icon-seek-end"),n.$btnNext=n.$el.find(".ui-icon-seek-next"),n.$btnPrev=n.$el.find(".ui-icon-seek-prev"),n.$pageNumInputContainer=n.$el.find(".page-num-input-container"),n.$pageStatus=n.$el.find(".slick-pager-status"),n.$settingsPanel=n.$el.find(".slick-pager-settings-expanded"),n.$settingsToggle=n.$el.find(".ui-icon-lightbulb"),n.pageNumEditor=n.renderEditor(),n.$pageNumInputContainer.append(n.pageNumEditor.el),n}return a=t.View,o(g,a),g.prototype.onSettingsChange=function(n){var i,a=this;_.each(g.KEYS.SETTINGS,function(e,t){var i=a.VALIDATORS[t],s=_.extend(_.clone(a.viewModel.attributes),_.pick(n,e));_.isUndefined(n[e])||_.isFunction(i)&&(!_.isFunction(i)||!1!==i.call(a,n[e],s))||(_.includes(["DATA_SOURCE","PAGE_SORT","PAGING_TYPE"],t)?a.viewModel.set(e,n[e]):a.viewModel.set(e,Number(n[e])),"PAGING_NUM"===t&&a.displayErrors(null))}),this.hasInit||(this.hasInit=!0,i=this.viewModel.get(g.KEYS.SETTINGS.DATA_SOURCE),_.each(["PAGING_NUM","PAGE_SIZE","PAGING_TYPE"],function(e){var t;i&&(t=i.get(g.KEYS.MODEL[e])),(_.isNull(t)||_.isUndefined(t))&&(t=g.DEFAULTS[e]),a.viewModel.has(g.KEYS.SETTINGS[e])||a.viewModel.set(g.KEYS.SETTINGS[e],t)}),this.render(),this.initializeEvents(),this.dataModel||this.onDataSourceChange())},g.prototype.remove=function(){return t.View.prototype.remove.apply(this)},g.prototype.setTheme=function(e){var t=this.$el.find(".slick-pager");"Dark"===e?t.css("color","white"):"Light"===e&&t.css("color","black")},g.prototype.initializeEvents=function(){this.listenTo(this.viewModel,"change:"+g.KEYS.SETTINGS.DATA_SOURCE,this.onDataSourceChange.bind(this)),this.listenTo(this.viewModel,"change:"+g.KEYS.SETTINGS.PAGING_TYPE+" change:"+g.KEYS.SETTINGS.PAGING_NUM+" change:"+g.KEYS.SETTINGS.PAGE_SIZE+" change:"+g.KEYS.SETTINGS.PAGE_SORT,this.applyPagingSettings.bind(this)),this.$btnFirst.on("click",this.onPageFirst.bind(this)),this.$btnLast.on("click",this.onPageLast.bind(this)),this.$btnNext.on("click",this.onPageNext.bind(this)),this.$btnPrev.on("click",this.onPagePrev.bind(this)),this.$settingsToggle.on("click",this.onSettingsToggle.bind(this)),this.$el.find(".slick-pager-settings-expanded a").on("click",this.onSettingsClick.bind(this)),this.options.dashboardViewModel&&this.setTheme(this.options.dashboardViewModel.get("DashboardTheme")),this.pageNumEditor.on("change",_.debounce(this.onPageNumChange.bind(this),500))},g.prototype.applyPagingSettings=function(){var s=this,n={};this.ignorePagingSettingsChange||(this.pagingSettingsChanged=!0,this.dataModel&&(_.each(g.KEYS.MODEL,function(e,t){var i,t=g.KEYS.SETTINGS[t];t&&(i=s.viewModel.get(t)),_.isUndefined(i)||(e===g.KEYS.MODEL.PAGING_NUM?(s.viewModel.get(g.KEYS.SETTINGS.PAGING_TYPE)!==s.PAGING_TYPE_OFFSET&&(i=Math.max(0,i-1)),_.has(s.viewModel.changedAttributes(),t)&&(n[e]=i)):n[e]=i)}),_.isFunction(this.api.page)&&this.api.page(this.dataModel,n)),this.skipSubscribe||_.each(["PAGING_NUM","PAGE_SIZE"],function(e){e=g.KEYS.SETTINGS[e];s.viewModel.has(e)&&s.api.setProperty(e,s.viewModel.get(e))}))},g.prototype.displayErrors=function(e){e?(s.ErrorTooltip.show(e.message,this.$pageNumInputContainer,!1),this.$el.addClass("bbf-error")):(this.$el.removeClass("bbf-error"),s.ErrorTooltip.clearAll())},g.prototype.getCurrentPageNum=function(){var e=this.viewModel.get(g.KEYS.SETTINGS.PAGING_NUM);return isNaN(e)||parseInt(e)!==e||isNaN(parseInt(e,10))?1:e},g.prototype.getMaxPage=function(e,t){return _.isUndefined(e)&&(e=this.viewModel.get(g.KEYS.SETTINGS.PAGE_SIZE)),_.isUndefined(t)&&(t=this.viewModel.get(g.KEYS.SETTINGS.TOTAL_ROWS)),-1===e?1:this.viewModel.get(g.KEYS.SETTINGS.PAGING_TYPE)===this.PAGING_TYPE_OFFSET?t-e:Math.ceil(t/e)},g.prototype.onData=function(s){var e,t,n={},i=!0;_.isEmpty(s.paging)?this.viewModel.set({"Basics.PagingType":"NONE"},{silent:!0}):(_.each(g.KEYS.SETTINGS,_.bind(function(e,t){var i=s.paging[g.KEYS.META[t]];_.isUndefined(i)||(n[e]="PAGING_TYPE"===t?i:Number(i))},this)),e=s.paging[g.KEYS.META.PAGING_TYPE],t=Number(s.paging[g.KEYS.META.PAGE_SIZE]),_.isUndefined(n[g.KEYS.SETTINGS.START_ROWS])||(n[g.KEYS.SETTINGS.START_ROWS]>n[g.KEYS.SETTINGS.TOTAL_ROWS]?((n={})[g.KEYS.SETTINGS.PAGING_NUM]=e===this.PAGING_TYPE_OFFSET?0:1,i=!1):e===this.PAGING_TYPE_OFFSET?n[g.KEYS.SETTINGS.PAGING_NUM]=n[g.KEYS.SETTINGS.START_ROWS]:n[g.KEYS.SETTINGS.PAGING_NUM]=Math.floor(n[g.KEYS.SETTINGS.START_ROWS]/t)+1),this.ignorePagingSettingsChange=i,this.viewModel.set(n),this.ignorePagingSettingsChange=!1),this.updatePageNum(),this.pagingSettingsChanged&&(this.trigger("paged"),this.pagingSettingsChanged=!1)},g.prototype.onDataSourceChange=function(){var i=this;this.dataModel&&(this.api.unsubscribe(this.dataModel),_.each(g.KEYS.MODEL,function(e){var t;null!==(t=i.dataModel)&&void 0!==t&&t.unset(e,{silent:!0})})),this.dataModel=this.viewModel.get(g.KEYS.SETTINGS.DATA_SOURCE)||null,this.skipSubscribe||this.api.subscribe(this.dataModel,this.onData.bind(this))},g.prototype.onPageFirst=function(){this.viewModel.set(g.KEYS.SETTINGS.PAGING_NUM,this.viewModel.get(g.KEYS.SETTINGS.PAGING_TYPE)===this.PAGING_TYPE_OFFSET?0:1)},g.prototype.onPageLast=function(){var e=this.viewModel.get(g.KEYS.SETTINGS.PAGE_SIZE),t=this.viewModel.get(g.KEYS.SETTINGS.TOTAL_ROWS);this.viewModel.set(g.KEYS.SETTINGS.PAGING_NUM,this.getMaxPage(e,t))},g.prototype.onPageNext=function(){var e=this.viewModel.get(g.KEYS.SETTINGS.PAGE_SIZE),t=this.getCurrentPageNum()+1,i=this.viewModel.get(g.KEYS.SETTINGS.TOTAL_ROWS);this.viewModel.set(g.KEYS.SETTINGS.PAGING_NUM,Math.min(t,this.getMaxPage(e,i)))},g.prototype.onPageNumChange=function(){var e;this.pageNumEditor&&(e=this.pageNumEditor.validate(),this.displayErrors(e),e||this.viewModel.set(g.KEYS.SETTINGS.PAGING_NUM,this.pageNumEditor.getValue()))},g.prototype.onPagePrev=function(){var e=this.getCurrentPageNum()-1;this.viewModel.set(g.KEYS.SETTINGS.PAGING_NUM,Math.max(e,this.viewModel.get(g.KEYS.SETTINGS.PAGING_TYPE)===this.PAGING_TYPE_OFFSET?0:1))},g.prototype.onSettingsClick=function(e){var t={},i=this.viewModel.get(g.KEYS.SETTINGS.PAGING_NUM),s=parseInt($(e.target).attr("data")||"",10),e=this.viewModel.get(g.KEYS.SETTINGS.TOTAL_ROWS),i=s&&e?Math.min(Math.max(1,i),this.getMaxPage(s,e)):1;t[g.KEYS.SETTINGS.PAGING_NUM]=i,t[g.KEYS.SETTINGS.PAGE_SIZE]=s,this.viewModel.set(t)},g.prototype.onSettingsToggle=function(){this.$settingsPanel.toggle()},g.prototype.renderEditor=function(){var t=this;return new e.editors.Number({key:g.KEYS.SETTINGS.PAGING_NUM,model:this.viewModel,schema:{editorAttrs:{max:3600,min:1,step:1}},validators:[function(e){e=t.VALIDATORS.PAGING_NUM.call(t,e,t.viewModel.toFlat());if(e)return{type:"pagenum",message:e}}]}).render()},g.prototype.setSortConfig=function(e){this.viewModel.set(g.KEYS.SETTINGS.PAGE_SORT,null,{silent:!0}),this.viewModel.set(g.KEYS.SETTINGS.PAGE_SORT,e)},g.prototype.updatePageNum=function(){var e=this.viewModel.get(g.KEYS.SETTINGS.PAGE_SIZE),t=this.viewModel.get(g.KEYS.SETTINGS.PAGING_TYPE),i="",s=this.viewModel.get(g.KEYS.SETTINGS.TOTAL_ROWS),n=this.getMaxPage(e,s),a=this.viewModel.get(g.KEYS.SETTINGS.PAGING_NUM)||(t===this.PAGING_TYPE_OFFSET?0:1),i=-1===n?"Showing all "+s+" rows":t===this.PAGING_TYPE_OFFSET?0===e?"Showing all "+s+" rows, starting at "+(a+1):"Showing "+e+" of "+s+" rows, starting at "+(a+1):_.isNaN(n)||0===e?"Showing all rows":"Showing page "+a+" of "+n;a===(t===this.PAGING_TYPE_OFFSET?0:1)?(this.$btnFirst.first().addClass("ui-state-disabled"),this.$btnPrev.first().addClass("ui-state-disabled")):a===n&&(this.$btnLast.first().addClass("ui-state-disabled"),this.$btnNext.first().addClass("ui-state-disabled")),a<n&&(this.$btnLast.first().removeClass("ui-state-disabled"),this.$btnNext.first().removeClass("ui-state-disabled")),a>(t===this.PAGING_TYPE_OFFSET?0:1)&&(this.$btnFirst.first().removeClass("ui-state-disabled"),this.$btnPrev.first().removeClass("ui-state-disabled")),this.$pageStatus&&this.$pageStatus.text(i)},g.getComponentDefinition=r,g.DEFAULTS={PAGE_SIZE:2e3,PAGING_TYPE:"NONE",PAGING_NUM:0},g.KEYS={META:{PAGE_SIZE:"pageSize",PAGING_TYPE:"pagingType",NUM_ROWS:"numRows",START_ROWS:"startRows",TOTAL_ROWS:"totalNumRows"},MODEL:{PAGING_TYPE:"_pagingType",PAGING_NUM:"_pagingNum",PAGE_SIZE:"_pageSize",PAGE_SORT:"_pageSort",SERVER_PAGING:"_serverPaging"},SETTINGS:{DATA_SOURCE:"Basics.Data",NUM_ROWS:"numRows",PAGING_TYPE:"Basics.PagingType",PAGING_NUM:"Basics.PagingNum",PAGE_SIZE:"Basics.PageSize",PAGE_SORT:"pageSort",START_ROWS:"startRows",TOTAL_ROWS:"totalNumRows",THEME:"Style.Theme"}},g});