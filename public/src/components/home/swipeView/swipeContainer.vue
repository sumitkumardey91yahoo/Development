<template>
  <div class="swiper-container" v-if="category && category.order" :class="swiper_container + category.order" >
    <div class="category-title">{{category.titles.default}}</div>
    <div class="swiper-wrapper" :style='margin_left' >
      <swipe-single-slider
      :singleItem="item"
      :key="index"
      :subCategoryNameProps="category.titles.default"
      v-for="(item,index) in sectionWiseData" />
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
 const swipeSingleSlider = ()=> import('./swipeSingleSlider.vue');

export default {
    data() {
        return {
            category: undefined,
            classObject: {
                'height': screen.width * 1.085 + "px",
            },
            swiper1 : undefined,
            param : undefined,
            withUrl : undefined,
            listingSubscetion : undefined,
            allContentItem:[],
            margin_left:{'margin-left':'13px'},
            swiper_container:'swipe',
            bindAllSwiper:[],
            withUrlPagination:[],
            withIdPagination:[],
            itemListingData:[],
            sectionWiseData:[],
            checkMountedWatchFlag:undefined,
            swipe:undefined,
            offset:0,
            page:1,
        };
    },
    components : {
          'swipe-single-slider' : swipeSingleSlider,
    },
    props: ['subContainer'],
    watch: {
        subContainer(data) {
            this.category = data;
        }
    },
    methods : {
        ...mapActions([
            'actGetSections',
            'actGetContentsByUrl',
            'actGetContentsById',
            'actGetRecentlyWatched'
        ]),
        initGetSingleCategory() {
            this.sectionWiseData = [];
            this.getContents();
        },
        getContents() {
            let list = this.category;
          //  this.toggleLoader(true);

            if (list.external_id) {
              this.withUrl = true;
              this.param = list.external_id;
            } else {
              this.withUrl = false;
              this.param = list.id;
            }

          if (this.withUrl) {
            if(list.titles.default == 'Continue Watching') {
              this.actGetRecentlyWatched({
                offset: this.offset,
                limit: 7,
              }).then((response) => {
                // console.log('[getContents | actGetContentsById | response | ]', response);
                eventBus.$emit('toggleOfflineEvent', false);
                this.processContents(response,list);
              },
              (error) => {
                eventBus.$emit('toggleOfflineEvent', true);
              });

            } else {
              var domain = localStorage.getItem('visitedDomain');
              var urlObj = {
                url: this.param,
                requestObj: {
                  params: {
                    domain
                  }
                }
              };
              urlObj.requestObj.params.page = this.page;
              urlObj.requestObj.params.size = 7;

              this.actGetContentsByUrl(urlObj).then((response) => {
                this.processContents(response,list);
              }, (error) => {
                if (error.code == 401) {
                  eventBus.$emit('togglePopupDeviceRemoved', true);
                }
                if (error.status && error.status == 404) {
                  // console.log(" swipeContainer | not found zuul");
                  this.category  = undefined;
                }
              });
            }
          } else {
            this.actGetContentsById({
              id: this.param,
              offset: this.offset,
              limit: 7,
            }).then(
            (response) => {
              // console.log('[getContents | actGetContentsById | response | ]', response);
              eventBus.$emit('toggleOfflineEvent', false);
              this.processContents(response,list);
            },
            (error) => {
              // this.toggleLoader(false);
              eventBus.$emit('toggleOfflineEvent', true);
            }
            );
          }
        },
        processContents(response,list) {
          var contents = undefined;
          var totalElements = undefined;
          var totalPages = undefined;

          if(!response) {
              return;
          }
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

          var parsedContents = new Array();

          if (contents && contents.length) {

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
              altProfileMode = localStorage.getItem('altProfileMode');
            }

            var altUser = undefined;
            if (localStorage.getItem('altUser')) {
              altUser = JSON.parse(localStorage.getItem('altUser'));
            }

            var mediaProgressList = undefined;
            if (localStorage.getItem('mediaProgressList')) {
              mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
            }

            for (var i in contents) {
              var parsedObject = undefined;

              if (contents[i].media) {
                parsedObject = this.parseContents(contents[i].media);
              } else {
                parsedObject = this.parseContents(contents[i]);
              }
              // console.log("swipeContainer.vue || parsedObject",parsedObject);
              let geoStatus = undefined;
              if(parsedObject && parsedObject.geoBlock) {
                  geoStatus = this.geoBlockCountryWise(parsedObject.geoBlock);
                  if(geoStatus) {
                       continue;
                  }
              }

              if (altUser && mediaProgressList && mediaProgressList.length) {
                for (var j in mediaProgressList) {
                  if (mediaProgressList[j].media_id == parsedObject.id) {
                    parsedObject.progress = mediaProgressList[j].progress;
                    break;
                  }
                }
              }

              // console.log("swipeContainer.vue || parsedObject",parsedObject);
              this.sectionWiseData.push(parsedObject);

            }

          } else {

            // NOTE if no element display ,do not display category;
            if(totalElements == 0) {
              this.category  = undefined;
            }
          }

        // this.toggleLoader(false);
        },
        loadingSwiper() {
            let _this = this;
            if(!this.swipe) {
          this.swipe =  new Swiper('.swipe'+this.category.order , {
                    slidesPerView: 3,
                    loop: false,
                    initialSlide: 0,
                    spaceBetween: 14,
                    slidesOffsetAfter: 0,
                    debugger: true,
                    on: {
                        init: function () {
                        },
                        reachEnd: function () {
                            if (!this.params.debugger) return;
                            // console.log("reached || up",_this.sectionWiseData);
                            if(_this.sectionWiseData && _this.sectionWiseData.length) {
                                // console.log("reached",_this.sectionWiseData);
                                _this.offset = _this.offset + 7;
                                _this.page = _this.page + 1;
                                _this.getContents();
                            }
                        },
                    },
                });

            } else {
                this.swipe.update();
            }
        },
    },
    mounted() {
    //// console.log("mounted || swipeContainer.vue");
    },
    updated() {
        this.loadingSwiper();
        // console.log("updated", this.category );
    },
    created() {
        this.category = this.subContainer;
        this.initGetSingleCategory();
        // console.log("created | swipeContainer",this.category.titles.default)
    },
    mixins: [altMixins]
}
</script>
