<template>
  <div class="kids">
    <section-nav></section-nav>
    <kids-contents></kids-contents>
    <kids-load-more></kids-load-more>
    <kids-search v-show="showKidsSearch"></kids-search>
    <alt-modals></alt-modals>
  </div>
</template>

<script>
// import CryptoJS from 'crypto-js';
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { store } from '../../store/store';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const Header = () => import (/* webpackChunkName: "kids-Kids-Header" */ './Header.vue');
const SectionNav = () => import (/* webpackChunkName: "kids-Kids-SectionNav" */ './SectionNav.vue');
const Contents = () => import (/* webpackChunkName: "kids-Kids-Contents" */ './Contents.vue');
const KidsLoadMore = () => import (/* webpackChunkName: "kids-Kids-KidsLoadMore" */ './KidsLoadMore.vue');
const Modals = () => import (/* webpackChunkName: "kids-Kids-Modals" */ '../shared/Modals.vue');
const KidsSearch = () => import (/* webpackChunkName: "kids-Kids-KidsSearch" */ '../shared/KidsSearch.vue');

// import Header from './Header.vue';
// import SectionNav from './SectionNav.vue';
// import Contents from './Contents.vue';
// import KidsLoadMore from './KidsLoadMore.vue';
// import Modals from '../shared/Modals.vue';
// import KidsSearch from '../shared/KidsSearch.vue';

