(function(t){function e(e){for(var i,o,r=e[0],c=e[1],l=e[2],u=0,m=[];u<r.length;u++)o=r[u],a[o]&&m.push(a[o][0]),a[o]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);d&&d(e);while(m.length)m.shift()();return s.push.apply(s,l||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],i=!0,r=1;r<n.length;r++){var c=n[r];0!==a[c]&&(i=!1)}i&&(s.splice(e--,1),t=o(o.s=n[0]))}return t}var i={},a={standalone:0},s=[];function o(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=i,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(n,i,function(e){return t[e]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/rijksdriehoeksmeting/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var d=c;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("e009")},"05d4":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("img",{staticStyle:{cursor:"pointer"},attrs:{srcset:this.imgSrcset,sizes:this.imgSizes,src:this.imgSrc},on:{click:t.click}})},a=[],s="https://dlc.services/thumbs/7/1",o=[100,200,400,1024],r={name:"iiifImage",props:{iiifId:String,dimensions:Array},data:function(){return{baseUrl:s,imageSizes:o}},methods:{sizeStr:function(t){return"landscape"===this.orientation?"".concat(t,","):",".concat(t)},url:function(t){return"".concat(this.baseUrl,"/").concat(this.iiifId,"/full/").concat(this.sizeStr(t),"/0/default.jpg")},click:function(){this.$emit("click",this.iiifId,this.dimensions)}},computed:{orientation:function(){return this.dimensions[0]>this.dimensions[1]?"landscape":"portrait"},imgSrcset:function(){var t=this;return this.imageSizes.map(function(e){return"".concat(t.url(e)," ").concat(e,"w")}).join(", ")},imgSizes:function(){var t=this.imageSizes.length;return this.imageSizes.map(function(e,n){return"".concat(n<t-1?"(max-width: ".concat(e,")"):""," ").concat(e,"px")}).join(", ")},imgSrc:function(){return this.url(this.imageSizes[this.imageSizes.length-1])}}},c=r,l=(n("c55d"),n("2877")),d=Object(l["a"])(c,i,a,!1,null,"6741e940",null);e["a"]=d.exports},"2af0":function(t,e,n){},"34d6":function(t,e,n){},"3a5e":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",{staticClass:"message"},[n("p",{staticClass:"dutch"},[t._v("Laden…")]),n("p",{staticClass:"english"},[t._v("Loading…")])])])}],s={name:"loading"},o=s,r=(n("fa23"),n("2877")),c=Object(r["a"])(o,i,a,!1,null,"58e84d70",null);e["a"]=c.exports},5026:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[t.images.length?[n("transition-group",{staticClass:"images",attrs:{name:"list-complete",tag:"ol"}},t._l(t.photos,function(e){return n("li",{key:e.iiifId,staticClass:"image list-complete-item",style:{width:Math.floor(100/t.photos.length)+"%"}},[n("IIIFImage",{attrs:{iiifId:e.iiifId,dimensions:e.dimensions},on:{click:t.click}})],1)}),0)]:[n("NoImagesFound")]],2)},a=[],s=n("05d4"),o=n("6eac"),r={name:"images",components:{IIIFImage:s["a"],NoImagesFound:o["a"]},props:{images:Array},computed:{photos:function(){return this.images.length>2?this.images.map(function(t){return t.properties.photos[0]}):this.images.map(function(t){return t.properties.photos}).flat()}},methods:{click:function(t,e){this.$emit("select-image",t,e)}}},c=r,l=(n("be24"),n("2877")),d=Object(l["a"])(c,i,a,!1,null,"4b8e6a3b",null);e["a"]=d.exports},"559e":function(t,e,n){"use strict";var i=n("6de4"),a=n.n(i);a.a},"612c":function(t,e,n){"use strict";var i=n("9f71"),a=n.n(i);a.a},"6de4":function(t,e,n){},"6eac":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"message"},[n("p",{staticClass:"dutch"},[t._v("Geen meetpunten gevonden in de buurt van deze locatie.")]),n("p",{staticClass:"english"},[t._v("No measuring points found around this location.")])])}],s={name:"no-images-found"},o=s,r=n("2877"),c=Object(r["a"])(o,i,a,!1,null,"3ade1241",null);e["a"]=c.exports},"9b2a":function(t,e,n){},"9f71":function(t,e,n){},a0be:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"component"},[n("div",{staticClass:"map-container"},[n("div",{ref:"map",staticClass:"map"})]),n("div",{staticClass:"rectangle-container",style:{padding:t.rectanglePadding+"px"}},[n("div",{staticClass:"rectangle"})])])},a=[],s=(n("ac6a"),n("768b")),o=n("2ef0"),r=n("7977"),c=n("8493"),l={props:{locations:Object},data:function(){return{highlightedIds:[],index:void 0,rectanglePadding:30}},methods:{throttledSendData:Object(o["throttle"])(function(){this.sendData()},500),sendData:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];if(this.map&&this.index&&this.$refs.map){var n=8,i=this.map.getCenter(),a=this.$refs.map.getBoundingClientRect(),o=this.map.unproject([this.rectanglePadding,this.rectanglePadding]),r=this.map.unproject([a.width-this.rectanglePadding,a.height-this.rectanglePadding]),l=c.around(this.index,i.lng,i.lat,n,void 0,function(t){var e=Object(s["a"])(t.geometry.coordinates,2),n=e[0],i=e[1],a=i<=o.lat&&i>=r.lat,c=n>=o.lng&&n<=r.lng;return a&&c});this.highlightedIds.forEach(function(e){t.map.setFeatureState({id:e,source:"points"},{highlight:!1})}),this.highlightedIds=l.map(function(t){return t.id}),this.highlightedIds.forEach(function(e){t.map.setFeatureState({id:e,source:"points"},{highlight:!0})}),this.$emit("update",this.highlightedIds,e)}}},mounted:function(){var t=this;this.index=new r["a"](this.locations.features,function(t){return t.geometry.coordinates[0]},function(t){return t.geometry.coordinates[1]});var e=new mapboxgl.Map({container:this.$refs.map,style:{version:8,sources:{basemap:{type:"raster",tiles:["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png","https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png","https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png","https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],tileSize:256}},layers:[{id:"basemap",type:"raster",source:"basemap",minzoom:7,maxzoom:17}]},minZoom:7,maxZoom:16.5,maxBounds:[[1.5,49.8],[8.5,55]],center:[4.922,52.369],zoom:9,hash:!0,pitchWithRotate:!1,dragRotate:!1});e.on("load",function(){e.addSource("points",{type:"geojson",data:t.locations}),e.addLayer({id:"points",type:"circle",source:"points",paint:{"circle-radius":["interpolate",["linear"],["zoom"],8,4,16,10],"circle-opacity":["case",["boolean",["feature-state","highlight"],!1],1,.4],"circle-color":["case",["boolean",["feature-state","highlight"],!1],"#ed1c24","#ede321"]}}),t.sendData(!1)}),e.on("move",function(){t.throttledSendData()}),this.map=e}},d=l,u=(n("e351"),n("2877")),m=Object(u["a"])(d,i,a,!1,null,"a4d46680",null);e["a"]=m.exports},be24:function(t,e,n){"use strict";var i=n("2af0"),a=n.n(i);a.a},c55d:function(t,e,n){"use strict";var i=n("34d6"),a=n.n(i);a.a},e009:function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var i=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[t.showIntro?[n("StandaloneText",{on:{close:function(e){t.showIntro=!1}}})]:t.locations?[n("div",{attrs:{id:"split"}},[n("Map",{attrs:{locations:t.locations},on:{update:t.updateImages}}),t.images.length?[n("Images",{attrs:{images:t.images},on:{"select-image":t.modalImage}})]:[n("NoImagesFound")]],2),t.modal?[n("ModalImage",{attrs:{iiifId:t.modal.iiifId,dimensions:t.modal.dimensions},on:{close:function(e){t.modal=void 0}}})]:t._e()]:[n("Loading")]],2)},s=[],o=n("bc3a"),r=n.n(o),c=n("a0be"),l=n("5026"),d=n("3a5e"),u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"modal"},[n("div",{staticClass:"container"},[n("div",{staticClass:"image"},[n("IIIFImage",{attrs:{iiifId:t.iiifId,dimensions:t.dimensions},on:{click:t.close}})],1),n("div",{staticClass:"centered"},[n("button",{on:{click:t.close}},[t._v("Sluiten - Close")])])])])},m=[],p=n("05d4"),h={name:"modal-image",components:{IIIFImage:p["a"]},props:{iiifId:String,dimensions:Array},methods:{close:function(){this.$emit("close")}}},f=h,g=(n("559e"),n("2877")),v=Object(g["a"])(f,u,m,!1,null,"1bb290b4",null),b=v.exports,_=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",{staticClass:"dutch"},[n("Images",{attrs:{images:t.images1},on:{"select-image":t.close}}),n("p",[t._v("\n      Verken via de kaart meer dan 8000 foto's van meetpunten van de Rijksdriehoeksmeting.\n    ")]),t._m(0),n("div",{staticClass:"centered"},[n("button",{on:{click:t.close}},[t._v("Start")])]),t._m(1),t._m(2)],1),n("hr",{staticClass:"horizontal-line"}),n("div",{staticClass:"english"},[n("Images",{attrs:{images:t.images2},on:{"select-image":t.close}}),n("p",[t._v("\n      Use the map to explore more than 8000 photos of the Dutch National Triangulation Network.\n    ")]),n("p"),t._m(3),n("div",{staticClass:"centered"},[n("button",{on:{click:t.close}},[t._v("Start")])]),t._m(4),t._m(5)],1)])},y=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      Deze website is gemaakt voor de tentoonstelling "),n("a",{attrs:{href:"https://www.panorama-mesdag.nl/ontdek/tentoonstellingen/vanaf-het-hoogste-punt-landmeten-in-mesdags-tijd/"}},[t._v("Vanaf het Hoogste Punt: Landmeten in Mesdags Tijd")]),t._v(",\n      te zien tot en met 22 september 2019 in Panorama Mesdag.\n    ")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{staticClass:"light"},[n("li",[t._v("Tentoonstelling: Panorama Mesdag & TU Delft Library")]),n("li",[t._v("Fotocollectie: Kadastermuseum")]),n("li",[t._v("Dataset: Herman de Koning")]),n("li",[t._v("Applicatie: Bert Spaan")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"light"},[t._v("De broncode en data staan "),n("a",{attrs:{href:"https://github.com/bertspaan/rijksdriehoeksmeting"}},[t._v("op GitHub")]),t._v(".")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      This website is made for the the exhibition "),n("a",{attrs:{href:"https://www.panorama-mesdag.nl/ontdek/tentoonstellingen/vanaf-het-hoogste-punt-landmeten-in-mesdags-tijd/"}},[t._v("Vanaf het Hoogste Punt: Landmeten in Mesdags Tijd")]),t._v(",\n       through 22 september 2019 in Panorama Mesdag.\n    ")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{staticClass:"light"},[n("li",[t._v("Exhibition: Panorama Mesdag & TU Delft Library")]),n("li",[t._v("Foto collection: Kadastermuseum")]),n("li",[t._v("Dataset: Herman de Koning")]),n("li",[t._v("Application: Bert Spaan")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"light"},[t._v("The source code and data are available "),n("a",{attrs:{href:"https://github.com/bertspaan/rijksdriehoeksmeting"}},[t._v("on GitHub")]),t._v(".")])}],I=[{type:"Feature",id:4186,properties:{photos:[{iiifId:"5359b9bf-d6c7-4c81-a396-53f9a2a5c8b9",dimensions:[1151,1969]}]},geometry:{type:"Point",coordinates:[6.1026787,52.5136313]}},{type:"Feature",id:4189,properties:{photos:[{iiifId:"b13a9cf7-9bad-4622-a3c4-f4f76fe837fd",dimensions:[1232,1963]}]},geometry:{type:"Point",coordinates:[6.1043682,52.5126098]}},{type:"Feature",id:4197,properties:{photos:[{iiifId:"8b0df0dc-a5e2-4692-87b0-b81b4e52ffcf",dimensions:[1154,1962]}]},geometry:{type:"Point",coordinates:[6.1114736,52.5171234]}},{type:"Feature",id:4185,properties:{photos:[{iiifId:"8303d0e5-a803-426d-a2d7-b566d6d93e1d",dimensions:[1050,1656]}]},geometry:{type:"Point",coordinates:[6.0954251,52.516169]}}],S=[{type:"Feature",id:3195,properties:{photos:[{iiifId:"afdda991-5491-4358-962f-1147f6f6da11",dimensions:[1756,2677]}]},geometry:{type:"Point",coordinates:[4.2678564,52.0805105]}},{type:"Feature",id:3112,properties:{photos:[{iiifId:"8048810f-7408-45fa-a533-79be301a21f2",dimensions:[1246,1739]}]},geometry:{type:"Point",coordinates:[4.26828,52.1041366]}},{type:"Feature",id:3110,properties:{photos:[{iiifId:"b956d6b9-8359-45c8-8b14-17815252ce0e",dimensions:[1302,2218]}]},geometry:{type:"Point",coordinates:[4.26828,52.1041366]}},{type:"Feature",id:3107,properties:{photos:[{iiifId:"9ddcb4b4-139c-4223-9ca3-41f49680fb82",dimensions:[1162,2187]}]},geometry:{type:"Point",coordinates:[4.2818475,52.1131241]}}],x={name:"standalone-text",components:{Images:l["a"]},props:{type:String},data:function(){return{images1:I,images2:S}},methods:{close:function(){this.$emit("close")}}},j=x,C=(n("612c"),Object(g["a"])(j,_,y,!1,null,"55d269e3",null)),k=C.exports,w=n("6eac"),P={name:"standalone",components:{Map:c["a"],Images:l["a"],StandaloneText:k,NoImagesFound:w["a"],Loading:d["a"],ModalImage:b},props:{getImageUrl:Function},data:function(){return{showIntro:!0,locations:void 0,images:[],modal:void 0}},methods:{updateImages:function(t,e){var n=this;e&&(this.showIntro=!1),this.images=t.map(function(t){return n.locations.features[t]})},modalImage:function(t,e){this.modal={iiifId:t,dimensions:e}}},mounted:function(){var t=this;r.a.get("locations.display.geojson").then(function(e){return t.locations=e.data,t.locations})}},$=P,z=(n("e771"),Object(g["a"])($,a,s,!1,null,null,null)),F=z.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(F)}}).$mount("#app")},e16e:function(t,e,n){},e351:function(t,e,n){"use strict";var i=n("e16e"),a=n.n(i);a.a},e771:function(t,e,n){"use strict";var i=n("9b2a"),a=n.n(i);a.a},eed0:function(t,e,n){},fa23:function(t,e,n){"use strict";var i=n("eed0"),a=n.n(i);a.a}});
//# sourceMappingURL=standalone.aa8db15f.js.map