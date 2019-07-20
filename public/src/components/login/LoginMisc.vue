<template>
  <div >
    <div v-if="isCampaignPage">
        <div>
          <p style="font-size: 12px;">Or SignIn with your social account</p>
          <img class="fb-logo" src="../../assets/facebook-one.png" alt='fb-logo' @click="loginWithFacebook()" style="width: 34px;height: 30px;">
        </div>
    </div>
    <div v-else>

        <div class="text-center">
          <router-link :to="{ name: 'resetPassword' }" class="forgot-psw link-under">Forgot your Password?</router-link>
        </div>
        <button type="button" class="fb-btn" @click="loginWithFacebook()">
          <img class="fb-logo" src="../../assets/fb.svg" alt='fb-logo'>
          <span class="fb-txt" v-if="altMessages">{{altMessages.buttonSignInFacebook}}</span>
        </button>
        <p class="text-center">By signing in, you agree to the <router-link :to="{ name: 'toc' }" class="link-under">Terms of Use</router-link> and <router-link :to="{ name: 'privacyPolicy' }" class="link-under">Privacy Policy</router-link>.</p>
        <div class="access-ac">Don't have an account yet? Sign up now.</div>
        <router-link tag="button" to="/signup" type="button" class="signup-btn">Sign Up</router-link>
    </div>
  </div>
  
</template>

<script>
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { eventBus } from '../../main';

