<template>
  <div>
    <nav class="top-menu">
      <a  class="scroll-menu" v-for="nav in sectionNav" :class="navSectionClass(nav)" @click="getSectionContents(nav)">{{nav}}</a>
    </nav>
    <div class="flow-container" v-if="searchFilterResults">
      <div class="mvi-data" v-for="(result, index) in searchFilterResults">
        <div class="mvi-item" @click="playSearchItem(index)">
          <div class="mvi-img-sec">
            <img :src="result.images.cover" class="mvi-img">
            <!-- NOTE added sumit for brandline -->
            <div v-if="result.progress && result.progress != 100" class="line-progress">
              <div class="progress" :style="{ width: result.progress + '%' }"></div>
            </div>
            <div v-else class="color-line"></div>
          </div>
          <div class="mvi-detail-sec">
            <h3 v-if="result.title">{{result.title}}</h3>
            <ul class="info-tags">

              <li v-if="result.seasonNumber && !result.noShow">S{{result.seasonNumber}}</li>
              <li v-if="result.episodeNumber && !result.noShow">E{{result.episodeNumber}}</li>
              <li v-if="result.duration">{{result.duration}}</li>
              <li v-if="result.mainLanguage">{{result.mainLanguage}}</li>
            </ul>
            <!-- NOTE added sumit for contentName and free tag -->
            <p v-if="result.comingSoon" class="alt-tag">Coming Soon</p>
            <p class="alt-tag alt-search-tag" v-show="getIsFreeTag(result) && !(result.progress)">FREE</p>
            <p class="alt-tag alt-search-tag" v-show="result.contentTitle && showTypeTag">{{makeTitleChange(result)}}</p>
            <!-- <p class="alt-tag alt-search-tag" v-show="getTypeTag(result) && showTypeTag">{{getTypeTag(result)}}</p> -->
            <p v-if="result.progress" class="alt-tag">
              <span v-if="result.progress != 100">watching</span>
              <span v-else>watched</span>
            </p>

          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="v-center-box" v-if="setSearchFilterResults && setSearchFilterResults.length">
      <h3>No results found</h3>
    </div>
  </div>
</template>
<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      sectionNav: ['ALL', 'SHOWS', 'MOVIES', 'VIDEOS'],
      activeNav: undefined,
      showTypeTag: true,
      altOrder: undefined,
      playbackItemInfo:undefined,
    }
  },
  computed: {
    ...mapGetters([
    'searchResults',
    'searchFilterResults',
    ]),
  },
  methods: {
    ...mapMutations([
    'setSearchResults',
    'setPlayerContent',
    'setSearchFilterResults',
    ]),
    ...mapActions([
    'actSearchQuery',
    ]),
    makeTitleChange(name) {
      if (name.contentType == 'video') {
        return 'Video'
      } else {
        return name.contentTitle;
      }
    },
    playSearchItem(index) {
      // console.log('[SearchTemp | playSearchItem | item | ]', this.searchResults[index]);
      // For AWS Mobile SDK Events
      localStorage.setItem('AWSMA_content_source', 'search');

      // @sumit for event source playback
      localStorage.setItem('event_source', 'search');

      var selectedItem = this.searchFilterResults[index];
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
    navSectionClass(nav) {
      return (nav == this.activeNav) ? 'active' : '';
    },
    getSectionContents(nav) {
      // console.log('[SearchTemp | getSectionContents | nav | ]', nav);
      // console.log('[SearchTemp | getSectionContents | searchResults | ]', this.searchResults);

      var filterResults = undefined;

      switch (nav) {
        case 'ALL':
        this.activeNav = 'ALL';
        this.showTypeTag = true;
        filterResults = this.searchResults;

        // console.log('[SearchTemp | getSectionContents | showTypeTag | ]', this.showTypeTag);
        break;
        case 'SHOWS':
        this.activeNav = 'SHOWS';
        this.showTypeTag = false;
        filterResults = this.searchResults.filter((result) => {
          return (result.contentType == 'episode')
        });
        // console.log('[SearchTemp | getSectionContents | SHOWS | ]', filterResults);
        break;
        case 'MOVIES':
        this.activeNav = 'MOVIES';
        this.showTypeTag = false;
        filterResults = this.searchResults.filter((result) => {
          return (result.contentType == 'movie')
        });
        // console.log('[SearchTemp | getSectionContents | MOVIES | ]', filterResults);
        break;
        case 'VIDEOS':
        this.activeNav = 'VIDEOS';
        this.showTypeTag = false;
        filterResults = this.searchResults.filter((result) => {
          return (result.contentType == 'trailer' || result.contentType == 'poster')
        });
        // console.log('[SearchTemp | getSectionContents | VIDEOS | ]', filterResults);
        break;
        default:
      }
      if (filterResults && filterResults.length) {
        this.setSearchFilterResults(filterResults);
      } else {
        this.setSearchFilterResults(undefined);
      }
      // console.log('[SearchTemp | getSectionContents | searchFilterResults | ]', this.searchFilterResults);
    },
    getTypeTag(item) {
      // console.log('[SearchTemp | getTypeTag | item | ]', item);

      if (!(item.contentType)) return undefined;

      if (item.contentType == 'movie') {
        return 'MOVIE';
      } else if(item.contentType == 'trailer') {
        return 'TRAIlER'
      } else {
        return 'SHOW';
      }
    },
    getIsFreeTag(item) {
      if (item.isFreeContent) {
        if (this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    // NOTE: CODE CHANGE @SANGEETH - PWA-186
    assertFlowContainerHeight () {
      let bodyHeight = document.documentElement.scrollHeight;
      let flowContainerHeight = bodyHeight - 100;

      this.flowContainerHeight = `${flowContainerHeight}px`;
    }
    // NOTE: CODE CHANGE @SANGEETH - PWA-186
  },
  created() {
    if (JSON.parse(localStorage.getItem('altOrder'))) {
      this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
    }
    // console.log(altorder +this.altOrder);
    this.activeNav = this.sectionNav[0];
    this.setSearchFilterResults(this.searchResults);

     console.log('[SearchTemp | created | searchFilterResults | ]', this.searchFilterResults);
  },
  mounted () {
    // NOTE: CODE CHANGE @SANGEETH - PWA-186
    // this.assertFlowContainerHeight();
    // NOTE: CODE CHANGE @SANGEETH - PWA-186
  },
  mixins: [altMixins]
}
</script>
