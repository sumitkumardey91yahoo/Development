<template>
  <div class="trailer-info">
    <ul class="trailer-btn-icon" v-if="playerContent">
      <span id="lang" @click="showLanguageFilterBox" :class="{more: showLangFilBtn}">
        Language: {{currentLanguage}}
      </span>

      <template v-if="userLoggedIn">
        <li v-if="isFavouriteItem"><img class="fav-img" src="../../assets/fav.svg" @click="removeFromFavourite" alt='fav-img'></li>
        <li v-else><img class="fav-img" src="../../assets/fav-o.svg" @click="addToFavourite" alt='fav-img'></li>
      </template>
      <li v-else><img class="fav-img" src="../../assets/fav-o.svg" @click="addToFavouriteLogin" alt='fav-img'></li>
      <li><img class="share-img" src="../../assets/share.svg" @click="showSharing" alt='fav-img'></li>
    </ul>

    <ul class="info-tags" v-if="playerContent">
      <!-- <li v-show="playerContent.seasonNumber && !playerContent.noShow">S{{playerContent.seasonNumber}}</li>
      <li v-show="playerContent.episodeNumber && !playerContent.noShow">E{{playerContent.episodeNumber}}</li> -->
      <!-- If the content type is show, then hide the element -->
      <!-- <li v-if="playerContent.contentTitle && playerContent.contentTitle != 'Show'">{{playerContent.contentTitle}}</li> -->
      <!-- <li v-if="playerContent.duration && !playerContent.noShow">{{playerContent.duration}}</li> -->
      <!-- added by sumit comedy section duration not coming-->
      <!-- <li v-if="playerContent.duration">{{playerContent.duration}}</li> -->
      <!-- <li v-if="playerContent.contentTitle == 'Poster'">0s</li> -->
      <li v-if="playerContent.age_limit">{{playerContent.age_limit}}</li>
      <li v-if="playerContent.categories && playerContent.categories.length">{{playerContent.categories.join(', ')}}</li>
      <li v-if="playerContent.mainLanguage">{{playerContent.mainLanguage}}</li>
    </ul>
    <ul class="action-list">
      <li>
        <button class="more-det-btn" @click="showMoreDetails">More Details</button>
        <button class="detail-btn reviews-btn" v-if="reviews" @click="redirToReviews()"><img src="../../assets/player/v2/btn_icon_reviews.png" alt='btn_icon_reviews'> Reviews</button>
        <button class="detail-btn trailer-btn" @click.stop="playTrailer" v-if="isHideTrailerButton"> <img src="../../assets/player/v2/btn_trailer_play.png" alt='btn_trailer_play'> Trailer</button>
      </li>

    </ul>
    <ul>
      <li>
        <button
          type="button"
          class="btn grad-btn watch-btn"
          @click="detailPlayButton">
          {{playerButtonText}}
        </button>
      </li>
    </ul>
  </div>
