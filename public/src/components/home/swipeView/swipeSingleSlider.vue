<template lang="html">
  <div v-lazyload class='swiper-slide relative-position carousel-height-swipe' @click="detailsPageRedirection(singleItem)">
    <img alt="alt-poster" :data-url=" singleItem && singleItem.images.poster" src="/src/assets/alt-poster.jpg"/>
    <div v-if="singleItem.progress && singleItem.progress != 100" class="line-progress">
      <div class="progress" :style="{ width: singleItem.progress + '%' }"></div>
    </div>
    <div v-else class="color-line"></div>
  </div>
</template>

<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { setHasBts } from '../../../store/mutations';
const swipeSingleSlider = () => import('./swipeSingleSlider.vue');

import LazyLoadDirective from '../../../directives/LazyLoadDirective';
export default {
  directives:{
        lazyload: LazyLoadDirective
    },
  data() {
    return {
      category:undefined,
      swiper_container:'swipe',
      margin_right:{'margin-right':'5px'},
      slide:undefined,
      slideItems:undefined,
      playbackItemInfo:undefined
    }
  },
  components : {
    'swipe-single-slider' : swipeSingleSlider,
  },
  props: ['singleItem','subCategoryNameProps'],
  methods: {
    ...mapMutations([
      'setDefaultModeCurrentSubcategory',
      'setHasBts'
    ]),
    detailsPageRedirection(item) {
      this.setDefaultModeCurrentSubcategory(this.subCategoryNameProps);

      if(item && item.bts) {
        this.setHasBts(item.bts)
      }

      // console.log("this.subCategoryNameProps || swipeSingleSlider",this.subCategoryNameProps);
      if(this.subCategoryNameProps == 'Continue Watching') {
        localStorage.setItem('event_source', 'home_watching');

        eventBus.$emit("togglePlayerScreenFlagEnable",true);
        this.playbackItemInfo = item;


        // NOTE: UNCOMMENT FOR PRODUCTION
        this.checkScreenRotationType();
        // NOTE: COMMENT FOR PRODUCTION
        // eventBus.$emit("toggleSendDataToPlayerScreen",item);
      } else {
        // @sumit for event source playback
        localStorage.setItem('event_source', (this.$route.name + '_' + this.subCategoryNameProps).toLowerCase());
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          let page_info = (item.contentName && item.contentName == 'media') ? 'movie details' : 'show details';
          eventAttributeObj.page_url = location.href + item.contentName + "/" + item.id;
          eventAttributeObj.page_title = page_info || 'N.A';
          eventAttributeObj.content_id = item.id || 'N.A';
          eventAttributeObj.content_type = page_info || 'N.A';
          eventAttributeObj.content_title = item.title || 'N.A';
          eventAttributeObj.event_source = this.$route.name + '_' + this.subCategoryNameProps;
          window.mobileAnalyticsClient.recordEvent('_page.view', eventAttributeObj, {});
        }

        var routerObj = {
          name: item.contentName,
          params: {
            id: item.id
          }
        };
        this.$router.push(routerObj);
      }

    },
    checkScreenRotationType() {
      if(('orientation' in screen)) {
        if (matchMedia('(orientation: portrait)').matches) {
          this.makeFullscreen(this.landscapeRotation);
        } else {
          this.makeFullscreen(this.landscapeRotation);
        }
      }
    },
    makeFullscreen(callback) {
      this.vContain = document.getElementById('v-contain');
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (this.vContain.requestFullscreen) {
          this.vContain.requestFullscreen();
        } else if (this.vContain.msRequestFullscreen) {
          this.vContain.msRequestFullscreen();
        } else if (this.vContain.mozRequestFullScreen) {
          this.vContain.mozRequestFullScreen();
        } else if (this.vContain.webkitRequestFullscreen) {
          this.vContain.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
      if(callback) {
        callback();
      }
    },
    landscapeRotation() {
      let _this = this;
      if(!this.playbackItemInfo) {
        return;
      }
      screen.orientation.lock('landscape').then((response) => {
        eventBus.$emit("toggleSendDataToPlayerScreen",this.playbackItemInfo);
      },(error) => {
        eventBus.$emit("toggleSendDataToPlayerScreen",this.playbackItemInfo);
        // console.log("error || swipeSingleSlider");
      });
    },
  },
  mounted() {
    // console.log("mounted || swipeSingleSlider.vue",this.singleItem);
  },
  created() {
    // console.log("swipeSingleSlider.vue | singleItem",this.singleItem);
    if(this.singleItem && this.singleItem.length) {
      this.slideItems = this.singleItem;
      // console.log("created | swipeSingleSlider",this.slideItems)
    }
  },
  mixins: [altMixins]
}
</script>

<style>
.carousel-height-swipe {
  width: 26% !important;
}
.carousel-height-swipe img {
    vertical-align: middle;
}
</style>
