<template>
  <div class="alt-favourites">
    <nav class="top-menu">
      <a class="scroll-menu" v-for="section in sections" @click="setActiveSection(section)" :class="isActiveClass(section)">{{section}}</a>
    </nav>
    <div v-if="favourites && favourites.length" id="mvi-fav-sec">
      <div class="mvi-data" v-for="(content, index) in favourites">
          <label :for="getFavDeleteCheckID(content)">
              <div class="mvi-item" @click="playFavouriteItem(index)">
                  <div class="mvi-img-sec">
                      <img v-if="content.images && content.images.cover" :src="content.images.cover" class="mvi-img">
                      <img v-else src="../../assets/alt-cover.jpg" alt="">

                      <div v-if="content.progress && content.progress != 100" class="line-progress">
                          <div class="progress" :style="{ width: content.progress + '%' }"></div>
                      </div>
                      <div v-else class="color-line"></div>
                  </div>
                  <div class="mvi-detail-sec">
                      <h3 v-if="content.title">{{content.title}}</h3>
                      <ul class="info-tags">
                          <li v-if="!(content.noShow) && content.seasonNumber">S{{content.seasonNumber}}</li>
                          <li v-if="!(content.noShow) && content.episodeNumber">E{{content.episodeNumber}}</li>
                          <li v-if="content.duration">{{content.duration}}</li>
                          <li v-if="content.contentTitle == 'Poster'">0s</li>
                          <li v-if="content.mainLanguage">{{content.mainLanguage}}</li>
                      </ul>
                      <p class="series-content" v-show="content.contentType=='series'">{{content.categories[0]}}</p>
                      <p v-if="content.comingSoon" class="alt-tag">Coming Soon</p>
                      <p v-show="isFreeContent(content) && !(content.progress)" class="alt-tag">Free</p>
                      <p v-if="content.progress && !content.comingSoon" class="alt-tag">
                          <span v-if="content.progress != 100">watching</span>
                          <span v-else>watched</span>
                      </p>
                  </div>
                  <div class="clearfix"></div>
              </div>
          </label>
        <input type="checkbox" class="del-check fav-del-check" :id="getFavDeleteCheckID(content)" :value="getFavDeleteCheckValue(content, index)" v-model="itemsToDelete" v-show="showFavDeleteCheck">
      </div>
    </div>

    <div v-else class="alt-empty-msg">
      <p class="empty-msg">No Favourites yet. Really?</p>
    </div>

    <div class="bottom-box" v-show="favourites && deleteMode">
      <div class="btn-box">
        <button type="button" class="btn btn-grad btn-lg" @click="deleteAllRecentPopup" v-show="showClearAllBtn">CLEAR ALL</button>

        <button type="button" class="btn btn-grad btn-lg" @click="deleteSelectedRecentPopup" v-show="showClearSelectedBtn">CLEAR SELECTED</button>
      </div>
    </div>
    <popup-delete-video v-show="showPopupDeleteVideo"></popup-delete-video>
    <alt-modals></alt-modals>
  </div>
</template>

