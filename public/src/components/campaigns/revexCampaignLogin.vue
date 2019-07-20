
<template lang="html">
    <div class="paytm-campaign-container" style="background-image: url('');">
        <div class="paytm-campaign-header" style="margin-bottom: 0px;    margin-top: 12px;">
                <img :src="partnerDetails.promoBanner" v-if="partnerDetails && partnerDetails.promoBanner" alt="campaign-header">
        </div>
        <clear-device v-if="isActiveFbDel"></clear-device>
        <div class="paytm-campaign-body">
            <p class="paytm-header" v-if="partnerDetails && partnerDetails.offerText" style=" font-size: 15px;">{{partnerDetails.offerText}}</p>
            <form autocomplete="off">
                <div class="form-group">
                    <input type="email" name="email" id="email_text" placeholder="" class="form-control paytm-campaign-input" style="font-size: 15px;    height: 32px;" v-model="email">
                    <p v-if="emailError">{{emailError}}</p>
                </div>
                <!-- <p style="font-size:10px;">By entering your email id is you agree to <router-link :to="{ name: 'toc' }" class="link-under">Terms of Use</router-link> and <router-link :to="{ name: 'privacyPolicy' }" class="link-under">Privacy Policy</router-link></span></p> -->

                <input type="submit" class="grad-btn submit-btn btn" style="margin-top: 20px;" id="textEmail" @click.prevent="paytmGetEmail" v-model="altConfigPromo.submitButtonText">
            </form>
            <a href="" id="paytmLinkId"></a>
        </div>
        <div class="paytm-campaign-footer" id="paytm-footer" style="position:absolute">
            <component :is="fbLoginComponent" v-if ="fbLoginComponent" :isCampaignPage="true"></component>
            <div style="margin-bottom: 12px;margin-top: 61px;">
                    <p class="text-center" >By signing in, you agree to the <router-link :to="{ name: 'toc' }" class="link-under">Terms of Use</router-link> & <router-link :to="{ name: 'privacyPolicy' }" class="link-under">Privacy Policy</router-link>.</p>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>
  

<script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5T7BPPJ');

    console.log("two");
    
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const delAllDeviceFb = () => import(/* webpackChunkName: "login-Login-ClearDevices" */ '../login/ClearDevices.vue');

