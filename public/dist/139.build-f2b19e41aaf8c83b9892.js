webpackJsonp([139],{1054:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"swiper-container home-carousel"},[r("carousel-wrapper",{attrs:{carouselSub:e.subCategoryCarousel}}),e._v(" "),r("div",{staticClass:"swiper-pagination",attrs:{id:"carousel-pagination"}})],1)},staticRenderFns:[]}},564:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r(5),s=function(){return r.e(52).then(r.bind(null,852))};t.default={name:"FeatureCarousel",components:{"carousel-wrapper":s},data:function(){return{subCategoryCarousel:void 0}},watch:{featureCarouselSection:function(){this.subCategoryCarousel=this.featureCarouselSection}},created:function(){this.featureCarouselSection&&(this.subCategoryCarousel=this.featureCarouselSection)},props:["featureCarouselSection"],mixins:[a.a]}},851:function(e,t,r){var a=r(77)(r(564),r(1054),null,null,null);e.exports=a.exports}});