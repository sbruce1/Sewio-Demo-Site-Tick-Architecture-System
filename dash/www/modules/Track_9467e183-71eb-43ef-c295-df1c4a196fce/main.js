define(["backbone","Handlebars","QuickBase","css!./css/app.css"],function(e,i,a){"use strict";var s,r=this&&this.__extends||(s=function(t,e){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}s(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),o=(n.getComponentDefinition=function(t){var e,i,a={id:19,componentName:"Track",componentDescription:"Track",appKey:"Track",css:"track",listViewThumb:t.websiteUrl+"Images/track.png",ghostViewThumb:null,buildViewThumb:null,appArgs:{websiteUrl:t.websiteUrl,json:{version:"4.3.0",Basic:{Track:"",Car:"",TrackColor:"#ffff00",CarColor:"#507ce4",Icon:"",Theme:"Dark"},Columns:{X:"",Z:"",Speed:""},Style:{advanced:""},PossibleColumns:[""]},schema:{type:"object",title:"Properties",properties:{Basic:{type:"object",title:"Basics",options:{collapsed:!1},propertyOrder:200,properties:{Track:{type:"data",title:"Track Source",default:""},Car:{type:"data",title:"Car Source",default:""},TrackColor:{type:"gradient",title:"Track Color",options:{noColor:!1,gradient:!1},default:"#ffff00"},CarColor:{type:"gradient",title:"Car Color",options:{noColor:!1,gradient:!1},default:"#507ce4"},Icon:{type:"icon",title:"Icon",iconTypes:"fa"},Theme:{type:"string",title:"Theme",options:{hidden:!0},enum:["Dark","Light"]},DashboardTheme:{options:{hidden:!0}}}},Columns:{type:"object",title:"Columns",options:{collapsed:!0},propertyOrder:205,properties:{X:{type:"customDropdown",title:"X Position",default:"",data:"possible_columns",watch:{possible_columns:"root.PossibleColumns"}},Z:{type:"customDropdown",title:"Z Position",default:"",data:"possible_columns",watch:{possible_columns:"root.PossibleColumns"}},Speed:{type:"customDropdown",title:"Speed",default:"",data:"possible_columns",watch:{possible_columns:"root.PossibleColumns"}}}},Style:{type:"object",title:"Style",options:{collapsed:!0},propertyOrder:210,properties:{advanced:{type:"css",title:"Advanced CSS",default:""}}},PossibleColumns:{type:"readOnlyArray",default:[],format:"table",items:{type:"string"},options:{collapsed:!0,hidden:!0}}}}}};if(0<_.keys(t.settingsModel.attributes).length)for(i=n.upgrades.indexOf(_.find(n.upgrades,{version:t.settingsModel.get("version")}))+1;i<n.upgrades.length;i+=1)(e=n.upgrades[i]).fn(t.settingsModel,t),t.settingsModel.set("version",e.version);return a},n);function n(){}o.upgrades=[{version:0,fn:function(){}}];var l,h=(c.app=i.template({compiler:[7,">= 4.0.0"],main:function(t,e,i,a,s){return'<div class="track-container">\n    <canvas class="track"></canvas>\n    <canvas class="overlay"></canvas>\n</div>'},useData:!0}),c);function c(){}function C(t){var e=l.call(this,t)||this;return e.trackModel=null,e.carModel=null,e.carData=[],e.trackData=void 0,e.carRadius=7,e.validTrack=!1,e.validCar=!1,e.minX=0,e.minZ=0,e.offsetX=0,e.offsetZ=0,e.ratio=0,e.CAR_PROP="Basic.Car",e.TRACK_PROP="Basic.Track",e.PROP_CARCOLOR="Basic.CarColor",e.PROP_TRACKCOLOR="Basic.TrackColor",e.PROP_ICON="Basic.Icon",e.PROP_XCOL="Columns.X",e.PROP_ZCOL="Columns.Z",e.PROP_SPEED="Columns.Speed",e.api=t.api,e.el.innerHTML=h.app({}),e.trackEl=e.el.getElementsByClassName("track").item(0),e.overlayEl=e.el.getElementsByClassName("overlay").item(0),e.renderLoop(),e.hasInit=!1,e}return l=e.View,r(C,l),C.prototype.onResize=function(){this.validTrack=this.validCar=!1},C.prototype.onSettingsChange=function(t){void 0!==t[this.TRACK_PROP]&&this.applyTrackData(t[this.TRACK_PROP]),void 0!==t[this.CAR_PROP]&&this.applyCarData(t[this.CAR_PROP]),!t[this.PROP_CARCOLOR]&&!t[this.PROP_ICON]&&t[this.PROP_ICON]||this.renderCar(),(t[this.PROP_TRACKCOLOR]||t[this.PROP_XCOL]||t[this.PROP_ZCOL]||t[this.PROP_SPEED])&&(this.renderTrack(),this.renderCar()),this.hasInit||(this.hasInit=!0)},C.prototype.applyCarData=function(e){var i,a=this;this.carModel&&(this.stopListening(this.carModel),this.api.unsubscribe(this.carModel),this.carModel=null),e?(this.carModel=e,this.carModel&&this.carModel.attributes?((i=function(t,e){e?a.api.showQueryStatus(e):a.api.hideQueryStatus()})(this.carModel,this.carModel.get("queryStatus")),this.listenTo(this.carModel,"change:queryStatus",i),this.api.subscribe(this.carModel,this.onCarData.bind(this))):this.api.showQueryStatus({message:t('Invalid Data Source: "')+e.path+'" '+t("selected"),type:"Warning"})):this.api.showQueryStatus({message:t("To populate this component, please define a")+" <b> "+t("Data Source")+"</b> "+t("from")+"<b> "+t("Properties")+"-"+t("Basics")+"</b>",type:"Warning"})},C.prototype.applyTrackData=function(e){var i,a=this;this.trackModel&&(this.stopListening(this.trackModel),this.api.unsubscribe(this.trackModel),this.trackModel=null),e?(this.trackModel=e,this.trackModel&&this.trackModel.attributes?((i=function(t,e){e?a.api.showQueryStatus(e):a.api.hideQueryStatus()})(this.trackModel,this.trackModel.get("queryStatus")),this.listenTo(this.trackModel,"change:queryStatus",i),this.api.subscribe(this.trackModel,this.onTrackData.bind(this),!0)):this.api.showQueryStatus({message:t('Invalid Data Source: "')+e.path+'" '+t("selected"),type:"Warning"})):this.api.showQueryStatus({message:t("To populate this component, please define a")+" <b> "+t("Data Source")+"</b> "+t("from")+"<b> "+t("Properties")+"-"+t("Basics")+"</b>",type:"Warning"})},C.prototype.onTrackData=function(t,e,i){i?this.api.showQueryStatus(i):(this.api.hideQueryStatus(),t=t.columns.collection.models.map(function(t){return t.id}),this.api.setProperty("PossibleColumns",t),this.trackData=e.cols,this.validTrack=this.validCar=!1)},C.prototype.onCarData=function(t,e,i){i?this.api.showQueryStatus(i):(this.api.hideQueryStatus(),this.carData=e.collection.models.map(function(t){return t.attributes}),this.validCar=!1)},C.prototype.renderCar=function(){if(this.carData.length){this.validCar=!0;var t=this.overlayEl.height-2*this.carRadius,e=this.api.getProperty(C.PROP_ICON),i=this.api.getProperty(C.PROP_CARCOLOR),a=void 0,s=this.overlayEl.getContext("2d");if(s){s.clearRect(0,0,this.overlayEl.width,this.overlayEl.height),s.fillStyle=i;for(var r=0;r<this.carData.length;r++){var o=this.carData[r][this.api.getProperty(C.PROP_XCOL)],n=this.carData[r][this.api.getProperty(C.PROP_ZCOL)],l=this.offsetX+(o-this.minX)*this.ratio,o=this.offsetZ+t-(n-this.minZ)*this.ratio,n=function(){var i={};return{get:function(t){if(i[t])return i[t];var e=function(t){var e=document.createElement("i");e.className=t,e.style.display="none",document.body.appendChild(e);t=window.getComputedStyle(e,":before").getPropertyValue("content");return document.body.removeChild(e),t.replace(/["]/g,"")}(t);return i[t]=e}}}();if(e){if(s.beginPath(),e&&0<=e.indexOf("fa-")){a=2/Math.SQRT2*this.carRadius,s.font=2*a+"px FontAwesome";var h=n.get("fa "+e);s.fillText(h,l-s.measureText(h).width/2,o),s.closePath();break}if(e&&0<=e.indexOf("mi-")){a=2/Math.SQRT2*this.carRadius,s.font=2*a+"px Material Icons";h=n.get("mi "+e);s.fillText(h,l-s.measureText(h).width/2,o),s.closePath();break}s.arc(l,o,this.carRadius,0,2*Math.PI),s.closePath()}else s.beginPath(),s.arc(l,o,this.carRadius,0,2*Math.PI,!1);s.fill()}}}},C.prototype.renderLoop=function(){this.trackData&&!this.validTrack&&this.renderTrack(),this.carData.length&&!this.validCar&&this.renderCar(),window.requestAnimationFrame(this.renderLoop.bind(this))},C.prototype.renderTrack=function(){this.validTrack=!0;var t=this.el.clientWidth,e=this.el.clientHeight;this.trackEl.width=this.overlayEl.width=t,this.trackEl.height=this.overlayEl.height=e,t-=2*this.carRadius,e-=2*this.carRadius;var i=this.api.getProperty(C.PROP_XCOL),a=this.api.getProperty(C.PROP_ZCOL),s=this.api.getProperty(C.PROP_SPEED);if(this.trackData){var r=this.trackData[i],o=this.trackData[a],n=this.trackData[s];if(r&&o&&r.length&&n&&r.length===o.length){var l=Number.MIN_VALUE,h=Number.MIN_VALUE,c=Number.MIN_VALUE;this.minX=Number.MAX_VALUE,this.minZ=Number.MAX_VALUE;for(var p=0;p<r.length;p++){var u=r.getValue(p);this.minX=Math.min(u,this.minX);var l=Math.max(u,l),d=o.getValue(p);this.minZ=Math.min(d,this.minZ);var h=Math.max(d,h),f=n.getValue(p),c=Math.max(f,c)}var m=l-this.minX,i=h-this.minZ,a=t/m,s=e/i;this.ratio=Math.min(a,s),this.offsetX=this.offsetZ=this.carRadius,a<s?this.offsetZ=(e-i*this.ratio)/2:this.offsetX=(t-m*this.ratio)/2;var P=this.trackEl.getContext("2d");if(P){P.clearRect(0,0,this.trackEl.width,this.trackEl.height);for(p=0;p<r.length;p++){u=r.getValue(p),d=o.getValue(p);P.fillStyle=this.api.getProperty(C.PROP_TRACKCOLOR),P.beginPath(),P.arc(this.offsetX+(u-this.minX)*this.ratio,this.offsetZ+e-(d-this.minZ)*this.ratio,3,0,2*Math.PI,!1),P.fill()}}}}},C.getComponentDefinition=o.getComponentDefinition,C.PROP_CARCOLOR="Basic.CarColor",C.PROP_TRACKCOLOR="Basic.TrackColor",C.PROP_ICON="Basic.Icon",C.PROP_XCOL="Columns.X",C.PROP_ZCOL="Columns.Z",C.PROP_SPEED="Columns.Speed",C});