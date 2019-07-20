<template>
    <div class="flow-box">
        <ul v-show="searchResults" class="search-results">
            <li v-for="(result, index) in searchResults" @click="playSearchItem(index)">{{result.title}}</li>
        </ul>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
      return {
        playbackItemInfo:undefined,
      }
    },
    computed: {
        ...mapGetters([
            'searchResults'
        ]),
    },
    methods: {
        ...mapMutations([
            'setPlayerContent',
        ]),
        playSearchItem(index) {
          // console.log('[Search | playSearchItem | item | ]', index);

          // For AWS Mobile SDK Events
          localStorage.setItem('AWSMA_content_source', 'search');

          // @sumit for event source playback
          localStorage.setItem('event_source', 'search');

          var selectedItem = this.searchResults[index];
           // console.log("selectedItem",selectedItem);
          this.setPlayerContent(selectedItem);


          if (selectedItem.contentName == 'episode') {
            this.playbackItemInfo = selectedItem;
            eventBus.$emit("togglePlayerScreenFlagEnable",true);
            this.checkScreenRotationType();
            // eventBus.$emit("toggleSendDataToPlayerScreen",selectedItem);
          } else {
            var routerObj = {
              name: selectedItem.contentName,
              params: {
                id: selectedItem.id
              }
            };
            // For AWS Mobile SDK Events
            localStorage.setItem('AWSMA_content_source', 'search');

            // @sumit for event source playback
            localStorage.setItem('event_source', 'search');

            eventBus.$emit('closeSearchEvent');
            eventBus.$emit('togglePopupSearch', false);
            this.$router.push(routerObj);
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
      },
    mixins: [altMixins]
}
</script>
