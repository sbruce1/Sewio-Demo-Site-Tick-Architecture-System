define(["backbone","Handlebars","QuickBase","css!./css/app.css"],function(i,e,s){"use strict";var n,t=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(e,t)},function(e,t){function i(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}),o=(r.focus2Array=function(e){var t=[],i=/"([^"]*)"/g,e=null!=e&&e.toString?e.toString():"",n=/^\[([^\]]*)]$/.exec(e);if(null!==n){if(/^(?:"[^"\\]*(?:\\[\S\s][^"\\]*)*")(?:,"[^"\\]*(?:\\[\S\s][^"\\]*)*")*/.test(n[1]))for(var a=void 0;null!==(a=i.exec(n[1]));)t.push(_.map(a[1].split(","),function(e){return e.replace(/&#44;/g,",")}))}else t.push(e.split(","));return t},r.focus2SingleCommonPath=function(e){for(var n=r.focus2Array(e),a=[],t=_.min(_.map(n,"length"))||0,i=0;i<t;i++)if("break"===function(t){var i=n[0][t];if(!_.every(n,function(e){return e[t]===i}))return"break";a.push(i)}(i))break;return a},r);function r(){}var a=(h.getComponentDefinition=function(e){var t={id:19,componentName:"Breadcrumbs",componentDescription:"Breadcrumbs",appKey:"Breadcrumbs",css:"breadcrumbs",listViewThumb:e.websiteUrl+"Images/breadcrumbs.png",ghostViewThumb:null,buildViewThumb:null,appArgs:{websiteUrl:e.websiteUrl,quickStart:[{path:"Basic.Path",message:"define Path"}],json:{version:"4.0.0d2",Basic:{Path:"",Breakdown:[],UseColumnNames:!1,Theme:"Dark"},Style:{advanced:""}},schema:{type:"object",title:"Properties",properties:{Basic:{type:"object",title:"Settings",options:{collapsed:!1},propertyOrder:200,properties:{Path:{type:"viewstate",title:"Path",default:""},Breakdown:{type:"viewstate",title:"Breakdown",default:""},UseColumnNames:{type:"boolean",title:"Use Column Names",default:!1,format:"checkbox"},Theme:{type:"string",title:"Theme",options:{hidden:!0},enum:["Dark","Light"]},DashboardTheme:{options:{hidden:!0}}}},Style:{type:"object",title:"Style",options:{collapsed:!0},propertyOrder:210,properties:{advanced:{type:"css",title:"Advanced CSS",default:""}}}}}}};if(0<_.keys(e.settingsModel.attributes).length)for(var i=_.find(h.upgrades,{version:e.settingsModel.get("version")}),n=void 0===i?1:h.upgrades.indexOf(i)+1;n<h.upgrades.length;n+=1){var a=h.upgrades[n];a.fn(e.settingsModel),e.settingsModel.set("version",a.version)}return t},h.upgrades=[{version:0,fn:function(){}},{version:"4.3.0",fn:function(e){e.set("Basic.UseColumnNames",!1)}}],h);function h(){}var c=(l.app=e.template({compiler:[7,">= 4.0.0"],main:function(e,t,i,n,a){return'<div class="breadcrumb-container">\r\n    <div class="breadcrumb">\r\n        <div class="home-div" style="z-index: 101">\r\n            <i class="fa fa-home"></i>\r\n            &nbsp;</div>\r\n    </div>\r\n</div>'},useData:!0}),l.appStackItem=e.template({compiler:[7,">= 4.0.0"],main:function(e,t,i,n,a){return"<span>"+e.escapeExpression(e.lambda(t,t))+'</span><div class="small-ico close"></div>'},useData:!0}),l);function l(){}var d,u,p=(d=i.View,t(m,d),m);function m(e,t,i,n){var a=d.call(this)||this;a.info=e;t=t?e.column:e.name.replace(/&#44;/g,",");return a.$el.html(c.appStackItem(t)),a.$el.attr("id",i+e.column),e.placeholder?a.$el.addClass("placeholder"):(a.$el.on(s.Tools.clickEvent(),function(e){e.stopPropagation(),e.preventDefault(),n.onItemSelect(a)}),a.$el.find(".close").on(s.Tools.clickEvent(),function(e){e.stopPropagation(),e.preventDefault(),n.onItemClose(a)})),a}function f(e){var t=u.call(this,e)||this;return t.itemViews=[],t.breakdownColumns=[],t.data=[],t.uniqueId=_.uniqueId("breadcrumb_"),t.breakdownCache=[],t.restorePath=!0,t.api=e.api,t.disableSortable=e.disableSortable,t.$el.html(c.app({})),t.$el.addClass("breadcrumb-app"),t.$breadcrumb=t.$el.find(".breadcrumb"),t.$home=t.$el.find(".home-div"),t.viewModel=new i.DeepModel({"Basic.Breakdown":[],"Basic.Path":""}),t.hasInit=!1,t}return u=i.View,t(f,u),f.prototype.onItemClose=function(e){e=this.data.indexOf(e.info),e=_.map(this.data.slice(0,e),function(e){return e.name}).join(",");this.api.setProperty("Basic.Path",e)},f.prototype.onItemSelect=function(e){e=this.data.indexOf(e.info),e=_.map(this.data.slice(0,e+1),function(e){return e.name}).join(",");this.api.setProperty("Basic.Path",e)},f.prototype.onResize=function(){},f.prototype.onSettingsChange=function(e){var i=this;_.each(e,_.bind(function(e,t){i.viewModel.set(t,e)},this)),this.hasInit||(this.hasInit=!0,this.initializeEvents(),this.breakdownColumns=this.viewModel.get("Basic.Breakdown"),this.onPathChanged(this.viewModel,this.viewModel.get("Basic.Path")))},f.prototype.initializeEvents=function(){var t=this;this.listenTo(this.viewModel,"change:Basic.Breakdown",this.onBreakdownChanged.bind(this)),this.listenTo(this.viewModel,"change:Basic.Path",this.onPathChanged.bind(this)),this.listenTo(this.viewModel,"change:Basic.UseColumnNames",this.onUseColumnNamesChanged.bind(this)),this.$home.on(s.Tools.clickEvent(),function(e){e.stopPropagation(),e.preventDefault(),t.api.setProperty("Basic.Path","")})},f.prototype.onBreakdownChanged=function(e,t){this.breakdownColumns=t,this.setValidPath(!1),this.renderBreadcrumbs()},f.prototype.onOrderChanged=function(){this.setValidPath(!0)},f.prototype.onPathChanged=function(e,t){var i,n=this,t=o.focus2SingleCommonPath(t).join(",");this.path!==t&&(this.breakdownCache&&this.path&&this.restorePath?(i=[],_.every(this.breakdownColumns,function(e,t){return!(!n.breakdownCache||e!==n.breakdownCache[t])&&(i.push(e),!0)}),_.isEmpty(i)?this.path="":(this.path=this.path.split(",").slice(0,i.length).join(","),_.delay(function(){n.api.setProperty("Basic.Path",n.path)},250)),this.breakdownCache=null):(this.breakdownCache=null,this.path=t),this.path?(t=this.path.toString().split(","),this.data=t.map(function(e){return{name:e}})):this.data=[],this.renderBreadcrumbs()),this.restorePath=!0},f.prototype.onUseColumnNamesChanged=function(){this.renderBreadcrumbs()},f.prototype.renderBreadcrumbs=function(){var n=this;this.itemViews.forEach(function(e){return e.remove()}),this.itemViews=[];var e=_.isEmpty(this.breakdownColumns)?this.data:this.breakdownColumns;_.isArray(e)&&(_.times(e.length,function(e){var t=n.data[e],i=n.breakdownColumns[e],t=t&&(t.column===i||_.isNil(t.column))?t:{name:i,placeholder:!0};t.column=i,_.isNil(t.name)||(t=new p(t,n.viewModel.get("Basic.UseColumnNames"),n.uniqueId,n),n.itemViews.push(t),t.$el.css("z-index",100-e),n.$breadcrumb.append(t.el))}),this.viewModel.get("Basic.Breakdown")&&!this.disableSortable&&this.$breadcrumb.sortable({items:">div:not(.home-div)",stop:this.onOrderChanged.bind(this)}))},f.prototype.setValidPath=function(e){var t,i,n=this,a=[];this.disableSortable||(this.$breadcrumb.sortable("instance")&&(a=_.map(this.$breadcrumb.sortable("toArray"),function(e,t){return $("#"+e).css("z-index",100-t),e.replace(n.uniqueId,"")})),_.isEqual(this.viewModel.get("Basic.Breakdown"),a)||(this.breakdownCache=this.viewModel.get("Basic.Breakdown"),e&&this.api.setProperty("Basic.Breakdown",a),e=o.focus2SingleCommonPath(this.viewModel.get("Basic.Path")),t=[],this.breakdownCache&&(i=_.reduce(e,function(e,t,i){i=n.breakdownCache[i];return t&&void 0!==i&&(e[i]=t),e},{}),_.takeWhile(a,function(e){e=i[e];return void 0!==e&&(t.push(e),!0)})),this.restorePath=!1,this.api.setProperty("Basic.Path",t.join(","))))},f.getComponentDefinition=a.getComponentDefinition,f});