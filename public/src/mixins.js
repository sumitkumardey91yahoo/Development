import Vue from 'vue';
import { router } from './main';
import { eventBus } from './main';
import { store } from './store/store';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export const altMixins = {
  data() {
    return {
      altConfig: JSON.parse(localStorage.getItem('altConfig')),
      altOrder: JSON.parse(localStorage.getItem('altOrder')),
    };
  },
  computed: {
    ...mapGetters([
      'userLoggedIn',
      'domain',
    ]),
  },
  methods: {
    ...mapMutations([
      'setSectionMenus',
      'setOtherMenus',
    ]),
    toggleLoader(isShow, from) {
      if (from) {
        // console.log('[toggleLoader -> ]', from);
      }
      var loader = document.getElementById('alt-loader');
      if (!loader) return;
      if (isShow) {
        loader.style.display = 'block';
      } else {
        loader.style.display = 'none';
      }
    },
    checkAppMode() {
      // console.log('[mixins | checkAppMode | ]');

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      // console.log('[mixins | checkAppMode | altProfileMode ]', altProfileMode);

      this.changeAppMode(altProfileMode);
    },
    changeAppMode(mode) {
      // console.log('[mixins | changeAppMode | mode ]', mode);

      var headerLogoDefault = document.getElementById('header-logo-default');
      var headerLogoKids = document.getElementById('header-logo-kids');
      var searchIcoDefault = document.getElementById('search-ico-default');
      var searchIcoKids = document.getElementById('search-ico-kids');

      if (mode == 'default') {
        document.body.classList.remove('app-kids');

        // if (headerLogoDefault && this.$route.name !== "reviews") {
        //   console.log("reached")
        //   headerLogoDefault.style.display = 'inline';
        // }
        if (headerLogoKids) {
          headerLogoKids.style.display = 'none';
        }
        if (searchIcoDefault) {
          searchIcoDefault.style.display = 'inline';
        }
        if (searchIcoKids) {
          searchIcoKids.style.display = 'none';
        }
      } else {
        document.body.classList.add('app-kids');

        if (headerLogoKids) {
          headerLogoKids.style.display = 'inline';
        }
        if ( document.getElementById('header-logo-default')) {
          // console.log("here");
          document.getElementById('header-logo-default').style.display = 'none';
        }
        if (searchIcoDefault) {
          searchIcoDefault.style.display = 'none';
        }
        if (searchIcoKids) {
          searchIcoKids.style.display = 'inline';
        }
      }

      // this.registerAppEvents();
    },
    toggleSearchIco(state) {
      var searchHeaderIco = document.getElementById('header-search-ico');
      if (searchHeaderIco) {
        searchHeaderIco.style.display = state ? 'inline' : 'none';
      }
    },
    toggleDeleteIco(state) {
      var deleteHeaderIco = document.getElementById('delete-ico');
      if (deleteHeaderIco) {
        deleteHeaderIco.style.display = state ? 'inline' : 'none';
      }
    },
    toggleMenuIco(state) {
      var deleteHeaderIco = document.getElementById('showMenu');
      if (deleteHeaderIco) {
        deleteHeaderIco.style.display = state ? 'inline' : 'none';
      }
    },
    toggleCloseIco(state) {
      var closeHeaderIco = document.getElementById('header-close-ico-default');
      if (closeHeaderIco) {
        closeHeaderIco.style.display = state ? 'inline' : 'none';
      }
    },
    toggleDefaultLogo(state) {
      var defaultHeaderLogo = document.getElementById('header-logo-default');
      if (defaultHeaderLogo) {
        defaultHeaderLogo.style.display = state ? 'inline' : 'none';
      }
    },
    toggleKidsLogo(state) {
      var kidsHeaderLogo = document.getElementById('header-logo-kids');
      if (kidsHeaderLogo) {
        kidsHeaderLogo.style.display = state ? 'inline' : 'none';
      }
    },
    registerAppEvents() {
      // console.log('[App | registerAppEvents | ]');

      // Get the Menu hamburger button
      var showMenuBtn = document.getElementById('showMenu');
      if (showMenuBtn) {
        // Deregister the event first before attaching event
        showMenuBtn.removeEventListener('click', this.menuBtnClickCB, false);
        // Register click event for menu button
        showMenuBtn.addEventListener('click', this.menuBtnClickCB, false);
      }

      var headerSearchIco = document.getElementById('header-search-ico');
      if (headerSearchIco) {
        headerSearchIco.addEventListener('click', () => {
          // console.log('[mixins | headerSearchIco | click ]');

          eventBus.$emit('togglePopupSearch', true);
        });
      }
    },
    menuBtnClickCB() {
      // console.log('[App | menuBtnClickCB | ]');

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      if (altProfileMode == 'kids') {
        // console.log('[App | menuBtnClickCB | for kids mode]');

        eventBus.$emit('togglePopupKidsExitPin', true);
      } else {
        // console.log('[App | menuBtnClickCB | for default mode]');

        // Show the nav menu
        this.toggleNavMenu(true);
        eventBus.$emit('toggleNavOpenEvent', true);
      }
    },
    setHeaderTitle(title, from = null) {

      // NOTE: FOR DEBUGGING PURPOSE ONLY
      if (from) {
        // console.log('[mixins > setHeaderTitle > from]', from);
      }

      var headerTitle = document.getElementById('header-title');
      var defaultHeaderLogo = document.getElementById('header-logo-default');

      if (headerTitle) {
        if (title === false) {
          // NOTE commented by sumit 01/07/2018
          // if (defaultHeaderLogo) {
          //     defaultHeaderLogo.style.display = 'inline';
          // }

          // console.log('[mixins | setHeaderTitle | ]', title);

          headerTitle.style.display = 'none';
          return;
        }

        var altProfileMode = undefined;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        } else {
          altProfileMode = 'default';
          localStorage.setItem('altProfileMode', altProfileMode);
        }

        var headerLogoDefault = document.getElementById('header-logo-default');
        var headerLogoKids = document.getElementById('header-logo-kids');


        if (headerLogoDefault) {
          headerLogoDefault.style.display = 'none';
        }
        if (headerLogoKids) {
          headerLogoKids.style.display = 'none';
        }

        headerTitle.innerHTML = title;
        headerTitle.style.display = 'inline';
      }
    },
    toggleClearDevicealert(isShow) {
      var alert = document.getElementById('alt-device-alert');
      if (isShow) {
        alert.style.display = 'block';
      } else {
        alert.style.display = 'none';
      }
    },
    toggleSeasonPopup(isShow) {
      // console.log('mixins | toggleSeasonPopup | ');
      // console.log('[mixins | toggleSeasonPopup | isShow | ]', isShow);

      var seasonPopup = document.getElementById('season-popup');

      // console.log('[mixins | toggleSeasonPopup | seasonPopup | ]', seasonPopup);

      if (isShow) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.body.style.position = 'fixed';
        seasonPopup.style.display = 'block';
      } else {
        document.body.style.position = 'relative';
        seasonPopup.style.display = 'none';
      }
    },
    toggleNavMenu(isShow) {
      var navMenu = document.getElementById('nav-menu');
      var navOverlay = document.getElementById('nav-overlay');
      var altApp = document.getElementById('alt-app');

      if (isShow) {
        document.body.style.position = 'fixed';
        navMenu.classList.add('menu-open');
        navOverlay.classList.add('overlay-active');
      } else {
        document.body.style.position = 'relative';
        navMenu.classList.remove('menu-open');
        navOverlay.classList.remove('overlay-active');
      }
    },
    toggleSwitchToKids(isShow) {
      var kidsalert = document.getElementById('alt-switch-kids');
      if (isShow) {
        kidsalert.style.display = 'block';
      } else {
        kidsalert.style.display = 'none';
      }
    },
    toggleKidsSubscribePopup(isShow) {
      // console.log('[mixins | toggleKidsSubscribePopup | isShow | ]', isShow);

      var subsPopup = document.getElementById('kids-subscribe-popup');
      var altApp = document.getElementById('alt-app');
      if (isShow) {
        // console.log('[mixins | toggleKidsSubscribePopup | position | ]', altApp.style.position);

        subsPopup.style.display = 'block';
        setTimeout(() => {
          altApp.style.position = 'fixed';
        }, 5);
      } else {
        subsPopup.style.display = 'none';
        altApp.style.position = 'relative';
      }
    },
    toggleSubscribePopup(isShow) {
      var subsPopup = document.getElementById('subscribe-popup');
      var altApp = document.getElementById('alt-app');
      if (isShow) {
        altApp.style.position = 'fixed';
        subsPopup.style.display = 'block';
      } else {
        altApp.style.position = 'relative';
        subsPopup.style.display = 'none';
      }
    },
    toggleAltPopup(isShow, message = '') {
      var altPopup = document.getElementById('alt-popup');
      document.getElementById('alt-message').innerHTML = message;
      if (isShow) {
        altPopup.style.display = 'block';
      } else {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "relative";
        }
        altPopup.style.display = 'none';
      }
    },
    toggleKidsSigninPopup(isShow) {
      var kidsSignin = document.getElementById('kids-signin');
      var altApp = document.getElementById('alt-app');
      if (isShow) {
        // console.log('[toggleKidsSigninPopup | hello ]');

        setTimeout(() => {
          altApp.style.position = 'fixed';
          kidsSignin.style.display = 'block';
        }, 300);
      } else {
        altApp.style.position = 'relative';
        kidsSignin.style.display = 'none';
      }
    },
    togglePinScreen(isShow) {
      var pinScreen = document.getElementById('pin-screen');
      if (isShow) {
        pinScreen.style.display = 'block';
      } else {
        pinScreen.style.display = 'none';
      }
    },
    toggleFirstPinScreen(isShow) {
      var pinScreen = document.getElementById('pin-first-screen');
      if (isShow) {
        pinScreen.style.display = 'block';
      } else {
        pinScreen.style.display = 'none';
      }
    },
    toggleExitPinScreen(isShow) {
      var exitPinScreen = document.getElementById('exit-pin-screen');
      if (isShow) {
        exitPinScreen.style.display = 'block';
      } else {
        exitPinScreen.style.display = 'none';
      }
    },
    toggleKidsSearch(isShow) {
      var kidsSearch = document.getElementById('kids-search');
      if (isShow) {
        kidsSearch.style.display = 'block';
      } else {
        kidsSearch.style.display = 'none';
      }
    },
    toggleSnackbar() {
      var sb = document.getElementById('alt-snackbar');
      sb.className = 'show';
      setTimeout(function(){ sb.className = sb.className.replace("show", ""); }, 3000);
    },
    parseContents(content) {
      // console.log('[mixins | parseContents | ]', content);
       

      var altConfig = JSON.parse(localStorage.getItem('altConfig'));
      var altUser = JSON.parse(localStorage.getItem('altUser'));
      var altOrder = JSON.parse(localStorage.getItem('altOrder'));

      let isCloudinaryEnabled = false;
      if(altConfig && altConfig.environment && altConfig.environment.isCloudinaryEnabled) {
         isCloudinaryEnabled = true;
      }

      let carouselBaseUrl = (altConfig.environment && altConfig.environment.carousal_base_url) ? altConfig.environment.carousal_base_url:'https://carousal.cloud.altbalaji.com/prod/mobile/';

      var parsedObject = new Object();
      parsedObject.languageObj = undefined;
      parsedObject.languageList = undefined;
      parsedObject.tvod = { row: undefined, in: undefined };
      parsedObject.pricing = undefined;
      parsedObject._links = undefined;
      parsedObject.kidsContent = false;

      /**
      * Tags
      * contentType | mainLanguage | anonymousAccess | nextId
      */
      let startskipintro = 0;
      let endskipintro = 0;

      if (content.tags && content.tags.length) {
        // console.log('[mixins | tags present | ]');
        var tagArr = new Array();
        for (var i in content.tags) {
          tagArr.push(content.tags[i].split('-'));
        }

        var tagArrCarousel = new Array();
        for (var i in content.tags) {
          tagArrCarousel.push(content.tags[i].split(':'));
        }

        if (tagArrCarousel && tagArrCarousel.length) {
          for (var index in tagArrCarousel) {
            if (tagArrCarousel[index][0] == 'carousal') {
              if(carouselBaseUrl){
                //  parsedObject.carousel = 'https://res.cloudinary.com/mobiotics/image/fetch/q_auto,w_720' + '/' + carouselBaseUrl + tagArrCarousel[index][1];

                if(isCloudinaryEnabled) {
                  parsedObject.carousel = 'https://res.cloudinary.com/alt-demo/image/fetch/q_auto,w_' +Math.ceil( window.screen.width * 1.5) + '/' + carouselBaseUrl + tagArrCarousel[index][1];
                } else {
                  parsedObject.carousel = carouselBaseUrl + tagArrCarousel[index][1];
                }

              }
            }
          }
        }

        // console.log('[ | tagArr | ]', tagArr);


        if (tagArr && tagArr.length) {
          for (var key in tagArr) {
            if (tagArr[key][0] == 'type') {
              parsedObject.contentType = tagArr[key][1];
            }
            if(tagArr[key][0] == 'bts') {
              parsedObject.bts = tagArr[key].join("-")
            }
            if (tagArr[key][0] == 'language') {
              if (parsedObject.mainLanguage) break;

              parsedObject.mainLanguage = (tagArr[key][1]).slice(0, 1).toUpperCase() + (tagArr[key][1]).slice(1);
            }
            if (tagArr[key][0] == 'anonymous' && tagArr[key][1] == 'access') {
              parsedObject.anonymousAccess = true;
            }
            if (tagArr[key][0] == 'buffer_campaign') {
              parsedObject.buffer_campaign = true;
            }

            if (this.adsTag(tagArr[key])) {
              parsedObject.campaign_ads = this.adsTag(tagArr[key]);
            }

            if (tagArr[key][0] == 'next') {
              parsedObject.nextIn = tagArr[key][1];
            }
            if (tagArr[key][0] == 'coming' && tagArr[key][1] == 'soon') {
              parsedObject.comingSoon = true;
            }
            if (tagArr[key][0] == 'no' && tagArr[key][1] == 'show') {
              parsedObject.noShow = true;
            }
            if (tagArr[key][0] == 'kids') {
              parsedObject.kidsContent = true;
            }
            if (tagArr[key][0] == 'block') {
              parsedObject.geoBlock = tagArr[key][1] ? tagArr[key][1] : undefined;
            }
            if (tagArr[key][0] == 'series' && tagArr[key][1] == 'tvod') {
              if (tagArr[key][2] == 'in') {
                // parsedObject.tvod.push({ 'row': tagArr[key][3] });
                parsedObject.tvod['in'] = tagArr[key][3];
              }
              if (tagArr[key][2] == 'row') {
                // parsedObject.tvod.push({ 'row': tagArr[key][3] });
                parsedObject.tvod['row'] = tagArr[key][3];
              }
            }
            if (tagArr[key][0] == 'endskipintro') {
              endskipintro = tagArr[key][1];
              // console.log("endskipintro",endskipintro);
            }
            if (tagArr[key][0] == 'startskipintro') {
              startskipintro = tagArr[key][1];
            }
            if(endskipintro) {
              parsedObject.skipIntro = {"startskipintro":startskipintro,"endskipintro":endskipintro};
            }

          }
        }
      }

      if (!(parsedObject.contentType)) {
        if (content.latest_episode) {
          // console.log('[mixins | latest_episode present | ]');
          parsedObject.totalEpisode = content.latest_episode.episode;

          if (content.latest_episode.pricing) parsedObject.pricing = content.latest_episode.pricing;

          parsedObject.contentType = 'series';

          if (content.latest_episode.tags) {
            // console.log('[mixins | latest_episode | tags | ]', content.latest_episode.tags);

            var tagArr = new Array();
            for (var i in content.latest_episode.tags) {
              tagArr.push(content.latest_episode.tags[i].split('-'));
            }


            var tagArrCarousel = new Array();
            for (var i in content.tags) {
              tagArrCarousel.push(content.latest_episode.tags[i].split(':'));
            }

            if (tagArrCarousel && tagArrCarousel.length) {
              for (var index in tagArrCarousel) {
                if (tagArrCarousel[index][0] == 'carousal') {
                  if(carouselBaseUrl){
                    parsedObject.carousel = carouselBaseUrl + tagArrCarousel[index][1];
                  }
                }
              }
            }

            // console.log('[mixins | languageObj | tagArr ]', tagArr);

            if (tagArr && tagArr.length) {
              for (var key in tagArr) {
                if(tagArr[key][0] == 'bts') {
                  parsedObject.bts = tagArr[key].join("-")
                }
                if (tagArr[key][0] == 'language') {
                  if (parsedObject.mainLanguage) break;

                  parsedObject.mainLanguage = (tagArr[key][1]).slice(0, 1).toUpperCase() + (tagArr[key][1]).slice(1);
                }

                // console.log('[mainLanguage | ]', parsedObject.mainLanguage);

                if (tagArr[key][0] == 'anonymous' && tagArr[key][1] == 'access') {
                  parsedObject.anonymousAccess = true;
                }
                if (tagArr[key][0] == 'buffer_campaign') {
                  parsedObject.buffer_campaign = true;
                }
                if (this.adsTag(tagArr[key])) {
                  parsedObject.campaign_ads = this.adsTag(tagArr[key]);
                }
                if (tagArr[key][0] == 'block') {
                  parsedObject.geoBlock = tagArr[key][1] ? tagArr[key][1] : undefined;
                }
                if (tagArr[key][0] == 'next') {
                  parsedObject.nextIn = tagArr[key][1];
                }
                if (tagArr[key][0] == 'coming' && tagArr[key][1] == 'soon') {
                  parsedObject.comingSoon = true;
                }
                if (tagArr[key][0] == 'no' && tagArr[key][1] == 'show') {
                  parsedObject.noShow = true;
                }
                if (tagArr[key][0] == 'kids') {
                  parsedObject.kidsContent = true;
                }

                if (tagArr[key][0] == 'endskipintro') {
                  endskipintro = tagArr[key][1];
                }
                if (tagArr[key][0] == 'startskipintro') {
                  startskipintro = tagArr[key][1];
                }
                if(endskipintro) {
                  parsedObject.skipIntro = {"startskipintro":startskipintro,"endskipintro":endskipintro};
                }

                if (tagArr[key][0] == 'series' && tagArr[key][1] == 'tvod') {
                  if (tagArr[key][2] == 'in') {
                    // parsedObject.tvod.push({ 'row': tagArr[key][3] });
                    parsedObject.tvod['in'] = tagArr[key][3];
                  }
                  if (tagArr[key][2] == 'row') {
                    // parsedObject.tvod.push({ 'row': tagArr[key][3] });
                    parsedObject.tvod['row'] = tagArr[key][3];
                  }
                }

                if (tagArr[key][0] == 'addlangmap') {
                  var langMapArr = tagArr[key];
                  if (langMapArr && langMapArr.length) {
                    var splitLangArr = new Array();
                    for (var i = 1; i < langMapArr.length; i++) {
                      splitLangArr.push(langMapArr[i].split(':'));
                    }
                    parsedObject.languageObj = splitLangArr.reduce((prev, curr) => {
                      prev[curr[0]] = curr[1];

                      // console.log('[mixins | languageObj | ]', prev);

                      return prev;
                    }, {});
                  }
                }
                if (tagArr[key][0] == 'addlang') {
                  let config = localStorage.getItem("altConfig")  ? JSON.parse(localStorage.getItem("altConfig")) : undefined;

                  var langListArr = tagArr[key];
                  parsedObject.langListArr = langListArr.slice(1);
                  parsedObject.langMsg = config.messages.languageOptions;
                }
              }
            }
          }
          if (content.latest_episode.details) {
            if (content.latest_episode.details.director && content.latest_episode.details.director.length) {
              parsedObject.director = this.filterDirectorByDetails(content.latest_episode.details.director);
            }
            if (content.latest_episode.details.cast && content.latest_episode.details.cast.length) {
              parsedObject.cast = this.filterCastByDetails(content.latest_episode.details.cast);
            }
            if (content.latest_episode.details.age_limit) {
              parsedObject.age_limit = content.latest_episode.details.age_limit;
            }
          }

        } else if (content.subtypes) {
          // console.log('[mixins | subtypes present | ]');
          parsedObject.contentType = content.subtypes[0];
        } else {
          // console.log('[mixins | nothing present | ]');
          parsedObject.contentType = 'series';
        }
      }

      if (!(parsedObject.tvod.in || parsedObject.tvod.row)) {
        parsedObject.tvod = undefined;
      }
      // console.log('[contentType | ]', parsedObject.contentType);
      // console.log('[kidsContent | ]', parsedObject.kidsContent);
      switch (parsedObject.contentType) {
        case 'trailer':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Trailer';
        break;
        case 'movie':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Movie';
        break;
        case 'episode':
        parsedObject.contentName = 'episode';
        parsedObject.contentTitle = 'Show';
        break;
        case 'standup':
        parsedObject.contentName = 'show';
        parsedObject.contentTitle = 'Standup';
        break;
        case 'series':
        parsedObject.contentName = 'show';
        parsedObject.contentTitle = 'Show';
        break;
        case 'poster':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Poster';
        break;
        // NOTE for content Type video should be media/movie part.
        case 'video':
        parsedObject.contentName = 'media';
        parsedObject.contentTitle = 'Movie';
        break;
        default:
        parsedObject.contentName = 'show';
        parsedObject.contentTitle = 'Show';
      }
      /**
      * images
      */
      if (content.images) {
        parsedObject.images = this.filterImages(content.images);
      }
      /**
      * cast | director
      */
      if (content.credits && content.credits.length) {
        parsedObject.cast = this.filterCastByCredits(content.credits);
        parsedObject.director = this.filterDirectorByCredits(content.credits);
      } else if (content.details) {
        if (content.details.cast && content.details.cast.length) {
          parsedObject.cast = this.filterCastByDetails(content.details.cast);
        }
        if (content.details.director && content.details.director.length) {
          parsedObject.director = this.filterDirectorByDetails(content.details.director)
        }
        if (content.details.age_limit) {
          parsedObject.age_limit = content.details.age_limit;
        }
      }
      /**
      * distributorId
      */
      if (content.distributorId) {
        parsedObject.distributorId = content.distributorId;
      }
      /**
      * distributorName
      */
      if (content.distributorName) {
        parsedObject.distributorName;
      }
      /**
      * episodeNumber
      */
      if (content.episodeNumber) {
        parsedObject.episodeNumber;
      }
      /**
      * categories
      */
      if (content.genres && content.genres.length) {
        var categoryObj = this.filterCategoryByGenre(content.genres);
        parsedObject.categories = categoryObj.categoryNames;
        parsedObject.mainCategoryName = categoryObj.mainCategoryName;
        parsedObject.mainCategoryId = categoryObj.mainCategoryId;
      } else if (content.categories) {
        var categoryObj = this.filterCategory(content.categories);
        parsedObject.categories = categoryObj.categoryNames;
        parsedObject.mainCategoryName = categoryObj.mainCategoryName;
        parsedObject.mainCategoryId = categoryObj.mainCategoryId;
      }
      /**
      * age_limit
      */

      /**
      * duration
      */
      if (content.length) {
        parsedObject.durationInSec = parseInt(content.length);
        parsedObject.duration = this.filterDuration(content.length);
      } else if (content.details) {
        if (content.details.length) {
          parsedObject.durationInSec = parseInt(content.details.length);
          parsedObject.duration = this.filterDuration(content.details.length);
        }
      }
      /**
      * description
      */
      if (content.descriptions) {
        parsedObject.descriptions = content.descriptions;
      } else if (content.descriptions) {
        parsedObject.descriptions = content.descriptions.default;
      } else {
        parsedObject.descriptions = undefined;
      }
      /**
      * shortDescription
      */
      if (content.shortDescription) {
        parsedObject.shortDescription = content.shortDescription;
      } else if (content.descriptions) {
        parsedObject.shortDescription = content.descriptions.default;
      } else {
        parsedObject.shortDescription = undefined;
      }
      /**
      * mediumDescription
      */
      if (content.mediumDescription) {
        parsedObject.mediumDescription = content.mediumDescription;
      } else if (content.medium_descriptions) {
        parsedObject.mediumDescription = content.medium_descriptions.default;
      } else {
        parsedObject.mediumDescription = undefined
      }
      /**
      * longDescription
      */
      if (content.longDescription) {
        parsedObject.longDescription = (content.longDescription).split('\n');
      } else if (content.long_descriptions) {
        parsedObject.longDescription = (content.long_descriptions.default).split('\n');
      } else {
        parsedObject.longDescription = undefined;
      }
      /**
      * parentalControl
      */
      if (content.parentalControl && content.parentalControl.length) {
        parsedObject.parentalControl = content.parentalControl[0];
      }
      /**
      * releaseYear
      */
      if (content.releaseYear) {
        parsedObject.releaseYear = content.releaseYear;
      } else if (content.details) {
        if (content.details.year) {
          parsedObject.releaseYear = content.details.year;
        }
      }
      /**
      * studio
      */
      if (content.details && content.details.studio) {
        parsedObject.studio = content.details.studio;
      }
      /**
      * title
      */
      if (content.title) {
        parsedObject.title = content.title;
      } else if (content.titles) {
        parsedObject.title = content.titles.default;
      }
      /**
      * type
      */
      if (content.type) {
        parsedObject.type = content.type;
      }
      /**
      * subtypes
      */
      if (content.subtypes && content.subtypes.length) {
        parsedObject.subtypes = content.subtypes
      }
      /**
      * contentProvider
      */
      if (content.content_provider) {
        parsedObject.contentProvider = content.content_provider;
      }
      /**
      * dates
      */
      if (content.dates) {
        parsedObject.dates = content.dates;
      }
      /**
      * externalId
      */
      if (content.external_id) {
        parsedObject.externalId = content.external_id;
      }
      /**
      * isFree
      */
      parsedObject.isFree = false;
      parsedObject.userHasAccess = false;
      parsedObject.isFreeContent = false;

      if (content._links) parsedObject._links = content._links;
      // console.log('[mixins | content | ]', content);
      // console.log('[mixins | parsedObject | ]', parsedObject);
      // console.log('[mixins | altOrder | ]', altOrder);

      if (altUser) {
        if (content.pricing) {
          if (content.pricing.count) {
            for (var product in content.pricing.products) {
              var productItem = content.pricing.products[product];
              if (productItem.prices && productItem.prices.length) {
                for (var price in productItem.prices) {
                  if (productItem.prices[price].is_free) {
                    parsedObject.isFreeContent = true;
                    break;
                  }
                }
              }
            }

            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {

              if (!(parsedObject.isFreeContent)) {
                // var productId = altOrder.productId;
                var productId = altOrder.subscription.product.id;

                // console.log('[mixins | productId | ]', productId);

                for (var product in content.pricing.products) {
                  var productItem = content.pricing.products[product];
                  if (productItem.id == productId) {
                    parsedObject.userHasAccess = true;
                    break;
                  }
                }
              }
            }

            if (parsedObject.isFreeContent == false) {
              var homeDomain = localStorage.getItem('homeDomain').toLowerCase();

              if (parsedObject.tvod && (homeDomain in parsedObject.tvod)) {
                // console.log('[altOrder.tvod | ]', altOrder.tvod);

                // if (altOrder && altOrder.tvod && altOrder.tvod.hasOrder && altOrder.tvod.expired == false && altOrder.tvod.product.id == parsedObject.tvod[homeDomain]) {
                //     parsedObject.userHasAccess = true;
                // }

                var singleTvod = undefined;
                if (altOrder && altOrder.tvod && altOrder.tvod.hasOrder && parsedObject.tvod) {
                  for (singleTvod in altOrder.tvod.products) {
                    if (altOrder.tvod.products[singleTvod].product.id == parsedObject.tvod[homeDomain]) {
                      parsedObject.userHasAccess = true;
                      break;
                    }
                  }
                }
              }
            }

          } else if (content.pricing.length) {
            for (var price in content.pricing) {
              if (content.pricing[price].is_free) {
                parsedObject.isFreeContent = true;
                break;
              }
            }
            if (!(parsedObject.isFree) && altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
              var productId = altOrder.subscription.product.id;

              for (var price in content.pricing) {
                if (content.pricing[price].product_id == productId) {
                  parsedObject.userHasAccess = true;
                  break;
                }
              }
            }

            // changes for playlist 7th feb
            var singleTvod = undefined;
            var homeDomain = localStorage.getItem('homeDomain').toLowerCase();
            if (altOrder && altOrder.tvod && altOrder.tvod.hasOrder && parsedObject.tvod && parsedObject.isFreeContent == false) {
              for (singleTvod in altOrder.tvod.products) {
                if (altOrder.tvod.products[singleTvod].product.id == parsedObject.tvod[homeDomain]) {
                  parsedObject.userHasAccess = true;
                  break;
                }
              }
            }
          // end of playlist   


          }
        }
      } else {
        if (content.pricing && content.pricing.count) {
          if (content.pricing.products.length) {
            for (var product in content.pricing.products) {
              var productItem = content.pricing.products[product];
              if (productItem.prices && productItem.prices.length) {
                for (var price in productItem.prices) {
                  if (productItem.prices[price].is_free) {
                    parsedObject.isFreeContent = true;
                    break;
                  }
                }
              }
            }
            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
              if (!(parsedObject.isFreeContent)) {
                var productId = altOrder.subscription.product.id;

                for (var product in content.pricing.products) {
                  var productItem = content.pricing.products[product];
                  if (productItem.id == productId) {
                    parsedObject.userHasAccess = true;
                    break;
                  }
                }
              }
            }
          }
        } else if (content.pricing && content.pricing.length) {
          for (var price in content.pricing) {
            if (content.pricing[price].is_free) {
              parsedObject.isFree = true;
              parsedObject.isFreeContent = true;
              break;
            }
          }
        }
      }

      if (content.pricing && content.pricing.count) parsedObject.pricing = content.pricing.products;

      /**
      * stats
      */
      if (content.stats) {
        parsedObject.stats = content.stats;
      }
      /**
      * trailer
      */
      if (content.trailers && content.trailers.length) {
        parsedObject.trailer = this.filterTrailer(content.trailers[0]);
        parsedObject.trailerAvailable = true;
      } else {
        parsedObject.trailer = undefined;
        parsedObject.trailerAvailable = false;
      }
      /**
      * streams
      */
      if (content.streams && content.streams.web && content.streams.web.length) {
        parsedObject.stream = this.filterStreams(content.streams.web);
        parsedObject.streamAvailable = true;
      } else {
        parsedObject.stream = undefined;
        parsedObject.streamAvailable = false;
      }

      if (parsedObject.contentType == 'trailer') {
        if (parsedObject.trailer) {
          parsedObject.userHasAccess = true;
        }
        if (content.uid) {
          parsedObject.id = content.uid.split('-')[1];
          parsedObject.contentId = content.uid.split('-')[1];
          parsedObject.uidType = content.uid.split('-')[0];
        } else if (content.id) {
          parsedObject.id = content.id;
          parsedObject.contentId = content.id;
          parsedObject.uidType = undefined;
        }
      }

      // if (parsedObject.contentType == 'series' || parsedObject.contentType == 'standup') {
      // }
      if (parsedObject.contentType == 'movie') {
        if (content.id) {
          parsedObject.id = content.id;
          parsedObject.contentId = content.id;
        } else if (content.uid) {
          parsedObject.id = content.uid.split('-')[1];
          parsedObject.uidType = content.uid.split('-')[0];
        }
      } else if (parsedObject.contentType == 'episode') {
        // console.log('[mixins | contentType == episode ]');
        // console.log('[mixins | content ]', content);

        // console.log('[mixins | content series | ]', content.series);

        if (content.series && content.series.length) {
          parsedObject.seriesTitle = content.series[0].titles && content.series[0].titles.default;
          parsedObject.episodeNumber = content.series[0].episode_number;
          parsedObject.contentId = content.series[0].episode_id;
          parsedObject.episodeId = content.series[0].episode_id;
          parsedObject.seriesId = content.series[0].id;
          parsedObject.seasonId = content.series[0].season_id;
          parsedObject.seasonNumber = content.series[0].season_number;

          var firstSeries = content.series[0];
          if (firstSeries.seasons && firstSeries.seasons.length) {
            // console.log('[mixins | seasonId | ]', parsedObject.seasonId);
            // console.log('[mixins | firstSeries | ]', firstSeries);

            var slctdSeason = firstSeries.seasons[0];

            // console.log('[mixins | slctdSeason | ]', slctdSeason);

            if (slctdSeason) {
              parsedObject.seasonId = slctdSeason.id;
              parsedObject.seasonNumber = slctdSeason.season_number;

              if (slctdSeason.episodes && slctdSeason.episodes.length) {
                var optEpisode = slctdSeason.episodes[0];
                parsedObject.episodeId = optEpisode.id;
                parsedObject.episodeNumber = optEpisode.episode_number;
              }
            }
          }
        }

        if (content.id) {
          parsedObject.id = content.id;
          parsedObject.contentId = content.id;
        }

        if (content.media_id) {
          parsedObject.id = content.media_id;
          parsedObject.mediaId = content.media_id;
        }
      } else {
        if (parsedObject.trailer) {
          parsedObject.userHasAccess = true;
        }
        if (content.uid) {
          parsedObject.id = content.uid.split('-')[1];
          parsedObject.seriesId = content.uid.split('-')[1];
          parsedObject.uidType = content.uid.split('-')[0];
        } else if (content.id) {
          parsedObject.id = content.id;
          parsedObject.seriesId = content.id;
          parsedObject.uidType = undefined;
        }
        // console.log('[mixins | latest_episode | content | ]', content);
        // console.log('[mixins | latest_episode | mainLanguage | ]', parsedObject.mainLanguage);

        if (content.latest_episode) {
          // parsedObject.contentName = ;
          if (!(parsedObject.releaseYear) && content.latest_episode.details && content.latest_episode.details.year) {
            parsedObject.releaseYear = content.latest_episode.details.year;
          }

          // console.log('[mixins | latest_episode | mainLanguage | ]', parsedObject.mainLanguage);

          if (!(parsedObject.mainLanguage) && content.latest_episode.tags && content.latest_episode.tags.length) {

            var latestTagArr = new Array();
            for (var i in content.latest_episode.tags) {
              latestTagArr.push(content.latest_episode.tags[i].split('-'));
            }
            if (latestTagArr && latestTagArr.length) {
              for (var key in latestTagArr) {
                if (latestTagArr[key][0] == 'language') {
                  if (parsedObject.mainLanguage) break;

                  parsedObject.mainLanguage = (latestTagArr[key][1]).slice(0, 1).toUpperCase() + (latestTagArr[key][1]).slice(1);
                }
              }
            }
          }
        }
      }
      // console.log('[mixins.js | parseContents | parsedObject | ]', parsedObject);

      return parsedObject;
    },
    switchToKidsProfile(profile) {
      // console.log('[mixins | switchProfile | profile | ]', profile);

      store.dispatch('actGetProfileSwitch', profile).then(
        (response) => {
          // console.log('[mixins | switchProfile | response | ]', response);
          // console.log('[mixins | switchProfile | routerToParam | ]', store.getters.routerToParam);

          if (response.status && response.status == 'ok') {
            profile.email = response.email;
            profile.parentalControl = response.parental_control;
            profile.sessionToken = response.session_token;
            profile.username = response.username;
            profile.uuid = response.uuid;

            localStorage.setItem('altProfileMode', 'kids');

            router.push({ name: store.getters.routerToParam.name });
          }
        },
        (error) => {
          // console.log('[mixins | switchProfile | error | ]', error);

        }
      )
    },
    adsTag(tags) {
      // tage example dfp-anonymous-preroll-Tyohar_Entertainment_Ka
      
      // if(tags[1]) {
      //   let ads = tags[1].split('_');
      //   if (ads[0] == 'Campaign') {

      //     let usertype = this.AWSUserType();
      //     if(tags[0] == usertype) {
      //         // console.log("tags[1]", tags[1])
      //       return tags[1];
      //     }
      //   }
      // } 
      // return '';

      if(tags[0] == 'dfp') {
        let usertype = this.AWSUserType();
        if(tags[1] == usertype && tags[2] == 'preroll') {
          return tags[3];
        }
      }
      return '';
    },
    parseProductPlans(product) {
      // console.log('[mixins | parseProductPlans | product ]', product);

      var discountPrices = JSON.parse(localStorage.getItem('altConfig')).discountPrices;
      // console.log('[mixins | parseProductPlans | discountPrices ]', discountPrices);

      var homeDomain = localStorage.getItem('homeDomain');
      var parsedProduct = {
        conditions: (product.conditions) ? product.conditions : undefined,
        descriptions: (product.descriptions) ? product.descriptions : undefined,
        external_identity: (product.external_identity) ? product.external_identity : undefined,
        id: (product.id) ? product.id : undefined,
        promotion: product.promotion,
        id: (product.id) ? product.id : undefined,
        titles: (product.titles) ? product.titles : undefined,
        validity: (product.validity) ? product.validity : undefined,
      }
      if (parsedProduct.id in discountPrices) {
        parsedProduct.discount = discountPrices[parsedProduct.id];
      } else {
        parsedProduct.discount = undefined;
      }
      if (product.prices && product.prices.length) {
        var matchedProduct = product.prices.filter((item) => {
          return item.domain = homeDomain.toLowerCase();
        });
        if (matchedProduct && matchedProduct.length) {
          parsedProduct.price = matchedProduct[0];
        }
      }
      return parsedProduct;
    },
    filterCategoryByGenre(genres) {
      var categoryNames = new Array();
      for (var i in genres) {
        categoryNames.push(genres[i].name);
      };
      var mainCategoryName = genres[0].name;
      var mainCategoryId = genres[0].uid.split('-')[1];

      return { categoryNames, mainCategoryName, mainCategoryId };
    },
    filterCategory(categories) {
      var categoryNames = new Array();
      for (var i in categories) {
        categoryNames.push(categories[i].titles.default);
      }
      // NOTE code added by sumit (08-oct-17)
      var mainCategoryName =  categories[0] && categories[0].titles ? categories[0].titles.default : undefined;
      var mainCategoryId = categories[0] ? categories[0].id : undefined;
      // NOTE end of code added by sumit (08-oct-17)

      return { categoryNames, mainCategoryName, mainCategoryId };
    },
    filterImages(images) {
      var cover = undefined;
      var poster = undefined;
      // console.log("mixins.js | filterImages",images);
      var coverArr = images.filter((image) => {
        if (typeof(image.format) == 'string') {
          return (image.format == 'tiles-ld' && image.type == 'system')
        } else {
          return (image.format['tiles-ld'] && image.type == 'system')
        }
      })
      if (coverArr && coverArr.length) {
        // console.log('[coverArr]==>', coverArr);
        var theCover = coverArr[0];
        if (typeof(theCover.format) == 'string') {
          cover = theCover.url;
        } else {
          cover = theCover.format['tiles-ld'].source;
        }
      }

      var posterArr = images.filter((image) => {
        if (typeof(image.format) == 'string') {
          return (image.format == 'banner-ld' && image.type == 'poster')
        } else {
          return (image.format['banner-ld'] && image.type == 'poster')
        }
      });
      if (posterArr && posterArr.length) {
        var thePoster = posterArr[0];
        if (typeof(thePoster.format) == 'string') {
          poster = thePoster.url;
        } else {
          poster = thePoster.format['banner-ld'].source;
        }

        let config = undefined;
        let isCloudinaryEnabled = false;
        config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined
        if(config && config.environment && config.environment.isCloudinaryEnabled) {
           isCloudinaryEnabled = true;
        }

        if(isCloudinaryEnabled) {
          poster = 'https://res.cloudinary.com/alt-demo/image/fetch/q_auto,w_' + Math.ceil((window.screen.width/2)) + '/' + poster;
        }
      }

      let imageList = null;
      let webengage = null;
      let episodeImageUrl = null;
      imageList = images.filter((image) => {
        if(image.type == "system" && image.format) {
          return image;
        }
      });

      if(imageList && imageList[0] && imageList[0].format && imageList[0].format['tiles-sd'] && imageList[0].format['tiles-sd'].source) {
        webengage =  imageList[0].format['tiles-sd'].source;
      }

      if(imageList && imageList[0] && imageList[0].format && imageList[0].format['tiles-sd'] && imageList[0].format['thumbnail-sd'].source) {
        episodeImageUrl =  imageList[0].format['thumbnail-sd'].source;
      }


      return { cover, poster, webengage,episodeImageUrl}
    },
    filterCastByCredits(items){
      var filtActors = items.filter((item) => {
        return item.type == 'actor';
      });

      var actorsArr = new Array();
      for (var i in filtActors) {
        actorsArr.push(filtActors[i].name);
      }
      return actorsArr;
    },
    filterCastByDetails(items){
      return items.filter((item) => {
        return (item.charAt(0) != '*' && item.charAt(0) != '#');
      });
    },
    filterDirectorByCredits(items){
      if (items && items.length) {
        var filtDirectors = items.filter((item) => {
          return item.type == 'director';
        });

        var directorArr = new Array();
        for (var i in filtDirectors) {
          directorArr.push(filtDirectors[i].name);
        }
        return directorArr;
      }
      return false;
    },
    filterDirectorByDetails(items){
      return items.filter((item) => {
        return (item.charAt(0) != '*' && item.charAt(0) != '#' && item != '');
      });
    },
    filterPricing(pricing) {
      var isFree = false;
      var freeItems = pricing.filter((item) => {
        return (item.domain == this.altConfig.domain.toLowerCase() && item.is_free == true);
      });
      if (freeItems && freeItems.length) {
        return true;
      } else if (this.altOrder) {
        var subItems = pricing.filter((item) => {
          return item.product_id == this.altOrder.productId;
        })
        if (subItems && subItems.length) {
          return true;
        }
        return false;
      }
      return false;
    },
    generateRandomId(length) {
      var text = "";
      var characters = "abcdef0123456789";
      for( var i=0; i < length; i++ ) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return text;
    },
    filterDuration(length) {
      var sec_num = parseInt(length, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var duration = '';
      if (hours) {
        duration += hours + 'h '
      }
      if (minutes) {
        // if (minutes < 10) {
        //     minutes = minutes;
        // }
        duration += minutes + 'm'
      }
      return duration;
    },
    filterTrailer(trailer) {
      var trailerObj = {
        id: trailer.id,
        title: trailer.titles.default,
        description: trailer.descriptions.default,
        mediumDescription: trailer.medium_descriptions.default,
        longDescription: trailer.long_descriptions.default
      };
      if (trailer.images && trailer.images.length) {
        trailerObj.trailerImages = this.filterImages(trailer.images);
      }
      if (trailer.streams && trailer.streams.web && trailer.streams.web.length) {
        var streamObj = trailer.streams.web.filter((stream) => {
          return stream.type == 'mpd';
        });
        if (streamObj && streamObj.length) {
          trailerObj.trailerId = streamObj[0].id;
          trailerObj.trailerType = streamObj[0].type;
          trailerObj.trailerAssetType = streamObj[0].assetType;
          trailerObj.trailerUrl = streamObj[0].src;
        }
      }
      return trailerObj;
    },
    filterStreams(streams) {
      var streamObj = new Object();

      var mpdStreams = streams.filter((stream) => {
        return stream.type == 'mpd';
      });
      if (mpdStreams && mpdStreams.length) {
        var drmStreams = mpdStreams.filter((stream) => {
          return (('drm' in stream) && stream.drm.type == 'widevine-dash');
        });
        if (drmStreams && drmStreams.length) {
          streamObj.streamId = drmStreams[0].id;
          streamObj.streamType = drmStreams[0].type;
          streamObj.streamAssetType = drmStreams[0].assetType;
          streamObj.streamUrl = drmStreams[0].src;
          streamObj.drm = true;
          streamObj.drmType = drmStreams[0].drm.type;
          streamObj.streamFlags = drmStreams[0].flags;

          return streamObj;
        } else {
          streamObj.streamId = mpdStreams[0].id;
          streamObj.streamType = mpdStreams[0].type;
          streamObj.streamAssetType = mpdStreams[0].assetType;
          streamObj.streamUrl = mpdStreams[0].src;
          streamObj.drm = false;

          return streamObj;
        }
      }
      return undefined;
    },
    formatIsoDate(isoDate) {

      var theDate = new Date(isoDate);

      if (!(theDate) || isNaN(theDate)) {
        return undefined;
      }

      var day = theDate.getDate();
      var month = (theDate.getMonth() + 1);
      var year = theDate.getFullYear();
      var hours = theDate.getHours();
      var minutes = theDate.getMinutes();

      var date =  { day, month, year };
      var time = { hours, minutes };

      return { date, time };

    },  //  formatIsoDate
    isoDateDiff(date1, date2) {
      return '3 Month';
    },  //  date difference
    isObjectEmpty(obj) {
      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
      }
      return false;
    },
    getMyDeviceName() {
      if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return ('Opera browser');
      } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
        return ('Chrome browser');
      } else if(navigator.userAgent.indexOf("Safari") != -1) {
        return ('Safari browser');
      } else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
        return ('Firefox browser');
      } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return ('IE browser');
      } else {
        return ('unknown');
      }
    },
    capitalizeFirst(string) {
      if (typeof string == 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      return '';
    },
    altRange(min, max) {
      var rangeArr = [], j = 0;
      for(var i = min; i <= max; i++){
        i = (i.toString().length == 1) ? '0' + i : i;
        rangeArr[j] = i;
        j++;
      }
      return rangeArr;
    },
    getUniqueArray(arr) {
      var temp = {};
      for (var i = 0; i < arr.length; i++)
      temp[arr[i]] = true;
      var r = [];
      for (var k in temp)
      r.push(k);
      return r;
    },
    altDetectPlatform() {
      var unknown = '-';

      // // screen
      // var screenSize = '';
      // if (screen.width) {
      //     width = (screen.width) ? screen.width : '';
      //     height = (screen.height) ? screen.height : '';
      //     screenSize += '' + width + " x " + height;
      // }

      // browser
      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browser = navigator.appName;
      var version = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix;

      // Opera
      if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
          version = nAgt.substring(verOffset + 8);
        }
      }
      // Opera Next
      if ((verOffset = nAgt.indexOf('OPR')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
      }
      // Edge
      else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 5);
      }
      // MSIE
      else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
      }
      // Chrome
      else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
      }
      // Safari
      else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
          version = nAgt.substring(verOffset + 8);
        }
      }
      // Firefox
      else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
      }
      // MSIE 11+
      else if (nAgt.indexOf('Trident/') != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
      }
      // Other browsers
      else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
          browser = navigator.appName;
        }
      }
      // trim the version string
      if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
      if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
      if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

      majorVersion = parseInt('' + version, 10);
      if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      // mobile version
      var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

      // cookie
      var cookieEnabled = (navigator.cookieEnabled) ? true : false;

      if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
      }

      // system
      var os = unknown;
      var clientStrings = [
        {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 3.11', r:/Win16/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Linux', r:/(Linux|X11)/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
      ];
      for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
          os = cs.s;
          break;
        }
      }

      var osVersion = unknown;

      if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
      }

      switch (os) {
        case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        break;

        case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        break;

        case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
      }

      // NOTE added device make model
      var nAgt = undefined;
      nAgt = navigator.userAgent;
      let device = '';
      let device_make = null;
      let device_model = null;
      if (nAgt) {
        // Nexus Phones
        if (nAgt.indexOf('Nexus') !== -1) {
          device = nAgt.substring(nAgt.indexOf('Nexus'), nAgt.indexOf(')'));
          device_make = 'LG';
          device_model = device.substr(0, device.indexOf('Build'));
        }
        // Nokia Lumia Phones
        else if (nAgt.indexOf('Lumia') !== -1) {
          device_make = 'Nokia';
          device = device_make + ' ' + nAgt.substring(nAgt.indexOf('Lumia'), nAgt.indexOf(')'));
          device_model = device;
        }
        // Nokia N-Series
        else if (nAgt.indexOf('NokiaN') !== -1) {
          device = nAgt.substring(nAgt.indexOf('NokiaN'), nAgt.indexOf(')'));
          device_make = 'Nokia';
          device_model = device_make + ' ' + device.substring(device_make.length);
        }
        // iPad
        else if (nAgt.indexOf('iPad') !== -1) {
          device = nAgt.substring(nAgt.indexOf('iPad'), nAgt.indexOf(';'));
          device_make = 'Apple';
          device_model = device_make + ' ' + device;
        }
        // iPhone
        else if (nAgt.indexOf('iPhone') !== -1) {
          device = nAgt.substring(nAgt.indexOf('iPhone'), nAgt.indexOf(';'));
          device_make = 'Apple';
          device_model = device_make + ' ' + device;
        }
        // Pixel
        else if (nAgt.indexOf('Pixel') !== -1) {
          device = nAgt.substring(nAgt.indexOf('Pixel'), nAgt.indexOf(')'));
          device_make = 'Google';
          // device_model = device.substr(0, device.indexOf(' ', device.indexOf(' ') + 1));
          device_model = device.substr(0, device.indexOf('Build'));
        }
        // Blackberry
        if (nAgt.indexOf('BB') !== -1) {
          device = nAgt.substring(nAgt.indexOf('BB'), nAgt.indexOf(';'));
          device_make = 'BlackBerry';
          device_model = device_make + ' ' + device;
        }
        // Blackberry Playbook
        else if (nAgt.indexOf('PlayBook') !== -1) {
          device = nAgt.substring(nAgt.indexOf('PlayBook'), nAgt.indexOf(';'));
          device_make = 'BlackBerry';
          device_model = device_make + ' ' + device;
        }
        // Kindle Fire
        if (nAgt.indexOf('KFAPWI') !== -1) {
          device = nAgt.substring(nAgt.indexOf('KFAPWI'), nAgt.indexOf(')'));
          device_make = 'Kindle';
          device_model = device_make + ' ' + device.substr(0, device.indexOf('Build'));
        }
        // LG
        else if (nAgt.indexOf('LG') !== -1) {
          device = nAgt.substring(nAgt.indexOf('LG'), nAgt.indexOf(')'));
          device_make = 'LG';
          device_model = device_make + ' ' + device.substr(0, device.indexOf('Build'));
        }
        // other mobile model
        else {
          var split_mobile_model = [];
          var split_mobile_model_again = [];
          if (nAgt.indexOf('Build') !== -1) {
            split_mobile_model = nAgt.split('Build')[0];
            split_mobile_model_again = split_mobile_model.split(';');
            device_model = split_mobile_model_again[split_mobile_model_again.length - 1];
            device_model = device_model.trim();
          }
        }
      }
      // console.log("mixins.js|device_model",device_model);
      // end of device make model

      // flash (you'll need to include swfobject)
      /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
      var flashVersion = 'no check';
      if (typeof swfobject != 'undefined') {
        var fv = swfobject.getFlashPlayerVersion();
        if (fv.major > 0) {
          flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
        }
        else  {
          flashVersion = unknown;
        }
      }

      return {
        // screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion,
        device_model: device_model
      };
    },
    revObject(object) {
      var length=Object.keys(object).length;
      var arr=[];
      for (var i=length-1;i>=0;i--) {
        arr.push(object[i]);
      }
      return arr;
    },
    isInArray(value, array) {
      return array.indexOf(value);
    },
    getDeviceOrientation() {
      if (window && window.screen) {
        // console.log('[getDeviceOrientation | ]', window.screen.orientation);
        // console.log('[getDeviceOrientation | angle ]', window.screen.orientation.angle);

        return (window.screen.orientation.angle == 0) ? 'portrait' : 'landscape';
      }
      return 'N.A';
    },
    getPlayerEventMode() {
      if(localStorage.getItem("modeType")) {
        return localStorage.getItem("modeType");
      }
      return "fullscreen";
    },
    clearUserData() {
      localStorage.removeItem('altUser');
      localStorage.removeItem('altDevice');
      localStorage.removeItem('altAccount');
      localStorage.removeItem('altOrder');
      localStorage.removeItem('account_id');
      localStorage.removeItem('token');
      localStorage.removeItem('user_birthday');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_gender');
      localStorage.removeItem('user_name');
      localStorage.removeItem('altDefSearches');
      localStorage.removeItem('mediaProgressList');
      // removeItem for notifications 13/12/2017 sumit
      localStorage.removeItem("deleteNotificationNotify");
      localStorage.removeItem("notifications");
      // added by SUMIT for notification flag
      localStorage.removeItem("notificationFlag");
      //added by sumit badge remove of count
      localStorage.removeItem('notificationsCount');

      localStorage.removeItem('paytmLinkHashCode');
      localStorage.removeItem('orderList');
      localStorage.removeItem("partner_id");
      localStorage.removeItem("campaign-redirect");
      localStorage.removeItem("user_state");
      localStorage.removeItem("user_mobile");
      // localStorage.removeItem("selectedGateway");


      // Removes prefered language information from local storage
      // Check whether the user has selected language already
      if (localStorage.getItem('pref_language_data')) {
        let pref_language_data = {
          userType: 'anonymous',
          emitted: true
        };

        // Save to local storage
        localStorage.setItem('pref_language_data', JSON.stringify(pref_language_data));
      }

      localStorage.removeItem('Regional-language');
      localStorage.removeItem("isCampaign");

      if (localStorage.getItem('visitedDomain')) {
        localStorage.setItem("homeDomain", localStorage.getItem('visitedDomain'));
      }
      localStorage.removeItem("promotional-redirect");
      localStorage.removeItem('ixigo-pin');
  
    },
    projectCheckedRemove() {
      localStorage.removeItem("promotional-redirect");
      localStorage.removeItem("isCampaign");
      localStorage.removeItem("campaign-redirect");
      
       localStorage.removeItem("price_symbol");
       localStorage.removeItem("product-title");
       localStorage.removeItem("productCurrency");
       localStorage.removeItem("productId");
       localStorage.removeItem("productTitle");
       localStorage.removeItem("product_Price");
       localStorage.removeItem("product_order");
       localStorage.removeItem("product_validation");
    },
    AWSUserType() {
      let altUser = null;
      let altOrder = null;
      altUser = localStorage.getItem('altUser') ? localStorage.getItem('altUser') : null;
      altOrder = localStorage.getItem('altOrder') ? JSON.parse(localStorage.getItem('altOrder')) : null;
      if(altUser) {
        if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          return 'subscribed';
        }
        return 'registered';
      } else {
        return 'anonymous';
      }

    },
    getAWSMACommonAttributes() {
      var AWSMACommonAttrs = {};

      // NOTE @sumit new global attribute added for user type;
      let user_type = null;
      try {
        user_type = this.AWSUserType();
      } catch(err) {
        user_type = 'N.A';
      }
      // Get the environment attributes
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
      AWSMACommonAttrs.app_env = altConfig && altConfig.environment && altConfig.environment.title ? altConfig.environment.title : 'N.A';

      // Get GeoLocation attributes
      var altGeoData = undefined;
      if (localStorage.getItem('altGeoData')) {
        altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
      }

      // console.log('[mixins | getAWSMACommonAttributess | altGeoData | ]', altGeoData);

      AWSMACommonAttrs.geo_country = (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : 'N.A';
      AWSMACommonAttrs.geo_city = (altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? altGeoData.city.names.en : 'N.A';
      AWSMACommonAttrs.geo_latitude = (altGeoData && altGeoData.location && altGeoData.location.latitude) ? altGeoData.location.latitude : 'N.A';
      AWSMACommonAttrs.geo_longitude = (altGeoData && altGeoData.location && altGeoData.location.longitude) ? altGeoData.location.longitude : 'N.A';
      AWSMACommonAttrs.geo_region = (altGeoData && altGeoData.subdivisions && altGeoData.subdivisions.length && altGeoData.subdivisions[0].names && altGeoData.subdivisions[0].names.en) ? altGeoData.subdivisions[0].names.en : 'N.A';
      AWSMACommonAttrs.geo_zipcode = 'N.A';
      AWSMACommonAttrs.ip_address = (altGeoData && altGeoData.ip_address) ? altGeoData.ip_address : 'N.A';

      // Get the platform attributes
      var altPlatform = this.altDetectPlatform();

      // console.log('[mixins | getAWSMACommonAttributess | altPlatform | ]', altPlatform);

      AWSMACommonAttrs.br_name = (altPlatform && altPlatform.browser) ? altPlatform.browser : 'N.A';
      AWSMACommonAttrs.br_family = (altPlatform && (altPlatform.browser || altPlatform.browserVersion)) ? ((altPlatform.browser ? altPlatform.browser : '') + (altPlatform.browserVersion ? '-' + altPlatform.browserVersion : '')) : 'N.A';
      AWSMACommonAttrs.br_version = (altPlatform && altPlatform.browserVersion) ? altPlatform.browserVersion : 'N.A';
      AWSMACommonAttrs.br_type = (altPlatform && altPlatform.browser) ? altPlatform.browser : 'N.A';

      // Get the user attributes
      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }
      var altAccount = undefined;
      if (localStorage.getItem('altAccount')) {
        altAccount = JSON.parse(localStorage.getItem('altAccount'));
      }
      // console.log('[mixins | getAWSMACommonAttributess | altUser | ]', altUser);
      // console.log('[mixins | getAWSMACommonAttributess | altAccount | ]', altAccount);

      AWSMACommonAttrs.user_id = altUser && altUser.profileId ? altUser.profileId : 'N.A';
      AWSMACommonAttrs.user_email = altUser && altUser.login ? altUser.login : 'N.A';
      // NOTE as discussion with tej sir.

      AWSMACommonAttrs.user_session = null;
      AWSMACommonAttrs.user_name = altAccount && altAccount.name ? altAccount.name : 'N.A';
      AWSMACommonAttrs.user_dob = altAccount && altAccount.details && altAccount.details.birthday ? altAccount.details.birthday : 'N.A';
      AWSMACommonAttrs.user_gender = altAccount && altAccount.details && altAccount.details.gender ? altAccount.details.gender : 'N.A';
      AWSMACommonAttrs.partner_id = localStorage.getItem("partner_id") ? localStorage.getItem("partner_id") : null;
      AWSMACommonAttrs.user_state = localStorage.getItem("user_state") ? localStorage.getItem("user_state") : null;
      AWSMACommonAttrs.user_mobile = localStorage.getItem("user_mobile") ? localStorage.getItem("user_mobile") : null;
      // NOTE @sumit new global attribute added.
      AWSMACommonAttrs.user_type = user_type;

      return AWSMACommonAttrs;
    },
    sendGTMpageViewData(title, parentTitle, episodeTitle) {
      title = title || ''
      parentTitle = parentTitle || ''
      episodeTitle = episodeTitle || ''

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'gt_page_view',
        'eventAction': 'page view',
        'eventCategory': 'gt_page_view',
        'eventLabel': 'page view',
        'eventValue': 1,
        'gtl_page_title': title,
        'gtl_content_parent_title': parentTitle,
        'gtl_episode_title': episodeTitle
      });
      // if(title == 'media') {
      //     return;
      // }
      // if(title == "login" || title == 'signup') {
      //     title = (title == "login") ? "sign in" : "sign up";
      // }
      // console.log(" sendGTMpageViewData | title",title,",parentTitle | ",parentTitle);
      //
      // if(webengage) {
      //     webengage.track('gt_page_view' , {
      //         'gt_page_title' : title.toLowerCase(),
      //         'gt_content_parent_title' : parentTitle,
      //         'gt_episode_title' : episodeTitle
      //     });
      // }

    },
    webEnagePageView(title, parentTitle, episodeTitle,showId) {
      title = title || '';
      parentTitle = parentTitle || '';
      episodeTitle = episodeTitle || '';
      showId = showId || '';

      if(title) {
        let config = undefined;
        let excludeTitle = undefined;
        config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
        excludeTitle = (config && config.webEngage && config.webEngage.excludeTitle) ? config.webEngage.excludeTitle : '';
        for(let i in excludeTitle) {
          title = title.toLowerCase();
          if(excludeTitle[i].toLowerCase() == title) {
            return;
          }
        }
      }
      // console.log(" webEnagePageView | title",title,",parentTitle | ",parentTitle);
      let pageViewData = {};
       pageViewData = {
        'gt_page_title' : title,
        // 'gt_content_parent_title' : parentTitle,
        // 'gt_episode_title' : episodeTitle
      };
      if(title && title == 'show details' && showId) {
        pageViewData['gt_content_parent_title'] = parentTitle.toLowerCase();
        pageViewData['gt_content_parent_ID'] = showId;
      }
      if(webengage) {
        console.log("webEnagePageView || pageViewData",pageViewData);
        webengage.track('gt_page_view' ,pageViewData);
      }
    },
    getSignedHeaders(request_body,time,user_type) {
      var hmac_SHA256 = require("crypto-js/hmac-sha256");
      var _auth = {
        "partner_id": "714646886syndication@promopartner.com",
        "partner_password": "266e6bbc8782b2c95747ac4a064a1a17"
      }
      var timestamp = time;
      var domain = user_type;
      //  // console.log("request_body",request_body);
      var input_string = timestamp + "|domain=" + domain + "|" + JSON.stringify(request_body);
      var signedHeader = hmac_SHA256(input_string,_auth['partner_password']);
      // console.log("auth",_auth,"signedHeader",signedHeader.toString(),"timestamp",timestamp);
      return {"signedHeader":signedHeader.toString(),"auth":_auth};
    },
    getTimestamp() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      month = month.toString().length == 1 ? '0' + month : month;
      var date = now.getDate();
      date = date.toString().length == 1 ? '0' + date : date;
      var hour = now.getHours();
      var minute = now.getMinutes();
      minute = minute.toString().length == 1 ? '0' + minute : minute;
      var second = now.getSeconds();
      var timeStamp = year + month + date + hour + minute + second;
      return timeStamp;
    },
    geoBlockCountryWise(geoData) {
      let data = geoData.split(",");
      let item = undefined;
      let altGeoData = localStorage.getItem("altGeoData") ? JSON.parse(localStorage.getItem("altGeoData")) : undefined;
      let geoCountry = altGeoData && altGeoData.country && altGeoData.country.iso_code ? altGeoData.country.iso_code : undefined;
      if(geoCountry && data) {
        for(item in data) {
          if(data[item].toLowerCase() == geoCountry.toLowerCase()) {
            // console.log("geoCountry",data[item]);
            //eventBus.$emit('toggleCountrywiseVideoBlock', true);
            return true;
          }
        }
      }
      return false;
    },
    hideVideoController(state, from = false) {
      if (from) {
        // console.log('[mixins > hideVideoController > state]', state);
        // console.log('[mixins > hideVideoController > from]', from);
      }

      let controls = document.getElementById('v-controls');
      if(controls) {
        controls.style.display = state ? "block" : "none";
      } else {
        // console.log("not found");
      }
    },
    shortString(title, len) {
      len = len || 15
      if(title.length > len) {
        return title.substring(0,len) + "...";
      } else {
        return title;
      }
    },
  },
}
