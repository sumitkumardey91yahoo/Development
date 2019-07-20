<template>
    <div class="alt-home">
      <component :is="templateMode"></component>

      <AppOffline v-if="offline"></AppOffline>
    </div>
</template>

<script>
// Code change @sangeeth
import Default from './Modes/Default.vue';
import Kids from './Modes/Kids.vue';

// Code change @sangeeth - redefining Offline component
const AppOffline = () => import (/* webpackChunkName: "home-Home-AppOffline" */ '@/components/shared/AppOffline.vue');

const homeFeatured = () => import (/* webpackChunkName: "home-Home-homeFeatured" */ './HomeFeatured.vue');
const homeGrid = () => import (/* webpackChunkName: "home-Home-homeGrid */ './HomeGrid.vue');
const Search = () => import (/* webpackChunkName: "home-Home-Search" */ '../shared/Search.vue');
const Modals = () => import (/* webpackChunkName: "home-Home-Modals" */ '../shared/Modals.vue');
const Header = () => import (/* webpackChunkName: "home-Home-Header" */ './Header.vue');
const AltSnackbar = () => import (/* webpackChunkName: "home-Home-AltSnackbar" */ '../popups/Snackbar.vue');


import { eventBus } from '../../main'
import { altMixins } from '../../mixins'
import { store } from '../../store/store'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      templateMode: null,
      offline: false,
      showSearch: false,
      showCreateKidsPin: false,
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
      'recentWatchedItems'
    ]),
  },
  watch: {
    appActive() {
      this.setHomeHeader();
    },
    '$route'(to, from) {
      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      this.createdChangeHeaderTitle(to.name);
    },
  },
  created() {
    this.initAWSParams();
    this.assertTemplateMode();

    document.body.scrollTop = document.documentElement.scrollTop = 0;
    /**
    * search button click event listener
    */
    eventBus.$on('togglePopupSearch', (state) => {
      this.showSearch = state;
    });

    // When exiting from kids mode, as the page is not refresing, we need to listen to this emit, which will call the method 'assertTemplateMode' which determines which template to render in the home page. As the design got changed according to the new requirement, we need to make the change. The design is different in default mode and kids mode.
    eventBus.$on('toggleAppModeChangeEvent', this.toggleAppModeChangeCB);

    eventBus.$on('closeSearchEvent', () => {
      this.showSearch = false;
    });
    eventBus.$on('toggleCreateKidsPinEvent', (state) => {
      this.showCreateKidsPin = state;
    });
    eventBus.$on('toggleOfflineEvent', this.toggleOfflineCB);
    eventBus.$on('toggleAppModeChangeEvent', this.homeAppModeChangeCB);

    eventBus.$on('togglePlayerScreenFlagEnable',(state) => {
      this.playerScreenFlag = state;
    });

    var user = JSON.parse(localStorage.getItem('altUser'));
    if (user && user.email) {
      this.setUserLoggedIn(true);
    } else {
      this.setUserLoggedIn(false);
    }
  },
  mounted() {
    if (this.appActive) {
      this.setHomeHeader();
      let altApp = document.getElementById('alt-app');
      if (altApp) {
        altApp.style.position = 'relative';
      }

    }

    var showMenu = document.getElementById('showMenu');
    if (showMenu) {
      showMenu.style.display = 'block';
    }
  },
  methods: {
    ...mapMutations([
      'setUserLoggedIn',
      'setRouterToParam',
      'setSubsectionListing'
    ]),
    ...mapActions([
      'actGetSections',
    ]),
    // CODE CHANGE @SANGEETH - Issue #1013(2)
    initAWSParams () {
     // console.log('[initAWSParams > this.$route]', this.$route);

      let awsParams;
      if (localStorage.getItem('AWS_PARAMS')) {
        awsParams = JSON.parse(localStorage.getItem('AWS_PARAMS'));
      } else {

        // awsParams = {
        //   name:
        // }
      }
    },
    // END CODE CHANGE @SANGEETH

    // Code change @sangeeth
    assertTemplateMode () {
      // console.log('[assertTemplateMode]');

      if (localStorage.getItem('altProfileMode')) {
        let altProfileMode = localStorage.getItem('altProfileMode');

        if (altProfileMode === 'default') {
          this.templateMode = 'Default';
        } else if (altProfileMode === 'kids') {
          this.templateMode = 'Kids';
        }
      }
    },
    createdChangeHeaderTitle(name) {
      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      if (this.appActive) {
        if (name == 'home') {
          this.setHeaderTitle(false);

          if (altProfileMode == 'default') {
            this.toggleDefaultLogo(true);
            this.toggleKidsLogo(false);
          } else {
            this.toggleDefaultLogo(false);
            this.toggleKidsLogo(true);
          }
        } else {
          this.setHeaderTitle(name);
        }
      } else {
        var defaultHeaderLogo = document.getElementById('header-logo-default');

        if (name == 'home') {
          if (defaultHeaderLogo) {
            defaultHeaderLogo.style.display = 'inline';
          }
        } else {
          if (defaultHeaderLogo) {
            defaultHeaderLogo.style.display = 'none';
          }
        }
      }
    },
    setHomeHeader() {
      this.createdChangeHeaderTitle(this.$route.name);
      this.toggleLoader(true);

      this.toggleSearchIco(true);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);
    },
    homeAppModeChangeCB() {
      // this.createdChangeHeaderTitle('home');
    },
    toggleOfflineCB (state) {
      this.offline = state;
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

    // When exiting from kids mode, as the page is not refresing, we need to listen to this emit, which will call the method 'assertTemplateMode' which determines which template to render in the home page. As the design got changed according to the new requirement, we need to make the change. The design is different in default mode and kids mode. This will change the data property 'templateMode'.
    toggleAppModeChangeCB () {
      this.assertTemplateMode();
    }
  },
  beforeRouteEnter: (to, from, next) => {
    var altProfileMode = undefined;
    if (localStorage.getItem('altProfileMode')) {
      altProfileMode = localStorage.getItem('altProfileMode');
    } else {
      altProfileMode = 'default';
      localStorage.setItem('altProfileMode', altProfileMode);
    }

    if (altProfileMode == 'kids') {
      if (to.name == 'home') {
        next();
      } else {
        next({ name: 'home' });
      }
    } else {
      next();
    }
  },
  beforeRouteLeave: (to, from, next) => {
    var altProfileMode = undefined;
    if (localStorage.getItem('altProfileMode')) {
      altProfileMode = localStorage.getItem('altProfileMode');
    } else {
      altProfileMode = 'default';
      localStorage.setItem('altProfileMode', altProfileMode);
    }

    if (altProfileMode == 'kids') {
      var accessibleRoutes = ['home', 'show', 'episode', 'media'];

      if (accessibleRoutes.indexOf(to.name) > -1) next();
    } else {
      next();
    }
  },
  components: {
    'home-header': Header,
    'home-search': Search,
    'home-featured': homeFeatured,
    'home-grid': homeGrid,
    'alt-modals': Modals,
    'alt-snackbar': AltSnackbar,
    Default,
    Kids,
    AppOffline
  },
  mixins: [altMixins]
}

</script>
