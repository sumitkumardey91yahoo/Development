<template>
  <div>
    <!-- <settings-header></settings-header> -->
    <div class="auth-container setting-help-container">
      <nav class="top-menu">
        <a class="nav-menu" v-if="isUserLoggedIn" @click="changeComponent('AppSettings')" :class="(activeComponent == 'AppSettings')? 'active' : ''">App Settings</a>
        <a class="nav-menu" v-if="isUserLoggedIn" @click="changeComponent('account')" :class="(activeComponent == 'account')? 'active' : ''">Account</a>
      </nav>
      <component :is="activeComponent"></component>
    </div>
    <logout-popup v-show="showLogout"></logout-popup>
    <!-- <kids-create-pin v-show="showCreateKidsPin"></kids-create-pin> -->
    <alt-modals></alt-modals>
  </div>
</template>

<script>
// const Header = () => import (/* webpackChunkName: "settings-Settings-Header" */ './Header.vue');
const Account = () => import (/* webpackChunkName: "settings-Settings-account" */ './Account.vue');
const AppSettings = () => import (/* webpackChunkName: "settings-Settings-AppSettings" */ './AppSettings/AppSettings.vue');
const LogoutPopup = () => import (/* webpackChunkName: "settings-Settings-LogoutPopup" */ './LogoutPopup.vue');
const Modals = () => import (/* webpackChunkName: "settings-Settings-Modals" */ '../shared/Modals.vue');
const KidsCreatePin = () => import (/* webpackChunkName: "settings-Settings-KidsCreatePin" */ '../shared/KidsCreatePin.vue');

import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// import Header from './Header.vue';
// import Account from './Account.vue';
// import About from './About.vue';
// import LogoutPopup from './LogoutPopup.vue';
// import Modals from '../shared/Modals.vue';

export default {
  data() {
    return {
      // Two components are registered. 'AppSettings' & 'account'. Change the
      // activeComponent value to either of this and the tab of active component
      // will change accordingly
      activeComponent: 'AppSettings',
      showLogout: false,
      showCreateKidsPin: false
    };
  },
  computed: {
    ...mapGetters([
      'appActive'
    ]),
    isUserLoggedIn() {
      var user = JSON.parse(localStorage.getItem('altUser'));
      if (user && user.email && user.sessionToken) {
        return true;
      }
      return false;
    },
  },
  methods: {
    setSettingsPageHeader() {
      this.setHeaderTitle('Settings');

      this.toggleSearchIco(false);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);
      this.toggleDefaultLogo();
    },
    changeComponent(name) {
      this.activeComponent = name;
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
    stuffMenuSelectAttributes( sectionTitle, sectionId) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = sectionTitle;
      eventAttributeObj.section_id = sectionId.toString();

      return eventAttributeObj;
    },
    stuffPageViewAttributes( pageTitle, pageUrl) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = pageTitle;
      eventAttributeObj.page_url = pageUrl;

      return eventAttributeObj;
    },
  },
  created() {
    this.toggleLoader(true);

    eventBus.$on('toggleLogoutPopupEvent', (state) => {
      this.showLogout = state;
    });
    eventBus.$on('toggleCreateKidsPinEvent', (state) => {
      this.showCreateKidsPin = state;
    });

    // AWS Mobile SDK Events
    if (window.mobileAnalyticsClient) {
      var pageTitle = "Settings";

      // var menuSelectAttributes = this.getAWSMACommonAttributes();
      // menuSelectAttributes.page_title = pageTitle;
      // menuSelectAttributes.section_id = 'N.A';
      // window.mobileAnalyticsClient.recordEvent('_menu.select', menuSelectAttributes, {});
      //
      // // NOTE: Code commented for AWSMA redefinition
      // // window.mobileAnalyticsClient.recordEvent('_menu.select', this.stuffMenuSelectAttributes(pageTitle, "N.A."), {});
      //
      // var pageSelectAttributes = this.getAWSMACommonAttributes();
      // pageSelectAttributes.page_title = pageTitle;
      // pageSelectAttributes.page_url = window.location.href;
      // window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});

      // NOTE: Code commented for AWSMA redefinition
      // window.mobileAnalyticsClient.recordEvent('_page.view', this.stuffPageViewAttributes(pageTitle, window.location.href), {});
    }
    // End of AWS Mobile SDK Events

    var user = JSON.parse(localStorage.getItem('altUser'));
    if (!(user)) {
      this.activeComponent = 'account';
    }
  },
  mounted() {
    this.setSettingsPageHeader();
  },
  components: {
    // 'settings-header': Header,
    'account': Account,
    AppSettings,
    'alt-modals': Modals,
    'logout-popup': LogoutPopup,
    'kids-create-pin': KidsCreatePin,
  },
  beforeRouteEnter: (to, from, next) => {

    var altProfileMode = localStorage.getItem('altProfileMode');
    if (altProfileMode == 'kids') {
      next({ name: 'kidsMode' })
    } else {
      next();
    }
  },
  mixins: [altMixins]
}
</script>
