<template>
  <div class="alt-popup-bg">
    <div class="alt-signin popup-container">
      <div class="popup-box" style="width: 100%;top: 50%;left: 0%;">
        <div class="popup-bg">
          <h3 class="video-quality-header">Select Video Quality</h3>
          <div style="float:left;padding-left: 20px; width: 45%" v-if="playerVideoResolution">
            <label class="rdo-language" v-for="(resolution, i) in playerVideoResolution[0]" style="margin-top:23px">
              <span v-if="resolution.title" class="resolution-info">{{resolution.info}}</span>
              <p  v-if="resolution.info" class="resolution-title"> {{resolution.title}}</p>
              <input type="radio" name="radio_language"  :value="resolution.title" v-model="selectedItem" />
              <span class="checkmark" style="background-color:#4C4C4C;"></span>
            </label>
          </div>
          <div style="float:right;padding-right: 20px; width: 45%" v-if="playerVideoResolution">
            <label class="rdo-language" v-for="(resolution, i) in playerVideoResolution[1]" style="margin-top:23px">
              <span v-if="resolution.title" class="resolution-info"> {{resolution.info}}</span>
              <p  v-if="resolution.info" class="resolution-title">{{resolution.title}}</p>
              <input type="radio" name="radio_language"  :value="resolution.title" v-model="selectedItem" />
              <span class="checkmark" style="background-color:#4C4C4C;" ></span>
            </label>
          </div>
          <div style="clear:both;"></div>
          <button type="button" class="btn btn-lg video-resolution-done-button"  @click="setVideoTrack">DONE</button>
        </div>
      </div>
      <div class="alt-overlay" @click="closePopup"></div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            'selectedItem':'auto'
        }
    },
    computed: {
        ...mapGetters([
            'playerVideoResolution',
        ]),
    },
    methods: {
        closePopup() {
            // console.log("close resolution");
            eventBus.$emit("togglePlayerVideoResolution",false);
        },
        setVideoTrack() {
          // console.log("popupVideoResolutionChange.vue || setVideoTrack",this.selectedItem);
            for(let i in this.playerVideoResolution) {
                for(let j in this.playerVideoResolution[i]) {
                     // console.log("resolution",this.playerVideoResolution[i][j]);
                    if(this.playerVideoResolution[i][j].title == this.selectedItem) {
                          // console.log("popupVideoResolutionChange.vue >> setVideoTrack >> seleted value ",this.playerVideoResolution[i][j]);
                        this.selectedItem = this.playerVideoResolution[i][j].title;
                        eventBus.$emit("togglePlayerSetResolution",this.playerVideoResolution[i][j]);
                        break;
                    }
                }
            }
            eventBus.$emit("togglePlayerVideoResolution",false);
        }
    },
}
</script>
