<template>
  <div class="cmp-alt-psrs">
    <nav class="top-menu top-tabs" v-if="isSeasonSelector">
      <div class="scroll-menu" :class="isTabActive(1)" @click="showEps">Episodes</div>
      <div class="scroll-menu" :class="isTabActive(2)" @click="fetchBts" v-if="hasBts">{{altMessages.btsTabTitle}}</div>
    </nav>
    <div v-if="isSeasonSelector && activeTab === 1">
      <!-- If only single season is there, no need to show the down arrow icon beside the season seletor button -->
      <div class="season-button">
        <button v-if="seasons && seasons.length === 1" type="button" class="btn-seasons">Season {{seasonNumber}}</button>
        <button v-else type="button" class="btn-seasons more" @click="toggleSeasonPopup(true)">Season {{seasonNumber}}</button>
      </div>

      <div class="episode-feature-class" @click="hundredEpisodeControl" v-if="isShowHundredEpisodeTag">
        <div v-if="episodeFilterKeyName" class="header-hundred-episode"> {{ episodeFilterKeyName }} </div>
        <img src='../../assets/episode-controller.png' alt="episode Icon" class="header-hundred-image">
      </div> 
      <div style="float: none;clear: both;"></div>

    </div>

    <hundred-episode v-show="isEnableHundredEpisode"></hundred-episode>

    <template v-if="(!isSeasonSelector) && relatedEpisodes && relatedEpisodes.length">
      <nav class="top-menu top-tabs" v-if="(playerContent && playerContent.bts)">
        <div
          class="scroll-menu"
          :class="isTabActive(1)"
          @click="activeTab = 1">
          {{templateTitle}}
        </div>
        <div
          class="scroll-menu"
          :class="isTabActive(2)"
          @click="fetchBts">
          {{altMessages.btsTabTitle}}
        </div>
      </nav>
      <template v-else>
          <nav class="top-menu top-tabs">
            <span class="scroll-menu active" >{{templateTitle}}</span>
          </nav>
      </template>
    </template>

    <div class="popup-overlay" @click="hidePopup" v-show="showSeasons"></div>
    <div class="season-popup" id="season-popup" v-show="showSeasons">
      <ul>
        <li :class="index+1 === seasonNumber ? 'active' : ''" v-for="(season, index) in seasons" @click="getEpisodesBySeason(season.id, season.season_number)" :key="index">Season {{season.season_number}}</li>
      </ul>
    </div>

    <div v-show="relatedEpisodes && activeTab === 1" class="related-mvi">
      <div class="mvi-data" v-for="(item, index) in relatedEpisodes"  @click="playRelatedEpisode(index, 'meta')" :key="index">
        <div class="mvi-img-deatils" @click="playRelatedEpisode(index, 'img')">
          <img v-if="item.images.cover" :src="item.images.cover">
          <img v-else src="../../assets/alt-cover.jpg" alt="">
          <img v-if="$route.name === 'show'" class="play-img" src="../../assets/player/play.svg">
          <div v-if="item.progress && item.progress != 100" class="line-progress">
            <div class="progress" :style="{ width: item.progress + '%' }"></div>
          </div>
          <div v-else class="color-line sm"></div>
        </div>
        <div class="mvi-details">
          <h3 class="mvi-name">
            <span v-show="item.episodeNumber">E{{item.episodeNumber}}: </span>{{item.title}}
          </h3>
          <ul>
            <li class="grey" v-if="item.duration">{{item.duration}}</li>
            <!-- NOTE poster mode 0s added sumit 05/01/2018-->
            <li v-if="item.contentTitle == 'Poster'">0s</li>
          </ul>
          <p class="desc" v-if="item.descriptions">{{item.descriptions.default}}</p>
          <!-- <p v-show="item.progress" class="alt-tag">{{getProgressText(item.progress)}}</p> -->
        </div>
      </div>
    </div>
    <div v-if="bts && activeTab === 2" class="related-mvi">
      <div class="mvi-data" v-for="(item, index) in bts" @click="playBts(item)" :key="index">
        <div class="mvi-img-deatils">
          <img v-if="item.images.cover" :src="item.images.cover">
          <img v-else src="../../assets/alt-cover.jpg" alt="">
          <img class="play-img" src="../../assets/player/play.svg">
          <div v-if="item.progress && item.progress != 100" class="line-progress">
            <div class="progress" :style="{ width: item.progress + '%' }"></div>
          </div>
          <div v-else class="color-line sm"></div>
        </div>
        <div class="mvi-details">
          <h3 class="mvi-name"> {{item.title}} </h3>
          <ul>
            <li class="grey" v-if="item.durationInSec">{{item.durationInSec}}s</li>
            <li class="grey" v-else-if="item.duration">{{item.duration}}</li>
            <!-- NOTE poster mode 0s added sumit 05/01/2018-->
            <li v-if="item.contentTitle == 'Poster'">0s</li>
          </ul>
          <p class="desc" v-if="item.descriptions">{{item.descriptions.default}}</p>
          <p v-show="item.progress" class="alt-tag">{{getProgressText(item.progress)}}</p>
        </div>
      </div>
    </div>
    <!-- <div class="text-center" v-show="showLoadMore" style="margin-top: 20px;">
      <button type="button" class="btn grad-btn btn-sm" @click="loadMoreEpisodes">SEE MORE</button>
    </div> -->

    <div class="alt-rs-loader" id="alt-rs-loader" style="display:none;">
      <div class="loading">
        <div class="inner"></div>
      </div>
    </div>

     <div class="grid-loader" v-if="loading">
            <div class="loading">
                <div class="inner"></div>
            </div>
        </div>
  </div>