</template>

  <script>
  import { eventBus } from '../../main';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { altMixins } from '../../mixins';

  export default {
    data() {
      return {
        contentType: undefined,
        favCheckId: undefined,
        favouriteItem: undefined,
        trailerAvailable: false,
        trailerDisabled: false,
        streamAvailable: false,
        streamButtonState: undefined,
        switchButtons: false,
        showLangFilBtn: false,
        altUser: undefined,
        altOrder: undefined,
        playerButtonText:undefined,
        selectedContent: undefined,
        reviews:undefined,
        isHideTrailerButton: false
      }
    },
    computed: {
      ...mapGetters([
        'appActive',
        'playerContent',
        'userLoggedIn',
        'showMovieButton',
        'currentLanguage',
        'currentShowPlaylists',
        'showTrailerInfo'
      ]),
      isFavouriteItem() {
        return this.favouriteItem;
      },
    },
    watch: {
      playerContent() {
        this.initDetailButtons();
        this.fetchReviews()
      },
      currentShowPlaylists() {
        this.setContentInfoButton();
      },
      showTrailerInfo() {
        // NOTE added by sumit for get language part.
        if (this.showTrailerInfo && this.showTrailerInfo.languageObj) {
          this.showLangFilBtn = true;
          this.setAvailLanguages(this.showTrailerInfo.languageObj);
        } else {
          this.showLangFilBtn = false;
        }
      }
    },
    methods: {
      ...mapMutations([
        'setUserLoggedIn',
        'setCurrentLanguage',
        'setAvailLanguages',
        'setRouterToParam',
        'setRouterFromParam',
        'setCurrentEpisodeInfo'
      ]),
      ...mapActions([
        'actGetReviews',
        'actCheckinFavouriteSeries',
        'actCheckinFavouriteMedia',
        'actDeleteFavouriteSeries',
        'actDeleteFavouriteMedia',
        'actAddtoFavouriteSeries',
        'actAddtoFavouriteMedia',
      ]),
      fetchReviews() {
        this.actGetReviews().then(response => {
          for (let rev of response.user_reviews) {
            if (this.playerContent && rev.media_id === Number(this.$route.params.id)) {
              this.reviews = rev.reviews;
            }
          }
        }, error => {
          // console.log('f error | ]', error);
        });
      },
      redirToReviews() {
        if(!this.playerContent) {
          return;
        }

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          let event_source = (this.$route.name && this.$route.name == 'media') ? 'movie details' : 'show details';

          eventAttributeObj.page_url = location.origin + '/reviews/' + this.playerContent.contentType + '/' + this.playerContent.title + '/' + this.playerContent.id;
          eventAttributeObj.page_title = 'reviews';
          eventAttributeObj.content_id = this.playerContent.id || 'N.A';
          eventAttributeObj.content_type = event_source;
          eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.event_source = event_source;

          window.mobileAnalyticsClient.recordEvent('_page.view', eventAttributeObj, {});
        }
        // @sumit added for unique value required
        var routerObj = {
          name: 'reviews',
          params: {
            id: this.$route.params.id,
            type: this.playerContent.contentType,
            title: this.playerContent.title
          }
        };
        this.$router.push(routerObj);
      },
      detailPlayButton() {
        localStorage.setItem('event_source', this.$route.name + '_detail');
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          var deviceOrientation = this.getDeviceOrientation();

          eventAttributeObj.event_action = this.playerButtonText
          eventAttributeObj.event_mode = deviceOrientation;
          eventAttributeObj.content_id = this.playerContent.id ? this.playerContent.id : 'N.A';
          eventAttributeObj.content_streamId = this.playerContent.stream ? this.playerContent.stream.streamId : 'N.A';
          eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_url = location.href;
          eventAttributeObj.content_type = this.playerContent.contentType ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.content_duration = this.playerContent.duration ? this.playerContent.duration : 'N.A';

          eventAttributeObj.event_source = this.$route.name + '_' + 'detail';

          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, {});
        }

        if(document.getElementById('v-loader')) {
          document.getElementById('v-loader').style.display = 'none';
        }

        // COMMENT FOR PRODUCTION
        // if(this.playerContent.contentName == 'show' || this.playerContent.contentName == 'episode') {
        //     this.setCurrentEpisodeInfo(this.selectedContent);
        //     eventBus.$emit('toggleSendDataToPlayerScreen',this.selectedContent);
        // } else {
        //   // making undefined
        //   this.selectedContent = undefined;
        //   eventBus.$emit('toggleSendDataToPlayerScreen',this.playerContent);
        // }

        // UNCOMMENT FOR PRODUCTION
        this.checkScreenRotationType();
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

        screen.orientation.lock('landscape').then((response) => {
          if(this.playerContent && (this.playerContent.contentName == 'show' || this.playerContent.contentName == 'episode' || this.playerContent.bts)) {

            this.setCurrentEpisodeInfo(this.selectedContent);
            eventBus.$emit("toggleSendDataToPlayerScreen", this.selectedContent);
          } else {
            this.selectedContent = undefined;
            eventBus.$emit("toggleSendDataToPlayerScreen", this.playerContent);
          }
        },(error) => {

          if(this.playerContent.contentName == 'show' || this.playerContent.contentName == 'episode' || this.playerContent.bts) {

            this.setCurrentEpisodeInfo(this.selectedContent);
            eventBus.$emit("toggleSendDataToPlayerScreen", this.selectedContent);
          } else {
            this.selectedContent = undefined;
            eventBus.$emit("toggleSendDataToPlayerScreen",this.playerContent);
          }

        });
      },
      showMoreDetails() {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          let event_source = (this.$route.name && this.$route.name == 'media') ? 'movie details' : 'show details';

          eventAttributeObj.event_action = 'open';
          eventAttributeObj.content_id = this.playerContent.id ? this.playerContent.id : 'N.A';
          eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_type = this.playerContent.contentType ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.content_streamId = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : 'N.A';
          eventAttributeObj.content_url = location.href;
          eventAttributeObj.event_mode = 'more_details';
          eventAttributeObj.event_source = event_source;

          window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
        }

        eventBus.$emit("toggleMoreDetailsPopupEvent",true);

        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }
      },
      setContentInfoButton() {
        this.playerButtonText = "Play";
        let mediaprogress = undefined;
        let user = null;
        user = localStorage.getItem('altUser') ? true : undefined;

        if(localStorage.getItem('mediaProgressList')) {
          mediaprogress = JSON.parse(localStorage.getItem('mediaProgressList'));
          // NOTE @sumit whatever last content,that we need to take first.Issue #791
          // mediaprogress.reverse();
        }

        if(this.playerContent && (this.playerContent.contentName == 'show' || this.playerContent.contentName == 'episode') && this.currentShowPlaylists && this.currentShowPlaylists.length) {
          this.selectedContent = this.currentShowPlaylists[0];
          if(!mediaprogress || !user) {
            return;
          }
          for(let lProgress in  mediaprogress) {
            for(let eProgress in this.currentShowPlaylists) {
              if(this.currentShowPlaylists[eProgress].id == mediaprogress[lProgress].media_id) {
                this.playerButtonText = "Resume";
                this.selectedContent = this.currentShowPlaylists[eProgress];
                return;
              }
            }
          }
          this.playerButtonText = "Play"
        } else {
          if(!mediaprogress) {
            return;
          }

          for(let lProgress in  mediaprogress) {
            if(this.playerContent.id == mediaprogress[lProgress].media_id) {
              this.playerButtonText = "Resume";
              return;
            }
          }
        }
      },
      initDetailButtons() {
        if (!this.playerContent) return;

        if (this.playerContent && this.playerContent.trailer) {
            this.isHideTrailerButton = true;
        }

        var altUser = localStorage.getItem('altUser') ? JSON.parse(localStorage.getItem('altUser')) : undefined;
        if (altUser && altUser.email) {
          this.setUserLoggedIn(true);
        }


        this.setContentInfoButton();

        this.setCurrentLanguage(this.playerContent.mainLanguage);

        // if (this.showTrailerInfo && this.showTrailerInfo.languageObj) {
        //   this.showLangFilBtn = true;
        //   this.setAvailLanguages(this.showTrailerInfo.languageObj);
        // } else {
        //   this.showLangFilBtn = false;
        // }

        this.switchButtons = false;
        this.contentType = this.playerContent.contentType;
        if (this.contentType == 'series' || this.contentType == 'standup') {
          this.seriesId = this.playerContent.seriesId;
        } else {
          this.contentId = this.playerContent.contentId;
        }

        if (this.contentType == 'trailer') {
          if (this.playerContent.stream || this.playerContent.trailer) {
            this.trailerAvailable = true;
          }
        }

        if (this.contentType == 'trailer' || this.contentType == 'series' || this.contentType == 'movie') {
          this.trailerDisabled = false;
          if (this.playerContent.trailer) {
            this.trailerAvailable = true;
          } else {
            this.trailerAvailable = false;
          }

          if (this.contentType == 'trailer' && this.playerContent.stream) {
            this.trailerAvailable = true;
          }

        } else {
          this.trailerAvailable = false;
        }

        if (this.contentType == 'movie') {
          if (altUser) {
            if (!(this.playerContent.isFreeContent || this.playerContent.userHasAccess)) {
              this.streamAvailable = false;
            }
          }
        }


        if (this.userLoggedIn) {
          this.checkFavourite();
        }
      },
      checkFavourite() {
        this.contentType = this.playerContent.contentType;

        if (this.contentType == 'series' || this.contentType == 'standup' || this.contentType == 'poster') {
          this.favCheckId = this.playerContent.seriesId;
        } else if (this.contentType == 'trailer') {
          this.favCheckId = this.playerContent.contentId;
        } else if (this.contentType == 'episode') {
          // if (this.playerContent.mediaId) {
          //   this.favCheckId = this.playerContent.mediaId;
          // } else {
          //   this.favCheckId = this.playerContent.contentId;
          // }
        } else {
          this.favCheckId = this.playerContent.contentId;
        }

        if (this.contentType == 'series' || this.contentType == 'standup' || this.contentType == 'episode') {
          this.checkFavouriteSeries();
        } else {
          this.checkFavouriteMedia();
        }
      },
      checkFavouriteMedia() {
        this.actCheckinFavouriteMedia(this.favCheckId).then(
        (response) => {
          if (response.status && response.status == 'ok') {
            this.favouriteItem = true;
          } else {
            this.favouriteItem = false;
          }
        },
        (error) => {
          this.favouriteItem = false;
        }
        )
      },
      checkFavouriteSeries() {
        this.actCheckinFavouriteSeries(this.favCheckId).then((response) => {
          if (response.status && response.status == 'ok') {
            this.favouriteItem = true;
          } else {
            this.favouriteItem = false;
          }
        }, (error) => {
        })
      },
      removeFromFavourite() {
        if (this.contentType == 'series' || this.contentType == 'standup' || this.contentType == 'episode') {
          this.actDeleteFavouriteSeries(this.favCheckId).then((response) => {
            this.favouriteItem = false;
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
          this.actDeleteFavouriteMedia(this.favCheckId).then((response) => {
            this.favouriteItem = false;
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

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : 'N.A';
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_url = window.location.href;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.event_action = 'remove';
          window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      addToFavourite() {
        if (this.contentType == 'series' || this.contentType == 'standup' || this.contentType == 'episode') {
          this.actAddtoFavouriteSeries(this.favCheckId).then((response) => {
            this.favouriteItem = true;
          }, (error) => {
            // If error code is 404, ie. "Media not available for domain row"
            if (error.code == 404) {
              // show the geo block popup
              eventBus.$emit('toggleGeoBlockEvent', true);
            } else {
              // show the add to favourite error message
              eventBus.$emit('toggleVideoAddToFavError',true);
            }

            eventBus.$emit('toggleVideoAddToFavErrorVideoPause',true);

            if(document.getElementById('alt-app')) {
              document.getElementById('alt-app').style.position = "fixed";
            }

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
          this.actAddtoFavouriteMedia(this.favCheckId).then((response) => {
            this.favouriteItem = true;
          }, (error) => {
            // If error code is 404, ie. "Media not available for domain row"
            if (error.code == 404) {
              // show the geo block popup
              eventBus.$emit('toggleGeoBlockEvent', true);
            } else {
              // show the add to favourite error message
              eventBus.$emit('toggleVideoAddToFavError',true);
            }

            eventBus.$emit('toggleVideoAddToFavErrorVideoPause',true);

            if(document.getElementById('alt-app')) {
              document.getElementById('alt-app').style.position = "fixed";
            }

            if (window.mobileAnalyticsClient) {
              var eventAttributeObj = this.getAWSMACommonAttributes();
              eventAttributeObj.error_code = error.code ? error.code.toString() : 'N.A';
              eventAttributeObj.error_message = error.message ? error.message : 'N.A';
              eventAttributeObj.event_action = 'error';
              window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events
          });
        }

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : 'N.A';
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_url = window.location.href;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.event_action = 'add';
          window.mobileAnalyticsClient.recordEvent('_content.favourite', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      addToFavouriteLogin() {
        eventBus.$emit('togglePlayerFavSigninPopupEvent', true);
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
      stuffFavouriteAttributes( action) {
        var eventAttributeObj = {}
        eventAttributeObj = this.stuffCommonAttributes();

        eventAttributeObj.content_id = localStorage.getItem('awsContentId');
        eventAttributeObj.content_title = localStorage.getItem('awsContentTitle').toLowerCase();
        eventAttributeObj.content_url = localStorage.getItem('awsContentUrl');
        eventAttributeObj.content_type = localStorage.getItem('awsContentType');
        eventAttributeObj.event_action = action;

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
      checkScreenRotationTypeTrailer() {
        if(('orientation' in screen)) {
          if (matchMedia('(orientation: portrait)').matches) {
            this.makeFullscreen(this.showTrailerRotation);
          } else {
            this.makeFullscreen(this.showTrailerRotation);
          }
        }
      },
      showTrailerRotation() {
        screen.orientation.lock('landscape').then((response) => {
           eventBus.$emit('playTrailerBtnClickEvent');
           console.log("this.playerContent", this.playerContent);
        },(error) => {
           eventBus.$emit('playTrailerBtnClickEvent');
            console.log("this.playerContent", this.playerContent);
        });
      },
      playTrailer() {
       
        this.checkScreenRotationTypeTrailer();
        
      },
      playMovie() {
        this.trailerDisabled = false;
        this.switchButtons = false;

        eventBus.$emit('playMovieBtnClickEvent');
      },
      showSharing() {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        eventBus.$emit('showSharingEvent');
      },
      showLanguageFilterBox() {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.event_action = 'open';
          eventAttributeObj.content_id = this.playerContent.id ? this.playerContent.id : 'N.A';
          eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_type = this.playerContent.contentType ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.content_streamid = this.playerContent.stream ? this.playerContent.stream.streamId : 'N.A';
          eventAttributeObj.content_url = location.href;
          eventAttributeObj.event_mode = this.currentLanguage;
          eventAttributeObj.event_source = this.$route.name;

          window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
        }

        if(this.showLangFilBtn) {
          if(document.getElementById('alt-app')) {
            document.getElementById('alt-app').style.position = "fixed";
          }
          eventBus.$emit('toggleLanguageFilterEvent', true);
        }
      },
      plrPlayingTrailerCB(state) {
        this.trailerDisabled = state;
      },
      plrPlayingMovieCB(state) {
        this.switchButtons = false;
        this.trailerDisabled = false;
      },
    },
    created() {
      eventBus.$on('playingTrailerEvent', () => {
        this.trailerDisabled = true;
      });
      eventBus.$on('hideTrailerButtonEvent', () => {
        this.trailerDisabled = true;
      });
      eventBus.$on('playingStreamEvent', () => {
        this.playStreamCB();
      });
      eventBus.$on('plrPlayingTrailerEvent', this.plrPlayingTrailerCB);
      eventBus.$on('plrPlayingMovieEvent', this.plrPlayingMovieCB);

      if (this.appActive && this.playerContent) {
        this.initDetailButtons();
      }

      if (localStorage.getItem('altUser')) {
        this.altUser = JSON.parse(localStorage.getItem('altUser'));
      }
      if (localStorage.getItem('altOrder')) {
        this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      eventBus.$on('DetailButtonChangeExitButtonChange',this.setContentInfoButton);
    },
    beforeDestroy() {
      eventBus.$off('playingTrailerEvent');
      eventBus.$off('playingStreamEvent');
      eventBus.$off('DetailButtonChangeExitButtonChange',this.setContentInfoButton);
    },
    beforeDestroy() {
      eventBus.$emit("closeMoreDetPopup");
    },
    mixins: [altMixins],
  }
</script>
