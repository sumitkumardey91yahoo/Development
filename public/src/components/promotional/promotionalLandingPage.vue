
<template lang="html">
    <div class="promotional-campaign-container" style="background-image: url('');">
        <div class="promotional-campaign-header" style="margin-bottom: 0px;    margin-top: 12px;">
                <img :src="partnerDetails.promoBanner" v-if="partnerDetails && partnerDetails.promoBanner" alt="campaign-header">
        </div>
        <clear-device v-if="isActiveFbDel"></clear-device>
        <div class="promotional-campaign-body">
            <p class="promotional-header" v-if="partnerDetails && partnerDetails.offerText" style=" font-size: 15px;">{{partnerDetails.offerText}}</p>
            <form autocomplete="off">
                <div class="form-group">
                    <input type="email" name="email" id="email_text" placeholder="" class="form-control promotional-campaign-input"  v-model="email">
                    <p v-if="emailError">{{emailError}}</p>
                </div>

                <div class="form-group">
                    <input type="text" name="text" id="voucher_text" placeholder="Enter Voucher" class="form-control promotional-campaign-input" v-model="voucherCode" @keyup="voucherCodeUpdate()" @blur="voucherCodeUpdate()">
                    <p v-if="voucherError">{{voucherError}}</p>
                </div>

                <input type="submit" class="grad-btn submit-btn btn" style="margin-top: 20px;" id="textEmail" @click.prevent="promotionalValidation"  v-if=" altConfigPromo && altConfigPromo.submitButtonText" v-model="altConfigPromo.submitButtonText">
            </form>
            <a href="" id="paytmLinkId"></a>
        </div>
        <div class="promotional-campaign-footer" id="promotional-footer" style="position:absolute">
            <component :is="fbLoginComponent" v-if ="fbLoginComponent" :isCampaignPage="true"></component>
            <div style="margin-bottom: 12px;margin-top: 61px;">
                    <p class="text-center" >By signing in, you agree to the <router-link :to="{ name: 'toc' }" class="link-under">Terms of Use</router-link> & <router-link :to="{ name: 'privacyPolicy' }" class="link-under">Privacy Policy</router-link>.</p>
            </div>
        </div>
    </div>

</template>