export default {
  data() {
    return {
      userData: undefined,
      fbAccessToken: undefined,
      altUser: undefined,
      altAccount: undefined,
      fbAuthMode: 'login',
      counter: 1,
    };
  },
  computed: {
    ...mapGetters([
      'altMessages',
      'routerFromParam',
      'routerToParam',
    ]),
  },
  props: ['isCampaignPage'],
  methods: {
    ...mapMutations([
      'setUser',
      'setAccount',
      'setRouterToParam',
      'setRouterFromParam',
      'setDeleteError',
      'setUser',
      'setAccount',
    ]),
    ...mapActions([
      'actAccountLookup',
      'actFacebookLogin',
      'actGetAccountDetails',
      'actGetDeviceList',
      'actRegisterDevice',
      'actGetOrders',
    ]),
    loginWithFacebook() {
      var self = this;
      this.toggleLoader(true);
      // Facebook SDK login method
      FB.login((response) => {
        // console.log('[LoginMisc | loginWithFacebook | response | ]', response);

        // If Authentication data is present
        if (response.authResponse) {
          // Store the access token
          this.fbAccessToken = response.authResponse.accessToken;
          // got Facebook user id from auth response
          var userId = response.authResponse.userID;

          FB.api('/' + userId, { fields: 'name, email, age_range' }, (response) => {
            // console.log('[LoginMisc | loginWithFacebook | me api response | ]', response);

            if (response.error && response.error.code == 190) {
              self.loginWithFacebook();
              return;
            }

            if (!response.email) {
              eventBus.$emit('togglePopupFbLoginError', true);
              this.toggleLoader(false);

              return;
            }

            if (response.age_range && response.age_range.min < 18) {
              eventBus.$emit('togglePopupFbBelowAge', true);
              this.toggleLoader(false);

              return;
            }

            if (response.email) {
              this.userData = { login: response.email };
              this.accountLookUp();
            }
          });
        } else {
          // eventBus.$emit('togglePopupFbLoginError', true);
          this.toggleLoader(false);
        }

      }, {scope: 'email, public_profile', return_scopes: true});
    },
    accountLookUp() {
      this.toggleLoader(true);
      this.actAccountLookup(this.userData).then((response) => {
        if (response.status && response.status == 'ok') {
          this.facebookLoginCb();
        }
      }, (error) => {
        if (error.code == 404) {
          // If error code comes as 404, ie. Account not found, we should continue
          // calling facebook login API, because, this will register the user.
          // Before calling Facebook login API, set the flag that the user is a new
          // hence set the mode to 'signup' || default = 'login'

          this.handleErrorAccount(error);
         
        }
      })
    },
    handleErrorAccount(error) {
        if (error.code == 404 && error.message == 'Account not found') {
            if ( this.counter == 2 ) {
              localStorage.setItem('homeDomain', localStorage.getItem('visitedDomain'));
              this.counter = 1;
              this.fbAuthMode = 'signup';
              this.facebookLoginCb();
              return;
            }
             var homeDomain = localStorage.getItem('homeDomain');
            homeDomain = (homeDomain == 'IN') ? 'row' : 'IN';
            localStorage.setItem('homeDomain', homeDomain);
            this.counter = 2;
            this.accountLookUp();
            
        }


      // Call the Facebook Login API
      
    },
    facebookLoginCb() {
      console.log("fbAuthMode", this.fbAuthMode);
      this.actFacebookLogin({ access_token: this.fbAccessToken }).then((response) => {
        var account = response.account;
        var profile = response.account.profile;

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
        }

        localStorage.setItem('token', response.session_token);
        localStorage.setItem('user_email', response.account.email);
        localStorage.setItem('account_id', response.account.id);

        this.altUser = altUser;

        this.getAccountLookup();

      }, (error) => {
        eventBus.$emit('togglePopupFbLoginError', true);
        this.toggleLoader(false);
      });
    },
    getAccountLookup() {
       this.toggleLoader(true);

      this.actGetAccountDetails(this.altUser).then((response) => {
        // console.log('[LoginForm | getAccountLookup | actGetAccountDetails | ]', response);
       
        
        this.altAccount = {
          dateCreated: this.formatIsoDate(response.date_created),
          details: response.details,
          emailVerified: response.email_verified,
          marketingConcent: response.marketing_consent,
          phoneNumber: response.phone_number,
          profile: response.profile,
        }


        localStorage.setItem('altUser', JSON.stringify(this.altUser));
        localStorage.setItem('altAccount', JSON.stringify(this.altAccount));

        // webenage setup 
          this.webenageSetup();

        // webenage end

        if(this.fbAuthMode == 'signup') {

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.event_mode = 'facebook';
                window.mobileAnalyticsClient.recordEvent('_user.signup', eventAttributeObj, {});
            }

            // End of AWS Mobile SDK Events
        }

        localStorage.setItem('user_name', response.name + " " + response.surname);
        localStorage.setItem('user_birthday', (response.details.birthday) ? response.details.birthday : '');
        localStorage.setItem('user_gender', (response.details.gender) ? response.details.gender : '');
        localStorage.setItem('user_email', this.altUser.email);

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.event_mode = 'facebook';
          // Recording the event
          window.mobileAnalyticsClient.recordEvent('_user.login', eventAttributeObj, {});
        }

        localStorage.removeItem('altUser',);
        localStorage.removeItem('altAccount');

        this.getDevice();
      }, (error) => {
        // console.log('[getAccountLookup | actGetAccountDetails | error | ]', error);
      });
    },
    webenageSetup() {
        let accountIdWebenage = localStorage.getItem("altUser") ? JSON.parse(localStorage.getItem("altUser")).accountId : undefined;
      if(accountIdWebenage) {
        if(webengage) {
          webengage.user.login(accountIdWebenage);
          this.webengageLoginAttribute(accountIdWebenage);
        }
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
        this.webenageLoginSignupFire();
    },
    webenageLoginSignupFire() {
      let platformDetails = this.altDetectPlatform();
      let  altGeoData = undefined;
      if (localStorage.getItem('altGeoData')) {
        altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
      }
      let webenagePopup = {
        'gt_platform':(platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ' ,
        'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
        'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
        'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
        'gt_device_timestamp': new Date()
      };

      if (webengage) {
          if (this.fbAuthMode == 'signup') {
            webengage.track('gt_complete_registration', webenagePopup);
            console.log("gt_complete_registration", webenagePopup)
          } else {
            webengage.track('gt_login' , webenagePopup);
            console.log("gt_login", webenagePopup)

          }

          
      }

    },
    getDevice() {

      var altDeviceId = localStorage.getItem('altDeviceId');

      this.setUser(this.altUser);
      this.setAccount(this.altAccount);
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
        // console.log('[LoginMisc -> actGetDeviceList -> response ]', response);

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
    registerDevice(registerObj) {
      // console.log('[LoginForm | registerDevice | passed deviceId | ]', deviceId);

      this.actRegisterDevice(registerObj).then((response) => {
         // console.log('[LoginMisc | registerDevice | response | ]', response);

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
      }, (error) => {
        // When 'Device already in use for other account' error comes
        if (error.code == 409) {
          localStorage.removeItem('altDeviceId');

          let deviceId = this.generateRandomId(32);
          localStorage.setItem('altDeviceId', deviceId);

          // Register the device again with new deviceId
          this.registerDevice({ user: this.altUser, deviceId: deviceId });
          return;
        }

        if (error.code == 400) {
            localStorage.removeItem("altUser");
          this.toggleLoader(false);
          if (this.deleteError > 4) {
             // console.log("i am here");
              localStorage.setItem("fb",true);
            eventBus.$emit('closeClearDevicesEvent');
          } else {
            this.setDeleteError(0);
            // console.log("i am here");
            localStorage.setItem("fb",true);
            eventBus.$emit('showClearDevicesEvent');
          }
        } else {
          this.loginWithFacebook();
        }
      });
    },
    getOrder() {
      /**
      * [action | actions.js]
      */
      this.actGetOrders(this.altUser).then((response) => {
         // console.log('[LoginForm | getOrder | actGetOrders | response ]', response);

        if (response.count && response.orders) {
          // console.log('[LoginForm | getOrder | orders are there | routerFromParam | ]', this.routerFromParam);

          this.processOrders(response.orders);
        } else {
          // localStorage.setItem('altOrder', JSON.stringify({hasOrder: false}));
          localStorage.setItem('altOrder', JSON.stringify({
            tvod: { hasOrder: false },
            subscription: { hasOrder: false, expired: false }
          }));

           // console.log('[LoginForm | getOrder | routerFromParam | ]', this.routerFromParam);
          this.toggleLoader(false);

          // NOTE this for facebook start *****

          var paytmRedirectDecision = undefined;
          paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;
          if (paytmRedirectDecision) {
              localStorage.removeItem("campaign-redirect");
            window.location.replace(location.protocol + '//' + location.host + '/paymentOptions');
            return;
          }
          var promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;
            if (promotionalFlag) {
            localStorage.removeItem("promotional-redirect");
            window.location.replace(location.protocol + '//' + location.host + '/promotion/paymentStatus');
              return;       
          }

          // NOTE this end of the facebook

          // If User Profile doesnot have state added
          // NOTE commented by sumit for PWA-131

          // NOTE PWA-138 resolved
          var homeDomainState = localStorage.getItem('homeDomain');
          if ( homeDomainState == 'IN' || homeDomainState == 'in' ) {
            if(this.fbAuthMode == 'signup') {
              if (this.altAccount.details && !this.altAccount.details.state) {
                eventBus.$emit('togglePopupFBStateSelectEvent', true);
                return;
              }
            }

            if (this.altAccount.details && !this.altAccount.details.state) {
              eventBus.$emit('togglePopupStateSelectEvent', true);
              return;
            }
          }

         this.redirection();

        }
      }, (error) => {
        // console.log('[getOrder | actGetOrders | error | ]', error);
      });
    },
    processOrders(orders) {

      var orderData = new Object();

      var tvodPlans = orders.filter((order) => {
        return order.product.recurring == false;
      });

      var multipleTvod = [];
      if (tvodPlans && tvodPlans.length) {
        var hasActiveTvodPlan = false;
        var activeTvodPlanIndex = undefined;
        orderData.tvod = {};
        for (var i in tvodPlans) {
          var timeDiff = (new Date().getTime() - new Date(tvodPlans[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
          if (timeDiff < 0) {
            hasActiveTvodPlan = true;
            activeTvodPlanIndex = i;
            tvodPlans[i].expired = false;
            // console.log("LoginMise.vue|order",tvodPlans[i]);
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

      var activeSubsOrders = orders.filter((order) => {
        return order.product.recurring == true;
      });

      if (activeSubsOrders && activeSubsOrders.length) {
        var hasActivePlan = false;
        // var activePlan = undefined;
        var activePlanIndex = 0;
        orderData.subscription = {};
        orderData.subscription.hasOrder = false;
        orderData.subscription.expired = true;

        for (var i in activeSubsOrders) {
          var timeDiff = (new Date().getTime() - new Date(activeSubsOrders[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
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



            var paytmRedirectDecision = undefined;
            paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;
            if (paytmRedirectDecision) {
                localStorage.removeItem("campaign-redirect");
                window.location.replace(location.protocol + '//' + location.host);
            return;
            }
             var promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;
            if (promotionalFlag) {
            localStorage.removeItem("promotional-redirect");
            window.location.replace(location.protocol + '//' + location.host + '/promotion/paymentStatus');
              return;       
          }


          // console.log('[LoginForm | processOrders | hasActivePlan | routerToParam]', this.routerToParam);

          var homeDomainState = localStorage.getItem('homeDomain');
          if ( homeDomainState == 'IN' || homeDomainState == 'in' ) {
          // NOTE PWA-138 resolved
              if(this.fbAuthMode == 'signup') {
                if (this.altAccount.details && !this.altAccount.details.state) {
                  eventBus.$emit('togglePopupFBStateSelectEvent', true);
                  return;
                }
              }

              // If User Profile doesnot have state added
              if (this.altAccount.details && !this.altAccount.details.state) {
                // Show state selection popup
                eventBus.$emit('togglePopupStateSelectEvent', true);
                return;
              }
          }

          this.redirection();

          this.setRouterToParam(undefined);
          this.setRouterFromParam(undefined);
        } else {

            // NOTE this for facebook start *****
            // console.log("here")
            var paytmRedirectDecision = undefined;
            paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;
            if (paytmRedirectDecision) {
                localStorage.removeItem("campaign-redirect");
            window.location.replace(location.protocol + '//' + location.host + '/paymentOptions');
            return;
            }

             var promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;
            if (promotionalFlag) {
              localStorage.removeItem("promotional-redirect");
              window.location.replace(location.protocol + '//' + location.host + '/promotion/paymentStatus');
                return;       
          }

            // NOTE this end of the facebook


          if (this.routerFromParam && this.routerFromParam.name == 'player') {
            this.addToFavourite();
            return;
          }

          var homeDomainState = localStorage.getItem('homeDomain');
          if ( homeDomainState == 'IN' || homeDomainState == 'in' ) {

            if(this.fbAuthMode == 'signup') {
              if (this.altAccount.details && !this.altAccount.details.state) {
                eventBus.$emit('togglePopupFBStateSelectEvent', true);
                return;
              }
            }

            // If User Profile doesnot have state added
            if (this.altAccount.details && !this.altAccount.details.state) {
              // Show state selection popup
              eventBus.$emit('togglePopupStateSelectEvent', true);
              return;
            }
          }

          this.redirection();

          this.setRouterToParam(undefined);
          this.setRouterFromParam(undefined);

          localStorage.setItem('altOrder', JSON.stringify(orderData));
        }
      } else {
        orderData.subscription = { hasOrder: false, expired: true };
        localStorage.setItem('altOrder', JSON.stringify(orderData));
        this.toggleLoader(false);

        // NOTE this for facebook start *****
        var paytmRedirectDecision = undefined;
        paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;
        // console.log("no order",paytmRedirectDecision);
        if (paytmRedirectDecision) {
            localStorage.removeItem("campaign-redirect");
            window.location.replace(location.protocol + '//' + location.host + '/paymentOptions');
            return
        }

         var promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;
            if (promotionalFlag) {
            localStorage.removeItem("promotional-redirect");
            window.location.replace(location.protocol + '//' + location.host + '/promotion/paymentStatus');
              return;       
          }

        // NOTE this end of the facebook *****
        var homeDomainState = localStorage.getItem('homeDomain');
          if ( homeDomainState == 'IN' || homeDomainState == 'in' ) {
            if(this.fbAuthMode == 'signup') {
              if (this.altAccount.details && !this.altAccount.details.state) {
                eventBus.$emit('togglePopupFBStateSelectEvent', true);
                return;
              }
            }

            // If User Profile doesnot have state added
            if (this.altAccount.details && !this.altAccount.details.state) {
              eventBus.$emit('togglePopupStateSelectEvent', true);
              return;
            }
            
          }
        this.redirection();
      }
    },
    redirection() {
        // console.log("loginMisc",this.routerFromParam);

        var altOrder = undefined;
        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }

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
            }
            else {
                this.$router.push({ name: 'home' });
            }
        } else {
            this.$router.push({ name: 'home' });
        }
    },
    saveDevice(deviceObj) {

      var altDevice = {
        uuid: deviceObj.uuid,
        appVersion: deviceObj.app_version,
        deviceId: deviceObj.id,
        ipAddress: deviceObj.ip_address,
        name: deviceObj.name,
        type: deviceObj.type,
        userAgent: deviceObj.user_agent,
      }

      localStorage.setItem('altUser', JSON.stringify(this.altUser));
      localStorage.setItem('altAccount', JSON.stringify(this.altAccount));
      localStorage.setItem('altDevice', JSON.stringify(altDevice));
    },
  },
  created() {
    console.log("LoginMisc.vue || isCampaignPage", this.isCampaignPage);

    console.log("LoginMisc.vue || created");


      eventBus.$on('fbDeviceDelete', () => {
          localStorage.setItem('altUser', JSON.stringify(this.altUser));
          localStorage.setItem('altAccount', JSON.stringify(this.altAccount));
          let altUser = undefined;
          let altOrder = undefined;
          if (localStorage.getItem('altUser')) {
                altUser = JSON.parse(localStorage.getItem('altUser'));

              if (localStorage.getItem('altOrder')) {
                   altOrder = JSON.parse(localStorage.getItem('altOrder'));
              }

              if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                 eventBus.$emit("changeHeaderSubcribeButton",false);
              } else {
                 eventBus.$emit("changeHeaderSubcribeButton",true);
              }
          }

        this.getDevice();
      });
  },
  mixins: [altMixins],
}
</script>
