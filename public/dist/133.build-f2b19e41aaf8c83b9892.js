webpackJsonp([133],{577:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=(i(2),i(1)),s=i(5),o=i(4),r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t};e.default={data:function(){return{kidsProfile:void 0}},computed:r({},i.i(o.a)(["altKidsProfile"])),methods:r({},i.i(o.b)(["setAltKidsProfile","setSearchResults"]),i.i(o.c)(["actCheckWithAccount"]),{exitKidsMode:function(){var t=this,e=JSON.parse(localStorage.getItem("altKidsUser"));this.toggleLoader(!0),this.actCheckWithAccount(e).then(function(e){t.toggleLoader(!1),e.count>1&&(t.setAltKidsProfile(e.profiles[0]),t.toggleExitPinScreen(!0))},function(t){})},showKidsSearch:function(){this.setSearchResults(void 0),n.eventBus.$emit("toggleKidsSearchEvent",!0)}}),mixins:[s.a]}},861:function(t,e,i){var n=i(77)(i(577),i(944),null,null,null);t.exports=n.exports},944:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-bar"},[i("div",{staticClass:"menu-icon kids-menu-icon",on:{click:t.exitKidsMode}})])},staticRenderFns:[]}}});