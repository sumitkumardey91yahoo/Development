<template>
  <div class="ch-kids-pass alt-popup-bg dark-bg" id="ch-kids-pass">
    <div class="pin-screen-header">
      <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="closeKidsPasscode">
      <div class="clearfix"></div>
    </div>
    <div class="popup-box">
      <div class="pin-screen-box">
        <div v-if="firstPin">
          <p>Reset your Kids PIN</p>
          <div class="pin-control-box">
            <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." v-model="firstPinValue" @keyup="validateFirstPin">
          </div>
        </div>
        <div v-else>
          <p>CONFIRM PIN</p>
          <div class="pin-control-box">
            <input type="tel" size="4" maxlength="4" class="pin-control" placeholder="...." v-model="confirmPinValue" @keyup="validateConfirmPin">
          </div>
        </div>
        <p v-show="pinError" class="pin-error">{{pinErrorMessage}}</p>
        <p v-show="invaildPin" class="pin-error">{{invaildPin}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      pinError: false,
      pinErrorMessage: '',
      firstPin: true,
      firstPinValue: '',
      confirmPinValue: '',
      invaildPin:false,
    };
  },
  computed: {
    ...mapGetters([
      'userProfile',
      'accountOrders',
    ]),
  },
  methods: {
    ...mapActions([
    'actEditAccount',
    ]),
    closeKidsPasscode() {
      this.firstPinValue = '';
      this.confirmPinValue = '';
      eventBus.$emit('closeKidsPasscodeEvent', false);
    },
    validateFirstPin(event) {
      if (event.target.value.length == 4) {
        // console.log('[ChangePasscode | validateFirstPin | value | ]', event.target.value);
        // console.log('[ChangePasscode | validateFirstPin | firstPinValue | ]', this.firstPinValue);
        this.firstPin = false;
      }
    },
    validateConfirmPin(event) {
      if (event.target.value.length == 4) {
        // console.log('[ChangePasscode | validateFirstPin | confirmPinValue | ]', this.confirmPinValue);

        if (this.firstPinValue == this.confirmPinValue) {
          this.toggleLoader(true);

          var accountEditData = {
            marketingConsent: false,
            pin: this.firstPinValue,
            details: {},
          };
          if (this.userProfile) {
            accountEditData.Profile_Id = this.userProfile.id;
          }
          if (this.accountOrders && this.accountOrders.length) {
            accountEditData.Account_Id = this.accountOrders[0].account;
          }

          this.actEditAccount(accountEditData).then(
          (response) => {
            // console.log('[ChangePasscode | validateConfirmPin | response | ]', response);

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
              if (response.status && response.status == 'ok') {
                eventBus.$emit('closeKidsPasscodeEvent');
                this.toggleLoader(false);

                var eventAttributeObj = {};
                var altConfig = JSON.parse(localStorage.getItem('altConfig'));
                var geo_location = undefined;
                if (localStorage.getItem('geo_location')) {
                  geo_location = JSON.parse(localStorage.getItem('geo_location'));
                  eventAttributeObj = geo_location;
                }
                eventAttributeObj.user_email = localStorage.getItem('user_email');
                eventAttributeObj.app_env = altConfig.environment.title;
                eventAttributeObj.marketingConsent = false;
                eventAttributeObj.pin = this.firstPinValue;
                eventAttributeObj.profile_id = this.userProfile ? this.userProfile.id : '';
                eventAttributeObj.account_id = this.accountOrders[0].account;
                window.mobileAnalyticsClient.recordEvent( '_user.update_passcode', eventAttributeObj, {});
              }

            }
            // End of AWS Mobile SDK Events
          },
          (error) => {
            // console.log('[ChangePasscode | validateConfirmPin | error | ]', error);

            // NOTE commented by sumit for remove popup 15..0.2018
            //this.toggleAltPopup(true, error.message);
            this.invaildPin = error.message;
            this.pinError = false;
            this.toggleLoader(false);

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
              var eventAttributeObj = {};
              var altConfig = JSON.parse(localStorage.getItem('altConfig'));
              if (geo_location) {
                geo_location = JSON.parse(geo_location);
                eventAttributeObj = geo_location;
              }
              eventAttributeObj.app_env = altConfig.environment.title;
              eventAttributeObj.event_action = 'error';
              eventAttributeObj.event_message = error.message;
              eventAttributeObj.event_code = error.code.toString();
              window.mobileAnalyticsClient.recordEvent( '_user.update_passcode', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events
          }
          );
        } else {
          this.pinErrorMessage = 'Incorrect PIN';
          this.invaildPin = false;
          this.pinError = true;
        }
      }
    },
  },
  created() {
    // console.log('[ChangePasscode | created | ]');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var app = document.getElementById('app');
    if (app) app.style.position = 'fixed';
  },
  beforeDestroy() {
    // console.log('[ChangePasscode | beforeDestroy | ]');

    var app = document.getElementById('app');
    if (app) app.style.position = 'relative';
  },
  mixins: [altMixins]
}
</script>
