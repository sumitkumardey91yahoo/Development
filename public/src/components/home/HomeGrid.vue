<template>
  <div>
    <div class="one-thirds">
      <div v-if="gridContents">
        <div class="one-third-card" v-for="(item, index) in gridContents" :key="index" @click="getContentToPlay(index + 1)">
          <p v-if="item.comingSoon" class="alt-tag">Coming Soon</p>
          <p v-show="isFreeContent(item) && !(item.progress) && !(item.comingSoon)" class="alt-tag">Free</p>
          <p v-if="item.progress" class="alt-tag">
            <span v-if="item.progress != 100">watching</span>
            <span v-else>watched</span>
          </p>

          <progressive-img v-if="item && item.images && item.images.poster" :src="item.images.poster" alt="alt-poster" placeholder="/src/assets/alt-poster.jpg" />

          <!-- <img v-if="item && item.images && item.images.poster" :src="item.images.poster" alt="alt-poster"> -->
          <!-- <img v-else src="../../assets/alt-poster.jpg" alt="alt-poster"> -->

          <!-- <img v-if="item && item.images && item.images.poster" :src="item.images.poster" alt="alt-poster">
          <img v-else src="../../assets/alt-poster.jpg" alt="alt-poster"> -->

          <div v-if="item.progress && item.progress != 100" class="line-progress">
            <div class="progress" :style="{ width: item.progress + '%' }"></div>
          </div>
          <div v-else class="color-line"></div>
        </div>
      </div>
      <div v-else>
        <div class="one-third-card" v-for="n in 6">
          <img src="/src/assets/alt-poster.jpg" alt='alt-poster'>
          <div class="color-line"></div>
        </div>
      </div>
    </div>
    <div class="button-space text-center" style="margin-top: 20px;">
      <button v-show="showLoadMore" type="button" class="btn grad-btn btn-sm" id="alt-more-btn" @click="loadMoreContents">SEE MORE</button>
    </div>
  </div>
</template>

<script>
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { eventBus } from '../../main';

