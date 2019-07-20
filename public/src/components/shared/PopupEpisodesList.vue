<template>
  <div class="alt-popup-bg">
    <div class="alt-signin popup-container">
      <div class="popup-box-episode">
        <div class="popup-bg"  style="padding: 17px 27px;">
          <div class="season-title" @click="seasonListing(true)">
            <span style="padding-right: 4px;">Season {{seasonNumber}}</span>
            <div class="arrow-down"></div>
          </div>
          <div id="listingEpisodeBody" v-show="popupPlaylist" class="related-mvi" style="border-top: 3px solid red;">
          <div class="mvi-data-episode-list" v-for="(item, index) in popupPlaylist" @click="selectEpisodeList(item)">
            <div class="mvi-img-deatils" style="width:33%;text-align: center;">
              <img v-if="item.images.cover" :src="item.images.cover">
              <img v-else src="../../assets/alt-cover.jpg">
              <div v-if="item.progress && item.progress != 100" class="line-progress">
                <div class="progress" :style="{ width: item.progress + '%' }"></div>
              </div>
              <div v-else class="color-line sm"></div>
              <img src="../../assets/player/play.svg" class="play-icon-on-player">
            </div>
            <div class="mvi-details" style="text-align:left;width: auto; padding-top: 1px;">
              <h3 class="mvi-name" style="padding-bottom: 6px;">E{{item.episodeNumber}}: {{item.title}}</h3>
              <ul>
                <li v-if="item.duration" style="opacity: 0.2;font-size: 13px;">{{item.duration}}</li>
              </ul>
              <span v-show="item.mediumDescription" style="opacity:0.7">{{shortString(item.mediumDescription)}}</span>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div class="alt-overlay" @click="closePopup"></div>
</div>

<div class="season-popup" id="season-popup" style="display:none;z-index:9999">
  <ul>
    <li>SEASON 1 <span class="li-ico">&#10004;</span></li>
  </ul>
  <div class="popup-overlay" @click="hideSeason"></div>
</div>
</div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      // Defined in player.js store module. Used to store the playlist episodes
      // NOTE: NEED TO BE REMOVED AFTER REVIEW. CODE CHANGE FOR #834.
      'relatedEpisodes',
      // NOTE: CODE CHANGE FOR #834.
      'popupPlaylist',
      'seasonNumber',
    ]),
  },
  methods: {
    ...mapMutations([
      'setPlayerContent',
      'setCurrentEpisodeInfo'
    ]),
    seasonListing(isShow) {
      // var seasonPopup = document.getElementById('season-popup');
      // if (isShow) {
      //   document.body.scrollTop = document.documentElement.scrollTop = 0;
      //   document.body.style.position = 'fixed';
      //   seasonPopup.style.display = 'block';
      // } else {
      //   document.body.style.position = 'relative';
      //   seasonPopup.style.display = 'none';
      // }
    },
    hideSeason() {
      this.seasonListing(false);
    },
    closePopup() {
      eventBus.$emit("toggleEpisodelistPopup",false);
    },
    shortString(mediumDescription) {
      if(mediumDescription.length > 50) {
        return mediumDescription.substring(0,50) + "...";
      } else {
        return mediumDescription;
      }
    },
    selectEpisodeList(element) {
      //  this.setPlayerContent(element);

      localStorage.setItem('event_source','player');

      eventBus.$emit("toggleEpisodelistPopup",false);

      // current epsode info we are sending to setter.
      this.setCurrentEpisodeInfo(element);
      // NOTE added by sumit for episode list popup
      eventBus.$emit("toggleSendDataToPlayerScreenForEpisodeList", element);
    },
  }
}
</script>
