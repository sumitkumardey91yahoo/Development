<template>
  <div id="alt-app">
    <app-header-menu></app-header-menu>

    <router-view id="alt-view"></router-view>

    <component v-show="showPopUp" :is="popUpComponent"></component>
    <!-- <popup-kids-create-pin v-show="showPopupKidsCreatePin"></popup-kids-create-pin>
    <popup-kids-exit-pin v-show="showPopupKidsExitPin"></popup-kids-exit-pin>
    <popup-device-removed v-show="showPopupDeviceRemoved"></popup-device-removed>
    <popup-search v-show="showPopupSearch"></popup-search>
    <popup-signin v-show="showSigninPopup"></popup-signin>
    <popup-player-signin v-show="showPlayerSigninPopup"></popup-player-signin>
    <popup-player-fav-signin v-show="showPlayerFavSigninPopup"></popup-player-fav-signin>
    <popup-subscribe v-show="showSubscribePopup"></popup-subscribe>
    <popup-more-details v-show="showMoreDetailsPopup"></popup-more-details>
    <popup-rent-now v-show="showRentNowPopup"></popup-rent-now>
    <popup-video-block v-show="showVideoBlockPopup"></popup-video-block>
    <popup-geo-block v-show="showGeoBlockPopup"></popup-geo-block>
    <popup-video-error v-show="showVideoErrorPopup"></popup-video-error>
    <popup-lang-filter v-show="showLangFilterPopup"></popup-lang-filter>
    <popup-tvod-rent v-show="showTvodRent"></popup-tvod-rent>
    <popup-fb-below-age v-show="showPopupFbBelowAge"></popup-fb-below-age>
    <popup-fb-login-error v-show="showPopupFbLoginError"></popup-fb-login-error>
    <popup-signup-welcome-page v-show="showPopupSignupWelcomePage"></popup-signup-welcome-page>
    <popup-kids-signin v-show="showPopupKidsSignin"></popup-kids-signin>
    <popup-kids-subscribe v-show="showPopupKidsSubscribe"></popup-kids-subscribe>
    <popup-block-video-row-fav v-show="showBlockVideoFavRow"></popup-block-video-row-fav>
    <popup-language-pref-registered v-show="showLanguagePrefRegistered"></popup-language-pref-registered>
    <popup-language-pref-anonymous v-show="showLanguagePrefAnonymous"></popup-language-pref-anonymous>
    <popup-video-fav-add-error v-show="showPopupVideoAddToFavError"></popup-video-fav-add-error>
    <popup-state-select v-show="showPopupStateSelect"></popup-state-select>
    <popup-fb-state-select v-show="showPopupFBStateSelect"></popup-fb-state-select>
    <popup-country-geo-block v-show="showPopupCountrywiseVideoBlock"></popup-country-geo-block>
    <popup-faq-question v-show="showPopupFaqQuestion"></popup-faq-question>
    <popup-validation-message v-show="showPopupValidationMessage"></popup-validation-message> -->
  </div>
</template>

<script>
import { eventBus} from './main';
import { altMixins } from './mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const popUpComponentNameList = Object({ "kids-create-pin" : 0,
    "kids-exit-pin" : 1,
    "device-removed" : 2,
    "search" : 3,
    "sign-in" : 4,
    "player-sign-in" : 5,
    "favourite-sign-in" : 6,
    "subscribe" : 7,
    "more-details" : 8,
    "rent-now" : 9,
    "video-block" : 10,
    "geo-block" : 11,
    "video-error" : 12,
    "language-filter" : 13,
    "tvod-rent" : 14,
    "fb-below-age" : 15,
    "fb-login-error" : 16,
    "welcome" : 17,
    "kids-sign-in" : 18,
    "kids-subscribe" : 19,
    "video-block-row" : 20,
    "language-pref-registered" : 21,
    "language-pref-anonymous" : 22,
    "favourite-add-error" : 23,
    "state-selection" : 24,
    "fb-state-selection" : 25,
    "country-geo-block" : 26,
    "faq-question" : 27,
    "validation-message" : 28,
});

const popUpComponentList = new Array(Object.keys(popUpComponentNameList).length);

