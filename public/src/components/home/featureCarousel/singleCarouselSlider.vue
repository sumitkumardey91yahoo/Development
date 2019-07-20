<template>
  <div style="width:100%" v-if ="singleSlider && singleSlider.carousel">
    <p v-if="singleSlider.comingSoon" class="alt-tag comingSoonPosition">Coming Soon</p>
    <div class="carousel">
      <div class="row">
        <div class="col-xs-4">
          <img src='src/assets/home/favIcon.png' class='home-icons' alt ="home-icon" v-if="favouriteItem"   @click="removeFromFavourite"/>
          <img src='src/assets/home/nonFavIcon.png' class='home-icons'  alt ="home-icon" v-else @click="addToFavourite" />
        </div>
        <div class="col-xs-4">
          <button type='button' class='btn carousel-button'>
            <div class='home-play-icon-listing' @click="playCarouselItem(singleSlider)">
              <img src='src/assets/home/btn_Play.png' class='home-icon' alt ="home-icon" />
              <div class='home-play-icon'>play</div>
            </div>
          </button>
        </div>
        <div class="col-xs-4">
          <img src='src/assets/home/btn_info.png' class='home-icons' alt ="home-icon"  @click="detailsPageRedirection(singleSlider)"/>
        </div>
      </div>
    </div>
    <img v-if ="singleSlider && singleSlider.carousel" :src="singleSlider.carousel" alt='feature-carousel' @click="detailsPageRedirection(singleSlider)">
  </div>