<style scoped>
      .promotional-alt-logo {
        width: 100px;
        margin: 60px;
      }
      .promotional-campaign-container {
      position: fixed;
      width: 100%;
      height: 100%;
      background-image: url(https://static.cloud.altbalaji.com/img/about_banner.png);
      background-size: cover;
      /* background-position: 50%; */
      overflow-y: scroll;
      margin-top: -12px;
    }
    .promotional-campaign-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .promotional-campaign-body {
      text-align: center;
      width: 80%;
      min-width: 300px;
      display: block;
      margin: auto;
    }
    .alt-smpl-head {
      text-align: center;
      padding: 28px 0;
    }
    .promotional-campaign-width {
      width:85px;
      margin-top: 30px;
    }
    .promotional-campaign-footer {
      width: 90%;
      min-width: 300px;
      position: fixed;
      left: 14px;
      right: 0px;
      height: 50px;
      margin-bottom: 0px;
      text-align: center;
    }
    .promotional-campaign-input {
        font-size: 15px;   
        height: 32px; 
        background-color: #636363;
    }

    .promotional-campaign-input::-webkit-input-placeholder {
      text-align: center;
      color: #aaaaaa;
    }

    .promotional-campaign-input:-moz-placeholder { /* Firefox 18- */
      text-align: center;
     color: #aaaaaa;
    }

    .promotional-campaign-input::-moz-placeholder {  /* Firefox 19+ */
      text-align: center;
       color: #aaaaaa;
    }

    .promotional-campaign-input:-ms-input-placeholder {
      text-align: center;
      color: #aaaaaa;
    }

    .promotional-woohoo-page-button {
      position: absolute;
      bottom: 10px;
      left: 10px;
      width: 95%;
      height: 45px;
    }
    .promotional-failour-page-logo {
      width: 20%;
      padding-top: 20px;
      display: block;
      margin: auto;
      padding-bottom: 10px;
    }
    .promotional-subs-container {
      background-color: #2D2D2D;
      height: 167px;
    }
    .promotional-header {
      margin-bottom: 33px;
      text-transform: initial;
      font-size: 18px;
    }
</style>


<script>
 import  { syndication } from '../../store/syndication'; 
 console.log(syndication);
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
            isActiveFbDel: undefined,
            voucherError: undefined,
            txtVoucher: undefined,
            syndicationUrl: undefined,
            expiredDate: undefined,
            parent_order_id_product: undefined,
            voucherCode: undefined
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
        'actPaytmGetDeviceList',
        'actPaytmDeleteDevice',
        'actPaytmRegisterDevice',
        'actPaytmHasCodeFeatures',
        'actGetAccountDetails',
        'actCreateOrder',
        'actProductDetails',
        'actSendEmailWithToken',
        'actGetOrders'
        ]),
        voucherCodeUpdate() {
            console.log("this.voucherCode", this.voucherCode);
            console.log(document.getElementById('voucher_text').value)
            if(document.getElementById('voucher_text')) {
            localStorage.setItem("promotional-voucher", document.getElementById('voucher_text').value);
            }
        },
        promotionalValidation() {
            var email_id = undefined;
            email_id = this.email;
            if(this.loginFormValid(email_id)) {
                this.toggleLoader(true);
                this.promotionalSignup(email_id);
                this.setUserEmailCampaign(email_id);
                console.log(this.userEmailCampaign);
            }

        },
        goToSign() {
            this.toggleDeleteIco(false);
            this.toggleMenuIco(true);
            this.clearUserData();
            localStorage.setItem("promotional-redirect",true);
            let partner_id = this.$route && this.$route.query && this.$route.query.partner ? this.$route.query.partner : null;
            localStorage.setItem("partner_id", partner_id);

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
        },
        promotionalSignup(email_id) {
            let request_body_signup = {
                   "login": email_id
               }
               // NOTE if call any syndication api ,then partner id ,we need to pass.
            

            let timestamp = this.getTimestamp();
            var homeDomain = undefined;
            if (localStorage.getItem('homeDomain')) {
                homeDomain = localStorage.getItem('homeDomain');
            }
            let signupHeader = this.getSignedHeaders(request_body_signup,timestamp,homeDomain);
            let headers_signup = {
                "headerData":signupHeader,
                'timestamp' : timestamp,
                'data' : request_body_signup,
                'syndication': this.syndicationUrl
            }

            syndication.actSyndicationSignup(headers_signup).then((response) => {
                // console.log("paytmCampaignLogin.vue | promotionalSignup | res",response);
                if(response && response.status == "ok") {
                  localStorage.setItem('ixigo-pin', true);
                    localStorage.removeItem('altOrder');
                    this.signupAnalytics(response);
                    this.promotionalLogin(email_id);
                }
            },
            (error) => {
                this.toggleDeleteIco(false);
                this.toggleMenuIco(true);

                // console.log("paytmCampaignLogin.vue | promotionalSignup | error",error);
                if(error && error.code == 409) {
                    let altUser = undefined;
                    let altOrder = undefined;
                    this.toggleLoader(false);

                    var altUser = localStorage.getItem('altUser') ? JSON.parse(localStorage.getItem('altUser')) : false;
                    
                     let  routerObj = {
                        name: 'promotionalWoohooPage',
                        query: {
                        partner: this.$route.query.partner
                        }
                    };
                    if (altUser) {
                        altOrder = localStorage.getItem('altOrder') ? JSON.parse(localStorage.getItem('altOrder')) : undefined;
                        if(altUser.email == email_id) {
                              this.$router.push(routerObj);
                        } else {
                            this.clearUserData();
                            localStorage.setItem("promotional-redirect",true);

                            let partner_id = this.$route && this.$route.query && this.$route.query.partner ? this.$route.query.partner : null;
                              localStorage.setItem("partner_id", partner_id);
                              
                            this.$router.push({ name: 'login' });
                        }

                    } else {
                        localStorage.setItem("promotional-redirect",true);;
                        this.$router.push({ name: 'login' });
                    }
                }
            });
        },
         getOrder() {
      // console.log('[Subscribe | getOrder | ]');
         let altUser= JSON.parse(localStorage.getItem('altUser'));
        this.actGetOrders(altUser).then((response) => {
            if (response.count && response.orders) {
            this.expiredDate = response.orders[0].dates.valid_to;
            this.parent_order_id_product = response.orders[0].id;

            } 
        }, (error) => {
            // console.log(error);
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
        promotionalLogin(email_id) {
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
                "data" : request_body_login,
                 'syndication': this.syndicationUrl
            }
            syndication.actSyndicationLogin(headers_login).then((response) => {
                this.paytmSaveLocal(response);
                this.webenageReg(response.account.id);
            },
            (error) => {
            });
        },
        webengageLoginAttribute(accountIdWebenage) {
            var altAccountWebenage = JSON.parse(localStorage.getItem("altAccount"));
            var altUserWebenage = JSON.parse(localStorage.getItem("altUser"));
            var jsonWebengage = {
                "we_first_name" :  "N.A",
                "we_hashed_email" : accountIdWebenage ? accountIdWebenage : "N.A",
                "we_gender" : "male",
                'we_hashed_phone' : accountIdWebenage ? accountIdWebenage : "N.A",
                'we_birth_date' :  "1986-08-19",
                'we_email_opt_in' : true,
                'we_sms_opt_in' : true
            };
            webengage.user.setAttribute(jsonWebengage);
        },
        webenageReg(accountId) {
          
            if (accountId) {
                if (webengage && webengage.user) {
                    webengage.user.login(accountId);
                    this.webengageLoginAttribute(accountId);
                }
            }

            var altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
            var platformDetails = this.altDetectPlatform();
            
            this.webenageSignup();

            let loginPayload = {
                    'gt_platform':platformDetails.os + " " + platformDetails.osVersion ,
                    'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                    'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                    'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
                    'gt_device_timestamp': new Date()
                };

            if (webengage) {
                webengage.track('gt_login' , loginPayload);
                console.log("gt_login", loginPayload);
            }
        },
        webenageSignup() {
            var altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
            var platformDetails = this.altDetectPlatform();
            let signupPayload = {
                'gt_platform':platformDetails.os + " " + platformDetails.osVersion ,
                'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
                'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
                'gt_device_timestamp': new Date()
            };
        // NOTE webenage code track  added by sumit
            if(webengage) {
                webengage.track('gt_complete_registration', signupPayload);
                console.log('gt_complete_registration', signupPayload);
            }
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
           let  routerObj = {
                name: 'promotionalWoohooPage',
                query: {
                partner: this.$route.query.partner
                }
            };
            this.$router.push(routerObj);
            
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
          if (this.validateEmail() && this.validatedVoucher()) {
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
        validatedVoucher() {
            if (!(this.voucherCode.trim())) {
                this.voucherError = 'Enter your voucher code here';
                return false;
            }
            return true;
        },
        pageViewWebenage(title) {
            let pageViewData = {};
            pageViewData = {
                'gt_page_title' : title
            };

            if (webengage) {
                webengage.track('gt_page_view', pageViewData);
                console.log('gt_page_view', pageViewData)
            }
        },
        pageViewEvent() {
          // console.log('[pageViewEvent]');
          

            if (window.mobileAnalyticsClient) {
              let pageSelectAttributes = this.getAWSMACommonAttributes();
              pageSelectAttributes.page_title = "campaign-home";
              pageSelectAttributes.page_url = window.location.href;
              pageSelectAttributes.partner_id = this.$route && this.$route.query && this.$route.query.partner ? this.$route.query.partner : null;

              // console.log('[pageViewEvent > pageSelectAttributes]', pageSelectAttributes);

              window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
            }
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

          altConfig = localStorage.getItem('altConfig') ? JSON.parse(localStorage.getItem('altConfig')) :undefined;
        

          if(altConfig && altConfig.campaign && altConfig.campaign.partners && altConfig.campaign.messages) {

              this.syndicationUrl = altConfig.campaign.environment.syndicationURL;

              this.fbLoginComponent = () => import(/*webpackChunkName: "login-fb-for-use" */ '../login/LoginMisc.vue');

            this.altConfigPromo = altConfig.campaign.messages;
             console.log("altConfigPromo",this.altConfigPromo);
       
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
                     localStorage.setItem("partner_id", this.partnerDetails.name);
                     localStorage.setItem("selectedPromotional", JSON.stringify(this.partnerDetails));
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
        eventBus.$on('closeClearDevicesEvent', () => {
            this.isActiveFbDel = false;
        });
        eventBus.$on('showClearDevicesEvent', () => {
            this.isActiveFbDel = true;
        });
    },
    mounted() {
        this.projectCheckedRemove();
        console.log("test promotional");
       
        this.pageViewWebenage("campaign-home");

    

        this.voucherCode = (this.$route.query && this.$route.query.voucher) ? this.$route.query.voucher : '';
        this.email = (this.$route.query && this.$route.query.email) ? this.$route.query.email : '';

        
        console.log("this.$router.query ", this.$route.query)

        localStorage.setItem("promotional-voucher", this.voucherCode.trim());
        
        localStorage.setItem("promotional-redirect",true);
        document.getElementsByClassName('app-bar')[0].style.display = "none";

         localStorage.removeItem('orderList');
         
        this.setSubscriptionHeader();
        this.partnerDetailsFromConfig();

        window.addEventListener("orientationchange", function() {
         let paytm_footer = document.getElementById('promotional-footer');
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