const HeaderMenu = () => import(/* webpackChunkName: "HeaderMenu" */ './components/shared/HeaderMenu.vue');
// const PopupKidsCreatePin = () => import(/* webpackChunkName: "PopupKidsCreatePin" */ './components/shared/PopupKidsCreatePin.vue');
// const PopupKidsExitPin = () => import(/* webpackChunkName: "PopupKidsExitPin" */ './components/shared/PopupKidsExitPin.vue');
// const PopupDeviceRemoved = () => import(/* webpackChunkName: "PopupDeviceRemoved" */ './components/shared/PopupDeviceRemoved.vue');
// const Search = () => import(/* webpackChunkName: "Search" */ './components/shared/Search.vue');
// const PopupSignin = () => import(/* webpackChunkName: "PopupSignin" */ './components/shared/PopupSignin.vue');
// const PopupPlayerSignin = () => import(/* webpackChunkName: "PopupPlayerSignin" */ './components/shared/PopupPlayerSignin.vue');
// const PopupPlayerFavSignin = () => import(/* webpackChunkName: "PopupPlayerFavSignin" */ './components/shared/PopupPlayerFavSignin.vue');
// const PopupSubscribe = () => import(/* webpackChunkName: "PopupSubscribe" */ './components/shared/PopupSubscribe.vue');
// const PopupMoreDetails = () => import(/* webpackChunkName: "PopupMoreDetails" */ './components/shared/PopupMoreDetails.vue');
// const PopupRentNow = () => import(/* webpackChunkName: "PopupRentNow" */ './components/shared/PopupRentNow.vue');
// const PopupVideoBlock = () => import(/* webpackChunkName: "PopupVideoBlock" */ './components/shared/PopupVideoBlock.vue');
// const PopupGeoBlock = () => import(/* webpackChunkName: "PopupGeoBlock" */ './components/shared/PopupGeoBlock.vue');
// const PopupVideoError = () => import(/* webpackChunkName: "PopupVideoError" */ './components/shared/PopupVideoError.vue');
// const PopupLangFilter = () => import(/* webpackChunkName: "PopupLangFilter" */ './components/shared/PopupLangFilter.vue');
// const PopupTvodRent = () => import(/* webpackChunkName: "PopupTvodRent" */ './components/shared/PopupTvodRent.vue');
// const PopupNetworkError = () => import(/* webpackChunkName: "PopupNetworkError" */ './components/shared/PopupNetworkError.vue');
// const PopupFbBelowAge = () => import(/* webpackChunkName: "PopupFbBelowAge" */ './components/shared/PopupFbBelowAge.vue');
// const PopupFbLoginError = () => import(/* webpackChunkName: "PopupFbLoginError" */ './components/shared/PopupFbLoginError.vue');
// const PopupSignupWelcomePage = () => import (/* webpackChunkName: "PopupSignupWelcomePage" */ './components/shared/PopupSignupWelcomePage.vue');
// const PopupKidsSignin = () => import(/* webpackChunkName: "PopupKidsSignin" */ './components/shared/PopupKidsSignin.vue');
// const PopupKidsSubscribe = () => import(/* webpackChunkName: "PopupKidsSubscribe" */ './components/shared/PopupKidsSubscribe.vue');
// const PopupVideoBlockRowFav = () => import(/* webpackChunkName: "PopupVideoBlockRowFav" */ './components/shared/PopupVideoBlockRowFav.vue');
// const PopupLanguagePrefRegistered = () => import(/* webpackChunkName: "PopupVideoBlockRowFav" */ './components/shared/PopupLanguagePrefRegistered.vue');
// const PopupLanguagePrefAnonymous = () => import(/* webpackChunkName: "PopupVideoBlockRowFav" */ './components/shared/PopupLanguagePrefAnonymous.vue');
// const popupFavAddError = () => import(/* webpackChunkName: "popupFavAddError" */ './components/shared/popupFavAddError.vue');
// const PopupStateSelect = () => import(/* webpackChunkName: "PopupStateSelect" */ './components/shared/PopupStateSelect.vue');
// const PopupFBStateSelect = () => import(/* webpackChunkName: "PopupFBStateSelect" */ './components/shared/PopupFBStateSelect.vue');
//
// const PopupCountrywiseVideoBlock = () => import(/* webpackChunkName: "PopupFBStateSelect" */ './components/shared/popupCountrywiseVideoBlock.vue');
// const PopupFaqQuestion = () => import(/* webpackChunkName: "PopupFBStateSelect" */ './components/shared/popupFaqQuestion.vue');
// const PopupValidationMessage = () => import(/* webpackChunkName: "PopupFBStateSelect" */ './components/shared/popupValidationMessage.vue');