export default {
  data() {
    return {
      altUser: undefined,
      altOrder: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'homeActiveSectionTitle',
      'gridContents',
      'homeContents',
      'homeUrlQuery',
      'page',
      'limit',
      'offset',
      'totalElements',
      'totalPages',
      'pageCount',
      'showLoadMore',
      'homeActiveSectionTitle'
    ]),
  },
  methods: {
    ...mapMutations([
      'setPlayerContent',
      'setPage',
      'setOffset',
      'setHomeContents',
      'setFirstContent',
      'setGridContents',
      'setPageCount',
      'setShowLoadMore',
    ]),
    ...mapActions([
      'actGetContentsByUrl',
      'actGetContentsById',
    ]),
    getContentToPlay(index) {

      // NOTE: NEW CODE CHANGE @SANGEETH
      let altProfileMode;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      }

      if (altProfileMode === 'kids') {
        // console.log('[this.homeActiveSectionTitle]', this.homeActiveSectionTitle);

        if (this.homeActiveSectionTitle === 'Watching') {
          let content = this.homeContents[index];
          eventBus.$emit("toggleSendDataToPlayerScreen", content);
        } else {
          // Show the loader immediately on content click
          this.toggleLoader(true);

          var playerContent = this.homeContents[index];
          this.setPlayerContent(playerContent);

          var routerObj = {
            name: playerContent.contentName,
            params: {
              id: playerContent.id
            }
          }

          // For AWS Mobile SDK Events
          localStorage.setItem('AWSMA_content_source', 'section');
          this.$router.push(routerObj);
        }
      }
      // NOTE: END NEW CODE CHANGE @SANGEETH
    },
    loadMoreContents() {
      // console.log('[HomeGrid | loadMoreContents ]');

      this.toggleLoader(true);
      this.setPageCount(this.pageCount + 1);

      // console.log('[HomeGrid | loadMoreContents | pageCount]', this.pageCount);
      // console.log('[HomeGrid | loadMoreContents | totalPages]', this.totalPages);

      if (this.pageCount >= (this.totalPages - 1)) {
        this.setShowLoadMore(false);
      }

      var urlQuery = this.homeUrlQuery;

      // console.log('[HomeGrid | loadMoreContents | homeContents]', this.homeContents);
      // console.log('[HomeGrid | loadMoreContents | urlQuery]', urlQuery);

      if (urlQuery.withUrl) {
        // // Increment the page number by 1
        // this.setPage(this.page + 1);

        var domain = localStorage.getItem('visitedDomain');

        var urlObj = {
          url: urlQuery.param,
          requestObj: {
            params: {
              domain
            }
          }
        };


        if (this.homeActiveSectionTitle == 'Watching') {
          this.setOffset(this.offset + this.limit);

          urlObj.requestObj.params.offset = this.offset;
          urlObj.requestObj.params.limit = this.limit;
        } else {
          this.setPage(this.page + 1);

          urlObj.requestObj.params.page = this.page;
          urlObj.requestObj.params.size = this.limit;
        }

        this.actGetContentsByUrl(urlObj).then((response) => {
          // console.log('[HomeGrid | loadMoreContents | response | ]', response);

          this.processContents(response);
        }, (error) => {
          // console.log(err);
        });
      } else {

        var offset = this.offset;
        this.setOffset(this.offset + 7);
        // console.log('[HomeGrid | loadMoreContents | withId | offset]', this.offset);
        // console.log('[HomeGrid | loadMoreContents | withId | limit]', this.limit);

        this.actGetContentsById({
          id: urlQuery.param,
          offset: this.offset,
          limit: this.limit,
        }).then((response) => {
          // console.log('[HomeGrid | loadMoreContents | response | ]', response);

          this.processContents(response);
        }, (error) => {
          // console.log(err);
        });
      }
    },
    processContents(response) {
      // console.log('[HomeNav | processContents]', response);

      var contents = undefined;
      var totalElements = undefined;
      var totalPages = undefined;
      // console.log('[HomeGrid | processContents | totalElements]', this.totalElements);
      // console.log('[HomeGrid | processContents | totalPages]', this.totalPages);

      if (response.content) {
        // console.log('[Home | processContents | response-content]');

        contents = response.content;
        totalElements = response.totalElements;
        totalPages = response.totalPages;
      } else if (response.elements) {
        if (response.elements.media) {
          // console.log('[Home | processContents | response-media]');

          contents = response.elements.media;
          totalElements = response.elements.count;
          totalPages = (response.elements.count % 7);
        } else if (response.elements.series) {
          // console.log('[Home | processContents | response-series]');

          contents = response.elements.series;
          totalElements = response.elements.count;
          totalPages = (response.elements.count % 7);
        }
      } else if (response.history) {
        contents = response.history;
        totalElements = response.count;
        totalPages = totalPages = Math.ceil(response.count / this.limit);

      }

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      if (contents && contents.length) {
        for (var i in contents) {

          if (contents[i].media) {
            var parsedContent = this.parseContents(contents[i].media);

            if (altProfileMode == 'kids') {
              if (!(parsedContent.kidsContent)) {
                continue;
              }
            }

            // console.log("HomeGrid.vue | up|",parsedContent)
            let geoStatus = undefined;
            if(parsedContent && parsedContent.geoBlock) {
              geoStatus = this.geoBlockCountryWise(parsedContent.geoBlock);
              if(geoStatus) {
                continue;
              }
            }

            this.homeContents.push(parsedContent);
            this.gridContents.push(parsedContent);
          } else {
            let parsedContentData = undefined;
            parsedContentData = this.parseContents(contents[i]);
            // console.log("HomeGrid.vue | down|",parsedContentData)

            let geoStatus = undefined;
            if(parsedContentData && parsedContentData.geoBlock) {
              geoStatus = this.geoBlockCountryWise(parsedContentData.geoBlock);
              if(geoStatus) {
                continue;
              }
            }

            this.homeContents.push(parsedContentData);
            this.gridContents.push(parsedContentData);
          }
        }
        this.toggleLoader(false);
      }
    },
    isFreeContent(content) {
      // console.log('[HomeGrid | isFreeContent | content | ]', content);

      if (this.homeActiveSectionTitle == 'Watching') {
        return false;
      }

      if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == true) {

        return true;
      } else if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {

        return false;
      } else {
        return content.isFreeContent;
      }
    }
  },
  created() {
    if (localStorage.getItem('altUser')) {
      this.altUser = JSON.parse(localStorage.getItem('altUser'));
    }
    if (localStorage.getItem('altOrder')) {
      this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
    }
  },
  mixins: [altMixins]
}
</script>
