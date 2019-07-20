<template>
  <form autocomplete="on">
    <div class="form-group">
      <input type="email" name="email" placeholder="Email address" class="form-control" v-model="email">
      <p v-show="emailError">{{emailError}}</p>
    </div>
    <div class="form-group">
      <input type="password" name="password" placeholder="Password" class="form-control" v-model="password" autocomplete="new-password">
      <p v-show="passwordError">{{passwordError}}</p>
    </div>
    <input type="submit" value="Submit" class="grad-btn submit-btn btn" @click.prevent="getLogin">

    <a href="" id="paytmLinkId"></a>
  </form>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
      return {
          email: '',
          password: '',
          altUser: undefined,
          altAccount: undefined,
          emailError: false,
          passwordError: false,
          contentType: undefined,
          favCheckId: undefined,
          currentState :undefined,
          altConfig :undefined,
          // NOTE paytm Features
          orderIdCurrentProduct:undefined,
          real_amount:undefined,
          transactionId:undefined,
          paytmUrlLink:undefined,
      };
  },
  computed: {
    ...mapGetters([
      'domain',
      'routerToParam',
      'routerFromParam',
      'passphrase',
      'deleteError',
      'userEmailCampaign'
    ]),
  },
  methods: {
    ...mapMutations([
      'setUser',
      'setAccount',
      'setDevice',
      'setOrder',
      'setUserLoggedIn',
      'setRouterToParam',
      'setRouterFromParam',
      'setDeleteError',
      'setSignupRedirectData',
    ]),
    ...mapActions([
      'actGetUserLogin',
      'actGetDeviceList',
      'actRegisterDevice',
      'actGetAccountDetails',
      'actAddtoFavouriteSeries',
      'actAddtoFavouriteMedia',
      'actGetUpdateUser',
      'actCheckWithAccount',
      'actGetProfileSwitch',
      'actGetOrders',
      // NOTE paytm features
      'actPaytmHasCodeFeatures',
      'actCreateOrder',
      'actProductDetails'
    ]),
    getLogin() {
      if (this.loginFormValid()) {
        // Show the loader immediately
        this.toggleLoader(true);

        this.actGetUserLogin({
          username: this.email,
          password: this.password
        }).then((response) => {
          var account = response.account;
          var profile = response.account.profile;

          var altUser = {
            sessionToken: (response.session_token) ? response.session_token : '',
            dateCreated: (account.date_created) ? account.date_created : '',
            email: (account.email) ? account.email : '',
            accountId: (account.id) ? account.id : '',
            isAdmin: (account.is_admin) ? account.is_admin : '',
            login: (account.login) ? account.login : '',
            username: (profile.username) ? profile.username : '',
            profileId: (profile.id) ? profile.id : '',
          }

          localStorage.setItem('token', response.session_token);
          localStorage.setItem('user_email', response.account.email);
          localStorage.setItem('account_id', response.account.id);
          /**
          * temporarily setting to property
          */
          this.altUser = altUser;

          // console.log('[LoginForm| getLogin | altUser | ]', this.altUser);
          // console.log('[LoginForm| getLogin | routerFromParam | ]', this.routerFromParam);

          this.getAccountLookup();
        }, (error) => {
          if (error.code == 404 && error.message == 'Account does not exist') {
            var homeDomain = localStorage.getItem('homeDomain');
            homeDomain = (homeDomain == 'IN') ? 'row' : 'IN';
            localStorage.setItem('homeDomain', homeDomain);

            this.getLogin();
            return false;
          }

          if (error.code == 404 && error.message == 'Username not found') {
            this.setSignupRedirectData({ username: this.email, password: this.password });
            this.$router.push({ name:'signup' });
          }

          if (error.message) {
            if (error.message != 'Username not found'){
              this.toggleAltPopup(true, error.message);
            }
          } else {
            this.toggleAltPopup(true, 'Your internet is acting up. Please check your connection.')
          }
          this.toggleLoader(false);

          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.event_action = 'error';
            eventAttributeObj.event_message = error.message ? error.message : 'N.A';
            eventAttributeObj.event_code =  error.code ? error.code.toString() : '';
            window.mobileAnalyticsClient.recordEvent('_user.login', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events
        });
      }
    },
    getAccountLookup() {
      this.actGetAccountDetails(this.altUser).then((response) => {
        // Handles User's Language Preference
        // Check for 'regional_language' information in profile
        let extra = response.profile && response.profile.extra_details;

        if (extra && extra.length && 'regional_language' in extra) {
          this.selectedLanguage = extra.regional_language;
          this.saveLangToLocal(this.selectedLanguage, true);
        }

        //added by sumit
        this.currentState = response.details.state;
        //end by sumit
        this.altAccount = {
          dateCreated: this.formatIsoDate(response.date_created),
          details: response.details,
          emailVerified: response.email_verified,
          marketingConcent: response.marketing_consent,
          phoneNumber: response.phone_number,
          profile: response.profile,
          name: response.name,
          surname: response.surname
        }

        localStorage.setItem('user_mobile',response.phone_number ? response.phone_number : "N.A");
        localStorage.setItem('user_state',(response.details && response.details.state) ? response.details.state : "N.A");

        localStorage.setItem('user_name', response.name + " " + response.surname);
        localStorage.setItem('user_birthday', (response.details.birthday) ? response.details.birthday : '');
        localStorage.setItem('user_gender', (response.details.gender) ? response.details.gender : '');


        if(response.name) {
            eventBus.$emit('changeHumburgerName',response.name);
        } else {
            eventBus.$emit('changeHumburgerName','Welcome!');
        }

        // NOTE: CODE COMMENTED
        // Code by sumit
        // // NOTE: added by sumit
        // if (!(this.currentState) && localStorage.getItem('homeDomain') == 'IN') {
        //   this.toggleLoader(false);
        //   // Show the state select popup
        //   eventBus.$emit('togglePopupStateSelectEvent', true);
        // } else {
        //   this.getDevice();
        // }
        // NOTE: NEW CODE ADDED
        this.getDevice();
        // NOTE: END OF NEW CODE

      }, (error) => {
        // console.log('[getAccountLookup | actGetAccountDetails | error | ]', error);
      });
    },
    getDevice() {
      var altDeviceId = localStorage.getItem('altDeviceId');
      // Set the value of deviceid  to undefined first
      var altDeviceId = undefined;
      // Check if deviceid is present in the localStorage
      if (localStorage.getItem('altDeviceId')) {
        altDeviceId = localStorage.getItem('altDeviceId');
      }
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
      this.actGetDeviceList(this.altUser).then((response) => {

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
            this.notificationProcessOrders();

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
      }, (error) => {
        // console.log('[getDevice | actGetDeviceList | error | ]', error);
      });
    },
    registerDevice(deviceId) {
      // console.log('[LoginForm | registerDevice | passed deviceId | ]', deviceId);

      this.actRegisterDevice(deviceId).then((response) => {
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
          this.notificationProcessOrders();
        }
      }, (error) => {
        // NOTE: HANDLE THE DEVICE REGISTER EXCEPTION HERE
        // console.log('[registerDevice | actRegisterDevice | error | ]', error);

        this.setUser(this.altUser);
        this.setAccount(this.altAccount);
        localStorage.removeItem('altDeviceId');
        localStorage.setItem('altDeviceId', this.generateRandomId(32));

        // console.log('[LoginForm | deleteError | ]', this.deleteError);

        if (error.code == 400) {
          // console.log('[Device registration error]', err.message);
          // console.log('[LoginForm | registerDevice | deleteError ]', this.deleteError);

          if (this.deleteError > 4) {
            eventBus.$emit('closeClearDevicesEvent');

            // Clear the form
            this.email = '';
            this.password = '';
            // Show the error message
            eventBus.$emit('toggleClearDeviceErrorEvent', true);
          } else {
            this.setDeleteError(0);
            eventBus.$emit('showClearDevicesEvent');
          }
          // Hide the loader when the popups are handled
          this.toggleLoader(false);
        } else {
          this.getLogin();
        }
      });
    },
    getOrder() {
      this.actGetOrders(this.altUser).then((response) => {
        // console.log('[LoginForm | response | ]', response);
        // console.log('[LoginForm | getOrder | routerFromParam ]', this.routerFromParam);
        // console.log('[LoginForm | getOrder | routerToParam ]', this.routerToParam);

        // If orders are present
        if (response.count) {
          this.processOrders(response.orders);
        } else {
          // console.log('[LoginForm | no-orders]');
          // If orders are not present

          // Set the order details to the localStorage
          localStorage.setItem('altOrder', JSON.stringify({
            tvod: { hasOrder: false },
            subscription: { hasOrder: false, expired: false }
          }));

          // Disable the loader
          this.toggleLoader(false);

          this.redirectUser();
        }
      }, (error) => {
        // console.log('[getOrder | actGetOrders | error | ]', error);

        this.setRouterToParam(undefined);
        this.setRouterFromParam(undefined);
      });

      var altGeoData = undefined;
      if (localStorage.getItem('altGeoData')) {
        altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
      }

      // console.log('[getOrder | actGfghetOrders | altGeoData | ]', altGeoData);

      var altDeviceName = '';
      if (localStorage.getItem('altDeviceName')) {
        altDeviceName = localStorage.getItem('altDeviceName');
      }
      var platformDetails = undefined;
      try {
          platformDetails = this.altDetectPlatform();
      } catch(err) {}


      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'gt_login',
        'eventAction': 'login',
        'eventCategory': 'gt_login',
        'eventLabel': 'login',
        'eventValue': 1,
        'gtl_platform': navigator.platform,
        'gtl_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
        'gtl_country': altGeoData.country && altGeoData.country.iso_code ? altGeoData.country.iso_code : '',
        'gtl_city': altGeoData.city && altGeoData.city.names && altGeoData.city.names.en ? altGeoData.city.names.en : '',
        'gtl_device_timestamp': new Date().getTime()
      });

      // NOTE webengage login added 16.02.2018

      var accountIdWebenage = localStorage.getItem("altUser") ? JSON.parse(localStorage.getItem("altUser")).accountId : undefined;
      if(accountIdWebenage) {
        if(webengage) {
          webengage.user.login(accountIdWebenage);
          this.webengageLoginAttribute(accountIdWebenage);
        }
      }

      if(webengage) {
        webengage.track('gt_login' , {
          'gt_platform':(platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ' ,
          'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
          'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
          'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
          'gt_device_timestamp': new Date()
        });

        // delete me ________________________________________
            console.log('gt_login' , {
                'gt_platform':(platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ' ,
                'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
                'gt_device_timestamp': new Date()
          });
        // end delete me
      }

    },
    webengageLoginAttribute(accountIdWebenage) {
      var altAccountWebenage = JSON.parse(localStorage.getItem("altAccount"));
      var altUserWebenage = JSON.parse(localStorage.getItem("altUser"));
      var jsonWebengage = {
        "we_first_name" : altAccountWebenage &&  altAccountWebenage.name && altAccountWebenage.name != 'null' ? altAccountWebenage.name : "N.A",
        "we_hashed_email" : accountIdWebenage ? accountIdWebenage : "N.A",
        "we_gender" : altAccountWebenage.details.gender ? (altAccountWebenage.details.gender).toLowerCase() : "male",
        'we_hashed_phone' : accountIdWebenage ? accountIdWebenage : "N.A",
        'we_birth_date' : altAccountWebenage.details.birthday ? altAccountWebenage.details.birthday : "1986-08-19",
        'we_email_opt_in' : true,
        'we_sms_opt_in' : true
      };
      webengage.user.setAttribute(jsonWebengage);
    },
    processOrders(orders) {
      var orderData = new Object();

      // Checking for TVOD plans
      // Getting the list of TVOD plans
      var tvodPlans = orders.filter((order) => {
        return order.product.recurring == false;
      });

      var multipleTvod = [];
      if (tvodPlans && tvodPlans.length) {
        var hasActiveTvodPlan = false;
        var activeTvodPlanIndex = undefined;
        orderData.tvod = {};
        for (var i in tvodPlans) {
          var timeDiff = (new Date().getTime() - new Date((tvodPlans[i].dates.valid_to).split('+')[0]).getTime()) / (1000 * 3600 * 24);
          if (timeDiff < 0) {
            hasActiveTvodPlan = true;
            activeTvodPlanIndex = i;
            tvodPlans[i].expired = false;
            // console.log("order",tvodPlans[i]);
            multipleTvod.push(tvodPlans[i]);
          }
        }
        if (hasActiveTvodPlan) {
          orderData.tvod = { hasOrder : true, products : multipleTvod };
        } else {
          orderData.tvod = { hasOrder : false };
        }
      } else {
        orderData.tvod = { hasOrder : false};
        // console.log(orderData.tvod);
      }

      // End of TVOD plan check

      // Checking for Subscription plans
      // Getting list of subscribed plans
      var activeSubsOrders = orders.filter((order) => {
        return order.product.recurring == true;
      });

      if (activeSubsOrders && activeSubsOrders.length) {
        var hasActivePlan = false;
        var activePlanIndex = 0;
        orderData.subscription = {};
        orderData.subscription.hasOrder = false;
        orderData.subscription.expired = true;

        for (var i in activeSubsOrders) {
          var timeDiff = (new Date().getTime() - new Date((activeSubsOrders[i].dates.valid_to).split('+')[0]).getTime()) / (1000 * 3600 * 24);

          if (timeDiff < 0) {
            hasActivePlan = true;
            activePlanIndex = i;
            break;
          }
        }

        if (hasActivePlan) {
          orderData.subscription = activeSubsOrders[activePlanIndex];
          orderData.subscription.hasOrder = true;
          orderData.subscription.expired = false;
          localStorage.setItem('altOrder', JSON.stringify(orderData));
        } else {
          localStorage.setItem('altOrder', JSON.stringify(orderData));
        }
      } else {
        orderData.subscription = { hasOrder: false, expired: true };

        localStorage.setItem('altOrder', JSON.stringify(orderData));

        this.toggleLoader(false);
      }
      // End of subscription plan check
      // console.log("LoginForm.vue | orderData",orderData);
      // Method to manage the redirection
      this.redirectUser();
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

      localStorage.setItem('altUser', JSON.stringify(this.altUser));
      localStorage.setItem('altAccount', JSON.stringify(this.altAccount));
      localStorage.setItem('altDevice', JSON.stringify(altDevice));
      if (localStorage.getItem('altDefSearches')) {
        localStorage.removeItem('altDefSearches');
        localStorage.removeItem('mediaProgressList');
      }
    },
    diffDateDay(Exdate) {
      var date1 = new Date();
      var date2 = new Date(Exdate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    },
    tvodSvodNotification(Exdate) {
      var today,someday,text;
      today = new Date();
      someday = new Date(Exdate);
      today.setDate(today.getUTCDate()+7);//before 7 days button will come

      if (someday <= today) {
        return 1;
      } else {
        return 0;
      }
    },
    notificationProcessOrders() {
      this.actGetOrders(this.altUser).then((response) => {
        var orders=response.orders;
        var subscribeDayExpire=0,todayExpire=false,showPopupNotificationConfirm=false,tvodNotification=0,expiredSubscription=0;
        var showPopupNotification=false,tvodTitle=undefined,tvodDays=0,subscriptionNotification=0,expiredTvod=false;
        var orderData = new Object();
        var tvodPlans = orders.filter((order) => {
          return order.product.recurring == false;
        });

        if (tvodPlans && tvodPlans.length) {
          var hasActiveTvodPlan = false;
          var activeTvodPlanIndex = undefined;
          orderData.tvod = {};
          orderData.tvod.hasOrder = false;
          orderData.tvod.expired = true;
          var orderListTvod = [];
          for (var i in tvodPlans) {
            var timeDiff = (new Date().getTime() - new Date(tvodPlans[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
            if (timeDiff < 0) {
              hasActiveTvodPlan = true;
              activeTvodPlanIndex = i;
              orderListTvod.push(tvodPlans[i]);
            }
          }
          if (hasActiveTvodPlan) {
            orderData.tvod.Data = orderListTvod;
            orderData.tvod.hasOrder = true;
            orderData.tvod.expired = false;
          }
        } else {
          orderData.tvod = false;
        }

        var activeSubsOrders = orders.filter((order) => {
          return order.product.recurring == true;
        });
        if (activeSubsOrders && activeSubsOrders.length) {
          var hasActivePlan = false;
          var activePlanIndex = 0;
          orderData.subscription = {};
          orderData.subscription.hasOrder = false;
          orderData.subscription.expired = true;

          for (var i in activeSubsOrders) {
            var timeDiff = (new Date().getTime() - new Date((activeSubsOrders[i].dates.valid_to).split('+')[0]).getTime()) / (1000 * 3600 * 24);
            if (timeDiff < 0) {
              hasActivePlan = true;
              activePlanIndex = i;
              break;
            }
          }
          if (hasActivePlan) {
            orderData.subscription = activeSubsOrders[activePlanIndex];
            orderData.subscription.hasOrder = true;
            orderData.subscription.expired = false;
          }
        }
        if(orderData && orderData.subscription && orderData.subscription.hasOrder && !orderData.subscription.expired) {
          subscriptionNotification = this.tvodSvodNotification(orderData.subscription.dates.valid_to.split('+')[0]);
        } if(orderData && orderData.tvod && orderData.tvod.hasOrder && !orderData.tvod.expired) {
          var tvodNotificationFlag=undefined;
          var countTvod=0;
          for (var i in orderData.tvod.Data) {
            // console.log("data",i);
            tvodTitle = orderData.tvod.Data[i].product.titles.en;
            tvodDays = this.diffDateDay(orderData.tvod.Data[i].dates.valid_to.split('+')[0]);
            tvodNotificationFlag= this.tvodSvodNotification(orderData.tvod.Data[i].dates.valid_to.split('+')[0]);
            if(tvodNotificationFlag == true) {
              countTvod++;
            }
          }
          if(countTvod > 0) {
            tvodNotification = countTvod;
          }
        } if(orderData && orderData.tvod && !orderData.tvod.hasOrder && orderData.tvod.expired) {
          expiredTvod=false;
          //this for hide rental expire
        } if(orderData && orderData.subscription && !orderData.subscription.hasOrder && orderData.subscription.expired) {
          expiredSubscription=1;
        }

        var notificationCount = subscriptionNotification + expiredSubscription + tvodNotification;
        localStorage.setItem('notificationsCount', notificationCount);

        eventBus.$emit('toggleUserModeChange', true);

      });
    },
    loginFormValid() {
      if (this.validateEmail() && this.validatePassword()) {
        return true;
      }
      return false;
    },
    validateEmail() {
      if (!(this.email)) {
        this.emailError = 'Enter your email here';
        return false;
      } else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.email)) {
        this.emailError = 'Email not valid';
        return false;
      } else {
        this.emailError = false;
        return true;
      }
    },
    validatePassword() {
      if (!(this.password)) {
        this.passwordError = 'Enter your password';
      } else {
        return true;
      }
    },
    redirectUser() {
      eventBus.$emit('toggleUserModeChange', true);

      var languageCounterData = undefined;
      languageCounterData = localStorage.getItem('languageCounter') ? JSON.parse(localStorage.getItem('languageCounter')) : undefined;
      // Code for AWS Mobile Analytics
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.user_state = localStorage.getItem("user_state") ? localStorage.getItem("user_state") : null;
        eventAttributeObj.user_mobile = localStorage.getItem("user_mobile") ? localStorage.getItem("user_mobile") : null;
        eventAttributeObj.event_mode = 'email';
        window.mobileAnalyticsClient.recordEvent('_user.login', eventAttributeObj, {});
      }
      // End of Code for AWS Mobile Analytics

      // If state info is not there in account data, show the state selection
      // popup. Check the Home Domain of the user also.
      let homeDomain = undefined;
      if (localStorage.getItem('homeDomain')) {
        homeDomain = localStorage.getItem('homeDomain');
      }

      if (homeDomain == 'IN' && this.altAccount.details && !this.altAccount.details.state) {
        eventBus.$emit('togglePopupStateSelectEvent', true);
        // Hide the App Loader
        this.toggleLoader(false);
        return;
      }

      var altOrder = undefined;
      if (localStorage.getItem('altOrder')) {
        altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      var paytmRedirectDecision = undefined;
      paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;

      let promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;

      if (paytmRedirectDecision || promotionalFlag) {
          this.toggleLoader(true);
          if (paytmRedirectDecision) {
              localStorage.removeItem("campaign-redirect");
              if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                window.location.replace(location.protocol + '//' + location.host );
              } else {
                  this.$router.push({ name: 'paymentPage' });
              }
          } else if (promotionalFlag) {
              let  routerObj = {
                    name: 'promotionalWoohooPage',
                    query: {
                    partner: this.$route.query.partner
                    }
                };
              this.$router.push(routerObj);         
          }

      } else {

          if (this.routerFromParam) {
              if (this.routerFromParam.name == 'media' || this.routerFromParam.name == 'show' || this.routerFromParam.name == 'episode') {
                  if (this.routerFromParam.extra && this.routerFromParam.extra.name == 'player-favourite') {

                      this.addToFavourite();
                      this.$router.push(this.routerFromParam.fullPath);
                  } else {
                      this.$router.push(this.routerFromParam.fullPath);
                  }
              } else if (this.routerFromParam.name == 'kids') {
                  if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {

                      this.postLoginSwitchToKids();
                  } else {
                      this.$router.push({ name: 'subscribe' });
                  }
              } else if (this.routerFromParam.name == 'rent') {
                  // NOTE added by sumit 24.01.2018
                  if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                      this.$router.push({ path: this.routerFromParam.fullPath });
                  } else if (altOrder && altOrder.tvod  && altOrder.tvod.hasOrder) {
                      homeDomain = homeDomain.toLowerCase();
                      var singleTvod = undefined;
                      for (singleTvod in altOrder.tvod.products) {
                          if (altOrder.tvod.products[singleTvod].product.id == this.routerFromParam.params.tvod[homeDomain]) {
                              this.$router.push({ path: this.routerFromParam.fullPath });
                              return;
                          }
                      }
                      this.$router.push('/rent/show/' + this.routerFromParam.params.id);
                  } else {
                      this.$router.push('/rent/show/' + this.routerFromParam.params.id);
                  }
              } else if (this.routerFromParam.name == 'subscribe') {
                  this.postLoginSubscribeCB();
              } else {
                  // NOTE added by sumit for language popup 26.03.2018
                  if(this.altConfig && this.altConfig.regional) {
                      eventBus.$emit('toggleLanguagePrefRegisterdEvent',true);
                      if(document.getElementById('NONE')){
                          document.getElementById('NONE').checked = true;
                      }
                      if(!languageCounterData || (languageCounterData && !languageCounterData.regSubscribe)) {
                          localStorage.setItem("languageCounter",JSON.stringify({"anonymous":languageCounterData && languageCounterData.anonymous ? true :false ,"regSubscribe":true}));
                      }
                  }
                  this.$router.push({ name: 'home' });
              }
          } else {

              // NOTE added by sumit for language popup 26.03.2018
              if(this.altConfig && this.altConfig.regional) {
                  eventBus.$emit('toggleLanguagePrefRegisterdEvent',true);
                  if(document.getElementById('NONE')){
                      document.getElementById('NONE').checked = true;
                  }
                  if(!languageCounterData || (languageCounterData && !languageCounterData.regSubscribe)) {
                      localStorage.setItem("languageCounter",JSON.stringify({"anonymous":languageCounterData && languageCounterData.anonymous ? true :false ,"regSubscribe":true}));
                  }
              }
              this.$router.push({ name: 'home' });
          }

          this.setRouterToParam(undefined);
          this.setRouterFromParam(undefined);
      }
    },
    postLoginSwitchToKids() {
      this.checkUserAccount();
    },
    postLoginSubscribeCB() {
      var altOrder = undefined;
      if (localStorage.getItem('altOrder')) {
        altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
        // Redirect user to subscription page
        this.$router.push({ name: 'subscription' });
      } else {
        this.$router.push({ name: 'subscribe' });
      }
    },
    checkUserAccount() {
      this.actCheckWithAccount().then((response) => {
        // console.log('[HeaderMenu | checkUserAccount | response | response | ]', response);

        if (response.count && response.count > 1) {
          // Get the kids profile from the response
          var kidsProfile = response.profiles[1];

          // Check for pin
          if (response.account && response.account.pin) {
            kidsProfile.pin = response.account.pin;

            this.switchToKidsProfile(kidsProfile);
          } else {
            eventBus.$emit('togglePopupKidsCreatePin', true);
            this.toggleLoader(false);
          }
        } else {
          // console.log('[HeaderMenu | checkUserAccount | else | ]');

          eventBus.$emit('togglePopupKidsCreatePin', true);
          this.toggleLoader(false);
        }
      }, (error) => {
        // console.log('[HeaderMenu | checkUserAccount | error | ]', error);
      });
    },
    switchToKidsProfile(kidsProfile) {
      this.actGetProfileSwitch(kidsProfile).then((response) => {
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
          altUser.sessionToken = response.session_token;
          altUser.uuid = response.uuid;
          altUser.username = response.username;

          localStorage.setItem('altUser', JSON.stringify(altUser));
        }

        eventBus.$emit('toggleAppModeChangeEvent', 'kids');
        this.$router.push({ name: 'home' });
      }).catch((error) => {
        // console.log('[HeaderMenu | switchToKidsProfile | error | ]', error);
      });
    },
    addToFavourite() {
      this.contentType = this.routerFromParam.query.type;
      this.contentName = this.routerFromParam.name;

      this.favCheckId = this.routerFromParam.params.id;

      // console.log('[LoginForm | addToFavourite | favCheckId | ]', this.favCheckId);

      if (this.contentName == 'show') {
        this.actAddtoFavouriteSeries(this.favCheckId).then((response) => {
          // console.log('[LoginForm | actAddtoFavouriteSeries | response | ]', response);
        }, (error) => {
          // console.log('[LoginForm | actAddtoFavouriteSeries | error | ]', error);
        });
      } else {
        this.actAddtoFavouriteMedia(this.favCheckId).then((response) => {
          // console.log('[LoginForm | actAddtoFavouriteMedia | response | ]', response);
        }, (error) => {
          // console.log('[LoginForm | actAddtoFavouriteMedia | error | ]', error);
        });
      }
    },
    saveLangToLocal (language, selected) {
      let pref_language_data = {
        userType: 'registered',
        emitted: true,
        selected,
        language
      }
      localStorage.setItem('pref_language_data', JSON.stringify(pref_language_data));
    }, // saveLangToLocal
  },
  created() {
    this.email = '';
    this.password = '';

    if (this.userEmailCampaign) {
      this.email = this.userEmailCampaign;
    }

    eventBus.$on('postDeleteDevicesEvent', () => {
      this.getLogin();
    });
  },
  mixins: [altMixins]
}
</script>
