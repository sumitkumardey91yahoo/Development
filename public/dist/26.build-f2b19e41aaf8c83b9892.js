webpackJsonp([26],{59:function(e,t,n){var o=n(77)(n(685),n(995),null,null,null);e.exports=o.exports},685:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),r=n(5),i=n(4),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.default={data:function(){return{showCreateKidsPin:!1}},computed:a({},n.i(i.a)(["appActive","tocData"])),watch:{appActive:function(){this.initToc()}},methods:a({},n.i(i.b)(["setTocData"]),n.i(i.c)(["actGetTocData"]),{setTocHeader:function(){this.setHeaderTitle("TERMS OF USE"),this.toggleSearchIco(!1),this.toggleCloseIco(!1),this.toggleDeleteIco(!1),this.toggleMenuIco(!0)},initToc:function(){var e=this,t=void 0,n=void 0;localStorage.getItem("altConfig")&&(t=JSON.parse(localStorage.getItem("altConfig")),n=t.environment&&t.environment.androidTermsOfUseURL?t.environment.androidTermsOfUseURL:void 0),n&&this.actGetTocData(n).then(function(t){t&&(e.setTocData(t),e.toggleLoader(!1))},function(e){})}}),created:function(){var e=this;this.toggleLoader(!0),this.initToc(),o.eventBus.$on("toggleCreateKidsPinEvent",function(t){e.showCreateKidsPin=t,t||e.$router.push({name:"home"})})},mounted:function(){this.setTocHeader()},beforeRouteEnter:function(e,t,n){"kids"==localStorage.getItem("altProfileMode")?n({name:"kidsMode"}):n()},mixins:[r.a]}},77:function(e,t){e.exports=function(e,t,n,o,r){var i,a=e=e||{},s=typeof e.default;"object"!==s&&"function"!==s||(i=e,a=e.default);var c="function"==typeof a?a.options:a;t&&(c.render=t.render,c.staticRenderFns=t.staticRenderFns),o&&(c._scopeId=o);var d;if(r?(d=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},c._ssrRegister=d):n&&(d=n),d){var u=c.functional,f=u?c.render:c.beforeCreate;u?c.render=function(e,t){return d.call(t),f(e,t)}:c.beforeCreate=f?[].concat(f,d):[d]}return{esModule:i,exports:a,options:c}}},995:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.tocData?n("div",{domProps:{innerHTML:e._s(e.tocData)}}):e._e()])},staticRenderFns:[]}}});