export default {
    data() {
        return {
            email: undefined,
            emailError: false,
            altUser: undefined,
            altConfigPromo: undefined,
            partnerDetails: undefined,
            campaignBanner: undefined,
            fbLoginComponent: undefined,
            isActiveFbDel: undefined
        }
    },
      computed: {
    ...mapGetters([
        'userEmailCampaign',
        'appActive'
    ]),
  },
  watch: {
      appActive() {
          console.log("app active");
           this.pageViewEvent();
      }
  },
    components : {
        'clear-device':delAllDeviceFb
    },
    methods: {
        ...mapMutations([
            'setUserEmailCampaign'
        ]),
        ...mapActions([
        'actPaytmSignup',
        'actPaytmLogin',
        'actPaytmGetDeviceList',
        'actPaytmDeleteDevice',
        'actPaytmRegisterDevice',
        'actPaytmHasCodeFeatures',
        'actGetAccountDetails',
        'actCreateOrder',
        'actProductDetails',
        'actSendEmailWithToken'
        ]),
        paytmGetEmail() {
            // if (localStorage.getItem('visitedDomain')) {
            //     localStorage.setItem("homeDomain", localStorage.getItem('visitedDomain'));
            // }
            var email_id = undefined;
            email_id = this.email;
            if(this.loginFormValid(email_id)) {
                this.toggleLoader(true);
                this.paytmSignup(email_id);
                this.setUserEmailCampaign(email_id);
                console.log(this.userEmailCampaign);
            }

        },
        goToSign() {
            this.toggleDeleteIco(false);
            this.toggleMenuIco(true);
            this.clearUserData();
            localStorage.setItem("campaign-redirect",true);
            this.$router.push({ name: 'login' });
        },
        signupAnalytics(data) {
            if (window.mobileAnalyticsClient) {
                let signupData = this.getAWSMACommonAttributes();
                signupData.user_id = data && data.id ? data.id : null ;
                signupData.user_email = data && data.login ? data.login : null;
                signupData.event_mode  = 'syndication-email';
                signupData.partner_id = this.$route && this.$route.query && this.$route.query.partner ? this.$route.query.partner : null;
                window.mobileAnalyticsClient.recordEvent('_user.signup', signupData, {});
            }


            // Start GTM code
            var altGeoData = undefined;
            if (localStorage.getItem('altGeoData')) {
                altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
            }
            var platformDetails = this.altDetectPlatform();
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': 'gt_complete_registration',
              'eventAction':'registration',
              'eventCategory':'gt_complete_registration',
              'eventLabel':'registration',
              'eventValue':1,
              'gtl_platform':(platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ',
              'gtl_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
              'gtl_country': altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en ? altGeoData.country.names.en : '',
              'gtl_city': altGeoData.city && altGeoData.city.names && altGeoData.city.names.en ? altGeoData.city.names.en : '',
              'gtl_device_timestamp': new Date().getTime(),
              'gtl_user_id':  data && data.id ? data.id : null 
            });
            // End of GTM Code

        },
        paytmSignup(email_id) {
            let request_body_signup = {
                   "login": email_id
               }
               // NOTE if call any syndication api ,then partner id ,we need to pass.
            localStorage.setItem("partner_id",this.partnerDetails.name);

            let timestamp = this.getTimestamp();
            var homeDomain = undefined;
            if (localStorage.getItem('homeDomain')) {
                homeDomain = localStorage.getItem('homeDomain');
            }
            let signupHeader = this.getSignedHeaders(request_body_signup,timestamp,homeDomain);
            let headers_signup = {
                "headerData":signupHeader,
                'timestamp' : timestamp,
                'data' : request_body_signup
            }

            this.actPaytmSignup(headers_signup).then((response) => {
                // console.log("paytmCampaignLogin.vue | paytmSignup | res",response);
                if(response && response.status == "ok") {

                this.sendResetEmailPassword(email_id);
                
                  localStorage.removeItem('altOrder');
                    this.signupAnalytics(response);
                    this.paytmLogin(email_id);
                }
            },
            (error) => {
                this.toggleDeleteIco(false);
                this.toggleMenuIco(true);

                // console.log("paytmCampaignLogin.vue | paytmSignup | error",error);
                if(error && error.code == 409) {
                    let altUser = undefined;
                    let altOrder = undefined;
                    this.toggleLoader(false);

                    var altUser = localStorage.getItem('altUser') ? JSON.parse(localStorage.getItem('altUser')) : false;

                    if (altUser) {
                        altOrder = localStorage.getItem('altOrder') ? JSON.parse(localStorage.getItem('altOrder')) : undefined;
                        if(altUser.email == email_id) {
                            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
                                this.$router.push({ name: 'home' });
                            } else {
                                this.$router.push({ name: 'paymentPage' });
                            }
                        } else {
                            this.clearUserData();
                            localStorage.setItem("campaign-redirect",true);
                            this.$router.push({ name: 'login' });
                        }

                    } else {
                        localStorage.setItem("campaign-redirect",true);
                        this.$router.push({ name: 'login' });
                    }
                }
            });
        },
        sendResetEmailPassword(email) {
                var emailData = {
                    login: email,
                    token_type: 'password',
                    uri: 'https://altbalaji.com/activate/'
                }
                this.actSendEmailWithToken(emailData).then((response) => {
                        if (response.status && response.status == 'ok') {
                        }
                    }, (error) => {
                        if (error && error.message) {
                            console.log('[paytmCampaignWoohoo | resetPassword | error ]', error);
                        }
                    }
                )
        },
        paytmLogin(email_id) {
            var request_body_login = {
                "username": email_id
            };
            let timestamp = this.getTimestamp();

            var homeDomain = undefined;
            if (localStorage.getItem('homeDomain')) {
                homeDomain = localStorage.getItem('homeDomain');
            }
            let loginSignHeader = this.getSignedHeaders(request_body_login,timestamp,homeDomain);
            let headers_login = {
                "headerData" : loginSignHeader,
                "timestamp" : timestamp,
                "data" : request_body_login
            }
            this.actPaytmLogin(headers_login).then((response) => {
                this.paytmSaveLocal(response);
            },
            (error) => {
            });
        },
        loginEventTriger() {
            if(mobileAnalyticsClient) {
                var loginEventAttributeObj = this.getAWSMACommonAttributes();
                loginEventAttributeObj.event_mode  = 'syndication-email';
                loginEventAttributeObj.partner_id = this.$route && this.$route.query && this.$route.query.partner ? this.$route.query.partner : null;
                loginEventAttributeObj.user_state = localStorage.getItem("user_state") ? localStorage.getItem("user_state") : null;
                loginEventAttributeObj.user_mobile = localStorage.getItem("user_mobile") ? localStorage.getItem("user_mobile") : null;
                window.mobileAnalyticsClient.recordEvent('_user.login', loginEventAttributeObj, {});
            }

              // GTM *****************
                 var platformDetails = undefined;
                try {
                    platformDetails = this.altDetectPlatform();
                } catch(err) {}

                 var altGeoData = undefined;
                if (localStorage.getItem('altGeoData')) {
                    altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
                }

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
                    'gtl_device_timestamp': new Date().getTime(),
                    'gtl_user_id': localStorage.getItem('account_id') ? localStorage.getItem('account_id') : ''
                });

            // GTM   ***************
        },
        paytmSaveLocal(response) {
            let account = response.account;
            let profile = response.account.profile;
            let altUser = {
                sessionToken: (response.session_token) ? response.session_token : '',
                dateCreated: (account.date_created) ? account.date_created : '',
                email: (account.email) ? account.email : '',
                accountId: (account.id) ? account.id : '',
                isAdmin: (account.is_admin) ? account.is_admin : '',
                login: (account.login) ? account.login : '',
                username: (profile.username) ? profile.username : '',
                profileId: (profile.id) ? profile.id : '',
            }
            this.altUser = altUser;

            localStorage.setItem('token', response.session_token);
            localStorage.setItem('user_email', response.account.email);
            localStorage.setItem('account_id', response.account.id);
            localStorage.setItem('altUser', JSON.stringify(altUser));

            let altDeviceId = undefined;
            let timestamp = this.getTimestamp();
            if (localStorage.getItem('altDeviceId')) {
                altDeviceId = localStorage.getItem('altDeviceId');
            }
            if (!(altDeviceId)) {
                altDeviceId = this.generateRandomId(32);
                localStorage.setItem('altDeviceId',altDeviceId);
            }

            this.registerDevice({user: altUser, deviceId : altDeviceId,date : timestamp});
            this.registerProfile(altUser);

            // NOTE added login Event

            this.loginEventTriger();
        },
        registerProfile(altUser) {
            this.actGetAccountDetails(altUser).then((response) => {
                var altAccount = undefined;
                altAccount = {
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
                localStorage.setItem('altAccount',JSON.stringify(altAccount));
            },
            (error) => {

            });
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
            localStorage.setItem('altDevice', JSON.stringify(altDevice));
            // this.paytmOrderCreation();

            this.$router.push({ name: 'paymentPage' });
        },
        clearRegisterDevice(devices) {
            var deviceId = undefined;
            for(deviceId in devices) {

                let deviceData = {"user" : this.altUser,"deviceId" : devices[deviceId].id};

                this.actPaytmDeleteDevice(deviceData).then((response) => {
                    var altDeviceId = undefined;
                    var timestamp = this.getTimestamp();
                    if (localStorage.getItem('altDeviceId')) {
                        altDeviceId = localStorage.getItem('altDeviceId');
                    }
                    if (!(altDeviceId)) {
                        altDeviceId = this.generateRandomId(32);
                        localStorage.setItem('altDeviceId',altDeviceId);
                    }
                    this.registerDevice({ user: this.altUser, deviceId: altDeviceId,date:timestamp});

                },(error) => {
                    return;
                });
                break;
            }

        },
        getRegisterDevice() {
            this.actPaytmGetDeviceList(this.altUser).then((response) => {
                //  // console.log("paytmCampaignLogin|getRegisterDevice|success",response);
                this.clearRegisterDevice(response.devices);
            },(error) => {
                // console.log("paytmCampaignLogin|getRegisterDevice|error",error);
            });
        },
        registrationDevice(deviceId) {
            // console.log('[App.vue | registrationDevice | deviceId| ]', deviceId);
            this.actPaytmRegisterDevice(deviceId).then((response) => {
                if (response) {
                    this.saveDevice(response);
                }
            }, (error) => {
                if ( error && error.code == 400) {
                    //    // console.log("registrationDevice|error|400|removeAll Device");
                    this.getRegisterDevice();
                }
                if(error && error.code == 409) {
                    this.getRegisterDevice();
                }
            });
        },
        registerDevice(deviceId) {
            // console.log("device");
            this.actPaytmGetDeviceList(deviceId.user).then((response) => {
                if (response.count) {
                    var devices = response.devices;
                    var altDeviceId = localStorage.getItem("altDeviceId") ? localStorage.getItem("altDeviceId") : "";
                    var matchedDevice = devices.filter((device) => {
                        return device.uuid == altDeviceId;
                    });

                    if (matchedDevice && matchedDevice.length) {
                        var deviceObj = matchedDevice[0];
                        this.saveDevice(deviceObj);
                    } else {
                        altDeviceId = this.generateRandomId(32);
                        localStorage.setItem('altDeviceId',altDeviceId);
                        deviceId.deviceId = altDeviceId ;
                        this.registrationDevice(deviceId);
                    }

                } else {
                    altDeviceId = this.generateRandomId(32);
                    localStorage.setItem('altDeviceId',altDeviceId);
                    deviceId.deviceId = altDeviceId ;
                    this.registrationDevice(deviceId);
                }
            },
            (error) => {
            });
        },

        setSubscriptionHeader() {
            this.setHeaderTitle('');
            this.toggleSearchIco(false);
            this.toggleCloseIco(false);
            this.toggleDeleteIco(false);
            this.toggleMenuIco(false);
          

        },
        loginFormValid() {
          if (this.validateEmail()) {
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
        pageViewEvent() {
          // console.log('[pageViewEvent]');

            if (window.mobileAnalyticsClient) {
              let pageSelectAttributes = this.getAWSMACommonAttributes();
              pageSelectAttributes.page_title = "campaign";
              pageSelectAttributes.page_url = window.location.href;
              pageSelectAttributes.partner_id = this.$route && this.$route.query && this.$route.query.partner ? this.$route.query.partner : null;

               console.log('[pageViewEvent > pageSelectAttributes]', pageSelectAttributes);
              window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
            }

             window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'gt_page_view',
                'eventAction': 'page view',
                'eventCategory': 'gt_page_view',
                'eventLabel': 'page view',
                'eventValue': 1,
                'gtl_page_title': 'campaign',
                'gtl_content_parent_title': '',
                'gtl_episode_title': ''
            });

        },
        gatewayFilter(partners) {
          let data = partners.filter(function(partner) {
            return partner.enabled == "true";
          });
          return data;
        },
        partnerDetailsFromConfig() {
          let altConfig = undefined;
          let partners = undefined;
          let placeholder = undefined;
          if(localStorage.getItem("CallCounter")) {
              localStorage.setItem("CallCounter",2);
          }

          altConfig = localStorage.getItem('altConfig') ? JSON.parse(localStorage.getItem('altConfig')) :undefined

          // debugger;
          if(altConfig && altConfig.campaign && altConfig.campaign.partners && altConfig.campaign.messages) {

              this.fbLoginComponent = () => import(/*webpackChunkName: "login-fb-for-use" */ '../login/LoginMisc.vue');

            this.altConfigPromo = altConfig.campaign.messages;
            // console.log("altConfigPromo",this.altConfigPromo);
       
            if(document.getElementById("email_text")) {
              document.getElementById("email_text").placeholder = this.altConfigPromo.emailBoxText ? this.altConfigPromo.emailBoxText : "" ;
            }
            partners = altConfig.campaign.partners;
            this.partnerDetails = this.gatewayFilter(partners);
            if(this.partnerDetails && this.partnerDetails.length == 0) {
                this.toggleMenuIco(true);
                this.toggleLoader(false);

              this.$router.push({ name: 'home' });
            } else {
               // console.log("this.partnerDetails",this.partnerDetails)

             //  // console.log("this.$route.params.partner ",this.$route);
             var matchedData = false;
             for(let index in this.partnerDetails) {
                 if(this.partnerDetails[index].name == this.$route.query.partner) {
                   
                     matchedData = true;
                     this.partnerDetails = this.partnerDetails[index];
                     localStorage.setItem("partner_id",this.partnerDetails.name);
                     localStorage.setItem("selectedGateway",JSON.stringify(this.partnerDetails));
                     this.toggleLoader(false);
                     break;
                 }
             }
             if(!matchedData) {
                 this.toggleMenuIco(true);
                 this.$router.push({ name: 'home' });
             }
            }
          } else {
              let _this = this;
              if(localStorage.getItem('CallCounter') == 2) {
                  this.toggleMenuIco(true);
                  this.$router.push({ name: 'home' });
              } else {
                  setTimeout(()=> {
                      _this.partnerDetailsFromConfig();
                      localStorage.setItem("CallCounter",1);
                  },5000);
              }
          }
        },
    },
    created() {
        this.toggleLoader(true);
        this.setSubscriptionHeader();
          this.partnerDetailsFromConfig();

            eventBus.$on('closeClearDevicesEvent', () => {
            this.isActiveFbDel = false;
        });
        eventBus.$on('showClearDevicesEvent', () => {
            this.isActiveFbDel = true;
        });
    },
    mounted() {
        console.log("test campaign");
        
        this.projectCheckedRemove();
      
        localStorage.setItem("isCampaign", true);
        localStorage.setItem("campaign-redirect",true);
        localStorage.removeItem('orderList');

         document.getElementsByClassName('app-bar')[0].style.display = "none"
         
        this.setSubscriptionHeader();
        this.partnerDetailsFromConfig();

        let _this = this;
        // setTimeout(function() {
        //     
        //     _this.pageViewEvent()
        // },3000);

        window.addEventListener("orientationchange", function() {
         let paytm_footer = document.getElementById('paytm-footer');
         if(paytm_footer) {
             // console.log(window.screen.orientation.type);
             if (window.screen.orientation.type == 'landscape-primary') {
                 paytm_footer.style.position = "relative";
             } else {
                 paytm_footer.style.position = "absolute";
             }
         }
     }, false);

    },
    mixins: [altMixins]
}
</script>