<script>
  import { eventBus } from '../../main';
  import { altMixins } from '../../mixins';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  const playerScreen = () => import ('@/components/player/PlayerScreen.vue');
  const Modals = () => import (/* webpackChunkName: "favourites-Favourites-Modals" */ '../shared/Modals.vue');
  const PopupVideoDeleteConformation = () => import(/* webpackChunkName: "favourites-Favourites-PopupVideoDeleteConformation" */ '../shared/PopupVideoDeleteConformation.vue');

  export default {
    data() {
      return {
        favouriteItems: undefined,
        favouriteShows: undefined,
        favouriteMovies: undefined,
        favouriteVideos: undefined,
        sections: ['SHOWS', 'MOVIES', 'VIDEOS'],
        activeTitle: undefined,
        activeContents: undefined,
        limit: 50,
        offset: 0,
        showClearAllBtn: false,
        showClearSelectedBtn: false,
        showClearCrossButton: false,
        deleteMode: false,
        altOrder: undefined,
        itemsToDelete: [],
        showFavDeleteCheck: false,
        favDelCheckIdPrefix: 'fav-del-check-',
        slctdFavDelItemsLength: 0,
        favSlctdDeletedItems: 0,
        slctdFavDelError: false,
        slctdFavDelErrorCount: 0,
        showCreateKidsPin: false,
        showPopupDeleteVideo: false,
        deleteButtonType: undefined,
        redirectionFlag : false,
        playbackItemInfo : undefined,
      };
    },
    computed: {
      ...mapGetters([
      'favourites',
      'appActive',
      ]),
    },
    watch: {
      appActive() {
        this.initFavourites();
      },
      itemsToDelete(items) {
        this.watchItemsToDeleteCB(items);
      }
    },
    methods: {
      ...mapMutations([
      'setFavourites',
      'setPlayerContent',
      'setFavouriteDeleteMode',
      ]),
      ...mapActions([
      'actGetFavouriteList',
      'actDeleteFavouriteSeries',
      'actDeleteFavouriteMedia',
      'actDeleteFavouriteItems',
      ]),
      setFavouritePageHeader() {
        this.setHeaderTitle('Favourites');

        var headerSearchIco = document.getElementById('header-search-ico');
        if (headerSearchIco) {
          headerSearchIco.style.display = 'none';
        }

        var favDeleteIco = document.getElementById('delete-ico');
        if (favDeleteIco) {
          favDeleteIco.addEventListener('click', this.favDeleteIcoClickCB);
          favDeleteIco.style.display = 'inline';
        }

        var favCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (favCloseDeleteIco) {
          favCloseDeleteIco.addEventListener('click', this.favCloseDeleteIcoClickCB);
          favCloseDeleteIco.style.display = 'none';
        }
      },
      deleteAllRecentPopup() {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        this.deleteButtonType = 'ALL';
        this.showPopupDeleteVideo = true;
      },
      deleteSelectedRecentPopup() {
        //NOTE added by SUMIT for selected delete
        // console.log("RecentlyWatched|deleteSelectedRecent");
        // eventBus.$on('toggleVideoDelete', this.deleteSelectedFavourites);

        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        this.deleteButtonType = 'SELECTED';
        this.showPopupDeleteVideo = true;
      },
      initFavourites() {
        this.actGetFavouriteList({
          limit: this.limit,
          offset: this.offset
        }).then((response) => {
          if (response.count) {
            var favourites = new Array();

            var mediaProgressList = undefined;
            if (localStorage.getItem('mediaProgressList')) {
              mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
            }

            for (var i in response.assets) {
              var parsedFavorites = this.parseContents(response.assets[i]);
              // NOTE at favourite there should not be episode; sumit
              if(parsedFavorites.contentName == 'episode') {
                continue;
              }
              if (mediaProgressList) {
                for (var j in mediaProgressList) {
                  if (parsedFavorites.contentId == mediaProgressList[j].media_id) {
                    parsedFavorites.progress = mediaProgressList[j].progress;
                    break;
                  }
                }
              }

              favourites.push(parsedFavorites);
            }

            this.favouriteItems = favourites;
            this.setActiveSection('SHOWS');
          } else {
            this.favouriteShows = undefined;
            this.favouriteMovies = undefined;
            this.favouriteVideos = undefined;

            this.deleteMode = false;
            this.favouriteItems = undefined;
            this.setFavourites([]);
            this.setActiveSection('SHOWS');

            var favDeleteIco = document.getElementById('delete-ico');
            if (favDeleteIco) {
              favDeleteIco.style.display = 'none';
            }
            // console.log("Favourites.vue | check");;

            var favCloseDeleteIco = document.getElementById('header-close-ico-default');
            if (favCloseDeleteIco) {
              favCloseDeleteIco.style.display = 'none';
            }
          }

        }, (error) => {
          // console.log(error);
        });
      },
      isFreeContent(content) {
        //added my sumit
        if (this.altUser && this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder == false && this.altOrder.subscription.expired == true) {
          return true;
        } else if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {
          return false;
        } else {
          return content.isFreeContent;
        }
      },
      setActiveSection(title) {
        this.activeTitle = title;
        var favourites = undefined;

        if (!this.favouriteItems || !this.favouriteItems.length) {
          this.toggleLoader(false);
          return;
        }

        switch (title) {
          case 'SHOWS':
          favourites = this.favouriteItems.filter((item) => {
            return (item.contentType == 'episode' || item.contentType == 'series');
          });

          break;
          case 'MOVIES':
          favourites = this.favouriteItems.filter((item) => {
            return (item.contentType == 'movie');
          });

          break;
          case 'VIDEOS':
          favourites = this.favouriteItems.filter((item) => {
            return (item.contentType == 'trailer' || item.contentType == 'poster');
          });

          break;
          default:
        }

        this.toggleLoader(false);
        this.setFavourites(favourites);

        // console.log('[Favourites -> setActiveSection -> title ]', title);

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          // AWS Event for category select
          var catSelectEventAttributeObj = this.getAWSMACommonAttributes();
          catSelectEventAttributeObj.category_title = title;
          // For favourites sections, category_id && category_url will not be there
          catSelectEventAttributeObj.category_id  = 'N.A';
          catSelectEventAttributeObj.category_url = 'N.A';

          // console.log('[HomeNav -> setActiveSection -> catSelectEventAttributeObj]', catSelectEventAttributeObj);

          // Recording the event
          window.mobileAnalyticsClient.recordEvent('_category.select', catSelectEventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      playFavouriteItem(index) {
        var selectedItem = this.favourites[index];

        this.setPlayerContent(selectedItem);
        // console.log("favourites.vue || playFavouriteItem",selectedItem);

        // @sumit for event source playback
        localStorage.setItem('event_source', 'favourites');

        if (selectedItem.contentName == 'episode') {
          this.playbackItemInfo = selectedItem;
           this.playerScreenFlag = true;
           this.checkScreenRotationType();
          // eventBus.$emit("toggleSendDataToPlayerScreen",selectedItem);
        } else {
          var routerQuery = {
            name: selectedItem.contentName,
            params: {
              id: selectedItem.id
            }
          };

          // For AWS Mobile SDK Events
          localStorage.setItem('AWSMA_content_source', 'favourite');
          if(!this.redirectionFlag) {
            this.$router.push(routerQuery);
          }
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
        screen.orientation.lock('landscape').then((response) => {
          eventBus.$emit("toggleSendDataToPlayerScreen",this.playbackItemInfo);
        },(error) => {
          // console.log("landscapeRotation",error);
        });
      },
      isActiveClass(section) {
        return (this.activeTitle == section ? 'active' : '');
      },
      deleteFavouriteItem(index, content) {
        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var pageSelectAttributes = this.getAWSMACommonAttributes();
          eventAttributeObj.content_id = content.id;
          eventAttributeObj.content_title = content.title.toLowerCase();
          eventAttributeObj.content_url = window.location.href;
          eventAttributeObj.content_type = content.contentType;
          eventAttributeObj.event_action = 'remove';
          window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events

        /**
        * if content type is series
        */
        if (content.contentType == 'series') {
          this.actDeleteFavouriteSeries(content.seriesId).then((response) => {
            this.favourites.splice(index, 1);
            this.cumulateItems();
          }, (error) => {
            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
              var eventAttributeObj = this.getAWSMACommonAttributes();
              eventAttributeObj.error_code = error.code.toString();
              eventAttributeObj.error_message = error.message;
              eventAttributeObj.event_action = 'error';
              window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events
          });
        } else {
          this.actDeleteFavouriteMedia(content.contentId).then((response) => {
            this.favourites.splice(index, 1);
            this.cumulateItems();
          }, (error) => {
            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
              var eventAttributeObj = this.getAWSMACommonAttributes();
              eventAttributeObj.error_code = error.code.toString();
              eventAttributeObj.error_message = error.message;
              eventAttributeObj.event_action = 'error';
              window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events
          });
        }
      },
      cumulateItems() {
        switch (this.activeTitle) {
          case 'SHOWS':
          if (!(this.favouriteShows) || !(this.favouriteShows.length)) {
            this.deleteMode = false;
            eventBus.$emit('toggleFavDeleteModeEvent', false);
          }
          break;
          case 'MOVIES':
          if (!(this.favouriteMovies) || !(this.favouriteMovies.length)) {
            this.deleteMode = false;
            eventBus.$emit('toggleFavDeleteModeEvent', false);
          }
          break;
          case 'VIDEOS':
          if (!(this.favouriteVideos) || !(this.favouriteVideos.length)) {
            this.deleteMode = false;
            eventBus.$emit('toggleFavDeleteModeEvent', false);
          }
          break;
          default:
        }
      },
      toggleFavDeleteModeCB(state) {
        var favDeleteIco = document.getElementById('delete-ico');
        if (favDeleteIco) {
          favDeleteIco.style.display = state ? 'none' : 'inline';
        }
        var favCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (favCloseDeleteIco) {
          favCloseDeleteIco.style.display = state ? 'inline' : 'none';
        }
        this.redirectionFlag = false;

        this.deleteMode = state;
        this.showFavDeleteCheck = state;
        this.showClearAllBtn = state;
        this.showClearSelectedBtn = false;
        this.itemsToDelete = [];
      },
      favDeleteIcoClickCB() {
        var favDeleteIco = document.getElementById('delete-ico');
        if (favDeleteIco) {
          favDeleteIco.style.display = 'none';
        }
        this.redirectionFlag = true;
        var favCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (favCloseDeleteIco) {
          favCloseDeleteIco.style.display = 'inline';
        }

        this.deleteMode = true;
        this.showFavDeleteCheck = true;
        this.showClearAllBtn = true;
        this.showClearSelectedBtn = false;
        this.itemsToDelete = [];
      },
      favCloseDeleteIcoClickCB() {
        var favCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (favCloseDeleteIco) {
          favCloseDeleteIco.style.display = 'none';
        }

        var favDeleteIco = document.getElementById('delete-ico');
        if (favDeleteIco) {
          favDeleteIco.style.display = 'inline';
        }

        this.redirectionFlag = false;

        this.deleteMode = false;
        this.showFavDeleteCheck = false;
        this.showClearAllBtn = false;
        this.showClearSelectedBtn = false;
        this.itemsToDelete = [];
      },
      deleteAllFavourites() {
        this.toggleLoader(true);

        this.actDeleteFavouriteItems().then((response) => {
          setTimeout(this.initFavourites, 1000);
        }, (error) => {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.error_code = error.code.toString();
            eventAttributeObj.error_message = error.message;
            eventAttributeObj.event_action = 'error';
            window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events

          this.toggleLoader(false);
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          eventAttributeObj.event_action = 'clearall';
          window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      deleteSelectedFavourites() {
        this.toggleLoader(true);

        if (!this.itemsToDelete || !this.itemsToDelete.length) {
          this.toggleLoader(false);
          return;
        }

        var eventAttributeObj = this.getAWSMACommonAttributes();

        for (var i in this.itemsToDelete) {
          var item = this.itemsToDelete[i];

          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            eventAttributeObj.event_action = 'remove';
            eventAttributeObj.content_id = item.id ? item.id : 'N.A';
            eventAttributeObj.content_title = item.title ? item.title.toLowerCase() : 'N.A';
            eventAttributeObj.content_url = item.url ? item.url : 'N.A';
            eventAttributeObj.content_type = item.type ? item.type : 'N.A';
            window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events

          if (item.type == 'media' || item.type == 'episode') {
            this.actDeleteFavouriteMedia(item.id).then((response) => {
              this.favSlctdDeletedItems += 1;
            }, (error) => {
              this.slctdFavDelError = true;
            });
          } else if (item.type == 'series' || item.type == 'show') {
            // NOTE added sumit for  'show' content type
            this.actDeleteFavouriteSeries(item.id).then((response) => {
              this.favSlctdDeletedItems += 1;
            }, (error) => {
              this.slctdFavDelError = true;
            });
          }
        }   // end of for loop

        var checkboxes = document.getElementsByClassName('fav-del-check');
        var checkedBoxes = new Array();

        var checkIndexes = new Array();
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            checkIndexes.push(i);
          }
        }

        for (var key in checkIndexes) {
          delete this.favourites[checkIndexes[key]];
        }

        this.setFavourites(this.favourites.filter((item) => {
          return item;
        }));

        eventBus.$emit('toggleFavDeleteModeEvent', false);

        this.itemsToDelete = [];

        setTimeout(this.initFavourites, 2000);

        function findParentNode(elm, cls) {
          while ((elm = elm.parentElement) && !elm.classList.contains(cls));
          return elm;
        }
      },
      getFavDeleteCheckID(content) {
        if (content.contentType) {
          switch (content.contentType) {
            case 'series':
            return this.favDelCheckIdPrefix + 'series-' + content.seriesId;
            break;
            default:
            return this.favDelCheckIdPrefix + 'media-' + content.contentId;
          }
        }

        return this.generateRandomId(10);
      },
      getFavDeleteCheckValue(content, index) {
        return {
          type: content.contentName ?  content.contentName : 'media',
          id: content.id,
          index,
          title: content.title,
          url: content._links && content._links.self ? content._links.self.href : 'N.A'
        };
        return false;
      },
      watchItemsToDeleteCB(items) {
        // console.log('[Favourites | watchItemsToDeleteCB | items ]', items);

        if (items && items.length) {
          this.showClearAllBtn = false;
          this.showClearSelectedBtn = true;
        } else {
          this.showClearAllBtn = true;
          this.showClearSelectedBtn = false;
        }
      },
      popupDeleteVideoCB(state) {

        this.showPopupDeleteVideo = false;

        if(this.deleteButtonType) {
          if (this.deleteButtonType == 'SELECTED') {
            this.deleteSelectedFavourites();
          } else {
            this.deleteAllFavourites();
          }
        }
      },
      stuffCommonAttributes() {
        var localAttributeObj = {}
        var geo_location = localStorage.getItem('geo_location');
        var altConfig = JSON.parse(localStorage.getItem('altConfig'));

        if (geo_location) {
          geo_location = JSON.parse(geo_location);
          localAttributeObj = geo_location;
        }
        localAttributeObj.user_email = localStorage.getItem('user_email');
        localAttributeObj.user_id = localStorage.getItem('account_id');
        localAttributeObj.user_session = localStorage.getItem('token');
        localAttributeObj.user_name = localStorage.getItem('user_name');
        localAttributeObj.user_dob = localStorage.getItem('user_birthday');
        localAttributeObj.user_gender = localStorage.getItem('user_gender');
        localAttributeObj.app_env = altConfig.environment.title;

        return localAttributeObj;
      },
      stuffMenuSelectAttributes( sectionTitle, sectionId) {
        var eventAttributeObj = {}
        eventAttributeObj = this.stuffCommonAttributes();

        eventAttributeObj.page_title = sectionTitle;
        eventAttributeObj.section_id = sectionId.toString();

        return eventAttributeObj;
      },
      stuffPageViewAttributes( pageTitle, pageUrl) {
        var eventAttributeObj = {}
        eventAttributeObj = this.stuffCommonAttributes();

        eventAttributeObj.page_title = pageTitle;
        eventAttributeObj.page_url = pageUrl;

        return eventAttributeObj;
      },
      stuffErrorAttributes( code, message) {
        var eventAttributeObj = {}
        eventAttributeObj = this.stuffCommonAttributes();

        eventAttributeObj.error_code = code.toString();
        eventAttributeObj.error_message = message;
        eventAttributeObj.event_action = 'error';

        return eventAttributeObj;
      },
      stuffFavouriteAttributes( action, contentNode) {
        var eventAttributeObj = {}
        eventAttributeObj = this.stuffCommonAttributes();

        if (contentNode.contentId == undefined) {
          if (contentNode.contentType == 'series') {
            eventAttributeObj.content_id = contentNode.seriesId;
          }
        } else {
          eventAttributeObj.content_id = contentNode.contentId;
        }
        eventAttributeObj.content_title = contentNode.title.toLowerCase();
        eventAttributeObj.content_url = contentNode.content_url;
        eventAttributeObj.content_type = contentNode.contentType;
        eventAttributeObj.event_action = action;

        return eventAttributeObj;
      },
    },
    created() {
      this.toggleLoader(true);

      eventBus.$on('popupDeleteVideoEvent', this.popupDeleteVideoCB);
      eventBus.$on('togglePopupDeleteVideo', (state) => {
        this.showPopupDeleteVideo = state;
      });
      eventBus.$on('toggleCreateKidsPinEvent', (state) => {
        this.showCreateKidsPin = state;

        if (!state) {
          this.$router.push({ name: 'home' });
        }
      });

      var pageTitle = "Favourites";
      if (localStorage.getItem('altOrder')) {
        this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      //NOTE added by sumit for delete popup
      eventBus.$on('toggleVideoDeleteConformationPopupEvent', (state) => { this.showPopupDeleteVideo = state; });

      // AWS Mobile SDK Events
      // if (window.mobileAnalyticsClient) {
      //   var menuSelectAttributes = this.getAWSMACommonAttributes();
      //   menuSelectAttributes.page_title = pageTitle;
      //   menuSelectAttributes.section_id = 'N.A';
      //   window.mobileAnalyticsClient.recordEvent('_menu.select', menuSelectAttributes, {});
      //
      //   var pageSelectAttributes = this.getAWSMACommonAttributes();
      //   pageSelectAttributes.page_title = pageTitle;
      //   pageSelectAttributes.page_url = window.location.href;
      //   window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
      // }
      // End of AWS Mobile SDK Events

      eventBus.$on('toggleFavDeleteModeEvent', this.toggleFavDeleteModeCB);

      if (this.appActive) {
        this.initFavourites();
      }
    },
    mounted() {
      this.toggleLoader(true);
      this.setFavouritePageHeader();
      eventBus.$emit('toggleVideoBlockPopupEvent', false);
    },
    beforeRouteEnter: (to, from, next) => {

      var altProfileMode = localStorage.getItem('altProfileMode');
      if (altProfileMode == 'kids') {
        next({ name: 'kidsMode' })
      } else {
        var altUser = localStorage.getItem('altUser');
        if (altUser) {
          next();
        }
      }
    },
    beforeDestroy() {
      var favDeleteIco = document.getElementById('delete-ico');
      if (favDeleteIco) {
        favDeleteIco.removeEventListener('click', this.favDeleteIcoClickCB);
      }

      var favCloseDeleteIco = document.getElementById('header-close-ico-default');
      if (favCloseDeleteIco) {
        favCloseDeleteIco.removeEventListener('click', this.favCloseDeleteIcoClickCB);
      }

      eventBus.$off('toggleVideoDeleteConformationPopupEvent');
      eventBus.$off('toggleVideoDelete');

      // NOTE added by SUMIT for selected delete video delete event destroy
      eventBus.$off('popupDeleteVideoEvent');
    },
    components: {
      'alt-modals': Modals,
      'popup-delete-video':PopupVideoDeleteConformation,
      'player-screen': playerScreen,
    },
    beforeRouteEnter: (to, from, next) => {
      if (localStorage.getItem('altUser')) {
        next();
      } else {
        next({ name: 'home' });
      }
    },
    mixins: [altMixins]
  }
</script>
