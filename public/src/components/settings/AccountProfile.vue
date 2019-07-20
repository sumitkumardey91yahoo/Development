<template>
  <div class="acc-profile" v-if="userProfile">
    <div class="name mb-20">
      <div class="set-label">Name</div>
      <div class="set-value" v-if="userProfile">: {{userProfile.name}}</div>
    </div>
    <div class="pwd mb-20">
      <div class="set-label">Password</div>
      <div class="set-value">: *********</div>
    </div>
    <div class="mail mb-20">
      <div class="set-label">Email</div>
      <div class="set-value" v-if="userProfile && userProfile.login">: {{userProfile.login}}</div>
    </div>
    <div class="set-gender mb-20">
      <div class="set-label">Gender</div>
      <div class="set-value" v-if="userProfile && userProfile.details && userProfile.details.gender">: {{userProfile.details.gender.toUpperCase()}}</div>
      <div class="set-value" v-else>:</div>
    </div>
    <div class="set-dob mb-20">
      <div class="set-label">Date of Birth</div>
      <div class="set-value" v-if="dob">: {{dob}}</div>
      <div class="set-value" v-else>:</div>
    </div>
    <div class="set-dob mb-20">
      <div class="set-label">Mobile Number</div>
      <div class="set-value" v-if="userProfile && userProfile.phone_number && statusMobile">: {{userProfile.phone_number}}</div>
      <div class="set-value" v-else>:</div>

    </div>
    <div class="set-dob mb-20" v-if="currentDomain && currentDomain == 'IN'">
      <div class="set-label">State</div>
      <div class="set-value" v-if="userProfile && userProfile.details && userProfile.details.state">: {{userProfile.details.state}}</div>
      <div class="set-value" v-else>:</div>
    </div>
    <h6 class="setting-header">Purchases</h6>
    <nav class="top-menu"></nav>
    <div v-if="accountOrders">
      <div class="item-heading">
        <div class="item">Items</div>
        <div class="purchase">Purchase Date</div>
        <div class="exp">Expiry Date</div>
      </div>
      <div class="item-data" v-for="order in accountOrders">
        <div class="item-name" v-if="order.price">{{order.price.currency == 'INR' ? '₹' : '$' }}{{order.price.real_amount}} for {{order.product.titles.en}}</div>
        <div class="date-time" v-if="order.dates && order.dates.created">
          <div class="pur-date">{{displayDateFormat(order.dates.created)}}</div>
          <div class="pur-time">{{makeAM_PM(order.dates.created)}}</div>
        </div>
        <div class="date-time" v-if="order.dates && order.dates.valid_to">
          <div class="pur-date">{{displayDateFormat(order.dates.valid_to)}}</div>
          <div class="pur-time">{{makeAM_PM(order.dates.valid_to)}}</div>
        </div>

      </div>
      <div v-if="showSubsNowBtn" style="margin: inherit;text-align: center; margin-top: 15px;">
        <button class="btn grad-btn btn-subscribe"  @click="$router.push({ name: 'subscribe' })">SUBSCRIBE NOW</button>
      </div>
    </div>
    <div v-else class="text-center">
        <div v-if="subscribeMessageText">
          <p>You haven't subscribed yet!</p>
          <button class="btn grad-btn btn-subscribe" @click="$router.push({ name: 'subscribe' })">SUBSCRIBE NOW</button>
        </div>
    </div>

    <button type="button" class="btn grad-btn btn-sm renewal-button" v-if="renewCounter" @click="subscribePage();">Renew/Upgrade</button>

    <h6 class="setting-header">Settings</h6>
    <nav class="top-menu"></nav>
    <div class="setting-row" v-if="userProfile">
      <h6 class="verification-label" v-if="userProfile.email_verified">Email Verification <span class="text-green">Verified &#10004;</span></h6>
      <h6 class="verification-label" v-else>Email Verification<span class="text-red" @click="verifyEmail">Verify</span></h6>
    </div>
    <div class="setting-row">
      <p>Receive Emails</p>
      <div class="toggle-settings">
        <input type="checkbox" id="receive" class="cbx hidden" @click="emailVerifiedCheck" :checked="checkFlag">
        <label for="receive" class="lbl"></label>
      </div>
    </div>
  </div>
</template>

