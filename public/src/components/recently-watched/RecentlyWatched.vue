<template>
  <div class="recently-watched">
    <nav class="top-menu">
      <a class="scroll-menu" v-for="section in recentSections" @click="setActiveSection(section)" :class="isActiveClass(section)">{{section}}</a>
    </nav>

    <div v-if="recentlyWatched && recentlyWatched.length" class="container">
      <div class="mvi-data" v-for="(content, index) in recentlyWatched">
          <label :for="getRecentDeleteCheckID(content)">
              <div class="mvi-item" @click="playRecentItem(index)">
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
                          <li v-if="content.mainLanguage">{{content.mainLanguage}}</li>
                      </ul>
                      <p v-show="isFreeContent(content) && !(content.progress)" class="alt-tag">Free</p>
                      <p v-if="content.progress" class="alt-tag">
                          <span v-if="content.progress != 100">watching</span>
                          <span v-else>watched</span>
                      </p>
                  </div>
                  <div class="clearfix"></div>
              </div>
          </label>
        <input type="checkbox" class="del-check rcnt-del-check" :id="getRecentDeleteCheckID(content)" :value="getRecentDeleteCheckValue(content, index)" v-model="itemsToDelete" v-show="showRecentDeleteCheck">
      </div>
    </div>
    <div v-else class="alt-empty-msg">
      <p class="empty-msg">You've not watched anything yet.</p>
    </div>
    <div class="bottom-box" v-show="deleteMode">
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

  const Header = () => import (/* webpackChunkName: "recently-watched-RecentlyWatched-Header" */ './Header.vue');
  const Modals = () => import (/* webpackChunkName: "recently-watched-RecentlyWatched-Modals" */ '../shared/Modals.vue');
  const PopupVideoDeleteConformation = () => import(/* webpackChunkName: "recently-watched-RecentlyWatched-PopupVideoDeleteConformation" */ '../shared/PopupVideoDeleteConfirmationRecent.vue');

  export default {
    data() {
      return {
        limit: 50,
        offset: 0,
        recentItems: undefined,
        recentShows: undefined,
        recentMovies: undefined,
        recentVideos: undefined,
        activeContent: undefined,
        activeTitle: undefined,
        recentSections: ['SHOWS', 'MOVIES', 'VIDEOS'],
        selectedItem: undefined,
        deleteMode: false,
        altOrder: undefined,
        itemsToDelete: [],
        showRecentDeleteCheck: false,
        rcntDelCheckIdPrefix: 'del-check rcnt-del-check-',
        slctdRecentDelItemsLength: 0,
        rcntSlctdDeletedItems: 0,
        slctdRecentDelError: false,
        slctdRecentDelErrorCount: 0,
        showClearAllBtn: false,
        showClearSelectedBtn: false,
        showCreateKidsPin: false,
        showPopupDeleteVideo: false,
        deleteButtonType :undefined,
        redirectionFlag:false,
      };
    },
    computed: {
      ...mapGetters([
      'appActive',
      'recentDeleteMode',
      'recentlyWatched',
      ]),
      contents() {
        return this.activeContent;
      },
    },
    watch: {
      appActive() {
        this.initRecentWatched();

      },
      itemsToDelete(items) {
        this.watchItemsToDeleteCB(items);
      },
    },
    methods: {
      ...mapMutations([
      'setPlayerContent',
      'setRecentlyWatched',
      ]),
      ...mapActions([
      'actGetRecentWatched',
      'actDeleteRecentItem',
      'actDeleteRecentItems',
      ]),
      setRecentPageHeader() {
        this.setHeaderTitle('Recently Watched');

        var headerSearchIco = document.getElementById('header-search-ico');
        if (headerSearchIco) {
          headerSearchIco.style.display = 'none';
        }

        var recentDeleteIco = document.getElementById('delete-ico');
        if (recentDeleteIco) {
          recentDeleteIco.addEventListener('click', this.recentDeleteIcoClickCB);
          recentDeleteIco.style.display = 'inline';
        }

        var recentCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (recentCloseDeleteIco) {
          recentCloseDeleteIco.addEventListener('click', this.recentCloseDeleteIcoClickCB);
          recentCloseDeleteIco.style.display = 'none';
        }
      },
      recentDeleteIcoClickCB() {
        var favDeleteIco = document.getElementById('delete-ico');
        if (favDeleteIco) {
          favDeleteIco.style.display = 'none';
        }
        // console.log("RecentlyWatched.vue | check");
        this.redirectionFlag = true;

        var favCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (favCloseDeleteIco) {
          favCloseDeleteIco.style.display = 'inline';
        }

        this.deleteMode = true;
        this.showRecentDeleteCheck = true;
        this.showClearAllBtn = true;
        this.showClearSelectedBtn = false;
        this.itemsToDelete = [];
      },
      recentCloseDeleteIcoClickCB() {
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
        this.showRecentDeleteCheck = false;
        this.showClearAllBtn = false;
        this.showClearSelectedBtn = false;
        this.itemsToDelete = [];

      },
      deleteAllRecentPopup() {
        // NOTE added by SUMIT for multiple delete
        // NOTE added by sumit for the popup position chnage 16.12.2018 recent watched
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        this.deleteButtonType = 'ALL';
        this.showPopupDeleteVideo = true;
      },
      deleteSelectedRecentPopup() {
        // NOTE added by SUMIT for selected delete
        // NOTE added by sumit for the popup position chnage 16.12.2018 recent watched
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        this.deleteButtonType = 'SELECTED';
        this.showPopupDeleteVideo = true;
      },
      initRecentWatched() {
        this.toggleLoader(true);

        this.actGetRecentWatched({
          limit: this.limit,
          offset: this.offset
        }).then((response) => {

          if (response.count) {
            var recentItems = new Array();
            var mediaProgressList = new Array();

            for (var i in response.history) {
              var recentItem = this.parseContents(response.history[i].media);

              var length = (response.history[i].media.details && response.history[i].media.details.length) ? response.history[i].media.details.length : undefined;

              var progress = false;
              if (length && response.history[i].playback_progress) {
                progress = Math.ceil((response.history[i].playback_progress / length) * 100);
              }
              progress = (progress > 100) ? 100 : progress;

              var mediaId = response.history[i].media.id;
              mediaProgressList.push({ mediaId, progress, length });

              recentItem.progress = false;
              if (response.history[i].playback_progress) {
                recentItem.progress = Math.ceil((response.history[i].playback_progress / recentItem.durationInSec) * 100);
              }

              recentItems.push(recentItem);
            }

            this.recentItems = recentItems;
          } else {
            this.recentShows = undefined;
            this.recentMovies = undefined;
            this.recentShows = undefined;

            this.recentItems = undefined;
            this.deleteMode = false;
            this.setRecentlyWatched([]);

            // eventBus.$emit('toggleRecentDeleteModeEvent', false);
            var recentDeleteIco = document.getElementById('delete-ico');
            if (recentDeleteIco) {
              recentDeleteIco.style.display = 'none';
            }
            // console.log("RecentlyWatched.vue | check");
            var recentCloseDeleteIco = document.getElementById('header-close-ico-default');
            if (recentCloseDeleteIco) {
              recentCloseDeleteIco.style.display = 'none';
            }
          }

          this.setActiveSection('SHOWS');
        }, (error) => {
          // console.log(error);
        });
      },
      setActiveSection(name) {
        this.activeTitle = name;
        var recentItems = undefined;

        if (!this.recentItems || !this.recentItems.length) {
          this.toggleLoader(false);
          return;
        }

        switch (name) {
          case 'SHOWS':
          recentItems = this.recentItems.filter((item) => {
            return item.contentType == 'episode';
          });
          break;
          case 'MOVIES':
          recentItems = this.recentItems.filter((item) => {
            return item.contentType == 'movie';
          });
          break;
          case 'VIDEOS':
          recentItems = this.recentItems.filter((item) => {
            return item.contentType == 'video';
          });
          default:
        }

        this.setRecentlyWatched(recentItems);

        this.toggleLoader(false);

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          // AWS Event for category select
          var catSelectEventAttributeObj = this.getAWSMACommonAttributes();
          catSelectEventAttributeObj.category_title = name;
          // For recently watched sections, category_id && category_url will not be there
          catSelectEventAttributeObj.category_id  = 'N.A';
          catSelectEventAttributeObj.category_url = 'N.A';

          // console.log('[HomeNav -> setActiveSection -> catSelectEventAttributeObj]', catSelectEventAttributeObj);

          // Recording the event
          window.mobileAnalyticsClient.recordEvent('_category.select', catSelectEventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      isActiveClass(section) {
        return (this.activeTitle == section ? 'active' : '');
      },
      playRecentItem(index) {
        this.selectedItem = this.recentlyWatched[index];
        this.setPlayerContent(this.selectedItem);

        var routerQuery = {
          name: this.selectedItem.contentName,
          params: {
            id: this.selectedItem.id
          }
        };

        // For AWS Mobile SDK Events
        localStorage.setItem('AWSMA_content_source', 'recently-watched');
        if(!this.redirectionFlag) {
            this.$router.push(routerQuery);
        }
      },
      isFreeContent(content) {
        if (this.altUser && this.altOrder && this.altOrder.hasOrder == false) {
          return true;
        } else if (this.altOrder && this.altOrder.subscription &&this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {
          return false;
        } else{
          return content.isFreeContent;
        }
      },
      getRecentDeleteCheckID(content) {
        if (content.contentType) {
          switch (content.contentType) {
            case 'series':
            return this.rcntDelCheckIdPrefix + 'series-' + content.seriesId;
            break;
            default:
            return this.rcntDelCheckIdPrefix + 'media-' + content.contentId;
          }
        }

        return this.generateRandomId(10);
      },
      getRecentDeleteCheckValue(content, index) {
        if (content.contentType) {
          switch (content.contentType) {
            case 'series':
            return { type: 'series', id: content.seriesId, index };
            break;
            default:
            return { type: 'media', id: content.contentId, index };
          }
        }

        return false;
      },
      toggleRecentDeleteModeCB(state) {
        var recentDeleteIco = document.getElementById('delete-ico');
        if (recentDeleteIco) {
          recentDeleteIco.style.display = state ? 'none' : 'inline';
        }
        this.redirectionFlag = false;

        var recentCloseDeleteIco = document.getElementById('header-close-ico-default');
        if (recentCloseDeleteIco) {
          recentCloseDeleteIco.style.display = state ? 'inline' : 'none';
        }

        this.deleteMode = state;
        this.showRecentDeleteCheck = state;
        this.showClearAllBtn = state;
        this.showClearSelectedBtn = false;
        this.itemsToDelete = [];
      },
      deleteRecentItem(index, content) {
        this.actDeleteRecentItem(content.contentId).then((response) => {
          switch (this.activeTitle) {
            case 'SHOWS':
            this.recentlyWatched.splice(index, 1);
            break;
            case 'MOVIES':
            this.recentlyWatched.splice(index, 1);
            break;
            case 'VIDEOS':
            this.recentlyWatched.splice(index, 1);
            break;
            default:
            break;
          }

          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.content_id = (content && content.id) ? content.id : 'N.A';
            eventAttributeObj.content_title = (content && content.title) ? content.title.toLowerCase() : 'N.A';
            eventAttributeObj.content_url = (content && content.stream && content.stream.streamUrl) ? content.stream.streamUrl : 'N.A';
            eventAttributeObj.content_type = (content && content.contentType) ? content.contentType : 'N.A';
            eventAttributeObj.event_action = 'remove';
            window.mobileAnalyticsClient.recordEvent('_content.recently-watched', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events

        }, (error) => {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.event_action = 'error';
            eventAttributeObj.event_message = error.message ? error.message : 'N.A';
            eventAttributeObj.event_code =  error.code ? error.code.toString() : '';
            window.mobileAnalyticsClient.recordEvent('_content.recently-watched', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events
        });
      },
      deleteAllRecent() {
        this.toggleLoader(true);

        this.actDeleteRecentItems().then((response) => {
          if (response.status && response.status == 'ok') {
            this.initRecentWatched();
          } else {
            this.toggleLoader(false);
          }
        }, (error) => {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.event_action = 'error';
            eventAttributeObj.event_message = error.message ? error.message : 'N.A';
            eventAttributeObj.event_code =  error.code ? error.code.toString() : '';
            window.mobileAnalyticsClient.recordEvent('_content.recently-watched', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events

          this.toggleLoader(false);
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          eventAttributeObj.event_action = 'ClearAll';
          window.mobileAnalyticsClient.recordEvent('_content.recently-watched', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      deleteSelectedRecent() {
        this.toggleLoader(true);

        if (!(this.itemsToDelete) || !(this.itemsToDelete.length)) {
          this.toggleLoader(false);
          return;
        }

        for (var i in this.itemsToDelete) {
          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.content_id = this.itemsToDelete[i].id;
            eventAttributeObj.content_type = this.itemsToDelete[i].type;
            eventAttributeObj.event_action = 'remove';
            window.mobileAnalyticsClient.recordEvent('_content.recently-watched', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events

          this.actDeleteRecentItem(this.itemsToDelete[i].id).then((response) => {
            // console.log('[deleteSelectedRecent | response |]', response);
          }, (error) => {
            // console.log('[deleteSelectedRecent | error |]', error);
          });
        }

        var checkboxes = document.getElementsByClassName('rcnt-del-check');
        var checkedBoxes = new Array();

        var checkIndexes = new Array();
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            checkIndexes.push(i);
          }
        }

        for (var key in checkIndexes) {
          delete this.recentlyWatched[checkIndexes[key]];
        }

        this.setRecentlyWatched(this.recentlyWatched.filter((item) => {
          return item;
        }));

        eventBus.$emit('toggleRecentDeleteModeEvent', false);
        this.itemsToDelete = [];

        setTimeout(() => {
          this.initRecentWatched();
        }, 2000);
      },
      getProgressText(progress) {
        return (progress == 100) ? 'WATCHED' : 'WATCHING';
      },
      watchItemsToDeleteCB(items) {
        if (items && items.length) {
          this.showClearAllBtn = false;
          this.showClearSelectedBtn = true;
        } else {
          this.showClearAllBtn = true;
          this.showClearSelectedBtn = false;
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
      stuffRecentlyWatchedAttributes( action, contentNode) {
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
      popupDeleteVideoCB(state) {
        this.showPopupDeleteVideo = false;
        // console.log("reached");
        if(this.deleteButtonType) {
          if (this.deleteButtonType == 'SELECTED') {
            this.deleteSelectedRecent();
          } else {
            this.deleteAllRecent();
          }
        }
      },
    },
    created() {
      this.setRecentPageHeader();

      eventBus.$on('popupDeleteVideoEventRecent', this.popupDeleteVideoCB);
      eventBus.$on('togglePopupDeleteVideoRecent', (state) => { this.showPopupDeleteVideo = state; });
      eventBus.$on('toggleVideoDeleteConformationPopupEvent', (state) => { this.showPopupDeleteVideo = state; });
      eventBus.$on('toggleCreateKidsPinEvent', (state) => {
        this.showCreateKidsPin = state;

        if (!state) {
          this.$router.push({ name: 'home' });
        }
      });
      eventBus.$on('toggleRecentDeleteModeEvent', this.toggleRecentDeleteModeCB);

      var pageTitle = "Recently Watched";
      if (localStorage.getItem('altOrder')) {
        this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        // var menuSelectAttributes = this.getAWSMACommonAttributes();
        // menuSelectAttributes.page_title = pageTitle;
        // menuSelectAttributes.section_id = 'N.A';
        // window.mobileAnalyticsClient.recordEvent('_menu.select', menuSelectAttributes, {});
        //
        // var pageSelectAttributes = this.getAWSMACommonAttributes();
        // pageSelectAttributes.page_title = pageTitle;
        // pageSelectAttributes.page_url = window.location.href;
        // window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
      }
      // End of AWS Mobile SDK Events

      if (this.appActive) {
        this.initRecentWatched();
      }
    },
    mounted() {
      this.toggleLoader(true);
      eventBus.$emit('toggleVideoBlockPopupEvent', false);
    },
    components: {
      'recent-header': Header,
      'alt-modals': Modals,
      'popup-delete-video':PopupVideoDeleteConformation,
    },
    beforeRouteEnter: (to, from, next) => {
      var recentDeleteIco = document.getElementById('delete-ico');
      if (recentDeleteIco) {
        recentDeleteIco.removeEventListener('click', this.recentDeleteIcoClickCB);
      }
      // console.log("RecentlyWatched.vue | check");

      var recentCloseDeleteIco = document.getElementById('header-close-ico-default');
      if (recentCloseDeleteIco) {
        recentCloseDeleteIco.removeEventListener('click', this.recentCloseDeleteIcoClickCB);
      }

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
      eventBus.$off('toggleVideoDeleteConformationPopupEvent');
      eventBus.$off('toggleVideoDelete');
      eventBus.$off('popupDeleteVideoEventRecent');
    },
    mixins: [altMixins]
  }
</script>
