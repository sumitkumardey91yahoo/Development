webpackJsonp([112],{639:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(1),a=s(4),o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n])}return t};e.default={computed:o({},s.i(a.a)(["altMessages"])),methods:{closePopup:function(){n.eventBus.$emit("togglePopupHelpWriteQuestion",!1)}}}},898:function(t,e,s){var n=s(77)(s(639),s(957),null,null,null);t.exports=n.exports},957:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"alt-popup-bg trans-bg"},[s("div",{staticClass:"alt-signin popup-container"},[s("div",{staticClass:"popup-box signin-box"},[s("div",{staticClass:"popup-bg"},[t.altMessages?s("p",[t._v(t._s(t.altMessages.messageFAQWriteAQuestion))]):t._e(),t._v(" "),s("button",{staticClass:"btn grad-btn btn-lg",attrs:{type:"button"},on:{click:t.closePopup}},[t._v("OK")])])]),t._v(" "),s("div",{staticClass:"alt-overlay"})])])},staticRenderFns:[]}}});