export default {
  name: 'app',
  data() {
    return {
      showPopUp : false,
      popUpComponent : undefined,
      showNetworkError: false,
      showPopupFbBelowAge: false,
      showPopupFbLoginError: false,
      showPopupSignupWelcomePage: false,
      showPopupKidsSignin: false,
      showPopupKidsSubscribe: false,
      altUser: undefined,
      showBlockVideoFavRow: false,
      showLanguagePrefRegistered: false,
      showLanguagePrefAnonymous: false,
      showPopupVideoAddToFavError: false,
      showPopupStateSelect: false,
      showPopupFBStateSelect: false,
      showPopupCountrywiseVideoBlock: false,
      showPopupFaqQuestion: false,
      showPopupValidationMessage: false,
      altUser: undefined
    }
  },
  computed: {
    ...mapGetters([
      'appActive',
      'altMessage',
      'appVersionName',
      'appVersionCode',
      'chromecastState',
      'baseUrl'
    ]),
  },
  methods: {
    ...mapMutations([
      'setAppActive',
      'setBaseUrl',
      'setAltMessages',
      'setAltSubsPageMessages',
      'setSyndicationUrl',
      'setPaymentProxyUrl',
      'setChromecastState',
      'setEpisodeList'
    ]),
    ...mapActions([
      'actGetConfig',
      'actGetDomain',
      'actGetOrders',

    ]),
    initApp() {
      // Get the configuration data
      this.getConfigData();
    },
    getConfigData() {
      this.actGetConfig().then((response) => {
         // Checking the type of response and parsing accordingly
        if (typeof(response) == 'string') {
          response = JSON.parse(response);
        }
           
        let featuredCarousalScroll = response.featuredCarousalScrollTime ? response.featuredCarousalScrollTime : '';
        var altConfig = {
          environment: response.environment,
          currencies: response.currencies,
          messages: response.messages,
          subscriptionPage: response.subscriptionPage,
          discountPrices: response.discountPrices,
          kids: response.kids,
          menus: response.menu,
          pageLimit: response.pageLimit,
          passwordMaxLength: response.passwordMaxLength,
          passwordMinLength: response.passwordMinLength,
          welcomePage: response.welcomePage,
          payment_config: (response.payment_config && response.payment_config.payment_providers) ? response.payment_config.payment_providers : null,
          baseUrl: (response.environment && response.environment.mmURL) ? response.environment.mmURL : null,
          geoApiUrl: (response.environment && response.environment.geolocationURL) ? response.environment.geolocationURL : null,
          facebookID: (response.environment && response.environment.facebookID) ? response.environment.facebookID : null,
          title: (response.environment && response.environment.title) ? response.environment.title : null,
          freshdeskUrl: (response.environment && response.environment.freshDeskURL) ? response.environment.freshDeskURL : null,
          freshDeskAPIKey: (response.environment && response.environment.freshDeskAPIKey) ? response.environment.freshDeskAPIKey : null,
          regional: response.regional,
          promo : response.promo,
          paymentProxyURL : (response.environment && response.environment.paymentProxyURL) ? response.environment.paymentProxyURL : null,
          webEngage : response.webEngage,
          qualitySelection : response.qualitySelection,
          featuredCarousalScrollTime: featuredCarousalScroll,
          episodeList: response.episodeList,
          campaign: response.campaign,
          buffer_campaign: response.buffer_campaign
        };

        this.setBaseUrl(altConfig.baseUrl);
        let syndicationUrl = undefined;
        syndicationUrl = altConfig && altConfig.promo && altConfig.promo.syndicationURL ? altConfig.promo.syndicationURL : undefined;
        if (!syndicationUrl) {
          syndicationUrl = altConfig && altConfig.campaign && altConfig.campaign.environment && altConfig.campaign.environment.syndicationURL  ? altConfig.campaign.environment.syndicationURL : undefined;
        }
        this.setSyndicationUrl(syndicationUrl);
        this.setAltMessages(altConfig.messages);
        this.setAltSubsPageMessages(altConfig.subscriptionPage);


        this.setEpisodeList(altConfig.episodeList);

        // console.log("altConfig.paymentProxyURL",altConfig.paymentProxyURL);
        this.setPaymentProxyUrl(altConfig.paymentProxyURL);

        localStorage.setItem("paymentProxyURL", altConfig.environment.paymentProxyURL);
        var urlMain = window.location.href;
        var res = urlMain.split("#");
        localStorage.setItem("currentHostName", res[0]);
        var successFailUrlHost = res[0];
        var successFailUrlHostSF  = successFailUrlHost.substring(0, successFailUrlHost.length - 1);
        localStorage.setItem("currentHostNameSF", successFailUrlHostSF);

        localStorage.setItem('altConfig', JSON.stringify(altConfig));

        // Get the Domain Data
        this.getDomain();

        // Setting the device ID
        var altDeviceId = localStorage.getItem('altDeviceId');
        if (!(altDeviceId)) {
          localStorage.setItem('altDeviceId', this.generateRandomId(32));
        }

        // To prompt the user to enable the protected content playback once he enter the playerscreen for the first time
        if (!(localStorage.getItem('promptPcPlayback'))) {
          localStorage.setItem('promptPcPlayback', JSON.stringify({ value: true }));
        }

        // Register the device name
        var altDeviceName = undefined;
        if (localStorage.getItem('altDeviceName')) {
          altDeviceName = localStorage.getItem('altDeviceName');
        } else {
          var platform = this.altDetectPlatform();

          if (platform) {
            altDeviceName = platform.os + ' ' + platform.osVersion + ' ' + platform.browser + ' ' + platform.browserVersion;
          }
          // Set the device name to localStorage
          localStorage.setItem('altDeviceName', altDeviceName);
        }
      }, (error) => {
        // console.log('[App | getConfig | error ]', error);
      });
    },
    getDomain() {
      this.actGetDomain().then((response) => {
        localStorage.setItem('altGeoData', JSON.stringify(response));

        var homeDomain = 'IN';
        var visitedDomain = 'IN';

        if (response.country && response.country.iso_code && response.country.iso_code != 'IN') {
          visitedDomain = 'row';
        }

        if(!localStorage.getItem('homeDomain')) {
          localStorage.setItem('homeDomain', homeDomain);
        }
        let altUser = localStorage.getItem('altUser') ? true : false;
        if (!altUser) {
          localStorage.setItem('homeDomain', visitedDomain);
        }

        localStorage.setItem('visitedDomain', visitedDomain);

        this.loadStyleAsyc('/swiper/css/swiper.min.css').then(() => {
          this.loadScriptAsyc('/swiper/js/swiper.min.js').then(() => {
            this.loadScriptAsyc('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1').then(() => {
            //  this.setAppActive(true);
            });
          });
        });
        // Initializing the Mobile Analytics, Notification
        this.initAWSMA();
      }, (error) => {
        // console.log('[App | getDomain | error | ]', error);
      });
    },
    filterNavMenus(menus) {
      var sectionMenus = menus.filter((menu) => {
        return menu.type == 'section';
      });
      var otherMenus = menus.filter((menu) => {
        return menu.type != 'section' && menu.type != 'downloads' && menu.type != 'subscribe';
      });

      if (sectionMenus && sectionMenus.length) {
        this.setSectionMenus(sectionMenus);
      }
      if (otherMenus && otherMenus.length) {
        this.setOtherMenus(otherMenus);
      }
    },
    getHomeSectionId(menus) {
      var homeMenu = menus.filter((menu) => {
        return menu.title == 'Home' && menu.type == 'section';
      });
      if (homeMenu && homeMenu.length) {
        var homeSectionId = homeMenu[0].sectionID;
        if (homeSectionId) {
          this.setHomeSectionId(homeSectionId);
        }
      }
    },
    getKidsSectionId(kids) {
      this.setKidsSectionId(kids.sectionID);
    },
    goToLogin() {
      this.$router.push({ name: 'login' });
      this.toggleKidsSigninPopup(false);
    },
    loadScriptAsyc(scriptSrc) {
        return new Promise(function (resolve, reject) {
            let scriptTag;
            scriptTag = document.createElement('script');
            scriptTag.src = scriptSrc;
            scriptTag.onload = resolve;
            scriptTag.onerror = reject;
            document.body.appendChild(scriptTag);
        });
    },
    loadStyleAsyc(styleSrc) {
        return new Promise(function (resolve, reject) {
            let styleTag;
            styleTag = document.createElement('link');
            styleTag.href = styleSrc;
            styleTag.rel = 'stylesheet';
            styleTag.onload = resolve;
            styleTag.onerror = reject;
            document.head.insertBefore(styleTag, document.head.childNodes[document.head.childNodes.length - 1 ].nextSibling );
        });
    },
    initAWSMA() {
      import(/* webpackChunkName: 'AWSMA' */ 'aws-sdk-mobile-analytics').then((AWSMA) => {
        // Get the config data
        var altConfig = undefined;
        if (localStorage.getItem('altConfig')) {
          altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        // If Config data not present exit out of method
        if (!altConfig) return;

        // AWS Configuration
        // production
        AWS.config.region = 'us-east-1';

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          // production
          IdentityPoolId: 'us-east-1:25fbde9b-f19b-45e3-8e12-ffa78d3c65a8'
        });

        // Gets the platform information [mixins.js]
        var userAgentDetails = this.altDetectPlatform();

        // NOTE added for utm_source and partner id
         var utm_source = null;
         utm_source = this.$route.query.utm_source ? this.$route.query.utm_source : (this.$route.query.partner ? this.$route.query.partner : 'N.A');
         console.log("utm_source",utm_source);
        let utm_campaign = 'N.A';
        let utm_medium  = 'N.A';
        let utm_term = 'N.A';

        utm_campaign = (this.$route && this.$route.query && this.$route.query.utm_campaign) ? this.$route.query.utm_campaign : 'N.A';

        utm_medium = (this.$route && this.$route.query && this.$route.query.utm_medium) ? this.$route.query.utm_medium : 'N.A';

        utm_term = (this.$route && this.$route.query && this.$route.query.utm_term) ? this.$route.query.utm_term : 'N.A';

        // Setting the AWSMA Configuration
        var options = {
          appId: altConfig.environment.awsMobileAnalyticsAppID,
          appTitle : 'ALTBalaji',
          appVersionName : 'V' + this.appVersionName,
          appVersionCode : this.appVersionCode,
          autoSubmitInterval: 15000,
          platform: 'PWA',
          sessionLength: 1800000,
          make: userAgentDetails.browser,
          globalAttributes: {
            br_name : userAgentDetails.browser +"-"+ userAgentDetails.browserVersion,
            br_family:userAgentDetails.browser,
            br_version : userAgentDetails.browserVersion,
            br_type : userAgentDetails.browser,
            user_id: null,
            user_email: null,
            user_session: null,
            utm_source: utm_source,
            utm_campaign:utm_campaign,
            utm_medium:utm_medium,
            utm_term:utm_term
          },
        };
        window.mobileAnalyticsClient = new AMA.Manager(options);

        this.setAppActive(true);
        // AWSMA Configuration ends
        import(/* webpackChunkName: 'Firebase-App' */ 'firebase/app').then((FBApp) => {

          import(/* webpackChunkName: 'Firebase-Messaging' */ 'firebase/messaging').then((FBMessaging) => {
            FBApp.initializeApp({
               // prod
               messagingSenderId: '272835984405'
               

              //preprod 
             // messagingSenderId: "215881161634"
            });

            // Generating the messaging token
            FBApp.messaging().requestPermission().then(function(){
              return FBApp.messaging().getToken();
            }).then(function(token){
              var sns = new AWS.SNS();
              var params = {
                // production
                PlatformApplicationArn: 'arn:aws:sns:us-east-1:674028813667:app/GCM/LTE_PWA_PREPROD', /* required */
                // PlatformApplicationArn: 'arn:aws:sns:ap-southeast-1:467818288723:app/GCM/pwatest',
                Token: token, /* required */
              };
              sns.createPlatformEndpoint(params, function(error, data) {
                if (error) {
                  // console.log('[App | initAWSMA | createPlatformEndpoint | error | ]', error);
                } else {
                  // console.log('[App | initAWSMA | createPlatformEndpoint | data | ]', data);
                }
              });
            }).catch(function(error){
              // console.log('[App | initAWSMA | Notification | requestPermission | error ]', error);
            })
            FBApp.messaging().onMessage(function(payload) {
              var dataList = JSON.stringify(payload.data.message);
              var splitBacket = dataList.split("{");
              var splitComma=splitBacket[2].split(",");
              var title=splitComma[0].split("title:")[1];
              var message=splitComma[1].split("message:")[1];
              var url=splitComma[2].split("url:")[1];
              var bigImage=splitComma[3].split("bigImage:")[1];
              bigImage=String(bigImage).slice(0, -3);

              const notificationTitle = String(title);
              const notificationOptions = {
                body: String(message),
                icon: "../../src/assets/altlogo144.png",
                click_action: String(url),
                badge:"../../src/assets/badgeicon.png",
                image:bigImage,
                data: {
                  action:url
                }
              };

              if (!("Notification" in window)) {
                // console.log("This browser does not support system notifications");
              }
              // Let's check whether notification permissions have already been granted
              else if (Notification.permission === "granted") {
                navigator.serviceWorker.ready.then(function(registration) {
                  registration.showNotification(notificationTitle,notificationOptions);
                });
              }
            });
          }).catch((error) => {
            // console.log('[Error | Creating firebase messaging instance | ]', error);
          });
        }).catch((error) => {
          // console.log('[Error | Creating firebase app instance | ]', error);
        });
        // End of Notification code
      }).catch((error) => {
        // console.log('[initAWSMA | error | ]', error);
      });
    },
    hidePreAppCmp() {
      var preAppCmp = undefined;
      if (document.getElementById('pre-app')) {
        preAppCmp = document.getElementById('pre-app');

        preAppCmp.style.display = 'none';
      }
    },
    toggleAppModeChangeCB(mode) {
      // console.log('[toggleAppModeChangeCB > mode]', mode);

      localStorage.setItem('altProfileMode', mode);

      this.checkAppMode();

      if (mode == 'kids') this.setHeaderTitle(false);
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

            var subscribeDayExpire = 0, todayExpire = false, showPopupNotificationConfirm = false, tvodNotification = 0, expiredSubscription = 0;
            var showPopupNotification = false, tvodTitle = undefined, tvodDays = 0, subscriptionNotification = 0, expiredTvod = false;
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
                    var timeDiff = (new Date().getTime() - new Date(tvodPlans[i].dates.valid_to.split('+')[0].split('+')[0]).getTime()) / (1000 * 3600 * 24);
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
                    var timeDiff = (new Date().getTime() - new Date(activeSubsOrders[i].dates.valid_to.split('+')[0].split('+')[0]).getTime()) / (1000 * 3600 * 24);
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
            } if(orderData && orderData.subscription && !orderData.subscription.hasOrder && orderData.subscription.expired) {
                expiredSubscription=1;
            }

            var notifications = undefined;
            var email = undefined;
            if(localStorage.getItem('user_email')) {
                email = localStorage.getItem('user_email');
            }
            notifications = {"email":email,"subscriptionNotification": subscriptionNotification,"expiredSubscription": expiredSubscription,"tvodNotification": tvodNotification,"expiredTvod": expiredTvod};
            var notificationCount = subscriptionNotification + expiredSubscription + tvodNotification;
            localStorage.setItem('notificationsCount', notificationCount);

            notifications = localStorage.getItem('notificationsCount');
        },
        (error) => {
            // console.log("app.vue | error",error);
            this.clearUserData();
            this.$router.push({ name: 'login' });
        });
    },
    togglePopupKidsSubscribeCB(state) {
        popUpComponentList['kids-subscribe'] = () => import (/* webpackChunkName: "kids-subscribe-pop-up" */ './components/shared/PopupKidsSubscribe.vue');
        this.popUpComponent = popUpComponentList['kids-subscribe'];
      this.showPopUp = state;

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'subscribe';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
      // End of AWS Mobile SDK Events
    },
    toggleSigninPopupCB(state) {

      this.popUpComponent = popUpComponentList['sign-in'];
      this.showPopUp = state;

      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'signin';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
    },
    togglePopupKidsSigninCB(state) {
        popUpComponentList['kids-sign-in'] = () => import (/* webpackChunkName: "kids-sign-in-pop-up" */ './components/shared/PopupKidsSignin.vue');
        this.popUpComponent = popUpComponentList['kids-sign-in'];
      this.showPopUp = state;

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'signin';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
      // End of AWS Mobile SDK Events
    },
    togglePlayerSigninPopupCB(state) {
        popUpComponentList['player-sign-in'] = () => import (/* webpackChunkName: "player-sign-in-pop-up" */ './components/shared/PopupPlayerSignin.vue');
        this.popUpComponent = popUpComponentList['player-sign-in'];

        this.showPopUp = state;
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'signin';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
    },
    togglePlayerFavSigninPopupCB(state) {
        popUpComponentList['favourite-sign-in'] = () => import (/* webpackChunkName: "favourite-sign-in-pop-up" */ './components/shared/PopupPlayerFavSignin.vue');
        this.popUpComponent = popUpComponentList['favourite-sign-in'];

      this.showPopUp = state;

      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'signin';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
    },
    toggleSubscribePopupCB(state) {

        this.popUpComponent = popUpComponentList['subscribe'];

      this.showPopUp = state;

      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'subscribe';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
    },
    toggleMoreDetailsPopupCB(state) {
        popUpComponentList['more-details'] = () => import (/* webpackChunkName: "more-details-pop-up" */ './components/shared/PopupMoreDetails.vue');
        this.popUpComponent = popUpComponentList['more-details'];
      this.showPopUp = state;
    },
    toggleRentNowPopupCB(state) {
        popUpComponentList['rent-now'] = () => import (/* webpackChunkName: "rent-now-pop-up" */ './components/shared/PopupRentNow.vue');
        this.popUpComponent = popUpComponentList['rent-now'];
        this.showPopUp = state;
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'rent';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
      // End of AWS Mobile SDK Events
    },
    toggleRentTvodItemCB(state) {
        popUpComponentList['tvod-rent'] = () => import (/* webpackChunkName: "tvod-rent-pop-up" */ './components/shared/PopupTvodRent.vue');
        this.popUpComponent = popUpComponentList['tvod-rent'];
        this.showPopUp = state;
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }


      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.event_mode = 'rent';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
      // End of AWS Mobile SDK Events
    },
    togglePopupSignupWelcomePageCB(state) {
        popUpComponentList['welcome'] = () => import (/* webpackChunkName: "welcome-pop-up" */ './components/shared/PopupSignupWelcomePage.vue');
        this.popUpComponent = popUpComponentList['welcome'];
      this.showPopUp = state;

      if(state) {
          if(document.getElementById('alt-app')) {
              document.getElementById('alt-app').style.position = "fixed";
          }
      }

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_action = state ? 'open' : 'close';
        eventAttributeObj.content_id = 'N.A';
        eventAttributeObj.event_mode = 'welcome-page';
        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
      // End of AWS Mobile SDK Events
    },
    toggleLanguageFilterCB(state) {
        popUpComponentList['language-filter'] = () => import (/* webpackChunkName: "language-filter-pop-up" */ './components/shared/PopupLangFilter.vue');
        this.popUpComponent = popUpComponentList['language-filter'];
        document.getElementById('alt-app').style.overflow = state ? 'fixed' : 'relative';
      this.showPopUp = state;
    },
    handleBrowserStateBlurCB(_event) {
      eventBus.$emit('browserStateBlurEvent', true);
    },
    togglePopupStateSelectCB (state) {
        popUpComponentList['state-selection'] = () => import (/* webpackChunkName: "state-selection-pop-up" */ './components/shared/PopupStateSelect.vue');
        this.popUpComponent = popUpComponentList['state-selection'];

      this.showPopUp = state;
    },
    togglePopupFBStateSelectCB (state) {
        popUpComponentList['fb-state-selection'] = () => import (/* webpackChunkName: "fb-state-selection-pop-up" */ './components/shared/PopupFBStateSelect.vue');
        this.popUpComponent = popUpComponentList['fb-state-selection'];
      this.showPopUp = state;
    },
    toggleLanguagePrefRegisterdCB (state) {

    document.getElementById('body').style.position = "fixed";
      popUpComponentList['language-pref-registered'] = () => import (/* webpackChunkName: "language-pref-reg-pop-up" */ './components/shared/PopupLanguagePrefRegistered.vue');
      this.popUpComponent = popUpComponentList['language-pref-registered'];
      this.showPopUp = state;
      // If state is false, don't send the analytics
      if (!state) return;

      // AWS Analytics
      // _popup.view
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();
        eventAttributeObj.event_mode = 'content_language';

        // console.log('[App -> toggleLanguagePrefRegisterdCB -> eventAttributeObj]', eventAttributeObj);

        window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
      }
    },
    toggleLanguageFeatureAnonymousCB (state) {
      this.popUpComponent = popUpComponentList['language-pref-anonymous'];
      this.showPopUp = state;

      if (!state) return;
      setTimeout(sendAnalytics, 2000);

      let self = this;
      function sendAnalytics() {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = self.getAWSMACommonAttributes();
          eventAttributeObj.event_mode = 'content_language';

          window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
        }
      }

    },
    searchPageMakeNotScrolling(state) {
      if(state) {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }
      } else {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "relative";
        }
      }
    },
    geoBlockAnalytics() {
        if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.event_mode = 'geo-block';
            window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
        }
    },
    createCustomDataForChromeCast(playerContent) {
        let chromecastdata = {};
        let altUser = undefined;
        let altDevice = undefined;
        let mmurl = undefined;
        if(playerContent && playerContent.stream) {
            chromecastdata.streamId = playerContent.stream.streamId;
            chromecastdata.streamUrl = playerContent.stream.streamUrl;
        } else {
            chromecastdata.streamId = playerContent.trailer.id;
            chromecastdata.streamUrl = playerContent.trailer.trailerUrl;
        }
        chromecastdata.image = playerContent.images.cover;
        chromecastdata.id = playerContent.id;

        if(playerContent.contentName) {
            chromecastdata.contentName = playerContent.contentName;
        }
        let domain = undefined;
        domain = localStorage.getItem("homeDomain") ? localStorage.getItem("homeDomain") : 'IN';

        chromecastdata.href = (location.pathname).slice(1) + "?domain=" + domain;

        chromecastdata.sessionToken = '';
        chromecastdata.uuid = ''
        chromecastdata.title = playerContent.title;
        chromecastdata.shortDescription = playerContent.shortDescription;
        chromecastdata.progressInSec = playerContent.timeProgress;

        if(localStorage.getItem('altConfig')) {
            mmurl = JSON.parse(localStorage.getItem('altConfig'));

            mmurl = mmurl.environment.mmURL;
            chromecastdata.baseURL = mmurl;
        }


        // NOTE content type

        // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
        if (this.$route.name && this.$route.name == 'show') {
          chromecastdata.contentName = 'trailer';
        }

        // NOTE end for content type;

        if(localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
            chromecastdata.sessionToken = altUser.sessionToken ;
            if(localStorage.getItem('altDevice')) {
                altDevice = JSON.parse(localStorage.getItem('altDevice'));
                chromecastdata.uuid = altDevice.uuid;
            }
        }

         if (chromecastdata.contentName == 'trailer' && playerContent.trailer) {
             chromecastdata.streamId = playerContent.trailer.id;
             chromecastdata.streamUrl = playerContent.trailer.trailerUrl;
         }

         if(!chromecastdata.streamId && !chromecastdata.streamUrl) {
             chromecastdata.streamId = playerContent.stream.streamId;
             chromecastdata.streamUrl = playerContent.stream.streamUrl;
         }

        // console.log("chromecastdata",chromecastdata);
        return  chromecastdata;
    },
    addContent(castSession,playerContent) {

        let dataList = this.createCustomDataForChromeCast(playerContent);

        let mediaInfo = new chrome.cast.media.MediaInfo(dataList.streamUrl,"video/mp4");
        mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
        mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
        mediaInfo.metadata.title = dataList.title;
        mediaInfo.metadata.subtitle = dataList.shortDescription;
        mediaInfo.metadata.images = [{'url': dataList.image}];

        let imageList = [];

        mediaInfo.customData = {"typeofItem":dataList.contentName, "deviceID":dataList.uuid, "episodeNumber":0, "mediaId":dataList.id, "baseURL" : dataList.baseURL, "isSeries":false, "href":dataList.href, "streamID":dataList.streamId,"sessionToken":dataList.sessionToken,"imageList":imageList};

        let request = new chrome.cast.media.LoadRequest(mediaInfo);


        request.currentTime = dataList.progressInSec;
        request.contentID = dataList.streamUrl;
        request.contentType="video/mp4";
        request.streamType ="playready-dash";
        request.streamDuration = 20;
        request.mediaTracks = [];
        request.textTrackStyle = '';
        request.imageList = imageList;
        request.totalDuration = 20;

        let loadPromise = castSession.loadMedia(request);
        loadPromise.then(() => {
            // console.log('Cast content loaded');
        }).catch((error) => {
            // console.log("loadMedia | error",error);
        });
    },
    handleCastConnectionEvent(remotePlayer) {
        let castSession = undefined;
        if (remotePlayer.isConnected == true) {
            castSession = cast.framework.CastContext.getInstance().getCurrentSession();
            // console.log("remote Player on");
            localStorage.setItem("modeType","chromecast")
             this.setChromecastState(castSession);
              eventBus.$emit('toggleChromeCastPlaying');
        } else {
            castSession = null;
            this.setChromecastState(false);
            localStorage.setItem("modeType","fullscreen")
            // eventBus.$emit('toggleChromeCastPlaying');
            // console.log("remote player off");
        }
    },
    initializeCastApi () {
        let castOptions = {};
        let remotePlayer = undefined;
        if(!cast) {
            return;
        }
        // console.log("chromeCast is available");

        castOptions.receiverApplicationId = "5D2B6D18";  // prod 5D2B6D18 // safi 8644FA01
        castOptions.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
        cast.framework.CastContext.getInstance().setOptions(castOptions);

        remotePlayer = new cast.framework.RemotePlayer();
        let remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

        remotePlayerController.addEventListener(
            cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
            () => {
                this.handleCastConnectionEvent(remotePlayer);
            });
        remotePlayerController.addEventListener(
            cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
            (event) => {
                if (event.value == null) {
                }
            }
        );
    },

  },
  components: {
    'app-header-menu': HeaderMenu
    // 'popup-kids-create-pin': PopupKidsCreatePin,
    // 'popup-kids-exit-pin': PopupKidsExitPin,
    // 'popup-device-removed': PopupDeviceRemoved,
    // 'popup-search': Search,
    // 'popup-signin': PopupSignin,
    // 'popup-player-signin': PopupPlayerSignin,
    // 'popup-player-fav-signin': PopupPlayerFavSignin,
    // 'popup-subscribe': PopupSubscribe,
    // 'popup-more-details': PopupMoreDetails,
    // 'popup-rent-now': PopupRentNow,
    // 'popup-video-block': PopupVideoBlock,
    // 'popup-geo-block': PopupGeoBlock,
    // 'popup-video-error': PopupVideoError,
    // 'popup-lang-filter': PopupLangFilter,
    // 'popup-tvod-rent': PopupTvodRent,
    // 'popup-network-error': PopupNetworkError,
    // 'popup-fb-below-age': PopupFbBelowAge,
    // 'popup-fb-login-error': PopupFbLoginError,
    // 'popup-signup-welcome-page': PopupSignupWelcomePage,
    // 'popup-kids-signin': PopupKidsSignin,
    // 'popup-kids-subscribe': PopupKidsSubscribe,
    // 'popup-block-video-row-fav': PopupVideoBlockRowFav,
    // 'popup-video-fav-add-error': popupFavAddError,
    // 'popup-state-select': PopupStateSelect,
    // 'popup-fb-state-select': PopupFBStateSelect,
    // 'popup-language-pref-registered' : PopupLanguagePrefRegistered,
    // 'popup-language-pref-anonymous': PopupLanguagePrefAnonymous,
    // 'popup-country-geo-block':PopupCountrywiseVideoBlock,
    // 'popup-faq-question':PopupFaqQuestion,
    // 'popup-validation-message':PopupValidationMessage,

  },
  created() {
    if(localStorage.getItem('altUser')) {
      this.altUser = JSON.parse(localStorage.getItem('altUser'));

      this.notificationProcessOrders();
    }

    localStorage.setItem("modeType","fullscreen")

    // Registering EventBus Event listeners
    eventBus.$on('toggleAppModeChangeEvent', this.toggleAppModeChangeCB);
    eventBus.$on('togglePopupKidsCreatePin', (state) => {
        popUpComponentList['kids-create-pin'] = () => import (/* webpackChunkName: "create-pin-pop-up" */ './components/shared/PopupKidsCreatePin.vue');
        this.popUpComponent = popUpComponentList['kids-create-pin'];

        this.showPopUp = state;
    });
    eventBus.$on('togglePopupKidsExitPin', (state) => {
        popUpComponentList['kids-exit-pin'] = () => import (/* webpackChunkName: "exit-pin-pop-up" */ './components/shared/PopupKidsExitPin.vue');
        this.popUpComponent = popUpComponentList['kids-exit-pin'];

        this.showPopUp = state;
    });
    eventBus.$on('togglePopupDeviceRemoved', (state) => {
        popUpComponentList['device-removed'] = () => import (/* webpackChunkName: "device-removed-pop-up" */ './components/shared/PopupDeviceRemoved.vue');
        this.popUpComponent = popUpComponentList['device-removed'];

        this.showPopUp = state;
    });
    eventBus.$on('togglePopupSearch', (state) => {
        popUpComponentList['search'] = () => import (/* webpackChunkName: "search-pop-up" */ './components/shared/Search.vue');
        this.popUpComponent = popUpComponentList['search'];

        this.showPopUp = state;
      this.searchPageMakeNotScrolling(state);
    });
    eventBus.$on('toggleSigninPopupEvent', this.toggleSigninPopupCB);
    eventBus.$on('togglePlayerSigninPopupEvent', this.togglePlayerSigninPopupCB);
    eventBus.$on('togglePlayerFavSigninPopupEvent', this.togglePlayerFavSigninPopupCB);
    eventBus.$on('toggleSubscribePopupEvent', this.toggleSubscribePopupCB);
    eventBus.$on('toggleMoreDetailsPopupEvent', this.toggleMoreDetailsPopupCB);
    eventBus.$on('toggleRentNowPopupEvent', this.toggleRentNowPopupCB);
    eventBus.$on('toggleRentTvodItemEvent', this.toggleRentTvodItemCB);
    eventBus.$on('togglePopupSignupWelcomePageEvent', this.togglePopupSignupWelcomePageCB);
    eventBus.$on('toggleVideoBlockPopupEvent', (state) => {
        popUpComponentList['video-block'] = () => import (/* webpackChunkName: "video-block-pop-up" */ './components/shared/PopupVideoBlock.vue');
        this.popUpComponent = popUpComponentList['video-block'];
        this.showPopUp = state;
    });
    eventBus.$on('toggleGeoBlockEvent', (state) => {
        popUpComponentList['geo-block'] = () => import (/* webpackChunkName: "geo-block-pop-up" */ './components/shared/PopupGeoBlock.vue');
        this.popUpComponent = popUpComponentList['geo-block'];
        this.showPopUp = state;

        if(state) {
            this.geoBlockAnalytics();
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "fixed";
            }
        }
    });
    eventBus.$on('toggleVideoErrorPopupEvent', (state) => {
        popUpComponentList['video-error'] = () => import (/* webpackChunkName: "video-error-pop-up" */ './components/shared/PopupVideoError.vue');
        this.popUpComponent = popUpComponentList['video-error'];
        this.showPopUp = state;
    });
    eventBus.$on('toggleLanguageFilterEvent', this.toggleLanguageFilterCB);
    eventBus.$on('togglePopupNetworkError', (state) => { this.showNetworkError = state; });
    eventBus.$on('togglePopupFbBelowAge', (state) => {
        popUpComponentList['fb-below-age'] = () => import (/* webpackChunkName: "fb-below-age-pop-up" */ './components/shared/PopupFbBelowAge.vue');
        this.popUpComponent = popUpComponentList['fb-below-age'];
        this.showPopUp = state;
    });
    eventBus.$on('togglePopupFbLoginError', (state) => {
        popUpComponentList['fb-login-error'] = () => import (/* webpackChunkName: "fb-login-error-pop-up" */ './components/shared/PopupFbLoginError.vue');
        this.popUpComponent = popUpComponentList['fb-login-error'];
        this.showPopUp = state;
    });
    eventBus.$on('togglePopupKidsSignin', this.togglePopupKidsSigninCB);
    eventBus.$on('togglePopupKidsSubscribe', this.togglePopupKidsSubscribeCB);
    eventBus.$on('togglePopupStateSelectEvent', this.togglePopupStateSelectCB);
    eventBus.$on('togglePopupFBStateSelectEvent', this.togglePopupFBStateSelectCB);
    eventBus.$on('toggleBlockFavPopup', (state) => {
        popUpComponentList['video-block-row'] = () => import (/* webpackChunkName: "video-block-row-pop-up" */ './components/shared/PopupVideoBlockRowFav.vue');
        this.popUpComponent = popUpComponentList['video-block-row'];
        this.showPopUp = state;
    });
    eventBus.$on('toggleLanguagePrefRegisterdEvent', this.toggleLanguagePrefRegisterdCB);
    eventBus.$on('toggleLanguageFeatureAnonymousEvent', this.toggleLanguageFeatureAnonymousCB);
    eventBus.$on('toggleVideoAddToFavError', (state) => {
        popUpComponentList['favourite-add-error'] = () => import (/* webpackChunkName: "favourite-add-error-pop-up" */ './components/shared/popupFavAddError.vue');
        this.popUpComponent = popUpComponentList['favourite-add-error'];
        this.showPopUp = state;
    });

    eventBus.$on('toggleCountrywiseVideoBlock', (state) => {
        popUpComponentList['country-geo-block'] = () => import (/* webpackChunkName: "country-geo-block-pop-up" */ './components/shared/popupCountrywiseVideoBlock.vue');
        this.popUpComponent = popUpComponentList['country-geo-block'];
         this.showPopUp = state;
      if(state) {
          this.geoBlockAnalytics();
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }
      }
    });

    eventBus.$on('toggleFaqQuestion', (state) => {
        popUpComponentList['faq-question'] = () => import (/* webpackChunkName: "faq-question-pop-up" */ './components/shared/popupFaqQuestion.vue');
        this.popUpComponent = popUpComponentList['faq-question'];
        this.showPopUp = state;
      if(state) {
        if(document.getElementById('alt-app')) {
         // document.getElementById('alt-app').style.position = "fixed";
        }
      }
    });

   let _this = this;
    window['__onGCastApiAvailable'] = function(isAvailable) {
        if (isAvailable) {
          // console.log("here");
             _this.initializeCastApi();
        }
    };
   eventBus.$on("chromecastPlayback",(state)=> {
       // console.log("app.vue | chromecastPlayback | state",state);
       if(state) {
            // this.chromecastState;
           _this.addContent(this.chromecastState,state);
       }
   });

    eventBus.$on('toggleMessageValidation', (state) => {
        popUpComponentList['validation-message'] = () => import (/* webpackChunkName: "validation-message-pop-up" */ './components/shared/popupValidationMessage.vue');
        this.popUpComponent = popUpComponentList['validation-message'];
        this.showPopUp = state;
        if(state) {
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "fixed";
            }
        }
    });

  },
  mounted() {
      popUpComponentList['language-pref-anonymous'] = () => import (/* webpackChunkName: "language-pref-anony-pop-up" */ './components/shared/PopupLanguagePrefAnonymous.vue');


      popUpComponentList['sign-in'] = () => import (/* webpackChunkName: "sign-in-pop-up" */ './components/shared/PopupSignin.vue');

      popUpComponentList['subscribe'] = () => import (/* webpackChunkName: "subscribe-pop-up" */ './components/shared/PopupSubscribe.vue');

    // Initialize the Application (Entry point of application)
    // console.log("test");
    // App's Entry point
    this.initApp();
    // Entry
    // Check in which status the app currently is
    // cheking app is in 'default' mode or 'kids' mode


   // here is only one mode, commented by sumit  13/04/2019 ************************
     this.checkAppMode();

    // Register the events for element outside the scope of App.vue
    this.registerAppEvents();


    window.addEventListener('blur', this.handleBrowserStateBlurCB);
  },
  beforeDestroy() {
    eventBus.$off('togglePopupKidsCreatePin');
    eventBus.$off('togglePopupSearch');
    eventBus.$off('togglePopupKidsExitPin');
    eventBus.$off('togglePopupDeviceRemoved');
    eventBus.$off('toggleSigninPopupEvent');
    eventBus.$off('togglePlayerSigninPopupEvent');
    eventBus.$off('toggleRentNowPopupEvent');
    eventBus.$off('togglePlayerFavSigninPopupEvent');
    eventBus.$off('togglePopupNetworkError');
    eventBus.$off('toggleVideoErrorPopupEvent');
    eventBus.$off('toggleGeoBlockEvent');
    eventBus.$off('togglePopupFbBelowAge');
    eventBus.$off('togglePopupFbLoginError');
    eventBus.$off('togglePopupSignupWelcomePageEvent');
    eventBus.$off('toggleLanguagePrefRegisterdEvent');
    eventBus.$off('toggleLanguageFeatureAnonymousEvent');
    eventBus.$off('toggleVideoAddToFavError');
    eventBus.$off('toggleValidationMessage');
    eventBus.$off('chromecastPlayback');
    eventBus.$off('toggleMoreDetailsPopupEvent', this.toggleMoreDetailsPopupCB);
  },
  mixins: [altMixins]
}
</script>
