webpackJsonp([108],{648:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e(1),a=e(4),i=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t};n.default={computed:i({},e.i(a.a)(["paymentConformation"])),methods:{closePopup:function(){document.getElementById("alt-app")&&(document.getElementById("alt-app").style.position="relative"),o.eventBus.$emit("togglePopupConfirmPayment",!1)},proceedPayment:function(){document.getElementById("alt-app")&&(document.getElementById("alt-app").style.position="relative"),o.eventBus.$emit("proceedToPaymentEvent")}}}},907:function(t,n,e){var o=e(77)(e(648),e(939),null,null,null);t.exports=o.exports},939:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"alt-popup-bg trans-bg"},[e("div",{staticClass:"alt-signin popup-container"},[e("div",{staticClass:"popup-box signin-box"},[e("div",{staticClass:"popup-bg"},[t.paymentConformation?e("p",[e("strong",[t._v(t._s(t.paymentConformation.confirmation_title))])]):t._e(),t._v(" "),t.paymentConformation?e("p",[t._v(t._s(t.paymentConformation.confirmation_desc))]):t._e(),t._v(" "),e("button",{staticClass:"btn grad-btn btn-lg",attrs:{type:"button"},on:{click:t.proceedPayment}},[t._v("PROCEED")]),t._v(" "),e("p",{staticClass:"link-under",on:{click:t.closePopup}},[t._v("Cancel")]),t._v(" "),t.paymentConformation?e("a",{staticClass:"link-under color-red",attrs:{target:"_blank",href:t.paymentConformation.confirmation_link_url}},[t._v(t._s(t.paymentConformation.confirmation_link_title))]):t._e()])]),t._v(" "),e("div",{staticClass:"alt-overlay"})])])},staticRenderFns:[]}}});