<template>
  <div class="container">
    <div class="feat-card" v-if="episodes && episodes.length" v-for="item in episodes" @click="getContentToPlay(item)">
      <div class="detail" v-if="item">
        <p v-if="item.progress" class="alt-tag">
          <span v-if="item.progress != 100">watching</span>
          <span v-else>watched</span>
        </p>
        <h2 v-if="item.title">{{item.title}}</h2>
        <ul class="info-tags">
          <li v-if="!item.noShow">Episode {{item.episodeNumber}}</li>
          <li v-if="item.duration">{{item.duration}}</li>
          <li v-if="item.mainLanguage">{{item.mainLanguage}}</li>
        </ul>
      </div>
      <img v-if="item && item.images && item.images.cover" :src="item.images.cover" alt="alt-cover">
      <img v-else src="../../assets/alt-cover.jpg" alt="alt-cover">
      <div v-if="item && item.progress && item.progress != 100" class="line-progress">
        <div class="progress" :style="{ width: item.progress + '%' }"></div>
      </div>
      <div v-else class="color-line sm"></div>
    </div>

    <KidsPlayer v-show="togglePlayer"></KidsPlayer>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';
const KidsPlayer = () => import (
  /* webpackChunkName: "home-Home-KidsPlayer */
  '@/components/player/KidsPlayer.vue'
);

const PlayerScreen = () => import (
  /* webpackChunkName: "home-Home-PlayerScreen */
  '@/components/player/PlayerScreen.vue'
);

export default {
  data() {
    return {
      id: undefined,
      seasonId: undefined,
      limit: 50,
      offset: 0,
      episodes: undefined,
      episodesArr: new Array(),
      episodeCount: 0,
      togglePlayer: false
    };
  },
  methods: {
    ...mapActions([
      'actGetMediaSeries',
      'actGetSeasons',
      'actGetAllEpisodes',
    ]),
    initPlayerScreenKidsShow() {
      // console.log('[PlayerScreenKidsShow | initPlayerScreenKidsShow | ]');

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.getItem('altProfileMode', altProfileMode);
      }

      if (altProfileMode != 'kids') return;

      var routeName = this.$route.name;

      if (routeName != 'show') return;

      this.id = this.$route.params.id;

      this.getSeriesInfo();

      // this.getSeasonInfo();
    },
    getSeriesInfo() {
      this.actGetMediaSeries(this.id).then((response) => {
        let series = this.parseContents(response);

        // console.log('[KidsDetails | actGetMediaSeries | series]', series);

        if (!series.kidsContent) {
          this.$router.replace({ name: 'home' });
          
          return;
        }

        if (response.titles && response.titles.en) {
          // console.log('[KidsDetails | actGetMediaSeries | title | ]', response.titles.en);

          this.setHeaderTitle(response.titles.en);
        }

        this.getSeasonInfo();
      }, (error) => {
        // console.log('[KidsDetails | actGetMediaSeries | error | ]', error);
      });
    },
    getSeasonInfo() {
      this.actGetSeasons(this.id).then((response) => {
        if (response.seasons && response.seasons.length) {
          // console.log('[KidsDetails | getSeasons | seasons | ]', response.seasons);

          this.seasonId = response.seasons[0].id;
          this.getAllEpisodes();
        }
      }, (error) => {
        // console.log('[Seasons | getSeasons | error]', error);
      });
    },
    getAllEpisodes() {
      this.actGetAllEpisodes({
        seriesId: this.id,
        seasonId: this.seasonId,
        limit: this.limit,
        offset: this.offset
      }).then((response) => {
        if (!response.count) return;

        this.episodesArr = this.episodesArr.concat(response.episodes);
        this.episodeCount += response.episodes.length;

        if (response.count > this.episodeCount) {
          this.offset += this.limit;
          this.getAllEpisodes();
        } else {
          var episodesArr = new Array();
          var mediaProgressList = undefined;
          if (localStorage.getItem('mediaProgressList')) {
            mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
          }

          for (var i in this.episodesArr) {
            let episode = this.parseContents(this.episodesArr[i]);

            if (mediaProgressList) {
              for (var j in mediaProgressList) {
                if (mediaProgressList[j].media_id == episode.id) {
                  episode.progress = mediaProgressList[j].progress;
                  break;
                } else {
                  episode.progress = undefined;
                }
              }
            }

            episodesArr.push(episode);
          }

          this.episodes = episodesArr;

          this.toggleLoader(false);
        }
      }, (error) => {
        // console.log('[KidsDetails | getAllEpisodes | error | ]', error);
        this.toggleLoader(false);
      });
    },
    getContentToPlay (item) {
      this.contentToSend = item;

      // NOTE: CODE CHANGE @SANGEETH - Issue #860 RESOLVED
      this.checkScreenRotationType();
      // NOTE: END CODE CHANGE @SANGEETH - Issue #860 RESOLVED

      // NOTE: NEW CODE CHANGE @SANGEETH
      // eventBus.$emit("toggleSendDataToPlayerScreen", item);
      // NOTE: END NEW CODE CHANGE @SANGEETH
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
        eventBus.$emit("toggleSendDataToPlayerScreen", this.contentToSend);
      },(error) => {
        // console.log("landscapeRotation",error);

        // NOTE: CODE CHANGE @SANGEETH - Issue #860 RESOLVED
        eventBus.$emit("toggleSendDataToPlayerScreen", this.contentToSend);
        // NOTE: END CODE CHANGE @SANGEETH - Issue #860 RESOLVED
      });
    },
    togglePlayerScreenCB (state) {
      this.togglePlayer = state;
    }
  },
  created() {
    eventBus.$on('toggleSendDataToPlayerScreen', this.togglePlayerScreenCB);
    eventBus.$on('togglePlayerScreenEvent', this.togglePlayerScreenCB);

    this.initPlayerScreenKidsShow();
  },
  beforeDestroy() {
    // NOTE added by sumit for destroy,
    eventBus.$off('toggleSendDataToPlayerScreen', this.togglePlayerScreenCB);
    eventBus.$off('togglePlayerScreenEvent', this.togglePlayerScreenCB);
  },
  components: {
    KidsPlayer
  },
  mixins: [altMixins]
}
</script>
