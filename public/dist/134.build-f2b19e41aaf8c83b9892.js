webpackJsonp([134],{574:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(5),o=i(4),r=i(1),s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t};e.default={data:function(){return{kidsProfile:void 0}},methods:s({},i.i(o.b)(["setAltKidsProfile"]),i.i(o.c)(["actCheckWithAccount"]),{exitKidsMode:function(){var t=this,e=JSON.parse(localStorage.getItem("altKidsUser"));this.toggleLoader(!0),this.actCheckWithAccount(e).then(function(e){t.toggleLoader(!1),e.count>1&&(t.setAltKidsProfile(e.profiles[0]),t.toggleExitPinScreen(!0),r.eventBus.$emit("exitKidsModeEvent",!0))},function(t){})}}),mixins:[n.a]}},859:function(t,e,i){var n=i(77)(i(574),i(953),null,null,null);t.exports=n.exports},953:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-bar"},[i("div",{staticClass:"menu-icon kids-menu-icon",on:{click:t.exitKidsMode}})])},staticRenderFns:[]}}});