</template>
<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { setHasBts } from '../../../store/mutations';
export default {
  data() {
    return {
      slider:undefined,
      classObject: {
        'height':screen.width * 1.085 + "px",
      },
      favouriteItem:false,
      contentType:undefined,
      favCheckId:undefined,
      playbackItemInfo:undefined,
      vContain:undefined,
      contentName:undefined,
      contentId:undefined,
    };
  },
  props:['singleSlider'],
  methods : {
    ...mapMutations([
      'setHasBts',
      'setPlayerScreenSource',
    ]),
    ...mapActions([
      'actCheckinFavouriteSeries',
      'actCheckinFavouriteMedia',
      'actDeleteFavouriteSeries',
      'actDeleteFavouriteMedia',
      'actAddtoFavouriteSeries',
      'actAddtoFavouriteMedia',
      'actGetMediaSeries',
      'actGetMediaVideo',
      'actGetEpisodes',
    ]),
    bannerClick(e,item) {
      if(e && e.target && !e.target.className) {
        if(item && item.contentName && item.id) {
          var routerObj = {
            name: item.contentName,
            params: {
              id: item.id
            }
          };
          this.$router.push(routerObj);
        }
      }
    },
    playCarouselItem(item) {
      /* if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        var deviceOrientation = this.getDeviceOrientation();

        eventAttributeObj.event_action = 'play';
        eventAttributeObj.event_mode = deviceOrientation;
        eventAttributeObj.content_id = item.id ? item.id : 'N.A';
        eventAttributeObj.content_streamid = item.stream ? item.stream.streamId : 'N.A';
        eventAttributeObj.content_title = item.title ? item.title.toLowerCase() : 'N.A';
        eventAttributeObj.content_url = location.href;
        eventAttributeObj.content_type = item.contentType ? item.contentType : 'N.A';
        eventAttributeObj.content_duration
        eventAttributeObj.event_source = this.$route.name

        window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, {});
      } */

      // NOTE: CODE CHANGE @SANGEETH - Issue #1041
      this.setPlayerScreenSource('CAROUSEL');
      // NOTE: END OF CODE CHANGE @SANGEETH

      // @sumit for event source playback
      localStorage.setItem('event_source', this.$route.name + '_carousal');

      // Show the loader to fetch the media/series API
      this.toggleLoader(true);

      // Get the content type and id
      this.contentName = item.contentName;
      this.contentId = item.id;
      // Emit an event to player to display the player screen
      eventBus.$emit("togglePlayerScreenFlagEnable", true);
      // Make the browser into fullscreen mode
      this.makeFullscreen();

      // Defining the media API fetch method
      const fetchMediaAPIcall = () => {
        if (this.contentName === 'show') {
          this.actGetMediaSeries(this.contentId).then(response => {
            // Get the seasons data
            let seasons = response.seasons;
            // If seasons are not there, there is no point of continuing
            if (!(seasons && seasons.length)) return;
            // Get the season id
            let seriesId = this.contentId;
            let seasonId = seasons[0].id;
            let limit = 20;
            let offset = 0;

            let altUser;
            if (localStorage.getItem('altUser')) {
              altUser = true;
            }

            this.actGetEpisodes({ seriesId, seasonId, limit, offset }).then(response => {
              let mediaIndex = 0;


              if (altUser && localStorage.getItem('mediaProgressList')) {
                let mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));

                if (mediaProgressList && mediaProgressList.length) {
                  let lastPlayedMediaId = mediaProgressList[0].media_id;

                  for (var i in response.episodes) {
                    if (response.episodes[i].media_id == lastPlayedMediaId) {
                      mediaIndex = i;
                      break;
                    }
                  }
                }
              }

              // Got the episode under episodes array, which will have only one episode as we set the limit to 1 as parameter
              let episode = this.parseContents(response.episodes[mediaIndex]);

              // Finally emit an event to playerscreen to play the content
              eventBus.$emit("toggleSendDataToPlayerScreen", episode);
            }, (error) => {

            });
          }).catch(error => {
          });
        } else if (this.contentName === 'media' || this.contentName === 'episode') {
          this.actGetMediaVideo(this.contentId).then(response => {
            // Parse the media info
            let media = this.parseContents(response);
            // Emit an event to playerscreen to play the content
            eventBus.$emit("toggleSendDataToPlayerScreen", media);
          }).catch(error => {
          });
        }
      }

      // Check whether browser supports orientation or not
      window.screen.orientation.lock('landscape').then(response => {
        fetchMediaAPIcall();
      }).catch(error => {
        fetchMediaAPIcall();
      });
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
    makeFullscreen() {
      let vContain = document.getElementById('v-contain');
      // If element is not present in the DOM, exit
      if (!vContain) return;

      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (vContain.requestFullscreen) {
          vContain.requestFullscreen();
        } else if (vContain.msRequestFullscreen) {
          vContain.msRequestFullscreen();
        } else if (vContain.mozRequestFullScreen) {
          vContain.mozRequestFullScreen();
        } else if (vContain.webkitRequestFullscreen) {
          vContain.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
    },
    landscapeRotation() {
      let _this = this;
      screen.orientation.lock('landscape').then((response) => {
        if (this.contentName === 'show') {
          this.actGetMediaSeries(this.contentId).then(response => {
            // Get the latest episode from the response
            let latest_episode = response.latest_episode;
            // If no latest episode, exit
            if (!latest_episode) return;
            // Parse the episode info
            let episode = this.parseContents(latest_episode);

            eventBus.$emit("toggleSendDataToPlayerScreen", episode);
          }).catch(error => {
          });
        } else if (this.contentName === 'media' || this.contentName === 'episode') {
          this.actGetMediaVideo(this.contentId).then(response => {
            // Parse the media info
            let media = this.parseContents(response);
            eventBus.$emit("toggleSendDataToPlayerScreen", media);
          }).catch(error => {
          });
        }
      }, (error) => {
      });
    },
    detailsPageRedirection(item) {
      if (window.mobileAnalyticsClient) {

        let page_info = (item.contentName && item.contentName == 'show') ? 'show details' : 'movie details';
        let route = this.$route.name

        let event_source = (route === 'movies') ? 'movie' : (route === 'shows') ? 'show' : route;

        var eventAttributeObj = this.getAWSMACommonAttributes();
        localStorage.setItem('event_source', event_source + '_carousal');

        eventAttributeObj.page_url = location.href + item.contentName + "/" + item.id;
        eventAttributeObj.page_title = page_info;
        eventAttributeObj.content_id = item.id ? item.id : 'N.A';
        eventAttributeObj.content_type = page_info;
        eventAttributeObj.content_title = item.title ? item.title.toLowerCase() : 'N.A';
        eventAttributeObj.event_source = event_source + '_carousal'

        window.mobileAnalyticsClient.recordEvent('_page.view', eventAttributeObj, {});
      }

      if(item && item.bts) {
        this.setHasBts(item.bts)
      }

      var routerObj = {
        name: item.contentName,
        params: {
          id: item.id
        }
      };
      this.$router.push(routerObj);
    },
    removeFromFavourite() {
      let contentName = this.singleSlider.contentName;

      if (contentName == 'media' || contentName == 'episode') {
        this.actDeleteFavouriteMedia(this.favCheckId).then((response) => {
          this.favouriteItem = false;
        }, (error) => {
        });
      } else if (contentName == 'show') {
        this.actDeleteFavouriteSeries(this.favCheckId).then((response) => {
          this.favouriteItem = false;
        }, (error) => {
        });
      }
    },
    checkFavourite() {
      if(!localStorage.getItem('altUser')) {
        return;
      }

      // NOTE: CODE UPDATE @SANGEETH
      // If singleSlider prop doesnot exists, return
      if (!this.singleSlider) return;
      // Get the content name from singleSlider prop
      let contentName = this.singleSlider.contentName;
      // Assign the favourite check ID
      this.favCheckId = this.singleSlider.id;
      if (contentName === 'show') {
        this.checkFavouriteSeries();
      } else if (contentName === 'media' || contentName === 'episode') {
        this.checkFavouriteMedia();
      }
      // NOTE: END CODE UPDATE @SANGEETH

      // NOTE: CODE NEED TO BE REMOVED
      // NOTE: CODE CHANGE COMMENTED @SANGEETH
      // this.contentType = this.singleSlider.contentType;
      //
      // if (this.contentType == 'series' || this.contentType == 'standup' || this.contentType == 'poster') {
      //   this.favCheckId = this.singleSlider.seriesId;
      // } else if (this.contentType == 'trailer') {
      //   this.favCheckId = this.singleSlider.contentId;
      // } else if (this.contentType == 'episode') {
      //   if (this.singleSlider.mediaId) {
      //     this.favCheckId = this.singleSlider.mediaId;
      //   } else {
      //     this.favCheckId = this.singleSlider.contentId;
      //   }
      // } else {
      //   this.favCheckId = this.singleSlider.contentId;
      // }
      //
      // if (this.contentType == 'series' || this.contentType == 'standup') {
      //   this.checkFavouriteSeries();
      // } else {
      //   this.checkFavouriteMedia();
      // }
      // NOTE: END CODE CHANGE COMMENTED @SANGEETH
    },
    checkFavouriteMedia() {
      this.actCheckinFavouriteMedia(this.favCheckId).then((response) => {
        if (response.status && response.status == 'ok') {
          this.favouriteItem = true;
        } else {
          this.favouriteItem = false;
        }
      }, (error) => {
        this.favouriteItem = false;
      });
    },
    checkFavouriteSeries() {
      this.actCheckinFavouriteSeries(this.favCheckId).then(response => {
        if (response.status && response.status == 'ok') {
          this.favouriteItem = true;
        } else {
          this.favouriteItem = false;
        }
      }, (error) => {
      });
    },
    addToFavourite() {
      if (localStorage.getItem('altUser')) {
        let contentName = this.singleSlider.contentName;

        if (contentName == 'media' || contentName == 'episode') {
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
          });
        } else if (contentName == 'show') {
          this.actAddtoFavouriteSeries(this.favCheckId).then(response => {
            this.favouriteItem = true;
          }, error => {
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
          });
        }
      } else {
        eventBus.$emit('togglePlayerFavSigninPopupEvent', true);
      }
    },
  },
  mounted() {
    this.checkFavourite();
  },
  mixins: [altMixins]
}
</script>
