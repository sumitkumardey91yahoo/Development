<template>
  <div class="swiper-wrapper">
    <div class="swiper-slide carousel-height" v-if="sliderList" v-for="slider in sliderList">
      <single-slider  :singleSlider="slider" v-if="slider"></single-slider>
    </div>
  </div>
</template>
<style>
.carousel-height {
 width:100% !important;
}
</style>
<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

 import Swiper from 'swiper';

const singleCarouselSlider = () => import (/* webpackChunkName: "home-Home-Header" */ './singleCarouselSlider.vue');
export default {
  data() {
    return {
      sliderList : [],
      checkMountedWatchFlag:undefined,
      swiper :undefined,
      page:1,
      offset:0,
      totalElementsCount:0,
      currentElementsCount:0,
      subSections:undefined,
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
    ]),
  },
  watch : {
    carouselSub() {
      if(!this.checkMountedWatchFlag) {
        this.page = 1;
        this.offset = 0;
        this.sliderList = [],
        this.subSections = this.carouselSub;
        this.getContents();
        this.initSwiper();
        // console.log("watch || carouselWapperClass");
      }
    },
    '$route'(to,from) {
      this.page = 1;
      this.offset = 0;
      this.totalElementsCount = 0;
      this.currentElementsCount = 0;
      this.checkMountedWatchFlag = false;
      // console.log("route || carouselWapperClass");
    }
  },
  props:['carouselSub'],
  methods : {
    ...mapActions([
      'actGetSections',
      'actGetContentsByUrl',
      'actGetContentsById'
    ]),
    getContents() {
      var domain = localStorage.getItem('visitedDomain');
      if(!this.subSections || !this.subSections.length){
        // this.checkMountedWatchFlag = false;
        return;
      }
      this.checkMountedWatchFlag = true;
      // console.log("carouselWapperClass || editorPick || subSections",this.subSections);

      this.toggleLoader(true);

      let subsectionsListDetails = undefined;

      subsectionsListDetails = this.subSections.filter((menu)=>{
        return menu.order != 100;
      });

      var editorPick = subsectionsListDetails[0];

      // console.log("carouselWapperClass || editorPick",editorPick);

      if(editorPick.external_id) {
        var urlObj = {
          url: editorPick.external_id,
          requestObj: {
            params: {
              domain
            }
          }
        };
        urlObj.requestObj.params.page = this.page;
        urlObj.requestObj.params.size = 7;

        this.actGetContentsByUrl(urlObj).then((response) => {
          // console.log('[carousel.vue | actGetContentsByUrl | response | ]', response);

          this.processContents(response);

        }, (error) => {

        });
      } else {
        this.actGetContentsById({
          id: editorPick.id,
          offset: this.offset,
          limit: 7,
        }).then(
        (response) => {
          eventBus.$emit('toggleOfflineEvent', false);
          this.processContents(response);
        },
        (error) => {
          this.toggleLoader(false);
          eventBus.$emit('toggleOfflineEvent', true);
        }
        );
      }
    },
    processContents(response){
      let arrSlider = [];
      let singleSlider = undefined;
      let idCreate = undefined;
      let contents = undefined;
      let totalElements = undefined;
      let totalPages = undefined;

      if (response.content) {
        contents = response.content;
        totalElements = response.totalElements;
        totalPages = response.totalPages;
      } else if (response.elements) {
        if (response.elements.media) {
          contents = response.elements.media;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);
        } else if (response.elements.series) {
          contents = response.elements.series;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);
        }
      } else if (response.history) {
        contents = response.history;
        totalElements = response.count;
        totalPages = Math.ceil(response.count / this.limit);
      }

      this.totalElementsCount = totalElements;
      this.currentElementsCount = contents.length + this.currentElementsCount;


      for (var i in contents) {
        var parsedObject = undefined;

        if (contents[i].media) {
          parsedObject = this.parseContents(contents[i].media);
          // console.log("HomeNav.vue | processContents|",parsedObject);
        } else {
          parsedObject = this.parseContents(contents[i]);
          // console.log("HomeNav.vue | processContents| else",parsedObject);
        }
        // console.log("carouselWapperClass.vue || parsedObject",parsedObject);
        this.sliderList.push(parsedObject);
      }
      this.toggleLoader(false);
      // console.log("sliderList>>",this.sliderList);
      let hiddenClass = undefined;
      let paginationId = document.getElementById('carousel-pagination');
      if(paginationId) {
        if(this.sliderList.length == 1) {
          paginationId.style.display = 'none';
        } else {
          paginationId.style.display = 'block';
        }
      }
    },
    updatingSwipe() {
      // NOTE swiper
      if(this.swiper) {
        // NOTE added by sumit for change from start Issue #727
        this.swiper.slideTo(0, 40, true);

        let classIdentify = undefined;
        if(Array.isArray(this.swiper)) {
          for(let i in this.swiper) {
            classIdentify = this.swiper[i].el.classList;
            for(let j in classIdentify) {
              if(classIdentify[j] == 'home-carousel') {
                this.swiper[i].update();
                this.swiper[i].pagination.update();
                break;
              }
            }
          }
        } else {
          this.swiper.update();
          this.swiper.pagination.update();
       }
      }
    },
    initSwiper() {
      // if(this.swiper) {
      //     this.swiper.removeAllSlides();
      //     this.swiper.destroy
      // }

      var altConfig = undefined;
      var paginationInterval = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
        paginationInterval = altConfig.environment && altConfig.featuredCarousalScrollTime ? altConfig.featuredCarousalScrollTime * 1000 : 6000;
      }
      // console.log("paginationInterval>>",paginationInterval);
      let _this = this;
      // NOTE swiper
      if(!this.swiper && Swiper) {
        this.swiper = new Swiper('.home-carousel',{
          slidesPerView: 1,
          spaceBetween: 30,
          debugger: true,
          clickable:true,
          autoplay: {
            delay: paginationInterval ,
            disableOnInteraction:false
          },
          pagination: {
            el: '.swiper-pagination',
            clickable:true
          },
          on: {
            init: function () {
              if (!this.params.debugger) return;
              // console.log('init');
            },
            reachEnd: function () {
               console.log('reachEnd | outside');
               // no need to call next page
              // if (!this.params.debugger) return;

              // if(_this.sliderList && _this.sliderList.length) {
              //   // console.log('reachEnd');
              //   if(_this.currentElementsCount == _this.totalElementsCount ) {
              //     // console.log("called all");
              //   } else {
              //     _this.page = _this.page + 1;
              //     _this.offset = _this.offset + 7;
              //     _this.getContents();
              //   }
              // }

            },

          }
        });
      } else {

        this.updatingSwipe();
      }

    },
  },
  created() {
    if(this.carouselSub) {
      this.page = 1;
      this.offset = 0;
      this.sliderList = [],
      this.subSections = this.carouselSub;
      this.getContents();
      // this.initSwiper();
    // console.log("created || carouselWapperClass || in");

    }
    // console.log("created || carouselWapperClass");
  },
  updated() {
    this.initSwiper();
    // this.updatingSwipe();
  },
  components: {
    'single-slider':singleCarouselSlider,
  },
  mixins: [altMixins]
}
</script>
