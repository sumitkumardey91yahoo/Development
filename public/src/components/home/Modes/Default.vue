<template>
  <div class="alt-home">
    <alt-carousel :featureCarouselSection="subSectionsCarousel"></alt-carousel>
    <alt-home-swiper v-if="isSwipe" :swipData="swipData"></alt-home-swiper>
    <home-grid-view v-if="isScroll" :isGrid="gridData"></home-grid-view>
    <component v-show="playerScreenFlag" :is="playerComponent"></component>
    <!-- <player-screen v-show="playerScreenFlag"></player-screen> -->
  </div>
</template>

<script>

const carousel = () => import (/* webpackChunkName: "home-Home-Header-carousel" */ '@/components/home/featureCarousel/carousel.vue');
const homeSwip = () => import (/* webpackChunkName: "home-Home-Header-homeSwipe" */ '@/components/home/swipeView/HomeSwip.vue');
const homeGridView = () => import (/* webpackChunkName: "home-Home-Header-homeGridView" */ '@/components/home/gridView/HomeGridView.vue');

import { eventBus } from '@/main';
import { altMixins } from '@/mixins';

import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      isScroll:undefined,
      isSwipe:undefined,
      swipData:undefined,
      gridData:undefined,
      subSectionsCarousel:undefined,
      playerScreenFlag:undefined,
      playerComponent : undefined
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
    ]),
  },
  watch: {
    appActive() {
      // console.log('[appActive]', this.appActive);
      this.initHomePageController();
    },
    '$route'(to, from) {
      this.initHomePageController();
    },
  },
  methods: {
    ...mapMutations([
      'setSubsectionListing'
    ]),
    ...mapActions([
      'actGetSections',
      'actGetAccountInfo',
      'actGetRecentlyWatched'
    ]),
    initHomePageController() {
      // console.log('[initHomePageController]');

      let activeSectionId = undefined;
      let routeName = undefined;
      routeName = this.$route.name;

      // console.log('[initHomePageController > routeName]', routeName);

      switch (routeName) {
        case 'home':
        activeSectionId = this.getSectionId('Home');
        break;
        case 'shows':
        activeSectionId = this.getSectionId('Shows');
        break;
        case 'movies':
        activeSectionId = this.getSectionId('Movies');
        break;
        case 'kids':
        activeSectionId = this.getSectionId('Kids');
        break;
        case 'comedy':
        activeSectionId = this.getSectionId('Comedy');
        break;
        case 'bcl':
        activeSectionId = this.getSectionId('BCL');
        break;
        case 'tv-shows':
        activeSectionId = this.getSectionId('TV Shows');
        break;
        case 'originals':
        activeSectionId = this.getSectionId('Originals');
        break;
         case 'initiatives':
        activeSectionId = this.getSectionId('Initiatives');
        break;
        default:
        activeSectionId = this.getSectionId('Home');
      }
      this.getSectionDetails(activeSectionId,routeName);
    },
    getSectionDetails(activeSectionId, routeName) {
       // console.log('[getSectionDetails > routeName]', routeName);

      // For AWS Mobile SDK Events
      localStorage.setItem('AWSMA_content_source', 'section');

      // @sumit for event source playback
      localStorage.setItem('event_source', 'section');

      this.actGetSections(activeSectionId).then((response) => {

         // console.log('[getSectionDetails > actGetSections > response]', response);

        this.hasRecentItem().then(val => {
          this.subSectionCategoryListing(response);
        }).catch(error => {
          this.subSectionCategoryListing(response);
        });
        // this.processWithTemplete(response,routeName);

      },(error)=> {
        // console.log("Default.vue || error",error);

      });
    },
    hasRecentItem() {
      var self = this;

      // Initially make the mediaProgressList empty
      localStorage.setItem('mediaProgressList', JSON.stringify([]));

      return new Promise(function(resolve, reject) {
        if(!localStorage.getItem("altUser")) {
          reject(true);
        }
        self.actGetRecentlyWatched({ limit: 50, offset: 0 }).then((response) => {
        //  // console.log('[hasRecentItem > actGetRecentlyWatched > response]', response);

          if (response.count) {
            var mediaProgressList = new Array();
            var watchingList = new Array();

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
              altProfileMode = localStorage.getItem('altProfileMode');
            } else {
              altProfileMode = 'default';
              localStorage.setItem('altProfileMode');
            }

            for (var i in response.history) {
              var watchedItem = self.parseContents(response.history[i].media);

              if (altProfileMode == 'kids') {
                if (!watchedItem.kidsContent) continue;
              }

              watchingList.push(watchedItem);

              var length = (response.history[i].media.details && response.history[i].media.details.length) ? response.history[i].media.details.length : undefined;

              var progress = false;
              if (length && response.history[i].playback_progress) {
                progress = Math.ceil((response.history[i].playback_progress / length) * 100);
              }
              progress = (progress > 100) ? 100 : progress;

              var media_id = response.history[i].media.id;
              mediaProgressList.push({ media_id, progress, length });
            }

            if (!watchingList || !watchingList.length) {
              reject(true);
            }
            localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));

            resolve(true);
          } else {
            reject(true);
          }
        }, (error) => {
          reject(error);
        });
      });
    },
    setRegionLanguageAsSection(response) {
      // console.log('[setRegionLanguageAsSection > response]', response);

      let altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }

      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      }

      let regionalPublished = altConfig.regional && altConfig.regional.published;
      let pref_language_data = undefined;
      if (localStorage.getItem('pref_language_data')) {
        pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
      }

      let routeName = this.$route.name;
      if (regionalPublished && pref_language_data && pref_language_data.language && altProfileMode == 'default' && routeName == 'home') {
        // console.log('[setRegionLanguageAsSection > pref_language_data]', pref_language_data);

        let language = pref_language_data.language;

        let languagesArr = altConfig.regional && altConfig.regional.languages && altConfig.regional.languages.length;

        // console.log("language || ",language);

        let optLanguageLists = altConfig.regional.languages.filter((item) => {
          return item.name == language;
        });
        let languageData = optLanguageLists[0];

        // console.log('[setRegionLanguageAsSection > languageData]', languageData);

        if(!languageData || !languageData.url || !languageData.page_title) {
          this.processWithTemplete(response);
          return;
        }

        if(languageData.url && languageData.page_title) {
          // console.log("languageData>>",languageData);
          let languageSubsection = undefined;
          languageSubsection = {
            external_id: '/' + languageData.url,
            titles: {
              default: languageData.page_title
            },
            name: languageData.name,
            order: 100,
            visible: 'false'
          };
          let withLanguageSection = [languageSubsection, ...response];

          // console.log('[setRegionLanguageAsSection > withLanguageSection]', withLanguageSection);

          this.processWithTemplete(withLanguageSection)
          // console.log("default.vue>>",withLanguageSection);
        }
      } else {
        this.processWithTemplete(response);
      }

    },
    checkLanguagePreference (subSectionsList) {

      let pref_language_data = undefined;
      if (localStorage.getItem('pref_language_data')) {
        pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
      }

      // console.log('[checkLanguagePreference > pref_language_data]', pref_language_data);

      // Calling Profile API
      this.actGetAccountInfo().then((response) => {
        // console.log('[checkLanguagePreference > actGetAccountInfo > response]', response);

        // If the response has no profile information, exit
        if (!response.profile) return;

        let extra = response.profile.extra_details;

        // console.log('[checkLanguagePreference > actGetAccountInfo > extra]', extra);

        // If extra_details field has information regarding prefered language
        if (extra && ('regional_language' in extra)) {
          pref_language_data = {
            userType: 'registered',
            emitted: true,
            selected: true
          };
          // Then store the user prefered language data to local storage
          pref_language_data.language = extra.regional_language;

          localStorage.setItem('pref_language_data', JSON.stringify(pref_language_data));

          this.setRegionLanguageAsSection(subSectionsList);

        } else {
          this.processWithTemplete(subSectionsList);
          if (pref_language_data && pref_language_data.userType == 'registered' && pref_language_data.emitted) return;

          this.saveLangToLocal('', false, false);

          this.processWithTemplete(subSectionsList)
          // If not, show the language preference popup
          eventBus.$emit('toggleLanguagePrefRegisterdEvent', true);
        }
      }).catch((error) => {
      });
    },
    saveLangToLocal (language, emitted, selected) {
      let pref_language_data = {
        userType: 'registered',
        emitted,
        selected,
        language
      }
      localStorage.setItem('pref_language_data', JSON.stringify(pref_language_data));
    }, // saveLangToLocal
    subSectionCategoryListing(response) {
        // console.log('[subSectionCategoryListing > response]', response);

       // page_view event
       setTimeout(()=> {
         if (window.mobileAnalyticsClient) {
          // console.log("reached to default page view");
           var pageSelectAttributes = this.getAWSMACommonAttributes();
           pageSelectAttributes.page_title = this.$route.name ? this.$route.name : 'N.A';
           pageSelectAttributes.page_url = window.location.href;
           window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
         }
       },2000);
     // page_view event end

      let altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }

      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      }

      let regionalPublished = altConfig.regional && altConfig.regional.published;
      let pref_language_data = undefined;
      if (localStorage.getItem('pref_language_data')) {
        pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
      }

      // console.log('[subSectionCategoryListing > regionalPublished]', regionalPublished);
      // console.log('[subSectionCategoryListing > pref_language_data]', pref_language_data);

      if (altUser) {
        let routeName = this.$route.name;

        if (regionalPublished && (altProfileMode == 'default')) {
          // NOTE state popup
          if(routeName == 'home'){
            this.statePopupHomePage();
            this.checkLanguagePreference(response);
            return;
          } else {
            this.processWithTemplete(response);
          }
        } else {
          this.processWithTemplete(response);
        }

      } else {
        let routeNameAnony = this.$route.name;
        this.processWithTemplete(response);

        if (regionalPublished && routeNameAnony && routeNameAnony == 'home') {

          // console.log('[subSectionCategoryListing]');

          if (!(pref_language_data && pref_language_data.emitted)) {
            eventBus.$emit('toggleLanguageFeatureAnonymousEvent', true);
            if(document.getElementById('body')) {
              document.getElementById('body').style.position = "fixed";
            }
          }
        }
      }
      // NOTE after making language filter and go for the subsection listing
    },
    statePopupHomePage() {
      // console.log('[statePopupHomePage]');

      let homeDomain = undefined;
      if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
      }
      let altAccount = undefined;
      altAccount = localStorage.getItem("altAccount") ? JSON.parse(localStorage.getItem("altAccount")) : undefined;

      if (homeDomain == 'IN' && altAccount && altAccount.details && !altAccount.details.state) {
        eventBus.$emit('togglePopupStateSelectEvent', true);
        // Hide the App Loader
        console.log(1); 
 this.toggleLoader(false);
      } else {
        return;
      }
    },
    processWithTemplete(subsections) {
      // console.log('[processWithTemplete]');

      let subsection = undefined;
      let routeName = undefined;
      routeName = this.$route.name;
      this.subSectionsCarousel = subsections;
      this.setSubsectionListing(subsections);
      // console.log("subsections>> Default.vue",this.subSectionsCarousel);
      if(routeName == "home") {
        this.isSwipe = true;
        this.isScroll = false;
        this.swipData = subsections;
        this.gridData = undefined;
      } else {
        // if length less then 1 then dont show grid view
        if(subsections && subsections.length > 1) {
          this.isScroll = true;
          this.isSwipe = false;
          this.swipData = undefined;
          this.gridData = subsections;
        } else {
          this.isScroll = false;
          this.isSwipe = false;
          this.swipData = undefined;
          this.gridData = undefined;
        }
      }
    },
    getSectionId(name) {
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
      // If config data is not available, return from the method
      if (!(altConfig)) return;
      var menus = undefined;
      if (altConfig && altConfig.menus) {
        menus = altConfig.menus;
      }

      var matchedMenus = menus.filter((menu) => {
        return menu.title == name;
      });

      if (!(matchedMenus && matchedMenus.length)) return undefined;
      return matchedMenus[0].sectionID;
    },
    fullScreenExitEvent() {
      this.playerScreenFlag = false;
    },
    windowFocusCB() {
      // when exit from fullscreen,then register added by sumit
      //  eventBus.$on("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);
      // end

      this.playerScreenFlag = false;
    }
  },
  components: {
    'alt-carousel': carousel,
    'alt-home-swiper': homeSwip,
    'home-grid-view': homeGridView,
  },
  mounted() {
    if (this.appActive) {
      this.initHomePageController();
    }
},
created() {
  this.playerComponent = () => import (/* webpackChunkName: "home-Home-playerScreen" */  '@/components/player/PlayerScreen.vue');
  
  eventBus.$on("togglePlayerScreenFlagEnable",(state) => {
    this.playerScreenFlag = state;
  });

},
  mixins: [altMixins]
}
</script>
