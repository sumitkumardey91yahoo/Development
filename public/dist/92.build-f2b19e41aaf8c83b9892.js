webpackJsonp([92],{668:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=s(1),n=s(4),a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var o in s)Object.prototype.hasOwnProperty.call(s,o)&&(t[o]=s[o])}return t};e.default={computed:a({},s.i(n.a)(["altMessages"])),methods:{closePopup:function(){document.getElementById("alt-app")&&(document.getElementById("alt-app").style.position="relative"),window.history.back(),o.eventBus.$emit("toggleCountrywiseVideoBlock",!1)}}}},925:function(t,e,s){var o=s(77)(s(668),s(954),null,null,null);t.exports=o.exports},954:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"alt-popup-bg trans-bg"},[s("div",{staticClass:"alt-signin popup-container"},[s("div",{staticClass:"popup-box signin-box"},[s("div",{staticClass:"popup-bg"},[t.altMessages&&t.altMessages.contentDoNotExistError?s("p",[t._v(t._s(t.altMessages.contentDoNotExistError))]):t._e(),t._v(" "),s("button",{staticClass:"btn grad-btn btn-lg",attrs:{type:"button"},on:{click:t.closePopup}},[t._v("back")])])]),t._v(" "),s("div",{staticClass:"alt-overlay",on:{click:t.closePopup}})])])},staticRenderFns:[]}}});