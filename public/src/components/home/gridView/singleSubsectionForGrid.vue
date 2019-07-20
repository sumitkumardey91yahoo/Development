<template lang="html">
    <div>
        <div v-lazyload class="one-third-card" v-for="(item, index) in singleCategoryContents" @click="detailsPageRedirection(item)">
            <p v-if="item.progress" class="alt-tag">
                <span v-if="item.progress != 100">watching</span>
                <span v-else>watched</span>
            </p>

            <!-- <progressive-img v-if="item && item.images && item.images.poster" :src="item.images.poster" alt="alt-poster" placeholder="/src/assets/alt-poster.jpg" /> -->

            <img v-if="item && item.images && item.images.poster" :data-url="item.images.poster" alt="alt-poster" src="/src/assets/alt-poster.jpg" />

            <div v-if="item.progress && item.progress != 100" class="line-progress">
                <div class="progress" :style="{ width: item.progress + '%' }"></div>
            </div>
            <div v-else class="color-line"></div>
        </div>
        <div class="grid-loader" v-if="loading">
            <div class="loading">
                <div class="inner"></div>
            </div>
        </div>
    </div>

</template>

<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import LazyLoadDirective from '../../../directives/LazyLoadDirective';
export default {
  directives:{
        lazyload: LazyLoadDirective
    },
    data() {
        return {
            loading: false,
            tes:undefined,
            classObject: {
                'height':screen.width * 1.085 + "px",
            },
            swiper1 : undefined,
            param : undefined,
            withUrl : undefined,
            singleCategoryContents:[],
            offset:0,
            page:1,
            totalElements:0,
            currentElements:0,
            lengthOfSubsection:0,
            currentSubcategoryOffsetPostion:0,
        };
    },
    props: ['GridCategorys'],
    watch:{
        GridCategorys() {
          // NOTE Before going reseting all value
          this.currentSubcategoryOffsetPostion = 0;
          this.loading = false;
          this.page = 1;
          this.offset = 0;
          this.currentElements = 0;
          this.totalElements = 0;
          this.initGridSingleSubsection();
        },
        '$route'(to,from) {
          // NOTE Before going reseting all value
            this.currentSubcategoryOffsetPostion = 0;
            this.singleCategoryContents = [];
            this.loading = false;
            this.page = 1;
            this.offset = 0;
            this.currentElements = 0;
            this.totalElements = 0;
        }
    },
    computed:{
        ...mapGetters([
        ]),
    },
    methods: {
        ...mapActions([
            'actGetSections',
            'actGetContentsByUrl',
            'actGetContentsById'
        ]),
        ...mapMutations([
          'setHasBts'
        ]),
        getContents(categoryZuul) {
            if(!categoryZuul) {
                this.toggleLoader(false);
                return;
            }
            let list = undefined;
            list = categoryZuul;

            if (list.external_id) {
              this.withUrl = true;
              this.param = list.external_id;
            } else {
              this.withUrl = false;
              this.param = list.id;
            }
          if (this.withUrl) {
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
            urlObj.requestObj.params.size = 9;

            this.actGetContentsByUrl(urlObj).then((response) => {
              this.processContents(response,list);
            }, (error) => {
              if (error.code == 401) {
                eventBus.$emit('togglePopupDeviceRemoved', true);
              }

              if (error.status && error.status == 404) {
                 this.processContents(undefined);
              }
              this.toggleLoader(false);
            });
          } else {

            this.actGetContentsById({
              id: this.param,
              offset: this.offset,
              limit: 9,
            }).then(
            (response) => {
              eventBus.$emit('toggleOfflineEvent', false);
              this.processContents(response,list);
            },
            (error) => {
              this.toggleLoader(false);
              eventBus.$emit('toggleOfflineEvent', true);
            }
            );
          }
        },
        processContents(response,list) {
          var contents = undefined;
          var totalElements = undefined;
          var totalPages = undefined;
          var singleSlider = [];

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

          this.totalElements = totalElements;
          this.currentElements = (contents && contents.length) ? contents.length + this.currentElements : this.currentElements;

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

              let geoStatus = undefined;
              if(parsedObject && parsedObject.geoBlock) {
                  geoStatus = this.geoBlockCountryWise(parsedObject.geoBlock);
                  if(geoStatus) {
                       continue;
                  }
              }

              if (altUser && mediaProgressList && mediaProgressList.length) {
                for (var j in mediaProgressList) {
                  if (parsedObject.contentId && mediaProgressList[j].media_id == parsedObject.contentId) {
                    parsedObject.progress = mediaProgressList[j].progress;
                    break;
                  }
                }
              }

              this.singleCategoryContents.push(parsedObject);
              this.toggleLoader(false);

            }

          }
          this.toggleLoader(false);
        },
        callNextCategoryDetails() {
          //  this.toggleLoader(true)
            this.page = this.page + 1;
            this.offset = this.offset + 9;
            // NOTE no contne
            if(this.totalElements == 0) {
              this.loading = false;
              return;
            }
            let currentSubCategory = undefined;
            if(this.currentElements == this.totalElements) {
                this.loading = false;
                this.page = 1;
                this.offset = 0;
                this.currentElements = 0;
                this.totalElements = 0;
                this.currentSubcategoryOffsetPostion +=1;
                if (this.currentSubcategoryOffsetPostion <= this.lengthOfSubsection) {
                    currentSubCategory = this.GridCategorys[this.currentSubcategoryOffsetPostion];
                    this.getContents(currentSubCategory);
                } else {
                    this.toggleLoader(false)

                }
            } else {
                this.loading = true;
                currentSubCategory = this.GridCategorys[this.currentSubcategoryOffsetPostion];
                this.getContents(currentSubCategory);
            }
        },
        detailsPageRedirection(item) {
          localStorage.setItem('event_source', (this.$route.name + '_detail').toLowerCase());
          console.log("detailsPageRedirection",item);
          if(item && item.bts) {
            this.setHasBts(item.bts)
          }

          // @sumit added page_view
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            let page_info = (item.contentName && item.contentName == 'show') ? 'show details' : 'movie details';

            eventAttributeObj.page_url = location.href;
            eventAttributeObj.page_title = page_info || 'N.A';
            eventAttributeObj.content_id = item.id || 'N.A';
            eventAttributeObj.content_type = page_info || 'N.A';
            eventAttributeObj.content_title = item.title || 'N.A';
            eventAttributeObj.event_source = (this.$route.name).toLowerCase();

            window.mobileAnalyticsClient.recordEvent('_page.view', eventAttributeObj, {});


            // Content_view on details page
            let eventAttributeData = this.getAWSMACommonAttributes();
             if(item.contentName == 'show') {
              eventAttributeData.content_url = (item && item.trailer) ? item.trailer.trailerUrl : 'N.A';
             } else {
              eventAttributeData.content_url = (item && item.stream) ? item.stream.streamUrl : 'N.A';
             }
            eventAttributeData.content_id = item.id ? item.id : 'N.A';
            eventAttributeData.content_type = page_info;
            eventAttributeData.content_title = item.title ? item.title.toLowerCase() : 'N.A';

            let content_source = this.$route.name + '_carousal';

            eventAttributeData.content_source = content_source;

            // window.mobileAnalyticsClient.recordEvent('_content.view', eventAttributeData, {});
          }
          // end page view
            var routerObj = {
                name: item.contentName,
                params: {
                    id: item.id
                }
            };
            this.$router.push(routerObj);
        },
        initGridSingleSubsection() {
            this.lengthOfSubsection = this.GridCategorys.length;
             this.getContents(this.GridCategorys[this.currentSubcategoryOffsetPostion]);
        }
    },
    mounted() {
        let _this = this;
        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) + 100 >= document.body.offsetHeight) {
                _this.callNextCategoryDetails();
            }
        };
    },
    created() {
        this.initGridSingleSubsection();
    },
    mixins: [altMixins]
}
</script>

<style lang="css">
</style>