<script>
  import { eventBus } from '../../main';
  import { altMixins } from '../../mixins'
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  export default {
    data() {
      return {
        selectedState: undefined,
        dob: undefined,
        showChngKidsPassCode: false,
        geoData: undefined,
        showSubsNowBtn: false,
        altUser: undefined,
        altOrder: undefined,
        checkFlag :false,
        checkNotification: "on",
        currentDomain: undefined,
        statusMobile: undefined,
        renewCounter: false,
        altConfig:undefined,
        regionalLanguageFilter:'NONE',
        selectedLanguage: undefined,
        regionLanguageCheck: false,
        subscribeMessageText: false,
      };
    },
    computed: {
      ...mapGetters([
        'appActive',
        'domain',
        'userProfile',
        'accountOrders',
      ]),
    },
    watch: {
      appActive() {
        this.initAccountProfile();
      },
      userProfile(profile) {
        if (profile && profile.details && profile.details.birthday) {
          this.dob = profile.details.birthday.split('-');

          let year = parseInt(this.dob[2]);
          if (isNaN(year)) {
            this.dob = '01-01-1947';
            return;
          }

          var dateBirth = null;

          if(this.dob[0].length == 4) {
            dateBirth=this.dob[2] + "-" + this.dob[1] + "-" + this.dob[0];
          } else {
            dateBirth=this.dob[0] + "-" + this.dob[1] + "-" + this.dob[2];
          }

          this.dob = dateBirth ? dateBirth : '';
        }
      }
    },
    methods: {
      ...mapMutations([
        'setUserProfile',
        'setAccountOrders',
        'setAltProfiles'
      ]),
      ...mapActions([
        'actGetAccountInfo',
        'actGetOrders',
        'actGetVerifyEmail',
        'actCheckWithAccount',
        'actGetUpdateUser',
        'actAccountEdit',
      ]),
      // NOTE: Coded by Sumit.
      // (Objective) Notification toggle
      displayDateFormat(CurrentDate) {
         let dateObj = new Date(CurrentDate.split('+')[0]);

          let month = dateObj.getUTCMonth(); //months from 1-12
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          // console.log("year",year)
             return (day+"/"+this.monthDateText(month)+"/"+year);
      },
       monthDateText(month) {
            var monthArray = new Array();
            monthArray=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
            return monthArray[month];
        },
      notificationCheck () {
        if(document.getElementById("notification").checked) {
          localStorage.setItem('notificationFlag',"on");
          eventBus.$emit('headerHideNotificationNumber', true);

        } else {
          localStorage.setItem('notificationFlag',"off");
          //NOTE hide count number
          eventBus.$emit('headerHideNotificationNumber', false);
        }
      },
      makeAM_PM(timeString) {
        console.log(timeString)
         let date = new Date(timeString.split('+')[0]);
           var hours = date.getHours();
              var minutes = date.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes + ' ' + ampm;
              return strTime;
         //return (h + M +" "+ampm);
      },
      toggleLangugePrefPopup() {
        eventBus.$emit('toggleLanguagePrefRegisterdEvent', true);
      },
      emailVerifiedCheck () {
        var altAccount = JSON.parse(localStorage.getItem('altAccount'));
        if (document.getElementById("receive").checked) {
          var profileData = {
            marketing_consent: true,
            Account_Id : localStorage.getItem('account_id'),
            Profile_Id : altAccount.profile.id,
          }
        } else {
          var profileData = {
            marketing_consent: false,
            Account_Id : localStorage.getItem('account_id'),
            Profile_Id : altAccount.profile.id,
          }
        }

        this.actAccountEdit(profileData).then((response) => {
          if (response.status && response.status == 'ok') {
          }
        }, (error) => {
          if (error.code == 400) {

          }
        });
      },
      initAccountProfile() {
        this.toggleLoader(true);

        this.subscribeMessageText = false;
        console.log("data -- setting");
        this.actGetAccountInfo().then((response) => {
          // Below code takes care of user's language preference
          // Check for regional language information in profile
          let extra = response.profile && response.profile.extra_details;

          // console.log('[AccountProfile -> initAccountProfile -> extra ]', extra);

          if (extra && ('regional_language' in extra)) {
            this.selectedLanguage = extra.regional_language;
            // If language selected is ''(empty string) then set the data -
            // property to 'None'(for displaying)
            if (this.selectedLanguage == '') this.selectedLanguage = 'None';
            this.saveLangToLocal(this.selectedLanguage, true);
          } else {
            // Set the selected language data property(for displaying)
            this.selectedLanguage = 'None';
            // Before setting anything to local storage, check for the local -
            // language preference data
            if (localStorage.getItem('pref_language_data')) {
              let pref_language_data = JSON.parse(localStorage.getItem('pref_language_data'))
              // Check whether the user already selected the language
              if (pref_language_data.selected) {
                this.saveLangToLocal('', true);
              }
            } else {
              this.saveLangToLocal('', false);
            }
          }

          if (response.phone_number) {
            var codeWithPhone = response.phone_number.split('-');
            if(codeWithPhone.length==2) {
              this.statusMobile=true;
            }
          }
          // NOTE: added sumit check checkbox status
          if(response.marketing_consent) {
            this.checkFlag=true;
          } else {
            this.checkFlag=false;
          }

          // console.log('[initAccountProfile > response]', response);

          this.setUserProfile(response);

          if (localStorage.getItem('geo_location')) {
            this.geoData = JSON.parse(localStorage.getItem('geo_location'));
          }
          var homeDomain = localStorage.getItem('homeDomain');
          this.currentDomain =localStorage.getItem('homeDomain');

          // added for hide  showStateSelector false 08.12
          if (this.geoData && this.geoData.geo_country == 'India' && !(response.details.state) && homeDomain == 'IN') {
            this.showStateSelector = false;
          }

          this.getOrders();
        }, (error) => {
          if (error.code == 404 && error.message == 'The account could not be found') {
            var domainToSet = localStorage.getItem('homeDomain') == 'IN' ? 'row' : 'IN';
            localStorage.setItem('homeDomain', domainToSet);
            this.initAccountProfile();
            return false;
          }

          if (error.code == 401) {
            /**
            * delete localStorage data
            */
            localStorage.removeItem('altUser');
            localStorage.removeItem('altOrder');
            localStorage.removeItem('altDevice');
            localStorage.removeItem('altAccount');
            localStorage.removeItem('notifications');
            localStorage.removeItem('notificationsCount');
            // NOTE remove language
            localStorage.removeItem('Regional-language');
            this.$router.push({ name: 'home' });
            return false;
          }
        });

        if(localStorage.getItem('notificationFlag')) {
          if (localStorage.getItem('notificationFlag') == "on") {
            this.checkNotification=true;
          } else {
            this.checkNotification=false;
          }
        }
      },
      renewalButtonEnable(Exdate) {
        var today,someday,text;
        today = new Date();
        today.setDate(today.getUTCDate()+9); // before nine days button will come
        someday = new Date(Exdate);
        if (someday <= today) {
          this.renewCounter=true;
        }
      },
      subscribePage() {
        window.location.replace(location.protocol + '//' + location.host + '/subscribe');
      },
      getOrders() {
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        this.actGetOrders(altUser).then((response) => {
          if (response.count) {
            this.setAccountOrders(response.orders);

            var activeSubsOrders = response.orders.filter((order) => {
              return order.product.recurring == true;
            });
            if (activeSubsOrders && activeSubsOrders.length) {
              var hasActivePlan = false;
              var activePlanIndex = 0;

              for (var i in activeSubsOrders) {
                var timeDiff = (new Date().getTime() - new Date(activeSubsOrders[i].dates.valid_to.split('+')[0]).getTime()) / (1000 * 3600 * 24);
                if (timeDiff < 0) {
                  hasActivePlan = true;
                  activePlanIndex = i;
                  break;
                }
              }

              if(hasActivePlan) {
                this.renewalButtonEnable(activeSubsOrders[activePlanIndex].dates.valid_to);
              }

              this.showSubsNowBtn = (hasActivePlan) ? false : true;
            } else {
              this.showSubsNowBtn = true;
            }
          } else {
            this.setAccountOrders(undefined);
          }

         this.toggleLoader(false);
          this.subscribeMessageText = true;
          this.getProfiles();
        }, (error) => {
          // console.log('[AccountProfile | getOrders | error | ]', error);
        });
      },
      getProfiles() {
        this.actCheckWithAccount(this.altUser).then((response) => {
          // console.log('[getProfiles > response]', response);

          this.setAltProfiles(response);
            this.toggleLoader(false);

          //added by SUMIT for hiding change kids mode passcode
          if (response.count > 1 && this.altOrder && this.altOrder.subscription && this.altOrder.subscription.hasOrder && this.altOrder.subscription.expired == false) {
            this.showChngKidsPassCode = true;
          } else {
            this.showChngKidsPassCode = false;
          }
        }, (error) => {
          // console.log('[AccountProfile | getProfiles | error ]', error);
        });
      },
      verifyEmail() {
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        this.actGetVerifyEmail().then((response) => {
          if (response.status && response.status == 'ok') {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.toggleAltPopup(true, 'You\'ve got mail!');
          } else {
            this.toggleAltPopup(true, 'Oops! Something error happened.');
          }
        }, (error) => {
          this.toggleAltPopup(true, 'Oops! Something error happened.');
        });
      },
      formatDate(date) {
        var formatedDate = this.formatIsoDate(date);

        var date = formatedDate.date.day + '/' + formatedDate.date.month + '/' + formatedDate.date.year;
        var time = formatedDate.time.hours + ':' + formatedDate.time.minutes;

        return { date, time };
      },
      regionalLanguageSelectedCB (language) {
        // Hide the loader, which is shown from Language popup
       

        // If language comes as 'None', set it as empty string
        if (language == '') language = 'None';

        // Set the selected language data property
        this.selectedLanguage = language;
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

      // Event emit handler from regional language select popup
      eventBus.$on('regionalLanguageSelectedEvent', this.regionalLanguageSelectedCB);

      //NOTE check for language selection option,should be there or not,

      this.setUserProfile(undefined);
      this.setAccountOrders(undefined);

      if (localStorage.getItem('altUser')) {
        this.altUser = JSON.parse(localStorage.getItem('altUser'));
      }
      if (localStorage.getItem('altOrder')) {
        this.altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      if (this.appActive) {
        this.initAccountProfile();
      }
    },
    mixins: [altMixins]
  }
</script>
