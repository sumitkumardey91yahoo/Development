<template lang="html">
  <div class="swiper-container home-carousel">
    <carousel-wrapper :carouselSub="subCategoryCarousel"></carousel-wrapper>
    <div class='swiper-pagination' id="carousel-pagination"></div>
  </div>
</template>
<script>
import { altMixins } from '@/mixins';
const carouselWrapper = () => import (/* webpackChunkName: "home-Home-Header" */ './carouselWapperClass.vue');
export default {
  name: 'FeatureCarousel',
  components:{
    'carousel-wrapper': carouselWrapper,
  },
  data() {
    return {
      subCategoryCarousel:undefined,
    };
  },
  watch:{
    featureCarouselSection() {
      this.subCategoryCarousel = this.featureCarouselSection;
    }
  },
  created() {
    if(this.featureCarouselSection) {
      this.subCategoryCarousel = this.featureCarouselSection;
    }
  },
  props: ['featureCarouselSection'],
  mixins: [altMixins]
}
</script>