</template>

<script>
  import { altMixins } from '../../mixins'
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { eventBus } from '../../main';
  import { setHasBts } from '../../store/mutations';
  import hundredEpisodeList from '../shared/HundredEpisodeListFeature.vue';

  export default {
    data() {
      return {
        contentName: undefined,
        id: undefined,
        activeTab: 1,
        contentType: undefined,
        contentId: undefined,
        seriesId: undefined,
        mediaId: undefined,
        seasonId: undefined,
        mainCategoryId: undefined,
        seasonSelector: undefined,
        templateTitle: undefined,
        limit: 10,
        offset: null,
        itemCount: undefined,
        episodeCount: 0,
        totalPages: undefined,
        pageNumber: 1,
        showLoadMore: false,
        tvodId: undefined,
        tvodItem: undefined,
        altUser: undefined,
        altOrder: undefined,
        showTvodButton: false,
        parsedSeries: undefined,
        bts: [],
        showSeasons: false,
        playbackItemInfo:undefined,
        totalEpisodes:null,
        isEnableHundredEpisode:false,
        loadMoreEpsodes:[],
        hundredEpisodePayload:null,
        displayOrder: 'asc',
        isShowHundredEpisodeTag:null,
        episodeFilterKeyName:null,
        loading: false
      };
    },
    watch : {
      playerContent (content) { 
        // console.log("watch || relatedSeasons.vue", content ,this.offset )
        if (this.offset !== null || !content) {
              return;
            }
        this.loading = false;
        // console.log("watch || relatedSeasons.vue", content)
        this.setPlayerContent(content);
        this.initRelatedSeasons();
      }
    },
    computed: {
      ...mapGetters([
        'appActive',
        'playerContent',
        'seasons',
        'relatedEpisodes',
        'seasonNumber',
        'tvodProduct',
        'hasBts',
        'altMessages',
        'episodeList',
        'totalEpisodeCount',
      ]),
      isSeasonSelector() {
        // console.log("this.seasonSelector",this.seasonSelector);
        return this.seasonSelector;
      },
    },
    methods: {
      ...mapMutations([
        'setHasBts',
        'setRelatedEpisodes',
        'setSeasons',
        'setSeasonNumber',
        'setPlayerContent',
        'setTvodProduct',
        'setCurrentEpisodeInfo',
        'setTotalEpisodeCount'
      ]),
      ...mapActions([
        'actGetMediaSeries',
        'actGetSeasonInfo',
        'actGetEpisodes',
        'actGetRelatedVideos',
        'actGetProductList',
        'actGetBts',
        'actGetSeriesTag'
      ]),
      hundredEpisodeControl() {
        this.isEnableHundredEpisode = true;
        
         if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        if (window.mobileAnalyticsClient) {
          let eventAttributeObj = this.getAWSMACommonAttributes();
          eventAttributeObj.event_mode = 'episode_filter';
          eventAttributeObj.event_action = 'Open';
          window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
        }
      },
      isTabActive(name) {
        return this.activeTab === name ? 'active' : '';
      },
      showEps() {
        this.activeTab = 1;

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.section_id = this.playerContent.id || 'N.A';
          eventAttributeObj.section_title = this.playerContent.title || 'N.A';
          eventAttributeObj.event_source = this.$route.name + '_detail' || 'N.A';

          window.mobileAnalyticsClient.recordEvent('_section.view', eventAttributeObj, {});
        }
      },
      fetchBts() {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.section_title = this.playerContent.contentTitle ? this.playerContent.contentTitle : 'N.A';
          eventAttributeObj.event_source = "show_detail"

          window.mobileAnalyticsClient.recordEvent('_section.view', eventAttributeObj, {});
        }

        this.activeTab = 2

        let btsId

        // console.log("this.playerContent", this.playerContent);
        // console.log("this.hasBts", this.hasBts);
        if(this.hasBts) {
          btsId = this.hasBts + "-" + this.playerContent.seriesId
        } 
        // else if(this.playerContent && this.playerContent.bts) {
        //   btsId = this.playerContent.bts
        // }

        if(this.bts.length === 0) {
          this.actGetBts(btsId).then((response) => {
            if (response.count) {
              for (var i in response.media) {
                var vid = this.parseContents(response.media[i])
                this.bts.push(vid);
              }
            }
          }, (error) => {
          });
        }
      },
      initRelatedSeasons() {
         window.removeEventListener('scroll', this.registerScrollCB);
         window.addEventListener('scroll', this.registerScrollCB);
         this.limit = 10;
         this.offset = 0;
         this.displayOrder = 'asc';

         // console.log('[initRelatedSeasons]',this.playerContent);
         if(!this.playerContent) {
           return;
         }
        

        if(this.playerContent && this.playerContent.contentType == 'trailer') {
          // console.log("initRelatedSeasons || hide");
          this.setRelatedEpisodes(undefined);
          return;
        }

        this.contentName = this.$route.name;
        this.id = this.$route.params.id;
        var noShow = this.playerContent.noShow;

        this.contentType = this.$route.query.type;

        var homeDomain = localStorage.getItem('homeDomain');
        this.tvodId = this.playerContent.tvod && this.playerContent.tvod[homeDomain.toLowerCase()];

        if (this.tvodId) {
          if (this.playerContent.pricing) {
            var matchedTvodProducts = this.playerContent.pricing.filter((product) => {
              if (product.id) {
                return product.id == this.tvodId;
              } else if (product.product_id) {
                return product.product_id == this.tvodId;
              }
            });

            if (matchedTvodProducts && matchedTvodProducts.length) {
              var tvodItem = matchedTvodProducts[0];

              var id = tvodItem.id ? tvodItem.id : (tvodItem.product_id ? tvodItem.product_id : '');
              var price = 0;
              var currency = 'INR';
              if (tvodItem.prices && tvodItem.prices.length) {
                price = tvodItem.prices[0].real_amount;
                currency = tvodItem.prices[0].currency;
              } else {
                price = tvodItem.price / 100;
                currency = tvodItem.currency;
              }

              // NOTE added by sumit 15.01.2017 for get title of the root series
              // root episode will take title && other will display seriesTitle
              var title = this.playerContent.seriesTitle ? this.playerContent.seriesTitle : this.playerContent.title;

              this.tvodItem = { id, price, title, currency };
              this.setTvodProduct(this.tvodItem);
            }
          }
        }

        if (this.contentName == 'show') {
          // Determines the visibility of TVOD Button
          this.isShowTvodButton();

         

          if (noShow) {
            this.seasonSelector = false;
            this.templateTitle = 'Videos';
          } else {
            this.seasonSelector = true;
          }

          this.seriesId = this.$route.params.id;
          this.contentId = undefined;

          // this.tagSeriesManager();

          this.getSeriesInfo();
        } else if (this.contentName == 'episode') {
          this.isShowTvodButton();

          if (noShow) {
            this.seasonSelector = false;
            this.templateTitle = 'MORE VIDEOS';

            this.contentId = this.playerContent.id;
          } else {
            this.seasonSelector = false;
            this.templateTitle = 'MORE EPISODES';

            this.contentId = this.playerContent.contentId;
          }

          this.seriesId = this.playerContent.seriesId;
          this.seasonId = this.playerContent.seasonId;
          this.getEpisodes();
        } else if (this.contentName == 'media') {
          this.contentId = this.playerContent.seriesId;
          this.mainCategoryId = this.playerContent.mainCategoryId;

          this.seasonSelector = false;
          this.templateTitle = 'Related Movies';

          if (!this.mainCategoryId) {
            // Hide the See More Button
            this.showLoadMore = false;
            this.setRelatedEpisodes(undefined);
            return;
          }

          this.getRelatedVideos();
        } else {
          this.contentId = this.playerContent.contentId;
          this.mainCategoryId = this.playerContent.mainCategoryId;
          this.seasonSelector = false;
          this.templateTitle = 'Related';
          this.getRelatedVideos();
        }
      },
      tagSeriesManager() {
        // changes need to change index of concept
        this.actGetSeriesTag(this.seriesId).then((response) => {
             let btsTag = null;
             this.isShowHundredEpisodeTag = false;

            (response.tags).forEach( data => {
              if (data === 'n-episode')  {
                this.isShowHundredEpisodeTag = true;
                this.callRecentlistOfElements();
              }

               btsTag = data.split('-');
              if (btsTag[0] === 'bts') {
                this.setHasBts(btsTag[1]);
              }
            })
      
        });
      },
      callRecentlistOfElements() {

          let recentPayload = {};
            recentPayload.limit = this.episodeList.initialLoad;
            recentPayload.offset = 0;
            recentPayload.lazyLoad = false;
            
     
            if( this.episodeList.initialLoadFrom == 'end' && this.episodeList.order == 'asc') {
                recentPayload.order = 'asc';
                recentPayload.offset = this.totalEpisodeCount  - this.episodeList.initialLoad;
            } else if( this.episodeList.initialLoadFrom == 'end' && this.episodeList.order == 'desc') {
                recentPayload.order = 'desc';
                recentPayload.offset = 0;
            } else if( this.episodeList.initialLoadFrom == 'start' && this.episodeList.order == 'desc') {
                recentPayload.order = 'desc';
                recentPayload.offset = this.totalEpisodeCount  - this.episodeList.initialLoad;
            } else if( this.episodeList.initialLoadFrom == 'start' && this.episodeList.order == 'asc') {
                recentPayload.order = 'asc';
                recentPayload.offset = 0;
            }

            // console.log("RelatedSeasons || callRecentlistOfElements || ", recentPayload);

            eventBus.$emit("eventHundredEpisodeController",recentPayload);
      },
      isShowTvodButton() {
        var altUser = undefined;
        var altOrder = undefined;

        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));

          if (localStorage.getItem('altOrder')) {
            altOrder = JSON.parse(localStorage.getItem('altOrder'));
          }
        }

        if (this.playerContent.tvod) {
          if (altUser) {
            if (this.playerContent.anonymousAccess || this.playerContent.isFreeContent) {
              this.showTvodButton = false;
            } else {
              if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                this.showTvodButton = false;
              } else if (altOrder && altOrder.tvod && altOrder.tvod.hasOrder) {
                var homeDomain = localStorage.getItem('homeDomain').toLowerCase();
                var singleTvod = undefined;
                for (singleTvod in altOrder.tvod.products) {
                  if (altOrder.tvod.products[singleTvod].product.id == this.playerContent.tvod[homeDomain]) {
                    this.showTvodButton = false;
                    break;
                  } else {
                    this.showTvodButton = true;
                  }
                }
              } else {
                this.showTvodButton = true;
              }
            }
          } else {
            if (this.playerContent.anonymousAccess || this.playerContent.isFreeContent) {
              this.showTvodButton = false;
            } else {
              this.showTvodButton = true;
            }
          }
        }
      },
      getRelatedVideos() {
        // Hide the Load More button for media contents
        this.showLoadMore = false;

        this.actGetRelatedVideos(this.mainCategoryId).then((response) => {
          console.log("response", response)
          if (response.count) {
            var relatedEpisodes = new Array();
            var mediaProgressList = undefined;
            if (localStorage.getItem('mediaProgressList') && this.altUser) {
              mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
            }

            for (var i in response.media) {
              if (response.media[i].id == this.id) {
                continue;
              }

              var episode = this.parseContents(response.media[i])

              if(episode && episode.geoBlock) {
                  let geoFilter = undefined;
                  geoFilter = this.geoBlockCountryWise(episode.geoBlock);
                  if(geoFilter) {
                      continue;
                  }
              }

              for (var j in mediaProgressList) {
                if (mediaProgressList[j].mediaId === episode.id) {
                  episode.progress = mediaProgressList[j].progress;
                  break;
                } else {
                  episode.progress = undefined;
                }
              }
              relatedEpisodes.push(episode);
            }
            console.log("relatedEpisodes", relatedEpisodes);
            this.setRelatedEpisodes(relatedEpisodes);
          } else {
            // this.setRelatedEpisodes(undefined);
          }
        }, (error) => {
        });
      },
      getSeriesInfo(callback) {
        this.actGetMediaSeries(this.seriesId).then((response) => {
          // Parse the response using the below method
          // which is written in mixins.js
          this.parsedSeries = this.parseContents(response);

          // console.log("this.parsedSeries || ",this.parsedSeries);
          
          this.setTotalEpisodeCount(this.parsedSeries.totalEpisode);

          this.tagSeriesManager();

          // console.log("totalEpisodeCount",this.totalEpisodeCount);

          if (response.seasons && response.seasons.length) {
            this.setSeasons(response.seasons);
            var firstSeason = response.seasons[0];
            this.setSeasonNumber(firstSeason.season_number);
            this.seasonId = firstSeason.id;
            this.getSeasonInfo();
          }
        }, (error) => {
          // console.log('[RelatedSeasons | getSeriesInfo | error | ]', error);
        });
      },
      getSeasonInfo() {
        this.actGetSeasonInfo({ seriesId: this.seriesId, seasonId: this.seasonId }).then((response) => {
          if (response.episodes && response.episodes.length) {
            var firstEpisode = response.episodes[0];
            var parsedSeasonInfo = this.parseContents(firstEpisode);

            this.parsedSeries.releaseYear = parsedSeasonInfo.releaseYear
            this.parsedSeries.director = (parsedSeasonInfo.director) ? parsedSeasonInfo.director : undefined;
            this.parsedSeries.cast = (parsedSeasonInfo.cast && parsedSeasonInfo.cast.length) ? parsedSeasonInfo.cast : undefined;

            this.isShowTvodButton();

            this.getEpisodes();
          }
        }, (error) => {
          // console.log('[Seasons | getSeasons | error]', error);
        });
      },
      getEpisodes() {
        
        if(this.offset === null) {
              this.offset = 0;
            }
        // console.log("getEpisodes || ",this.offset)

        this.actGetEpisodes({
          seriesId: this.seriesId,
          seasonId: this.seasonId,
          limit: this.limit,
          offset: this.offset,
          order: this.displayOrder
        }).then((response) => {

          if (!response.count || (response.episodes).length == 0 ) return;

          var episodes = new Array();

          var mediaProgressList = undefined;
          if (localStorage.getItem('mediaProgressList') && this.altUser) {
            mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
          }

          for (var i in response.episodes) {
            if (response.episodes[i].media_id == this.contentId) {
              continue;
            }

            var episode = this.parseContents(response.episodes[i]);
            var mediaProgressId = undefined;
            if (mediaProgressList) {
              for (var j in mediaProgressList) {

                // NOTE added by sumit ,should be mediaId,not .media_id; 15.01.2018
                // kids and comedy used media_id in mediaProgressList.
                // other movie shows used mediaId.
                mediaProgressId = mediaProgressList[j].mediaId ? mediaProgressList[j].mediaId : mediaProgressList[j].media_id;
                if (mediaProgressId == episode.id) {
                  episode.progress = mediaProgressList[j].progress;
                  break;
                } else {
                  episode.progress = undefined;
                }
              }
            }

            episodes.push(episode);
          }

          this.episodeCount = episodes.length;
          this.totalEpisodes = response.count;
          if (this.contentName == 'episode') {
            this.showLoadMore = (this.episodeCount + 1) != response.count;
          } else {
            this.showLoadMore = this.episodeCount != response.count;
          }

          this.setRelatedEpisodes(episodes);
          this.toggleSeasonLoader(false);
        }, (error) => {
          // console.log('[RelatedSeasons | actGetEpisodes | error | ]', error);
        });
      },
      getEpisodesBySeason(seasonId, seasonNumber) {
        this.hidePopup();
        this.offset = 0;
        this.pageNumber = 1;
        this.seasonId = seasonId;
        this.setSeasonNumber(seasonNumber)
        this.getSeasonInfo();
      },
      playBts(selectedBts) {

        selectedBts.contentName = "media";
        selectedBts.contentType = "movie";
        this.playbackItemInfo = selectedBts;
        // console.log("selectedBts >>>",selectedBts);
        localStorage.setItem('event_source', 'show_details_bts_tab');
        this.checkScreenRotationType();
      },
      playRelatedEpisode(index, click) {
        var slctdRelatedEpisode = this.relatedEpisodes[index];

        console.log("relatedSeasons.vue || relatedEpisodes", this.relatedEpisodes)

        console.log("relatedSeasons.vue || playRelatedEpisode", slctdRelatedEpisode)

        localStorage.setItem('event_source', this.$route.name + '_detail');

        if(slctdRelatedEpisode.contentName == "episode") {
          if(click === 'meta') return
          this.playbackItemInfo = slctdRelatedEpisode;
           this.checkScreenRotationType();
          this.setCurrentEpisodeInfo(slctdRelatedEpisode);
          eventBus.$emit("toggleSendDataToPlayerScreen",slctdRelatedEpisode);
        } else {
          var routerObj = {
            name: slctdRelatedEpisode.contentName,
            params: {
              id: slctdRelatedEpisode.id
            }
          }
          this.$router.push(routerObj);
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      },
      orderSeasons(seasons) {
        return seasons.sort((a, b) => {
          return (a.season_number > b.season_number) ? 1 : ((b.season_number > a.season_number) ? -1 : 0);
        });
      },
      hidePopup() {
        this.toggleSeasonPopup(false);
      },
      toggleSeasonPopup(show) {
        this.showSeasons = show
      },
      toggleSeasonLoader(isShow) {
        var seasonLoader = document.getElementById('alt-rs-loader');

        if (!seasonLoader) return;

        if (isShow) {
          seasonLoader.style.display = 'block';
        } else {
          seasonLoader.style.display = 'none';
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
          });
      },
      initCreateRelatedSeasons() {
        this.contentType = this.playerContent.contentType;

        if (this.contentType == 'series') {
          this.seriesId = this.playerContent.seriesId;
          this.seasonSelector = true;

          this.getSeriesInfo();
        } else if (this.contentType == 'movie') {
          this.contentId = this.playerContent.contentId;
          this.mainCategoryId = this.playerContent.mainCategoryId;
          this.seasonSelector = false;
          this.templateTitle = 'RELATED VIDEOS';

          this.getRelatedVideos();
        }
      },
      isSeasonSelected(number) {
        return this.seasonNumber == number ? true : false;
      },
      loadMoreEpisodes() {
       // console.log("loadMoreEpisodes || start || limit", this.limit);

        // console.log("loadMoreEpisodes || start || offset", this.offset);


        this.loading = true;
        this.showLoadMore = false;
        this.offset += this.limit;
        this.actGetEpisodes({
          seriesId: this.seriesId,
          seasonId: this.seasonId,
          limit: this.limit,
          offset: this.offset
        }).then((response) => {
          if (!response.count ) return;
          let loadMoreEpsodesInfo = [];

          var mediaProgressList = undefined;
          if (localStorage.getItem('mediaProgressList') && this.altUser) {
            mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
          }

          for (var i in response.episodes) {
            if (response.episodes[i].media_id == this.contentId) {
              continue;
            }

            let episode = this.parseContents(response.episodes[i]);

            let geoStatus = undefined;
            if(episode && episode.geoBlock) {
                geoStatus = this.geoBlockCountryWise(episode.geoBlock);
                if(geoStatus) {
                    continue;
                }
            }

            if (mediaProgressList) {
              for (var j in mediaProgressList) {
                if (mediaProgressList[j].mediaId === episode.mediaId) {
                  episode.progress = mediaProgressList[j].progress;
                  break;
                } else {
                  episode.progress = undefined;
                }
              }
            }
             loadMoreEpsodesInfo.push(episode);
          }

          // console.log("[loadMoreEpisodes || loadMoreEpsodesInfo]",loadMoreEpsodesInfo);

          // console.log("[loadMoreEpisodes || this.relatedEpisodes,]", this.relatedEpisodes);

          this.setRelatedEpisodes([...this.relatedEpisodes,...loadMoreEpsodesInfo]);

          this.episodeCount = (this.relatedEpisodes && this.relatedEpisodes.length) ? this.relatedEpisodes.length : 0;

          if (this.contentName == 'episode') {
            this.showLoadMore = (this.episodeCount + 1) != response.count;
          } else {
            this.showLoadMore = this.episodeCount != response.count;
          }

          
          this.toggleSeasonLoader(false);

          this.loading = false;

          // NOTE: End of New code change
        }, (error) => {
          this.loading = false;
          // console.log('[RelatedSeasons | actGetEpisodes | Error | ]', error);
        })
      },
      isFreeContent(content) {
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
          var altOrder = undefined;
          if (localStorage.getItem('altOrder')) {
            altOrder = JSON.parse(localStorage.getItem('altOrder'));
          }

          if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
            return false;
          } else {
            if (content.tvod) {
              if (altOrder && altOrder.tvod && altOrder.tvod.hasOrder ) {
                var homeDomain = localStorage.getItem('homeDomain').toLowerCase();
                var singleTvod = undefined;
                for (singleTvod in altOrder.tvod.products) {
                  if (altOrder.tvod.products[singleTvod].product.id == content.tvod[homeDomain]) {
                    return false;
                    break;
                  }
                }
                return content.isFreeContent;
              } else {
                return content.isFreeContent;
              }

            } else {
              return content.isFreeContent;
            }
          }
        } else {
          return content.anonymousAccess || content.isFreeContent;
        }
      },
      rentTvodItem() {
        if (this.altUser) {
          //session added SUMIT
          localStorage.setItem('session_track_link',window.location.href);
          //session added SUMIT
          var type = undefined;
          var id = undefined;

          if (this.contentType == 'series' || this.contentType == 'standup' || this.contentType == 'episode') {
          }
          type = 'show';
          id = this.seriesId;

          this.$router.push({ name: 'rent', params: { type, id  } });
        } else {
          if(document.getElementById('alt-app')) {
            document.getElementById('alt-app').style.position = "fixed";
          }

          eventBus.$emit('toggleRentTvodItemEvent', true);
        }
      },
      getProgressText(progress) {
        if (!this.altUser) {
          return false;
        }
        if (progress == 100) {
          return 'WATCHED';
        }
        return 'WATCHING';
      },
      registerScrollCB (event) {
       // console.log("registerScrollCB || this.showLoadMore", (window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.showLoadMore);

        // console.log("(window.innerHeight + window.scrollY)", (window.innerHeight + window.scrollY) + 10);

        // console.log("document.body.offsetHeight", document.body.offsetHeight);
        // console.log("this.showLoadMore", this.showLoadMore);
        

        
        if ((window.innerHeight + window.scrollY) + 100 >= document.body.offsetHeight && this.showLoadMore) {

         // console.log('[registerScrollCB || reaching]');
         // console.log('[registerScrollCB || reaching || this.relatedEpisodes]', this.relatedEpisodes);
         // console.log('[registerScrollCB || reaching || this.totalEpisodes]', this.totalEpisodes);
         // console.log('[registerScrollCB || reaching] || this.relatedEpisodes.length', this.relatedEpisodes.length);

          if(this.relatedEpisodes && this.relatedEpisodes.length && this.totalEpisodes && (this.totalEpisodes <=  this.relatedEpisodes.length)) {
            // console.log("relatedSeasons.vue || registerScrollCB || in");

            window.removeEventListener('scroll', this.registerScrollCB);
            this.toggleSeasonLoader(false);
            return;
          }
          this.loadMoreEpisodes();
        }
      },
      assertTvodButtonVisibility () {
        if (localStorage.getItem('altUser')) {
          this.altUser = JSON.parse(localStorage.getItem('altUser'));
          if (localStorage.getItem('altOrder')) {
            this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
            if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {
              this.showTvodButton = false;
            } else{
              //NOTE Code added by sumit
              if (this.altOrder && this.altOrder.tvod && this.altOrder.tvod.hasOrder && this.altOrder.tvod.expired == false) {
                this.showTvodButton = false;
              } else {
                this.showTvodButton = true;
              }
            }
          }
        } else {
          this.showTvodButton = true;
        }
      },
      closeEpisodeFeaturesCB() {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "relative";
        }
        this.isEnableHundredEpisode = false;
      },
      hundredEpisodePayloadCB (payload) {

        eventBus.$emit("closeEisodefeatures",false);

        this.hundredEpisodePayload = payload;
        this.offset = payload.offset;
        this.displayOrder = payload.order;
        this.limit = payload.limit;
        this.episodeFilterKeyName = payload.caption ? payload.caption : this.episodeList.recentLabel;
         if (payload.lazyLoad) {
          window.removeEventListener('scroll', this.registerScrollCB);
          window.addEventListener('scroll', this.registerScrollCB);
        } else {
          window.removeEventListener('scroll', this.registerScrollCB);
        }
        // console.log("payload-data -all episode", payload);
        this.getEpisodes();
       
      },
      languageChangeCB() {
         window.removeEventListener('scroll', this.registerScrollCB);
         window.addEventListener('scroll', this.registerScrollCB);
         this.limit = 10;
         this.offset = 0;
         this.displayOrder = 'asc';
         this.initRelatedSeasons();
      }
    },
    created() {
       eventBus.$on('playerContentFetchEvent', this.initRelatedSeasons);
      this.initRelatedSeasons();
      eventBus.$on('closeEisodefeatures',this.closeEpisodeFeaturesCB);
      this.assertTvodButtonVisibility();
      // console.log("RelatedSeason.vue || created");

      eventBus.$on("eventHundredEpisodeController",this.hundredEpisodePayloadCB);
      eventBus.$on("languageChangeEventForRelatedSeason", this.languageChangeCB); 
    },
    mounted() {
      this.toggleSearchIco(false);
      // When page reaches end, fetch the next episodes or related contents
     
      // console.log("RelatedSeason.vue || mounted",this.playerContent);

    },
    beforeDestroy() {
      // console.log("Relatedseason || beforeDestroy");
      eventBus.$off('playerContentFetchEvent');
      this.setHasBts(null)
      this.setRelatedEpisodes(undefined);
      eventBus.$off("eventHundredEpisodeController",this.hundredEpisodePayloadCB);
      window.removeEventListener('scroll', this.registerScrollCB);
      eventBus.$off("languageChangeEventForRelatedSeason",this.languageChangeCB); 
    },
    components: {
      'hundred-episode': hundredEpisodeList
    },
    mixins: [altMixins]
  }
</script>
