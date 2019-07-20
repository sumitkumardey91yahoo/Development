<template>
  <nav class="top-menu" v-if="homeSections">
    <a v-for="menu in homeSections"  v-show="isShowHomeNav(menu)" class="scroll-menu" :class="isNavActive(menu.titles.default)" :key="menu.id" @click="setActiveSection(menu)">{{menu.titles.default}}</a>
  </nav>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

import nav from'../../assets/js/navtoggle';

export default {
  data() {
    return {
      withUrl: false,
      param: undefined,
      activeSectionId: undefined,
      activeNavMenu: undefined,
      enableWatching: false,
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
      'homeSectionId',
      'homeSections',
      'page',
      'limit',
      'offset',
      'homeActiveSectionTitle',
      'totalPages',
      'pageCount',
      'userLoggedIn',
      'recentWatchedItems',
      'showWatching',
    ]),
  },
  watch: {
    appActive() {
      this.setActiveSectionId();
      this.initHomeNav();
    },
    '$route'(to, from) {
      this.toggleLoader(true);
      this.setActiveSectionId();
      this.initHomeNav();
    },
  },
  methods: {
    ...mapMutations([
      'setHomeSections',
      'setOffset',
      'setLimit',
      'setPage',
      'setHomeContents',
      'setFirstContent',
      'setGridContents',
      'setTotalElements',
      'setTotalPages',
      'setHomeUrlQuery',
      'setPageCount',
      'setShowLoadMore',
      'setHomeActiveSectionTitle',
      'setRecentWatchedItems',
      'setShowWatching',
    ]),
    ...mapActions([
      'actGetSections',
      'actGetContentsByUrl',
      'actGetContentsById',
      'actGetRecentlyWatched',
      'actGetAccountInfo'
    ]),
    setActiveSectionId() {
      // Get the config data from localstorage
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
      // If config data is not available, return from the method
      if (!(altConfig)) return;

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      }

      if (altProfileMode == 'kids') {
        this.activeSectionId = altConfig.kids.sectionID;
        return;
      }

      // Get the menu data from the altConfig
      var menus = undefined;
      if (altConfig && altConfig.menus) {
        menus = altConfig.menus;
      }

      switch (this.$route.name) {
          case 'home':
          this.activeSectionId = getSectionId('Home');
          break;
          case 'shows':
          this.activeSectionId = getSectionId('Shows');
          break;
          case 'movies':
          this.activeSectionId = getSectionId('Movies');
          break;
          case 'kids':
          this.activeSectionId = getSectionId('Kids');
          break;
          case 'comedy':
          this.activeSectionId = getSectionId('Comedy');
          break;
          case 'bcl':
          this.activeSectionId = getSectionId('BCL');
          break;
          case 'tv-shows':
          this.activeSectionId = getSectionId('TV Shows');
          break;
          case 'originals':
          this.activeSectionId = getSectionId('Originals');
          break;
          default:
          this.activeSectionId = getSectionId('Home');
      }

      this.sendGTMpageViewData(this.$route.name);

      function getSectionId(name) {
        var matchedMenus = menus.filter((menu) => {
          return menu.title == name;
        });

        // If no menus are found while filtering, return undefined, so that the execution won't continue.
        if (!(matchedMenus && matchedMenus.length)) return undefined;
        // If matched menu is found return the section id
        return matchedMenus[0].sectionID;
      }
    },
    homePageViewAnalytics() {
      if(this.$route.name == "home") {
        if (window.mobileAnalyticsClient) {
          var pageSelectAttributes = this.getAWSMACommonAttributes();
          pageSelectAttributes.page_title = "home";
          pageSelectAttributes.page_url = window.location.href;

          window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
        }
      }
    },
    setActiveSection(menu) {
      eventBus.$emit('changeTemplateEvent', 'default');

      // Show the loader
      this.toggleLoader(true);
      // Reset the page count
      this.setPageCount(0);
      this.setLimit(7);
      this.setOffset(0);
      // Enable the load more button
      this.setShowLoadMore(true);

      // Mutation defined in home.js store. Used to store the title of the current active section tab.
      this.setHomeActiveSectionTitle(menu.titles.default);
      // this.activeNavMenu = menu.titles.default;

      if (menu.external_id) {
        this.withUrl = true;
        this.param = menu.external_id;
      } else {
        this.withUrl = false;
        this.param = menu.id;
      }

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        // AWS Event for category select
        var catSelectEventAttributeObj = this.getAWSMACommonAttributes();
        catSelectEventAttributeObj.category_title = menu.titles && menu.titles.default ? menu.titles.default : 'N.A';
        catSelectEventAttributeObj.category_id = menu.section_id ? menu.section_id : 'N.A';
        catSelectEventAttributeObj.category_url = menu._links && menu._links.self && menu._links.self.href ? menu._links.self.href : 'N.A';

        window.mobileAnalyticsClient.recordEvent('_category.select', catSelectEventAttributeObj, {});

        // AWS Event for section view
        var sectionViewEventAttributeObj = this.getAWSMACommonAttributes();
        sectionViewEventAttributeObj.section_title = (menu.titles && menu.titles.default) ? menu.titles.default : 'N.A';
        if (menu.name) {
          sectionViewEventAttributeObj.section_title = menu.name;
        }
        sectionViewEventAttributeObj.section_id = menu.id ? menu.id : 'N.A';

        window.mobileAnalyticsClient.recordEvent('_section.view', sectionViewEventAttributeObj, {});
      }
      // End of AWS Mobile SDK Events

      this.setHomeUrlQuery({ withUrl: this.withUrl, param: this.param });

      this.getContents();
    },
    initHomeNav() {
      this.actGetSections(this.activeSectionId).then((response) => {
        // Returns the sections in order
        var homeSections = this.processSections(response);
        var altUser;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // Getting Config data from local storage
        let altConfig = undefined;
        if (localStorage.getItem('altConfig')) {
          altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        // NOTE home page  trigger page view
        let _this = this;
        setTimeout(function() {
          _this.homePageViewAnalytics();
        },1000);

        // Exit out if config data not available
        if (!altConfig) return;

        // Check whether regional data is in published state or not
        let regionalPublished = altConfig.regional && altConfig.regional.published;

        // Check the user has already selected his preferred language. If yes get the preferred language information from localStorage
        let pref_language_data = undefined;
        if (localStorage.getItem('pref_language_data')) {
          pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
        }

        let altProfileMode = localStorage.getItem('altProfileMode');
        if (!altProfileMode) altProfileMode == 'default';

        // If userdata exits
        if (altUser) {
          let routeName = this.$route.name;

          if (regionalPublished && (altProfileMode == 'default') && routeName == 'home') {
            // NOTE state popup
            this.statePopupHomePage();
            // Check for users language prefenece from user profile
            // This is an asynchronous method
            this.checkLanguagePreference();
          }

          // Get recently watched item from API response
          this.hasRecentItem().then(() => {
            // Mutation to store the homesections
            this.renderHomeSections(homeSections);

            // And setting the active section
            // this.getActiveSection();
          }).catch((error) => {
            if (error.code && (error.code == 401 || error.code == 404)) {
              // Show the device removed popup
              eventBus.$emit('togglePopupDeviceRemoved', true);
            }

            // If recent items are not present
            var watchingIndex = homeSections.findIndex((item) => {
              return item.titles.default == 'Watching';
            });

            if (watchingIndex == -1) {
              this.renderHomeSections(homeSections);
            } else {
              // strip out the watching section
              homeSections.splice(watchingIndex, 1);
              this.renderHomeSections(homeSections);
            }
          });
        } else {
          // If regional data is published, then only continue
          let routeNameAnony = this.$route.name;

          if (regionalPublished && routeNameAnony && routeNameAnony == 'home') {
            // Check if preferred language data is available in the local storage
            // and popup is not emitted previously
            if (!(pref_language_data && pref_language_data.emitted)) {
              // Show the popup
              eventBus.$emit('toggleLanguageFeatureAnonymousEvent', true);

              if(document.getElementById('body')) {
                document.getElementById('body').style.position = "fixed";
              }
            }
          }

          this.setHomeSections(homeSections);
          this.getActiveSection();
        }
      }, (error) => {
        // console.log('[initHomeNav | actGetSections | error | ]', error);
      });
    },
    statePopupHomePage() {
        let homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }
        let altAccount = undefined;
        altAccount = localStorage.getItem("altAccount") ? JSON.parse(localStorage.getItem("altAccount")) : undefined;

        if (homeDomain == 'IN' && altAccount && altAccount.details && !altAccount.details.state) {
            eventBus.$emit('togglePopupStateSelectEvent', true);
            // Hide the App Loader
            this.toggleLoader(false);
        } else {
            return;
        }
    },
    renderHomeSections (homeSections) {
      // Check the user has already selected his preferred language
      // Get the preferred language information from localStorage
      let pref_language_data = undefined;
      if (localStorage.getItem('pref_language_data')) {
        pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
      }

      let altProfileMode = localStorage.getItem('altProfileMode');
      if (!altProfileMode) altProfileMode == 'default';

      let routeName = this.$route.name;

      // Getting Config data from local storage
      let altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }

      // Exit out if config data not available
      if (!altConfig) return;

      // Check whether regional data is in published state or not
      let regionalPublished = (altConfig.regional && altConfig.regional.published) ? true : false;

      if (regionalPublished && pref_language_data && pref_language_data.language && altProfileMode == 'default' && routeName == 'home') {
        let language = pref_language_data.language;

        if (language == '') {
          this.setHomeSections(homeSections);
          // this.getActiveSection();
          this.setActiveSection(homeSections[0]);
          return;
        }

        // Get language related for the selected language from the config
        if (localStorage.getItem('altConfig')) {
          let altConfig = JSON.parse(localStorage.getItem('altConfig'));

          // Get the lanugages data from the config
          let languagesArr = altConfig.regional && altConfig.regional.languages && altConfig.regional.languages.length;

          // If language array is empty or not exists, return.
          if (!languagesArr) return;

          let optLanguageLists = altConfig.regional.languages.filter((item) => {
            return item.name == language;
          });

          if (!(optLanguageLists && optLanguageLists.length)) {
              this.setHomeSections(homeSections);
              this.setActiveSection(homeSections[0]);
               return;
          }

          // This is the actual language data in respective of the selected language
          let languageData = optLanguageLists[0];

          if(!languageData.url || !languageData.page_title) {
              this.setHomeSections(homeSections);
              this.setActiveSection(homeSections[0]);
              return;
          }

          // Now update the home sections to render the new section tab
          let updatedSections = [{
            external_id: '/' + languageData.url,
            titles: {
              default: languageData.page_title
            },
            name: languageData.name,
            id: null,
            visible: false
          }, ...homeSections];

          this.setHomeSections(updatedSections);
          this.setActiveSection(updatedSections[0]);
        }
      } else {
        this.setHomeSections(homeSections);
        this.setActiveSection(homeSections[0]);
      }
    },
    checkLanguagePreference () {
      let pref_language_data = undefined;
      if (localStorage.getItem('pref_language_data')) {
        pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'));
      }

      // Calling Profile API
      this.actGetAccountInfo().then((response) => {
        // If the response has no profile information, exit
        if (!response.profile) return;

        let extra = response.profile.extra_details;

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
        } else {
          // If the popup is already emitted and the user type is registered, then -
          // don't continue
          if (pref_language_data && pref_language_data.userType == 'registered' && pref_language_data.emitted) return;

          this.saveLangToLocal('', false, false);

          // If not, show the language preference popup
          eventBus.$emit('toggleLanguagePrefRegisterdEvent', true);
        }
      }).catch((error) => {
        // console.log('[HomeNav -> checkLanguagePreference -> error]', error);
      });
    },
    languageSectionAnalytics(currSection) {
      if (window.mobileAnalyticsClient) {
        // AWS Event for section view
        if(localStorage.getItem("Regional-language")) {
          var sectionViewEventAttributeObjLanguage = this.getAWSMACommonAttributes();
          var regionalLanguage = undefined;

          regionalLanguage = JSON.parse(localStorage.getItem("Regional-language"));
          sectionViewEventAttributeObjLanguage.section_title = (regionalLanguage && regionalLanguage.page_title) ? regionalLanguage.page_title : 'N.A';

          window.mobileAnalyticsClient.recordEvent('_section.view', sectionViewEventAttributeObjLanguage, {});
        }

      }
    },
    getActiveSection() {
      var currSection = this.homeSections[0];

       if(currSection.id == 100 && currSection.order == 0) {
         this.languageSectionAnalytics(currSection);
       }

      this.setHomeActiveSectionTitle(currSection.titles.default);

      if (currSection.external_id) {
        this.param = currSection.external_id;
        this.withUrl = true;
      } else {
        this.withUrl = false;
        this.param = currSection.id;
      }

      this.setHomeUrlQuery({ withUrl: this.withUrl, param: this.param });

      this.getContents();
    },
    getContents() {
      this.setPageCount(0);

      if (this.withUrl) {
        // Reset the page
        this.setPage(1);
        // Reset the offset
        this.setOffset(0);

        var domain = localStorage.getItem('visitedDomain');

        var urlObj = {
          url: this.param,
          requestObj: {
            params: {
              domain
            }
          }
        };

        if (this.homeActiveSectionTitle == 'Watching') {
          this.setLimit(50);

          urlObj.requestObj.params.offset = this.offset;
          urlObj.requestObj.params.limit = this.limit;
        } else {
          this.setLimit(7);

          urlObj.requestObj.params.page = this.page;
          urlObj.requestObj.params.size = this.limit;
        }

        this.actGetContentsByUrl(urlObj).then((response) => {
          eventBus.$emit('toggleOfflineEvent', false);

          this.processContents(response);
        }, (error) => {
          if (error.code == 401) {
            eventBus.$emit('togglePopupDeviceRemoved', true);
          }

          // This error comes along while we call API to list contents for a -
          // particular language.
          // If this error comes, remove the language tab and render the home -
          // sections again
          if (error.status && error.status == 404) {
            // Make a copy of homeSections
            // let homeSections = [...this.homeSections];
            // Remove the language tab. It will at position 0
            // homeSections.splice(0, 1);
            // Set the homeSections
            // this.setHomeSections(homeSections);
            // This method will invoke the content listing
            // this.getActiveSection();
             this.processContents(undefined);
          }

          this.toggleLoader(false);
        });
      } else {
        /**
        * setting the offset
        */
        this.setOffset(0);
        /**
        * [action | home.js]
        */
        this.actGetContentsById({
          id: this.param,
          offset: this.offset,
          limit: this.limit,
        }).then((response) => {
          eventBus.$emit('toggleOfflineEvent', false);

          this.processContents(response);
        }, (error) => {
          this.toggleLoader(false);
          eventBus.$emit('toggleOfflineEvent', true);
        });
      }
    },
    processContents(response) {
      var contents = undefined;
      var totalElements = undefined;
      var totalPages = undefined;

      if(!response) {
          this.setHomeContents(undefined);
          this.setFirstContent(undefined);
          this.setShowLoadMore(false);
          return;
      }

      if (response.content) {
        contents = response.content;
        totalElements = response.totalElements;
        totalPages = response.totalPages;
      } else if (response.elements) {
        if (response.elements.media) {
          contents = response.elements.media;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);
        } else if (response.elements.series) {
          contents = response.elements.series;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);
        }
      } else if (response.history) {
        contents = response.history;
        totalElements = response.count;
        totalPages = Math.ceil(response.count / this.limit);
      }

      var parsedContents = new Array();

      if (contents && contents.length) {

        let altProfileMode;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        }

        let altUser;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        var mediaProgressList = undefined;
        if (localStorage.getItem('mediaProgressList')) {
          mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
        }

        for (var i in contents) {
          var parsedObject = undefined;

          if (contents[i].media) {
            parsedObject = this.parseContents(contents[i].media);
          } else {
            parsedObject = this.parseContents(contents[i]);
          }

          // For Kids mode, don't show non-kids content. Non-Kids contents are determined from the tag 'kidsContent' key from the parsed response.
          if (altProfileMode === 'kids') {
            if (!parsedObject.kidsContent) continue;
          }

          let geoStatus = undefined;
          if(parsedObject && parsedObject.geoBlock) {
              geoStatus = this.geoBlockCountryWise(parsedObject.geoBlock);
              if(geoStatus) {
                  continue;
              }
          }

          if (altUser && mediaProgressList && mediaProgressList.length) {
            for (var j in mediaProgressList) {
              if (parsedObject.contentId && mediaProgressList[j].media_id == parsedObject.contentId) {
                parsedObject.progress = mediaProgressList[j].progress;
                break;
              }
            }
          }

          parsedContents.push(parsedObject);
        }

      } else {
        this.hasContents = false;
      }
      this.setHomeContents(parsedContents);

      this.setFirstContent(parsedContents.slice(0, 1)[0]);

      this.setGridContents(parsedContents.slice(1));
      this.setTotalElements(totalElements);
      this.setTotalPages(totalPages);

      if (this.totalPages === 1) {
        this.setShowLoadMore(false);
      } else {
        this.setShowLoadMore(true);
      }
      // hide the loader
      this.toggleLoader(false);
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
    stuffSectionViewAttributes(sectionTitle, sectionId) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.section_title = sectionTitle;
      eventAttributeObj.section_id = sectionId.toString();

      return eventAttributeObj;
    },
    processSections(sections) {
      if (sections && sections.length) {
        return sections.sort((a, b) => {
          return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);
        });
      }
    },
    isNavActive(name) {
      return (this.homeActiveSectionTitle == name ? 'active' : '');
    },
    getWatchingContents() {
      this.toggleLoader(true);
      this.getWatching();
    },
    getWatching() {
      this.setShowLoadMore(false);
      this.setHomeActiveSectionTitle('watching');

      this.actGetRecentlyWatched({ limit: 20, offset: 0 }).then((response) => {
        if (response.count) {
          var recentWatchedItemsArr = new Array();
          var mediaProgressList = new Array();

          for (var i in response.history) {
            var watchedItem = this.parseContents(response.history[i].media);

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
              altProfileMode = localStorage.getItem('altProfileMode')
            }

            if (altProfileMode == 'kids') {
              if (!(watchedItem.kidsContent)) continue;
            }

            var length = (response.history[i].media.details && response.history[i].media.details.length) ? response.history[i].media.details.length : undefined;

            var progress = false;
            if (length && response.history[i].playback_progress) {
              progress = Math.ceil((response.history[i].playback_progress / length) * 100);
            }
            progress = (progress > 100) ? 100 : progress;

            var media_id = response.history[i].media.id;
            mediaProgressList.push({ media_id, progress, length });

            watchedItem.progress = undefined;
            if (response.history[i].playback_progress == 0) {
              watchedItem.progress = 100;
            } else if (response.history[i].playback_progress !== undefined) {
              watchedItem.progress = Math.ceil((response.history[i].playback_progress / watchedItem.durationInSec) * 100);
            }

            watchedItem.progress = (watchedItem.progress > 100) ? 100 : watchedItem.progress;

            recentWatchedItemsArr.push(watchedItem);
          }

          this.setHomeContents(recentWatchedItemsArr);
          this.setFirstContent(recentWatchedItemsArr.slice(0, 1)[0])
          this.setGridContents(recentWatchedItemsArr.slice(1));

          this.toggleLoader(false);
        } else {
          this.setShowWatching(false);
          var currSection = this.homeSections[0];

          this.setHomeActiveSectionTitle(currSection.titles.default);

          if (currSection.external_id) {
            this.param = currSection.external_id;
            this.withUrl = true;
          } else {
            this.withUrl = false;
            this.param = currSection.id;
          }

          this.setHomeUrlQuery({ withUrl: this.withUrl, param: this.param });

          this.getContents();
        }
      }, (error) => {
        if (error.code == 401 && error.status == 'error') {
          localStorage.removeItem('altUser');
          this.getContents();
        }
      });
    },
    isShowHomeNav(menu) {
      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }

      if (altUser) {
        return true;
      } else {
        return menu.visible == 'true' ? true : false;
      }
    },
    hasRecentItem() {
      var self = this;

      // Initially make the mediaProgressList empty
      localStorage.setItem('mediaProgressList', JSON.stringify([]));

      return new Promise(function(resolve, reject) {
        self.actGetRecentlyWatched({ limit: 20, offset: 0 }).then((response) => {
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
    popupDefaultDeviceRemovedCB(state) {
      // If popup payload is true, return from method
      if (state) return;

      this.initHomeNav();
    },
    homeNavAppModeChangeCB(state) {
      this.setActiveSectionId();
      this.initHomeNav();
    },
    regionalLanguageSelectedCB (language) {
      this.initHomeNav();
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
  },
  created() {
    this.toggleLoader(true);

    eventBus.$on('toggleAppModeChangeEvent', this.homeNavAppModeChangeCB);
    eventBus.$on('togglePopupDefaultDeviceRemoved', this.popupDefaultDeviceRemovedCB);
    eventBus.$on('regionalLanguageSelectedEvent', this.regionalLanguageSelectedCB);

    if (this.appActive) {
      this.setActiveSectionId();
      this.initHomeNav();
    }
  },
  beforeDestroy() {
    eventBus.$off('toggleAppModeChangeEvent', this.homeNavAppModeChangeCB);
    eventBus.$off('togglePopupDefaultDeviceRemoved');
    eventBus.$off('regionalLanguageSelectedEvent', this.regionalLanguageSelectedCB);
  },
  mixins: [altMixins]
}
</script>