export default {
  data() {
    return {
      pinError: false,
      pinErrorMessage: '',
      altKidsUser: undefined,
      username: undefined,
      password: undefined,
      altUser: undefined,
      altAccount: undefined,
      showKidsSearch: false,
    };
  },
  computed: {
    ...mapGetters([
      'altKidsProfile',
      'passphrase',
    ])
  },
  methods: {
    ...mapMutations([
    'setAltKidsUser',
    'setUser',
    'setAccount',
    ]),
    ...mapActions([
    'actGetKidsProfileSwitch',
    'actCheckWithAccount',
    'actGetUserLogin',
    'actGetAccountDetails',
    'actGetDeviceList',
    'actRegisterDevice',
    'actGetOrders',
    ]),
    checkSwitchUser(event) {
      this.pinError = false;
      this.pinErrorMessage = '';

      if (event.target.value.length == 4) {
        var pin = event.target.value;

        this.actGetKidsProfileSwitch(pin).then((response) => {
          // console.log('[Kids | checkSwitchUser | actGetProfileSwitch | response | ]', response);

          if (response.status == 'ok') {
            var altUser = JSON.parse(localStorage.getItem('altUser'));
            this.username = altUser.login;
            // this.password = CryptoJS.AES.decrypt(altUser.password, this.passphrase).toString(CryptoJS.enc.Utf8);

            // console.log('[Kids | checkSwitchUser | decryptedPassword ]', password);

            this.getLogin();

            // NOTE: TO BE REVERTED BACK
            // localStorage.removeItem('altUser');
            // localStorage.setItem('altProfileMode', 'default');
            // this.$router.push({ name: 'home' });
          }
        }, (error) => {
          if (error.status == 'error') {
            this.pinErrorMessage = error.message;
            this.pinError = true;
          }
        })
      }
    },
    getLogin() {
      /**
      * show loader
      */
      this.toggleLoader(true);

      /**
      * [Action | actions.js]
      */
      this.actGetUserLogin({
        username: this.username,
        password: this.password
      }).then(
      (response) => {
        /**
        * return property with status = ok if success
        */
        // console.log('[LoginForm | getLogin | response]', response);

        var account = response.account;
        var profile = response.account.profile;
        // var encryptedPassword = CryptoJS.AES.encrypt(this.password, this.passphrase).toString();

        // console.log('[LoginForm | getLogin | encryptedPassword]', encryptedPassword);

        var altUser = {
          sessionToken: (response.session_token) ? response.session_token : '',
          dateCreated: (account.date_created) ? account.date_created : '',
          email: (account.email) ? account.email : '',
          accountId: (account.id) ? account.id : '',
          isAdmin: (account.is_admin) ? account.is_admin : '',
          login: (account.login) ? account.login : '',
          username: (profile.username) ? profile.username : '',
          profileId: (profile.id) ? profile.id : '',
          password: encryptedPassword,
        }

        localStorage.setItem('token', response.session_token);
        localStorage.setItem('user_email', response.account.email);
        localStorage.setItem('account_id', response.account.id);
        /**
        * temporarily setting to property
        */
        this.altUser = altUser;
        /**
        * [mutation | mutations.js]
        */
        // this.setUser(altUser);
        /**
        * API call for account lookup
        */
        this.getAccountLookup();
      },
      (error) => {
        this.toggleAltPopup(true, error.message);
        this.toggleLoader(false);


        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj  = {}
          var geo_location = localStorage.getItem('geo_location');
          var altConfig = JSON.parse(localStorage.getItem('altConfig'));

          if (geo_location) {
            geo_location = JSON.parse(geo_location);
            eventAttributeObj = geo_location;
          }
          eventAttributeObj.user_email = localStorage.getItem('user_email');
          eventAttributeObj.user_id = localStorage.getItem('account_id');
          eventAttributeObj.user_session = localStorage.getItem('token');
          eventAttributeObj.user_name = localStorage.getItem('user_name');
          eventAttributeObj.user_dob = localStorage.getItem('user_birthday');
          eventAttributeObj.user_gender = localStorage.getItem('user_gender');
          eventAttributeObj.app_env = altConfig.environment.title;
          eventAttributeObj.event_action = 'error';
          eventAttributeObj.event_message = error.message;
          eventAttributeObj.event_code = error.code.toString();
          window.mobileAnalyticsClient.recordEvent( '_user.login', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      }
      )
    },
    getAccountLookup() {
      this.actGetAccountDetails(this.altUser).then(
      (response) => {
        // console.log('[LoginForm | getAccountLookup | actGetAccountDetails | ]', response);

        this.altAccount = {
          dateCreated: this.formatIsoDate(response.date_created),
          details: response.details,
          emailVerified: response.email_verified,
          marketingConcent: response.marketing_consent,
          phoneNumber: response.phone_number,
          profile: response.profile,
        }

        localStorage.setItem('user_name', response.name + " " + response.surname);
        localStorage.setItem('user_birthday', (response.details.birthday) ? response.details.birthday : '');
        localStorage.setItem('user_gender', (response.details.gender) ? response.details.gender : '');


        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj  = {};
          var geo_location = localStorage.getItem('geo_location');
          var altConfig = JSON.parse(localStorage.getItem('altConfig'));

          if (geo_location) {
            geo_location = JSON.parse(geo_location);
            eventAttributeObj = geo_location;
          }
          eventAttributeObj.user_email = localStorage.getItem('user_email');
          eventAttributeObj.user_id = localStorage.getItem('account_id');
          eventAttributeObj.user_session = localStorage.getItem('token');
          eventAttributeObj.user_name = localStorage.getItem('user_name');
          eventAttributeObj.user_dob = localStorage.getItem('user_birthday');
          eventAttributeObj.user_gender = localStorage.getItem('user_gender');
          eventAttributeObj.app_env = altConfig.environment.title;
          eventAttributeObj.event_mode = 'email';
          window.mobileAnalyticsClient.recordEvent( '_user.login', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events

        /**
        * get the devices for the account
        */
        this.getDevice();
      },
      (err) => {
        // console.log(err);
      }
      )
    },
    getDevice() {
      var altDeviceId = localStorage.getItem('altDeviceId');
      /**
      * if deviceid is not present in localStorage calling the register device api
      * [actions.js]
      */
      if (!(altDeviceId)) {
        /**
        * generating a randon device id and saving to localStorage
        * [mixins.js]
        */
        altDeviceId = this.generateRandomId(32);

        // console.log('[LoginForm | getDevice | New deviceId Generated | ]', altDeviceId);
      }
      /**
      * call to device list api
      * [actions.js]
      */
      this.actGetDeviceList(this.altUser).then(
      (response) => {

        if (response.count) {
          var devices = response.devices;

          // console.log('[LoginForm | actGetDeviceList | devices | ]',devices);

          var matchedDevice = devices.filter((device) => {
            return device.uuid == altDeviceId;
          });

          if (matchedDevice && matchedDevice.length) {
            var deviceObj = matchedDevice[0];

            // console.log('[LoginForm | actGetDeviceList | matchedDevice | ]',deviceObj);
            /**
            * save altDevice to localStorage
            */
            this.saveDevice(deviceObj);
            /**
            * get the order
            */
            this.getOrder();
          } else {
            /**
            * if no device matched in the list
            */
            this.registerDevice({ user: this.altUser, deviceId: altDeviceId });
          }
          /**
          * get the orders
          */

        } else {
          /**
          * if device list is empty, register the device
          */
          this.registerDevice({ user: this.altUser, deviceId: altDeviceId });
        }
      },
      (err) => {
        // console.log(err);
      }
      )
    },
    registerDevice(deviceId) {
      // console.log('[LoginForm | registerDevice | passed deviceId | ]', deviceId);

      this.actRegisterDevice(deviceId).then(
      (response) => {
        // console.log('[LoginForm | registerDevice | response | ]', response);

        if (response) {
          /**
          * save altDevice to localStorage
          */
          this.saveDevice(response);
          /**
          * after registering device get the order
          */
          this.getOrder();
        }
      },
      (err) => {
        // NOTE: HANDLE THE DEVICE REGISTER EXCEPTION HERE
        if (err) {
          // console.log('[Device registration error]', err.message);
          localStorage.removeItem('altDeviceId');
          localStorage.setItem('altDeviceId', this.generateRandomId(32));
          this.setUser(this.altUser);
          this.setAccount(this.altAccount);
          this.toggleLoader(false);
          /**
          * show clear device popup
          */
          this.toggleClearDevicealert(true);
        }
      }
      )
    },
    getOrder() {
      /**
      * [action | actions.js]
      */
      this.actGetOrders(this.altUser).then(
      (response) => {
        if (response.count && response.orders) {
          this.processOrders(response.orders[0]);
        } else {
          this.toggleLoader(false);
          localStorage.removeItem('altUser');
          localStorage.setItem('altProfileMode', 'default');
          this.$router.push({ name: 'home' });

          // NOTE: OLD CODE
          // this.$router.push({ name: 'home' });
        }
      },
      (err) => {
        // console.log(err);
      }
      )
    },
    processOrders(order) {
      // console.log(order);
      var domain = (this.domain).toLowerCase();
      var price = order.price;
      var product = order.product;
      var altOrder = {
        accountId: (order.account) ? order.account : '',
        orderId: (order.id) ? order.id: '',
        inProcessing: order.in_processing,
        isTrial: order.is_trial,
        paymentType: (order.payment_type) ? order.payment_type : '',
        amount: (price.amount) ? price.amount: '',
        currency: (price.currency) ? price.currency: '',
        domain: (price.domain) ? price.domain: '',
        realAmount: (price.real_amount) ? price.real_amount: '',
        productId: product.id,
        recurring: product.recurring,
        productType: product.type,
        productTitle: product.titles.default,
      }
      localStorage.setItem('altOrder', JSON.stringify(altOrder));

      this.toggleLoader(false);

      localStorage.setItem('altProfileMode', 'default');
      this.$router.push({ name: 'home' });


      // if (this.routerToParam) {
      // console.log('[LoginForm | processOrders | routerToParam | ]', this.routerToParam);
      // if (this.routerToParam.name == 'kidsMode') {
      //     localStorage.setItem('altProfileMode', '')
      // }
      //     this.$router.push({ name: this.routerToParam.name });
      // } else {
      //     // console.log('[LoginForm | processOrders | routerToParam does not exists | ]');
      //     this.$router.push({ name: 'home' });
      // }
    },
    saveDevice(deviceObj) {
      // console.log('LoginForm | saveDevice | deviceObj | ', deviceObj);

      var altDevice = {
        uuid: deviceObj.uuid,
        appVersion: deviceObj.app_version,
        deviceId: deviceObj.id,
        ipAddress: deviceObj.ip_address,
        name: deviceObj.name,
        type: deviceObj.type,
        userAgent: deviceObj.user_agent,
      }
      /**
      * finally setting everything to localStorage
      */
      // console.log('LoginForm | saveDevice | altUser | ', this.altUser);

      localStorage.setItem('altUser', JSON.stringify(this.altUser));
      localStorage.setItem('altAccount', JSON.stringify(this.altAccount));
      localStorage.setItem('altDevice', JSON.stringify(altDevice));

      // this.setUserLoggedIn(true);
      // this.setUserLoggedIn();
    },
  },
  components: {
    'kids-header': Header,
    'section-nav': SectionNav,
    'kids-contents': Contents,
    'alt-modals': Modals,
    'kids-search': KidsSearch,
    'kids-load-more': KidsLoadMore,
  },
  created() {
    eventBus.$on('toggleKidsSearchEvent', (state) => {
      this.showKidsSearch = state;
    });
  },
  beforeRouteEnter: (to, from, next) => {
    //  // console.log('[Kids | beforeRouteEnter | to | ]', to);
    //  // console.log('[Kids | beforeRouteEnter | from | ]', from);
    // console.log('[Kids | beforeRouteEnter | | this ]', this);
    // console.log('[Kids | beforeRouteEnter | accessToKidsMode | ]', store.getters.accessToKidsMode);
    // console.log('[Kids | checkUserAccount | altMixins | ]', altMixins);


    store.commit('setRouterFromParam', to);
    store.commit('setRouterToParam', to);

    // console.log('[Kids | beforeRouteEnter | routerToParam | ]', store.getters.routerToParam);
    // console.log('[Kids | beforeRouteEnter | routerFromParam | ]', store.getters.routerFromParam);


    var altProfileMode = localStorage.getItem('altProfileMode');
    if (altProfileMode == 'kids') {
      next();
    } else if (altProfileMode == 'default') {
      var access = store.getters.accessToKidsMode;
      // console.log("kids.vue|beforeRouteEnter "+ access);
      // if (!access) return;

      var altUser = JSON.parse(localStorage.getItem('altUser'));
      // console.log('[Kids | beforeRouteEnter | altUser | ]', altUser);

      if (altUser) {
        var altOrder = JSON.parse(localStorage.getItem('altOrder'));
        // console.log('[Kids | beforeRouteEnter | altOrder | ]', altOrder);

        if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          // console.log('[Kids | beforeRouteEnter | switching profiles | ]');
          // console.log('[Kids | beforeRouteEnter | altOrder == true | ]');
          // console.log('[Kids | beforeRouteEnter | this | ]', this);

          checkUserAccount(switchProfile);
        } else {
          //  // console.log('[Kids | beforeRouteEnter | showing subscriber popup | ]');

          altMixins.methods.toggleKidsSubscribePopup(true);
        }
      } else {
        //  // console.log('[Kids | beforeRouteEnter | user not there | showing subscriber popup | ]');

        store.commit('setRouterFromParam', { name:'kidsMode' });
        altMixins.methods.toggleKidsSigninPopup(true);
      }
    } else {
      next({ name: 'home' });
    }

    function checkUserAccount(callback) {
      //  // console.log('[Kids | beforeRouteEnter | checkUserAccount | ]');

      var altUser = JSON.parse(localStorage.getItem('altUser'));

      store.dispatch('actCheckWithAccount', altUser).then(
      (response) => {
        // console.log('[Kids | checkUserAccount | response | ]', response);

        if (response.count && response.count > 1) {
          var kidsProfile = response.profiles[1];
          var altKidsUser = {
            username: kidsProfile.username,
            type: kidsProfile.type,
            profileId: kidsProfile.id,
            email: kidsProfile.email,
          };
          if (response.account && response.account.pin) {
            altKidsUser.pin = response.account.pin;
            callback(altKidsUser);
          }
        } else {
          eventBus.$emit('toggleCreateKidsPinEvent', true);
          altMixins.methods.toggleLoader(false);
        }
      },
      (error) => {
        // console.log('[Kids | checkUserAccount | error | ]', error);
      }
      );
    }
    function switchProfile(altKidsUser) {
      // console.log('[Kids | beforeRouteEnter | switchProfile | ]');
      // console.log('[Kids | switchProfile | altKidsUser | ]', altKidsUser);

      store.dispatch('actGetProfileSwitch', altKidsUser).then(
      (response) => {
        // console.log('[mixins | switchProfile | response | ]', response);
        // console.log('[mixins | switchProfile | routerToParam | ]', store.getters.routerToParam);

        if (response.status && response.status == 'ok') {
          altKidsUser.email = response.email;
          altKidsUser.parentalControl = response.parental_control;
          altKidsUser.sessionToken = response.session_token;
          altKidsUser.username = response.username;
          altKidsUser.uuid = response.uuid;

          localStorage.setItem('altProfileMode', 'kids');
          localStorage.setItem('altKidsUser', JSON.stringify(altKidsUser));

          store.commit('setRouterToParam', undefined);
          store.commit('setRouterFromParam', undefined);

          next();
        }
      },
      (error) => {
        // console.log(error);
      }
      );
    }
  },
  beforeRouteLeave: (to, from, next) => {
    store.commit('setRouterFromParam', from);
    store.commit('setAccessToKidsMode', false);
    next();
  },
  beforeDestroy() {
    eventBus.$off('loadMoreKidsContentsEvent');
  },
  mixins: [altMixins]
}
</script>
